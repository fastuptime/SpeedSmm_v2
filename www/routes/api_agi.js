const md5 = require("md5");
const sha256 = require("sha256");
var axios = require('axios');
var FormData = require('form-data');
const fs = require('fs');
const moment = require('moment');
var axios = require('axios');

module.exports = function (app, hesap, siparis) {
    app.post("/api/v2", async (req, res) => {
        let gelen_data = req.body;
        console.log(gelen_data);
        if(!gelen_data.key) return res.json({ status: "error", message: "Lütfen keyi giriniz!" });
        let hesap_data = await hesap.findOne({ apiKey: gelen_data.key }) || "NaN";
        if(hesap_data === "NaN") return res.json({ status: "error", message: "Lütfen geçerli key giriniz!" });
        if(!gelen_data.action) return res.json({ status: "error", message: "Lütfen action giriniz!" });

        if(gelen_data.action === "services") {
            let services = fs.readFileSync("./services_yeni_api.json", "utf8");
            return res.json(JSON.parse(services));
        }
        if(gelen_data.action === "add") {
            if(!gelen_data.service) return res.json({ status: "error", message: "Lütfen service id (service) giriniz!" });
            if(!gelen_data.link) return res.json({ status: "error", message: "Lütfen link giriniz!" });
            if(!gelen_data.service_nickname) return res.json({ status: "error", message: "Lütfen service_nickname giriniz!" });
            if(!gelen_data.quantity) return res.json({ status: "error", message: "Lütfen miktar (quantity) giriniz!" });
            if(!gelen_data.link.includes("http")) return res.json({ status: "error", message: "Lütfen geçerli link giriniz!" });

            let servis = fs.readFileSync("./services_yeni.json", "utf8");
            //bul
            let servis_nickname = JSON.parse(servis).filter(x => x.takma_adi == gelen_data.service_nickname);
            if(servis_nickname.length === 0) return res.json({ status: "error", message: "Lütfen geçerli service_nickname giriniz!" });
            let servis_id = servis_nickname.filter(x => x.service == gelen_data.service)[0];
            if(!servis_id) return res.json({ status: "error", message: "Lütfen geçerli service id giriniz!" });
            if(Number(servis_id.max) < Number(gelen_data.quantity)) return res.json({ status: "error", message: "Siparis Max Miktarından Fazla!" });
            if(Number(servis_id.min) > Number(gelen_data.quantity)) return res.json({ status: "error", message: "Siparis Min Miktarından Az!" });
            ///Bakiye Yeterli mi?
            let fiyat = servis_id.rate;
            let urun_adi = servis_id.name;
            let bir_tanesi_fiyat = servis_id.rate / 1000;
            if(urun_adi.includes("Tek Paket")) fiyat = Number(servis_id.rate);
            else fiyat = Number(bir_tanesi_fiyat) * Number(gelen_data.quantity);
            /////////
            let miktarimiz_sayi = Number(gelen_data.quantity);
            let miktar_bin = Math.floor(miktarimiz_sayi / 1000);
            let net_kar = Number(miktar_bin) * Number(servis_id.aradaki_kar_miktari);
            if(Number(hesap_data.userBalance) < Number(fiyat)) return res.json({ status: "error", message: "Bakiye yetersiz!" });
            let yeni_bakiye = Number(hesap_data.userBalance) - Number(fiyat);
            ///Bakiye Yeterli mi?

            //Hesaptan para kesme ve siparişi verme yapılacak
            const bayiler = await fs.readFileSync("./servis_listes.json", "utf8");
            let bayiler_json = JSON.parse(bayiler);
            let bayi = bayiler_json.filter(x => x.kisaltmasi == gelen_data.service_nickname)[0];
            if(!bayi) return res.json({ status: "error", message: "Lütfen geçerli service_nickname giriniz!" });
            var data = new FormData();
            data.append('key', bayi.key);
            data.append('action', 'balance');
            var config = {
                method: 'post',
                url: bayi.url,
            headers: { 
                ...data.getHeaders()
            },
                data : data
            };
            let ana_bayi_bakiye = await axios(config).then(function (response) {
                return response.data.balance;
            });
            if(Number(ana_bayi_bakiye) < Number(fiyat)) return res.json({ status: "error", message: "Ana Bayi Bakiye yetersiz! Lütfen WebSitemizin Destek Ekibi İle İletişime Geçiniz Bakiye Yüklemesi İçin." });

            var data_siparis_ver = new FormData();
            data_siparis_ver.append('key', bayi.key);
            data_siparis_ver.append('action', 'add');
            data_siparis_ver.append('service', `${gelen_data.service}`);
            data_siparis_ver.append('link', `${gelen_data.link}`);
            data_siparis_ver.append('quantity', `${gelen_data.quantity}`);
            var config_siparis_ver = {
                method: 'post',
                url: bayi.url,
                headers: { 
                    ...data_siparis_ver.getHeaders()
                },
                data : data_siparis_ver
            };
            axios(config_siparis_ver).then(async function (response) {
                let yanit = JSON.stringify(response.data);
                if(yanit.includes("error")) return res.json({ status: "error", message: "Sipariş Verilemedi! Bir Hata Mevcut!" });
                let order_id = JSON.parse(yanit).order;
                if(!order_id) return res.json({ status: "error", message: "Sipariş Verilemedi! Order ID Geri Yanıt Olarak Alınamıyor!" });
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                await hesap.findOneAndUpdate({ _id: hesap_data._id }, { 
                    $inc: { 
                        userBalance: -fiyat
                    },
                    $push: { 
                        shoppingHistory: {
                            productID: gelen_data.service,
                            productName: servis_id.name,
                            databaseName: order_id || "bilinmiyor",
                        },
                    },
                    $set: {
                        harcananBalance: Number(hesap_data.harcananBalance) + Number(fiyat),
                    }
                });
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                let siparis_data = new siparis({
                    ownerID: hesap_data._id,
                    servisID: gelen_data.service,
                    servisName: servis_id.name,
                    orderID: order_id || "Bilinmiyor", //ORDER ID GİRİLECEK
                    link: gelen_data.link,
                    charge: fiyat, //Sipariş Tutarı
                    kar_net: net_kar, //Net Kar 
                    start_count: 0, //Sipariş Başlangıç Sayası
                    status: "Bekliyor..", //Sipariş Durumu 
                    remains: gelen_data.quantity, //Sipariş Kalan Sayısı
                    currency: "TRY", //Para Birimi
                    quantity: gelen_data.quantity, //Sipariş Adedi
                    bayi: gelen_data.service_nickname,
                    son_sorgu_tarihi: moment().format("YYYY-MM-DD HH:mm:ss"), //Son Sorgu Tarihi
                    tarih: moment().format("YYYY-MM-DD HH:mm:ss"), //Sipariş Tarihi
                });
                await siparis_data.save();
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                res.json({ status: "success", message: "Siparişiniz Başarıyla Alındı!", order: order_id });
            }).catch(function (e) {
                console.log(e);
            });
        }

        //Sipariş durumu kontrol etme yapılacak
        if(gelen_data.action === "balance") {
            return res.json({ status: "success", balance: hesap_data.userBalance, currency: "TRY" });
        }

        if(gelen_data.action === "status") {
            //order
            if(!gelen_data.order) return res.json({ status: "error", message: "Lütfen geçerli order id (order) giriniz!" });
            if(!gelen_data.service_nickname) return res.json({ status: "error", message: "Lütfen service_nickname giriniz!" });

            const bayiler = await fs.readFileSync("./servis_listes.json", "utf8");
            let bayiler_json = JSON.parse(bayiler);
            let bayi = bayiler_json.filter(x => x.kisaltmasi == gelen_data.service_nickname)[0];
            if(!bayi) return res.json({ status: "error", message: "Lütfen geçerli service_nickname giriniz!" });
            let siparis_data = await siparis.findOne({ orderID: gelen_data.order, ownerID: hesap_data._id });
            if(!siparis_data) return res.json({ status: "error", message: "Sipariş Bulunamadı!" });

            var data = new FormData();
            data.append('key', bayi.key);
            data.append('action', 'status');
            data.append('order', `${gelen_data.order}`);
            var config = {
                method: 'post',
                url: bayi.url,
                headers: { 
                    ...data.getHeaders()
                },
                data : data
            };

            axios(config).then(async function (response) {
                let yanit = JSON.stringify(response.data);
                if(yanit.includes("error")) return res.json({ status: "error", message: "Sipariş Durumu Alınamadı!" });
                let siparis_durumu = JSON.parse(yanit).status;
                if(!siparis_durumu) return res.json({ status: "error", message: "Sipariş Durumu Alınamadı!" });
                let charge = JSON.parse(yanit).charge;
                let start_count = JSON.parse(yanit).start_count;
                let status = JSON.parse(yanit).status;
                let remains = JSON.parse(yanit).remains;
                let son_sorgu_tarihi = moment().format("YYYY-MM-DD HH:mm:ss");
                await siparis.findOneAndUpdate({ orderID: gelen_data.order }, {
                    $set: {
                        start_count: start_count,
                        status: status,
                        remains: remains,
                        son_sorgu_tarihi: son_sorgu_tarihi,
                    }
                });
                res.json({ status: "success", message: "Sipariş Durumu Alındı!", order_status: status, charge: charge, start_count: start_count, remains: remains });
            }).catch(function (e) {
                console.log(e);
            });
        }
    });
};
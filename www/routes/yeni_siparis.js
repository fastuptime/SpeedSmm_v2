var axios = require('axios');
var FormData = require('form-data');
const fs = require('fs');
const moment = require('moment');
var axios = require('axios');
var FormData = require('form-data');
let config = require("../../config.js");

module.exports = function (app, checkAuth, checkBan, checkAuthAdmin, hesap, siparis, navbar, navbar_admin) {
    app.get("/new_order", checkAuth, checkBan, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        if(hesap_data === "NaN") return res.redirect("/dashboard");
        let liste = await fs.readFileSync("./services_yeni.json", "utf8");
        let listemiz = [];
        let liste_json = JSON.parse(liste);
        let bayiler = [];
        let bayi_ad = [];
        liste_json.forEach(element => {
            let name = element.name;
            if(name.length > 46) element.name = name.substring(0, 46) + "...";
            listemiz.push(element);
            if(!bayi_ad.includes(element.takma_adi)) {
                let bayi = {
                    urun_sayisi: liste_json.filter(x => x.takma_adi === element.takma_adi).length,
                    urunler: liste_json.filter(x => x.takma_adi === element.takma_adi),
                    name: element.takma_adi,
                };
                bayiler.push(bayi);
                bayi_ad.push(element.takma_adi);
            }
        });
        res.render("dashboard/pages/pages_dash/new_order.ejs", {
            account: hesap_data,
            bildirim: hesap_data.bildirim,
            toplam_siparis: hesap_data.shoppingHistory,
            liste: listemiz,
            urun_sayisi: liste_json.length,
            bayiler: bayiler,
            secim: 0,
            config,
            navbar,
        });
    });

    app.get("/new_order/:bayi", checkAuth, checkBan, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        if(hesap_data === "NaN") return res.redirect("/dashboard");
        let liste = await fs.readFileSync("./services_yeni.json", "utf8");
        let listemiz = [];
        let liste_json = JSON.parse(liste);
        let bayiler = [];
        let bayi_ad = [];
        liste_json.forEach(element => {
            let name = element.name;
            if(name.length > 46) element.name = name.substring(0, 46) + "...";
            listemiz.push(element);
            if(!bayi_ad.includes(element.takma_adi)) {
                let bayi = {
                    urun_sayisi: liste_json.filter(x => x.takma_adi === element.takma_adi).length,
                    urunler: liste_json.filter(x => x.takma_adi === element.takma_adi),
                    name: element.takma_adi,
                };
                bayiler.push(bayi);
                bayi_ad.push(element.takma_adi);
            }
        });
        res.render("dashboard/pages/new_order.ejs", {
            account: hesap_data,
            bildirim: hesap_data.bildirim,
            toplam_siparis: hesap_data.shoppingHistory,
            liste: listemiz.filter(x => x.takma_adi === req.params.bayi),
            urun_sayisi: liste_json.length,
            bayiler: bayiler,
            secim: 1,
            secili_bayi: req.params.bayi,
        });
    });

    app.post("/new_order", checkAuth, checkBan, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        if(hesap_data === "NaN") return res.redirect("/dashboard");
        let liste = await fs.readFileSync("./services_yeni.json", "utf8");
        let urunmuz = req.body.servis;
        let miktari = req.body.Miktar;
        let bayi = urunmuz.substring(0, urunmuz.indexOf("_"));
        let link = req.body.link;
        //urun ün _ dan önceki kısmını alıyoruz
        let urun_bayi = urunmuz.substring(0, urunmuz.indexOf("_"));
        //urun ün _ dan sonraki kısmını alıyoruz
        let urunID = urunmuz.substring(urunmuz.indexOf("_") + 1);
        //check link
        //check urunID
        let bayi_urunleri = JSON.parse(liste).filter(x => x.takma_adi == bayi);
        let urun = bayi_urunleri.filter(x => x.service == urunID)[0];
        if(!urun) return res.redirect("/new_order?error=true&error=urun&message=Ürün bulunamadı.");
        //check miktari
        if(Number(urun.min) > Number(miktari) || Number(urun.max) < Number(miktari)) return res.redirect("/new_order?error=true&error=miktar&message=Miktar hatalı.");
        //Ücreti bul
        let fiyat = urun.rate;
        let urun_adi = urun.name;
        let bir_tanesi_fiyat = urun.rate / 1000;
        if(urun_adi.includes("Tek Paket")) fiyat = Number(urun.rate);
        else fiyat = Number(bir_tanesi_fiyat) * Number(miktari);
        /////////
        let miktarimiz_sayi = Number(miktari);
        let miktar_bin = Math.floor(miktarimiz_sayi / 1000);
        let net_kar = Number(miktar_bin) * Number(urun.aradaki_kar_miktari);
        if(hesap_data.userBalance < fiyat) return res.redirect("/new_order?error=true&error=balance&message=Bakiye yetersiz.");
        /////////
        console.log(urun_bayi)
        if(urun_bayi === "du") {
            res.send("Bu servis şuanda kapalıdır.");
        } else {
            if(!link.includes("https://")) return res.redirect("/new_order?error=true&error=link&message=Link formatı hatalı.");
            if(!link.includes("http")) return res.redirect("/new_order?error=true&error=link&message=Link formatı hatalı.");
            if(Number(miktari) < 1000) return res.redirect("/new_order?error=true&error=miktar&message=En az Bin Tane Göndermeniz Gerekli.");
            const bayiler = await fs.readFileSync("./servis_listes.json", "utf8");
            let bayiler_json = JSON.parse(bayiler);
            let bayi = bayiler_json.filter(x => x.kisaltmasi == urun_bayi)[0];
            if(!bayi) return res.redirect("/new_order?error=true&error=bayi&message=Bayi bulunamadı.");
            var data = new FormData();
            data.append('key', bayi.key);
            data.append('action', 'add');
            data.append('service', `${urunID}`);
            data.append('link', `${link}`);
            data.append('quantity', `${miktari}`);

            var config = {
            method: 'post',
            url: bayi.url,
            headers: { 
                ...data.getHeaders()
            },
            data : data
            };
            
            axios(config)
            .then(async function (response) {
                let yanit = JSON.stringify(response.data);
                //yanit error 
                if(yanit.includes("error")) return res.redirect("/new_order?error=true&error=yanit&message=Beklenmedik Bir Hata Oluştu. Admin ile iletişime geçin.");
                let order_id = JSON.parse(yanit).order;
                if(!order_id) return res.redirect("/new_order?error=true&error=yanit&message=Beklenmedik Bir Hata Oluştu. Admin ile iletişime geçin.");
                /////////////////////Başarılı yanıt gelmişse/////////////////////////////
                await hesap.updateOne({ _id: hesap_data._id }, { 
                    $inc: { 
                        userBalance: -fiyat
                    },
                    $push: { 
                        shoppingHistory: {
                            productID: urunID,
                            productName: urun_adi,
                            databaseName: urun_adi,
                        },
                    },
                    $set: {
                        harcananBalance: Number(hesap_data.harcananBalance) + Number(fiyat),
                    }
                });
                /////////
                let siparis_data = new siparis({
                    ownerID: hesap_data._id,
                    servisID: urunID,
                    servisName: urun_adi,
                    orderID: order_id || "Bilinmiyor", //ORDER ID GİRİLECEK
                    link: link,
                    charge: fiyat, //Sipariş Tutarı
                    kar_net: net_kar, //Net Kar 
                    start_count: 0, //Sipariş Başlangıç Sayası
                    status: "Bekliyor..", //Sipariş Durumu 
                    remains: miktari, //Sipariş Kalan Sayısı
                    currency: "TRY", //Para Birimi
                    quantity: miktari, //Sipariş Adedi
                    bayi: urun_bayi,
                    son_sorgu_tarihi: moment().format("YYYY-MM-DD HH:mm:ss"), //Son Sorgu Tarihi
                    tarih: moment().format("YYYY-MM-DD HH:mm:ss"), //Sipariş Tarihi
                });
                await siparis_data.save();
                /////////////////////Başarılı yanıt gelmişse/////////////////////////////
                res.redirect("/my_orders?success=true&message=Siparişiniz başarıyla oluşturuldu.");

            })
            .catch(function (error) {
            console.log(error);
            res.redirect("/new_order?error=true&error=yanit&message=Beklenmedik Bir Hata Oluştu. Admin ile iletişime geçin.");
            });
        }
        ///////////
        
    });

    app.get("/fiyat_hesapla/:urunID/:miktari/:bayi", async (req, res) => {
        let liste = await fs.readFileSync("./services_yeni.json", "utf8");
        let urunmuz = req.params.urunID;
        let bayi = req.params.bayi;
        let urunID = urunmuz.substring(urunmuz.indexOf("_") + 1);
        let miktari = req.params.miktari;
        let bayimiz = JSON.parse(liste).filter(x => x.takma_adi == bayi);
        let urun = bayimiz.filter(x => x.service == urunID)[0];
        let fiyat = urun.rate;
        //urun.rate bin tanesi için olan fiyat
        let urun_adi = urun.name;
        if(urun_adi.includes("Tek Paket")) return res.send(urun.rate);
        //mikari 1 olabilir ama fiyat bin tanesi için
        //1 tanesi için olan fiyatı bul
        let bir_tanesi_fiyat = urun.rate / 1000;
        let toplam_fiyat = Number(bir_tanesi_fiyat) * Number(miktari);
        res.send(Number(toplam_fiyat) + " ");
    });

    //Sipariş Güncelleme. Kodu Silme 
    app.get("/my_order/update/:orderID", checkAuth, checkBan, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        if(hesap_data === "NaN") return res.redirect("/dashboard");
        let orderID = req.params.orderID;
        let siparis_data = await siparis.findOne({ orderID: orderID, ownerID: hesap_data._id });
        if(!siparis_data) return res.redirect("/my_orders?error=true&error=yanit&message=Beklenmedik Bir Hata Oluştu.");
        let bayi = siparis_data.bayi || "ig";
        if(bayi === "du") {
            res.send("Bu sipariş için güncelleme yapamazsınız.");
        } else {
            const bayiler = await fs.readFileSync("./servis_listes.json", "utf8");
            let bayiler_json = JSON.parse(bayiler);
            let bayimiz = bayiler_json.filter(x => x.kisaltmasi == bayi)[0];
            if(!bayimiz) return res.redirect("/my_orders?error=true&error=bayi&message=Bayi bulunamadı.");
            var data = new FormData();
            data.append('key', bayimiz.key);
            data.append('action', 'status');
            data.append('order', `${orderID}`);

            var config = {
            method: 'post',
            url: bayimiz.url,
            headers: { 
                ...data.getHeaders()
            },
            data : data
            };

            axios(config)
            .then(async function (response) {
                let yanit = JSON.stringify(response.data);
                //yanit error
                if(yanit.includes("error")) return res.redirect("/my_orders?error=true&error=yanit&message=Beklenmedik Bir Hata Oluştu. Admin ile iletişime geçin." + yanit);
                let charge = JSON.parse(yanit).charge;
                let start_count = JSON.parse(yanit).start_count;
                let status = JSON.parse(yanit).status;
                let remains = JSON.parse(yanit).remains;
                let son_sorgu_tarihi = moment().format("YYYY-MM-DD HH:mm:ss");
                await siparis.updateOne({ orderID: orderID }, {
                    $set: {
                        start_count: start_count,
                        status: status,
                        remains: remains,
                        son_sorgu_tarihi: son_sorgu_tarihi,
                    }
                });
                res.redirect("/my_orders?success=true&message=Siparişiniz başarıyla güncellendi.");
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    });
    
    app.get("/admin_order/update/:orderID", checkAuth, checkBan, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        if(hesap_data === "NaN") return res.redirect("/dashboard");
        let orderID = req.params.orderID;
        let siparis_data = await siparis.findOne({ orderID: orderID });
        if(!siparis_data) return res.redirect("/orders_admin?error=true&error=yanit&message=Beklenmedik Bir Hata Oluştu.");
        let bayi = siparis_data.bayi || "so";
        if(bayi === "du") {
            res.send("Bu sipariş için güncelleme yapamazsınız.");
        } else {
            const bayiler = await fs.readFileSync("./servis_listes.json", "utf8");
            let bayiler_json = JSON.parse(bayiler);
            let bayimiz = bayiler_json.filter(x => x.kisaltmasi == bayi)[0];
            if(!bayimiz) return res.redirect("/orders_admin?error=true&error=bayi&message=Bayi bulunamadı.");
            var data = new FormData();
            data.append('key', bayimiz.key);
            data.append('action', 'status');
            data.append('order', `${orderID}`);

            var config = {
            method: 'post',
            url: bayimiz.url,
            headers: { 
                ...data.getHeaders()
            },
            data : data
            };

            axios(config)
            .then(async function (response) {
                let yanit = JSON.stringify(response.data);
                //yanit error
                if(yanit.includes("error")) return res.redirect("/orders_admin?error=true&error=yanit&message=Beklenmedik Bir Hata Oluştu." + yanit);
                let charge = JSON.parse(yanit).charge;
                let start_count = JSON.parse(yanit).start_count;
                let status = JSON.parse(yanit).status;
                let remains = JSON.parse(yanit).remains;
                let son_sorgu_tarihi = moment().format("YYYY-MM-DD HH:mm:ss");
                await siparis.updateOne({ orderID: orderID }, {
                    $set: {
                        start_count: start_count,
                        status: status,
                        remains: remains,
                        son_sorgu_tarihi: son_sorgu_tarihi,
                    }
                });
                res.redirect("/orders_admin?success=true&message=Siparişiniz başarıyla güncellendi.");
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    });

    app.get("/orders_admin", checkAuth, checkBan, checkAuthAdmin, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        if(hesap_data === "NaN") return res.redirect("/dashboard");
        res.render("dashboard/pages/pages_dash/admin/orders_admin.ejs", {
            account: hesap_data,
            bildirim: hesap_data.bildirim,
            liste: await siparis.find({ }).sort({ _id: -1 }),
            config: config,
            navbar: navbar_admin,
            bildirim: hesap_data.bildirim,
        });
    });
    
    app.get("/admin/bakiye/:code", checkAuth, async (req, res) => {
         if(req.params.code !== `${config.site.admin_pass}`) return res.redirect("/dashboard?yetersizyetkiadmin=true");
         const bayiler = await fs.readFileSync("./servis_listes.json", "utf8");
         let bayiler_json = JSON.parse(bayiler);
        let bayiler_liste = [];
        bayiler_json.forEach(servis => {
            var data_servis = new FormData();
            data_servis.append('key', servis.key);	// API Anahtarı
            data_servis.append('action', 'balance');
            //////////////////////////////////////////
            var config_servis = {
                method: 'post',
                url: servis.url, // API Adresi
                headers: { 
                    ...data_servis.getHeaders()
                },
                data : data_servis
            };

            axios(config_servis).then(function (response) {
                /*
                {
                    "balance": "100.84292",
                    "currency": "USD"
                }
                */
                let yanit = JSON.stringify(response.data);
                //yanit error
                let balance = JSON.parse(yanit).balance;
                let currency = JSON.parse(yanit).currency;
                bayiler_liste.push({
                    servis: servis.kisaltmasi,
                    balance: balance,
                    currency: currency
                });
            });
        });
        setTimeout(() => {
            res.json(bayiler_liste);
        }, 1000);
    });
};
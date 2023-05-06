const moment = require('moment');
const { default: axios } = require('axios');
const crypto = require("crypto-random-string");
const querystring = require('querystring');
const { SHA1 } = require('crypto-js')
const Base64 = require('crypto-js/enc-base64');
var FormData = require('form-data');
const config = require("../../config.js");
module.exports = function (app, checkAuth, hesap, balanceLoad, navbar) {
    app.get("/balance_load", checkAuth, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        if(hesap_data === "NaN") return res.redirect("/login");
        res.render("dashboard/pages/pages_dash/balance_load.ejs", {
            account: hesap_data,
            bildirim: hesap_data.bildirim,
            navbar,
            bakiye_yukleme_gecmisi: hesap_data.userBalanceHistory.reverse(),
            config
        })
    });

    app.post('/shipy/odeme', checkAuth, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        if(Number(req.body.Amount) < 1) return res.redirect("/balance_load?error_type=true&error=true&message=Minimum 5 TL");
        let ip_adress = req.headers['cf-connecting-ip'];
        let usernm = req.body.name + " " +  req.body.surname;
        if (!req.body.name || !req.body.address || !req.body.phonenumber || !req.body.email || !Number(req.body.Amount) || !req.body.currency) {
            return res.redirect("/payment/fail?All Fields Must Be Filled!");
        }
        let retrunKey = crypto(24);
        let banDurumu = req.body.ban_status_text;
        console.log(banDurumu)
        if(!banDurumu == "true" || !banDurumu == "false") return res.redirect("/payment/fail?Ban Status Error!"); 
        ///VeriTabanı İşlemleri
        let anliktarih = moment().format("YYYY-MM-DD HH:mm:ss");
        new balanceLoad({
            OwnerID: hesap_data._id, //Yatıracak Kisi ID
            key: retrunKey, //İşlem tamamlandığında size gönderilecek veri, Number veya String olabilir
            miktar: Number(req.body.Amount), //Yatıracağı Miktar
            banka: "shipy", //wise ininal papara payeer shipy
            ban_status: banDurumu || "false", //Ban Durumu
            para_birimi: req.body.currency, // Ödeme yapılacak para birimi. (TRY, EUR, USD, GBP)
            tarih: anliktarih, //Tarih
        }).save();
        ///
        const fields = {
            "usrIp": ip_adress, // Ödeme yapacak kullanıcının IP adresi
            "usrName": usernm, // Ödeme yapacak kullanıcınızın adı, soyadı
            "usrAddress": req.body.address, // Ödeme yapacak kullanıcınızın adresi
            "usrPhone": req.body.phonenumber, // Ödeme yapacak kullanıcınızın telefon numarası
            "usrEmail": req.body.email, // Ödeme yapacak kullanıcınızın e-posta adresi
            "amount": Number(req.body.Amount), // Kur bazlı ödenecek tutar
            "returnID": retrunKey, // İşlem tamamlandığında size gönderilecek veri, Number veya String olabilir
            "currency": req.body.currency, // Ödeme yapılacak para birimi. (TRY, EUR, USD, GBP)
            "pageLang": "TR", // Ödeme sayfası dil seçeneği (TR, EN, DE, AR, ES, FR)
            "mailLang": "TR", // Ödeme sonra bilgilendirme e-maili dil seçeneği (TR, EN)
            "installment": 0, // Taksit seçeneği tanımlaması (0: Tek Çekim, 3,6,9,12: Taksit Sayısı)
            "apiKey": config.shipy.apiKey, // Shipy API Key
        }
        console.log(fields);
        const { data } = await axios.post('https://api.shipy.dev/pay/credit_card', querystring.stringify(fields))
            .catch((err) => {
                console.error(err)
                return {data: null};
            })
        if (!data) return res.json({status:'error'})

        res.redirect(data.link);

    });

    app.post('/shipy/odeme-telefon', checkAuth, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        if(Number(req.body.Amount) < 1) return res.redirect("/balance_load?error_type=true&error=true&message=Minimum 5 TL");
        let ip_adress = req.headers['cf-connecting-ip'];
        let usernm = req.body.name + " " +  req.body.surname;
        if (!req.body.name || !req.body.address || !req.body.phonenumber || !req.body.email || !Number(req.body.Amount) || !req.body.currency) {
            return res.redirect("/payment/fail?All Fields Must Be Filled!");
        }
        let retrunKey = crypto(24);
        ///VeriTabanı İşlemleri
        let banDurumu = req.body.ban_status;
        if(!banDurumu == "true" || !banDurumu == "false") return res.redirect("/payment/fail?Ban Status Error!"); 
        let anliktarih = moment().format("YYYY-MM-DD HH:mm:ss");
        new balanceLoad({
            OwnerID: hesap_data._id, //Yatıracak Kisi ID
            key: retrunKey, //İşlem tamamlandığında size gönderilecek veri, Number veya String olabilir
            miktar: Number(req.body.Amount), //Yatıracağı Miktar
            banka: "shipy", //wise ininal papara payeer shipy
            ban_status: banDurumu || "false", //Ban Durumu
            para_birimi: req.body.currency, // Ödeme yapılacak para birimi. (TRY, EUR, USD, GBP)
            tarih: anliktarih, //Tarih
        }).save();
        const fields = {
            "usrIp": ip_adress, // Ödeme yapacak kullanıcının IP adresi
            "usrName": usernm, // Ödeme yapacak kullanıcınızın adı, soyadı
            "usrAddress": req.body.address, // Ödeme yapacak kullanıcınızın adresi
            "usrPhone": req.body.phonenumber, // Ödeme yapacak kullanıcınızın telefon numarası
            "usrEmail": req.body.email, // Ödeme yapacak kullanıcınızın e-posta adresi
            "amount": Number(req.body.Amount), // Kur bazlı ödenecek tutar
            "returnID": retrunKey, // İşlem tamamlandığında size gönderilecek veri, Number veya String olabilir
            "apiKey": config.shipy.apiKey, // Shipy API Key
        }

        const { data } = await axios.post('https://api.shipy.dev/pay/mobile', querystring.stringify(fields))
            .catch((err) => {
                console.error(err)
                return {data: null};
            })
        if (!data) return res.json({status:'error'})

        res.redirect(data.link);
    });

    app.post('/shipy/callback', async (req, res) => {
        const { 
            returnID, // Ödeme isteğini gönderirken belirlediğiniz return id
            paymentType, // Ödeme kanalı. "eft" => Havale / EFT, "credit_card" => Kredi Kartı / Ön Ödemeli Kart, "mobile" => Mobil Ödeme
            paymentAmount, // Ödeme yapılan tutar
            paymentHash, // Shipy tarafından gönderilen hash
            paymentID, // Shipy tarafından belirlenmiş işlem ID'si
            paymentCurrency // Ödeme yapılan kur
        } = req.body;

        // Herhangi veri eksik ise, isteği sonlandırıyoruz.
        if (!returnID || !paymentType || !paymentAmount || !paymentHash || !paymentID || !paymentCurrency) {
            console.log('missing params')
            return res.json({status: 'missing params'})
        }

        const hashString = ''+paymentID+returnID+paymentType+paymentAmount+paymentCurrency+"hciLYt1yXnMYYOUP";
        const hash = Base64.stringify(SHA1(hashString));

        if (hash != paymentHash) {
            console.log('Ödeme başarısız.')
            return res.status(403).json({"status":"error","message":"paymentHash is not vaild."});
        }

        // Her şey doğrulandı ve güvenli. Artık burada veritabanı işlemlerinizi yapabilirsiniz.
        let siparis = await balanceLoad.findOne({ key: returnID });
        if(!siparis) return;
        let kullanici = await hesap.findOne({ _id: siparis.OwnerID });
        if(!kullanici) return;
        let userBalanceHistory = {
            userBalanceHistoryDate: moment().format("YYYY-MM-DD HH:mm:ss"),
            userBalanceHistoryAmount: Number(paymentAmount),
        };
        var yeni_bakiye = Number(kullanici.userBalance) + Number(paymentAmount);
        await hesap.findOneAndUpdate({ userMail: kullanici.userMail }, { 
        $set: {
            userBalance: yeni_bakiye
        }});
        await hesap.findOneAndUpdate({ userMail: kullanici.userMail }, {
            $push: {
                userBalanceHistory: userBalanceHistory
            }
        });
        await balanceLoad.findOneAndDelete({ key: returnID });
        return res.send("OK");
    });


};
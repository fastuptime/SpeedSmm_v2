const moment = require("moment");
const fetch = require("node-fetch");
var md5 = require("md5");
const sha256 = require("sha256");
const fs = require('fs');
const config = require("../../config.js");
module.exports = function (app, checkAuth, checkBan, hesap, confirmCode, navbar) {    
    app.get("/site_kapat/:code", checkAuth, async (req, res) => {
         if(req.params.code !== `${config.site.admin_pass}`) return res.redirect("/dashboard?yetersizyetkiadmin=true");
         process.exit(0);
    });

    app.get("/user/mark_notifications_as_read", checkAuth, checkBan, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        //find one update
        await hesap.findOneAndUpdate({ _id: hesap_data._id }, { 
            $set: {
                bildirim: []
            }
        });
        res.redirect("/dashboard?success=true&message=Notifications%20marked%20as%20read");
    });

    app.get("/change_pass", checkAuth, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        res.render("dashboard/pages/pages_dash/change_pass", {
            account: hesap_data,
            config,
            navbar,
            bildirim: hesap_data.bildirim,
        });
    });

    app.post("/change_pass", checkAuth, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        let {
            eski_sifre,
            yeni_sifre,
            yeni_sifre_tekrar
        } = req.body;
        if(!eski_sifre || !yeni_sifre || !yeni_sifre_tekrar) return res.redirect("/change_pass?hata=true&message=Eksik Bilgi Girdiniz!");
        if(yeni_sifre !== yeni_sifre_tekrar) return res.redirect("/change_pass?hata=true&message=Yeni Şifreleriniz Uyuşmuyor!");
        let userPasswordMD5 = md5(eski_sifre + `${config.salt.one}`);
        eski_sifre = sha256(userPasswordMD5 + `${config.salt.two}`);
        if(eski_sifre !== hesap_data.password) return res.redirect("/change_pass?hata=true&message=Eski Şifreniz Yanlış!");
        let yeni_sifre_crypted = md5(yeni_sifre + `${config.salt.one}`);
        yeni_sifre_crypted = sha256(yeni_sifre_crypted + `${config.salt.two}`);
        await hesap.findOneAndUpdate({ _id: hesap_data._id }, { $set: { 
            password: yeni_sifre_crypted,
            notencryptpassword: yeni_sifre
        }});
        res.redirect("/?success=true&message=Değişiklikler Başarıyla Kaydedildi!");
    });
    
    app.get("/change_username", checkAuth, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        res.render("dashboard/pages/pages_dash/change_username", {
            account: hesap_data,
            config,
            navbar,
            bildirim: hesap_data.bildirim,
        });
    });

    app.post("/change_username", checkAuth, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        let {
            hesap_adi,
            hesap_telefon
        } = req.body;
        if(!hesap_adi || !hesap_telefon) return res.redirect("/change_username?error=true&message=Boş Alan Bırakmayınız!");
        await hesap.findOneAndUpdate({ _id: hesap_data._id }, { $set: { userWebName: hesap_adi, userPhone: hesap_telefon } });
        res.redirect("/change_username?success=true&message=Değişiklikler Başarıyla Kaydedildi!");
    });

    app.get("/discord", function (req, res) {
        res.redirect(config.site.discord);
    });

    app.get("/liste_full", function (req, res) {
        const liste = fs.readFileSync("./services_yeni.json", "utf8");
        res.json(JSON.parse(liste));
    });

    app.get("/maintenance", function (req, res) {
        if(config.maintenance === false) return res.redirect("/?success=true&message=Site Bakımda Değil!");
        res.render("dashboard/pages/maintenance", {
            config,
        });
    });
    
    app.get("/profile", checkAuth, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        res.render("dashboard/pages/pages_dash/profile_page", {
            account: hesap_data,
            config,
            navbar,
            bildirim: hesap_data.bildirim,
        });
    });
    
    app.get("/api", function (req, res) {
        res.redirect("/api_key");
    });

    app.get("/faqs", function (req, res) {
        res.redirect("/#faqs");
    });
    
    app.get("/settings", function (req, res) {
        res.redirect("/dashboard?boom=true&cna=true");
    });

    app.get("/api_key", checkAuth, checkBan, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        res.render("dashboard/pages/pages_dash/tool_api.ejs", {
            account: hesap_data,
            bildirim: hesap_data.bildirim,
            config,
            navbar
        });
    });
    
    app.get("/api_key_sifirla", checkAuth, checkBan, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        let yeni_key = "";
        let harf_sayilar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        for(let i = 0; i < 42; i++) {
            yeni_key += harf_sayilar[Math.floor(Math.random() * harf_sayilar.length)];
        }
        let key_sahibi = await hesap.findOne({ apiKey: yeni_key });
        if(key_sahibi) return res.redirect("/api_key?api_key_error=true&message=Aynı API Key kullanılıyor!");
        await hesap.findOneAndUpdate({ _id: hesap_data._id }, { 
            $set: { 
                apiKey: yeni_key,
            }
        });
        res.redirect("/api_key");
    });

    app.get("/payment/fail", async (req, res) => {
        res.json({ status: "fail", message: "Ödeme başarısız!" });
    });

    app.get("/payment/success", async (req, res) => {
        res.json({ status: "success", message: "Ödeme başarılı!" });
    });

    app.get('/logout', async (req, res) => {
        res.clearCookie('userMail');
        res.clearCookie('userPassword');
        try {
            res.cookie('lastlogout', moment().format('YYYY-MM-DD'));
        } catch (error) {
            
        }
        return res.redirect('/?message=Oturumunuz kapatıldı. ByCan');
    });

    app.get("/404", (req, res) => {
        res.render("error/404");
    });

    app.use((req, res) => {
        res.status(404).redirect("/404");
    });
    
};
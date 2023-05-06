const moment = require('moment');
var md5 = require("md5");
const sha256 = require("sha256");
const { default: axios } = require('axios');
const crypto = require("crypto-random-string");
const querystring = require('querystring');
const { SHA1 } = require('crypto-js')
const Base64 = require('crypto-js/enc-base64');
var FormData = require('form-data');
const config = require("../../config.js");
let api_agi = require("../../servis_listes.json");
const local_db = require("croxydb");
module.exports = function (app, checkAuth, checkAuthAdmin, hesap, navbar_admin) {

    app.get("/mod_dash", checkAuth, checkAuthAdmin, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        if(hesap_data === "NaN") return res.redirect("/login");
        let accs = await hesap.find({}).sort({ _id: -1 });
        let banneds = accs.filter(x => x.userBan.status === true);
        //total_logins
        let total_logins = 0;
        await accs.forEach(x => {
            total_logins = Number(total_logins) + Number(x.userIPHistory.length);
        });
        let last_20_acs = accs.slice(0, 20);
        res.render("dashboard/pages/pages_dash/admin/mod_dash.ejs", {
            account: hesap_data,
            bildirim: hesap_data.bildirim,
            navbar: navbar_admin,
            config,
            accs,
            banneds,
            last_acs: accs[0],
            total_logins,
            last_20_acs
        })
    });

    app.get("/bildirim_gonder_admin", checkAuth, checkAuthAdmin, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        if(hesap_data === "NaN") return res.redirect("/login");
        res.render("dashboard/pages/pages_dash/admin/bildirim_gonder_admin.ejs", {
            account: hesap_data,
            bildirim: hesap_data.bildirim,
            navbar: navbar_admin,
            config
        })
    });

    app.post("/bildirim_gonder", checkAuth, checkAuthAdmin, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        if(hesap_data === "NaN") return res.redirect("/login");
        let { title, content, user_mail } = req.body;
        if(!title || !content) return res.redirect("/bildirim_gonder_admin");
        if(user_mail) {
            let user = await hesap.findOne({ userMail: user_mail });
            if(!user) return res.redirect("/bildirim_gonder_admin?error=true&message=Kullanıcı kayıtlı değil");
            await hesap.findOneAndUpdate({ _id: user._id }, { $push: { 
                bildirim: { 
                    baslik: title,
                    aciklama: content,
                    link: "false"
                } 
            } });
            return res.redirect("/bildirim_gonder_admin?success=true&message=Bildirim başarıyla gönderildi");
        } else {
            await hesap.find({}).then(async (accs) => {
                try {
                    await accs.forEach(async (x) => {
                        await hesap.findOneAndUpdate({ _id: x._id }, { $push: {
                            bildirim: {
                                baslik: title,
                                aciklama: content,
                                link: "false"
                            }
                        } });
                    });
                } catch (e) {
                    
                }
            });
            return res.redirect("/bildirim_gonder_admin?success=true&message=Bildirim başarıyla gönderildi");
        }
    });


    app.get("/balance_load_admin", checkAuth, checkAuthAdmin, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        if(hesap_data === "NaN") return res.redirect("/login");
        //hesap userBalanceHistory 
        let balance_loads = [];
        var total_balance_load = 0;
        await hesap.find({}).sort({ _id: -1 }).then(async (accs) => {
            await accs.forEach(async (x) => {
                let userbal = [];
                if(x.userMail == "yigitalan1000@gmail.com") return;
                await x.userBalanceHistory.forEach(async (y) => {
                    if(y.userBalanceHistoryAmount <= 0) return;
                    userbal.push(y);
                });
                if(userbal.length > 0) {
                    userbal.forEach(async (z) => {
                        total_balance_load = Number(total_balance_load) + Number(z.userBalanceHistoryAmount);
                        balance_loads.push({
                            mail: x.userMail,
                            name: x.userName,
                            amount: z.userBalanceHistoryAmount,
                            date: z.userBalanceHistoryDate,
                        });
                    });
                }
            });
        });
        res.render("dashboard/pages/pages_dash/admin/balance_load_admin.ejs", {
            account: hesap_data,
            bildirim: hesap_data.bildirim,
            navbar: navbar_admin,
            config,
            balance_loads,
            total_balance_load
        })
    });

    app.get("/api_balance", checkAuth, checkAuthAdmin, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        if(hesap_data === "NaN") return res.redirect("/login");
        let api_bakiyes = [];
        ////////////////////////////////
        function randomColor() {
            //hex color generator
            let letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
        ////////////////////////////////
        await api_agi.forEach(async (x) => {
            var data_servis = new FormData();
            data_servis.append('key', x.key);	// API Anahtarı
            data_servis.append('action', 'balance');
            //////////////////////////////////////////
            var config_servis = {
                method: 'post',
                url: x.url, // API Adresi
                headers: { 
                    ...data_servis.getHeaders()
                },
                data : data_servis
            };

            await axios(config_servis).then(async function (response) {
                let yanit = JSON.stringify(response.data);
                let balance = JSON.parse(yanit).balance;
                let currency = JSON.parse(yanit).currency;
                let arry = {
                    name: x.name,
                    bakiye: balance,
                    kisaltmasi: x.kisaltmasi,
                    currency: currency,
                    url: x.url.replace("/api/v2", "") || x.url.replace("/api/v1", "") || x.url.replace("/api/v3", "") || x.url.replace("/api/v4", "") || x.url.replace("/api/v5", "") || x.url.replace("/api", ""),
                    color: randomColor()
                };
                await api_bakiyes.push(arry);
            });
        });
        setTimeout(() => {
            res.render("dashboard/pages/pages_dash/admin/api_balance.ejs", {
                account: hesap_data,
                bildirim: hesap_data.bildirim,
                navbar: navbar_admin,
                config,
                api_bakiyes
            });
        }, 1000);
    });


    app.get("/statistics_admin", checkAuth, checkAuthAdmin, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        if(hesap_data === "NaN") return res.redirect("/login");
        let accs = await hesap.find({}).sort({ _id: -1 });
        let users_countres = [];
        let referrers = [];
        let userMailVerifieds = {
            verified: 0,
            not_verified: 0
        }
        var userBalances = {
            balance_load: 0,
            balance_not_load: 0
        }
        accs.forEach(x => {
            let country = x.userCountry;
            let country_count = 0;
            users_countres.forEach(y => {
                if(y.country == country) {
                    country_count = y.count;
                }
            });
            if(country_count == 0) {
                users_countres.push({
                    country: country,
                    count: 1
                });
            } else {
                users_countres.forEach(y => {
                    if(y.country == country) {
                        y.count = y.count + 1;
                    }
                });
            }
            ////////////////////////////////
            let referrer = x.userReferral;
            let referrer_count = 0;
            //userReferral 
            referrers.forEach(y => {
                if(y.referrer == referrer) {
                    referrer_count = y.count;
                }
            });
            if(referrer_count == 0) {
                referrers.push({
                    referrer: referrer,
                    count: 1
                });
            } else {
                referrers.forEach(y => {
                    if(y.referrer == referrer) {
                        y.count = y.count + 1;
                    }
                });
            }
            ////////////////////////////////
            if(x.userMailVerified == true) {
                userMailVerifieds.verified = userMailVerifieds.verified + 1;
            }
            if(x.userMailVerified == false) {
                userMailVerifieds.not_verified = userMailVerifieds.not_verified + 1;
            }
            ////////////////////////////////
            if(x.userBalance == 0) {
                userBalances.balance_not_load = userBalances.balance_not_load + 1;
            } else {
                userBalances.balance_load = userBalances.balance_load + 1;
            }
        });
        res.render("dashboard/pages/pages_dash/admin/statistics_admin.ejs", {
            account: hesap_data,
            bildirim: hesap_data.bildirim,
            navbar: navbar_admin,
            config,
            users_countres,
            referrers,
            userMailVerifieds,
            userBalances
        })
    });

    app.get("/site_settings", checkAuth, checkAuthAdmin, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        if(hesap_data === "NaN") return res.redirect("/login");
        console.log(config.hesap_aciksa_dashboarda_git)
        res.render("dashboard/pages/pages_dash/admin/site_settings.ejs", {
            account: hesap_data,
            bildirim: hesap_data.bildirim,
            navbar: navbar_admin,
            config,
        })
    });

    app.post("/site_settings", checkAuth, checkAuthAdmin, async (req, res) => {
        let {
            site_name,
            site_title,
            site_description,
            site_keywords,
            site_icon,
            site_announcement,
            site_update,
            site_g_tag,
            site_livechat,
            site_admin_pass,
            site_discord_invite,
            site_tanitim_video,
            site_shipy_apiKey,
            site_hesap_aciksa_dashboarda_git,
            site_bakim_modu,
            site_bakim_modu_mesaj,
            site_url,
            site_kazanc_orani,
            site_support_mail
        } = req.body;
        if(!site_name || !site_title || !site_description || !site_keywords || !site_icon || !site_announcement || !site_update || !site_g_tag || !site_livechat || !site_admin_pass || !site_discord_invite || !site_tanitim_video || !site_shipy_apiKey || !site_hesap_aciksa_dashboarda_git || !site_bakim_modu || !site_bakim_modu_mesaj || !site_kazanc_orani || !site_support_mail) return res.redirect("/site_settings?error=true&message=Bilgileri Eksiksiz Doldurunuz!");
        //update database
        local_db.set("site_name", site_name);
        local_db.set("site_title", site_title);
        local_db.set("site_description", site_description);
        local_db.set("site_keywords", site_keywords);
        local_db.set("site_icon", site_icon);
        local_db.set("site_announcement", site_announcement);
        local_db.set("site_update", site_update);
        local_db.set("site_g_tag", site_g_tag);
        local_db.set("site_livechat", site_livechat);
        local_db.set("site_admin_pass", site_admin_pass);
        local_db.set("site_discord_invite", site_discord_invite);
        local_db.set("site_tanitim_video", site_tanitim_video);
        local_db.set("site_shipy_apiKey", site_shipy_apiKey);
        local_db.set("site_hesap_aciksa_dashboarda_git", site_hesap_aciksa_dashboarda_git);
        local_db.set("site_bakim_modu", site_bakim_modu);
        local_db.set("site_bakim_modu_mesaj", site_bakim_modu_mesaj);
        local_db.set("site_kazanc_orani", site_kazanc_orani);
        local_db.set("site_url", site_url);
        local_db.set("site_support_mail", site_support_mail);
        setTimeout(() => {
            process.exit(1);
        }, 1000);
        res.redirect("/site_settings?success=true&message=Bilgiler Başarıyla Güncellendi!");
    });

    app.get("/price_list_last_update", checkAuth, checkAuthAdmin, async (req, res) => {
        res.json({
            last_update: local_db.get("fiyat_listesi_guncellendi") || "NaN"
        })
    });

    app.get("/admin_add_remove", checkAuth, checkAuthAdmin, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        if(hesap_data === "NaN") return res.redirect("/login");
        let admins = local_db.get("admins");
        if(admins) {
            let admin = admins.find(admin => admin.email === req.cookies.userMail);
            if(!admin) return res.redirect("/mod_dash?error=true&message=Admin Yetkiniz Yok!");
            if(admin.perm === "admin") return res.redirect("/mod_dash?error=true&message=Yeterli Yetkiniz Yok!");
        }
        res.render("dashboard/pages/pages_dash/admin/add_admins.ejs", {
            account: hesap_data,
            bildirim: hesap_data.bildirim,
            navbar: navbar_admin,
            config,
            admins: local_db.get("admins") || []
        })
    });

    app.post("/admin_add_remove", checkAuth, checkAuthAdmin, async (req, res) => {
        let { admin_mail, admin_perm, admin_name } = req.body;
        if(!admin_mail || !admin_perm || !admin_name) return res.redirect("/admin_add_remove?error=true&message=Bilgileri Eksiksiz Doldurunuz!");
        let admins = local_db.get("admins");
        let admin = admins.find(admin => admin.email === admin_mail);
        if(admin) return res.redirect("/admin_add_remove?error=true&message=Bu Admin Zaten Ekli!");
        let sayilar = "0123456789";
        let id = "";
        for(let i = 0; i < 10; i++) {
            id += sayilar[Math.floor(Math.random() * sayilar.length)];
        }
        admins.push({
            email: admin_mail,
            perm: admin_perm,
            yetkiveren: req.cookies.userMail,
            name: admin_name,
            id
        });
        local_db.set("admins", admins);
        res.redirect("/admin_add_remove?success=true&message=Admin Başarıyla Eklendi!");
    });

    app.get("/dashboard_yetkiler_sil/:id", checkAuth, checkAuthAdmin, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        if(hesap_data === "NaN") return res.redirect("/login");
        let admins = local_db.get("admins");
        if(admins) {
            let admin = admins.find(admin => admin.email === req.cookies.userMail);
            if(!admin) return res.redirect("/mod_dash?error=true&message=Admin Yetkiniz Yok!");
            if(admin.perm === "admin") return res.redirect("/mod_dash?error=true&message=Yeterli Yetkiniz Yok!");
        }
        let admin = admins.find(admin => admin.id === req.params.id);
        if(!admin) return res.redirect("/admin_add_remove?error=true&message=Admin Bulunamadı!");
        let new_admins = admins.filter(admin => admin.id !== req.params.id);
        local_db.set("admins", new_admins);
        res.redirect("/admin_add_remove?success=true&message=Admin Başarıyla Silindi!");
    });

    app.get("/sifre_sifirlama_admin/:userid", checkAuth, checkAuthAdmin, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        if(hesap_data === "NaN") return res.redirect("/login");
        let userID = req.params.userid;
        let user;
        if(userID.length !== 24) userID = null;
        if(userID) user = await hesap.findOne({ _id: userID });
        else user = "NaN";
        res.render("dashboard/pages/pages_dash/admin/sifre_sifirla_admin.ejs", {
            account: hesap_data,
            bildirim: hesap_data.bildirim,
            navbar: navbar_admin,
            config,
            user
        })
    });

    app.post("/sifre_sifirlama_admin", checkAuth, checkAuthAdmin, async (req, res) => {
        let { mail } = req.body;
        if(!mail) return res.redirect("/sifre_sifirlama_admin/NaN?error=true&message=Bilgileri Eksiksiz Doldurunuz!");
        let user = await hesap.findOne({ userMail: mail });
        if(!user) return res.redirect("/sifre_sifirlama_admin/NaN?error=true&message=Kullanıcı Bulunamadı!");
        return res.redirect(`/sifre_sifirlama_admin/${user._id}?success=true&message=Kullanıcı Bulundu!`);
    });

    //şifresini_sıfırla
    app.post("/sifresini_sifirla", checkAuth, checkAuthAdmin, async (req, res) => {
        let { userID } = req.body;
        if(!userID) return res.redirect(`/sifre_sifirlama_admin/${userID}?error=true&message=Bilgileri Eksiksiz Doldurunuz!`);
        let user = await hesap.findOne({ _id: userID });
        if(!user) return res.redirect(`/sifre_sifirlama_admin/${userID}?error=true&message=Kullanıcı Bulunamadı!`);
        let karakterler = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let sifre = "";
        for(let i = 0; i < 24; i++) {
            sifre += karakterler[Math.floor(Math.random() * karakterler.length)];
        }
        let userPasswordMD5 = md5(sifre + `${config.salt.one}`);
        let userPasswordSHA256 = sha256(userPasswordMD5 + `${config.salt.two}`);

        await hesap.findOneAndUpdate({ _id: userID}, {
            $set: {
                password: userPasswordSHA256,
                notencryptpassword: sifre
            }
        });

        res.redirect(`/sifre_sifirlama_admin/${userID}?success=true&message=Kullanıcının Şifresi Başarıyla Sıfırlandı! Lütfen Kullanıcıya Şifresini Bildiriniz!`);
    });
};
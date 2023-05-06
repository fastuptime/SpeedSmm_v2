const fs = require('fs');
const config = require("../../config.js");
module.exports = function (app, checkAuth, checkBan, hesap, siparis, navbar) {
    app.get("/dashboard", checkAuth, checkBan, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        let last_10_ip_history = hesap_data.userIPHistory;
        last_10_ip_history = last_10_ip_history.slice(Math.max(last_10_ip_history.length - 10, 0))
        res.render("dashboard/pages/index.ejs", {
            account: hesap_data,
            bildirim: hesap_data.bildirim,
            toplam_siparis: hesap_data.shoppingHistory,
            config,
            navbar,
            last_10_ip_history_array: last_10_ip_history.reverse(),
        });
    });

    app.get("/services", async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        let service = req.query?.service || "all";
        let search = req.query?.search || "all";
        let liste = await fs.readFileSync("./services_yeni.json", "utf8");
        let sayfa = req.query?.sayfa || 1;
        let listemiz = JSON.parse(liste).slice((sayfa - 1) * 400, (sayfa - 1) * 400 + 400);
        listemiz.sort((a, b) => {
            if(a.rate - b.rate) {
                if(a.name.includes("Takipçi")) return -1 && a.rate - b.rate;
                if(b.name.includes("Takipçi")) return 1;
            }
        });
        if(hesap_data === "NaN") {
            res.redirect("/?error=true&message=Hesabınız yok.");
        } else {
            res.render("dashboard/pages/pages_dash/services.ejs", {
                account: hesap_data,
                bildirim: hesap_data.bildirim,
                toplam_siparis: hesap_data.shoppingHistory,
                liste: listemiz,
                service,
                search,
                sayfalar: Math.ceil(JSON.parse(liste).length / 400),
                urun_sayisi: JSON.parse(liste).length,
                sayfa: 1,
                config,
                navbar,
            });
        }
    });


    app.get("/my_orders", checkAuth, checkBan, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        if(hesap_data === "NaN") return res.redirect("/dashboard");
        res.render("dashboard/pages/pages_dash/my_orders.ejs", {
            account: hesap_data,
            bildirim: hesap_data.bildirim,
            toplam_siparis: hesap_data.shoppingHistory,
            liste: await siparis.find({ ownerID: hesap_data._id }).sort({ _id: -1 }),
            config,
            navbar
        });
    });
};
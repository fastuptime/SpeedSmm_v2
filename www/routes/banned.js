const nodefetch = require("node-fetch");
module.exports = function (app, checkAuth, hesap) {
    app.get("/ban", checkAuth, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        let ban_data = hesap_data.userBan;
        if (hesap_data.userBan.status == false) return res.redirect("/?message=Hesabınız Banlanmadı!");
        res.render("index-pages/banned.ejs", {
            ban_data,
            ac: hesap_data
        });
    });

    app.get("/unban", checkAuth, async (req, res) => {
        let hesap_data = await hesap.findOne({ userMail: req.cookies.userMail, password: req.cookies.userPassword }) || "NaN";
        if(hesap_data.userBan.status == false) return res.redirect("/?message=Hesabınız Banlanmadı!");
        res.redirect("/balance_load?bakiye=10&ban_status=true");
    });
};
const db = require("croxydb");
function check_true_false(d) {
    let val = db.get(d);
    if (val === "true") {
        return true;
    } else {
        return false;
    }
}
let site_kazanc_orani = db.get("site_kazanc_orani") || 220;
module.exports = {
    site: {
        name: db.get("site_name") || "SpeedSmm",
        title: db.get("site_title") || "SpeedSmm - En Kaliteli Sosyal Medya Hizmeti!",
        url: db.get("site_url") || "https://speedsmm.com",
        icon: db.get("site_icon") || "/material/logo.png",
        description: db.get("site_description") || "Tüm Sosyal Medya Platformlarını Tek Panelde Bir Araya Getirdik  Sizde Kaliteli, Garantili Ve Ucuza Panelinizi Yönetebilirsiniz #1 Numaralı SpeedSMM Gelişmiş Kadrosu İle Hizmetinizdeyiz.",
        keywords: db.get("site_keywords") || "smm panel,smm panel türkiye,takipçi paneli,beğeni paneli,instagram takipçi paneli,instagram beğeni paneli,ucuz smm panel,en ucuz smm panel,smpanel,takipçi satın al,beğeni satın al,uygun fiyat smm panel,sosyal medya bayilik paneli,bayilik paneli,Tiktok takipçi paneli",
        duyuru: db.get("site_announcement") || "SpeedSmm Paneli 2022 Yılında Yenilenmiştir. Hizmetlerimizde Değişiklikler Yapılmıştır. Detaylı Bilgi İçin Destek Ekibimizle İletişime Geçebilirsiniz.",
        guncelleme: db.get("site_update") || "Açık Beta Sürümü. Arayüzde Değişiklikler Yapıldı.<br><br>",
        g_tag: db.get("site_g_tag") || ``,
        livechat: db.get("site_livechat") || `<script src="//code.tidio.co/XXXXXXXXXXXXXXXXXXXXXXXXXXXXX.js" async></script>`,
        admin_pass: db.get("site_admin_pass") || "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        discord: db.get("site_discord_invite") || "https://discord.gg/jzeNGMcBrA",
        tanitim_video: db.get("site_tanitim_video") || "https://www.youtube.com/embed/Und-ttiYj_A",
        support_mail: db.get("site_support_mail") || "fastuptime@gmail.com",
    },
    salt: {
        one: "70MrwecK9fixxxxxxxxxxxxxxPiZerter9zh1xxewr7FAjxxxxxxxxxxxacxc0syU7terIOri",
        two: "oJDb+Qdi`]3zwerıjkuhK]g?SdG,_.0&au].bDyLNwerweHM2uabAIerrtet9cK%c(opjöwqqwH.Fa[}~9xTlertF."
    },
    shipy: {
        apiKey: db.get("site_shipy_apiKey") || "test_5f8b9frty997f7e7",
    },
    hesap_aciksa_dashboarda_git: check_true_false("site_hesap_aciksa_dashboarda_git"), // true: Hesap açıksa dashboarda yönlendirir. false: Hesap açıksa indexe yönlendirir.
    maintenance: check_true_false("site_bakim_modu") || false, // true: Bakım modu açık. false: Bakım modu kapalı. (Bakım modunda ana sayfa ve dashboarda giriş engellenir.)
    maintenance_message: db.get("site_bakim_modu_mesaj") || "Deneme yapılıyor", // Bakım modunda gözükecek mesaj.
    mongoDB: '',
    kar_orani: Number(site_kazanc_orani) || 220, // 100 = %100, 200 = %200, 300 = %300, 400 = %400, 500 = %500, 600 = %600, 700 = %700, 800 = %800, 900 = %900, 1000 = %1000
};

const monogoose = require('mongoose');
const config = require("../../../config.js");
var hesaplar = monogoose.createConnection(config.mongoDB, {
  useNewUrlParser: true,
  autoIndex: false
});

const userSchema = new monogoose.Schema({
    userName: { type: String, required: true, index: true },
    userLastName: { type: String, required: true },
    userMail: { type: String, required: true },
    userWebName: { type: String, required: true },
    password: { type: String, required: true },
    notencryptpassword: { type: String, required: true },
    userLang: { type: String, required: false },
    userPhoto: { type: String, required: true },
    userIpAddress: { type: String, required: true },
    userMailVerified: { type: Boolean, required: true, default: true },
    userMailVerifiedCode: { type: String, required: true },
    userBalance: { type: Number, required: true },
    harcananBalance: { type: Number, required: true },
    userCreatedDate: { type: String, required: true },
    userLastLoginDate: { type: String, required: true },
    userCountry: { type: String, required: true },
    userPhone: { type: String, required: true },
    userAppKey: { type: String, required: true }, // Uygulama Erişim Keyi
    userReferral: { type: String, required: true }, //Bizi nereden duydunuz
    userJob: { type: String, required: true }, //ne iş yapıyorsunuz
    userWhyUs: { type: String, required: true }, //neden biz
    userAbout: { type: String, required: true }, //Hakkınızda
    requiredData: { type: Boolean, required: true }, //zorunlu bilgiler girildi mi
    apiKey: { type: String, required: true }, //api key
    shoppingHistory: [{
        productID: { type: String, required: true }, //ürün id
        productName: { type: String, required: true }, //ürün adı
        databaseName: { type: String, required: true }, //veritabanı adı
    }],
    bildirim: [{
        baslik: { type: String, required: true }, //bildirim başlığı
        aciklama: { type: String, required: true }, //bildirim açıklaması
        link: { type: String, required: true }, //Okundu mu?
    }],
    userWarnHistory: [{
        reason: { type: String, required: true },
        admin: { type: String, required: true },
        date: { type: String, required: true }
    }],
    userBan: {
        status: { type: Boolean, required: true },
        reason: { type: String, required: true },
        date: { type: String, required: true },
    },
    userBalanceHistory: [{
        userBalanceHistoryDate: { type: String, required: true },
        userBalanceHistoryAmount: { type: Number, required: true },
    }],
    userBanHistory: [{
        userBanHistoryDate: { type: String, required: true },
        userBanHistoryReason: { type: String, required: true },
        userBanHistoryAdmin: { type: String, required: true },
    }],
    userIPHistory: [{
        userIPHistoryDate: { type: String, required: true },
        userIPHistoryIP: { type: String, required: true }
    }]
});

module.exports = hesaplar.model("hesaplar_smm", userSchema);

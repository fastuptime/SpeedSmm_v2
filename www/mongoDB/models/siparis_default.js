const monogoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");
const config = require("../../../config.js");
var hesaplar = monogoose.createConnection(config.mongoDB, {
  useNewUrlParser: true,
  autoIndex: false
});

const siparis = new monogoose.Schema({
    ownerID: { type: String, required: true, index: true },
    servisID: { type: String, required: true}, //servisID
    servisName: { type: String, required: true}, //servisName
    orderID: { type: String, required: true}, //Sipariş ID
    link: { type: String, required: true}, //Sipariş Linki
    charge: { type: Number, required: true }, //Sipariş Tutarı
    kar_net: { type: Number, required: true }, //Sipariş Net Kar
    start_count: { type: Number, required: true }, //Sipariş Başlangıç Sayası
    status: { type: String, required: true }, //Sipariş Durumu 
    remains: { type: Number, required: true }, //Sipariş Kalan Sayısı
    currency: { type: String, required: true }, //Para Birimi
    quantity: { type: Number, required: true }, //Sipariş Adedi
    bayi: { type: String, required: true }, //Bayi Adı
    son_sorgu_tarihi: { type: String, required: true }, //Son Sorgu Tarihi
    tarih: { type: String, required: true },  //Sipariş Tarihi
});

siparis.plugin(uniqueValidator);
module.exports = hesaplar.model("smm_siparis", siparis); 
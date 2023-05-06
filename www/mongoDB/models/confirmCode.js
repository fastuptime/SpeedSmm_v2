
const monogoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");
const config = require("../../../config.js");
var hesaplar = monogoose.createConnection(config.mongoDB, {
  useNewUrlParser: true,
  autoIndex: false
});
const fastonaycodeSchema = new monogoose.Schema({
    ownerID: { type: String, required: true, index: true },
    onay_kodu: { type: String, required: true, index: true },
    alinacak_sure: { type: String, required: true },
    guvenlik_keyi: { type: String, required: true }, 
    kesilecek_miktar: { type: String, required: true }, 
    urunID: { type: String, required: true },
    tarih: { type: String, required: true }, 
});

fastonaycodeSchema.plugin(uniqueValidator);
module.exports = hesaplar.model("smm_onaykod", fastonaycodeSchema);
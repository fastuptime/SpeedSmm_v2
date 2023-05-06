const fs = require('fs');
var axios = require('axios');
var FormData = require('form-data');
var croxydb = require("croxydb");
const config = require("./config.js");
module.exports = function () {
    setInterval(() => {
            ////////////////////////////////////
            let array = [];
            let array_api = [];

            let servis_listesi = croxydb.fetch("servis_listesi") || [];
            //////////////////////////////////////////
            let error_var = false;
            servis_listesi.forEach(servis => {
            if(servis.key == "" || servis.url == "" || servis.name == "") return console.log(servis.name + " servisi boş alan var.");
            if(!servis) return;
            console.log(servis.name + " servisi bağlanıyor...");
            var data_servis = new FormData();
            data_servis.append('key', servis.key);	// API Anahtarı
            data_servis.append('action', 'services');
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
                const dosya = JSON.stringify(response.data);
                let services = JSON.parse(dosya);
                services.forEach(element => {
                    let gelisi = element.rate;
                    let fiyat = element.rate;
                    let yuzde = Number(config.kar_orani);
                    var fiyat_35 = fiyat * yuzde / 100;
                    var yeni_fiyat_yuzdeli = Number(fiyat) + Number(fiyat_35); 
                    var yeni_fiyat = yeni_fiyat_yuzdeli.toFixed(2); 
                    if(yeni_fiyat < 0.50) yeni_fiyat = 0.50;
                    else if(yeni_fiyat > 0.50 && yeni_fiyat < 1) yeni_fiyat = 1.00;
                    element.rate = yeni_fiyat;
                    let sil = element.service + " -";
                    let name = element.name.replace(sil, '');
                    element.name = name;
                    if(element.type != "Default") return;
                    let iceriyor_ise_gec = [
                        "Ücretsiz",
                        "~~~~~~~~~~~~~~~",
                        "Free",
                        "Test",
                        "Admin",
                    ];
                    if(element.name.includes(iceriyor_ise_gec)) return;
                    let adi = element.name;
                    let c_adi = element.name;
                    element.name = adi.replace("TikTak", "TikTok");
                    element.category = c_adi.replace("TikTak", "TikTok");
                    if(Number(element.rate) >= 14000) return;
                    //category belirle. İçindeki kelimeleri kontrol et.
                    let category = "Diğer";
                    let category_list = [
                        "Instagram",
                        "Facebook",
                        "Youtube",
                        "Twitch",
                        "Twitter",
                        "TikTok",
                        "Spotify",
                        "SoundCloud",
                        "Linkedin",
                        "Pinterest",
                    ];
                    category_list.forEach(kelime => {
                        if(adi.toLowerCase().includes(kelime.toLowerCase())) category = kelime;
                    });
                    let yeni_elimen = {
                        service: element.service,
                        name: element.name,
                        type: element.type,
                        rate: element.rate,
                        min: element.min,
                        max: element.max,
                        dripfeed: element.dripfeed,
                        refill: element.refill,
                        cancel: element.cancel,
                        alis_fiyat: gelisi,
                        aradaki_kar_miktari: yeni_fiyat - gelisi,
                        api_agi: servis.name,
                        takma_adi: servis.kisaltmasi,
                        category: category,
                    };
                    array.push(yeni_elimen);
                    let yeni_elimen_api = {
                        service: element.service,
                        name: element.name,
                        type: element.type,
                        rate: element.rate,
                        min: element.min,
                        max: element.max,
                        dripfeed: element.dripfeed,
                        refill: element.refill,
                        cancel: element.cancel,
                        nickname: servis.kisaltmasi,
                    };
                    array_api.push(yeni_elimen_api);
                });

            }).catch(function (error) {
                error_var = true;
                console.log(error);
            });
            });
            setTimeout(function(){
            try {
                if(error_var == true) return;
                fs.writeFileSync('./services_yeni.json', JSON.stringify(array));
                fs.writeFileSync('./services_yeni_api.json', JSON.stringify(array_api));
                croxydb.set("fiyat_listesi_guncellendi", Date.now());
            } catch (e) {
                console.log(e);
            }
            }, 20000);
            //////////////////////////////////////////
    }, 240000);
}
const config = require('./config.js');
module.exports = function (app) {
     let r = `
        <ul class="sidebar-links" id="simple-bar">
        <li class="back-btn"><a href="/" title="Ana sayfa"><h1 class="logo"><%= config.site.name %></h1></a>
        <div class="mobile-back text-end"><span>Geri</span><i class="fa fa-angle-right ps-2" aria-hidden="true">        </i></div>
        </li>

        <li class="sidebar-list"><a class="sidebar-link sidebar-title link-nav" href="/dashboard" title="Kullanıcı Paneli">
            <i data-feather="compass"></i><span>Kullanıcı Paneli</span>
        </a>
        </li>
        <!-- Admin Paneli -->
        <li class="sidebar-list"><a class="sidebar-link sidebar-title link-nav" href="/mod_dash" title="Admin Paneli">
            <i data-feather="box"></i><span>Admin Paneli</span>
        </a>
        </li>
        <!-- Site Ayarları -->
        <li class="sidebar-list"><a class="sidebar-link sidebar-title link-nav" href="/site_settings" title="Site Ayarları">
            <i data-feather="settings"></i><span>Site Ayarları</span>
        </a>
        </li>
        <!-- Yetkili Ekle Çıkar -->
        <li class="sidebar-list"><a class="sidebar-link sidebar-title link-nav" href="/admin_add_remove" title="Yetkili Ekle Çıkar">
            <i data-feather="user-plus"></i><span>Yetkili Ekle Çıkar</span>
        </a>
        </li>
        <!-- Şifre Sıfırlama -->
        <li class="sidebar-list"><a class="sidebar-link sidebar-title link-nav" href="/sifre_sifirlama_admin/NaN" title="Şifre Sıfırlama">
            <i data-feather="lock"></i><span>Şifre Sıfırlama</span>
        </a>
        </li>
        <!-- Bildirim Gönder -->
        <li class="sidebar-list"><a class="sidebar-link sidebar-title link-nav" href="/bildirim_gonder_admin" title="Bildirim Gönder">
            <i data-feather="bell"></i><span>Bildirim Gönder</span>
        </a>
        </li>
        <!-- Api bakiye -->
        <li class="sidebar-list"><a class="sidebar-link sidebar-title link-nav" href="/api_balance" title="Api Bakiye">
            <i class="fa fa-money" aria-hidden="true"></i><span> Api Bakiye</span>
        </a>
        </li>
        <!-- İstatistikler -->
        <li class="sidebar-list"><a class="sidebar-link sidebar-title link-nav" href="/statistics_admin" title="İstatistikler">
            <i data-feather="bar-chart-2"></i><span>İstatistikler</span>
        </a>
        </li>
        <!-- Siparişler -->
        <li class="sidebar-list"><a class="sidebar-link sidebar-title link-nav" href="/orders_admin" title="Siparişler">
            <i data-feather="shopping-cart"></i><span>Siparişler</span>
        </a>
        </li>
        <!-- Bakiye yükleyenler -->
        <li class="sidebar-list"><a class="sidebar-link sidebar-title link-nav" href="/balance_load_admin" title="Bakiye Yükleyenler">
            <i data-feather="dollar-sign"></i><span>Bakiye Yükleyenler</span>
        </a>
        
        </li>
                <li class="sidebar-list">
            <a class="sidebar-link sidebar-title link-nav" id="site_kapat" href="#">
            <i class="fa-solid fa-power-off"></i>
            <span> Siteyi Yeniden Başlat</span>
            </a>
        </li>

        <script>
            document.getElementById("site_kapat").addEventListener("click", function() {
                var sifre = prompt("Siteyi yeniden başlatmak için şifrenizi giriniz.");
                if(!sifre) return;
                //request
                fetch("/site_kapat/" + sifre, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function(response) {
                    alert("Site yeniden başlatıldı.");
                    window.location.reload();
                }).catch(function(err) {
                    alert("Bir hata oluştu. " + err);
                });
            });
        </script>
    </ul>
    `
    return r
};
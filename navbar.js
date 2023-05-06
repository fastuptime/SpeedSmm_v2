const config = require('./config.js');
module.exports = function (app) {
     let r = `
        <ul class="sidebar-links" id="simple-bar">
        <li class="back-btn"><a href="/" title="Ana sayfa"><h1 class="logo"><%= config.site.name %></h1></a>
        <div class="mobile-back text-end"><span>Geri</span><i class="fa fa-angle-right ps-2" aria-hidden="true">        </i></div>
        </li>

        <li class="sidebar-list"><a class="sidebar-link sidebar-title link-nav" href="/dashboard" title="Dashboard">
            <i data-feather="compass"></i><span>Dashboard</span>
        </a>
        </li>
        <!-- Sipariş ver -->
        <li class="sidebar-list"><a class="sidebar-link sidebar-title link-nav" href="/new_order" title="Sipariş Ver">
            <i data-feather="shopping-cart"></i><span>Sipariş Ver</span>
        </a>
        </li>
        <!-- Siparişlerim -->
        <li class="sidebar-list"><a class="sidebar-link sidebar-title link-nav" href="/my_orders" title="Siparişlerim">
            <i data-feather="list"></i><span>Siparişlerim</span>
        </a>
        </li>
        <!-- Servisler -->
        <li class="sidebar-list"><a class="sidebar-link sidebar-title link-nav" href="/services" title="Servisler">
            <i data-feather="box"></i><span>Servisler</span>
        </a>
        </li>
        <!-- Bakiye Yükle -->
        <li class="sidebar-list"><a class="sidebar-link sidebar-title link-nav" href="/balance_load" title="Bakiye Ekle">
            <i data-feather="dollar-sign"></i><span>Bakiye Ekle</span>
        </a>
        </li>
        <!-- Destek Sistemi -->
        <li class="sidebar-list"><a class="sidebar-link sidebar-title link-nav" href="/support" title="Destek Sistemi">
            <i data-feather="help-circle"></i><span>Destek Sistemi</span>
        </a>
        </li>
        <!-- Hesap -->
        <li class="sidebar-list"><a class="sidebar-link sidebar-title" href="#">
            <i class="icofont-ui-user"></i><span> Hesap</span></a>
            <ul class="sidebar-submenu">
                <li><a href="/profile" title="Profil"> Profil</a></li>
                <li><a href="/api_key" title="Api"> Api</a></li>
                <li><a href="/change_username" title="İsim Değiştir"> İsim Değiştir</a></li>
                <li><a href="/change_pass" title="Şifre Değiştir"> Şifre Değiştir</a></li>
                <li><a href="/logout" title="Çıkış Yap"> Çıkış Yap</a></li>
            </ul>
        </li>
        <!-- Destek
        <li class="sidebar-list">
            <a class="sidebar-link sidebar-title link-nav" href="/support" title="Destek">
            <i class="fa-solid fa-messages-question"></i>
            <span> Destek</span>
            </a>
        </li> -->
        <!-- SSS -->
        <li class="sidebar-list">
            <a class="sidebar-link sidebar-title link-nav" href="/#faqs" title="SSS">
            <i class="fa-solid fa-circle-question"></i>
            <span> S.S.S</span>
            </a>
        </li>
        <!-- Kullanıcı Sözleşmesi -->
        <li class="sidebar-list">
            <a class="sidebar-link sidebar-title link-nav" href="/terms" title="Kullanıcı Sözleşmesi">
            <i class="fa-solid fa-gavel"></i>
            <span> Kullanıcı Sözleşmesi</span>
            </a>
        </li>
    </ul>
    <!--<div class="sidebar-img-section">
        <div class="sidebar-img-content"><img class="img-fluid" src="/dash_assets/assets/images/side-bar.png" alt="">
        <h4>Yardım Lazım mı?</h4><a class="txt">Destek Talebi Açarak Kolaylıkla Yardım<br>Alabilirsiniz!</a><a class="btn btn-secondary" href="/support"><i class="fa-solid fa-circle-question"></i> Destek</a>
        </div>
    </div>-->
    `
    return r
};
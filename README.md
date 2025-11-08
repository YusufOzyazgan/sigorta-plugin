# InsurUp Connect

WordPress için geliştirilmiş, API tabanlı sigorta yönetim sistemi. Trafik, Kasko, Konut, DASK ve TSS sigortaları için teklif alma, varlık yönetimi ve poliçe takibi özelliklerini sunar.

## 📋 Özellikler

- **Çoklu Sigorta Türü Desteği**: Trafik, Kasko, Konut, DASK ve TSS sigortaları için teklif alma
- **Kullanıcı Yönetimi**: SMS doğrulamalı giriş/kayıt sistemi
- **Varlık Yönetimi**: Araç ve konut varlıklarını kaydetme ve düzenleme
- **Teklif ve Poliçe Takibi**: Kullanıcıların aldığı teklifleri ve aktif poliçelerini görüntüleme
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu, modern arayüz
- **Bootstrap 5 Entegrasyonu**: Profesyonel ve şık tasarım
- **Font Awesome İkonları**: Görsel zenginlik için ikon desteği

## 🚀 Kurulum

1. Plugin dosyalarını WordPress `wp-content/plugins/insurup-connection/` dizinine yükleyin
2. WordPress admin panelinden **Eklentiler** > **Yüklü Eklentiler** bölümüne gidin
3. **InsurUp Connect** eklentisini aktifleştirin
4. **InsurUp Connect** menüsünden admin sayfasına gidin ve gerekli ayarları yapın

## 📝 Gereksinimler

- WordPress 5.0 veya üzeri
- PHP 7.4 veya üzeri
- Aktif internet bağlantısı (API çağrıları için)
- Lisans doğrulaması (WithSolver ile iletişime geçin)

## 🎯 Kullanım

### Shortcode'lar

Plugin, aşağıdaki shortcode'ları kullanarak sayfalarınızda sigorta modüllerini gösterebilirsiniz:

#### Ana Modüller

- `[panel]` - Kullanıcı dashboard alanı
- `[tc_phone_login]` - SMS doğrulamalı giriş/kayıt formu
- `[bilgilerim]` - Kullanıcı kişisel bilgiler ekranı
- `[varliklarim]` - Kullanıcının kayıtlı varlıkları (araç, konut)

#### Sigorta Teklif Modülleri

- `[trafik]` - Trafik sigortası teklif formu
- `[kasko]` - Kasko sigortası teklif formu
- `[konut]` - Konut sigortası teklif formu
- `[dask]` - DASK sigortası teklif formu
- `[tss_form]` - Tamamlayıcı Sağlık Sigortası (TSS) teklif formu

#### Takip Modülleri

- `[tekliflerim]` - Kullanıcının aldığı teklifler listesi
- `[policelerim]` - Kullanıcının aktif poliçeleri

#### Yardımcı Modüller

- `[user_avatar_dropdown]` - Login olmuş kullanıcı için avatar dropdown menüsü (Header/Menü bölgesine eklenmeli)
- `[warranties_modal]` - Teminat/coverage modal bileşeni (Tema footer'ına bir kez eklenmeli)
- `[payment_callback]` - Ödeme dönüş callback'i için ayrı bir sayfada kullanılmalı

### Önerilen Sayfa Yapısı

1. **Giriş Sayfası**: `[tc_phone_login]`
2. **Panel Sayfası**: `[panel]`
3. **Trafik Teklifi**: `[trafik]`
4. **Kasko Teklifi**: `[kasko]`
5. **Konut Teklifi**: `[konut]`
6. **DASK Teklifi**: `[dask]`
7. **TSS Teklifi**: `[tss_form]`
8. **Tekliflerim**: `[tekliflerim]`
9. **Policelerim**: `[policelerim]`
10. **Varlıklarım**: `[varliklarim]`
11. **Hesabım**: `[bilgilerim]`
1

### Header ve Footer Entegrasyonu

- **Header/Menü**: `[user_avatar_dropdown]` shortcode'unu header veya menü bölgesine ekleyin
- **Footer**: `[warranties_modal]` shortcode'unu tema footer'ına bir kez ekleyin

## 🎨 Tasarım Özellikleri

- **Responsive**: Tüm cihazlarda mükemmel görünüm
- **Dark Mode Desteği**: Sistem temasına uyumlu
- **Bootstrap 5**: Modern ve şık UI komponentleri
- **Font Awesome 6**: Zengin ikon kütüphanesi
- **Nunito Sans Font**: Okunabilir ve modern tipografi
- **Tema Uyumluluğu**: Mevcut WordPress temanızın font ve renklerini kullanır

## 🔧 Teknik Detaylar

### Kullanılan Teknolojiler

- **Frontend**: Bootstrap 5.3.3, Bootstrap Select, Font Awesome 6, jQuery
- **Backend**: WordPress Plugin API, AJAX, REST API
- **Veritabanı**: WordPress Custom Tables (bekleyen teklifler için)

### API Entegrasyonu

Plugin, InsurUp API'si ile iletişim kurmak için aşağıdaki fonksiyonları kullanır:

- `apiGetFetch()` - GET istekleri
- `apiPostFetch()` - POST istekleri
- `apiPutFetch()` - PUT istekleri
- `apiDeleteFetch()` - DELETE istekleri

### Önemli Dosyalar

- `insurup-connection.php` - Ana plugin dosyası
- `includes/functions.js` - Global JavaScript fonksiyonları
- `includes/helper-functions.php` - PHP yardımcı fonksiyonları
- `includes/pages/` - Sayfa modülleri
- `includes/assets/js/` - JavaScript modülleri
- `includes/assets/css/` - CSS stilleri

## 📱 Özellikler Detayı

### Varlık Yönetimi

- **Araç Kaydı**: Plakalı ve plakasız araç kaydı
- **Konut Kaydı**: Konut bilgileri ve adres yönetimi
- **Düzenleme**: Kayıtlı varlıkları düzenleme ve güncelleme
- **Silme**: Varlık silme işlemleri

### Teklif Sistemi

- **Hızlı Teklif**: Müşteri ve varlık bilgileriyle hızlı teklif alma
- **Çoklu Ürün**: Birden fazla sigorta şirketinden teklif karşılaştırma
- **Teminat Detayları**: Her teklif için detaylı teminat bilgileri
- **Teklif Geçerlilik**: Teklif süresi takibi (1 gün)

### Poliçe Yönetimi

- **Aktif Poliçeler**: Kullanıcının aktif poliçelerini görüntüleme
- **Poliçe Detayları**: Poliçe bilgileri ve teminatlar
- **Durum Takibi**: Poliçe durumu ve geçerlilik bilgileri

## 🔐 Güvenlik

- WordPress nonce doğrulaması
- AJAX güvenlik kontrolleri
- API endpoint güvenliği
- Kullanıcı yetkilendirme kontrolleri
- XSS ve SQL injection koruması

## 🐛 Sorun Giderme

### Yaygın Sorunlar

1. **Lisans Hatası**: Lisans doğrulaması başarısız olursa WithSolver ile iletişime geçin
2. **API Bağlantı Hatası**: İnternet bağlantınızı kontrol edin
3. **Shortcode Görünmüyor**: Sayfayı yenileyin ve cache'i temizleyin
4. **Selectpicker Sorunları**: Sayfayı yenileyin veya tarayıcı cache'ini temizleyin

### Debug Modu

Hata ayıklama için WordPress `WP_DEBUG` modunu aktifleştirebilirsiniz:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

## 📞 Destek

- **Geliştirici**: WithSolver
- **Instagram**: [@withsolver](https://www.instagram.com/withsolver)
- **LinkedIn**: [WithSolver](https://www.linkedin.com/company/108621048)
- **Discord**: [Discord Sunucusu](https://discord.gg/64cAMFgA)

## 📄 Lisans

Bu plugin, WithSolver tarafından geliştirilmiştir. Lisans bilgileri için WithSolver ile iletişime geçin.

## 🔄 Güncellemeler

### Versiyon 1.0

- İlk sürüm (InsurUp Connect olarak yeniden adlandırıldı)
- Trafik, Kasko, Konut, DASK ve TSS sigortaları desteği
- Kullanıcı yönetimi ve varlık yönetimi
- Teklif ve poliçe takibi
- Responsive tasarım
- Dark mode desteği

## 🤝 Katkıda Bulunma

Bu plugin kapalı kaynaklıdır. Katkıda bulunmak için WithSolver ile iletişime geçin.

## 📚 Ek Kaynaklar

- [WordPress Plugin Geliştirme](https://developer.wordpress.org/plugins/)
- [Bootstrap 5 Dokümantasyonu](https://getbootstrap.com/docs/5.3/)
- [Font Awesome İkonları](https://fontawesome.com/icons)

---

**Not**: Bu plugin, InsurUp API'si ile entegre çalışır. API bağlantı bilgileri ve lisans doğrulaması için WithSolver ile iletişime geçin.


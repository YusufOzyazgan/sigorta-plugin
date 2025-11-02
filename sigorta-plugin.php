<?php
/*
Plugin Name: Sigorta Plugin
Description: Sigorta API tabanlı dashboard ve sayfalar.
Version: 1.0
Author: WithSolver
*/

if (!defined('ABSPATH'))
    exit;


function sigorta_enqueue_scripts()
{

    // Elementor editörde çalışmayı durdur
    if (class_exists('\Elementor\Plugin') && \Elementor\Plugin::$instance->editor->is_edit_mode()) {
        return; // JS/CSS yükleme yok, JSON hatası engellendi
    }

    // Bootstrap
    wp_enqueue_style('bootstrap-css', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css', array(), '5.3.3');
    wp_enqueue_script('bootstrap-js', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js', array('jquery'), '5.3.3', true);

    // Bootstrap Select
    wp_enqueue_style('bootstrap-select-css', 'https://cdn.jsdelivr.net/npm/bootstrap-select@1.14.0-beta3/dist/css/bootstrap-select.min.css', array('bootstrap-css'), '1.14.0-beta3');
    wp_enqueue_script('bootstrap-select-js', 'https://cdn.jsdelivr.net/npm/bootstrap-select@1.14.0-beta3/dist/js/bootstrap-select.min.js', array('jquery', 'bootstrap-js'), '1.14.0-beta3', true);

    // Font Awesome
        wp_enqueue_style(
        'nunito-sans','https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&display=swap', array(), // Dependencies
        null // Versiyon (null bırakabilirsin)
    );
    wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

    // Plugin CSS
    wp_enqueue_style('sigorta-style', plugin_dir_url(__FILE__) . 'includes/assets/css/styles.css');

    // Plugin JS
    wp_enqueue_script(
        'sigorta-functions',
        plugin_dir_url(__FILE__) . 'includes/assets/js/functions.js',
        array('jquery', 'bootstrap-js', 'bootstrap-select-js'),
        '1.1',
        true
    );

  
}
add_action('wp_enqueue_scripts', 'sigorta_enqueue_scripts');


add_action('wp_ajax_sigorta_get_data', 'sigorta_get_data');
add_action('wp_ajax_nopriv_sigorta_get_data', 'sigorta_get_data');

// Admin sayfasında plugin CSS'ini yükle
function sigorta_enqueue_admin_assets($hook_suffix)
{
    // Sadece eklenti admin sayfasında yükle
    $is_sigorta_admin = isset($_GET['page']) && $_GET['page'] === 'sigorta-plugin-welcome';
    if (!$is_sigorta_admin) {
        return;
    }

    // Fontlar ve temel CSS gerekirse
    wp_enqueue_style(
        'nunito-sans',
        'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&display=swap',
        array(),
        null
    );

    // Plugin genel stilleri (bilgiler listesi tasarımı burada)
    wp_enqueue_style('sigorta-style', plugin_dir_url(__FILE__) . 'includes/assets/css/styles.css', array(), null);
}
add_action('admin_enqueue_scripts', 'sigorta_enqueue_admin_assets');

function sigorta_get_data()
{

    // Elementor editörde JSON göndermeyi engelle
    if (class_exists('\Elementor\Plugin') && \Elementor\Plugin::$instance->editor->is_edit_mode()) {
        wp_send_json_error(['message' => 'Editör modunda devre dışı']);
        wp_die();
    }

    // Normal AJAX response
    $data = array(
        'success' => true,
        'info' => 'Sigorta verisi geldi'
    );

    wp_send_json_success($data);
    wp_die();
}

/**
 * Yardımcı fonksiyonlar ve sayfalar
 */
require_once plugin_dir_path(__FILE__) . 'includes/helper-functions.php';
require_once plugin_dir_path(__FILE__) . 'includes/pages/login-register.php';
require_once plugin_dir_path(__FILE__) . 'includes/pages/bilgilerim.php';
require_once plugin_dir_path(__FILE__) . 'includes/pages/tekliflerim.php';
require_once plugin_dir_path(__FILE__) . 'includes/pages/policelerim.php';
require_once plugin_dir_path(__FILE__) . 'includes/pages/varliklarim.php';
require_once plugin_dir_path(__FILE__) . 'includes/pages/trafik.php';
require_once plugin_dir_path(__FILE__) . 'includes/pages/tss.php';
require_once plugin_dir_path(__FILE__) . 'includes/pages/dask.php';
require_once plugin_dir_path(__FILE__) . 'includes/pages/konut.php';
require_once plugin_dir_path(__FILE__) . 'includes/pages/kasko.php';
require_once plugin_dir_path(__FILE__) . 'includes/pages/callback.php';

require_once plugin_dir_path(__FILE__) . 'includes/pages/dashboard.php';
require_once plugin_dir_path(__FILE__) . 'includes/loginMenu.php';
require_once plugin_dir_path(__FILE__) . 'includes/assets/components/warrantiesModal.php';


/**
 * Admin: Karşılama ve Shortcodes sayfası
 */
function sigorta_plugin_register_admin_page()
{
    add_menu_page(
        'Sigorta Plugin',
        'Sigorta Plugin',
        'manage_options',
        'sigorta-plugin-welcome',
        'sigorta_plugin_render_admin_page',
        'dashicons-shield',
        56
    );
    
    // Bekleyen Teklifler alt menüsü
    add_submenu_page(
        'sigorta-plugin-welcome',
        'Bekleyen Teklifler',
        'Bekleyen Teklifler',
        'manage_options',
        'sigorta-bekleyen-teklifler',
        'sigorta_bekleyen_teklifler_render_page'
    );
    
    // Tablo oluşturma test sayfası (gizli, sadece admin için)
    if (current_user_can('manage_options')) {
        add_submenu_page(
            null, // Parent slug - gizli sayfa
            'Tablo Oluştur',
            'Tablo Oluştur',
            'manage_options',
            'sigorta-create-table',
            'sigorta_create_table_manual'
        );
    }
}
add_action('admin_menu', 'sigorta_plugin_register_admin_page');

function sigorta_plugin_render_admin_page()
{
    ?>
    <div class="wrap" style="font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <style>
            /* Bu sayfada admin uyarıları (Elementor güncelle vb.) gizle */
            #wpbody-content > .notice,
            #wpbody-content > .update-nag,
            #wpbody-content > .updated,
            #wpbody-content > .error,
            #wpbody-content > .welcome-panel,
            #wpbody-content .e-notice,
            #wpbody-content .elementor-message,
            #wpbody-content .elementor-update-message,
            #footer-thankyou,
            .wrap .notice,
            .wrap .update-nag { display: none !important; }
            /* Footer'ı aşağı sabitle ve içerik çakışmasını önle */
            #wpcontent { padding-bottom: 60px !important; }
            #wpfooter { position: fixed; left: 0; right: 0; bottom: 0; }
            .sigorta-hero {background: linear-gradient(135deg, #2f6fef 0%, #7aa6ff 100%); color: #fff; border-radius: 14px; padding: 28px; display:flex; align-items:center; justify-content:space-between; gap:24px; box-shadow:0 10px 30px rgba(47,111,239,0.25);}            
            .sigorta-hero h1 { margin: 0; font-size: 26px; }
            .sigorta-hero p { margin: 6px 0 0; opacity: .95; }
            .sigorta-card { background:#fff; border-radius:12px; padding:20px; box-shadow:0 6px 24px rgba(0,0,0,0.06); }
            .sigorta-grid { display:grid; grid-template-columns: 1fr; gap:16px; }
            @media (min-width: 960px) { .sigorta-grid { grid-template-columns: 1.2fr .8fr; } }
            .sigorta-kv { display:flex; gap:10px; align-items:center; color:#fff; }
            .sigorta-actions { display:flex; gap:10px; flex-wrap:wrap; margin-top:14px; }
            .sigorta-actions .button-primary { background:#fff; color:#2f6fef; border-color:#fff; }
            .sigorta-actions .button { background:rgba(255,255,255,0.12); color:#fff; border-color:rgba(255,255,255,0.25); }
            .copy-badge { cursor:pointer; padding:2px 8px; border-radius:10px; background:#eef2ff; color:#2f3a66; font-size:12px; border:1px solid #dde3ff; }
            .shortcode-cell { display:flex; align-items:center; gap:8px; }
        </style>

        <div class="sigorta-hero" style="margin-bottom:18px; margin-top:8px;">
            <div>
                <div class="sigorta-kv"><span class="dashicons dashicons-shield" style="font-size:28px;"></span><strong>Sigorta Plugin</strong></div>
                <h1>Kurduğunuz için teşekkürler!</h1>
                <p>Hızlıca başlamanız için gerekli <strong>shortcode</strong>’lar ve önerilen sayfa yerleşimleri aşağıdadır.</p>
                <div class="sigorta-actions">
                    <a href="post-new.php?post_type=page" class="button button-primary">Yeni Sayfa Oluştur</a>
                    <a href="#sigorta-shortcodes" class="button">Shortcodes Bölümüne Git</a>
                </div>
            </div>
            <div style="opacity:.9;">
                <span class="dashicons dashicons-admin-site-alt3" style="font-size:56px;"></span>
            </div>
        </div>

        <div class="sigorta-grid">
            <div class="sigorta-card">
                <h2 id="sigorta-shortcodes" style="margin-top:0;">Shortcodes</h2>
            <table class="widefat fixed" style="margin-top:10px;">
                <thead>
                    <tr>
                        <th>Shortcode</th>
                        <th>Önerilen Sayfa</th>
                        <th>Açıklama</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="shortcode-cell"><code>[panel]</code> <span class="copy-badge" data-copy="[panel]">Kopyala</span></td>
                        <td>Panel</td>
                        <td>Kullanıcı <strong>dashboard</strong> alanı.</td>
                    </tr>
                    <tr>
                        <td class="shortcode-cell"><code>[tc_phone_login]</code> <span class="copy-badge" data-copy="[tc_phone_login]">Kopyala</span></td>
                        <td>Giriş / Kayıt</td>
                        <td>SMS doğrulamalı <strong>login/register</strong> formu.</td>
                    </tr>
                    <tr>
                        <td class="shortcode-cell"><code>[bilgilerim]</code> <span class="copy-badge" data-copy="[bilgilerim]">Kopyala</span></td>
                        <td>Hesabım</td>
                        <td>Kullanıcı kişisel bilgiler ekranı.</td>
                    </tr>
                    <tr>
                        <td class="shortcode-cell"><code>[varliklarim]</code> <span class="copy-badge" data-copy="[varliklarim]">Kopyala</span></td>
                        <td>Varlıklarım</td>
                        <td>Kullanıcının kayıtlı varlıkları listesi.</td>
                    </tr>
                    <tr>
                        <td class="shortcode-cell"><code>[trafik]</code> <span class="copy-badge" data-copy="[trafik]">Kopyala</span></td>
                        <td>Trafik Teklifi</td>
                        <td>Trafik sigortası <strong>teklif</strong> formu.</td>
                    </tr>
                    <tr>
                        <td class="shortcode-cell"><code>[kasko]</code> <span class="copy-badge" data-copy="[kasko]">Kopyala</span></td>
                        <td>Kasko Teklifi</td>
                        <td>Kasko <strong>teklif</strong> formu.</td>
                    </tr>
                    <tr>
                        <td class="shortcode-cell"><code>[konut]</code> <span class="copy-badge" data-copy="[konut]">Kopyala</span></td>
                        <td>Konut Teklifi</td>
                        <td>Konut <strong>teklif</strong> formu.</td>
                    </tr>
                    <tr>
                        <td class="shortcode-cell"><code>[dask]</code> <span class="copy-badge" data-copy="[dask]">Kopyala</span></td>
                        <td>DASK Teklifi</td>
                        <td>DASK <strong>teklif</strong> formu.</td>
                    </tr>
                    <tr>
                        <td class="shortcode-cell"><code>[tss_form]</code> <span class="copy-badge" data-copy="[tss_form]">Kopyala</span></td>
                        <td>Tamamlayıcı Sağlık</td>
                        <td>TSS <strong>teklif</strong> formu.</td>
                    </tr>
                    <tr>
                        <td class="shortcode-cell"><code>[tekliflerim]</code> <span class="copy-badge" data-copy="[tekliflerim]">Kopyala</span></td>
                        <td>Tekliflerim</td>
                        <td>Kullanıcının aldığı <strong>teklif</strong>ler listesi.</td>
                    </tr>
                    <tr>
                        <td class="shortcode-cell"><code>[policelerim]</code> <span class="copy-badge" data-copy="[policelerim]">Kopyala</span></td>
                        <td>Policelerim</td>
                        <td>Kullanıcının aktif <strong>poliseler</strong>i.</td>
                    </tr>
                    <tr>
                        <td class="shortcode-cell"><code>[payment_callback]</code> <span class="copy-badge" data-copy="[payment_callback]">Kopyala</span></td>
                        <td>Ödeme Callback (gizli)</td>
                        <td>Ödeme dönüş <strong>callback</strong>’i için ayrı bir sayfada kullanılmalı.</td>
                    </tr>
                    <tr>
                        <td class="shortcode-cell"><code>[user_avatar_dropdown]</code> <span class="copy-badge" data-copy="[user_avatar_dropdown]">Kopyala</span></td>
                        <td>Header / Menü Bölgesi</td>
                        <td>Login olmuş kullanıcı için <strong>avatar dropdown</strong> menüsü.</td>
                    </tr>
                    <tr>
                        <td class="shortcode-cell"><code>[warranties_modal]</code> <span class="copy-badge" data-copy="[warranties_modal]">Kopyala</span></td>
                        <td>Global (Tema Footer)</td>
                        <td>Garanti/coverage <strong>modal</strong> bileşeni; sayfa genelinde bir kez eklenmeli.</td>
                    </tr>
                </tbody>
            </table>
            </div>

            <div class="sigorta-card">
                <h2 style="margin-top:0;">Hızlı Başlangıç</h2>
                <ol style="margin-top:8px;">
                    <li>WordPress’te <strong>Sayfalar</strong> > <strong>Yeni Ekle</strong> deyin.</li>
                    <li>İlgili sayfaya uygun <strong>shortcode</strong>’u ekleyin ve yayımlayın.</li>
                    <li><strong>Header</strong>/menü bölgesine <code>[user_avatar_dropdown]</code> ekleyerek kullanıcı menüsünü gösterin.</li>
                    <li>Tema <strong>footer</strong>’ına bir kez <code>[warranties_modal]</code> ekleyin.</li>
                </ol>
                <hr>
                <h3>Önerilen Sayfalar</h3>
                <ul style="margin-top:6px;">
                    <li>Giriş: <code>[tc_phone_login]</code></li>
                    <li>Panel: <code>[panel]</code></li>
                    <li>Trafik/Kasko/Konut/DASK/TSS Teklif: <code>[trafik]</code>, <code>[kasko]</code>, <code>[konut]</code>, <code>[dask]</code>, <code>[tss_form]</code></li>
                    <li>Tekliflerim/Policelerim: <code>[tekliflerim]</code>, <code>[policelerim]</code></li>
                    <li>Varlıklarım/Hesabım: <code>[varliklarim]</code>, <code>[bilgilerim]</code></li>
                </ul>
                <!-- Admin sayfasında sadece kendi ekranında info kutusu göster -->
                 <hr style="margin-top:15px;">
                <h2 style="margin-top:30px;">Bilgiler</h2>
                <ol class="sigorta-plugin-info-list">
                    <li>
                        <b>Eklenti, WordPress sitenizde sitenizin seçili yazı tipini (fontunu) otomatik olarak kullanır.</b><br>
                        Tasarım bütünlüğünü bozmadan, mevcut tema tipografisi ile uyumlu şekilde çalışır. Ekstra bir ayar yapmanıza gerek yoktur.
                    </li>
                    <li>
                        Mobil ve masaüstü uyumludur, responsive tasarım kullanır.
                    </li>
                    <li>
                        Kendi özel tıklama/kopyala kolaylığı ile kısa kodlar bir tıkla kopyalanabilir.
                    </li>
                    <li>
                        Kullandığınız temanın renklerini ve komponentlerini bozmaz, kendi alanında çalışır.
                    </li>
                    <li>
                        Her bir kısa kodu sadece ilgili sayfada bir kez eklemeniz yeterlidir.
                    </li>
                </ol>
            </div>
            
        </div>

            <div style="margin-top:24px;">
                <h2>Bizi Takip Edin</h2>
                <p style="color:#555;">Güncellemeler ve duyurular için sosyal medya hesaplarımızı takip edin.</p>
                <div style="display:flex;gap:12px;flex-wrap:wrap;">
                    <a href="https://www.instagram.com/withsolver" target="_blank" class="button button-primary" style="display:inline-flex;align-items:center;gap:8px;">
                        <span class="dashicons dashicons-instagram"></span> Instagram
                    </a>
                    <a href="https://www.linkedin.com/company/108621048" target="_blank" class="button" style="display:inline-flex;align-items:center;gap:8px;">
                        <span class="dashicons dashicons-admin-users"></span> LinkedIn
                    </a>
                    <a href="https://discord.gg/64cAMFgA" target="_blank" class="button" style="display:inline-flex;align-items:center;gap:8px;">
                        <span class="dashicons dashicons-format-chat"></span> Discord
                    </a>
                </div>
            </div>
        </div>
        <script>
            (function(){
                function fallbackCopy(text) {
                    var ta = document.createElement('textarea');
                    ta.value = text;
                    ta.setAttribute('readonly', '');
                    ta.style.position = 'absolute';
                    ta.style.left = '-9999px';
                    document.body.appendChild(ta);
                    ta.select();
                    try { document.execCommand('copy'); } catch(_) {}
                    document.body.removeChild(ta);
                }

                async function copyText(text) {
                    try {
                        if (navigator.clipboard && window.isSecureContext) {
                            await navigator.clipboard.writeText(text);
                        } else {
                            fallbackCopy(text);
                        }
                        return true;
                    } catch (err) {
                        fallbackCopy(text);
                        return false;
                    }
                }

                document.addEventListener('click', async function(e){
                    var btn = e.target.closest('.copy-badge');
                    if(!btn) return;
                    e.preventDefault();
                    e.stopPropagation();
                    var txt = btn.getAttribute('data-copy');
                    if(!txt) return;
                    var ok = await copyText(txt);
                    var prev = btn.textContent;
                    btn.textContent = ok ? 'Kopyalandı' : 'Kopyalanamadı';
                    setTimeout(function(){ btn.textContent = prev || 'Kopyala'; }, 1400);
                });
            })();

            // Sadece Elementor güncelle uyarısını hedef al ve gizle
            (function(){
                try {
                    var elAnchor = document.querySelector('#wpbody-content a[href*="elementor/elementor.php"], #wpbody-content a[href*="elementor%2Felementor.php"]');
                    if (elAnchor) {
                        var notice = elAnchor.closest('.notice, .update-nag, .updated, .error');
                        if (notice) {
                            notice.style.display = 'none';
                        }
                    }
                } catch(_) {}
            })();
        </script>
    </div>
    <?php
}

// Plugin aktif edildiğinde tabloyu oluştur
register_activation_hook(__FILE__, 'sigorta_create_bekleyen_teklifler_table');

// Plugin her yüklendiğinde tabloyu kontrol et ve yoksa oluştur
add_action('plugins_loaded', 'sigorta_create_bekleyen_teklifler_table');

// Admin init'te de kontrol et (ekstra güvenlik için)
add_action('admin_init', 'sigorta_create_bekleyen_teklifler_table');

// Admin sayfası render fonksiyonu
function sigorta_bekleyen_teklifler_render_page() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'sigorta_bekleyen_teklifler';
    
    // jQuery ve AJAX URL'yi localize et
    wp_enqueue_script('jquery');
    wp_localize_script('jquery', 'ajaxurl', admin_url('admin-ajax.php'));
    
    // Önce tabloyu kontrol et ve yoksa oluştur
    $table_created = sigorta_create_bekleyen_teklifler_table();
    $table_exists = sigorta_table_exists($table_name);
    
    // Bekleyen teklifleri getir
    $teklifler = [];
    if ($table_exists) {
        $teklifler = $wpdb->get_results("SELECT * FROM $table_name ORDER BY created_at DESC", ARRAY_A);
    }
    
    ?>
    <div class="wrap">
        <h1>Bekleyen Teklifler</h1>
        
        <?php if (!$table_exists): ?>
            <div class="notice notice-error">
                <p><strong>Hata:</strong> Veritabanı tablosu oluşturulamadı!</p>
                <p>Tablo Adı: <code><?php echo esc_html($table_name); ?></code></p>
                <p>Hata: <code><?php echo esc_html($wpdb->last_error ?: 'Bilinmeyen hata'); ?></code></p>
                <p>
                    <a href="<?php echo admin_url('admin.php?page=sigorta-create-table'); ?>" class="button">
                        Tabloyu Manuel Oluşturmayı Dene
                    </a>
                </p>
            </div>
        <?php elseif (!$table_created && !empty($wpdb->last_error)): ?>
            <div class="notice notice-warning">
                <p>Tablo oluşturma sırasında uyarı oluştu: <?php echo esc_html($wpdb->last_error); ?></p>
            </div>
        <?php endif; ?>
        
        <?php if (empty($teklifler) && $table_exists): ?>
            <div class="notice notice-info">
                <p>Henüz bekleyen teklif bulunmamaktadır.</p>
            </div>
        <?php else: ?>
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th style="width: 4%;">ID</th>
                        <th style="width: 12%;">Teklif ID</th>
                        <th style="width: 12%;">Ürün ID</th>
                        <th style="width: 25%;">Müşteri Bilgileri</th>
                        <th style="width: 22%;">Teklif Bilgileri</th>
                        <th style="width: 10%;">Durum</th>
                        <th style="width: 15%;">Tarih</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($teklifler as $teklif): 
                        // JSON decode - Çoklu escape karakterleri için temizleme
                        $customer_raw = $teklif['customer_data'];
                        $proposal_raw = $teklif['proposal_data'];
                        
                        // Eğer zaten array ise (oldukça nadir), direkt kullan
                        if (is_array($customer_raw)) {
                            $customer_data = $customer_raw;
                            $customer_error = JSON_ERROR_NONE;
                        } else {
                            // String ise decode et - önce wp_unslash, sonra stripslashes
                            $customer_json = wp_unslash($customer_raw);
                            // Çift escape kontrolü - maksimum 3 kez temizle
                            for ($i = 0; $i < 3; $i++) {
                                $prev_customer = $customer_json;
                                $customer_json = stripslashes($customer_json);
                                if ($customer_json === $prev_customer) break;
                            }
                            
                            json_last_error();
                            $customer_data = json_decode($customer_json, true);
                            $customer_error = json_last_error();
                        }
                        
                        // Proposal için aynı işlem
                        if (is_array($proposal_raw)) {
                            $proposal_data = $proposal_raw;
                            $proposal_error = JSON_ERROR_NONE;
                        } else {
                            $proposal_json = wp_unslash($proposal_raw);
                            for ($i = 0; $i < 3; $i++) {
                                $prev_proposal = $proposal_json;
                                $proposal_json = stripslashes($proposal_json);
                                if ($proposal_json === $prev_proposal) break;
                            }
                            
                            json_last_error();
                            $proposal_data = json_decode($proposal_json, true);
                            $proposal_error = json_last_error();
                        }
                    ?>
                        <tr>
                            <td><?php echo esc_html($teklif['id']); ?></td>
                            <td><code style="font-size: 11px;"><?php echo esc_html(substr($teklif['proposal_id'], 0, 20)) . '...'; ?></code></td>
                            <td><code style="font-size: 11px;"><?php echo esc_html(substr($teklif['product_id'], 0, 20)) . '...'; ?></code></td>
                            <td>
                                <?php if ($customer_data && is_array($customer_data)): ?>
                                    <div style="line-height: 1.6;">
                                        <?php if (!empty($customer_data['fullName'])): ?>
                                            <strong style="display: block; margin-bottom: 5px; color: #1d2327;"><?php echo esc_html($customer_data['fullName']); ?></strong>
                                        <?php endif; ?>
                                        <?php if (!empty($customer_data['identityNumber'])): ?>
                                            <small style="display: block; color: #50575e;">TC: <strong><?php echo esc_html($customer_data['identityNumber']); ?></strong></small>
                                        <?php endif; ?>
                                        <?php if (!empty($customer_data['primaryPhoneNumber']['number'])): ?>
                                            <small style="display: block; color: #50575e;">Tel: <strong><?php echo esc_html($customer_data['primaryPhoneNumber']['number']); ?></strong></small>
                                        <?php endif; ?>
                                        <?php if (!empty($customer_data['primaryEmail'])): ?>
                                            <small style="display: block; color: #50575e;">Email: <strong><?php echo esc_html($customer_data['primaryEmail']); ?></strong></small>
                                        <?php endif; ?>
                                        <?php if (!empty($customer_data['birthDate'])): ?>
                                            <small style="display: block; color: #50575e;">Doğum: <strong><?php echo esc_html($customer_data['birthDate']); ?></strong></small>
                                        <?php endif; ?>
                                        <?php if (!empty($customer_data['city']['text']) || !empty($customer_data['district']['text'])): ?>
                                            <small style="display: block; color: #50575e;">📍 
                                                <?php 
                                                $loc = [];
                                                if (!empty($customer_data['city']['text'])) $loc[] = $customer_data['city']['text'];
                                                if (!empty($customer_data['district']['text'])) $loc[] = $customer_data['district']['text'];
                                                echo esc_html(implode(' / ', $loc));
                                                ?>
                                            </small>
                                        <?php endif; ?>
                                    </div>
                                <?php else: ?>
                                    <em style="color: #d63638; font-size: 11px;">
                                        <?php if ($customer_error !== JSON_ERROR_NONE): ?>
                                            JSON Hatası: <?php echo esc_html(json_last_error_msg()); ?><br>
                                            <small style="color: #999; word-break: break-all;">Raw (ilk 200 karakter): <?php echo esc_html(substr($customer_raw, 0, 200)); ?>...</small>
                                        <?php else: ?>
                                            Bilgi yok
                                        <?php endif; ?>
                                    </em>
                                <?php endif; ?>
                            </td>
                            <td>
                                <?php if ($proposal_data && is_array($proposal_data)): ?>
                                    <div style="line-height: 1.6;">
                                        <?php if (!empty($proposal_data['insuranceCompanyName'])): ?>
                                            <strong style="display: block; margin-bottom: 5px; color: #1d2327;">🏢 <?php echo esc_html($proposal_data['insuranceCompanyName']); ?></strong>
                                        <?php endif; ?>
                                        <?php 
                                        $premium = !empty($proposal_data['premium']) ? floatval($proposal_data['premium']) : (!empty($proposal_data['grossPremium']) ? floatval($proposal_data['grossPremium']) : 0);
                                        if ($premium > 0): 
                                        ?>
                                            <small style="display: block; color: #2271b1; font-weight: 600; font-size: 13px; margin: 3px 0;">
                                                💰 <?php echo esc_html(number_format($premium, 2, ',', '.') . ' ₺'); ?>
                                            </small>
                                        <?php endif; ?>
                                        <?php if (!empty($proposal_data['installmentNumber'])): ?>
                                            <small style="display: block; color: #50575e;">Taksit: <strong><?php echo esc_html($proposal_data['installmentNumber']); ?>x</strong></small>
                                        <?php endif; ?>
                                        <?php if (!empty($proposal_data['insuranceCompanyProposalNumber'])): ?>
                                            <small style="display: block; color: #50575e; margin-top: 3px;">
                                                <code style="font-size: 10px; background: #f0f0f1; padding: 2px 4px; border-radius: 3px;"><?php echo esc_html($proposal_data['insuranceCompanyProposalNumber']); ?></code>
                                            </small>
                                        <?php endif; ?>
                                    </div>
                                <?php else: ?>
                                    <em style="color: #d63638;">
                                        <?php if ($proposal_error !== JSON_ERROR_NONE): ?>
                                            JSON Hatası: <?php echo esc_html(json_last_error_msg()); ?>
                                        <?php else: ?>
                                            Bilgi yok
                                        <?php endif; ?>
                                    </em>
                                <?php endif; ?>
                            </td>
                            <td>
                                <select class="status-select" 
                                        name="status[<?php echo esc_attr($teklif['id']); ?>]" 
                                        data-id="<?php echo esc_attr($teklif['id']); ?>"
                                        data-original="<?php echo esc_attr($teklif['status']); ?>">
                                    <option value="pending" <?php selected($teklif['status'], 'pending'); ?>>Bekliyor</option>
                                    <option value="completed" <?php selected($teklif['status'], 'completed'); ?>>Tamamlandı</option>
                                    <option value="cancelled" <?php selected($teklif['status'], 'cancelled'); ?>>İptal</option>
                                </select>
                            </td>
                            <td>
                                <small style="color: #50575e;">
                                    <?php 
                                    $date = strtotime($teklif['created_at']);
                                    echo esc_html(date_i18n('d.m.Y', $date)); 
                                    ?><br>
                                    <span style="color: #8c8f94;"><?php echo esc_html(date_i18n('H:i', $date)); ?></span>
                                </small>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            
            <?php if (!empty($teklifler)): ?>
                <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 6px;">
                    <button type="button" id="saveStatusesBtn" class="button button-primary" style="padding: 10px 20px; font-size: 14px; font-weight: 600;">
                        Değişiklikleri Kaydet
                    </button>
                    <span id="saveStatusMessage" style="margin-left: 15px; font-size: 13px;"></span>
                </div>
            <?php endif; ?>
            
            <style>
                .status-select {
                    min-width: 130px;
                    padding: 6px 10px;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 600;
                    border: 2px solid #ddd;
                }
                .status-select.changed {
                    border-color: #0073aa;
                    background: #e7f5ff;
                }
            </style>
            
            <script>
            jQuery(document).ready(function($) {
                // Status değişikliklerini takip et
                $('.status-select').on('change', function() {
                    var select = $(this);
                    var original = select.data('original');
                    var current = select.val();
                    
                    if (original === current) {
                        select.removeClass('changed');
                    } else {
                        select.addClass('changed');
                    }
                });
                
                // Kaydet butonu
                $('#saveStatusesBtn').on('click', function() {
                    var btn = $(this);
                    var message = $('#saveStatusMessage');
                    var updates = [];
                    
                    // Değişen status'ları topla
                    $('.status-select.changed').each(function() {
                        updates.push({
                            id: $(this).data('id'),
                            status: $(this).val()
                        });
                    });
                    
                    if (updates.length === 0) {
                        message.html('<span style="color: #856404;">Değişiklik yapılmadı.</span>');
                        return;
                    }
                    
                    btn.prop('disabled', true).text('Kaydediliyor...');
                    message.html('<span style="color: #0073aa;">Kaydediliyor...</span>');
                    
                    $.ajax({
                        url: ajaxurl,
                        type: 'POST',
                        data: {
                            action: 'sigorta_bulk_update_status',
                            updates: JSON.stringify(updates),
                            nonce: '<?php echo wp_create_nonce('sigorta_bulk_update'); ?>'
                        },
                        success: function(response) {
                            if (response.success) {
                                message.html('<span style="color: #155724;">✓ ' + updates.length + ' kayıt güncellendi.</span>');
                                $('.status-select.changed').each(function() {
                                    $(this).data('original', $(this).val()).removeClass('changed');
                                });
                                
                                setTimeout(function() {
                                    location.reload();
                                }, 1500);
                            } else {
                                message.html('<span style="color: #dc3545;">✗ Hata: ' + (response.data?.message || 'Bilinmeyen hata') + '</span>');
                                btn.prop('disabled', false).text('Değişiklikleri Kaydet');
                            }
                        },
                        error: function() {
                            message.html('<span style="color: #dc3545;">✗ Bir hata oluştu.</span>');
                            btn.prop('disabled', false).text('Değişiklikleri Kaydet');
                        }
                    });
                });
            });
            </script>
        <?php endif; ?>
    </div>
    <?php
}

/**
 * AJAX: Bekleyen teklif kaydet
 */
function sigorta_save_bekleyen_teklif() {
    global $wpdb;
    
    // Önce tabloyu kontrol et ve yoksa oluştur
    $table_created = sigorta_create_bekleyen_teklifler_table();
    
    $table_name = $wpdb->prefix . 'sigorta_bekleyen_teklifler';
    
    // Tablo oluşturuldu mu kontrol et
    if (!sigorta_table_exists($table_name)) {
        wp_send_json_error([
            'message' => 'Veritabanı tablosu oluşturulamadı. Lütfen WordPress admin paneline giriş yapın ve Bekleyen Teklifler sayfasını açın.',
            'debug' => [
                'table_name' => $table_name,
                'db_error' => $wpdb->last_error,
                'table_created_result' => $table_created
            ]
        ]);
    }
    
    $proposal_id = sanitize_text_field($_POST['proposal_id'] ?? '');
    $product_id = sanitize_text_field($_POST['product_id'] ?? '');
    
    // JavaScript'ten gelen veriler zaten JSON string olarak geliyor
    // Olduğu gibi kaydet - decode/encode yapmadan
    $customer_data_json = isset($_POST['customer_data']) ? wp_unslash($_POST['customer_data']) : '';
    $proposal_data_json = isset($_POST['proposal_data']) ? wp_unslash($_POST['proposal_data']) : '';
    
    if (empty($proposal_id) || empty($product_id)) {
        wp_send_json_error(['message' => 'Gerekli alanlar eksik']);
    }
    
    // Tekrar kontrolü - aynı proposal_id ve product_id varsa kaydetme
    $existing = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM $table_name WHERE proposal_id = %s AND product_id = %s",
        $proposal_id,
        $product_id
    ));
    
    if ($existing > 0) {
        wp_send_json_error(['message' => 'Bu teklif zaten kayıtlı']);
    }
    
    $result = $wpdb->insert(
        $table_name,
        [
            'proposal_id' => $proposal_id,
            'product_id' => $product_id,
            'customer_data' => $customer_data_json,
            'proposal_data' => $proposal_data_json,
            'status' => 'pending'
        ],
        ['%s', '%s', '%s', '%s', '%s']
    );
    
    if ($result) {
        wp_send_json_success(['message' => 'Teklif başarıyla kaydedildi']);
    } else {
        wp_send_json_error([
            'message' => 'Kayıt sırasında hata oluştu',
            'debug' => [
                'db_error' => $wpdb->last_error,
                'table_name' => $table_name
            ]
        ]);
    }
}
add_action('wp_ajax_sigorta_save_bekleyen_teklif', 'sigorta_save_bekleyen_teklif');
add_action('wp_ajax_nopriv_sigorta_save_bekleyen_teklif', 'sigorta_save_bekleyen_teklif');

/**
 * AJAX: Toplu status güncelle
 */
function sigorta_bulk_update_status() {
    if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'sigorta_bulk_update')) {
        wp_send_json_error(['message' => 'Güvenlik kontrolü başarısız']);
    }
    
    if (!current_user_can('manage_options')) {
        wp_send_json_error(['message' => 'Yetki yok']);
    }
    
    global $wpdb;
    $table_name = $wpdb->prefix . 'sigorta_bekleyen_teklifler';
    
    $updates_json = isset($_POST['updates']) ? wp_unslash($_POST['updates']) : '';
    $updates = json_decode($updates_json, true);
    
    if (!is_array($updates) || empty($updates)) {
        wp_send_json_error(['message' => 'Geçersiz veri']);
    }
    
    $allowed_statuses = ['pending', 'completed', 'cancelled'];
    $success_count = 0;
    $error_count = 0;
    
    foreach ($updates as $update) {
        $teklif_id = intval($update['id'] ?? 0);
        $new_status = sanitize_text_field($update['status'] ?? '');
        
        if ($teklif_id <= 0 || !in_array($new_status, $allowed_statuses)) {
            $error_count++;
            continue;
        }
        
        $result = $wpdb->update(
            $table_name,
            ['status' => $new_status],
            ['id' => $teklif_id],
            ['%s'],
            ['%d']
        );
        
        if ($result !== false) {
            $success_count++;
        } else {
            $error_count++;
        }
    }
    
    if ($success_count > 0) {
        wp_send_json_success([
            'message' => $success_count . ' kayıt güncellendi' . ($error_count > 0 ? ', ' . $error_count . ' hata oluştu' : ''),
            'success_count' => $success_count,
            'error_count' => $error_count
        ]);
    } else {
        wp_send_json_error(['message' => 'Hiçbir kayıt güncellenemedi']);
    }
}
add_action('wp_ajax_sigorta_bulk_update_status', 'sigorta_bulk_update_status');

/**
 * Manuel tablo oluşturma sayfası (debug için)
 */
function sigorta_create_table_manual() {
    if (!current_user_can('manage_options')) {
        wp_die('Yetkiniz yok');
    }
    
    global $wpdb;
    $table_name = $wpdb->prefix . 'sigorta_bekleyen_teklifler';
    
    $table_exists_before = sigorta_table_exists($table_name);
    $result = sigorta_create_bekleyen_teklifler_table();
    $table_exists_after = sigorta_table_exists($table_name);
    
    ?>
    <div class="wrap">
        <h1>Tablo Oluşturma Testi</h1>
        <div style="background: #fff; padding: 20px; border: 1px solid #ccc; margin-top: 20px;">
            <h2>Sonuçlar:</h2>
            <ul>
                <li><strong>Tablo Adı:</strong> <?php echo esc_html($table_name); ?></li>
                <li><strong>Önce Durum:</strong> <?php echo $table_exists_before ? '✅ Var' : '❌ Yok'; ?></li>
                <li><strong>Oluşturma Sonucu:</strong> <?php echo $result ? '✅ Başarılı' : '❌ Başarısız'; ?></li>
                <li><strong>Sonra Durum:</strong> <?php echo $table_exists_after ? '✅ Var' : '❌ Yok'; ?></li>
                <li><strong>Veritabanı Hatası:</strong> <?php echo esc_html($wpdb->last_error ?: 'Yok'); ?></li>
            </ul>
            <p>
                <a href="<?php echo admin_url('admin.php?page=sigorta-bekleyen-teklifler'); ?>" class="button button-primary">
                    Bekleyen Teklifler Sayfasına Dön
                </a>
            </p>
        </div>
    </div>
    <?php
}


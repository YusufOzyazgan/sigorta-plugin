<?php
/*
Plugin Name: Sigorta Plugin
Description: Sigorta API tabanlı dashboard ve sayfalar.
Version: 1.0
Author: Y-B
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
                <h3>Önerilen Sayfalar</h3>
                <ul style="margin-top:6px;">
                    <li>Giriş: <code>[tc_phone_login]</code></li>
                    <li>Panel: <code>[panel]</code></li>
                    <li>Trafik/Kasko/Konut/DASK/TSS Teklif: <code>[trafik]</code>, <code>[kasko]</code>, <code>[konut]</code>, <code>[dask]</code>, <code>[tss_form]</code></li>
                    <li>Tekliflerim/Policelerim: <code>[tekliflerim]</code>, <code>[policelerim]</code></li>
                    <li>Varlıklarım/Hesabım: <code>[varliklarim]</code>, <code>[bilgilerim]</code></li>
                </ul>
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


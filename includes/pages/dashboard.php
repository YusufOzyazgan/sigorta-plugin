<?php
if (!defined('ABSPATH'))
    exit;


function dashboard_enqueue_scripts()
{
    wp_enqueue_style(
        'dashboard-css',
        plugin_dir_url(dirname(__FILE__)) . 'assets/css/dashboard.css',
        array(),
        '1.0.0'
    );

    wp_enqueue_script(
        'dashboard-js',
        dirname(__DIR__) . '/assets/js/dashboard.js',

        array('jquery'),
        '1.0.0',
        true
    );

}
add_action('wp_enqueue_scripts', 'dashboard_enqueue_scripts');

function call_icon($icon_name, $width = 24, $height = 24, $alt = '')
{
    $icon_path = plugin_dir_url(dirname(__FILE__)) . 'assets/icons/' . $icon_name . '.svg';
    return '<img src="' . esc_url($icon_path) . '" alt="' . esc_attr($alt) . '" width="' . intval($width) . '" height="' . intval($height) . '">';
}
function dashboard_shortcode()
{
    ob_start();


    ?>
 
    <div class="dashboard-wrapper">
        <!-- Sidebar -->
        <aside class="dashboard-sidebar">
            <div class="sidebar-header">
                <div class="sidebar-header-icon">
                    <?php echo call_icon("insurance", 40, 40, "Panel") ?>
                </div>
            </div>
            <nav class="sidebar-menu">
                <a href="/panel/" class="sidebar-menu-item active" data-tab="dashboard">
                    <div class="sidebar-menu-icon">
                        <?php echo call_icon("insurance", 24, 24, "dashboard") ?>
                    </div>
                    <span class="sidebar-menu-text">Ana Sayfa</span>
                </a>
                <a href="/varliklarim/" class="sidebar-menu-item" data-tab="varliklarim">
                    <div class="sidebar-menu-icon">
                        <?php echo call_icon("home", 24, 24, "home") ?>
                    </div>
                    <span class="sidebar-menu-text">Varlıklarım</span>
                </a>
                <a href="/policelerim/" class="sidebar-menu-item" data-tab="policelerim">
                    <div class="sidebar-menu-icon">
                        <?php echo call_icon("insurance", 24, 24, "insurance") ?>
                    </div>
                    <span class="sidebar-menu-text">Poliçelerim</span>
                </a>
                <a href="/tekliflerim/" class="sidebar-menu-item" data-tab="tekliflerim">
                    <div class="sidebar-menu-icon">
                        <?php echo call_icon("teklifler", 24, 24, "teklifler") ?>
                    </div>
                    <span class="sidebar-menu-text">Tekliflerim</span>
                </a>
                <a href="/bilgilerim/" class="sidebar-menu-item" data-tab="bilgilerim">
                    <div class="sidebar-menu-icon">
                        <?php echo call_icon("user", 24, 24, "user") ?>
                    </div>
                    <span class="sidebar-menu-text">Bilgilerim</span>
                </a>
            </nav>
        </aside>

        <!-- Main Content -->
        <div class="dashboard-main">
            <div class="sigorta-section">
            <h2 class="sigorta-section-title">Sigorta Teklifleri</h2>
            <p class="sigorta-section-subtitle">İhtiyacınıza uygun sigorta türünü seçin ve hemen teklif alın</p>
            
            <div class="sigorta-cards-container">
                <a href="/trafik-sigortasi/" class="sigorta-card" style="text-decoration: none; color: inherit;">
                    <div class="sigorta-card-icon trafik-icon">
                        <?php echo call_icon("car", 50, 50, "Trafik Sigortası") ?>
                    </div>
                    <div class="sigorta-card-content">
                        <h3 class="sigorta-card-title">Trafik Sigortası</h3>
                        <p class="sigorta-card-description">Araçlarınız için zorunlu trafik sigortası teklifi alın</p>
                        <div class="sigorta-card-footer">
                            <span class="sigorta-card-action">Teklif Al <i class="fas fa-arrow-right"></i></span>
                        </div>
                    </div>
                </a>

                <a href="/kasko/" class="sigorta-card" style="text-decoration: none; color: inherit;">
                    <div class="sigorta-card-icon kasko-icon">
                        <?php echo call_icon("car", 50, 50, "Kasko") ?>
                    </div>
                    <div class="sigorta-card-content">
                        <h3 class="sigorta-card-title">Kasko</h3>
                        <p class="sigorta-card-description">Araçlarınız için kapsamlı kasko sigortası teklifi alın</p>
                        <div class="sigorta-card-footer">
                            <span class="sigorta-card-action">Teklif Al <i class="fas fa-arrow-right"></i></span>
                        </div>
                    </div>
                </a>

                <a href="/tamamlayici-saglik-sigortasi/" class="sigorta-card" style="text-decoration: none; color: inherit;">
                    <div class="sigorta-card-icon tss-icon">
                        <?php echo call_icon("insurance", 50, 50, "TSS") ?>
                    </div>
                    <div class="sigorta-card-content">
                        <h3 class="sigorta-card-title">TSS</h3>
                        <p class="sigorta-card-description">Trafik Sigortası Sorgulama ile mevcut poliçenizi kontrol edin</p>
                        <div class="sigorta-card-footer">
                            <span class="sigorta-card-action">Sorgula <i class="fas fa-arrow-right"></i></span>
                        </div>
                    </div>
                </a>

                <a href="/konut-sigortasi/" class="sigorta-card" style="text-decoration: none; color: inherit;">
                    <div class="sigorta-card-icon konut-icon">
                        <?php echo call_icon("home", 50, 50, "Konut Sigortası") ?>
                    </div>
                    <div class="sigorta-card-content">
                        <h3 class="sigorta-card-title">Konut Sigortası</h3>
                        <p class="sigorta-card-description">Evinizi koruyan kapsamlı konut sigortası teklifi alın</p>
                        <div class="sigorta-card-footer">
                            <span class="sigorta-card-action">Teklif Al <i class="fas fa-arrow-right"></i></span>
                        </div>
                    </div>
                </a>

                <a href="/dask/" class="sigorta-card" style="text-decoration: none; color: inherit;">
                    <div class="sigorta-card-icon dask-icon">
                        <?php echo call_icon("home", 50, 50, "DASK") ?>
                    </div>
                    <div class="sigorta-card-content">
                        <h3 class="sigorta-card-title">DASK</h3>
                        <p class="sigorta-card-description">Zorunlu Deprem Sigortası için hemen teklif alın</p>
                        <div class="sigorta-card-footer">
                            <span class="sigorta-card-action">Teklif Al <i class="fas fa-arrow-right"></i></span>
                        </div>
                    </div>
                </a>
            </div>
        </div>

        <div id="tabContent"></div>
        </div>
    </div>
    <div id="notif"
        style="position: fixed; bottom: 80px; right: 20px;  padding: 10px 20px; border-radius: 5px; color: #fff; background: none; display: block; z-index: 9999; ">
        <div style="margin-bottom: 300px; margin-top: 270px;"></div>
    </div>


    <?php
    return ob_get_clean();
}

add_shortcode('panel', 'dashboard_shortcode');



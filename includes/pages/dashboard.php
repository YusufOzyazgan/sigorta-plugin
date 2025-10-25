<?php
if (!defined('ABSPATH'))
    exit;


function dashboard_enqueue_scripts()
{
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
// imgnin içindeki url = /home/withsolverdemo/public_html/sigortapiri/wp-content/plugins/sigorta-plugin/includes/assets/icons/user.svg
// resmin ftpdeki url'i  =  ftp://yusuf2%40withsolverdemo.com@ftp.withsolverdemo.com/public_html/sigortapiri/wp-content/plugins/sigorta-plugin/includes/assets/icons/user.svg
function dashboard_shortcode()
{
    ob_start();


    ?>
    <!-- <div class="dashboard-topbar ">
        <div class="logo"><a href="<?php echo home_url(); ?>">Site Ana Sayfa</a></div>
        <div class="topbar-menu">
            <a href="#" class="dashboard-tab active" data-tab="dashboard">Kontrol Paneli</a>
            <a href="#" class="dashboard-tab" data-tab="varliklarim">Varlıklarım</a>
            <a href="#" class="dashboard-tab" data-tab="policelerim">Poliçelerim</a>
            <a href="#" class="dashboard-tab" data-tab="tekliflerim">Tekliflerim</a>
             Teklif Al Dropdown
            <div class="dropdown">
                <a class="btn  dropdown-toggle" href="#" role="button" id="teklifDropdown" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    Teklif Al
                </a>
                <ul class="dropdown-menu" aria-labelledby="teklifDropdown">
                    <li><a class="dropdown-item dashboard-tab" href="#" data-tab="trafik">Trafik Sigortası</a></li>
                    <li><a class="dropdown-item dashboard-tab" href="#" data-tab="kasko">Kasko Sigortası</a></li>
                    <li><a class="dropdown-item dashboard-tab" href="#" data-tab="konut">Konut Sigortası</a></li>
                    <li><a class="dropdown-item dashboard-tab" href="#" data-tab="dask">DASK Sigortası</a></li>
                    <li><a class="dropdown-item dashboard-tab" href="#" data-tab="tss">TSS Sigortası</a></li>
                </ul>
            </div>
            <a href="#" class="dashboard-tab" data-tab="bilgilerim">Bilgilerim</a>
        </div>
        <div class="header-right">
            <div id="onLogin" style="display:none;">
                <div class="user-avatar" id="userAvatar">
                    <?php echo call_icon('user', 32, 32, 'Kullanıcı'); ?>
                </div>

                <div class="user-dropdown" id="userDropdown">
                    <a href="#" id="bilgilerimBtn">Bilgilerim</a>
                    <a href="#" id="logoutBtn">Güvenli Çıkış <?php echo call_icon("logout", 24, 24, "logout") ?></a>
                </div>
            </div>
            <div style="display:none;" id="onLogout">
                <a href="#" style="text-decoration: none;" id="loginBtn">Giriş Yap/Kayıt Ol</a>
            </div>



        </div>
    </div> -->
    <div class="dashboard-main">

        <div class="dashboard-boxes" id="dashboardBoxes">
            <div class="dashboard-box" data-tab="varliklarim">
                <div><?php echo call_icon("home", 30, 30, "home") ?></div>
                <h3>Varlıklarım</h3>
                <p>Varlıklarınızı yönetin</p>
            </div>
            <div class="dashboard-box" data-tab="policelerim">
                <div><?php echo call_icon("insurance", 35, 35, "insurance") ?></div>

                <h3>Poliçelerim</h3>
                <p>Aktif poliçelerinizi görüntüleyin</p>
            </div>
            <div class="dashboard-box" data-tab="tekliflerim">
                <div><?php echo call_icon("teklifler", 35, 35, "teklifler") ?></div>

                <h3>Tekliflerim</h3>
                <p>Tekliflerinizi inceleyin</p>
            </div>
            <div class="dashboard-box" data-tab="bilgilerim">
                <div><?php echo call_icon("user", 30, 30, "user") ?></div>

                <h3>Bilgilerim</h3>
                <p>Bilgilerinizi inceleyin</p>
            </div>
        </div>

        <div id="tabContent"></div>
    </div>
    <div id="notif"
        style="position: fixed; bottom: 80px; right: 20px;  padding: 10px 20px; border-radius: 5px; color: #fff; background: none; display: block; z-index: 9999; ">
        <div style="margin-bottom: 300px; margin-top: 270px;"></div>
    </div>


    <?php
    return ob_get_clean();
}

add_shortcode('panel', 'dashboard_shortcode');



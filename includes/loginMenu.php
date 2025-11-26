<?php
if (!defined('ABSPATH'))
    exit;


function loginMenu_enqueue_scripts()
{
    // CSS ekle
    wp_enqueue_style(
        'loginMenu-css',
        plugin_dir_url(__FILE__) . 'assets/css/styles.css',
        array(),
        '1.0.0'
    );
    
    // JavaScript
    wp_enqueue_script(
        'loginMenu-js',
         plugin_dir_url(__FILE__) . 'assets/js/loginMenu.js',
        array('jquery'),
        '1.0.0',
        true
    );
}

add_action('wp_enqueue_scripts', 'loginMenu_enqueue_scripts');
function user_avatar_dropdown_shortcode()
{
    ob_start();
    ?>
    <div class="dashboard-topbar" >
        <div class="header-right">
            <div id="onLogin" style="display:none;">
                <div class="user-info-container">
                    <div class="user-avatar"  id="userAvatar"><?php echo call_icon('user', 32, 32, 'Kullanıcı'); ?></div>
                    <span id="userName"></span>
                </div>
                
                <div class="user-dropdown" id="userDropdown">
                   
                    <a href="#" id="panelBtn"><?php echo call_icon("insurance2", 20, 20, "dashboard") ?> Panel</a>
                    <a href="#" id="bilgilerimBtn"><?php echo call_icon("user", 20, 20, "user") ?>  Bilgilerim</a>
                    <a href="#" id="varliklarimBtn"><?php echo call_icon("home", 20, 20, "home") ?> Varlıklarım</a>
                    <a href="#" id="tekliflerimBtn"><?php echo call_icon("teklifler", 20, 20, "teklifler") ?>  Tekliflerim</a>
                    <a href="#" id="policelerimBtn"><?php echo call_icon("insurance", 20, 20, "user") ?>  Poliçelerim</a>
                    <a href="#" id="logoutBtn">Güvenli Çıkış <?php echo call_icon("logout", 20, 20, "logout"); ?></a>
                </div>
            </div>

            <div id="onLogout" style="display:none;">
                <button  id="loginBtn" class="btn-login">Giriş Yap<br><hr class="my-1">Üye Ol</button>
            </div>
        </div>
    </div>

      <script>
        document.addEventListener("DOMContentLoaded", async function () {
            if (await window.loginMenuModule) {
              await  window.loginMenuModule();
            } else {
                console.error("loginMenuModule tanımlı değil!");    
            }
        });
    </script>

   
    <?php
    return ob_get_clean();
}
add_shortcode('user_avatar_dropdown', 'user_avatar_dropdown_shortcode');

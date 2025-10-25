<?php
if (!defined('ABSPATH'))
    exit;


function loginMenu_enqueue_scripts()
{
    // city.js
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
                <div class="user-avatar"  id="userAvatar"><?php echo call_icon('user', 32, 32, 'Kullanıcı'); ?></div>
                <div class="user-dropdown" id="userDropdown">
                   
                    <a href="#" id="varliklarimBtn"><?php echo call_icon("home", 24, 24, "home") ?>  Varlıklarım</a>
                    <a href="#" id="bilgilerimBtn"><?php echo call_icon("user", 24, 24, "user") ?>  Bilgilerim</a>
                    <a href="#" id="tekliflerimBtn"><?php echo call_icon("teklifler", 24, 24, "teklifler") ?>  Tekliflerim</a>
                    <a href="#" id="policelerimBtn"><?php echo call_icon("insurance", 24, 24, "user") ?>  Poliçelerim</a>
                    <a href="#" id="logoutBtn">Güvenli Çıkış <?php echo call_icon("logout", 24, 24, "logout"); ?></a>
                </div>
            </div>

            <div id="onLogout" style="display:none;">
                <button  id="loginBtn" class="btn-login">Giriş Yap  Kayıt Ol</button>
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

    <style>
        .dashboard-topbar {
            display: flex;
            justify-content: center;
            /* sağa yasla, dilersen center yapabilirsin */
            align-items: center;
            /* dikey ortala */
            padding: 10px 20px;
            /* background-color: #fff; */
            /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
            position: sticky;
            top: 0;
            z-index: 999;
        }

        .header-right {
            display: flex;
            align-items: center;
            /* dikey ortala */
            justify-content: center;
            /* yatay ortala */
            gap: 10px;
            position: relative;
        }

        .user-avatar {
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            /* avatar içindeki svg ortalansın */
        }


        .user-dropdown {
            display: none;
            position: absolute;
            top: 100%;
            right: 0;
            /* background: #fff; */
            /* border: 1px solid #ddd; */
            border-radius: 6px;
            /* box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15); */
            min-width: 150px;
            padding: 5px 0;
            z-index: 1000;
        }

        .user-dropdown a {
            display: block;
            padding: 8px 15px;
            color: #333;
            text-decoration: none;
        }

        .user-dropdown a:hover {
            background-color: #f2f2f2;
        }

        #loginBtn.btn-login {
            padding: 8px 15px;
            border: none;
            border-radius: 6px;
            background: #00A4FF;
            color: #fff;
            cursor: pointer;
            font-size: 14px;
        }
    </style>
    <?php
    return ob_get_clean();
}
add_shortcode('user_avatar_dropdown', 'user_avatar_dropdown_shortcode');

<?php
if (!defined('ABSPATH'))
    exit;
function login_register_enqueue_scripts() {
    // CSS ekle
    wp_enqueue_style(
        'login-register-css',
        plugin_dir_url(dirname(__FILE__)) . 'assets/css/styles.css',
        array(),
        '1.0.0'
    );
    
    // JavaScript
    wp_enqueue_script(
        'login-register-js',
        plugin_dir_url(dirname(__FILE__)) . 'assets/js/login-register.js',
        array('jquery'),
        '1.0.0',
        true
    );
}
add_action('wp_enqueue_scripts', 'login_register_enqueue_scripts');

function tc_phone_login_form_shortcode()
{
    ob_start(); 
	?>

    <div class="container d-flex justify-content-center align-items-center vh-100">
        <div class="card shadow-lg p-4" style="max-width: 500px; width: 100%;">
            <div class="text-center mb-4">
                <i class="fas fa-shield-alt fa-2x text-primary mb-3"></i>
                <h2>InsurUp Portalı</h2>
            </div>

            <!-- Toggle Buttons -->
            <div class="d-flex gap-2 justify-content-center mb-3">
                <button class="btn bg-primary" id="btnLogin">Giriş Yap</button>
                <button class="btn bg-light text-dark" id="btnRegister">Kayıt Ol</button>
            </div>

            <form id="loginForm">
                <div class="mb-3 text-start">
                    <label for="tc-login" class="form-label">TC Kimlik No</label>
                    <input type="text" class="form-control shadow" id="tc-login" placeholder="TC Kimlik No" maxlength="11"
                        required>
                </div>
                <div class="mb-3 text-start">
                    <label for="phone-login" class="form-label">Cep Telefonu</label>
                    <input type="tel" class="form-control shadow" id="phone-login" placeholder="Cep Telefonu (5xx)"
                        maxlength="10" required>
                </div>
                <div class="mb-3 text-start" id="dobArea" style="display:none;">
                    <label for="dob" class="form-label">Doğum Tarihiniz</label>
                    <input type="date" class="form-control shadow" id="dob">
                </div>
                <div class="mb-3 text-start" id="mfaArea" style="display:none;">
                    <label for="mfaCode" class="form-label">SMS Kodunu Giriniz</label>
                    <input type="text" class="form-control shadow" id="mfaCode" maxlength="6">
                </div>

                <div class="d-flex justify-content-center mt-3">
                    <button type="submit" class="btn btn-primary w-75" id="submitBtn">Giriş Yap</button>
                </div>
            </form>

            <div id="message" class="mt-3 text-center"></div>
        </div>
    </div>

     <script>
        document.addEventListener("DOMContentLoaded", function () {
            if (window.loadLoginRegisterModule) {
                window.loadLoginRegisterModule();
            } else {
                console.error("loadLoginRegisterModule tanımlı değil!");
            }
        });
    </script>

    <?php
    return ob_get_clean();
}
add_shortcode('tc_phone_login', 'tc_phone_login_form_shortcode');

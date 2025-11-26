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
    
    // JavaScript - functions.js'e bağımlı olarak yükle
    wp_enqueue_script(
        'login-register-js',
        plugin_dir_url(dirname(__FILE__)) . 'assets/js/login-register.js',
        array('jquery', 'sigorta-functions'),
        '1.0.0',
        true
    );
}
add_action('wp_enqueue_scripts', 'login_register_enqueue_scripts');

function tc_phone_login_form_shortcode()
{
    ob_start(); 
	?>

    <div class="container" style="max-width: 500px; margin: 40px auto; padding: 20px;">
        <div class="card shadow-lg" style="width: 100%; border: none; border-radius: 20px; overflow: hidden; position: relative; z-index: 1;">
            <div class="card-body p-4 p-md-5">
                <div class="text-center mb-4">
                    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; box-shadow: 0 8px 20px rgba(13, 110, 253, 0.3);">
                        <i class="fas fa-shield-alt fa-2x text-white"></i>
                    </div>
                    <h2 style="color: #2d3436; font-weight: 700; margin-bottom: 10px;">Hoşgeldiniz</h2>
                    <p class="text-muted" style="font-size: 0.95rem;">Hesabınıza giriş yapın veya yeni hesap oluşturun</p>
                </div>

                <!-- Toggle Buttons -->
                <div class="d-flex gap-2 justify-content-center mb-4" style="background: #f8f9fa; padding: 6px; border-radius: 12px;">
                    <button class="btn flex-fill" id="btnLogin" style="border-radius: 8px; font-weight: 600; transition: all 0.3s;">Giriş Yap</button>
                    <button class="btn flex-fill" id="btnRegister" style="border-radius: 8px; font-weight: 600; transition: all 0.3s;">Kayıt Ol</button>
                </div>

                <form id="loginForm">
                    <div class="mb-3 text-start">
                        <label for="tc-login" class="form-label fw-semibold" id="idLabel" style="color: #2d3436; margin-bottom: 8px;">TC Kimlik No</label>
                        <div class="input-group" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 10px; overflow: hidden;">
                            <input type="text" class="form-control border-0" id="tc-login" placeholder="TC Kimlik No" maxlength="11"
                                required style="padding: 12px 16px; font-size: 1rem;">
                            <button type="button" class="btn border-0" id="idTypeToggle" style="background: #f8f9fa; color: #6c757d; font-weight: 600; padding: 12px 20px; transition: all 0.3s; white-space: nowrap;">
                                <span id="toggleText">Vergi No</span>
                            </button>
                        </div>
                        <small class="text-muted d-block mt-2" id="idTypeHint" style="font-size: 0.85rem;">
                            <i class="fas fa-info-circle me-1"></i>TC Kimlik No ile devam ediyorsunuz
                        </small>
                    </div>
                    <div class="mb-3 text-start">
                        <label for="phone-login" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 8px;">Cep Telefonu</label>
                        <input type="tel" class="form-control border-0" id="phone-login" placeholder="Cep Telefonu (5xx)"
                            required style="padding: 12px 16px; font-size: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 10px;">
                    </div>
                    <div class="mb-3 text-start" id="dobArea" style="display:none;">
                        <label for="dob" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 8px;">Doğum Tarihiniz</label>
                        <input type="date" class="form-control border-0" id="dob" style="padding: 12px 16px; font-size: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 10px;">
                    </div>
                    <div class="mb-3 text-start" id="mfaArea" style="display:none;">
                        <label for="mfaCode" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 8px;">SMS Kodunu Giriniz</label>
                        <input type="text" class="form-control border-0" id="mfaCode" maxlength="6" style="padding: 12px 16px; font-size: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 10px; text-align: center; letter-spacing: 8px; font-weight: 600;">
                    </div>

                    <div class="d-flex justify-content-center mt-4">
                        <button type="submit" class="btn w-100" id="submitBtn" style="background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%); border: none; color: white; padding: 14px; font-weight: 600; font-size: 1.05rem; border-radius: 10px; box-shadow: 0 4px 15px rgba(13, 110, 253, 0.4); transition: all 0.3s;">
                            Giriş Yap
                        </button>
                    </div>
                </form>

                <div id="message" class="mt-3 text-center"></div>
            </div>
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

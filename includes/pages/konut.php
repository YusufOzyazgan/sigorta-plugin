<?php
if (!defined('ABSPATH'))
    exit;

function konut_enqueue_scripts()
{
    wp_enqueue_style(
        'konut-css',
        plugin_dir_url(dirname(__FILE__)) . 'assets/css/konut.css',
        array(),
        '1.0.0'
    );

    wp_enqueue_script(
        'city-js',
        plugin_dir_url(dirname(__FILE__)) . 'assets/js/city.js',
        array('jquery'),
        '1.0.0',
        true
    );

    wp_enqueue_script(
        'konut-modal-js',
        plugin_dir_url(dirname(__FILE__)) . 'assets/js/konut-modal.js',
        array('jquery', 'bootstrap'),
        '1.0.0',
        true
    );

    wp_enqueue_script(
        'konut-js',
        plugin_dir_url(dirname(__FILE__)) . 'assets/js/konut.js',
        array('jquery', 'city-js'),
        '1.0.0',
        true
    );

    wp_localize_script('konut-js', 'konutVars', [
        'homeIconPath' => plugin_dir_url(dirname(__FILE__)) . 'assets/icons/home.svg',
        'customerId' => get_current_user_id()
    ]);
}
add_action('wp_enqueue_scripts', 'konut_enqueue_scripts');


function konut_shortcode()
{
    ob_start(); ?>

    <h1 class="text-center mb-4">Konut Sigortası Teklifi Al</h1>
    <div id="konut-container" style="display: flex;" class="container my-5 card shadow p-3">
        <div class="container my-4">

            <!-- Progress Bar -->
            <div class="d-flex justify-content-between mb-4" id="stepProgress">
                <div class="step active" data-step="1">
                    <div class="step-icon">1</div>
                    <div class="step-label">Kişisel Bilgiler</div>
                </div>
                <div class="step" data-step="2">
                    <div class="step-icon">2</div>
                    <div class="step-label">Konut Bilgileri</div>
                </div>
                <div class="step" data-step="3">
                    <div class="step-icon">3</div>
                    <div class="step-label">Teklif Bilgileri</div>
                </div>
            </div>

            <!-- Step 1 -->
            <?php include dirname(__DIR__) . '/assets/components/personalForm.php'; ?>

            <!-- Step 2 -->
            <div class="d-none" id="step2">
                <div id="propertyAlert" class="alert alert-warning d-none">
                    Henüz konut eklenmemiş. Lütfen "Konut Ekle" butonuna tıklayın.
                </div>

                <!-- Konut Ekle Butonu -->
                <button class="btn success-button mb-2 btn-sm ms-2"
                        style="width:20%"
                        data-bs-toggle="modal"
                        data-bs-target="#konutModal">
                    <span style="white-space: nowrap;">Konut Ekle</span>
                </button>

                <div id="propertiesList" class="row g-3 mb-3"></div>
                <div class="d-flex justify-content-between mt-3">
                    <button type="button" class="btn warning-button" id="backStep2">Geri</button>
                    <button type="button" class="btn primary-button" id="nextStep2">Teklif Al</button>
                </div>
            </div>

            <!-- Step 3 -->
            <div class="card shadow p-4 mb-4 step-card d-none" id="step3">
                <div id="offerResults"></div>
            </div>

            <!-- KONUT MODAL (Component olarak dahil edildi) -->
            <?php include dirname(__DIR__) . '/assets/components/konut-modal.php'; ?>

            <!-- Bildirim Alanı -->
            <div id="notif"
                style="position:fixed;bottom:80px;right:20px;padding:10px 20px;border-radius:5px;color:#fff;background:none;display:block;z-index:9999;">
            </div>
        </div>

        <script>
            document.addEventListener("DOMContentLoaded", async function () {
                if (window.loadKonutModule) {
                    await window.loadKonutModule(document.getElementById("konut-container"));
                } else {
                    console.error("loadKonutModule tanımlı değil!");
                }
            });
        </script>
        <script src="<?php echo plugin_dir_url(__FILE__); ?>../assets/js/konut.js"></script>
        <script src="<?php echo plugin_dir_url(__FILE__); ?>../assets/js/varliklarim.js"></script>
    </div>

    <?php return ob_get_clean();
}

add_shortcode('konut', 'konut_shortcode');

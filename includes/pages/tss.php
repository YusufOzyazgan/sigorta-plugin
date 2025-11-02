<?php
if (!defined('ABSPATH'))
    exit;


function enqueue_tss_assets()
{
    // CSS
    wp_enqueue_style(
        'tss-css',
        plugin_dir_url(__DIR__) . 'assets/css/tss.css',
        array(),
        '1.0.0'
    );

    // JS
    wp_enqueue_script(
        'tss-js',
        plugin_dir_url(__DIR__) . 'assets/js/tss.js',
        array('jquery'),
        '1.0.0',
        true
    );
}
add_action('wp_enqueue_scripts', 'enqueue_tss_assets');



function tss_form_shortcode()
{
    ob_start();
    ?>
    <div id="tssModuleContainer">
        <h2 class="text-center mb-4">Tamamlayıcı Sağlık Sigortası ile Ek Masraflara Son</h2>
        <div class="d-flex justify-content-between mb-4" id="stepProgress">
            <div class="step active" data-step="1">
                <div class="step-icon">1</div>
                <div class="step-label">Kişisel Bilgiler</div>
            </div>
            <div class="step" data-step="2">
                <div class="step-icon">2</div>
                <div class="step-label">Araç Bilgileri</div>
            </div>
            <div class="step" data-step="3">
                <div class="step-icon">3</div>
                <div class="step-label">Teklif Bilgileri</div>
            </div>
            
        </div>
        
        <div class="card shadow p-4 mb-4">
            <!-- Step 1 -->

            <?php include plugin_dir_path(dirname(__FILE__)) . 'assets/components/personalForm.php'; ?>

            <!-- Step 2 -->
            <div id="step2" class="d-none p-3">
                <form id="step2Form" class=" ">
                    <div class="row g-3">
                        <div class="col-md-6"><label>Boy (cm)</label><input type="number" class="form-control" id="height"
                                required></div>
                        <div class="col-md-6"><label>Kilo (kg)</label><input type="number" class="form-control" id="weight"
                                required></div>
                    </div>
                    <div class="mt-3 d-flex flex-column flex-md-row justify-content-between gap-2">
                        <button type="button" class="btn warning-button flex-grow-1 flex-md-grow-0" id="backStepTss" style="white-space: nowrap;">Geri</button>
                        <button type="submit" class="btn primary-button flex-grow-1 flex-md-grow-0" id="nextStep2" style="white-space: nowrap;">İlerle</button>
                    </div>
                </form>
            </div>

            <div class="card shadow p-4 mb-4 step-card d-none" id="step3">
                <div id="offerResults"></div>
            </div>
        </div>
    </div>
    <div id="notif"
        style="position:fixed;bottom:80px;right:20px;padding:10px 20px;border-radius:5px;color:#fff;background:none;display:block;z-index:9999;">
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', async function () {
            const container = document.getElementById('tssModuleContainer');
            if (container && window.loadTssModule) {
                await window.loadTssModule(container);
            }
        });
    </script>


    <?php
    return ob_get_clean();
}
add_shortcode('tss_form', 'tss_form_shortcode');

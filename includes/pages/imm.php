<?php
if (!defined('ABSPATH'))
    exit;

function imm_enqueue_scripts()
{

    wp_enqueue_style(
        'imm-css',
        plugin_dir_url(dirname(__FILE__)) . 'assets/css/imm.css',
        array(),
        '1.0.0'
    );


    wp_enqueue_script(
        'imm-js',
        plugin_dir_url(dirname(__FILE__)) . 'assets/js/imm.js',
        array('jquery'),
        '1.0.0',
        true
    );
    // icon path'i JS'e gönder
    wp_localize_script('imm-js', 'immIcons', [
        'car' => plugin_dir_url(dirname(__FILE__)) . 'assets/icons/car.svg'
    ]);

}
add_action('wp_enqueue_scripts', 'imm_enqueue_scripts');


function imm_teklif_form_shortcode()
{
    ob_start();

    ?>


    <div id="immTeklifContainer">
        <?php include dirname(__DIR__) . '/assets/components/createVehicle.php'; ?>


        <h2 class="text-center mb-4">IMM ile İşyerinizi Her Duruma Karşı Koruyun</h2>
        <!-- Progress Bar -->
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



        <div id="immTeklifForm" style="display: flex;" class="container my-5 card shadow p-3">


            <!-- Step 1 -->
            <div id="step1">
                <?php include dirname(__DIR__) . '/assets/components/personalForm.php'; ?>
            </div>

            <!-- Step 2 -->
            <div id="step2" class="d-none p-3">
                <div
                    class="d-flex flex-column flex-md-row mb-3 justify-content-between align-items-start align-items-md-center gap-2">
                    <h3 class="mb-0" style="white-space: nowrap;">Araçlarınız</h3>
                    <div class="d-flex flex-wrap gap-2 w-100 w-md-auto justify-content-md-end">
                        <button id="backStepBtn" class="btn warning-button btn-sm flex-grow-1 flex-md-grow-0"
                            style="white-space: nowrap;">Geri</button>
                        <button id="addVehicleBtn" class="btn success-button btn-sm flex-grow-1 flex-md-grow-0"
                            style="white-space: nowrap;">Araç Ekle</button>
                    </div>
                </div>
                <hr>
                <div id="vehiclesList" class="row g-3 mt-3 mb-3"></div>
                <button id="addProposal" class="primary-button mt-2 m-3 float-end">Teklif Al</button>
            </div>

            <div class="p-4 mb-4 d-none" id="step3">
                <div id="loadingResults"></div>

                <div id="offerResults"></div>
            </div>



        </div>
        <div id="notif"
            style="position:fixed;bottom:80px;right:20px;padding:10px 20px;border-radius:5px;color:#fff;background:none;display:block;z-index:9999;">
        </div>
    </div>
    <script>
        document.addEventListener("DOMContentLoaded", async function () {
            const container = document.getElementById("immTeklifContainer");
            if (window.loadimmModule) {
                await window.loadimmModule(container);
            } else {
                console.error("loadimmModule tanımlı değil!");
            }
        });


    </script>



    <?php
    return ob_get_clean();
}

add_shortcode('imm', 'imm_teklif_form_shortcode');


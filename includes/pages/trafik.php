<?php
if (!defined('ABSPATH'))
    exit;

function trafik_enqueue_scripts()
{
    wp_enqueue_style(
        'trafik-css',
        plugin_dir_url(dirname(__FILE__)) . 'assets/css/trafik.css',
        array(),
        '1.0.0'
    );
    wp_enqueue_script(
        'trafik-js',
        plugin_dir_url(dirname(__FILE__)) . 'assets/js/trafik.js',
        array('jquery'),
        '1.0.0',
        true
    );
    // icon path’i JS’e gönder
    wp_localize_script('trafik-js', 'traficIcons', [
        'car' => plugin_dir_url(dirname(__FILE__)) . 'assets/icons/car.svg'
    ]);

}
add_action('wp_enqueue_scripts', 'trafik_enqueue_scripts');


function trafik_teklif_form_shortcode()
{
    ob_start();

    ?>

    <div id="trafikTeklifContainer"></div>
    <?php include plugin_dir_path(dirname(__FILE__)) . 'assets/components/createVehicle.php'; ?>
    
    
    
    
    <!-- Progress Bar -->
    <div class="d-flex flex-nowrap flex-row justify-content-between align-items-center mb-4 w-100" id="stepProgress" style="flex-wrap: nowrap !important;">
        <div class="step active flex-grow-1" data-step="1" style="flex: 1 1 0% !important; min-width: 0;">
            <div class="step-icon">1</div>
            <div class="step-label">Kişisel Bilgiler</div>
        </div>
        <div class="step flex-grow-1" data-step="2" style="flex: 1 1 0% !important; min-width: 0;">
            <div class="step-icon">2</div>
            <div class="step-label">Araç Bilgileri</div>
        </div>
        <div class="step flex-grow-1" data-step="3" style="flex: 1 1 0% !important; min-width: 0;">
            <div class="step-icon">3</div>
            <div class="step-label">Teklif Bilgileri</div>
        </div>
        
    </div>
    
    <div id="trafikTeklifForm" style="display: flex;" class="container my-5 card shadow p-3">
        <!-- Step 1 -->
        
        <?php include plugin_dir_path(dirname(__FILE__)) . 'assets/components/personalForm.php'; ?>
        
        <!-- Step 2 -->
        <div id="step2" class="d-none p-3">
            <div class="d-flex flex-column flex-md-row mb-3 justify-content-between align-items-start align-items-md-center gap-2">
                <h3 class="mb-0" style="white-space: nowrap;">Araçlarınız</h3>
                <div class="d-flex flex-wrap gap-2 w-100 w-md-auto justify-content-md-end">
                    <button id="backStepBtn" class="btn warning-button btn-sm flex-grow-1 flex-md-grow-0" style="white-space: nowrap;">Geri</button>
                    <button id="addVehicleBtn" class="btn success-button btn-sm flex-grow-1 flex-md-grow-0" style="white-space: nowrap;">Araç Ekle</button>
                </div>
            </div>
            <hr>
            <div id="vehiclesList" class="row g-3 mt-3 mb-3"></div>
            <button id="addProposal" class="btn btn-primary mt-2 m-3 float-end">Teklif Al</button>
        </div>

        <div class="card shadow p-4 mb-4 step-card d-none" id="step3">
        <div id="loadingResults"></div>
            
        <div id="offerResults"></div>

        </div>

        <!-- Modal -->
        <div id="vehicleModal" class="modal fade" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Araç Ekle</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>Buraya araç ekleme formu gelecek...</p>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <div id="notif"
        style="position:fixed;bottom:80px;right:20px;padding:10px 20px;border-radius:5px;color:#fff;background:none;display:block;z-index:9999;">
    </div>
    <script>
        document.addEventListener("DOMContentLoaded", async function () {
            
            if (window.loadTrafikModule) {
               await window.loadTrafikModule();
            } else {
                console.error("loadTrafikModule tanımlı değil!");
            }
        });


    </script>



    <?php
    return ob_get_clean();
}

add_shortcode('trafik', 'trafik_teklif_form_shortcode');


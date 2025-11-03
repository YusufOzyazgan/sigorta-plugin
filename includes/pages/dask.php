<?php
if (!defined('ABSPATH'))
    exit;

if (!function_exists('dask_enqueue_scripts')) {
    function dask_enqueue_scripts() {
        wp_enqueue_style(
            'dask-css',
            plugin_dir_url(dirname(__FILE__)) . 'assets/css/dask.css',
            [],
            '1.0.0'
        );

        wp_enqueue_script(
            'city-js',
            plugin_dir_url(dirname(__FILE__)) . 'assets/js/city.js',
            ['jquery'],
            '1.0.0',
            true
        );

        wp_enqueue_script(
            'dask-js',
            plugin_dir_url(dirname(__FILE__)) . 'assets/js/dask.js',
            ['jquery','city-js'],
            '1.0.0',
            true
        );

        wp_localize_script('dask-js', 'daskVars', [
            'homeIconPath' => plugin_dir_url(dirname(__FILE__)) . 'assets/icons/home.svg'
        ]);
    }
}
add_action('wp_enqueue_scripts', 'dask_enqueue_scripts');



function dask_shortcode()
{
    ob_start(); ?>



    <div id="dask-container" >
        <div class="container my-4">
            <h2 class="text-center mb-4">DASK Sigortası Teklifi Al</h2>

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
            <div class="card shadow p-4 mb-4 step-card d-none" id="step2">
                <div id="propertyAlert" class="alert alert-warning d-none">
                    Henüz konut eklenmemiş. Lütfen "Konut Ekle" butonuna tıklayın.

                </div>
                <button class="btn success-button mb-2 btn-sm ms-2" data-bs-toggle="modal" style="width:20%"
                    data-bs-target="#konutModal">Konut Ekle</button>
                <div id="propertiesList" class="row g-3 mb-3"></div>
                <div class="mt-3 d-flex flex-column flex-md-row justify-content-between gap-2">
                        <button type="button" class="btn warning-button flex-grow-1 flex-md-grow-0" id="backStep2" style="white-space: nowrap;">Geri</button>
                        <button type="submit" class="btn primary-button flex-grow-1 flex-md-grow-0" id="nextStep2" style="white-space: nowrap;">İlerle</button>
                    </div>
            </div>

            <!-- Step 3 -->
            <div class="card shadow p-4 mb-4 step-card d-none" id="step3">
                <div id="offerResults"></div>
            </div>

            <!-- KONUT MODAL -->
            <div class="modal fade" id="konutModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Konut Ekle</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <?php include __DIR__ . '/konut-modal-content.php'; ?>
                        </div>
                    </div>
                </div>
            </div>

            <div id="notif"
                style="position:fixed;bottom:80px;right:20px;padding:10px 20px;border-radius:5px;color:#fff;background:none;display:block;z-index:9999;">
            </div>
        </div>

        <script>
            document.addEventListener("DOMContentLoaded", async function () {
                if (typeof window.loadDaskModule === "function") {
                    window.loadDaskModule(document.getElementById("dask-container"));
                } else {
                    console.error("loadDaskModule tanımlı değil!");
                }
            });
        </script>
    </div>

    <?php return ob_get_clean();
}
add_shortcode('dask', 'dask_shortcode');

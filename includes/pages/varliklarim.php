<?php
if (!defined('ABSPATH'))
    exit;

function varliklarim_enqueue_scripts()
{

    wp_enqueue_script(
        'varliklarim-js',
        plugin_dir_url(dirname(__FILE__)) . '/assets/js/varliklarim.js',
        array('jquery'),
        '1.0.0',
        true
    );

    // icon path’i JS’e gönder
    wp_localize_script('varliklarim-js', 'varliklarimIcons', [
        'home' => plugin_dir_url(dirname(__FILE__)) . 'assets/icons/home.svg',
        'car' => plugin_dir_url(dirname(__FILE__)) . 'assets/icons/car.svg'
    ]);

}
add_action('wp_enqueue_scripts', 'varliklarim_enqueue_scripts');



function varliklarim_shortcode()
{
    ob_start();



    $plugin_url = plugin_dir_url(dirname(__FILE__, 1));

    // Icon yolu
    $searchIconPath = $plugin_url . 'assets/icons/search.svg';

    ?>

    <div id="varliklarim-container">
        <h2 >Varlıklarım <button id="addVarlikBtn" class="btn btn-primary shadow-sm border-1 mb-1">Yeni
                Varlık Ekle</button> </h2>
        <hr>
        <div id="varliklarimModule"></div>

        <!-- Modal Genel Popup Ajax Kısmımız -->
        <div id="varlikEkleModal"
            style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); justify-content:center; align-items:center; z-index:9999; overflow:auto;">
            <div style="background:#fff; width:600px; max-width:90%; border-radius:10px; padding:20px; position:relative;">
                <h3 class="text-center">Yeni Varlık Ekle</h3>
                <button type="button" class="btn-close bg-light text-dark position-absolute top-0 end-0 m-3"
                    aria-label="Close" onclick="document.getElementById('varlikEkleModal').style.display='none'">
                </button>

                <div class="varlik-cards-container" style="display:flex; gap:20px; margin-top:20px; justify-content:center; flex-wrap: wrap;">
                    <div class="varlik-card" id="selectVehicle">
                        <div class="varlik-icon">
                            <img src="<?php echo plugin_dir_url(dirname(__FILE__)) . 'assets/icons/car.svg'; ?>" alt="Araç" />
                        </div>
                        <h4 class="varlik-title">Araç</h4>
                    </div>
                    <div class="varlik-card" id="selectProperty" data-bs-toggle="modal" data-bs-target="#konutModal">
                        <div class="varlik-icon">
                            <img src="<?php echo plugin_dir_url(dirname(__FILE__)) . 'assets/icons/home.svg'; ?>" alt="Mülk" />
                        </div>
                        <h4 class="varlik-title">Mülk</h4>
                    </div>
                </div>
            </div>
        </div>

        <!-- Araç Modalımız -->
        <?php include dirname(__DIR__) . '/assets/components/createVehicle.php'; ?>

    </div>
    <!--     Konut Modülü    **************************************  -->



    <div class="modal fade" id="konutModal" style="display:none;" tabindex="-1" aria-labelledby="konutModalLabel">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title " id="konutModalLabel">Konut Ekle</h2>
                    <button type="button" class="btn-close bg-light" data-bs-dismiss="modal" aria-label="Kapat"></button>
                </div>
                <div class="modal-body">
                    <form id="konutForm">
                        <!-- UAVT -->
                        <div class="mb-3 d-flex align-items-center">
                            <input type="text" id="uavtNo" class="form-control border me-2" placeholder="UAVT No">
                            <button type="button" class="btn btn-primary bg-primary me-2" onclick="sorgulaUavt()">Sorgula</button>
                            <i class="fas fa-question-circle text-primary" style="cursor: pointer; font-size: 1.2rem;" onclick="alert('UAVT No (Ulusal Adres Veri Tabanı Numarası), konut adres bilgilerini otomatik olarak sorgulamak için kullanılan bir numaradır. Bu numarayı girerek adres bilgilerinizi hızlıca doldurabilirsiniz.');" title="UAVT No Nedir?"></i>
                        </div>

                        <!-- Adres Bilgileri -->
                        <div class="row g-3">

                            <div class="col-md-6">
                                <label for="citySelectProperty" class="form-label">İl</label>
                                <select id="citySelectProperty" class=" w-100"
                                    data-live-search="true" title="İl Seçiniz"></select>
                            </div>

                            <div class="col-md-6">
                                <label for="districtSelect" class="form-label">İlçe</label>
                                <select id="districtSelect" class=" w-100" disabled
                                    data-live-search="true" title="Önce İl Seçiniz"></select>
                            </div>

                            <div class="col-md-6">
                                <label for="townSelect" class="form-label">Belde/Bucak</label>
                                <select id="townSelect" class=" w-100" disabled
                                    data-live-search="true" title="Önce İlçe Seçiniz"></select>
                            </div>

                            <div class="col-md-6">
                                <label for="neighborhoodSelect" class="form-label">Mahalle</label>
                                <select id="neighborhoodSelect" class=" w-100" disabled
                                    data-live-search="true" title="Önce Belde/Bucak Seçiniz"></select>
                            </div>

                            <div class="col-md-6">
                                <label for="streetSelect" class="form-label">Sokak/Cadde</label>
                                <select id="streetSelect" class=" w-100" disabled
                                    data-live-search="true" title="Önce Mahalle Seçiniz"></select>
                            </div>

                            <div class="col-md-6">
                                <label for="buildingSelect" class="form-label">Bina No/Adı</label>
                                <select id="buildingSelect" class=" w-100" disabled
                                    data-live-search="true" title="Önce Sokak/Cadde Seçiniz"></select>
                            </div>

                            <div class="col-md-6">
                                <label for="apartmentSelect" class="form-label">Daire No</label>
                                <select id="apartmentSelect" class=" w-100" disabled
                                    data-live-search="true" title="Önce Bina Seçiniz"></select>
                            </div>

                        </div>



                        <!-- Genel Bilgiler -->
                        <div class="row g-3 mt-3">
                            <div class="col-md-6">
                                <label class="form-label">Metrekare</label>
                                <input type="number" min="45" step="1" max="999" required id="squareMeter"
                                    placeholder="45 - 999 m² arasında olmalıdır" class="borderx form-control">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Yapım Yılı</label>
                                <input type="number" maxlength="4" requried id="constructionYear" class="form-control">
                            </div>
                        </div>

                        <!-- Konut Kullanım Detayları -->
                        <div class="row g-3 mt-3">
                            <div class="col-md-6">
                                <label class="form-label">Konut Kullanım Şekli</label>
                                <select id="utilizationStyle" class="form-select">

                                    <option value="HOUSE">Konut</option>
                                    <option value="BUSINESS">İşyeri</option>
                                    <option value="OTHER">Diğer</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Bina Hasar Durumu</label>
                                <select id="damageStatus" class="form-select">
                                    <option value="NONE">Hasarsız</option>
                                    <option value="SLIGHTLY_DAMAGED">Az Hasarlı</option>
                                    <option value="MODERATELY_DAMAGED">Orta Hasarlı</option>
                                    <option value="HEAVILY_DAMAGED">Ağır Hasarlı</option>
                                </select>
                            </div>
                        </div>

                        <!-- Bina Detayları -->
                        <div class="row g-3 mt-3">
                            <div class="col-md-6">
                                <label class="form-label">Bina Yapı Tarzı</label>
                                <select id="structure" class="form-select">

                                    <option value="STEEL_REINFORCED_CONCRETE">Betonarme</option>
                                    <option value="OTHER">Diğer</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Bina Kat Sayısı</label>

                                <select id="floorNumber" class="form-select">
                                    <option value="0">Bilinmiyor</option>
                                    <option value="2">1-3 Kat</option>
                                    <option value="3">4-7 Kat</option>
                                    <option value="4">8-18 Kat</option>
                                    <option value="5">19+ Kat</option>
                                </select>
                            </div>

                        </div>
                        <div class="row g-3 mt-3">
                            <div class="col-md-6">
                                <label class="form-label">Bina Sahiplik Türü</label>
                                <select id="ownershipType" class="form-select">

                                    <option value="PROPRIETOR">Mülk</option>
                                    <option value="TENANT">Kira</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Dairernin Bulunduğu Kat</label>
                                <input type="number" class="form-control" required id="whichFloor">
                            </div>

                        </div>

                        <!-- Dain-i Mürtehin -->
                        <div class="mt-4">
                            <label class="form-label d-block">Dain-i Mürtehin</label>
                            <div class="btn-group" role="group">
                                <input type="radio" class="btn-check" name="lossPayeeClause" id="0" value="null" checked>
                                <label class="btn btn-outline-secondary" for="dainNone">Yok</label>

                                <input type="radio" class="btn-check" name="lossPayeeClause" id="dainBank" value="1">
                                <label class="btn btn-outline-secondary" for="dainBank">Banka</label>

                                <input type="radio" class="btn-check" name="lossPayeeClause" id="2" value="Finans Kurumu">
                                <label class="btn btn-outline-secondary" for="dainFinans">Finans Kurumu</label>
                            </div>
                            <div id="lossPayeeProperty" style="margin-top:10px;"></div>
                        </div>
                    </form>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">İptal</button>
                    <button type="button" id="createProperty" class="btn btn-dark">Konut Oluştur</button>
                </div>
            </div>
        </div>
    </div>
    <div id="notif"
        style="position:fixed;bottom:80px;right:20px;padding:10px 20px;border-radius:5px;color:#fff;background:none;display:block;z-index:9999;">
    </div>

    <script>
        document.addEventListener("DOMContentLoaded", function () {
            const container = document.getElementById("varliklarim-container");
            if (typeof window.loadVarliklarimModule === "function") {
                window.loadVarliklarimModule(container);
            } else {
                console.error("loadVarliklarimModule tanımlı değil!");
            }
        });
    </script>

    <style>
        .bootstrap-select>.dropdown-toggle {
            background-color: white !important;
            color: black !important;
            border: 1px solid #ccc;
        }

        .borderx {
            border: 1px solid #ccc !important ;
            border-radius: 5px !important;
            padding: 6px 10px !important;
            box-sizing: border-box !important;
        }
    </style>


    <?php
    return ob_get_clean();
}
add_shortcode('varliklarim', 'varliklarim_shortcode');
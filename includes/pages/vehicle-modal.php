<?php
if (!defined('ABSPATH')) exit;
ob_start();

$plugin_url = plugin_dir_url(dirname(__FILE__, 1));
$searchIconPath = $plugin_url . 'assets/icons/search.svg';
?>

<div id="vehicleModal"
    style="display:none; height:100%; position:fixed; top: 0; left:0; width:100%; background:rgba(0,0,0,0.5); justify-content:center; align-items:flex-start; padding-top:30px; overflow:auto; z-index:1050;">
    <div style="background:#fff; width:800px; max-width:100%; border-radius:10px; padding:20px; position:relative;">
        <h2 class="text-center">Araç Ekle</h2>
        <hr>
        <button type="button" class="btn-close position-absolute top-0 end-0 m-3" aria-label="Close"
            onclick="document.getElementById('vehicleModal').style.display='none'"></button>

        <!-- Sekmeler -->
        <div style="display:flex; gap:10px; margin-bottom:15px;">
            <button id="tabPlakasiz" class="btn btn-secondary border-0 activeArea" style="flex:1;">Plakasız Araç</button>
            <button id="tabPlakali" class="btn btn-secondary border-0" style="flex:1;">Plakalı Araç</button>
        </div>

        <form id="vehicleForm">
            <!-- Plakasız Form -->
            <div id="plakasizForm">
                <!-- İl / Marka / Model / Yıl -->
                <div class="row mb-2">
                    <div class="col-md-6">
                        <label for="citySelect" class="form-label">İl Seçiniz</label>
                        <select id="citySelect" class="selectpicker form-control" title="İl Seçiniz"
                            data-live-search="true"></select>
                    </div>
                    <div class="col-md-6">
                        <label for="brandSelect" class="form-label">Marka Seçiniz</label>
                        <select id="brandSelect" class="selectpicker form-control" title="Marka Seçiniz"
                            data-live-search="true"></select>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-md-6">
                        <label for="yearInput" class="form-label">Yıl Seçiniz</label>
                        <input type="number" id="yearInput" class="form-control" value="2025">
                    </div>
                    <div class="col-md-6">
                        <label for="modelSelect" class="form-label">Model Seçiniz</label>
                        <select id="modelSelect" class="selectpicker form-control" title="Model Seçiniz"
                            data-live-search="true"></select>
                    </div>
                </div>

                <!-- Kullanım / Motor / Şasi / Yakıt -->
                <div class="row mb-3">
                    <div class="col-md-3">
                        <label for="usageInput" class="form-label">Kullanım Şekli</label>
                        <select id="usageInput" class="selectpicker form-control" title="Kullanım Şekli"
                            data-live-search="true"></select>
                    </div>
                    <div class="col-md-3">
                        <label for="engineInput" class="form-label">Motor No</label>
                        <input type="text" id="engineInput" placeholder="Motor No" class="form-control">
                    </div>
                    <div class="col-md-3">
                        <label for="chassisInput" class="form-label">Şasi No</label>
                        <input type="text" id="chassisInput" placeholder="Şasi No" class="form-control">
                    </div>
                    <div class="col-md-3">
                        <label for="fuelInput" class="form-label">Yakıt Türü</label>
                        <select id="fuelInput" class="selectpicker form-control" title="Yakıt Türü"
                            data-live-search="true"></select>
                    </div>
                </div>

                <!-- Tescil / Koltuk -->
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="registrationDate" class="form-label">Tescil Tarihi</label>
                        <input type="date" id="registrationDate" class="form-control">
                    </div>
                    <div class="col-md-6">
                        <label for="seatCount" class="form-label">Koltuk Sayısı</label>
                        <input type="number" value="5" id="seatCount" placeholder="Koltuk Adedi" class="form-control">
                    </div>
                </div>

                <!-- Eski Poliçe -->
                <h5 class="mt-3">Eski Poliçe Bilgileri</h5>
                <div class="mb-2 d-flex flex-wrap gap-2">
                    <input type="text" id="oldPolicyNo" placeholder="Poliçe No" class="form-control flex-1">
                    <input type="text" id="oldPolicyRenewalNo" placeholder="Yenileme No" class="form-control flex-1">
                    <input type="text" id="oldPolicyCompanyNo" placeholder="Şirket No" class="form-control flex-1">
                    <input type="text" id="oldPolicyAgentNo" placeholder="Acenta No" class="form-control flex-1">
                </div>

                <!-- Dain-i Mürtehin -->
                <h5 class="mt-3">Dain-i Mürtehin / Banka / Finans Kurumu</h5>
                <div class="mb-2 btn-group" role="group">
                    <input type="radio" class="btn-check" name="lienType" id="lienNone" value="none" checked>
                    <label class="btn btn-outline-secondary" for="lienNone">Yok</label>
                    <input type="radio" class="btn-check" name="lienType" id="lienBank" value="1">
                    <label class="btn btn-outline-primary" for="lienBank">Banka</label>
                    <input type="radio" class="btn-check" name="lienType" id="lienFinance" value="2">
                    <label class="btn btn-outline-success" for="lienFinance">Finans Kurumu</label>
                </div>
                <div id="lienInput" style="margin-top:10px;"></div>

                <!-- Aksesuarlar -->
                <h5 class="mt-3">Aksesuarlar</h5>
                <div class="d-flex flex-wrap gap-2">
                    <input type="number" id="accessorySound" placeholder="Ses (bedel)" class="form-control flex-1">
                    <input type="number" id="accessoryScreen" placeholder="Ekran (bedel)" class="form-control flex-1">
                    <input type="number" id="accessoryOther" placeholder="Diğer (bedel)" class="form-control flex-1">
                </div>
            </div>

            <!-- Plakalı Form -->
            <div id="plakaliForm" style="display:none;">
                <div class="row g-2">
                    <div class="col-md-6">
                        <select id="citySelectPlakali" class="selectpicker form-control mb-2" data-live-search="true"
                            title="İl Seçiniz"></select>
                    </div>
                    <div class="col-md-6">
                        <input type="text" maxlength="6" id="plateInput" placeholder="Plaka" class="form-control mb-2">
                    </div>
                    <div class="col-md-6">
                        <input type="text" id="documentSeries" placeholder="Belge Seri Kodu" class="form-control mb-2">
                    </div>
                    <div class="col-md-6">
                        <input type="text" id="documentNo" placeholder="Belge Seri No" class="form-control mb-2">
                    </div>
                    <div class="mb-3">
                        <button type="button" id="tramerBtn" class="btn btn-info" style="width:35%;">
                            <img src="<?php echo $searchIconPath; ?>" alt="searchIcon" class="mb-2 me-2"
                                style="width:24px;height:24px;">Tramer'dan Sorgula
                        </button>
                    </div>
                    <div class="col-md-6">
                        <select id="brandSelectPlakali" class="selectpicker form-control mb-2" data-live-search="true"
                            title="Marka Seçiniz"></select>
                    </div>
                    <div class="col-md-6">
                        <input type="number" id="yearInputPlakali" class="form-control mb-2" value="2025">
                    </div>
                    <div class="col-md-6">
                        <select id="modelSelectPlakali" class="selectpicker form-control mb-2" data-live-search="true"
                            title="Model Seçiniz"></select>
                    </div>
                    <div class="col-md-6">
                        <select id="usageInputPlakali" class="selectpicker form-control mb-2" data-live-search="true"
                            title="Kullanım Şekli"></select>
                    </div>
                    <div class="col-md-6">
                        <input type="text" id="engineInputPlakali" placeholder="Motor No" class="form-control mb-2">
                    </div>
                    <div class="col-md-6">
                        <input type="text" id="chassisInputPlakali" placeholder="Şasi No" class="form-control mb-2">
                    </div>
                    <div class="col-md-6">
                        <input type="number" id="seatCountPlakali" placeholder="Koltuk Adedi" class="form-control mb-2"
                            value="5">
                    </div>
                    <div class="col-md-6">
                        <input type="date" id="registrationDatePlakali" class="form-control mb-2">
                    </div>
                    <div class="col-md-6">
                        <select id="fuelInputPlakali" class="selectpicker form-control mb-2" data-live-search="true"
                            title="Yakıt Türü"></select>
                    </div>
                </div>

                <!-- Eski Poliçe / Dain-i Mürtehin / Aksesuarlar -->
                <!-- Aynı yapıyı plakasızdan kopyalayabilirsin -->
            </div>

            <button type="submit" class="btn btn-primary w-25 mt-3 float-end">Kaydet</button>
        </form>
    </div>
</div>

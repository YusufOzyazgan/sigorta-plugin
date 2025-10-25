<?php
if (!defined('ABSPATH'))
    exit;
?>
<style>
    button {
        background-color: white !important;
        border: 1px solid #ccc !important;
        color: black !important;

    }
</style>
<div id="vehicleModal"
    style="display:none; height:100%; position:fixed; top: 0;  left:0; width:100%;  background:rgba(0,0,0,0.5); justify-content:center; align-items:flex-start; padding-top:30px;  overflow:auto; z-index:1050;">
    <div style="background:#fff; width:800px; max-width:100%; border-radius:10px; padding:20px; position:relative; ">
        <h2 class="text-center">Araç Ekle</h2>
        <hr>
        <button type="button" class="btn-close bg-light dark position-absolute top-0 end-0 m-3" aria-label="Close"
            onclick="document.getElementById('vehicleModal').style.display='none'">
        </button>

        <!-- Sekmeler (Ajax Olarak)-->
        <div style="display:flex; gap:10px; margin-bottom:15px;">
            <button id="tabPlakasiz" class="btn success-button border-0 activeArea" style="flex:1;">Plakasız
                Araç</button>
            <button id="tabPlakali" class="btn success-button border-0" style="flex:1;">Plakalı Araç</button>
        </div>

        <form id="vehicleForm">
            <!-- Plakasız Form -->
            <div id="plakasizForm">
                <div class="row mb-2 ">
                    <div class="col-md-6">
                        <label for="citySelect" class="form-label">İl Seçiniz</label>
                        <select id="citySelect" class=" form-control" style="background-color:white; color:white;"
                            title="İl Seçiniz" data-live-search="true"></select>
                    </div>

                    <div class="col-md-6">
                        <label for="brandSelect" class="form-label">Marka Seçiniz</label>
                        <select id="brandSelect" class=" form-control" title="Marka Seçiniz"
                            data-live-search="true"></select>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-md-6">
                        <label for="yearInput" class="form-label">Yıl Seçiniz</label>
                        <input type="number" id="yearInput" class="form-control border" value="2025">
                    </div>

                    <div class="col-md-6">
                        <label for="modelSelect" class="form-label">Model Seçiniz</label>
                        <select id="modelSelect" class=" form-control" title="Model Seçiniz"
                            data-live-search="true"></select>
                    </div>
                </div>


                <div class="row mb-3">
                    <div class="col-md-3">
                        <label for="usageInput" class="form-label">Kullanım Şekli</label>
                        <select id="usageInput" class=" form-control" title="Kullanım Şekli"
                            data-live-search="true"></select>
                    </div>

                    <div class="col-md-3">
                        <label for="engineInput" class="form-label">Motor No</label>
                        <input type="text" id="engineInput" placeholder="Motor No" class=" border form-control">
                    </div>

                    <div class="col-md-3">
                        <label for="chassisInput" class="form-label">Şasi No</label>
                        <input type="text" id="chassisInput" placeholder="Şasi No" class="border form-control">
                    </div>

                    <div class="col-md-3">
                        <label for="fuelInput" class="form-label">Yakıt Türü</label>
                        <select id="fuelInput" class=" form-control" title="Yakıt Türü"
                            data-live-search="true"></select>
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="registrationDate" class="form-label">Tescil Tarihi (gg.aa.yyyy)</label>
                        <input type="date" id="registrationDate" class="border form-control">
                    </div>

                    <div class="col-md-6">
                        <label for="seatCount" class="form-label">Koltuk Sayısı</label>
                        <input type="number" value="5" id="seatCount" class="border" placeholder="Koltuk Adedi"
                            class="form-control">
                    </div>
                </div>



                <h5 class="mt-3 ">Eski Poliçe Bilgileri</h5>
                <div class="mb-2" style="display:flex; gap:10px; flex-wrap:wrap;">

                    <input type="text" id="oldPolicyNo" placeholder="Poliçe No" class="border form-control mb-2"
                        style="flex:1;">
                    <input type="text" id="oldPolicyRenewalNo" placeholder="Yenileme No"
                        class="border form-control mb-2" style="flex:1;">
                    <input type="text" id="oldPolicyCompanyNo" placeholder="Şirket No" class="border form-control mb-2"
                        style="flex:1;">
                    <input type="text" id="oldPolicyAgentNo" placeholder="Acenta No" class="border form-control mb-2"
                        style="flex:1;">
                </div>


                <h5 class="mt-3">Dain-i Mürtehin / Banka / Finans Kurumu</h5>
                <div class="mb-2" class="btn-group" role="group" aria-label="Lien Type">
                    <input type="radio" class=" border btn-check" name="lienType" id="lienNone" value="none" checked>
                    <label class="btn btn-outline-secondary" for="lienNone">Yok</label>

                    <input type="radio" class="border btn-check" name="lienType" id="lienBank" value="1">
                    <label class="btn btn-outline-primary" for="lienBank">Banka</label>

                    <input type="radio" class="border btn-check" name="lienType" id="lienFinance" value="2">
                    <label class="btn btn-outline-success" for="lienFinance">Finans Kurumu</label>
                </div>

                <div id="lienInput" style="margin-top:10px;"></div>

                <h5 class="mt-3">Aksesuarlar</h5>
                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                    <input type="number" id="accessorySound" placeholder="Ses (bedel)" class="border form-control mb-2"
                        style="flex:1;">
                    <input type="number" id="accessoryScreen" placeholder="Ekran (bedel)"
                        class="border form-control mb-2" style="flex:1;">
                    <input type="number" id="accessoryOther" placeholder="Diğer (bedel)"
                        class="border form-control mb-2" style="flex:1;">
                </div>
            </div>

            <!-- Plakalı Form -->

            <div id="plakaliForm" style="display:none;">


                <div class="row g-2">
                    <div class="col-md-6 col-lg-6 col-sm-12">
                        <select id="citySelectPlakali" class=" form-control mb-2" data-live-search="true"
                            title="İl Seçiniz">

                        </select>
                    </div>
                    <div class="col-md-6">
                        <input type="text" maxlength="6" id="plateInput" placeholder="Plaka (örn: ABC123)"
                            class="form-control border mb-2">
                    </div>
                    <div class="col-md-6">
                        <input type="text" id="documentSeries" placeholder="Belge Seri Kodu(Örn: AA)"
                            class="form-control mb-2 border">
                    </div>
                    <div class="col-md-6">
                        <input type="text" id="documentNo" placeholder="Belge Seri No (Örn: 123)"
                            class="form-control mb-2">
                    </div>

                    <!-- Tarmerden Sorgula -->
                    <div class="mb-3 col-md-12 ">
                        <button type="button" id="tramerBtn" class="btn warning-button" style="width:50%;">
                            
                            Tramer'dan Sorgula
                        </button>
                    </div>


                    <div class="col-md-6">
                        <select id="brandSelectPlakali" class=" form-control mb-2" data-live-search="true"
                            title="Marka Seçiniz">

                        </select>
                    </div>
                    <div class="col-md-6">
                        <input type="number" id="yearInputPlakali" class="border form-control mb-2" value="2025">
                    </div>
                    <div class="col-md-6">
                        <select id="modelSelectPlakali" class=" form-control mb-2" data-live-search="true"
                            title="Model Seçiniz">

                        </select>
                    </div>
                    <div class="col-md-6">

                        <select id="usageInputPlakali" class=" form-control mb-2" data-live-search="true"
                            title="Kullaım Şekli">
                        </select>
                    </div>

                    <div class="col-md-6">
                        <input type="text" id="engineInputPlakali" placeholder="Motor No"
                            class="border form-control mb-2">
                    </div>
                    <div class="col-md-6">
                        <input type="text" id="chassisInputPlakali" placeholder="Şasi No"
                            class="border form-control mb-2">
                    </div>
                    <div class="col-md-6">
                        <label class="mb-1" for="registrarionDatePlakali"> Koltuk Sayısı</label>
                        <input type="number" id="seatCountPlakali" placeholder="Koltuk Adedi"
                            class="form-control border mb-2" value="5">
                    </div>
                    <div class="col-md-6">
                        <label class="mb-1" for="registrarionDatePlakali"> Tescil Tarihi </label>
                        <input type="date" id="registrationDatePlakali" class="border form-control mb-2">
                    </div>
                    <div class="col-md-6">
                        <select id="fuelInputPlakali" class=" form-control mb-2" data-live-search="true"
                            title="Yakıt Türü">
                        </select>
                    </div>
                </div>



                <!-- Eski Poliçe Bilgileri -->
                <h5 class="mt-3">Eski Poliçe Bilgileri</h5>
                <div class="row g-2">
                    <div class="col-md-3">
                        <input type="text" id="oldPolicyNoPlakali" placeholder="No" class="border form-control mb-2">
                    </div>
                    <div class="col-md-3">
                        <input type="text" id="oldPolicyRenewalNoPlakali" placeholder="Yenileme Numarası"
                            class="border form-control mb-2">
                    </div>
                    <div class="col-md-3">
                        <input type="text" id="oldPolicyCompanyNoPlakali" placeholder="Sigorta Şirketi No"
                            class="border form-control mb-2">
                    </div>
                    <div class="col-md-3">
                        <input type="text" id="oldPolicyAgentNoPlakali" placeholder="Acenta No"
                            class="border form-control mb-2">
                    </div>
                </div>
                <!-- Dain-i Mürtehin / Banka / Finans Kurumu -->
                <h5 class="mt-3">Dain-i Mürtehin / Banka / Finans Kurumu</h5>
                <div class="btn-group" role="group" aria-label="Lien Type Plakali">
                    <input type="radio" class="btn-check" name="lienTypePlakali" id="lienNonePlakali" value="none"
                        checked>
                    <label class="btn btn-outline-secondary" for="lienNonePlakali">Yok</label>

                    <input type="radio" class="btn-check" name="lienTypePlakali" id="lienBankPlakali" value="1">
                    <label class="btn btn-outline-primary" for="lienBankPlakali">Banka</label>

                    <input type="radio" class="btn-check" name="lienTypePlakali" id="lienFinancePlakali" value="2">
                    <label class="btn btn-outline-success" for="lienFinancePlakali">Finans Kurumu</label>
                </div>
                <div id="lienInputPlakali" style="margin-top:10px;"></div>


                <!-- Aksesuarlar -->
                <h5 class="mt-3">Aksesuarlar</h5>
                <div class="row g-2">
                    <div class="col-md-4">
                        <input type="text" id="accessorySoundPlakali" placeholder="Ses (bedel)"
                            class="border form-control mb-2">
                    </div>
                    <div class="col-md-4">
                        <input type="text" id="accessoryScreenPlakali" placeholder="Ekran (bedel)"
                            class="border form-control mb-2">
                    </div>
                    <div class="col-md-4">
                        <input type="text" id="accessoryOtherPlakali" placeholder="Diğer (bedel)"
                            class="border form-control mb-2">
                    </div>
                </div>
            </div>
            <button type="submit" class="btn primary-button w-25 mt-3 float-end">Kaydet</button>
        </form>
    </div>
</div>
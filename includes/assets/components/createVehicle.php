<?php
if (!defined('ABSPATH'))
    exit;
?>

<div id="vehicleModal"
    style="display:none; height:100%; position:fixed; top: 0;  left:0; width:100%;  background:rgba(0,0,0,0.5); justify-content:center; align-items:flex-start; padding:20px;  overflow:auto; z-index:1050;">
    <div style="background:#fff; width:900px; max-width:100%; border-radius:16px; padding:0; position:relative; box-shadow: 0 10px 40px rgba(0,0,0,0.2); overflow:hidden;">
        <!-- Header -->
        <div style="padding: 24px 30px; position: relative; border-bottom: 2px solid #e9ecef;">
            <h2 class="mb-0" style="font-weight: 700; font-size: 1.5rem; color: #2d3436;">Araç Ekleme</h2>
            <p class="mb-0 mt-2 text-muted" style="font-size: 0.9rem;">Yeni araç bilgilerinizi girin</p>
            <button type="button" class="btn-close position-absolute" style="top: 20px; right: 20px; opacity: 1; background-color:rgb(255, 255, 255); border-radius: 4px; padding: 8px;" aria-label="Close"
                onclick="document.getElementById('vehicleModal').style.display='none'">
            </button>
        </div>

        <!-- Body -->
        <div style="padding: 30px;">
            <!-- Sekmeler -->
            <div style="display:flex; gap:8px; margin-bottom:30px; background: #f8f9fa; padding: 6px; border-radius: 12px;">
                <button id="tabPlakasiz" class="btn flex-fill" style="border-radius: 8px; font-weight: 600; transition: all 0.3s; background: #0d6efd; color: white; border: none;">Plakasız Araç</button>
                <button id="tabPlakali" class="btn flex-fill" style="border-radius: 8px; font-weight: 600; transition: all 0.3s; background: transparent; color: #6c757d; border: none;">Plakalı Araç</button>
            </div>

            <form id="vehicleForm">
                <!-- Plakasız Form -->
                <div id="plakasizForm">
                    <!-- Temel Bilgiler -->
                    <div style="margin-bottom: 24px;">
                        <h5 style="color: #2d3436; font-weight: 600; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #e9ecef;">Temel Bilgiler</h5>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="citySelect" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">İl</label>
                                <select id="citySelect" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;"
                                    title="İl Seçiniz" data-live-search="true"></select>
                            </div>
                            <div class="col-md-6">
                                <label for="brandSelect" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">Marka</label>
                                <select id="brandSelect" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;"
                                    title="Marka Seçiniz" data-live-search="true"></select>
                            </div>
                            <div class="col-md-6">
                                <label for="yearInput" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">Yıl</label>
                                <input type="number" id="yearInput" class="form-control border-0" value="2025" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                            </div>
                            <div class="col-md-6">
                                <label for="modelSelect" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">Model</label>
                                <select id="modelSelect" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;"
                                    title="Model Seçiniz" data-live-search="true"></select>
                            </div>
                        </div>
                    </div>


                    <!-- Detay Bilgiler -->
                    <div style="margin-bottom: 24px;">
                        <h5 style="color: #2d3436; font-weight: 600; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #e9ecef;">Detay Bilgiler</h5>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="usageInput" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">Kullanım Şekli</label>
                                <select id="usageInput" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;"
                                    title="Kullanım Şekli" data-live-search="true"></select>
                            </div>
                            <div class="col-md-6">
                                <label for="fuelInput" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">Yakıt Türü</label>
                                <select id="fuelInput" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;"
                                    title="Yakıt Türü" data-live-search="true"></select>
                            </div>
                            <div class="col-md-6">
                                <label for="engineInput" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">Motor No</label>
                                <input type="text" id="engineInput" placeholder="Motor No" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                            </div>
                            <div class="col-md-6">
                                <label for="chassisInput" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">Şasi No</label>
                                <input type="text" id="chassisInput" placeholder="Şasi No" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                            </div>
                            <div class="col-md-6">
                                <label for="registrationDate" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">Tescil Tarihi</label>
                                <input type="date" id="registrationDate" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                            </div>
                            <div class="col-md-6">
                                <label for="seatCount" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">Koltuk Sayısı</label>
                                <input type="number" value="5" id="seatCount" placeholder="Koltuk Adedi" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                            </div>
                        </div>
                    </div>



                    <!-- Eski Poliçe Bilgileri -->
                    <div style="margin-bottom: 24px;">
                        <h5 style="color: #2d3436; font-weight: 600; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #e9ecef;">Eski Poliçe Bilgileri <small class="text-muted" style="font-weight: 400; font-size: 0.85rem;">(Opsiyonel)</small></h5>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <input type="text" id="oldPolicyNo" placeholder="Poliçe No" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                            </div>
                            <div class="col-md-6">
                                <input type="text" id="oldPolicyRenewalNo" placeholder="Yenileme No" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                            </div>
                            <div class="col-md-6">
                                <input type="text" id="oldPolicyCompanyNo" placeholder="Şirket No" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                            </div>
                            <div class="col-md-6">
                                <input type="text" id="oldPolicyAgentNo" placeholder="Acenta No" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                            </div>
                        </div>
                    </div>

                    <!-- Dain-i Mürtehin -->
                    <div style="margin-bottom: 24px;">
                        <h5 style="color: #2d3436; font-weight: 600; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #e9ecef;">Dain-i Mürtehin <small class="text-muted" style="font-weight: 400; font-size: 0.85rem;">(Opsiyonel)</small></h5>
                        <div class="btn-group w-100" role="group" aria-label="Lien Type" style="background: #f8f9fa; padding: 6px; border-radius: 12px;">
                            <input type="radio" class="btn-check" name="lienType" id="lienNone" value="none" checked>
                            <label class="btn flex-fill" for="lienNone" style="border-radius: 8px; margin-right: 4px; background: #0d6efd; color: white; border: none; font-weight: 600;">Yok</label>

                            <input type="radio" class="btn-check" name="lienType" id="lienBank" value="1">
                            <label class="btn flex-fill" for="lienBank" style="border-radius: 8px; margin-right: 4px; background: transparent; color: #6c757d; border: none; font-weight: 600;">Banka</label>

                            <input type="radio" class="btn-check" name="lienType" id="lienFinance" value="2">
                            <label class="btn flex-fill" for="lienFinance" style="border-radius: 8px; background: transparent; color: #6c757d; border: none; font-weight: 600;">Finans Kurumu</label>
                        </div>
                        <div id="lienInput" style="margin-top:12px;"></div>
                    </div>

                    <!-- Aksesuarlar -->
                    <div style="margin-bottom: 24px;">
                        <h5 style="color: #2d3436; font-weight: 600; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #e9ecef;">Aksesuarlar <small class="text-muted" style="font-weight: 400; font-size: 0.85rem;">(Opsiyonel)</small></h5>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <input type="number" id="accessorySound" placeholder="Ses (bedel)" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                            </div>
                            <div class="col-md-4">
                                <input type="number" id="accessoryScreen" placeholder="Ekran (bedel)" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                            </div>
                            <div class="col-md-4">
                                <input type="number" id="accessoryOther" placeholder="Diğer (bedel)" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                            </div>
                        </div>
                    </div>
            </div>

                <!-- Plakalı Form -->
                <div id="plakaliForm" style="display:none;">
                    <!-- Plaka ve Belge Bilgileri -->
                    <div style="margin-bottom: 24px;">
                        <h5 style="color: #2d3436; font-weight: 600; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #e9ecef;">Plaka ve Belge Bilgileri</h5>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="citySelectPlakali" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">İl</label>
                                <select id="citySelectPlakali" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;"
                                    data-live-search="true" title="İl Seçiniz"></select>
                            </div>
                            <div class="col-md-6">
                                <label for="plateInput" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">Plaka</label>
                                <input type="text" maxlength="6" id="plateInput" placeholder="Plaka (örn: ABC123)"
                                    class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                            </div>
                            <div class="col-md-6">
                                <label for="documentSeries" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">Belge Seri Kodu</label>
                                <input type="text" id="documentSeries" placeholder="Belge Seri Kodu (Örn: AA)"
                                    class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                            </div>
                            <div class="col-md-6">
                                <label for="documentNo" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">Belge Seri No</label>
                                <input type="text" id="documentNo" placeholder="Belge Seri No (Örn: 123)"
                                    class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                            </div>
                            <div class="col-md-12">
                                <button type="button" id="tramerBtn" class="btn w-100" style="background: linear-gradient(135deg,rgb(187, 185, 179) 0%,rgb(22, 99, 194) 100%); color: #000; border: none; font-weight: 600; padding: 12px; border-radius: 8px; box-shadow: 0 4px 15px rgba(255, 254, 252, 0.3);">
                                    <i class="fas fa-search me-2"></i>Tramer'dan Sorgula
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Temel Bilgiler -->
                    <div style="margin-bottom: 24px;">
                        <h5 style="color: #2d3436; font-weight: 600; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #e9ecef;">Temel Bilgiler</h5>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="brandSelectPlakali" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">Marka</label>
                                <select id="brandSelectPlakali" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;"
                                    data-live-search="true" title="Marka Seçiniz"></select>
                            </div>
                            <div class="col-md-6">
                                <label for="yearInputPlakali" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">Yıl</label>
                                <input type="number" id="yearInputPlakali" class="form-control border-0" value="2025" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                            </div>
                            <div class="col-md-6">
                                <label for="modelSelectPlakali" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">Model</label>
                                <select id="modelSelectPlakali" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;"
                                    data-live-search="true" title="Model Seçiniz"></select>
                            </div>
                            <div class="col-md-6">
                                <label for="usageInputPlakali" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">Kullanım Şekli</label>
                                <select id="usageInputPlakali" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;"
                                    data-live-search="true" title="Kullanım Şekli"></select>
                            </div>
                        </div>
                    </div>

                    <!-- Detay Bilgiler -->
                    <div style="margin-bottom: 24px;">
                        <h5 style="color: #2d3436; font-weight: 600; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #e9ecef;">Detay Bilgiler</h5>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="engineInputPlakali" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">Motor No</label>
                                <input type="text" id="engineInputPlakali" placeholder="Motor No"
                                    class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                            </div>
                            <div class="col-md-6">
                                <label for="chassisInputPlakali" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">Şasi No</label>
                                <input type="text" id="chassisInputPlakali" placeholder="Şasi No"
                                    class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                            </div>
                            <div class="col-md-6">
                                <label for="seatCountPlakali" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">Koltuk Sayısı</label>
                                <input type="number" id="seatCountPlakali" placeholder="Koltuk Adedi"
                                    class="form-control border-0" value="5" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                            </div>
                            <div class="col-md-6">
                                <label for="registrationDatePlakali" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">Tescil Tarihi</label>
                                <input type="date" id="registrationDatePlakali" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                            </div>
                            <div class="col-md-6">
                                <label for="fuelInputPlakali" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">Yakıt Türü</label>
                                <select id="fuelInputPlakali" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;"
                                    data-live-search="true" title="Yakıt Türü"></select>
                            </div>
                        </div>
                    </div>



                    <!-- Eski Poliçe Bilgileri -->
                    <div style="margin-bottom: 24px;">
                        <h5 style="color: #2d3436; font-weight: 600; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #e9ecef;">Eski Poliçe Bilgileri <small class="text-muted" style="font-weight: 400; font-size: 0.85rem;">(Opsiyonel)</small></h5>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <input type="text" id="oldPolicyNoPlakali" placeholder="Poliçe No" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                            </div>
                            <div class="col-md-6">
                                <input type="text" id="oldPolicyRenewalNoPlakali" placeholder="Yenileme No" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                            </div>
                            <div class="col-md-6">
                                <input type="text" id="oldPolicyCompanyNoPlakali" placeholder="Şirket No" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                            </div>
                            <div class="col-md-6">
                                <input type="text" id="oldPolicyAgentNoPlakali" placeholder="Acenta No" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                            </div>
                        </div>
                    </div>

                    <!-- Dain-i Mürtehin -->
                    <div style="margin-bottom: 24px;">
                        <h5 style="color: #2d3436; font-weight: 600; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #e9ecef;">Dain-i Mürtehin <small class="text-muted" style="font-weight: 400; font-size: 0.85rem;">(Opsiyonel)</small></h5>
                        <div class="btn-group w-100" role="group" aria-label="Lien Type Plakali" style="background: #f8f9fa; padding: 6px; border-radius: 12px;">
                            <input type="radio" class="btn-check" name="lienTypePlakali" id="lienNonePlakali" value="none" checked>
                            <label class="btn flex-fill" for="lienNonePlakali" style="border-radius: 8px; margin-right: 4px; background: #0d6efd; color: white; border: none; font-weight: 600;">Yok</label>

                            <input type="radio" class="btn-check" name="lienTypePlakali" id="lienBankPlakali" value="1">
                            <label class="btn flex-fill" for="lienBankPlakali" style="border-radius: 8px; margin-right: 4px; background: transparent; color: #6c757d; border: none; font-weight: 600;">Banka</label>

                            <input type="radio" class="btn-check" name="lienTypePlakali" id="lienFinancePlakali" value="2">
                            <label class="btn flex-fill" for="lienFinancePlakali" style="border-radius: 8px; background: transparent; color: #6c757d; border: none; font-weight: 600;">Finans Kurumu</label>
                        </div>
                        <div id="lienInputPlakali" style="margin-top:12px;"></div>
                    </div>

                    <!-- Aksesuarlar -->
                    <div style="margin-bottom: 24px;">
                        <h5 style="color: #2d3436; font-weight: 600; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #e9ecef;">Aksesuarlar <small class="text-muted" style="font-weight: 400; font-size: 0.85rem;">(Opsiyonel)</small></h5>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <input type="text" id="accessorySoundPlakali" placeholder="Ses (bedel)" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                            </div>
                            <div class="col-md-4">
                                <input type="text" id="accessoryScreenPlakali" placeholder="Ekran (bedel)" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                            </div>
                            <div class="col-md-4">
                                <input type="text" id="accessoryOtherPlakali" placeholder="Diğer (bedel)" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Submit Button -->
                <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 30px; padding-top: 24px; border-top: 2px solid #e9ecef;">
                    <button type="button" class="btn" onclick="document.getElementById('vehicleModal').style.display='none'" style="background: #f8f9fa; color: #6c757d; border: none; font-weight: 600; padding: 12px 24px; border-radius: 8px;">
                        İptal
                    </button>
                    <button type="submit" class="btn" style="background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%); color: white; border: none; font-weight: 600; padding: 12px 32px; border-radius: 8px; box-shadow: 0 4px 15px rgba(13, 110, 253, 0.4);">
                        <i class="fas fa-save me-2"></i>Kaydet
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
<?php
if (!defined('ABSPATH'))
    exit;
?>

<div id="step1">
    <div style="margin-bottom: 24px;">
        <h3 class="mb-3" style="color: #2d3436; font-weight: 700;">Kişisel Bilgiler</h3>
        
        <!-- Müşteri Tipi Toggle (Sadece giriş yapılmamışsa göster) -->
        <div id="customerTypeToggle" style="margin-bottom: 24px;">
            <label class="form-label fw-semibold d-block mb-2" style="color: #2d3436;">Müşteri Tipi</label>
            <div class="btn-group w-100" role="group" aria-label="Customer Type" style="background: #f8f9fa; padding: 6px; border-radius: 12px; display: flex; gap: 4px;">
                <input type="radio" class="btn-check" name="customerType" id="customerTypeIndividual" value="individual" checked autocomplete="off">
                <label class="btn flex-fill" for="customerTypeIndividual" id="labelIndividual" style="border-radius: 8px; background: #0d6efd; color: white; border: none; font-weight: 600; padding: 10px; cursor: pointer; margin: 0;">
                    <i class="fas fa-user me-2"></i>Bireysel Müşteri
                </label>

                <input type="radio" class="btn-check" name="customerType" id="customerTypeCorporate" value="corporate" autocomplete="off">
                <label class="btn flex-fill" for="customerTypeCorporate" id="labelCorporate" style="border-radius: 8px; background: transparent; color: #6c757d; border: none; font-weight: 600; padding: 10px; cursor: pointer; margin: 0;">
                    <i class="fas fa-building me-2"></i>Kurumsal Müşteri
                </label>
            </div>
        </div>
    </div>
    
    <form id="personalForm">
        <!-- Giriş yapılmışsa: TC ve Telefon yan yana -->
        <div class="row g-3 mb-3" id="phoneRowLoggedIn" style="display: none;">
            <div class="col-12 col-md-6">
                <label for="tcLoggedIn" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">TC Kimlik No</label>
                <input type="text" required class="form-control border-0" maxlength="11" id="tcLoggedIn" disabled style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px; background: #f8f9fa;">
            </div>
            <div class="col-12 col-md-6">
                <label for="phoneLoggedIn" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">Telefon</label>
                <input type="text" required class="form-control border-0" placeholder="5xx" id="phoneLoggedIn" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
            </div>
        </div>
        <!-- Giriş yapılmamışsa: TC, Telefon alt alta -->
        <div class="row g-3 mb-3" id="phoneRowNoLogin">
            <div class="col-12">
                <label for="tcNoLogin" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">TC Kimlik No</label>
                <input type="text" required class="form-control border-0" maxlength="11" id="tcNoLogin" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
            </div>
            <div class="col-12">
                <label for="phoneNoLogin" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">Telefon</label>
                <input type="text" required class="form-control border-0" placeholder="5xx" id="phoneNoLogin" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
            </div>
        </div>
        <div class="row mb-2" id="emailRow" style="display: none;">
            <div class="col-12 col-md-6">
                <label for="email" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">E-posta</label>
                <input type="email" class="form-control border-0" id="email" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
            </div>
            <div class="col-12 col-md-6" id="birthDateLoggedInContainer">
                <label for="birthDate" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">Doğum Tarihi</label>
                <input type="date" class="form-control border-0" id="birthDate" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
            </div>
        </div>
        <div class="row mb-2" id="birthDateRow">
            <div class="col-12" id="birthDateNoLoginContainer">
                <label for="birthDateNoLogin" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">Doğum Tarihi</label>
                <input type="date" class="form-control border-0" id="birthDateNoLogin" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
            </div>
        </div>
        <div class="row mb-2" id="emailRowNoLogin">
            <div class="col-12">
                <label for="emailNoLogin" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">E-posta</label>
                <input type="email" class="form-control border-0" id="emailNoLogin" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
            </div>
        </div>
        <div id="infoAfterLogin" style="display: none;">
            <div class="row g-3 mb-3">
                <div class="col-md-6">
                    <label class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">İl</label>
                    <select id="cityTraffic" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                        <option value="">İl seçiniz</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">İlçe</label>
                    <select id="districtTraffic" class="form-control border-0" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                        <option value="">Önce il seçiniz</option>
                    </select>
                </div>
            </div>
            <div class="row g-3 mb-3">
                <div class="col-12">
                    <label for="fullName" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">İsim Soyisim</label>
                    <input type="text" class="form-control border-0" id="fullName" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;">
                </div>
            </div>
        </div>
        <div class="mb-3" id="mfaAreaTraffic" style="display:none;">
            <label for="mfaCodeTraffic" class="form-label fw-semibold" style="color: #2d3436; margin-bottom: 6px;">SMS Kodunu Giriniz</label>
            <input type="text" class="form-control border-0" id="mfaCodeTraffic" maxlength="6" style="box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px; text-align: center; letter-spacing: 8px; font-weight: 600;">
        </div>
        <div class="row mt-4" id="buttonRowNoLogin">
            <div class="col-12 d-flex justify-content-end">
                <button type="submit" id="step1SubmitBtn" class="btn" style="background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%); color: white; border: none; font-weight: 600; padding: 12px 32px; border-radius: 8px; box-shadow: 0 4px 15px rgba(13, 110, 253, 0.4);">
                    <i class="fas fa-arrow-right me-2"></i>İleri
                </button>
            </div>
        </div>
        <div class="row mt-4" id="buttonRowLoggedIn" style="display: none;">
            <div class="col-12 d-flex justify-content-end">
                <button type="submit" id="step1SubmitBtnLoggedIn" class="btn" style="background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%); color: white; border: none; font-weight: 600; padding: 12px 32px; border-radius: 8px; box-shadow: 0 4px 15px rgba(13, 110, 253, 0.4);">
                    <i class="fas fa-arrow-right me-2"></i>İleri
                </button>
            </div>
        </div>

    </form>
</div>
<?php
if (!defined('ABSPATH'))
    exit;
?>

<div id="step1">
    <h3 class="mb-2">Kişisel Bilgiler</h3>
    <form id="personalForm">
        <div class="row g-4 mb-2">
            <div class=" col-md-6">
                <label for="tc" class="form-label">TC Kimlik No</label>
                <input type="text" required class="form-control" maxlength="11" id="tc" disabled>
            </div>
            <div class="col-md-6">
                <label for="phone" class="form-label">Telefon</label>
                <input type="text" required class="form-control" placeholder="5xx" maxlength="10" id="phone">
            </div>
        </div>
        <div class="row g-4 mb-2">
            <div class=" col-md-6">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" required>
            </div>
            <div class=" col-md-6">
                <label for="birthDate" class="form-label">Doğum Tarihi</label>
                <input type="date" class="form-control" id="birthDate" required>
            </div>
        </div>
        <div id="infoAfterLogin" style="display: none;">
            <div class="row g-4 mb-2">
                <div class="col-md-6">
                    <label class="form-label">İl</label>
                    <select id="cityTraffic" class="form-control">
                        <option value="">İl seçiniz</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label class="form-label">İlçe</label>
                    <select id="districtTraffic" class="form-control">
                        <option value="">Önce il seçiniz</option>
                    </select>
                </div>
            </div>
            <div class="row g-4 mb-2">
                <div class="col-mb-12">
                    <label for="fullName" class="form-label">İsim Soyisim</label>
                    <input type="text"  class="form-control" id="fullName">
                </div>
            </div>
        </div>
        <div class="mb-3" id="mfaAreaTraffic" style="display:none;">
            <label for="mfaCodeTraffic" class="form-label">SMS Kodunu Giriniz</label>
            <input type="text" class="form-control" id="mfaCodeTraffic" maxlength="6">
        </div>
        <div class="d-flex justify-content-between mt-3">
            <div></div>
            <button type="submit" id="step1SubmitBtn" class="primary-button">İleri</button>
        </div>

    </form>
</div>
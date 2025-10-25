<?php
if (!defined('ABSPATH')) exit;
ob_start();
?>

<div class="modal fade" id="konutModal" tabindex="-1" aria-labelledby="konutModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title" id="konutModalLabel">Konut Ekle</h2>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Kapat"></button>
            </div>
            <div class="modal-body">
                <form id="konutForm">
                    <!-- UAVT -->
                    <div class="mb-3 d-flex">
                        <input type="text" id="uavtNo" class="form-control me-2" placeholder="UAVT No">
                        <button type="button" class="btn btn-dark" onclick="sorgulaUavt()">Sorgula</button>
                    </div>

                    <!-- Adres Bilgileri -->
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label for="citySelectProperty" class="form-label">İl</label>
                            <select id="citySelectProperty" class="selectpicker form-select w-100"
                                data-live-search="true" title="İl Seçiniz"></select>
                        </div>
                        <div class="col-md-6">
                            <label for="districtSelect" class="form-label">İlçe</label>
                            <select id="districtSelect" class="selectpicker form-select w-100" disabled
                                data-live-search="true" title="Önce İl Seçiniz"></select>
                        </div>
                        <div class="col-md-6">
                            <label for="townSelect" class="form-label">Belde/Bucak</label>
                            <select id="townSelect" class="selectpicker form-select w-100" disabled
                                data-live-search="true" title="Önce İlçe Seçiniz"></select>
                        </div>
                        <div class="col-md-6">
                            <label for="neighborhoodSelect" class="form-label">Mahalle</label>
                            <select id="neighborhoodSelect" class="selectpicker form-select w-100" disabled
                                data-live-search="true" title="Önce Belde/Bucak Seçiniz"></select>
                        </div>
                        <div class="col-md-6">
                            <label for="streetSelect" class="form-label">Sokak/Cadde</label>
                            <select id="streetSelect" class="selectpicker form-select w-100" disabled
                                data-live-search="true" title="Önce Mahalle Seçiniz"></select>
                        </div>
                        <div class="col-md-6">
                            <label for="buildingSelect" class="form-label">Bina No/Adı</label>
                            <select id="buildingSelect" class="selectpicker form-select w-100" disabled
                                data-live-search="true" title="Önce Sokak/Cadde Seçiniz"></select>
                        </div>
                        <div class="col-md-6">
                            <label for="apartmentSelect" class="form-label">Daire No</label>
                            <select id="apartmentSelect" class="selectpicker form-select w-100" disabled
                                data-live-search="true" title="Önce Bina Seçiniz"></select>
                        </div>
                    </div>

                    <!-- Genel Bilgiler -->
                    <div class="row g-3 mt-3">
                        <div class="col-md-6">
                            <label class="form-label">Metrekare</label>
                            <input type="number" min="45" max="999" step="1" required id="squareMeter"
                                placeholder="45 - 999 m² arasında olmalıdır" class="form-control">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Yapım Yılı</label>
                            <input type="number" maxlength="4" required id="constructionYear" class="form-control">
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
                            <label class="form-label">Dairenin Bulunduğu Kat</label>
                            <input type="number" class="form-control" required id="whichFloor">
                        </div>
                    </div>

                    <!-- Dain-i Mürtehin -->
                    <div class="mt-4">
                        <label class="form-label d-block">Dain-i Mürtehin</label>
                        <div class="btn-group" role="group">
                            <input type="radio" class="btn-check" name="lossPayeeClause" id="dainNone" value="null" checked>
                            <label class="btn btn-outline-secondary" for="dainNone">Yok</label>
                            <input type="radio" class="btn-check" name="lossPayeeClause" id="dainBank" value="1">
                            <label class="btn btn-outline-secondary" for="dainBank">Banka</label>
                            <input type="radio" class="btn-check" name="lossPayeeClause" id="dainFinans" value="2">
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

<!-- konut-modal-content.php -->
<div class="modal fade" id="konutModal" tabindex="-1" aria-labelledby="konutModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="konutModalLabel">Konut Ekle</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Kapat"></button>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">İptal</button>
                <button type="button" id="createProperty" class="btn btn-dark">Konut Oluştur</button>
            </div>
        </div>
    </div>
</div>
                    <form id="konutForm">
                    <!-- UAVT -->
                    <div class="mb-3 d-flex">
                        <input type="text" id="uavtNo" class="form-control border me-2" placeholder="UAVT No">
                        <button type="button" class="btn btn-primary bg-primary" onclick="sorgulaUavt()">Sorgula</button>
                    </div>

                    <!-- Adres Bilgileri -->
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label for="citySelectProperty" class="form-label">İl</label>
                            <select class="selectpicker w-100" id="citySelectProperty"
                                data-live-search="true" title="İl Seçiniz"></select>
                        </div>

                        <div class="col-md-6">
                            <label for="districtSelect" class="form-label">İlçe</label>
                            <select class="selectpicker w-100" id="districtSelect" disabled
                                data-live-search="true" title="Önce İl Seçiniz"></select>
                        </div>

                        <div class="col-md-6">
                            <label for="townSelect" class="form-label">Belde/Bucak</label>
                            <select class="selectpicker w-100" id="townSelect" disabled
                                data-live-search="true" title="Önce İlçe Seçiniz"></select>
                        </div>

                        <div class="col-md-6">
                            <label for="neighborhoodSelect" class="form-label">Mahalle</label>
                            <select class="selectpicker w-100" id="neighborhoodSelect" disabled
                                data-live-search="true" title="Önce Belde/Bucak Seçiniz"></select>
                        </div>

                        <div class="col-md-6">
                            <label for="streetSelect" class="form-label">Sokak/Cadde</label>
                            <select class="selectpicker w-100" id="streetSelect" disabled
                                data-live-search="true" title="Önce Mahalle Seçiniz"></select>
                        </div>

                        <div class="col-md-6">
                            <label for="buildingSelect" class="form-label">Bina No/Adı</label>
                            <select class="selectpicker w-100" id="buildingSelect" disabled
                                data-live-search="true" title="Önce Sokak/Cadde Seçiniz"></select>
                        </div>

                        <div class="col-md-6">
                            <label for="apartmentSelect" class="form-label">Daire No</label>
                            <select class="selectpicker w-100" id="apartmentSelect" disabled
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
                            <input type="number" maxlength="4" required id="constructionYear" class="form-control">
                        </div>
                    </div>

                    <!-- Konut Kullanım Detayları -->
                    <div class="row g-3 mt-3">
                        <div class="col-md-6">
                            <label class="form-label">Konut Kullanım Şekli</label>
                            <select class="selectpicker w-100" id="utilizationStyle" title="Konut Kullanım Şekli Seçiniz">
                                <option value="HOUSE">Konut</option>
                                <option value="BUSINESS">İşyeri</option>
                                <option value="OTHER">Diğer</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Bina Hasar Durumu</label>
                            <select class="selectpicker w-100" id="damageStatus" title="Bina Hasar Durumu Seçiniz">
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
                            <select class="selectpicker w-100" id="structure" title="Bina Yapı Tarzı Seçiniz">
                                <option value="STEEL_REINFORCED_CONCRETE">Betonarme</option>
                                <option value="OTHER">Diğer</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Bina Kat Sayısı</label>
                            <select class="selectpicker w-100" id="floorNumber" title="Kat Sayısı Seçiniz">
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
                            <select class="selectpicker w-100" id="ownershipType" title="Bina Sahiplik Türü Seçiniz">
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


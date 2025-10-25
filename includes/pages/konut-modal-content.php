<!-- konut-modal-content.php -->
<div class="modal fade" id="konutModal" tabindex="-1" aria-labelledby="konutModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="konutModalLabel">Konut Ekle</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Kapat"></button>
            </div>
            <div class="modal-body">
                <form id="konutForm">
                    <!-- UAVT -->
                    <div class="mb-3 d-flex">
                        <input type="text" id="uavtNo" class="form-control me-2" placeholder="UAVT No">
                        <button type="button" class="btn btn-primary" id="sorgulaBtn">Sorgula</button>
                    </div>

                    <!-- Adres alanları -->
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label for="citySelectProperty">İl</label>
                            <select id="citySelectProperty" class="form-select" disabled></select>
                        </div>
                        <div class="col-md-6">
                            <label for="districtSelect">İlçe</label>
                            <select id="districtSelect" class="form-select" disabled></select>
                        </div>
                        <div class="col-md-6">
                            <label for="townSelect">Belde/Bucak</label>
                            <select id="townSelect" class="form-select" disabled></select>
                        </div>
                        <div class="col-md-6">
                            <label for="neighborhoodSelect">Mahalle</label>
                            <select id="neighborhoodSelect" class="form-select" disabled></select>
                        </div>
                        <div class="col-md-6">
                            <label for="streetSelect">Sokak/Cadde</label>
                            <select id="streetSelect" class="form-select" disabled></select>
                        </div>
                        <div class="col-md-6">
                            <label for="buildingSelect">Bina No/Adı</label>
                            <select id="buildingSelect" class="form-select" disabled></select>
                        </div>
                        <div class="col-md-6">
                            <label for="apartmentSelect">Daire No</label>
                            <select id="apartmentSelect" class="form-select" disabled></select>
                        </div>
                    </div>

                    <!-- Genel Bilgiler -->
                    <div class="row g-3 mt-3">
                        <div class="col-md-6">
                            <label>Metrekare</label>
                            <input type="number" min="45" max="999" class="form-control" id="squareMeter">
                        </div>
                        <div class="col-md-6">
                            <label>Yapım Yılı</label>
                            <input type="number" maxlength="4" class="form-control" id="constructionYear">
                        </div>
                    </div>

                    <!-- Dain-i Mürtehin -->
                    <div class="mt-3">
                        <label class="form-label d-block">Dain-i Mürtehin</label>
                        <div class="btn-group" role="group">
                            <input type="radio" class="btn-check" name="lossPayeeClause" id="dainNone" value="null" checked>
                            <label class="btn btn-outline-secondary" for="dainNone">Yok</label>

                            <input type="radio" class="btn-check" name="lossPayeeClause" id="dainBank" value="1">
                            <label class="btn btn-outline-secondary" for="dainBank">Banka</label>

                            <input type="radio" class="btn-check" name="lossPayeeClause" id="dainFinans" value="2">
                            <label class="btn btn-outline-secondary" for="dainFinans">Finans Kurumu</label>
                        </div>
                        <div id="lossPayeeProperty" class="mt-2"></div>
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

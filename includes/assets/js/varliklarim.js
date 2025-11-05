// ====================================================================
// (1) Global Flag: Modal'daki dropdown'ların dolu olup olmadığını takip eder
// ====================================================================
let isVehicleModalPopulated = false;

// ====================================================================
// (2) ANA FONKSİYON: Varlıklarımı Yükle
// ====================================================================
window.loadVarliklarimModule = async function (container) {

    const isLogin = await isAuth(container);
    console.log("varliklarim.js çalışıyor.");
    if (!isLogin) {
        console.log("isLogin false döndürdü -> giriş yok");
        return;
    }

    var state = JSON.parse(localStorage.getItem("state"));

    var id = state.user?.costumerId;
    // Oturum dolmuş uyarısı ve login butonu

    if (!id) {
        const me = await apiGetFetch('customers/me');
        state.user.costumerId = me.id;
        id = me.id;
        localStorage.setItem('state', JSON.stringify(state));
    }

    const vehicles = await apiGetFetch('customers/me/vehicles');
    if (vehicles === null) return;
    
    // === ÖRNEK ARAÇ KALDIRILDI ===
    
    console.log('Vehicles response:', vehicles); // Debug için
    if (vehicles.length > 0) {
        console.log('İlk vehicle objesi:', vehicles[0]); // Debug için
    }
    const properties = await apiGetFetch('customers/me/properties');
    if (properties === null) return;


    let html = '';
    // html += '';
    if (vehicles.length === 0 && properties.length === 0) {
        html += '<p>Henüz bir varlık eklemediniz.</p>';

    } else {
        html += '<div class="container mt-3"> <div class="row g-3">';

        vehicles.forEach(v => {
            // === DÜZENLE BUTONU İÇİN VERİ HAZIRLAMA ===
            // HTML içinde JSON'u güvenle saklamak için ' (tek tırnak) yerine &quot; kullan
            const vehicleData = JSON.stringify(v).replace(/"/g, '&quot;');
            
            html += `
                <div class="col-12 col-sm-6 col-md-4 col-lg-4">
                    <div class="card h-100 shadow-sm" style="border:2px solid #ddd; border-radius:10px; padding:15px;">
                        <div class="d-flex align-items-center mt-2">
                            <img src="${varliklarimIcons.car}" alt="Car Icon" class="mb-2 me-2" style="width:30px;height:30px;">
                            <h4>${v.model?.brand?.text || ''}</h4>
                        </div>
                        <hr>
                        <div>
                            <p style="margin-bottom:5px; margin-top:5px;"><strong>Model:</strong> ${v.model?.type?.text || '-'}</p>
                            <p style="margin-bottom:5px;"><strong>Plakalı mı:</strong> ${v.plate?.code ? "Evet" : "Hayır"}</p>
                            ${v.plate?.code ? `<p style="margin-bottom:5px;"><strong>Plaka:</strong> ${v.plate.code}</p>` : ''}
                            <p style="margin-bottom:5px;"><strong>Şasi No:</strong> ${v.chassisNumber || '-'}</p>
                            <p style="margin-bottom:5px;"><strong>Motor No:</strong> ${v.engineNumber || '-'}</p>
                            <p style="margin-bottom:5px;"><strong>Yıl:</strong> ${v.model?.year || '-'}</p>
                            <p style="margin-bottom:5px;"><strong>Yakıt:</strong> ${v.fuel?.type || '-'}</p>
                            <p style="margin-bottom:5px;"><strong>Koltuk:</strong> ${v.seatNumber || '-'}</p>
                        </div>
                        <div class="mt-3 d-flex gap-2 justify-content-end">
                            <button class="btn btn-sm btn-outline-danger deleteVehicleBtn" data-vehicle-id="${v.id}" data-customer-id="${id}" style="border-width: 1.5px; transition: all 0.3s ease;">
                                <i class="fas fa-trash-alt me-1"></i> Sil
                            </button>
                            
                            <button class="btn btn-sm btn-outline-primary editVehicleBtn" data-vehicle-object="${vehicleData}" data-customer-id="${id}" style="border-width: 1.5px; transition: all 0.3s ease;">
                                <i class="fas fa-edit me-1"></i> Düzenle
                            </button>
                        </div>
                    </div>
                </div>
                `;
        });
        properties.forEach(p => {
            const utilizationMap = {
                "HOUSE": "Konut",
                "BUSINESS": "İş Yeri",
                "OTHER": "Diğer"
            };
            const translateUtilization = utilizationMap[p.utilizationStyle] || "-";

            html += `
                    <div class="col-12 col-sm-6 col-md-4 col-lg-4">
                        <div class="card h-100 shadow-sm" style="border:2px solid #ddd; border-radius:10px; padding:15px;" >

                            <div class="d-flex align-items-center mt-2">
                                <img src="${varliklarimIcons.home}" alt="Property Icon" class="mb-2 me-2" style="width:30px;height:30px;">
                                <h4>${p.address.city.text || ''}</h4>
                            </div>
                            <hr>
                            <div>
                                <p style="margin-bottom:5px; margin-top:5px;"><strong>Adres:</strong> ${p.address.district.text}, ${p.address.town.text}, ${p.address.neighborhood.text}, ${p.address.street.text}, ${p.address.building.text}, Daire ${p.address.apartment.text}</p>
                                <p style="margin-bottom:5px;"><strong>Metrekare:</strong> ${p.squareMeter || '-'}</p>
                                <p style="margin-bottom:5px;"><strong>Yapım Yılı:</strong> ${p.constructionYear || '-'}</p>
                                <p style="margin-bottom:5px;"><strong>Hasar Durumu:</strong> ${p.damageStatus == "NONE" ? "Hasarsız" : p.damageStatus == "SLIGHTLY_DAMAGED" ? "Az Hasarlı" : p.damageStatus == "MODERATELY_DAMAGED" ? "Orta Hasarlı" : "Ağır Hasarlı" || '-'}</p>
                                <p style="margin-bottom:5px;"><strong>Kat:</strong> ${p.floor.currentFloor || '-'} / ${p.floor.totalFloors.min || '-'} - ${p.floor.totalFloors.max || '-'}</p>
                                <p style="margin-bottom:5px;"><strong>Kullanım Şekli:</strong> ${translateUtilization || '-'}</p>
                                <p style="margin-bottom:5px;"><strong>Mülkiyet Türü:</strong> ${p.ownershipType === "PROPRIETOR" ? "Mülk" : "Kira"}</p>
                            </div>

                        </div>
                    </div>

                `;
        });
        //   <button class="btn btn-sm btn-outline-info ms-auto mt-2">Detaylar</button> 
        html += `</div> </div>`;
    }

    container.innerHTML += html;


    document.addEventListener('click', async function (e) {
        if (e.target && e.target.id === 'addVarlikBtn') document.getElementById('varlikEkleModal').style.display = 'flex';
        
        // Sil butonu kontrolü
        const deleteBtn = e.target.closest('.deleteVehicleBtn');
        if (deleteBtn) {
            const vehicleId = deleteBtn.getAttribute('data-vehicle-id');
            const customerId = deleteBtn.getAttribute('data-customer-id');
            
            console.log('Sil butonu tıklandı - vehicleId:', vehicleId, 'customerId:', customerId);
            
            if (!vehicleId || !customerId) {
                await showMessage('Araç bilgileri bulunamadı.', 'error');
                return;
            }
            
            // Onay mesajı
            const confirmDelete = confirm('Bu aracı silmek istediğinize emin misiniz?');
            if (!confirmDelete) return;
            
            try {
                const endpoint = `customers/${customerId}/vehicles/${vehicleId}`;
                const requestData = {
                    customerId: customerId,
                    customerVehicleId: vehicleId
                };
                
                console.log('DELETE isteği gönderiliyor:', endpoint, requestData);
                const result = await apiDeleteFetch(endpoint, requestData);
                if (result) {
                    await showMessage('Araç başarıyla silindi.', 'success');
                    // Sayfayı yenile
                    await window.loadVarliklarimModule(container);
                } else {
                    await showMessage('Araç silinirken bir hata oluştu.', 'error');
                }
            } catch (err) {
                console.error('Araç silme hatası:', err);
                await showMessage('Araç silinirken bir hata oluştu.', 'error');
            }
            return;
        }
        
        // === DÜZENLE BUTONU LISTENER'I BURADAN KALDIRILDI ===
        // (Artık dışarıdaki listener bu işi yapıyor)
        
        // selectVehicle kontrolü (YENİ ARAÇ EKLEME)
        const vehicleCard = e.target.closest('#selectVehicle');
        if (vehicleCard) {
            document.getElementById('varlikEkleModal').style.display = 'none';
            document.getElementById('vehicleModal').style.display = 'flex';
            
            // === YENİ EKLEME: Başlık ve Butonları Ayarla ===
            const modalTitle = document.querySelector("#vehicleModal .modal-title");
            if (modalTitle) modalTitle.textContent = "Araç Ekle";
            
            // "Güncelle" (saveEditVehicleBtn) butonunu gizle
            const saveBtn = document.getElementById("saveEditVehicleBtn");
            if (saveBtn) saveBtn.style.display = 'none';
            
            // "Kaydet" (submit) butonunu göster
            const createSubmitButton = document.querySelector('#vehicleForm button[type="submit"]'); 
            if(createSubmitButton) createSubmitButton.style.display = 'block';

            // Sekmeleri sıfırla (Plakalı varsayılan)
            document.getElementById("tabPlakali").click();
            // === YENİ EKLEME SONU ===

            await createVehicle(); // Modalı ve listener'ları hazırlar (gerekirse)
            
            // 'loadVarliklarimModule(container)' çağrısı buradan kaldırıldı, 
            // çünkü 'createVehicle' artık sadece kurulum yapıyor, submit işlemi değil.
        }
        
        // selectProperty kontrolü - kart içindeki herhangi bir elemente tıklanınca çalışsın
        const propertyCard = e.target.closest('#selectProperty');
        if (propertyCard) { 
            document.getElementById('varlikEkleModal').style.display = 'none'; 
        }
        
        if (e.target && e.target.id === 'closeVarlikModal') document.getElementById('varlikEkleModal').style.display = 'none';
    });



    // KONUT İŞLEMLERİ *********************************************************
    // (Bu kısım değiştirilmedi)

    document.getElementById('createProperty').addEventListener('click', async () => {
        await konutOlustur();
    });
    async function sorgulaUavt() {
        const uavtNo = document.getElementById("uavtNo").value;
        if (!uavtNo) return alert("Lütfen UAVT numarası giriniz.");

        try {
            var uatvData = { propertyNumber: uavtNo };
            const data = await apiPostFetch(`properties/query-address-by-property-number​`, uatvData);


            // API'den gelen adres bilgilerini doldur
            document.getElementById("citySelectProperty").innerHTML = `<option value="${data.city.value}">${data.city.text}</option>`;
            document.getElementById("districtSelect").innerHTML = `<option value="${data.district.value}">${data.district.text}</option>`;
            document.getElementById("townSelect").innerHTML = `<option value="${data.town.value}">${data.town.text}</option>`;
            document.getElementById("neighborhoodSelect").innerHTML = `<option value="${data.neighborhood.value}">${data.neighborhood.text}</option>`;
            document.getElementById("streetSelect").innerHTML = `<option value="${data.street.value}">${data.street.text}</option>`;
            document.getElementById("buildingSelect").innerHTML = `<option value="${data.building.value}">${data.building.text}</option>`;
            document.getElementById("apartmentSelect").innerHTML = `<option value="${data.apartment.value}">${data.apartment.text}</option>`;

        } catch (err) {
            console.error(err);
            alert("Adres sorgulamada hata oluştu.");
        }
    }


    document.getElementById("selectProperty").addEventListener("click", async () => {
        // ... (Tüm konut adres seçici kodları)
         // Şehirleri al ve select'e ekle
        // --- Başlangıç: Şehirleri yükle ---
        const cities = (await apiGetFetch(`address-parameters/cities`))
            .sort((a, b) => a.text.localeCompare(b.text));

        const citySelectProperty = document.getElementById('citySelectProperty');
        citySelectProperty.disabled = false;

        // Başlat: Türkçe karakter arama normalize
        jQuery('#citySelectProperty').selectpicker({
            liveSearch: true,
            liveSearchNormalize: true
        });
        jQuery('#citySelectProperty').empty();
        cities.forEach(c => {
            jQuery('#citySelectProperty').append(new Option(c.text, c.value));
        });
        jQuery('#citySelectProperty').selectpicker('refresh');

        // Alt selectleri temizle ve başlat
        const selects = [
            '#districtSelect',
            '#townSelect',
            '#neighborhoodSelect',
            '#streetSelect',
            '#buildingSelect',
            '#apartmentSelect'
        ];

        selects.forEach(selector => {
            const $el = jQuery(selector);
            $el.selectpicker('destroy'); // Eski cache'i temizle
            $el.empty();                 // Optionları temizle
            $el.prop('disabled', true);  // Başlangıçta disabled
            $el.selectpicker({
                liveSearch: true,
                liveSearchNormalize: true
            });
        });

        // --- Şehir değiştiğinde ilçe yükle ---
        citySelectProperty.addEventListener("change", async () => {
            const districtSelect = document.getElementById('districtSelect');

            try {
                const districts = (await apiGetFetch(`address-parameters/districts?cityReference=${citySelectProperty.value}`))
                    .sort((a, b) => a.text.localeCompare(b.text));

                districtSelect.disabled = false;
                jQuery('#districtSelect').selectpicker('destroy');
                districtSelect.innerHTML = '';
                districts.forEach(c => {
                    jQuery('#districtSelect').append(new Option(c.text, c.value));
                });
                jQuery('#districtSelect').selectpicker({
                    liveSearch: true,
                    liveSearchNormalize: true
                });

                // Alt selectleri temizle
                ['#townSelect', '#neighborhoodSelect', '#streetSelect', '#buildingSelect', '#apartmentSelect'].forEach(s => {
                    const $el = jQuery(s);
                    $el.selectpicker('destroy');
                    $el.empty();
                    $el.prop('disabled', true);
                    $el.selectpicker({ liveSearch: true, liveSearchNormalize: true });
                });

            } catch (err) {
                console.error("Hata ilçe seçimi:", err);
            }
        });

        // --- İlçe değiştiğinde kasabaları yükle ---
        const districtSelect = document.getElementById('districtSelect');
        districtSelect.addEventListener("change", async () => {
            const townSelect = document.getElementById('townSelect');
            try {
                const towns = (await apiGetFetch(`address-parameters/towns?districtReference=${districtSelect.value}`))
                    .sort((a, b) => a.text.localeCompare(b.text));

                townSelect.disabled = false;
                jQuery('#townSelect').selectpicker('destroy');
                townSelect.innerHTML = '';
                towns.forEach(c => {
                    jQuery('#townSelect').append(new Option(c.text, c.value));
                });
                jQuery('#townSelect').selectpicker({ liveSearch: true, liveSearchNormalize: true });

                // Alt selectleri temizle
                ['#neighborhoodSelect', '#streetSelect', '#buildingSelect', '#apartmentSelect'].forEach(s => {
                    const $el = jQuery(s);
                    $el.selectpicker('destroy');
                    $el.empty();
                    $el.prop('disabled', true);
                    $el.selectpicker({ liveSearch: true, liveSearchNormalize: true });
                });

            } catch (err) {
                console.error("Hata kasaba seçimi:", err);
            }
        });

        // --- Kasaba değiştiğinde mahalleleri yükle ---
        const townSelect = document.getElementById('townSelect');
        townSelect.addEventListener("change", async () => {
            const neighborhoodSelect = document.getElementById('neighborhoodSelect');
            console.log("mahalle urli : " + `address-parameters/neighbourhoods?townReference=${townSelect.value}`)
            try {
                //const neighborhoods=(await apiGetFetch(`address-parameters/neighbourhoods?townReference=37767`))
                let neighborhoods = (await apiGetFetch(`address-parameters/neighbourhoods?townReference=${townSelect.value}`));
                neighborhoods = neighborhoods.sort((a, b) => a.text.localeCompare(b.text));

                neighborhoodSelect.disabled = false;
                jQuery('#neighborhoodSelect').selectpicker('destroy');
                neighborhoodSelect.innerHTML = '';
                neighborhoods.forEach(c => {
                    jQuery('#neighborhoodSelect').append(new Option(c.text, c.value));
                });
                jQuery('#neighborhoodSelect').selectpicker({ liveSearch: true, liveSearchNormalize: true });

                ['#streetSelect', '#buildingSelect', '#apartmentSelect'].forEach(s => {
                    const $el = jQuery(s);
                    $el.selectpicker('destroy');
                    $el.empty();
                    $el.prop('disabled', true);
                    $el.selectpicker({ liveSearch: true, liveSearchNormalize: true });
                });

            } catch (err) {
                console.error("Hata mahalle seçimi:", err);
            }
        });

        // --- Mahalle değiştiğinde sokakları yükle ---
        const neighborhoodSelect = document.getElementById('neighborhoodSelect');
        neighborhoodSelect.addEventListener("change", async () => {
            const streetSelect = document.getElementById('streetSelect');
            try {
                let streets = (await apiGetFetch(`address-parameters/streets?neighbourhoodReference=${neighborhoodSelect.value}`));
                if (!streets) {
                    await showMessage("Sokaklar Çekilemedi daha sonra tekrar deneiyniz", "error");
                    return;
                }
                streets = streets.sort((a, b) => a.text.localeCompare(b.text));

                streetSelect.disabled = false;
                jQuery('#streetSelect').selectpicker('destroy');
                streetSelect.innerHTML = '';
                streets.forEach(c => {
                    jQuery('#streetSelect').append(new Option(c.text, c.value));
                });
                jQuery('#streetSelect').selectpicker({ liveSearch: true, liveSearchNormalize: true });

                ['#buildingSelect', '#apartmentSelect'].forEach(s => {
                    const $el = jQuery(s);
                    $el.selectpicker('destroy');
                    $el.empty();
                    $el.prop('disabled', true);
                    $el.selectpicker({ liveSearch: true, liveSearchNormalize: true });
                });

            } catch (err) {
                console.error("Hata sokak seçimi:", err);
            }
        });

        // --- Sokak değiştiğinde binaları yükle ---
        const streetSelect = document.getElementById('streetSelect');
        streetSelect.addEventListener("change", async () => {
            const buildingSelect = document.getElementById('buildingSelect');
            try {
                //address-parameters/buildings?streetReference=492674
                let buildings = (await apiGetFetch(`address-parameters/buildings?streetReference=${streetSelect.value}`));
                if (!buildings) {
                    await showMessage("Binalar çekilemedi daha sonra tekrar deneiyniz", "error");
                    return;
                }
                buildings = buildings.sort((a, b) => a.text.localeCompare(b.text));

                buildingSelect.disabled = false;
                jQuery('#buildingSelect').selectpicker('destroy');
                buildingSelect.innerHTML = '';
                buildings.forEach(c => {
                    jQuery('#buildingSelect').append(new Option(c.text, c.value));
                });
                jQuery('#buildingSelect').selectpicker({ liveSearch: true, liveSearchNormalize: true });

                jQuery('#apartmentSelect').selectpicker('destroy');
                const apartmentSelect = document.getElementById('apartmentSelect');
                apartmentSelect.innerHTML = '';
                apartmentSelect.disabled = true;
                jQuery('#apartmentSelect').selectpicker({ liveSearch: true, liveSearchNormalize: true });

            } catch (err) {
                console.error("Hata bina seçimi:", err);
            }
        });

        // --- Bina değiştiğinde daireleri yükle ---
        const buildingSelect = document.getElementById('buildingSelect');
        buildingSelect.addEventListener("change", async () => {
            const apartmentSelect = document.getElementById('apartmentSelect');
            //address-parameters/apartments?buildingReference=19935533
            try {                                    //address-parameters/apartments?buildingReference=9487881
                let apartments = (await apiGetFetch(`address-parameters/apartments?buildingReference=${buildingSelect.value}`));
                if (!apartments) {
                    await showMessage("Daire no çekilemedi daha sonra tekrar deneiyniz", "error");
                    return;
                }
                apartments = apartments.sort((a, b) => a.text.localeCompare(b.text));

                apartmentSelect.disabled = false;
                jQuery('#apartmentSelect').selectpicker('destroy');
                apartmentSelect.innerHTML = '';
                apartments.forEach(c => {
                    jQuery('#apartmentSelect').append(new Option(c.text, c.value));
                });
                jQuery('#apartmentSelect').selectpicker({ liveSearch: true, liveSearchNormalize: true });

            } catch (err) {
                console.error("Hata daire seçimi:", err);
            }
        });

        const radiosProperty = document.querySelectorAll('input[name="lossPaaeClause"]');
        const lossPayeeProperty = document.getElementById('lossPayeeProperty');

        radiosProperty.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.value === "1") {
                    lossPayeeProperty.innerHTML = `<input type="text" id="lossPayeeClauseInputProperty" class="form-control" placeholder="Banka Adı">`;
                } else if (radio.value === "2") {
                    lossPayeeProperty.innerHTML = `<input type="text" id="lossPayeeClauseInputProperty" class="form-control" placeholder="Kurum Adı">`;
                } else {
                    lossPayeeProperty.innerHTML = "";
                }
            });
        });
    });
    // Konut ekleme
    async function konutOlustur() {

        const lossPayeeTypeProperty = parseInt(document.querySelector('input[name="lossPayeeClause"]:checked')?.value);
        const lossPayeeNameProperty = document.getElementById("lossPayeeClauseInputProperty")?.value?.trim();
        const floorSelect = document.getElementById("floorNumber");
        let minFloor = 0;
        let maxFloor = 0;

        switch (floorSelect.value) {
            case "0": // Bilinmiyor
                await showMessage("Bina Kat Sayısını Girmeniz Gerekiyor", "warning");
                return;
                break;

            case "2": // 1-3 Kat
                minFloor = 1;
                maxFloor = 3;
                break;
            case "3": // 4-7 Kat
                minFloor = 4;
                maxFloor = 7;
                break;
            case "4": // 8-18 Kat
                minFloor = 8;
                maxFloor = 18;
                break;
            case "5": // 19+ Kat
                minFloor = 19;
                maxFloor = Number.MAX_SAFE_INTEGER; // sınırsız kabul et
                break;
            default:
                await showMessage("Bina Kat Sayısını Girmeniz Gerekiyor", "warning");
                return;

        }
        const data = {
            customerId: id,

            floor: {
                currentFloor: parseInt(document.getElementById("whichFloor").value),
                totalFloors: {
                    $type: "range",
                    max: maxFloor,
                    min: minFloor
                }

            },
            KonutOldPolicyNumber: null,
            squareMeter: parseInt(document.getElementById("squareMeter").value) || 0,
            constructionYear: parseInt(document.getElementById("constructionYear").value) || 0,
            utilizationStyle: document.getElementById("utilizationStyle").value,
            damageStatus: document.getElementById("damageStatus").value,
            structure: document.getElementById("structure").value,
            number: parseInt(document.getElementById("apartmentSelect").value),
            ownershipType: document.getElementById("ownershipType").value,
            lossPayeeClause: (lossPayeeTypeProperty || lossPayeeNameProperty)
                ? { type: lossPayeeTypeProperty, name: lossPayeeNameProperty }
                : null
        };

        try {
            console.log("konut verileri: ", data);
            const result = await apiPostFetch(`customers/${id}/properties`, data);
            alert("Konut başarıyla eklendi!");
            await showMessage("Konut Eklendi", "success")
        } catch (err) {
            console.error(err);
            alert("Konut eklenirken hata oluştu.");
        }
    }
}; // === loadVarliklarimModule Bitişi ===


// ====================================================================
// (3) ARAÇ DÜZENLEME (EDIT) Listener (Global Kapsamda)
// ====================================================================
document.addEventListener("click", async function (e) {
    const editBtn = e.target.closest(".editVehicleBtn");
    if (!editBtn) return;

    // 🔹 1. Araç ve müşteri bilgilerini butondan al
    let customerId = editBtn.getAttribute("data-customer-id");
    const vehicleDataString = editBtn.getAttribute("data-vehicle-object");

    // Eğer müşteri ID yoksa localStorage’dan çek
    if (!customerId) {
        const state = JSON.parse(localStorage.getItem("state"));
        customerId = state?.user?.costumerId;
    }

    let vehicle;
    try {
        // HTML'den okunan veriyi JSON objesine çevir
        vehicle = JSON.parse(vehicleDataString);
    } catch (parseError) {
        console.error("Araç verisi parse edilemedi:", parseError, vehicleDataString);
        await showMessage("Araç bilgileri okunamadı (JSON hatası).", "error");
        return;
    }

    if (!vehicle) {
        await showMessage("Araç bilgileri alınamadı (Veri boş).", "error");
        return;
    }

    // PUT isteği için aracın 'id' veya 'chassis/engine' numarasını al
    let vehicleId = vehicle.id || vehicle.vehicleId || vehicle.customerVehicleId || vehicle.chassisNumber || vehicle.engineNumber;

    if (!vehicleId || !customerId) {
        console.error("Vehicle veya Customer ID eksik.", vehicleId, customerId);
        await showMessage("Araç bilgileri alınamadı (ID eksik).", "error");
        return;
    }

    // Modal Başlığını al
    const modalTitle = document.querySelector("#vehicleModal .modal-title");
    const defaultModalTitle = "Araç Ekle"; // Orijinal başlığı buraya yazın

    try {
        console.log("Düzenleme isteği başlatıldı:", vehicleId, customerId);

        // === 1. MODALI HAZIRLA (En Önemli Adım) ===
        // Bu, dropdown'ları doldurur ve listener'ları (sekme, submit) bir kez yükler.
        await createVehicle();
        
        // 🔹 2. Modalı aç
        document.getElementById("vehicleModal").style.display = "flex";

        // 🔹 3. Modal Başlığını Güncelle
        if (modalTitle) {
            modalTitle.textContent = "Araç Düzenle";
        }
        
        // 🔹 4. "Plakalı" Sekmesini Aktif Et ve Formu Göster
        document.getElementById("tabPlakali").click();

        // 🔹 5. Formu Doldur
        document.getElementById("brandSelectPlakali").value = vehicle.model?.brand?.value || "";
        document.getElementById("yearInputPlakali").value = vehicle.model?.year || "";
        document.getElementById("chassisInputPlakali").value = vehicle.chassisNumber || "";
        document.getElementById("engineInputPlakali").value = vehicle.engineNumber || "";
        document.getElementById("registrationDatePlakali").value = vehicle.registrationDate || "";
        document.getElementById("seatCountPlakali").value = vehicle.seatNumber || "";

        // Yakıt verisi (Test verisinde "Dizel", formda "DIESEL" olabilir, bunu eşleştir)
        const fuelMap = {
            "Dizel": "DIESEL",
            "Benzin": "GASOLINE",
            "Elektrik": "ELECTRIC",
            "LPG": "LPG",
            "LPG + Benzin": "LPG_GASOLINE"
        };
        const fuelValue = fuelMap[vehicle.fuel?.type] || vehicle.fuel?.type;
        document.getElementById("fuelInputPlakali").value = fuelValue;

        // Şehir ve Kullanım Tipi gibi diğer dropdown'ları da doldur
        if (vehicle.plate?.city) {
            document.getElementById("citySelectPlakali").value = vehicle.plate.city;
        }
        if (vehicle.utilizationStyle) {
            document.getElementById("usageInputPlakali").value = vehicle.utilizationStyle;
        }

        // Marka ve Yıl seçildikten sonra Model listesini manuel olarak yükle
        if (vehicle.model?.brand?.value && vehicle.model?.year) {
            // handleBrandOrYearChangePlakali'yi çağırarak modellerin yüklenmesini sağla
            await handleBrandOrYearChangePlakali();
            // Modeller yüklendikten sonra doğru modeli seç
            document.getElementById("modelSelectPlakali").value = vehicle.model?.type?.value || "";
        }
        
        // Tüm selectpicker'ları yenile (önemli)
        jQuery("#brandSelectPlakali, #modelSelectPlakali, #fuelInputPlakali, #citySelectPlakali, #usageInputPlakali").selectpicker("refresh");

        // 🔹 6. Güncelle butonunu kontrol et, yoksa oluştur
        let saveBtn = document.getElementById("saveEditVehicleBtn");
        if (!saveBtn) {
            saveBtn = document.createElement("button");
            saveBtn.id = "saveEditVehicleBtn";
            saveBtn.className = "btn btn-success w-100 mt-3";
            saveBtn.innerHTML = `<i class="fas fa-save me-2"></i> Güncelle`;
            // Butonu modal footer'a ekle
            const modalFooter = document.querySelector("#vehicleModal .modal-footer") || document.getElementById("vehicleForm");
            modalFooter.appendChild(saveBtn);
        }
        
        // Butonları Yönet (Güvenli)
        const createSubmitButton = document.querySelector('#vehicleForm button[type="submit"]'); 
        if(createSubmitButton) {
            createSubmitButton.style.display = 'none';
        }
        saveBtn.style.display = 'block';

        // 🔹 7. Güncelleme işlemi
        saveBtn.onclick = async () => {
            
            const isPlakasizActive = document.getElementById("plakasizForm").style.display !== "none";
            let data = {};

            // Kullanıcı hangi sekmedeyse o sekmenin verisini al
            if (isPlakasizActive) {
                console.warn("Plakasız sekmesinde güncelleme yapılıyor...");
                data = {
                    ...vehicle, // Orijinal veriyi temel al
                    brandReference: document.getElementById("brandSelect").value,
                    modelTypeReference: document.getElementById("modelSelect").value,
                    modelYear: parseInt(document.getElementById("yearInput").value),
                    engine: document.getElementById("engineInput").value,
                    chassis: document.getElementById("chassisInput").value,
                    fuel: { type: document.getElementById("fuelInput").value, customLpg: false, customLpgPrice: null },
                    registrationDate: document.getElementById("registrationDate").value || null,
                    seatNumber: parseInt(document.getElementById("seatCount").value) || null,
                    utilizationStyle: document.getElementById("usageInput").value || null,
                    plate: {
                        city: parseInt(document.getElementById("citySelect").value),
                        code: "", // Plakasız
                    },
                };
            } else {
                // Varsayılan olarak Plakalı formunun verilerini al
                data = {
                    ...vehicle, // Orijinal veriyi temel al
                    brandReference: document.getElementById("brandSelectPlakali").value,
                    modelTypeReference: document.getElementById("modelSelectPlakali").value,
                    modelYear: parseInt(document.getElementById("yearInputPlakali").value),
                    chassis: document.getElementById("chassisInputPlakali").value,
                    engine: document.getElementById("engineInputPlakali").value,
                    registrationDate: document.getElementById("registrationDatePlakali").value,
                    seatNumber: parseInt(document.getElementById("seatCountPlakali").value),
                    fuel: {
                        type: document.getElementById("fuelInputPlakali").value,
                        customLpg: false,
                        customLpgPrice: null,
                    },
                    plate: {
                        city: parseInt(document.getElementById("citySelectPlakali").value),
                        code: document.getElementById("plateInput").value
                    },
                     utilizationStyle: document.getElementById("usageInputPlakali").value || null,
                };
            }

            try {
                const result = await apiPutFetch(`customers/${customerId}/vehicles/${vehicleId}`, data);
                if (result) {
                    await showMessage("Araç başarıyla güncellendi.", "success");
                    document.getElementById("vehicleModal").style.display = "none";
                    
                    // Modal Başlığını Sıfırla
                    if (modalTitle) {
                        modalTitle.textContent = defaultModalTitle; 
                    }

                    // Butonları sıfırla
                    saveBtn.style.display = 'none';
                    if(createSubmitButton) createSubmitButton.style.display = 'block';

                    // Varlıklar modülünü yeniden yükle
                    const container = document.querySelector("#varliklarim") || document.querySelector("main") ; 
                    if (container) {
                        container.innerHTML = ''; 
                        await window.loadVarliklarimModule(container);
                    }
                } else {
                    await showMessage("Güncelleme başarısız.", "error");
                    if (modalTitle) modalTitle.textContent = defaultModalTitle;
                }
            } catch (err) {
                console.error("Güncelleme hatası:", err);
                await showMessage("Sunucu hatası.", "error");
                if (modalTitle) modalTitle.textContent = defaultModalTitle;
            }
        };
    } catch (err) {
        console.error("Araç düzenleme hatası:", err);
        await showMessage("Araç bilgileri alınamadı (Genel Hata).", "error");
        // Hata olursa modalı kapat ve başlığı sıfırla
        document.getElementById("vehicleModal").style.display = "none";
        if (modalTitle) modalTitle.textContent = defaultModalTitle;
    }
});


// ====================================================================
// (4) apiPutFetch (Yardımcı Fonksiyon)
// ====================================================================
async function apiPutFetch(endpoint, data) {
    const state = JSON.parse(localStorage.getItem("state"));
    const token = state?.token?.accessToken;
    const response = await fetch(API_URL + endpoint, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) return null;
    return await response.json();
}


// ====================================================================
// (5) createVehicle (Kurulum Fonksiyonu - Eski Yapı Korundu)
// ====================================================================
async function createVehicle() {
    
    // === BAYRAK KONTROLÜ ===
    // Eğer bu fonksiyon (ve içindeki tüm listener'lar) zaten yüklendiyse, tekrar çalıştırma.
    if (isVehicleModalPopulated) return true;
    // === BAYRAK KONTROLÜ SONU ===


    var state = JSON.parse(localStorage.getItem("state"));
    var token = state?.token.accessToken;
    var id = state.user?.costumerId;
    
    // --- 1. Dropdown'ları Doldur (Marka) ---
    try {
        // Markaları al ve select'e ekle
        const brands = (await apiGetFetch("vehicle-parameters/brands")).sort((a, b) => a.text.localeCompare(b.text));
        const modelSelect = document.getElementById('modelSelect');
        const modelSelectPlakali = document.getElementById('modelSelectPlakali');
        const brandSelect = document.getElementById('brandSelect');
        const brandSelectPlakali = document.getElementById('brandSelectPlakali');
        jQuery('#brandSelect').selectpicker();
        jQuery('#brandSelectPlakali').selectpicker();
        jQuery('#modelSelect').selectpicker();
        jQuery('#modelSelectPlakali').selectpicker();

        jQuery('#brandSelect, #brandSelectPlakali').empty();

        brands.forEach(c => {
            jQuery('#brandSelect').append(new Option(c.text, c.value));
            jQuery('#brandSelectPlakali').append(new Option(c.text, c.value));
        });

        jQuery('#brandSelect, #brandSelectPlakali').selectpicker('refresh');


        modelSelectPlakali.disabled = true;
        modelSelectPlakali.innerHTML = '<option value="">Önce Marka Seçiniz</option>';

        modelSelect.disabled = true;
        modelSelect.innerHTML = '<option value="">Önce Marka Seçiniz</option>';
        jQuery('#modelSelect, #modelSelectPlakali').selectpicker('refresh');
        console.log("Markalar geldi:", brands);

    } catch (err) {
        console.error("Hata marka seçimi:", err);
    }


    // --- 2. Sekme (Tab) Listener'larını Ekle ---
    const plakasizTab = document.getElementById('tabPlakasiz');
    const plakaliTab = document.getElementById('tabPlakali');
    const plakasizForm = document.getElementById('plakasizForm');
    const plakaliForm = document.getElementById('plakaliForm');

    plakasizTab.addEventListener('click', () => { 
        plakasizTab.classList.add('activeArea'); 
        plakaliTab.classList.remove('activeArea'); 
        plakasizForm.style.display = 'block'; 
        plakaliForm.style.display = 'none';
        // Buton stillerini güncelle
        plakasizTab.classList.remove('btn-outline-success');
        plakasizTab.classList.add('btn-success');
        plakasizTab.classList.add('border-0'); // Aktif için border-0 ekle
        plakaliTab.classList.remove('btn-success');
        plakaliTab.classList.remove('border-0'); // Pasif için border-0'ı kaldır (outline görünsün)
        plakaliTab.classList.add('btn-outline-success');
    });
    plakaliTab.addEventListener('click', () => { 
        plakaliTab.classList.add('activeArea'); 
        plakasizTab.classList.remove('activeArea'); 
        plakaliForm.style.display = 'block'; 
        plakasizForm.style.display = 'none';
        // Buton stillerini güncelle
        plakaliTab.classList.remove('btn-outline-success');
        plakaliTab.classList.add('btn-success');
        plakaliTab.classList.add('border-0'); // Aktif için border-0 ekle
        plakasizTab.classList.remove('btn-success');
        plakasizTab.classList.remove('border-0'); // Pasif için border-0'ı kaldır (outline görünsün)
        plakasizTab.classList.add('btn-outline-success');
    });

    // --- 3. Radio Buton Listener'larını Ekle ---
    const radios = document.querySelectorAll('input[name="lienType"]');
    const lossPayee = document.getElementById('lienInput');

    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === "1") {
                lossPayee.innerHTML = `<input type="text" id="lossPayeeClauseInput" class="form-control" placeholder="Banka Adı">`;
            } else if (radio.value === "2") {
                lossPayee.innerHTML = `<input type="text" id="lossPayeeClauseInput" class="form-control" placeholder="Kurum Adı">`;
            } else {
                lossPayee.innerHTML = "";
            }
        });
    });

    const radiosPlakali = document.querySelectorAll('input[name="lienTypePlakali"]');
    const lossPayeePlakali = document.getElementById('lienInputPlakali');

    radiosPlakali.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === "1") {
                lossPayeePlakali.innerHTML = `<input type="text" id="lossPayeeClauseInputPlakali" class="form-control" placeholder="Banka Adı">`;
            } else if (radio.value === "2") {
                lossPayeePlakali.innerHTML = `<input type="text" id="lossPayeeClauseInputPlakali" class="form-control" placeholder="Kurum Adı">`;
            } else {
                lossPayee.innerHTML = "";
            }
        });
    });


    // --- 4. Dropdown'ları Doldur (Şehir) ---
    const cities = ["Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"];
    const citySelect = document.getElementById('citySelect');
    const citySelectPlakali = document.getElementById('citySelectPlakali');

    cities.forEach((c, index) => {
        const plateCode = index + 1;
        jQuery('#citySelect').append(new Option(c, plateCode));
        jQuery('#citySelectPlakali').append(new Option(c, plateCode));
    });

    jQuery('#citySelect,#citySelectPlakali').selectpicker({
        liveSearch: true,
        liveSearchNormalize: true
    });


    // --- 5. Dropdown'ları Doldur (Yakıt) ---
    const fuels = [
        { text: "Benzin", value: "GASOLINE" },
        { text: "Dizel", value: "DIESEL" },
        { text: "Elektrik", value: "ELECTRIC" },
        { text: "LPG", value: "LPG" },
        { text: "LPG + Benzin", value: "LPG_GASOLINE" }
    ];
    jQuery('#fuelInput').selectpicker();
    jQuery('#fuelInputPlakali').selectpicker();
    const fuelInput = document.getElementById('fuelInput');
    const fuelInputPlakali = document.getElementById('fuelInputPlakali');
    jQuery('#fuelInput,#fuelInputPlakali').selectpicker('destroy');
    jQuery('#fuelInput,#fuelInputPlakali').empty();

    fuels.forEach((fuel, index) => {
        const optionValue = fuel.value || index; //
        jQuery('#fuelInput').append(new Option(fuel.text, optionValue));
        jQuery('#fuelInputPlakali').append(new Option(fuel.text, optionValue));
    });

    jQuery('#fuelInput,#fuelInputPlakali').selectpicker({
        liveSearch: true,
        liveSearchNormalize: true
    });


    // --- 6. Model Yükleme Listener'ları ---
    // (Bu fonksiyonlar artık globalde tanımlı)
    document.getElementById('brandSelect').addEventListener("change", handleBrandOrYearChange);
    document.getElementById('yearInput').addEventListener("change", handleBrandOrYearChange);
    document.getElementById('yearInputPlakali').addEventListener("change", handleBrandOrYearChangePlakali);
    document.getElementById('brandSelectPlakali').addEventListener("change", handleBrandOrYearChangePlakali);


    // --- 7. Dropdown'ları Doldur (Kullanım Şekli) ---
    jQuery('#usageInput').selectpicker();
    jQuery('#usageInputPlakali').selectpicker();
    const vehicleTypesSelect = document.getElementById('usageInput');
    const vehicleTypesSelectPlakali = document.getElementById('usageInputPlakali');
    const vehicleTypes = [
        { text: "Hususi Otomobil", value: "PRIVATE_CAR" },
        { text: "Açık Kasa Kamyon", value: "OPEN_TRUCK" },
        { text: "Açık Kasa Kamyonet", value: "OPEN_VAN" },
        { text: "Ambulans", value: "AMBULANCE" },
        { text: "Büyük Otobüs (30 koltuk üstü)", value: "LARGE_BUS" },
        { text: "Çekici", value: "TOW_TRUCK" },
        { text: "Damperli Kamyon", value: "TIPPER_TRUCK" },
        { text: "İş Makinesi", value: "HEAVY_MACHINE" },
        { text: "Kapalı Kasa Kamyon", value: "CLOSED_TRUCK" },
        { text: "Kapalı Kasa Kamyonet", value: "CLOSED_VAN" },
        { text: "Karavan", value: "CARAVAN" },
        { text: "Küçük Otobüs (18-30 koltuk)", value: "SMALL_BUS" },
        { text: "Motosiklet", value: "MOTORCYCLE" },
        { text: "Panel/Glass Van Kamyonet", value: "PANEL_VAN" },
        { text: "Römork", value: "TRAILER" },
        { text: "Taksi", value: "TAXI" },
        { text: "Tanker", value: "TANKER" },
        { text: "Traktör", value: "TRACTOR" }
    ];
    jQuery('#usageInput,#usageInputPlakali').selectpicker('destroy');
    jQuery('#usageInput,#usageInputPlakali').empty();
    vehicleTypes.forEach((vehicle, index) => {
        const optionValue = vehicle.value || index;
        jQuery('#usageInput').append(new Option(vehicle.text, optionValue));
        jQuery('#usageInputPlakali').append(new Option(vehicle.text, optionValue));
    });
    jQuery('#usageInput,#usageInputPlakali').selectpicker({
        liveSearch: true,
        liveSearchNormalize: true
    });


    // --- 8. Form "Submit" (Kaydet) Listener'ı ---
    const vehicleForm = document.getElementById("vehicleForm");
    var accessoriesPlakasiz = [];
    var accessories = [];

    vehicleForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        
        // Eğer 'Güncelle' butonu görünürse, 'Kaydet' işlemi çalışmamalı
        const saveBtn = document.getElementById("saveEditVehicleBtn");
        if (saveBtn && saveBtn.style.display === 'block') {
            console.warn("Submit engellendi, güncelleme işlemi aktif.");
            return; 
        }

        const lossPayeeType = parseInt(document.querySelector('input[name="lienType"]:checked')?.value);
        const lossPayeeName = document.getElementById("lossPayeeClauseInput")?.value?.trim();

        const lossPayeeTypePlakali = parseInt(document.querySelector('input[name="lienTypePlakali"]:checked')?.value);
        const lossPayeeNamePlakali = document.getElementById("lossPayeeClauseInputPlakali")?.value?.trim();
        
        var soundAccessory = document.getElementById("accessorySound").value;
        var screenAccessory = document.getElementById("accessoryScreen").value;
        var otherAccessory = document.getElementById("accessoryOther").value;
        var soundAccessoryPlakali = document.getElementById("accessorySoundPlakali").value;
        var screenAccessoryPlakali = document.getElementById("accessoryScreenPlakali").value;
        var otherAccessoryPlakali = document.getElementById("accessoryOtherPlakali").value;

        // Aksesuarları her submit'te sıfırla
        accessoriesPlakasiz = [];
        accessories = [];

        if (soundAccessory) {
            accessoriesPlakasiz.push({ type: "sound", value: parseInt(soundAccessory), description: "" });
        }
        if (screenAccessory) {
            accessoriesPlakasiz.push({ type: "screen", value: parseInt(screenAccessory), description: "" });
        }
        if (otherAccessory) {
            accessoriesPlakasiz.push({ type: "other", value: parseInt(otherAccessory), description: "" });
        }

        if (soundAccessoryPlakali) {
            accessories.push({ type: "sound", value: parseInt(soundAccessoryPlakali), description: "" });
        }
        if (screenAccessoryPlakali) {
            accessories.push({ type: "screen", value: parseInt(screenAccessoryPlakali), description: "" });
        }
        if (otherAccessoryPlakali) {
            accessories.push({ type: "other", value: parseInt(otherAccessoryPlakali), description: "" });
        }

        const isPlakasiz = document.getElementById("plakasizForm").style.display !== "none";

        let formData = {};
        // Submit anındaki güncel ID'yi al
        var currentState = JSON.parse(localStorage.getItem("state"));
        var currentId = currentState.user?.costumerId;

        if (!currentId) {
            const me = await apiGetFetch('customers/me');
            currentState.user.costumerId = me.id;
            currentId = me.id;
            localStorage.setItem('state', JSON.stringify(currentState));
        }


        if (isPlakasiz) {
            formData = {
                customerId: currentId,
                accessories: accessoriesPlakasiz.length > 0 ? accessoriesPlakasiz : null,
                plate: {
                    city: parseInt(citySelect.value),
                    code: "",
                },
                brandReference: brandSelect.value,
                modelTypeReference: modelSelect.value,
                modelYear: parseInt(document.getElementById("yearInput").value),
                engine: document.getElementById("engineInput").value,
                chassis: document.getElementById("chassisInput").value,
                fuel: {
                    type: fuelInput.value,
                    customLpg: false,
                    customLpgPrice: null
                },
                registrationDate: document.getElementById("registrationDate").value || null,
                seatNumber: parseInt(document.getElementById("seatCount").value) || null,
                utilizationStyle: vehicleTypesSelect.value || null,
                kaskoOldPolicy: null,
                trafikOldPolicy: null,
                lossPayeeClause: (lossPayeeType || lossPayeeName)
                    ? { type: lossPayeeType, name: lossPayeeName }
                    : null
            };
        } else {
            // Plakalı form
            formData = {
                customerId: currentId, // Submit anındaki ID'yi kullan
                plate: {
                    city: parseInt(document.getElementById("citySelectPlakali").value),
                    code: document.getElementById("plateInput").value
                },
                documentSerial: {
                    code: document.getElementById("documentSeries").value,
                    number: document.getElementById("documentNo").value
                },
                brandReference: brandSelectPlakali.value,
                // === YAZIM HATASI DÜZELTMESİ ===
                modelTypeReference: document.getElementById("modelSelectPlakali").value,
                // === YAZIM HATASI DÜZELTMESİ SONU ===
                modelYear: document.getElementById("yearInputPlakali").value,
                utilizationStyle: vehicleTypesSelectPlakali.value || null,
                engine: document.getElementById("engineInputPlakali").value,
                chassis: document.getElementById("chassisInputPlakali").value,
                fuel: {
                    type: fuelInputPlakali.value,
                    customLpg: false,
                    customLpgPrice: null
                },
                registrationDate: document.getElementById("registrationDatePlakali").value,
                seatCount: parseInt(document.getElementById("seatCountPlakali").value),
                kaskoOldPolicy: null,
                trafikOldPolicy: null,
                accessories: accessories.length > 0 ? accessories : null,
                lossPayeeClause: (lossPayeeTypePlakali || lossPayeeNamePlakali)
                    ? { type: lossPayeeTypePlakali, name: lossPayeeNamePlakali }
                    : null
            };
        }

        console.log("Form Data Hazır:", formData);

        //API isteği
        try {
            const endpoint = "customers/" + currentId + "/vehicles";
            const response = await apiPostFetch(endpoint, formData);
            if (response) {
                alert("Araç başarıyla eklendi.");
                vehicleForm.reset();
                await showMessage("Araç Eklendi", "success", 4);
                window.location.reload();
                return true;
            }
            else {
                alert("Araç eklenemedi, lütfen bilgileri kontrol ediniz.");
                return false;
            }
        } catch (err) {
            console.error("API Hatası:", err);
            alert("Form gönderilirken hata oluştu!");
            return false;
        }
    });

    // --- 9. Tramer Butonu Listener'ı ---
    document.getElementById('tramerBtn').addEventListener('click', async function () {
        
        var currentState = JSON.parse(localStorage.getItem("state"));
        var currentId = currentState.user?.costumerId;

        if (!currentId) {
            const me = await apiGetFetch('customers/me');
            currentState.user.costumerId = me.id;
            currentId = me.id;
            localStorage.setItem('state', JSON.stringify(currentState));
        }
        
        const customerId = currentId;
        const plate = document.getElementById('plateInput').value.trim();
        const city = parseInt(document.getElementById('citySelectPlakali').value);
        
        const documentSerial = {
            code: document.getElementById('documentSeries').value.trim(),
            number: document.getElementById('documentNo').value.trim()
        }
        
        if (!city || !plate || !documentSerial.code || !documentSerial.number) {
            showMessage("Lütfen tüm alanları doldurunuz.", "warning", 4);
            return;
        }
        // Veri yapısını oluştur
        const requestData = {
            customerId: customerId,
            plate: {
                hasCode: true,
                city: city || null,
                code: plate || null
            },
            documentSerial: documentSerial || null
        };

        try {
            await showMessage("Tramer Sorgulaması Yapılıyor...", "warning", 4);
            const endpoint = `customers/${customerId}/vehicles/external-lookup`;
            const response = await apiPostFetch(endpoint, requestData);
 
            console.log("Tramer sorgu sonucu:", response);

            // Dönen verileri formda göster
            if (response) {
                // Marka seçimi
                if (response.model?.brand?.value) {
                    jQuery('#brandSelectPlakali').val(response.model.brand.value);
                    jQuery('#brandSelectPlakali').selectpicker('refresh');
                    
                    // Refresh sonrası button text'ini düzelt
                    setTimeout(() => {
                        const brandSelect = document.getElementById('brandSelectPlakali');
                        const brandButton = brandSelect.parentElement.querySelector('.btn.dropdown-toggle .filter-option-inner-inner');
                        if (brandButton && brandSelect.selectedIndex >= 0) {
                            const selectedOption = brandSelect.options[brandSelect.selectedIndex];
                            if (selectedOption) {
                                const correctText = selectedOption.text.trim();
                                if (brandButton.textContent.trim() !== correctText) {
                                    brandButton.textContent = correctText;
                                }
                            }
                        }
                    }, 50);
                    
                    // Marka seçildikten sonra modelleri yükle ve seç
                    const year = response.model?.year || '';
                    if (year) {
                        document.getElementById('yearInputPlakali').value = year;
                        
                        // Modelleri yükle
                        try {
                            const models = (await apiGetFetch(`vehicle-parameters/models?brandReference=${response.model.brand.value}&year=${year}`)).sort((a, b) => a.text.localeCompare(b.text));
                            
                            if (models && models.length > 0) {
                                // Model select'i temizle ve doldur
                                jQuery('#modelSelectPlakali').selectpicker('destroy');
                                jQuery('#modelSelectPlakali').empty();
                                jQuery('#modelSelectPlakali').append(new Option("Model Seçiniz", ""));
                                
                                models.forEach(m => {
                                    jQuery('#modelSelectPlakali').append(new Option(m.text, m.value));
                                });
                                
                                // Model seçimi
                                if (response.model?.type?.value) {
                                    jQuery('#modelSelectPlakali').val(response.model.type.value);
                                }
                                
                                jQuery('#modelSelectPlakali').selectpicker({
                                    liveSearch: true,
                                    liveSearchNormalize: true
                                });
                                
                                // Button text'ini düzelt
                                setTimeout(() => {
                                    const modelSelect = document.getElementById('modelSelectPlakali');
                                    const modelButton = modelSelect.parentElement.querySelector('.btn.dropdown-toggle .filter-option-inner-inner');
                                    if (modelButton && modelSelect.selectedIndex >= 0) {
                                        const selectedOption = modelSelect.options[modelSelect.selectedIndex];
                                        if (selectedOption) {
                                            const correctText = selectedOption.text.trim();
                                            if (modelButton.textContent.trim() !== correctText) {
                                                modelButton.textContent = correctText;
                                            }
                                        }
                                    }
                                }, 50);
                            }
                        } catch (modelError) {
                            console.error('Model yükleme hatası:', modelError);
                        }
                    }
                }
                
                // Kullanım şekli seçimi
                if (response.utilizationStyle) {
                    jQuery('#usageInputPlakali').val(response.utilizationStyle);
                    jQuery('#usageInputPlakali').selectpicker('refresh');
                    
                    // Refresh sonrası button text'ini düzelt
                    setTimeout(() => {
                        const usageSelect = document.getElementById('usageInputPlakali');
                        const usageButton = usageSelect.parentElement.querySelector('.btn.dropdown-toggle .filter-option-inner-inner');
                        if (usageButton && usageSelect.selectedIndex >= 0) {
                            const selectedOption = usageSelect.options[usageSelect.selectedIndex];
                            if (selectedOption) {
                                const correctText = selectedOption.text.trim();
                                const currentText = usageButton.textContent.trim();
                                // Eğer çift görünüyorsa düzelt
                                if (currentText !== correctText && currentText.includes(correctText)) {
                                    usageButton.textContent = correctText;
                                } else if (currentText !== correctText) {
                                    usageButton.textContent = correctText;
                                }
                            }
                        }
                    }, 50);
                }
                
                // Yakıt türü seçimi
                if (response.fuelType || response.fuel?.type) {
                    const fuelValue = response.fuelType || response.fuel?.type;
                    jQuery('#fuelInputPlakali').val(fuelValue);
                    jQuery('#fuelInputPlakali').selectpicker('refresh');
                    
                    // Refresh sonrası button text'ini düzelt
                    setTimeout(() => {
                        const fuelSelect = document.getElementById('fuelInputPlakali');
                        const fuelButton = fuelSelect.parentElement.querySelector('.btn.dropdown-toggle .filter-option-inner-inner');
                        if (fuelButton && fuelSelect.selectedIndex >= 0) {
                            const selectedOption = fuelSelect.options[fuelSelect.selectedIndex];
                            if (selectedOption) {
                                const correctText = selectedOption.text.trim();
                                const currentText = fuelButton.textContent.trim();
                                // Eğer çift görünüyorsa düzelt
                                if (currentText !== correctText && currentText.includes(correctText)) {
                                    fuelButton.textContent = correctText;
                                } else if (currentText !== correctText) {
                                    fuelButton.textContent = correctText;
                                }
                            }
                        }
                    }, 50);
                }
                
                // Text input alanları
                if (response.engine) {
                    document.getElementById('engineInputPlakali').value = response.engine;
                }
                if (response.chassis) {
                    document.getElementById('chassisInputPlakali').value = response.chassis;
                }
                if (response.registrationDate) {
                    document.getElementById('registrationDatePlakali').value = response.registrationDate;
                }
                if (response.seatNumber) {
                    document.getElementById('seatCountPlakali').value = response.seatNumber;
                }
                
                // Tramer sorgulamasından veri geldiği için tüm alanları disable et
                const fieldsToDisable = [
                    'brandSelectPlakali',
                    'yearInputPlakali',
                    'modelSelectPlakali',
                    'usageInputPlakali',
                    'engineInputPlakali',
                    'chassisInputPlakali',
                    'fuelInputPlakali',
                    'registrationDatePlakali',
                    'seatCountPlakali',
                    'citySelectPlakali',
                    'plateInput',
                    'documentSeries',
                    'documentNo'
                ];
                
                fieldsToDisable.forEach(fieldId => {
                    const field = document.getElementById(fieldId);
                    if (field) {
                        if (field.tagName === 'SELECT') {
                            field.disabled = true;
                            jQuery(`#${fieldId}`).selectpicker('refresh');
                            
                            // Refresh sonrası button text'ini düzelt (çift görünmeyi önlemek için)
                            setTimeout(() => {
                                const button = field.parentElement.querySelector('.btn.dropdown-toggle .filter-option-inner-inner');
                                if (button && field.selectedIndex >= 0) {
                                    const selectedOption = field.options[field.selectedIndex];
                                    if (selectedOption) {
                                        const correctText = selectedOption.text.trim();
                                        const currentText = button.textContent.trim();
                                        // Eğer çift görünüyorsa düzelt
                                        if (currentText !== correctText && currentText.includes(correctText)) {
                                            button.textContent = correctText;
                                        } else if (currentText !== correctText) {
                                            button.textContent = correctText;
                                        }
                                    }
                                }
                            }, 50);
                        } else {
                            field.disabled = true;
                        }
                    }
                });
            }

        } catch (error) {
            console.error("Tramer sorgulama hatası:", error);
        }
    });

    // === BAYRAK SET ETME ===
    // Tüm kurulum ve listener'lar eklendi.
    isVehicleModalPopulated = true;
    return true; // Başarı
}
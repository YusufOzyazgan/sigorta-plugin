
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
    const properties = await apiGetFetch('customers/me/properties');
    if (properties === null) return;


    let html = '';
    // html += '';
    if (vehicles.length === 0 && properties.length === 0) {
        html += '<p>Henüz bir varlık eklemediniz.</p>';

    } else {
        html += '<div class="container mt-3"> <div class="row g-3">';

        vehicles.forEach(v => {
            html += `
                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                    <div class="card h-100 shadow-sm" style="border:2px solid #ddd; border-radius:10px; padding:15px;" >

                        <div class="d-flex align-items-center mt-2 ">
                        <img src="${varliklarimIcons.car}" alt="Car Icon" class="mb-2 me-2" style="width:30px;height:30px;">
                        <h4 > ${v.model.brand.text || ''} </h4>
                        </div>
                        <hr>
                        <h6 style="margin:0 0 10px 0;">${v.model.type.text || ''} </h6>
                        <p style="margin:0;">${v.plate?.code ? "Plakalı" : "Plakasız"}</p>
                        ${v.plate?.code
                    ? `<p style="margin:0;">Plaka: ${v.plate.code}</p>`
                    : `<p style="margin:0;">Şasi No: ${v.chassisNumber}</p>`}
                        <p style="margin:0;">Motor No: ${v.engineNumber || '-'}</p>
                        <p style="margin:0;">Yıl: ${v.model.year || '-'}</p>
                        <p style="margin:0;">Yakıt: ${v.fuel?.type || '-'}</p>
                        <div class="d-flex">
                        <p style="margin:0;">Koltuk: ${v.seatNumber || '-'}</p>
                       
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
                    <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                        <div class="card h-100 shadow-sm" style="border:2px solid #ddd; border-radius:10px; padding:15px;" >

                            <div class="d-flex align-items-center mt-2">
                                <img src="${varliklarimIcons.home}" alt="Property Icon" class="mb-2 me-2" style="width:30px;height:30px;">
                                <h4>${p.address.city.text || ''}</h4>
                            </div>
                            <hr>
                            <p style="margin:0;">${p.address.district.text}, ${p.address.town.text}, ${p.address.neighborhood.text}, ${p.address.street.text}, ${p.address.building.text}, Daire ${p.address.apartment.text}</p>
                            <p style="margin:0;">Metrekare: ${p.squareMeter || '-'}</p>
                            <p style="margin:0;">Yapım Yılı: ${p.constructionYear || '-'}</p>
                            <p style="margin:0;">Hasar Durumu: ${p.damageStatus || '-'}</p>
                            <p style="margin:0;">Kat: ${p.floor.currentFloor || '-'} / ${p.floor.totalFloors.min || '-'} - ${p.floor.totalFloors.max || '-'}</p>
                            <p style="margin:0;">Kullanım Şekli: ${translateUtilization || '-'}</p>
                            <p style="margin:0;">Mülkiyet Türü: ${p.ownershipType === "PROPRIETOR" ? "Mülk" : "Kira"}</p>

                        </div>
                    </div>

                `;
        });
        //   <button class="btn btn-sm btn-outline-info ms-auto mt-2">Detaylar</button> 
        html += `</div> </div>`;




    }

    container.innerHTML += html;


    document.addEventListener('click', async function (e) {
        if (e.target && e.target.id === 'addVarlikBtn') document.getElementById('varlikEkleModal').style.display = 'flex';
        if (e.target && e.target.id === 'selectVehicle') {
            document.getElementById('varlikEkleModal').style.display = 'none';
            document.getElementById('vehicleModal').style.display = 'flex';

            const aracOlustur = await createVehicle();
            if (!aracOlustur) {
                return;
            }
            else {

                loadVarliklarimModule(container);
            }
        }
        if (e.target && e.target.id === 'selectProperty') { document.getElementById('varlikEkleModal').style.display = 'none'; }
        if (e.target && e.target.id === 'closeVarlikModal') document.getElementById('varlikEkleModal').style.display = 'none';
    });



    // KONUT İŞLEMLERİ *********************************************************

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
            $el.empty();                 // Optionları temizle
            $el.prop('disabled', true);  // Başlangıçta disabled
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
            try {                                    //address-parameters/apartments?buildingReference=9487881
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






        const radiosProperty = document.querySelectorAll('input[name="lossPayeeClause"]');
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



}
async function createVehicle() {


    var state = JSON.parse(localStorage.getItem("state"));
    var token = state?.token.accessToken;
    var id = state.user?.costumerId;
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
        // jQuery('#modelSelect, #modelSelectPlakali').selectpicker('refresh');
        console.log("Markalar geldi:", brands);

    } catch (err) {
        console.error("Hata marka seçimi:", err);
    }




    const plakasizTab = document.getElementById('tabPlakasiz');
    const plakaliTab = document.getElementById('tabPlakali');
    const plakasizForm = document.getElementById('plakasizForm');
    const plakaliForm = document.getElementById('plakaliForm');

    plakasizTab.addEventListener('click', () => { plakasizTab.classList.add('activeArea'); plakaliTab.classList.remove('activeArea'); plakasizForm.style.display = 'block'; plakaliForm.style.display = 'none'; });
    plakaliTab.addEventListener('click', () => { plakaliTab.classList.add('activeArea'); plakasizTab.classList.remove('activeArea'); plakaliForm.style.display = 'block'; plakasizForm.style.display = 'none'; });



    // radio alanları input ekleme plakasız 

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

    // radio alanları input ekleme plakalı 

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



    // Şehir ekleme


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



    // Yakıt türü ve değerleri eklendi

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



    // Modelleri al ve select'e ekle

    brandSelect.addEventListener("change", handleBrandOrYearChange);
    yearInput.addEventListener("change", handleBrandOrYearChange);
    yearInputPlakali.addEventListener("change", handleBrandOrYearChangePlakali);
    brandSelectPlakali.addEventListener("change", handleBrandOrYearChangePlakali);


    async function handleBrandOrYearChange() {


        let year = document.getElementById('yearInput').value;
        console.log("Seçilen yıl:", year, brandSelect.value);

        const models = (await apiGetFetch(`vehicle-parameters/models?brandReference=${brandSelect.value}&year=${year}`)).sort((a, b) => a.text.localeCompare(b.text));


        // Eğer hiç model yoksa select'i disable yap
        // Eğer hiç model yoksa select'i disable yap
        if (!models || models.length === 0) {
            modelSelect.disabled = true;
            modelSelect.innerHTML = '<option value="">Model Yok</option>';


            jQuery('#modelSelect').selectpicker('destroy');
        } else {
            modelSelect.disabled = false;


            jQuery('#modelSelect').selectpicker('destroy');
            jQuery('#modelSelect').empty();
            jQuery('#modelSelect').append(new Option("Model Seçiniz", ""));

            models.forEach(c => {
                jQuery('#modelSelect').append(new Option(c.text, c.value));
            });
            jQuery('#modelSelect').selectpicker({
                liveSearch: true,
                liveSearchNormalize: true
            });

            console.log("Modeller geldi:", models);
        }

    };

    async function handleBrandOrYearChangePlakali() {

        let yearPlakali = document.getElementById('yearInputPlakali').value;


        const modelsPlakali = (await apiGetFetch(`vehicle-parameters/models?brandReference=${brandSelectPlakali.value}&year=${yearPlakali}`)).sort((a, b) => a.text.localeCompare(b.text));



        if (!modelsPlakali || modelsPlakali.length === 0) {
            modelSelectPlakali.disabled = true;
            modelSelectPlakali.innerHTML = '<option value="">Model Yok</option>';


            jQuery('#modelSelectPlakali').selectpicker('destroy');
        } else {
            modelSelectPlakali.disabled = false;

            jQuery('#modelSelectPlakali').selectpicker('destroy');
            jQuery('#modelSelectPlakali').empty();
            jQuery('#modelSelectPlakali').append(new Option("Model Seçiniz", ""));

            modelsPlakali.forEach(c => {
                jQuery('#modelSelectPlakali').append(new Option(c.text, c.value));
            });
            jQuery('#modelSelectPlakali').selectpicker({
                liveSearch: true,
                liveSearchNormalize: true
            });
        }

    };


    //Kullanımm Şekilleri
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
    // araç türü ekleme alanı
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



    //Plakasız Form Araç Ekleme

    const vehicleForm = document.getElementById("vehicleForm");
    var accessoriesPlakasiz = [];
    var accessories = [];

    vehicleForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const lossPayeeType = parseInt(document.querySelector('input[name="lienType"]:checked')?.value);
        const lossPayeeName = document.getElementById("lossPayeeClauseInput")?.value?.trim();

        const lossPayeeTypePlakali = parseInt(document.querySelector('input[name="lienTypePlakali"]:checked')?.value);
        const lossPayeeNamePlakali = document.getElementById("lossPayeeClauseInputPlakali")?.value?.trim();
        // Plakasız aksesuarlar
        var soundAccessory = document.getElementById("accessorySound").value;
        var screenAccessory = document.getElementById("accessoryScreen").value;
        var otherAccessory = document.getElementById("accessoryOther").value;
        // Plakalı aksesuarlar
        var soundAccessoryPlakali = document.getElementById("accessorySoundPlakali").value;
        var screenAccessoryPlakali = document.getElementById("accessoryScreenPlakali").value;
        var otherAccessoryPlakali = document.getElementById("accessoryOtherPlakali").value;



        // Plakasız eklemeler (burda ters oldu)
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

        // Ortak değişken
        let formData = {};
        var state = JSON.parse(localStorage.getItem("state"));

        var id = state.user?.costumerId;

        if (!id) {
            const me = await apiGetFetch('customers/me');
            state.user.costumerId = me.id;
            id = me.id;
            localStorage.setItem('state', JSON.stringify(state));
        }


        if (isPlakasiz) {
            formData = {
                customerId: id,
                //accossories düzenlenecek
                accessories: accessoriesPlakasiz || null,

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
                plate: {
                    city: parseInt(document.getElementById("citySelectPlakali").value),
                    code: document.getElementById("plateInput").value
                },
                documentSerial: {
                    code: document.getElementById("documentSeries").value,
                    number: document.getElementById("documentNo").value
                },

                brandReference: brandSelectPlakali.value,
                modelTypeRefernece: document.getElementById("modelSelectPlakali").value,
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

                accessories: accessories || null,
                lossPayeeClause: (lossPayeeTypePlakali || lossPayeeNamePlakali)
                    ? { type: lossPayeeTypePlakali, name: lossPayeeNamePlakali }
                    : null
            }

        }

        console.log("Form Data Hazır:", formData);

        //API isteği
        try {

            const endpoint = "customers/" + id + "/vehicles";
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



    // tramer bilgileri ile verileri çek 


    document.getElementById('tramerBtn').addEventListener('click', async function () {

        const customerId = id;
        const plate = document.getElementById('plateInput').value.trim();
        const city = parseInt(document.getElementById('citySelectPlakali').value);
        const documentSerial = {
            code: document.getElementById('documentSeries').value.trim(),
            number: document.getElementById('documentNo').value.trim()
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

            const endpoint = `customers/${customerId}/vehicles/external-lookup`;
            const response = await apiPostFetch(endpoint, requestData);

            console.log("Tramer sorgu sonucu:", response);

            // Dönen verileri formda göster
            if (response) {
                document.getElementById('brandSelectPlakali').value = response.model?.brand?.value || '';
                document.getElementById('modelSelectPlakali').value = response.model?.type?.value || '';
                document.getElementById('yearInputPlakali').value = response.model?.year || '';
                document.getElementById('usageInputPlakali').value = response.utilizationStyle || '';
                document.getElementById('engineInputPlakali').value = response.engine || '';
                document.getElementById('chassisInputPlakali').value = response.chassis || '';
                document.getElementById('fuelInputPlakali').value = response.fuelType || '';
                document.getElementById('registrationDatePlakali').value = response.registrationDate || '';
                document.getElementById('seatCountPlakali').value = response.seatNumber || '';
            }

        } catch (error) {
            console.error("Tramer sorgulama hatası:", error);
        }
    });


}

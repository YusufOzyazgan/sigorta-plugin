
async function loadPropertyDropdowns(modalForm) {
    const citySelectProperty = modalForm.querySelector('#citySelectProperty');
    if (!citySelectProperty) return;

    const cities = (await apiGetFetch(`address-parameters/cities`))
        .sort((a, b) => a.text.localeCompare(b.text));

    citySelectProperty.disabled = false;
    jQuery(citySelectProperty).selectpicker({ liveSearch: true, liveSearchNormalize: true });
    jQuery(citySelectProperty).empty();
    jQuery(citySelectProperty).append(new Option("Şehir Seçin", ""));
    cities.forEach(c => jQuery(citySelectProperty).append(new Option(c.text, c.value)));
    jQuery(citySelectProperty).selectpicker('refresh');

    ['#districtSelect', '#townSelect', '#neighborhoodSelect', '#streetSelect', '#buildingSelect', '#apartmentSelect']
        .forEach(s => {
            const $el = modalForm.querySelector(s);
            if ($el) {
                jQuery($el).selectpicker('destroy').empty().prop('disabled', true);
            }


        
        });


citySelectProperty.addEventListener("change", async () => await loadDistricts(modalForm, citySelectProperty.value));

const districtSelect = modalForm.querySelector('#districtSelect');
if (districtSelect) districtSelect.addEventListener("change", async (e) => await loadTowns(modalForm, e.target.value));

const townSelect = modalForm.querySelector('#townSelect');
if (townSelect) townSelect.addEventListener("change", async (e) => await loadNeighborhoods(modalForm, e.target.value));

const neighborhoodSelect = modalForm.querySelector('#neighborhoodSelect');
if (neighborhoodSelect) neighborhoodSelect.addEventListener("change", async (e) => await loadStreets(modalForm, e.target.value));

const streetSelect = modalForm.querySelector('#streetSelect');
if (streetSelect) streetSelect.addEventListener("change", async (e) => await loadBuildings(modalForm, e.target.value));

const buildingSelect = modalForm.querySelector('#buildingSelect');
if (buildingSelect) buildingSelect.addEventListener("change", async (e) => await loadApartments(modalForm, e.target.value));
}


async function loadDistricts(modalForm, cityRef) {
    const districts = (await apiGetFetch(`address-parameters/districts?cityReference=${cityRef}`))
        .sort((a, b) => a.text.localeCompare(b.text));

    const districtSelect = modalForm.querySelector('#districtSelect');
    if (!districtSelect) return;
    districtSelect.disabled = false;
    jQuery(districtSelect).selectpicker('destroy').empty();
    districts.forEach(c => jQuery(districtSelect).append(new Option(c.text, c.value)));
    jQuery(districtSelect).selectpicker({ liveSearch: true, liveSearchNormalize: true });

    ['#townSelect', '#neighborhoodSelect', '#streetSelect', '#buildingSelect', '#apartmentSelect'].forEach(s => {
        const $el = modalForm.querySelector(s);
        if ($el) jQuery($el).selectpicker('destroy').empty().prop('disabled', true).selectpicker({ liveSearch: true, liveSearchNormalize: true });
    });
}


async function loadTowns(modalForm, districtRef) {
    const towns = (await apiGetFetch(`address-parameters/towns?districtReference=${districtRef}`))
        .sort((a, b) => a.text.localeCompare(b.text));

    const townSelect = modalForm.querySelector('#townSelect');
    if (!townSelect) return;
    townSelect.disabled = false;
    jQuery(townSelect).selectpicker('destroy').empty();
    jQuery(townSelect).append(new Option("Belde / Bucak Seçin", ""));
    towns.forEach(c => jQuery(townSelect).append(new Option(c.text, c.value)));
    jQuery(townSelect).selectpicker({ liveSearch: true, liveSearchNormalize: true });

    ['#neighborhoodSelect', '#streetSelect', '#buildingSelect', '#apartmentSelect'].forEach(s => {
        const $el = modalForm.querySelector(s);
        if ($el) jQuery($el).selectpicker('destroy').empty().prop('disabled', true).selectpicker({ liveSearch: true, liveSearchNormalize: true });
    });
}


async function loadNeighborhoods(modalForm, townRef) {
    const neighborhoods = (await apiGetFetch(`address-parameters/neighbourhoods?townReference=${townRef}`))
        .sort((a, b) => a.text.localeCompare(b.text));

    const neighborhoodSelect = modalForm.querySelector('#neighborhoodSelect');
    if (!neighborhoodSelect) return;
    neighborhoodSelect.disabled = false;
    jQuery(neighborhoodSelect).selectpicker('destroy').empty();
    neighborhoods.forEach(c => jQuery(neighborhoodSelect).append(new Option(c.text, c.value)));
    jQuery(neighborhoodSelect).selectpicker({ liveSearch: true, liveSearchNormalize: true });

    ['#streetSelect', '#buildingSelect', '#apartmentSelect'].forEach(s => {
        const $el = modalForm.querySelector(s);
        if ($el) jQuery($el).selectpicker('destroy').empty().prop('disabled', true).selectpicker({ liveSearch: true, liveSearchNormalize: true });
    });
}


async function loadStreets(modalForm, neighborhoodRef) {
    let streets = await apiGetFetch(`address-parameters/streets?neighbourhoodReference=${neighborhoodRef}`);
    if (!streets) return showMessage("Sokaklar çekilemedi", "error");
    streets = streets.sort((a, b) => a.text.localeCompare(b.text));

    const streetSelect = modalForm.querySelector('#streetSelect');
    if (!streetSelect) return;
    streetSelect.disabled = false;
    jQuery(streetSelect).selectpicker('destroy').empty();
    streets.forEach(c => jQuery(streetSelect).append(new Option(c.text, c.value)));
    jQuery(streetSelect).selectpicker({ liveSearch: true, liveSearchNormalize: true });

    ['#buildingSelect', '#apartmentSelect'].forEach(s => {
        const $el = modalForm.querySelector(s);
        if ($el) jQuery($el).selectpicker('destroy').empty().prop('disabled', true).selectpicker({ liveSearch: true, liveSearchNormalize: true });
    });
}


async function loadBuildings(modalForm, streetRef) {
    let buildings = await apiGetFetch(`address-parameters/buildings?streetReference=${streetRef}`);
    if (!buildings) return showMessage("Binalar çekilemedi", "error");
    buildings = buildings.sort((a, b) => a.text.localeCompare(b.text));

    const buildingSelect = modalForm.querySelector('#buildingSelect');
    if (!buildingSelect) return;
    buildingSelect.disabled = false;
    jQuery(buildingSelect).selectpicker('destroy').empty();
    buildings.forEach(c => jQuery(buildingSelect).append(new Option(c.text, c.value)));
    jQuery(buildingSelect).selectpicker({ liveSearch: true, liveSearchNormalize: true });

    const apt = modalForm.querySelector('#apartmentSelect');
    if (apt) jQuery(apt).selectpicker('destroy').empty().prop('disabled', true).selectpicker({ liveSearch: true, liveSearchNormalize: true });
}


async function loadApartments(modalForm, buildingRef) {
    let apartments = await apiGetFetch(`address-parameters/apartments?buildingReference=${buildingRef}`);
    if (!apartments) return showMessage("Daireler çekilemedi", "error");
    apartments = apartments.sort((a, b) => a.text.localeCompare(b.text));

    const apartmentSelect = modalForm.querySelector('#apartmentSelect');
    if (!apartmentSelect) return;
    apartmentSelect.disabled = false;
    jQuery(apartmentSelect).selectpicker('destroy').empty();
    apartments.forEach(c => jQuery(apartmentSelect).append(new Option(c.text, c.value)));
    jQuery(apartmentSelect).selectpicker({ liveSearch: true, liveSearchNormalize: true });
}


async function sorgulaUavt(modalForm, uavtNoId) {
    const uavtNo = modalForm.querySelector(`#${uavtNoId}`).value;
    if (!uavtNo) return alert("Lütfen UAVT numarası giriniz.");

    try {
        const data = await apiPostFetch(`properties/query-address-by-property-number`, { propertyNumber: uavtNo });
        ['city', 'district', 'town', 'neighborhood', 'street', 'building', 'apartment'].forEach(field => {
            const el = modalForm.querySelector(`#${field}SelectProperty`);
            if (el) {
                el.innerHTML = `<option value="${data[field].value}">${data[field].text}</option>`;
                jQuery(el).selectpicker('refresh');
            }
        });
    } catch (err) { console.error(err); alert("Adres sorgulamada hata oluştu."); }
}
window.loadPropertyDropdowns = loadPropertyDropdowns;
window.sorgulaUavt = sorgulaUavt;
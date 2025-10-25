document.addEventListener("DOMContentLoaded", function () {
    var konutModalEl = document.getElementById('konutModal');
    if (!konutModalEl) return;

    konutModalEl.addEventListener('shown.bs.modal', async function () {
        var modalBody = konutModalEl.querySelector('.modal-body');
        if (modalBody.dataset.loaded) return; // zaten yüklendiyse tekrar yükleme

        try {
            // Modal içeriğini AJAX ile çek
            const response = await fetch(konutVars.homeIconPath.replace('home.svg','konut-modal-content.php'));
            const html = await response.text();
            modalBody.innerHTML = html;

            // Sadece modal ile ilgili fonksiyonları çalıştır
            if (typeof window.loadKonutModule === "function") {
                window.loadKonutModule(modalBody);
            }

            modalBody.dataset.loaded = "true";
        } catch (err) {
            console.error("Modal yüklenirken hata:", err);
            modalBody.innerHTML = "<p>Modal içeriği yüklenemedi.</p>";
        }
    });
});



document.addEventListener("DOMContentLoaded", async () => {

    const id = konutVars.customerId; 
    const createBtn = document.getElementById('createProperty');

    if(createBtn) createBtn.addEventListener('click', async () => await konutOlustur());

    const propertiesList = document.getElementById("propertiesList");
    const propertyAlert = document.getElementById("propertyAlert");

 
    window.sorgulaUavt = async function() {
        const uavtNo = document.getElementById("uavtNo").value;
        if (!uavtNo) return alert("Lütfen UAVT numarası giriniz.");
        try {
            const uatvData = { propertyNumber: uavtNo };
            const data = await apiPostFetch(`properties/query-address-by-property-number`, uatvData);

            ["citySelectProperty","districtSelect","townSelect","neighborhoodSelect","streetSelect","buildingSelect","apartmentSelect"].forEach(id=>{
                const el = document.getElementById(id);
                el.innerHTML = `<option value="${data[id.replace('Select','').toLowerCase()].value}">${data[id.replace('Select','').toLowerCase()].text}</option>`;
            });

        } catch (err) { console.error(err); alert("Adres sorgulamada hata oluştu."); }
    }

    
    const selects = ["citySelectProperty","districtSelect","townSelect","neighborhoodSelect","streetSelect","buildingSelect","apartmentSelect"];
    selects.forEach(selId=>{
        const sel = document.getElementById(selId);
        sel.addEventListener("change", async ()=> await loadNextSelect(selId));
    });

    async function loadNextSelect(changedId){
        try{
            switch(changedId){
                case "citySelectProperty":
                    var districts = await apiGetFetch(`address-parameters/districts?cityReference=${document.getElementById("citySelectProperty").value}`);
                    fillSelect("districtSelect", districts); break;
                case "districtSelect":
                    var towns = await apiGetFetch(`address-parameters/towns?districtReference=${document.getElementById("districtSelect").value}`);
                    fillSelect("townSelect", towns); break;
                case "townSelect":
                    var neighborhoods = await apiGetFetch(`address-parameters/neighbourhoods?townReference=${document.getElementById("townSelect").value}`);
                    fillSelect("neighborhoodSelect", neighborhoods); break;
                case "neighborhoodSelect":
                    var streets = await apiGetFetch(`address-parameters/streets?neighbourhoodReference=${document.getElementById("neighborhoodSelect").value}`);
                    fillSelect("streetSelect", streets); break;
                case "streetSelect":
                    var buildings = await apiGetFetch(`address-parameters/buildings?streetReference=${document.getElementById("streetSelect").value}`);
                    fillSelect("buildingSelect", buildings); break;
                case "buildingSelect":
                    var apartments = await apiGetFetch(`address-parameters/apartments?buildingReference=${document.getElementById("buildingSelect").value}`);
                    fillSelect("apartmentSelect", apartments); break;
            }
        }catch(err){console.error("Select load error:", err);}
    }

    function fillSelect(id,data){
        const sel = document.getElementById(id);
        sel.innerHTML = '';
        if(!data || !data.length) return;
        data.sort((a,b)=>a.text.localeCompare(b.text)).forEach(o=> sel.append(new Option(o.text,o.value)));
        $(sel).selectpicker('refresh');
        sel.disabled = false;
    }

   
    document.querySelectorAll('input[name="lossPayeeClause"]').forEach(radio=>{
        radio.addEventListener('change',()=>{
            const lossPayeeProperty = document.getElementById('lossPayeeProperty');
            if(radio.value==="1") lossPayeeProperty.innerHTML = `<input type="text" id="lossPayeeClauseInputProperty" class="form-control" placeholder="Banka Adı">`;
            else if(radio.value==="2") lossPayeeProperty.innerHTML = `<input type="text" id="lossPayeeClauseInputProperty" class="form-control" placeholder="Kurum Adı">`;
            else lossPayeeProperty.innerHTML="";
        });
    });

 
    async function konutOlustur(){
        const lossPayeeType = parseInt(document.querySelector('input[name="lossPayeeClause"]:checked')?.value);
        const lossPayeeName = document.getElementById("lossPayeeClauseInputProperty")?.value?.trim();
        const floorSelect = document.getElementById("floorNumber");
        let minFloor=0, maxFloor=0;
        switch(floorSelect.value){
            case "0": await showMessage("Bina Kat Sayısını Girmeniz Gerekiyor","warning"); return;
            case "2": minFloor=1; maxFloor=3; break;
            case "3": minFloor=4; maxFloor=7; break;
            case "4": minFloor=8; maxFloor=18; break;
            case "5": minFloor=19; maxFloor=Number.MAX_SAFE_INTEGER; break;
        }

        const data = {
            customerId:id,
            floor:{currentFloor:parseInt(document.getElementById("whichFloor").value), totalFloors:{ $type:"range", min:minFloor, max:maxFloor }},
            KonutOldPolicyNumber:null,
            squareMeter:parseInt(document.getElementById("squareMeter").value)||0,
            constructionYear:parseInt(document.getElementById("constructionYear").value)||0,
            utilizationStyle:document.getElementById("utilizationStyle").value,
            damageStatus:document.getElementById("damageStatus").value,
            structure:document.getElementById("structure").value,
            number:parseInt(document.getElementById("apartmentSelect").value),
            ownershipType:document.getElementById("ownershipType").value,
            lossPayeeClause: (lossPayeeType || lossPayeeName)?{type:lossPayeeType,name:lossPayeeName}:null
        };

        try{
            const result = await apiPostFetch(`customers/${id}/properties`, data);
            await showMessage("Konut Eklendi","success");

    
            addPropertyToList(result || data);

         
            if(propertyAlert) propertyAlert.classList.add('d-none');

         
            const modalEl = document.getElementById('konutModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            if(modal) modal.hide();

        }catch(err){console.error(err); alert("Konut eklenirken hata oluştu.");}
    }

   
    function addPropertyToList(property){
        if(!propertiesList) return;
        const div = document.createElement('div');
        div.className = 'col-md-6';
        div.innerHTML = `
            <div class="card p-2 shadow-sm">
                <strong>${property.number ? 'Daire ' + property.number : 'Konut'}</strong><br>
                Metrekare: ${property.squareMeter || '-'} m²<br>
                Kat: ${property.floor?.currentFloor || '-'} / ${property.floor?.totalFloors?.max || '-'}<br>
                Durum: ${property.damageStatus || '-'}
            </div>
        `;
        propertiesList.appendChild(div);
    }

});

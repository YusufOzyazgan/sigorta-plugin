window.loadKonutModule = async function (container) {
    const state = JSON.parse(localStorage.getItem("state"));
    let isLoggedIn = state?.token?.accessToken;
    let customer = null;
    let customerId = null;
    let addedPropertyId = null;

    // --- Kullanıcı bilgilerini al ---
    if (isLoggedIn) {
        try {
            customer = await apiGetFetch("customers/me");
            customerId = customer.id;
            console.log("API'den gelen müşteri:", customer);
        } catch (err) {
            console.error("Müşteri bilgileri alınamadı:", err);
            isLoggedIn = false;
        }
    }

    const step1 = container.querySelector("#step1");
    const step2 = container.querySelector("#step2");
    const step3 = container.querySelector("#step3");
    const progressSteps = container.querySelectorAll("#stepProgress .step");
    const propertyAlert = container.querySelector("#propertyAlert");

    let mfaToken = null;

    function updateProgress(stepNumber) {
        progressSteps.forEach((s, i) => {
            if (i < stepNumber) s.classList.add('active');
            else s.classList.remove('active');
        });
    }

    function showStep(step) {
        [step1, step2, step3].forEach(s => s.classList.add('d-none'));
        step.classList.remove('d-none');
        step.classList.add('fade-in');
        setTimeout(() => step.classList.remove('fade-in'), 500);
        if (step === step1) updateProgress(1);
        if (step === step2) updateProgress(2);
        if (step === step3) updateProgress(3);
    }

    await firstStep();
    console.log("First step çağırıldı.");
    loadProperties();

    // --- Step2: Konut Bilgileri yükleme ---
    async function loadProperties() {
        if (!customerId) return;

        let properties = [];
        try { properties = await apiGetFetch(`customers/${customerId}/properties`); }
        catch (err) { console.error(err); }

        const propertiesList = container.querySelector('#propertiesList');
        let selectedPropertyId = null;

        if (properties.length > 0) {
            propertiesList.innerHTML = '';
            properties.forEach(p => {
                const col = document.createElement('div');
                col.classList.add('col-md-4');

                const card = document.createElement('div');
                card.classList.add('card', 'p-3', 'text-center');
                card.style.border = "1px solid #ddd";
                card.style.borderRadius = "10px";
                card.style.boxShadow = "0 4px 7px rgba(0,0,0,0.1)";
                card.style.cursor = 'pointer';

                const title = p.address.city?.text + "/" + p.address.district?.text;
                const address = [p.address.town?.text, p.address.neighborhood?.text, p.address.street?.text, p.address.building?.text, p.address.apartment?.text]
                    .filter(Boolean).join(" ");

                card.innerHTML = `
                    <div class="d-flex align-items-center p-2">
                        <img src="${konutVars.homeIconPath}" alt="Home Icon" class="me-3" style="width:40px; height:40px; object-fit:contain;">
                        <div class="d-flex flex-column justify-content-center">
                            <div style="font-weight:bold;">${title}</div>
                            <div style="font-size:0.9rem; color:#555;">${address}</div>
                        </div>
                    </div>
                `;

                card.dataset.propertyId = p.id;
                card.addEventListener('click', () => {
                    document.querySelectorAll('#propertiesList .card').forEach(c => c.classList.remove('border-primary'));
                    card.classList.add('border', 'border-primary');
                    selectedPropertyId = card.dataset.propertyId;
                });

                col.appendChild(card);
                propertiesList.appendChild(col);
            });
        } else {
            propertyAlert.classList.remove('d-none');
        }

        return selectedPropertyId;
    }

    if (isLoggedIn) await loadProperties();

    // --- Step2 navigasyon ---
    const backStep2 = container.querySelector("#backStep2");
    const nextStep2 = container.querySelector("#nextStep2");

    backStep2.addEventListener("click", () => showStep(step1));

    nextStep2.addEventListener("click", async (e) => {
        const selectedProperty = container.querySelector('#propertiesList .card.border-primary');
        if (!selectedProperty && !addedPropertyId) {
            alert("Lütfen bir konut seçin veya yeni konut ekleyin.");
            return;
        }

        const propertyId = selectedProperty ? selectedProperty.dataset.propertyId : addedPropertyId;

        const formData = {
            $type: "konut",
            channel: "WEBSITE",
            coverageGroupIds: null,
            insuredCustomerId: customerId,
            insurerCustomerId: customerId,
            productBranch: "KONUT",
            propertyId: propertyId,
            electronicDevicePrice: 0,
            furniturePrice: 0,
            insulationPrice: 0,
            windowPrice: 0,
        };

        try {
            const proposal = await apiPostFetch("proposals", formData);
            if (proposal?.proposalId) {
                showStep(step3);
                await loadProposalDetails(proposal.proposalId);
            } else {
              return;
            }

        } catch (err) {
            console.error(err);
            alert("Teklif alınamadı!");
        }
    });

    // --- Teklif detaylarını yükleme ---
    // async function loadProposalDetails(proposalId) {
    //     const offerResults = container.querySelector("#offerResults");
    //     offerResults.innerHTML = `<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Yükleniyor...</span></div><p class="mt-2">Teklifler hazırlanıyor...</p></div>`;

    //     try {
    //         let response = await apiGetFetch("proposals/" + proposalId);
    //         let products = response.products;

    //         let waitedCount = products.filter(p => p.state === "WAITING").length;
    //         let requestCount = 0;

    //         while (waitedCount > 2 && requestCount < 10) {
    //             await new Promise(r => setTimeout(r, 2000));
    //             response = await apiGetFetch("proposals/" + proposalId);
    //             products = response.products;
    //             waitedCount = products.filter(p => p.state === "WAITING").length;
    //             requestCount++;

    //             offerResults.innerHTML = `<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Yükleniyor...</span></div><p class="mt-2">Teklifler hazırlanıyor... (${requestCount}/10)</p></div>`;
    //         }

    //         const activeProducts = products.filter(p => p.state === "ACTIVE");
    //         if (!activeProducts.length) {
    //             offerResults.innerHTML = `<div class="alert alert-warning text-center"><h5>Üzgünüz!</h5><p>Maalesef bu konut için uygun teklif bulunamadı.</p></div>`;
    //             return;
    //         }

    //         renderProposalResults(activeProducts);

    //     } catch (err) {
    //         console.error(err);
    //         offerResults.innerHTML = `<div class="alert alert-danger text-center"><h5>Hata!</h5><p>Teklifler yüklenirken bir hata oluştu.</p></div>`;
    //     }
    // }

    // --- Teklifleri render et ---
    // function renderProposalResults(products) {
    //     const offerResults = container.querySelector("#offerResults");
    //     let html = `<div class="mb-4"><h5 class="text-success">🎉 ${products.length} Adet Teklif Bulundu!</h5><p class="text-muted">Size en uygun konut sigortası tekliflerini karşılaştırın.</p></div><div class="row g-4">`;

    //     products.forEach(p => {
    //         const address = p.warranties
    //             ? p.warranties.map(w => `<li class="mb-1"><i class="fas fa-check text-success me-2"></i>${w}</li>`).join('')
    //             : '<li>Teminat bilgisi bulunamadı</li>';
    //         html += `<div class="col-md-6 col-lg-4"><div class="card h-100 shadow-sm"><div class="card-body">
    //             <div class="d-flex justify-content-between align-items-center mb-3">
    //                 <img style="width:60px;height:40px;object-fit:contain;" src="${p.insuranceCompanyLogo || ''}" alt="${p.insuranceCompanyName} Logo" class="company-logo">
    //                 <span class="badge bg-primary">${p.insuranceCompanyName}</span>
    //             </div>
    //             <h6 class="card-title">${p.insuranceCompanyName}</h6>
    //             <p class="card-text text-muted small">Teklif No: ${p.offerNo || 'N/A'}</p>
    //             <div class="text-center mb-3"><h4 class="text-primary mb-1">${p.premiums?.totalPremium || 'Fiyat bilgisi yok'} ₺</h4><small class="text-muted">${p.taxesIncluded ? 'Vergiler Dahil' : 'Vergiler Hariç'}</small></div>
    //             <div class="mb-3"><span class="badge bg-success">${p.paymentType || 'Peşin'}</span></div>
    //             <div class="d-grid gap-2">
    //                 <a class="toggle-warranties text-decoration-none text-primary small" 
    //                         data-product-id="${p.id}" 
    //                         data-proposal-id="${proposalId}"
    //                         style="cursor: pointer; font-size: 0.8rem;">Teminatları Gör</a>
    //                 <button class="btn btn-primary">Satın Al</button>
    //             </div>
    //         </div></div></div>`;
    //     });

    //     html += `</div><div class="mt-5 pt-4 border-top"><h5 class="mb-3">Konut Sigortası Hakkında</h5><p class="text-muted">Konut sigortası, evinizi doğal afetler, hırsızlık, yangın gibi risklere karşı korur. Yukarıdaki tekliflerden size uygun olanı seçerek hemen satın alabilirsiniz.</p></div>`;
    //     offerResults.innerHTML = html;

    //     container.querySelectorAll('.toggle-warranties').forEach(btn => {
    //         btn.addEventListener('click', function () {
    //             const productId = this.getAttribute('data-product-id');
    //             const proposalId = this.getAttribute('data-proposal-id');
                
    //             if (window.showWarrantiesModal) {
    //                 window.showWarrantiesModal(proposalId, productId);
    //             } else {
    //                 console.error('showWarrantiesModal fonksiyonu bulunamadı!');
    //             }
    //         });
    //     });
    // }

    // --- Modal açıldığında şehir dropdownlarını yükle ---
    $('#konutModal').on('shown.bs.modal', async function () {
        const modalForm = this.querySelector('form');
        if (modalForm && window.loadPropertyDropdowns) {
            console.log("Konut modal açıldı, şehir verileri yükleniyor...");
            try {
                await window.loadPropertyDropdowns(modalForm);
                $('.selectpicker').selectpicker('refresh'); // Görsel yenileme
                console.log("Şehir dropdown yüklendi.");
            } catch (err) {
                console.error("Şehir dropdown yüklenemedi:", err);
            }
        } else {
            console.error("Modal form veya loadPropertyDropdowns bulunamadı.");
        }
    });
};

// assets/js/konut.js
// Bu dosya modal içindeki adres zincirini ve konut oluşturmayı, hiçbir mevcut akışı bozmadan çalıştırır.

(function () {
  // Eğer başka bir yerde tanımlı değilse, no-op bırakıyoruz ki konut.php içindeki çağrı hata vermesin.
  if (typeof window.loadKonutModule !== "function") {
    window.loadKonutModule = async function () { /* no-op: sayfayı bozmamak için tanımlı bırak */ };
  }

  document.addEventListener("DOMContentLoaded", () => {
    const konutModal = document.getElementById("konutModal");
    if (konutModal) {
      // Modal her görünür olduğunda adres zinciri ve radio bağlayıcılarını başlat
      konutModal.addEventListener("shown.bs.modal", async () => {
        await Konut.initAddressChain();
        Konut.bindLossPayeeToggle();
        Konut.bindCreateProperty();
      });
    }
  });

  // Tekrar çağrılmaya dayanıklı küçük yardımcı
  function safeReinitSelectpicker(selector) {
    const $el = window.jQuery ? jQuery(selector) : null;
    if (!$el || !$el.length) return;
    try { $el.selectpicker('destroy'); } catch (_) {}
    $el.selectpicker({ liveSearch: true, liveSearchNormalize: true });
  }

  function clearAndDisable(selector) {
    const $el = window.jQuery ? jQuery(selector) : null;
    if (!$el || !$el.length) return;
    try { $el.selectpicker('destroy'); } catch (_) {}
    $el.empty();
    $el.prop('disabled', true);
    $el.selectpicker({ liveSearch: true, liveSearchNormalize: true });
  }

  async function fillSelect(selector, items) {
    const $el = window.jQuery ? jQuery(selector) : null;
    if (!$el || !$el.length) return;
    try { $el.selectpicker('destroy'); } catch (_) {}
    $el.empty();
    items.forEach(opt => $el.append(new Option(opt.text, opt.value)));
    $el.prop('disabled', false);
    $el.selectpicker({ liveSearch: true, liveSearchNormalize: true });
  }

  async function fetchSorted(url) {
    const list = await apiGetFetch(url);
    if (!Array.isArray(list)) return [];
    return list.sort((a, b) => a.text.localeCompare(b.text));
  }

  // Global namespace
  window.Konut = window.Konut || {};

  // 1) Modal içindeki adres zinciri
  window.Konut.initAddressChain = async function () {
    const citySel = document.getElementById("citySelectProperty");
    if (!citySel) return; // modal henüz DOM'da değilse

    // En alttakileri sıfırla
    ["#districtSelect", "#townSelect", "#neighborhoodSelect", "#streetSelect", "#buildingSelect", "#apartmentSelect"]
      .forEach(clearAndDisable);

    // Şehirleri yükle
    const cities = await fetchSorted(`address-parameters/cities`);
    await fillSelect('#citySelectProperty', cities);

    // — Change handlers (jQuery .off().on() ile çift bağlanmayı önle) —
    // 'change.konut' kullanarak namespace belirledik, böylece sadece bizim eklediğimiz listener'ları kaldırırız.

    const $ = window.jQuery; // jQuery'yi güvenle kullan

    // İl → İlçe
    $('#citySelectProperty').off('change.konut').on('change.konut', async function () {
      const districts = await fetchSorted(`address-parameters/districts?cityReference=${this.value}`);
      await fillSelect('#districtSelect', districts);
      ["#townSelect", "#neighborhoodSelect", "#streetSelect", "#buildingSelect", "#apartmentSelect"].forEach(clearAndDisable);
    });

    // İlçe → Belde
    $('#districtSelect').off('change.konut').on('change.konut', async function () {
      const towns = await fetchSorted(`address-parameters/towns?districtReference=${this.value}`);
      await fillSelect('#townSelect', towns);
      ["#neighborhoodSelect", "#streetSelect", "#buildingSelect", "#apartmentSelect"].forEach(clearAndDisable);
    });

    // Belde → Mahalle
    $('#townSelect').off('change.konut').on('change.konut', async function () {
      const neighborhoods = await fetchSorted(`address-parameters/neighbourhoods?townReference=${this.value}`);
      await fillSelect('#neighborhoodSelect', neighborhoods);
      ["#streetSelect", "#buildingSelect", "#apartmentSelect"].forEach(clearAndDisable);
    });

    // Mahalle → Sokak
    $('#neighborhoodSelect').off('change.konut').on('change.konut', async function () {
      const streets = await fetchSorted(`address-parameters/streets?neighbourhoodReference=${this.value}`);
      await fillSelect('#streetSelect', streets);
      ["#buildingSelect", "#apartmentSelect"].forEach(clearAndDisable);
    });

    // Sokak → Bina
    $('#streetSelect').off('change.konut').on('change.konut', async function () {
      const buildings = await fetchSorted(`address-parameters/buildings?streetReference=${this.value}`);
      await fillSelect('#buildingSelect', buildings);
      ["#apartmentSelect"].forEach(clearAndDisable);
    });

    // Bina → Daire
    $('#buildingSelect').off('change.konut').on('change.konut', async function () {
      const apartments = await fetchSorted(`address-parameters/apartments?buildingReference=${this.value}`);
      await fillSelect('#apartmentSelect', apartments);
    });
  };

  // 2) UAVT sorgusu — onclick="sorgulaUavt()" için global fonksiyon
  window.sorgulaUavt = async function () {
    const uavtInput = document.getElementById("uavtNo");
    if (!uavtInput) return;
    const uavtNo = uavtInput.value?.trim();
    if (!uavtNo) { alert("Lütfen UAVT numarası giriniz."); return; }

    try {
      // API endpoint'indeki görünmez karakteri temizledim
      const data = await apiPostFetch(`properties/query-address-by-property-number`, { propertyNumber: uavtNo });

      // Select’leri tek seçenekle doldurup aktif et
      const map = [
        ["#citySelectProperty", data.city],
        ["#districtSelect", data.district],
        ["#townSelect", data.town],
        ["#neighborhoodSelect", data.neighborhood],
        ["#streetSelect", data.street],
        ["#buildingSelect", data.building],
        ["#apartmentSelect", data.apartment],
      ];
      for (const [sel, obj] of map) {
        if (obj && typeof obj === 'object') {
          await fillSelect(sel, [{ text: obj.text, value: obj.value }]);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Adres sorgulamada hata oluştu.");
    }
  };

  // 3) Dain-i Mürtehin radio toggle (modal içi)
  window.Konut.bindLossPayeeToggle = function () {
    const radios = document.querySelectorAll('input[name="lossPayeeClause"]');
    const container = document.getElementById('lossPayeeProperty');
    if (!radios?.length || !container) return;

    // Önce eski içerik temiz
    container.innerHTML = "";

    const $ = window.jQuery; // jQuery'yi güvenle kullan

    radios.forEach(radio => {
      // jQuery .off().on() ile çift bağlanmayı önle (cloneNode yerine)
      $(radio).off('change.konut').on('change.konut', () => {
        if (radio.value === "1") {
          container.innerHTML = `<input type="text" id="lossPayeeClauseInputProperty" class="form-control" placeholder="Banka Adı">`;
        } else if (radio.value === "2" || radio.value === "Finans Kurumu") {
          container.innerHTML = `<input type="text" id="lossPayeeClauseInputProperty" class="form-control" placeholder="Kurum Adı">`;
        } else {
          container.innerHTML = "";
        }
      });
    });
  };

  // 4) Konut oluşturma
  window.Konut.bindCreateProperty = function () {
    const btn = document.getElementById("createProperty");
    if (!btn) return;

    // jQuery .off().on() ile çift bağlanmayı önle (cloneNode yerine)
    window.jQuery(btn).off('click.konut').on('click.konut', async () => {
      await konutOlustur();
    });
  };

  async function konutOlustur() {
    try {
      let state = JSON.parse(localStorage.getItem("state"));
      let id = state?.user?.costumerId;
      if (!id) {
        const me = await apiGetFetch('customers/me');
        state = state || {};
        state.user = state.user || {};
        state.user.costumerId = me.id;
        id = me.id;
        localStorage.setItem('state', JSON.stringify(state));
      }

      const floorSelect = document.getElementById("floorNumber");
      let minFloor = 0, maxFloor = 0;
      switch (floorSelect?.value) {
        case "2": minFloor = 1; maxFloor = 3; break;
        case "3": minFloor = 4; maxFloor = 7; break;
        case "4": minFloor = 8; maxFloor = 18; break;
        case "5": minFloor = 19; maxFloor = Number.MAX_SAFE_INTEGER; break;
        default:
          await showMessage?.("Bina Kat Sayısını Girmeniz Gerekiyor", "warning");
          return;
      }

      const lossType = parseInt(document.querySelector('input[name="lossPayeeClause"]:checked')?.value);
      const lossName = document.getElementById("lossPayeeClauseInputProperty")?.value?.trim();

      const payload = {
        customerId: id,
        floor: {
          currentFloor: parseInt(document.getElementById("whichFloor").value),
          totalFloors: { $type: "range", max: maxFloor, min: minFloor }
        },
        squareMeter: parseInt(document.getElementById("squareMeter").value) || 0,
        constructionYear: parseInt(document.getElementById("constructionYear").value) || 0,
        utilizationStyle: document.getElementById("utilizationStyle").value,
        damageStatus: document.getElementById("damageStatus").value,
        structure: document.getElementById("structure").value,
        number: parseInt(document.getElementById("apartmentSelect").value),
        ownershipType: document.getElementById("ownershipType").value,
        lossPayeeClause: (lossType || lossName) ? { type: lossType, name: lossName } : null
      };

      console.log("konut payload:", payload);
      const res = await apiPostFetch(`customers/${id}/properties`, payload);
      if (res) {
        await showMessage?.("Konut Eklendi", "success");
        alert("Konut başarıyla eklendi!");
      }
    } catch (err) {
      console.error("Konut eklenirken hata:", err);
      alert("Konut eklenirken hata oluştu.");
    }
  }

})();
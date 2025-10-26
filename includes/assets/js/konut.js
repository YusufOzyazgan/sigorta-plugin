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
                    const address = [p.address.town?.text, p.address.neighborhood?.text, p.address.street?.text, p.address.building?.text, p.address.apartment?.text].filter(Boolean).join(" ");

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
                productBranch: "Konut",
                propertyId: propertyId
            };

            try {
                const proposal = await apiPostFetch("proposals", formData);
                if (proposal?.proposalId) {
                    showStep(step3);
                    await loadProposalDetails(proposal.proposalId);
                } else {
                    alert("Teklif oluşturulamadı!");
                }
            } catch (err) {
                console.error(err);
                alert("Teklif alınamadı!");
            }
        });

        // --- Teklif detaylarını yükleme ---
        async function loadProposalDetails(proposalId) {
            const offerResults = container.querySelector("#offerResults");
            offerResults.innerHTML = `<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Yükleniyor...</span></div><p class="mt-2">Teklifler hazırlanıyor...</p></div>`;

            try {
                let response = await apiGetFetch("proposals/" + proposalId);
                let products = response.products;

                let waitedCount = products.filter(p => p.state === "WAITING").length;
                let requestCount = 0;

                while (waitedCount > 2 && requestCount < 10) {
                    await new Promise(r => setTimeout(r, 2000));
                    response = await apiGetFetch("proposals/" + proposalId);
                    products = response.products;
                    waitedCount = products.filter(p => p.state === "WAITING").length;
                    requestCount++;

                    offerResults.innerHTML = `<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Yükleniyor...</span></div><p class="mt-2">Teklifler hazırlanıyor... (${requestCount}/10)</p></div>`;
                }

                const activeProducts = products.filter(p => p.state === "ACTIVE");
                if (!activeProducts.length) {
                    offerResults.innerHTML = `<div class="alert alert-warning text-center"><h5>Üzgünüz!</h5><p>Maalesef bu konut için uygun teklif bulunamadı.</p></div>`;
                    return;
                }

                renderProposalResults(activeProducts);

            } catch (err) {
                console.error(err);
                offerResults.innerHTML = `<div class="alert alert-danger text-center"><h5>Hata!</h5><p>Teklifler yüklenirken bir hata oluştu.</p></div>`;
            }
        }

        // --- Teklifleri render et ---
        function renderProposalResults(products) {
            const offerResults = container.querySelector("#offerResults");
            let html = `<div class="mb-4"><h5 class="text-success">🎉 ${products.length} Adet Teklif Bulundu!</h5><p class="text-muted">Size en uygun konut sigortası tekliflerini karşılaştırın.</p></div><div class="row g-4">`;

            products.forEach(p => {
                const address = p.warranties ? p.warranties.map(w => `<li class="mb-1"><i class="fas fa-check text-success me-2"></i>${w}</li>`).join('') : '<li>Teminat bilgisi bulunamadı</li>';
                html += `<div class="col-md-6 col-lg-4"><div class="card h-100 shadow-sm"><div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <img style="width:60px;height:40px;object-fit:contain;" src="${p.insuranceCompanyLogo || ''}" alt="${p.insuranceCompanyName} Logo" class="company-logo">
                    <span class="badge bg-primary">${p.insuranceCompanyName}</span>
                </div>
                <h6 class="card-title">${p.insuranceCompanyName}</h6>
                <p class="card-text text-muted small">Teklif No: ${p.offerNo || 'N/A'}</p>
                <div class="text-center mb-3"><h4 class="text-primary mb-1">${p.premiums?.totalPremium || 'Fiyat bilgisi yok'} ₺</h4><small class="text-muted">${p.taxesIncluded ? 'Vergiler Dahil' : 'Vergiler Hariç'}</small></div>
                <div class="mb-3"><span class="badge bg-success">${p.paymentType || 'Peşin'}</span></div>
                <div class="d-grid gap-2">
                    <a class="toggle-warranties text-decoration-none text-primary small" 
                            data-product-id="${p.id}" 
                            data-proposal-id="${proposalId}"
                            style="cursor: pointer; font-size: 0.8rem;">Teminatları Gör</a>
                    <button class="btn btn-primary">Satın Al</button>
                </div>
            </div></div></div>`;
            });

            html += `</div><div class="mt-5 pt-4 border-top"><h5 class="mb-3">Konut Sigortası Hakkında</h5><p class="text-muted">Konut sigortası, evinizi doğal afetler, hırsızlık, yangın gibi risklere karşı korur. Yukarıdaki tekliflerden size uygun olanı seçerek hemen satın alabilirsiniz.</p></div>`;
            offerResults.innerHTML = html;

            container.querySelectorAll('.toggle-warranties').forEach(btn => {
                btn.addEventListener('click', function () {
                    const productId = this.getAttribute('data-product-id');
                    const proposalId = this.getAttribute('data-proposal-id');
                    
                    // Global modal fonksiyonunu çağır
                    if (window.showWarrantiesModal) {
                        window.showWarrantiesModal(proposalId, productId);
                    } else {
                        console.error('showWarrantiesModal fonksiyonu bulunamadı!');
                    }
                });
            });
        }
  
};



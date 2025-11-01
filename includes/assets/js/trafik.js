

let selectedVehicleId = null;
window.loadTrafikModule = async function () {
    console.log("Trafik teklif modulü çalıştı.");
    const addProposalBtn = document.querySelector('#addProposal');
    let customer = null;


    await firstStep();

    await showVehicles();

    backStepBtn.addEventListener('click', async () => {
        await backStepFunction();
    });

    addProposalBtn.addEventListener('click', async () => {
        console.log("Teklif alma butonuna basıldı teklif idsi :", selectedVehicleId);

        if (!selectedVehicleId) {
            await showMessage("Lütfen bir araç seçin!", "warning");
            return;
        }

        await createProposal(selectedVehicleId);
    });




}

async function createProposal(selectedVehicleId) {
    console.log("Teklif alma fonksiyonu çalıştı");

    await showStep(step3);
    customer = await apiGetFetch("customers/me");

    const formData = {
        $type: "trafik",
        channel: "WEBSITE",
        // coverageGroupIds: ["69033fc2760289c8c92b1059"],
        coverageGroupIds: ["69033fc2760289c8c92b1059"],
        insuredCustomerId: customer.id,
        insurerCustomerId: customer.id,
        productBranch: "Trafik",
        vehicleId: selectedVehicleId
    };
    const proposal = await apiPostFetch("proposals", formData);
    if (proposal?.proposalId) {
        await showMessage("Teklif oluşturuldu", "success");
        await loadProposalDetails(proposal.proposalId);
    } else {
        await showMessage("Teklif oluşturulamadı.", "error");
    }
}
// Teklif sonuçlarını render eden fonksiyon
async function renderProposalResults(products, proposalId) {
    let offerResults = document.getElementById("offerResults");


    let productsHtml = `
                <div class="mb-4">
                    <h5 class="text-success">🎉 ${products.length} Adet Teklif Bulundu!</h5>
                    <p class="text-muted">Size en uygun trafik sigortası tekliflerini karşılaştırın.</p>
                </div>
                <div class="row g-4">
                

            `;

    for (const product of products) {
        //var warranties = await apiGetFetch(`proposals/${proposalId}/products/${product.id}/coverage`);

                                //proposals/{proposalId}/products/{proposalProductId}/premiums/{installmentNumber}
        var fiyat = product.premiums[0]?.grossPremium ?? 0;
        var formatliFiyat = Number(fiyat).toLocaleString('tr-TR', { minimumFractionDigits: 2 });
        productsHtml += `
                    <div class="col-md-6 col-lg-4">
                        <div class="card h-100 shadow-sm">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <img style="width: 100px; height: 60px; object-fit: contain;" 
                                         src="${product.insuranceCompanyLogo || ''}" 
                                         alt="${product.insuranceCompanyName} Logo" 
                                         class="company-logo">
                                    <span class="badge bg-primary">${product.insuranceCompanyName}</span>
                                </div>
                                
                                <h6 class="card-title">${product.insuranceCompanyName}</h6>
                                <p class="card-text text-muted small">Teklif No: ${product.premiums[0]?.insuranceCompanyProposalNumber || 'N/A'}</p>
                                
                                <div class="text-center mb-3">
                                    <h4 class="text-primary mb-1">${formatliFiyat || 'Fiyat bilgisi yok'} ₺</h4>
                                    <small class="text-muted">${product.taxesIncluded ? 'Vergiler Dahil' : 'Vergiler Hariç'}</small>
                                </div>
                                
                                <div class="mb-3">
                                    <span class="badge bg-success">${product.premiums[0].installmentNumber == 1 ? 'Peşin' : 'Taksit'}</span>
                                </div>
                                
                                <div class="d-grid gap-2">
                                    <a class="toggle-warranties text-center text-decoration-none text-warning small" 
                                            data-product-id="${product.id}"
                                            data-proposal-id="${proposalId}"
                                            style="cursor: pointer; font-size: 0.8rem;">
                                        Teminatları Gör
                                    </a>
                                    <button id="buyButton" data-product-id="${product.id} " data-proposal-id="${proposalId}" class="btn btn-outline-primary">Satın Al</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
    };

    productsHtml += `
                </div>
                <div class="mt-5 pt-4 border-top">
                    <h5 class="mb-3">Trafik Sigortası Hakkında</h5>
                    <p class="text-muted">
                        Trafik sigortası, aracınızı trafikte oluşabilecek kazalar sonucu üçüncü şahıslara verebileceğiniz maddi ve bedeni zararlara karşı güvence altına alır.
                        Yukarıdaki tekliflerden size uygun olanı seçerek hemen satın alabilirsiniz.
                    </p>
                </div>
            `;

    offerResults.innerHTML += productsHtml;

    // Teminatlar butonlarına event listener ekle
    document.querySelectorAll('.toggle-warranties').forEach(button => {
        button.addEventListener('click', function () {
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

    // Satın alma butonlarına event listener ekle
    document.querySelectorAll('#buyButton').forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-product-id');
            const proposalId = this.getAttribute('data-proposal-id');
            
            // Ödeme işlemini başlat
            initiatePurchase(proposalId, productId);
        });
    });
}

// Ödeme işlemini başlatan fonksiyon
async function initiatePurchase(proposalId, productId) {
    let tc = localStorage.getItem('state') ? JSON.parse(localStorage.getItem('state')).user.tc : null;
    
    try {
        // Ödeme sayfasına yönlendirme mesajı göster
        await showMessage("Ödeme sayfasına yönlendiriliyorsunuz...", "info");

        let customer = await apiGetFetch("customers/me");
        productId = productId.trim();

        if (proposalId.includes('/')) {
            proposalId = proposalId.split('/')[0];
        }
        // Callback URL'i oluştur
        const callbackUrl = `${window.location.origin}/payment-callback/?proposalId=${proposalId}&productId=${productId}&installmentNumber=1`;
        
        // Ödeme verilerini hazırla
        const paymentData = {
            "$type": "insurance-company-redirect",
            "card": {
                "identityNumber": customer.identityNumber.toString(),
                "number": "",
                "cvc": "",
                "expiryMonth": "",
                "expiryYear": "",
                "holderName": ""
            },
            "proposalId": proposalId,
            "proposalProductId": productId,
            "installmentNumber": 1,
            "callbackUrl": callbackUrl
        };

        // API isteğini gönder
        const response = await apiPostFetch(`proposals/${proposalId}/products/${productId}/purchase/async`, paymentData);
        
        if (response && response.redirectUrl) {
            // Başarılı mesaj göster
            await showMessage("Ödeme sayfasına yönlendiriliyorsunuz...", "success");
            
            // 2 saniye sonra yönlendir
            setTimeout(() => {
                window.location.href = response.redirectUrl;
            }, 2000);
        } else {
            await showMessage("Ödeme işlemi başlatılamadı!", "error");
        }
    } catch (error) {
        console.error('Ödeme hatası:', error);
        await showMessage("Ödeme işlemi sırasında bir hata oluştu!", "error");
    }
}

async function loadProposalDetails(proposalId) {
    let offerResults = document.getElementById("offerResults");
    let loadingResults = document.getElementById("loadingResults");
    
    // Mesaj zamanlayıcısı için değişken
    let messageInterval = null;
    
    // İlk yükleme mesajı
    const initialMessage = "🚀 Sigorta teklifleriniz için hazırlık yapıyoruz...";
    loadingResults.innerHTML = `
        <div class="text-center">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Yükleniyor...</span>
            </div>
            <p class="mt-3 mb-2" id="loadingMessage" style="font-size: 1.1rem; margin:20px; font-weight: 500; color:rgb(253, 177, 13);">
                ${initialMessage}
            </p>
            <p class="text-muted small mb-3">Teklifler hazırlanıyor...</p>
            <div class="progress mt-2" style="height: 28px; border-radius: 15px;">
                <div id="progressBar" class="progress-bar progress-bar-striped progress-bar-animated" 
                     role="progressbar" 
                     style="width: 0%; font-weight: bold; font-size: 0.9rem; display: flex; align-items: center; justify-content: center;">0%</div>
            </div>
        </div>
    `;

    try {
        let response = await apiGetFetch("proposals/" + proposalId);
        let products = response.products;

        // Toplam ürün sayısını al
        const totalProductsCount = products.length;
        
        if (totalProductsCount === 0) {
            loadingResults.innerHTML = "";
            offerResults.innerHTML = `
                <div class="alert alert-warning text-center">
                    <h5>Üzgünüz!</h5>
                    <p>Maalesef bu araç için uygun teklif bulunamadı. Lütfen farklı bir araç deneyin.</p>
                </div>
            `;
            return;
        }

        // WAITING olmayan ürünleri say ve yüzdeyi hesapla
        function getCompletedProducts(products) {
            return products.filter(p => p.state !== "WAITING");
        }

        function calculatePercentage(completedCount, totalCount) {
            return Math.round((completedCount / totalCount) * 100);
        }

        function updateProgressBar(percentage) {
            const progressBar = document.getElementById("progressBar");
            if (progressBar) {
                progressBar.style.width = percentage + "%";
                progressBar.textContent = percentage + "%";
            }
        }

        // Sigorta ile ilgili dikkat çekici mesajlar - Her 5 saniyede bir değişir
        const messages = [
            "Türkiye'de her 5 araçtan 1'inin kaskosu yok, peki ya sizin aracınız?",
            "Bir sigorta poliçesi, saniyede 3 kişinin hayatını kolaylaştırıyor.",
            "Dünyada ilk sigorta, milattan önce 1750 yılında yapılmıştı!",
            "Bir evin ortalama onarım masrafı, yıllık konut sigortası priminin 12 katı.",
            "Kasko sahibi sürücüler, hasar sonrası ortalama 9 kat daha az maddi kayıp yaşıyor.",
            "Her 2 kazadan 1'i evden 5 kilometre uzaklıkta oluyor.",
            "Deprem sigortası olan konut sayısı, son 5 yılda iki kat arttı.",
            "Dünyanın en pahalı sigortası, bir futbolcunun bacakları için yapıldı!",
            "Sigorta yaptıranların %82'si, ilk hasar sonrası poliçesinin önemini fark ettiğini söylüyor.",
            "Küçük bir primle büyük bir felaketi önlemek mümkün!",
            "Her 10 kişiden 7'si, sigorta yaptırmadığı için beklenmedik masraflarla karşılaşıyor.",
            "Bir sağlık sigortası, ortalama 3 hastane faturası kadar tasarruf sağlıyor.",
            "Sigortasız araçların kazalarda oluşturduğu zarar, yıllık 2 milyar TL'yi geçiyor.",
            "Ev kazaları, tüm kazaların %40'ını oluşturuyor. Konut sigortası fark yaratır.",
            "Bir sel felaketinde ortalama hasar maliyeti 150.000 TL'yi bulabiliyor.",
            "Yapay zekâ destekli sigortalar artık hasar tespitini dakikalar içinde yapıyor.",
            "DASK, bugüne kadar 500 binden fazla konuta ödeme yaptı.",
            "Bir poliçe iptali, beklenmedik bir olayda 10 yıllık birikimi silebilir.",
            "Sigorta yaptırmak, geleceğe duyulan güvenin en somut hâlidir.",
            "Dünyada her saniye 45 sigorta poliçesi düzenleniyor!"
        ];

        // Mesaj indeksi - her 5 saniyede bir artacak
        let messageIndex = 0;

        // Mesajı güncelleme fonksiyonu
        function updateLoadingMessage() {
            const loadingMessageEl = document.getElementById("loadingMessage");
            if (loadingMessageEl) {
                loadingMessageEl.textContent = messages[messageIndex % messages.length];
                messageIndex++;
            }
        }

        // Mesajları 5 saniyede bir değiştiren zamanlayıcıyı başlat
        messageInterval = setInterval(updateLoadingMessage, 5000);

        let requestCount = 0;
        let completedProducts = getCompletedProducts(products);
        let percentage = calculatePercentage(completedProducts.length, totalProductsCount);
        updateProgressBar(percentage);

        console.log(`Toplam ürün: ${totalProductsCount}, Tamamlanan: ${completedProducts.length}, Yüzde: ${percentage}%`);

        // WAITING olan ürünler varsa ve maksimum istek sayısına ulaşmadıysak bekle
        while (percentage < 100 && requestCount < 35) {
            await new Promise(resolve => setTimeout(resolve, 4000));
            
            response = await apiGetFetch("proposals/" + proposalId);
            products = response.products;
            requestCount++;

            completedProducts = getCompletedProducts(products);
            percentage = calculatePercentage(completedProducts.length, totalProductsCount);
            updateProgressBar(percentage);

            console.log(`Tamamlanan: ${completedProducts.length}/${totalProductsCount}, Yüzde: ${percentage}%, İstek: ${requestCount}`);

            // Progress bar'ı güncelle (mesaj zamanlayıcı tarafından otomatik güncelleniyor)
            const currentMessage = messages[messageIndex % messages.length];
            loadingResults.innerHTML = `
                <div class="text-center">
                    <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                        <span class="visually-hidden">Yükleniyor...</span>
                    </div>
                    <p class="mt-3 my-4" id="loadingMessage" style="margin:20px; font-size: 1.1rem; font-weight: 500; color:rgb(253, 177, 13); min-height: 2rem;">
                        ${currentMessage}
                    </p>
                   
                    <div class="progress mt-2" style="height: 28px; border-radius: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div id="progressBar" class="progress-bar progress-bar-striped progress-bar-animated" 
                             role="progressbar" 
                             style="width: ${percentage}%; font-weight: bold; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; background: linear-gradient(45deg, #0d6efd, #0a58ca);">${percentage}%</div>
                    </div>
                    ${percentage >= 90 ? '<p class="mt-3 text-success"><strong>🎉 Neredeyse tamamlandı!</strong></p>' : ''}
                </div>
            `;
        }

        // Zamanlayıcıyı temizle
        if (messageInterval) {
            clearInterval(messageInterval);
            messageInterval = null;
        }

        // Sadece %100 olduğunda veya maksimum istek sayısına ulaşıldığında ürünleri göster
        const finalActiveProducts = products.filter(p => p.state === "ACTIVE");

        if (finalActiveProducts.length === 0) {
            // Zamanlayıcıyı temizle
            if (messageInterval) {
                clearInterval(messageInterval);
                messageInterval = null;
            }
            loadingResults.innerHTML = "";
            offerResults.innerHTML = `
                <div class="alert alert-warning text-center">
                    <h5>Üzgünüz!</h5>
                    <p>Maalesef bu araç için uygun teklif bulunamadı. Lütfen farklı bir araç deneyin.</p>
                </div>
            `;
            return;
        }

        // Zamanlayıcıyı temizle (başarılı tamamlanma)
        if (messageInterval) {
            clearInterval(messageInterval);
            messageInterval = null;
        }

        // Loading'i temizle ve sonuçları göster
        loadingResults.innerHTML = "";
        offerResults.innerHTML = "";
        await renderProposalResults(finalActiveProducts, proposalId);

    } catch (error) {
        // Hata durumunda zamanlayıcıyı temizle
        if (messageInterval) {
            clearInterval(messageInterval);
            messageInterval = null;
        }
        console.error(error);
        loadingResults.innerHTML = "";
        offerResults.innerHTML = `
            <div class="alert alert-danger text-center">
                <h5>Hata!</h5>
                <p>Teklifler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.</p>
            </div>
        `;
    }
}

async function showVehicles() {
    vehiclesList.innerHTML = '';
    const vehicles = await apiGetFetch("customers/me/vehicles") || [];

    vehicles.forEach(vehicle => {
        const col = document.createElement('div');
        col.classList.add('col-md-4');
        const card = document.createElement('div');
        card.classList.add('card', 'p-3', 'text-center');
        card.style.border = "1px solid #ddd";
        card.style.borderRadius = "10px";
        card.style.boxShadow = "0 4px 7px rgba(0,0,0,0.1)";
        card.style.cursor = 'pointer';
        const title = vehicle.model?.brand.text || '';
        const model = vehicle.model?.type?.text || '';
        card.innerHTML = `
                <div class="d-flex align-items-center p-2">
                    <img src="${traficIcons.car}" style="width:40px;height:40px;object-fit:contain;">
                    <div class="d-flex flex-column justify-content-center">
                        <div style="font-weight:bold;">${title}</div>
                        <div style="font-size:0.9rem;color:#555;">${model}</div>
                    </div>
                </div>
            `;
        card.dataset.vehicleId = vehicle.id;
        console.log("vehicle id :", vehicle.id);
        card.addEventListener('click', () => {

            vehiclesList.querySelectorAll('.card').forEach(c => c.classList.remove('border-primary'));
            card.classList.add('border', 'border-primary');
            selectedVehicleId = card.dataset.vehicleId;
            console.log("kart değişti , kart id:", selectedVehicleId);
        });
        col.appendChild(card);
        vehiclesList.appendChild(col);
    });
}

async function updateProgress(stepNumber) {
    const progressSteps = document.querySelectorAll("#stepProgress .step");
    progressSteps.forEach((s, i) => {
        if (i < stepNumber) s.classList.add('active');
        else s.classList.remove('active');
    });
}

async function backStepFunction() {
    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const progressSteps = document.querySelectorAll("#stepProgress .step");
    step2.classList.add('d-none');
    step1.classList.remove('d-none');
    progressSteps[1].classList.remove('active');
    progressSteps[0].classList.add('active');
}

async function showStep(step) {

    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");

    [step1, step2, step3].forEach(s => s.classList.add('d-none'));
    step.classList.remove('d-none');
    step.classList.add('fade-in');
    setTimeout(() => step.classList.remove('fade-in'), 500);

    if (step === step1) await updateProgress(1);
    if (step === step2) await updateProgress(2);
    if (step === step3) await updateProgress(3);


}
async function firstStep() {
    console.log("first step başladı.");

    // var covarageByCompany = await apiGetFetch("coverage-choices:kasko");
    // console.log("covarageByCompany: ", covarageByCompany);
    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");
    const personalForm = document.getElementById('personalForm');
    const vehiclesList = document.getElementById('vehiclesList');
    const addVehicleBtn = document.getElementById('addVehicleBtn');
    const backStepBtn = document.getElementById('backStepBtn');
    const tcInput = document.getElementById('tc');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const birthDateInput = document.getElementById('birthDate');
    const fullNameInput = document.getElementById('fullName');
    const infoAfterLogin = document.getElementById('infoAfterLogin');

    const citySelect = document.getElementById("cityTraffic");
    const districtSelect = document.getElementById("districtTraffic");


    const mfaCodeTraffic = document.getElementById('mfaCodeTraffic');
    const mfaAreaTraffic = document.getElementById('mfaAreaTraffic');
    mfaToken = null;


    var customer = null;

    // Login ise bilgiler getir
    var state = JSON.parse(localStorage.getItem("state"));
    var isInfoChange = false;
    var originalCustomerData = {};

    function checkInfoChanged() {
        const currentData = {
            identityNumber: parseInt(tcInput.value),
            phone: phoneInput.value,
            email: emailInput.value,
            birthDate: birthDateInput.value,
            fullName: fullNameInput.value || null
        };

        return JSON.stringify(originalCustomerData) !== JSON.stringify(currentData);
    }
    if (state) {

        customer = await apiGetFetch("customers/me");
        console.log("customer : ", customer);

        if (customer) {
            infoAfterLogin.style.display = "block";
            loadCities2();
            tcInput.value = customer.identityNumber || '';
            phoneInput.value = customer.primaryPhoneNumber?.number || '';
            emailInput.value = customer.primaryEmail || '';
            birthDateInput.value = customer.birthDate || '';
            fullNameInput.value = customer.fullName || '';

            originalCustomerData = {
                identityNumber: customer.identityNumber || '',
                phone: customer.primaryPhoneNumber?.number || '',
                email: customer.primaryEmail || '',
                birthDate: customer.birthDate || '',
                fullName: customer.fullName || ''
            };




            if (customer.identityNumber && customer.fullName && customer.primaryPhoneNumber?.number && customer.primaryEmail && customer.birthDate && customer.city?.value) {
                await showMessage('Bilgiler olduğu için ikinci adıma geçildi.', "success");
                await showStep(step2);
                
               // await showVehicles();

            }


            citySelect.addEventListener("change", async function () {
                await loadDistricts2(this.value);
            });
        }
    } else {

        tcInput.disabled = false;
        phoneInput.disabled = false;
        
    }



    addVehicleBtn?.addEventListener('click', async () => {
        console.log("crate vehicle butonu çalıştı. ");
        const vehicleModal = document.getElementById('vehicleModal');
        vehicleModal.style.display = "flex";
        var aracOlustur = await createVehicle();
        if (!aracOlustur) {
            return;
        }
        else {
            loadTrafikModule();
        }


        return;
    });





    personalForm.addEventListener('submit', async e => {

        e.preventDefault();
        isInfoChange = checkInfoChanged();

        if (customer) {
            if (!citySelect || !districtSelect || !fullNameInput) {
                return await showMessage("Lütfen tüm alanları doldurun!", "error");
            }

            if (!isInfoChange) {

                await showStep(step2);

            }
            else {


                console.log("personel submit çalıştı kullanıcı düzenleniyor");
                console.log(customer);
                const updateData = {
                    "$type": "individual",
                    "fullName": fullNameInput.value,
                    "birthDate": birthDateInput.value,
                    "gender": customer.gender || null,
                    "type": "INDIVIDUAL",
                    "id": customer.id,
                    "job": 0,
                    "primaryEmail": emailInput.value,
                    "primaryPhoneNumber": {
                        "number": phoneInput.value,
                        "countryCode": 90
                    },
                    "cityReference": document.getElementById('cityTraffic').value,
                    "districtReference": document.getElementById('districtTraffic').value,
                };
                console.log("put fetch çalıştı: ", updateData);
                const response = await apiPutFetch('customers/' + customer.id, updateData);
                if (response) {
                    await showMessage('Bilgiler başarıyla güncellendi.', "success");
                    await showStep(step2);
                    console.log('Güncellenen Bilgiler:', response);
                } else {
                    await showMessage('Bilgiler güncellenemedi. Lütfen tekrar deneyin.', "error");
                }
            }
        }
        else {

            if (mfaAreaTraffic.style.display === 'block') {
                if (!mfaCodeTraffic.value) { await showMessage('Lütfen SMS kodunu giriniz.', "success"); return; }
                try {
                    const res = await fetch('https://api.insurup.com/api/auth/customer/verify-mfa', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ token: mfaToken, code: mfaCodeTraffic.value })
                    });
                    const json = await res.json();

                    if (res.ok && json.accessToken) {

                        var state = {
                            token: {
                                refreshToken: json.refreshToken,
                                accessToken: json.accessToken
                            },
                            user: {
                                custumerId: null,
                                fullName: null,
                                phone: phoneInput || null
                            }
                        };

                        localStorage.setItem('state', JSON.stringify(state));

                        const me = await apiGetFetch('customers/me');
                        if (me) {
                            state.user.custumerId = me.id;
                            state.user.fullName = me.fullName;
                            customer = me;
                        }
                        localStorage.setItem('state', JSON.stringify(state));

                        //
                        mfaAreaTraffic.style.display = "none";
                        infoAfterLogin.style.display = "block";
                        // loadCities2();
                        await window.loginMenuModule();
                        firstStep();

                        // backStepBtn.classList.add('d-none');

                    } else {
                        console.log("res.ok:", res.ok, "json:", json);
                        showMessage(json.detail || 'Doğrulama hatası');
                    }
                } catch (err) {
                    await showMessage(err.message, "error");
                    console.log(err.message);

                }
                return;
            }

            const postData = {
                "$type": "individual",
                "identityNumber": Number(tcInput.value),
                "birthDate": birthDateInput.value,
                "phoneNumber": { number: phoneInput.value, countryCode: 90 },
                "agentId": "0198a25c-1a13-7965-bd4b-61c2c703333a"
            };

            try {
                const res = await fetch('https://api.insurup.com/api/auth/customer/login-or-register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(postData)
                });
                const json = await res.json();

                if (res.ok && json.token) {
                    // Geçici MFA token'ı kaydet
                    console.log("kayıt oluştu");
                    mfaToken = json.token;
                    mfaAreaTraffic.style.display = 'block';
                    await showMessage('📲 SMS ile doğrulama kodu gönderildi. Lütfen kodu girin.', 'success');
                    mfaCodeTraffic.focus();
                } else {
                    console.log("hata sonucu: " + json);
                    await showMessage(json.detail || JSON.stringify(json) || 'Bilinmeyen hata', "error");
                }

            } catch (err) {
                console.log("fetch error", err);
                await showMessage(err.message, "error");

            }
        }



    });
    
}
async function loadCities2() {
    const citySelect = document.getElementById("cityTraffic");
    const customer = await apiGetFetch("customers/me");
    const cities = (await apiGetFetch(`address-parameters/cities`))
        .sort((a, b) => a.text.localeCompare(b.text));

    cities.forEach(city => {
        let option = document.createElement("option");
        option.value = city.value;
        option.text = city.text;
        citySelect.appendChild(option);
    });

    if (customer.city?.value) {
        console.log("Şehir bilgileri geldi.", customer.city?.value.toString());
        citySelect.value = customer.city?.value.toString();
        if (customer.district?.value) {
            await loadDistricts2(citySelect.value, customer.district?.value);
        }
    }
}
async function loadDistricts2(cityValue, selectedDistrict = null) {
    console.log("ilçeler yükleniyor");
    const districtSelect = document.getElementById("districtTraffic");

    districtSelect.innerHTML = "<option value=''>İlçe seçiniz</option>";
    if (!cityValue) return;

    const districts = (await apiGetFetch(`address-parameters/districts?cityReference=${cityValue}`))
        .sort((a, b) => a.text.localeCompare(b.text));

    districts.forEach(district => {
        let option = document.createElement("option");
        option.value = district.value;
        option.text = district.text;
        districtSelect.appendChild(option);
    });

    if (selectedDistrict) {
        districtSelect.value = selectedDistrict.toString();
    }
}

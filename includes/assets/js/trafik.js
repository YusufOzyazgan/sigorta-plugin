

let selectedVehicleId = null;
window.loadTrafikModule = async function () {
    const addProposalBtn = document.querySelector('#addProposal');
    let customer = null;

    // İlk adımı yükle (step1 gösterilir)
    await firstStep();

    // Araçları paralel olarak yükle (step2'de görünecek, lazy loading)
    // showVehicles() artık step2'ye geçildiğinde çağrılacak (backStepFunction içinde)
    // Bu sayede sayfa açılışında gereksiz API çağrısı yapılmaz

    backStepBtn.addEventListener('click', async () => {
        await backStepFunction();
    });

    addProposalBtn.addEventListener('click', async () => {
        if (!selectedVehicleId) {
            await showMessage("Lütfen bir araç seçin!", "warning");
            return;
        }

        await createProposal(selectedVehicleId);
    });




}

async function createProposal(selectedVehicleId) {
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
                                <div class="d-flex align-items-center justify-content-center gap-2">
                                    <h5 class="card-title mb-0">${product.insuranceCompanyName} Teklif No:</h5>
                                    <p class="text-muted small mb-0">${product.premiums[0]?.insuranceCompanyProposalNumber || 'N/A'}</p>
                                </div>
                                
                                <div class="text-center mb-3">
                                    <h4 class="text-primary mb-1">${formatliFiyat || 'Fiyat bilgisi yok'} ₺</h4>
                                    <small class="text-muted">${product.taxesIncluded ? 'Vergiler Dahil' : 'Vergiler Hariç'}</small>
                                </div>
                                
                                <div class="mb-3">
                                    <span class="badge bg-success">${product.premiums[0].installmentNumber == 1 ? 'Peşin' : 'Taksit'}</span>
                                </div>
                                
                                <div class="d-grid gap-2">
                                
                                    <a class="toggle-warranties text-center  small" 
                                            data-product-id="${product.id}"
                                            data-proposal-id="${proposalId}"
                                            style="cursor: pointer; font-size: 0.8rem; text-decoration: underline;">
                                        Teminatları Gör
                                    </a>
                                    <button class="buyButton btn btn-outline-primary" data-product-id="${product.id}" data-proposal-id="${proposalId}">Poliçeleştir</button>
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
    document.querySelectorAll('.buyButton').forEach(button => {
        button.addEventListener('click', async function() {
            const productId = this.getAttribute('data-product-id')?.trim();
            const proposalId = this.getAttribute('data-proposal-id')?.trim();
            
            if (!productId || !proposalId) {
                await showMessage('Teklif bilgileri bulunamadı!', 'error');
                return;
            }
            
            try {
                // Müşteri bilgilerini al
                const customer = await apiGetFetch("customers/me");
                if (!customer) {
                    await showMessage('Müşteri bilgileri alınamadı!', 'error');
                    return;
                }
                
                // Teklif bilgilerini al
                const proposalResponse = await apiGetFetch(`proposals/${proposalId}`);
                if (!proposalResponse || !proposalResponse.products) {
                    await showMessage('Teklif bilgileri alınamadı!', 'error');
                    return;
                }
                
                // İlgili ürünü bul
                const product = proposalResponse.products.find(p => p.id === productId);
                if (!product) {
                    await showMessage('Ürün bilgisi bulunamadı!', 'error');
                    return;
                }
                
                // Premium bilgisi
                const premium = product.premiums && product.premiums[0] ? product.premiums[0].grossPremium : 0;
                
                // Teklif verilerini hazırla
                const proposalData = {
                    insuranceCompanyName: product.insuranceCompanyName || '',
                    insuranceCompanyLogo: product.insuranceCompanyLogo || '',
                    premium: premium,
                    grossPremium: premium,
                    installmentNumber: product.premiums && product.premiums[0] ? product.premiums[0].installmentNumber : 1,
                    taxesIncluded: product.taxesIncluded || false,
                    insuranceCompanyProposalNumber: product.premiums && product.premiums[0] ? product.premiums[0].insuranceCompanyProposalNumber : ''
                };
                
                // WordPress AJAX ile kaydet
                if (typeof sigortaAjax !== 'undefined') {
                    const formData = new FormData();
                    formData.append('action', 'sigorta_save_bekleyen_teklif');
                    formData.append('proposal_id', proposalId);
                    formData.append('product_id', productId);
                    formData.append('customer_data', JSON.stringify(customer));
                    formData.append('proposal_data', JSON.stringify(proposalData));
                    
                    const response = await fetch(sigortaAjax.ajaxurl, {
                        method: 'POST',
                        body: formData
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        await showMessage('Teklif başarıyla kaydedildi!', 'success');
                    } else {
                        await showMessage(result.data?.message || 'Teklif kaydedilemedi!', 'error');
                    }
                } else {
                    await showMessage('AJAX yapılandırması bulunamadı!', 'error');
                }
                
            } catch (error) {
                console.error('Teklif kaydetme hatası:', error);
                await showMessage('Teklif kaydedilirken bir hata oluştu!', 'error');
            }
        });
    });
}

// Ödeme işlemini başlatan fonksiyon (daha sonra aktif olacak)
async function WebServicePayment(proposalId, productId) {
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
            <p class="mt-1 mb-2" style="font-size: 0.9rem; color: #6c757d;">Teklifler hazırlanıyor lütfen çıkmayın...</p>
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;" aria-label="Yükleniyor">
                <span class="sr-only">Teklifler hazırlanıyor lütfen çıkmayın...</span>
            </div>
            <h6 class="mt-3" style="color: #1b4a6b; font-weight: bold;">Biliyor muydunuz?</h6>
            <p class="mb-5 mt-2" id="loadingMessage" style="font-size: 1.1rem; font-weight: 500; color:rgb(253, 177, 13);">
                ${initialMessage}
            </p>
            <div class="progress mt-4" style="height: 28px; border-radius: 15px;">
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

        // Mesajları 6 saniyede bir değiştiren zamanlayıcıyı başlat
        messageInterval = setInterval(updateLoadingMessage, 6000);

        let requestCount = 0;
        let completedProducts = getCompletedProducts(products);
        let percentage = calculatePercentage(completedProducts.length, totalProductsCount);
        updateProgressBar(percentage);

        // 90 saniye sonunda döngüyü durdurma flag'i
        let shouldContinueLoop = true;
        
        // 90 saniye sonunda progress bar'ı %100 yap ve döngüyü durdur
        const timeout90Seconds = setTimeout(() => {
            shouldContinueLoop = false;
            updateProgressBar(100);
        }, 90000);

        // WAITING olan ürünler varsa ve maksimum istek sayısına ulaşmadıysak ve 90 saniye dolmadıysa bekle
        while (percentage < 100 && requestCount < 35 && shouldContinueLoop) {
            await new Promise(resolve => setTimeout(resolve, 6000));
            
            // Eğer 90 saniye dolduysa döngüden çık
            if (!shouldContinueLoop) {
                break;
            }
            
            response = await apiGetFetch("proposals/" + proposalId);
            products = response.products;
            requestCount++;

            completedProducts = getCompletedProducts(products);
            percentage = calculatePercentage(completedProducts.length, totalProductsCount);
            updateProgressBar(percentage);

            // Sadece progress bar'ı güncelle (mesaj zamanlayıcı tarafından otomatik güncelleniyor)
            const progressBar = document.getElementById("progressBar");
            if (progressBar) {
                progressBar.style.width = percentage + "%";
                progressBar.textContent = percentage + "%";
            }

            // %90 üzeri mesajını kontrol et
            const existingContainer = loadingResults.querySelector('.text-center');
            if (existingContainer) {
                const successMsg = existingContainer.querySelector('.text-success');
                if (percentage >= 90) {
                    if (!successMsg) {
                        const successP = document.createElement('p');
                        successP.className = 'mt-3 text-success';
                        successP.innerHTML = '<strong>🎉 Neredeyse tamamlandı!</strong>';
                        existingContainer.appendChild(successP);
                    }
                } else if (successMsg) {
                    successMsg.remove();
                }
            }
        }

        // Timeout'u temizle (eğer döngü erken biterse)
        clearTimeout(timeout90Seconds);

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
    if(vehicles.length === 0) {
        vehiclesList.innerHTML = `
            <div class="alert alert-warning text-center">
                <p>Maalesef kayıtlı araç bulunamadı. Lütfen araç ekleyiniz.</p>
            </div>
        `;
        return;
    }
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
        card.addEventListener('click', () => {

            vehiclesList.querySelectorAll('.card').forEach(c => c.classList.remove('border-primary'));
            card.classList.add('border', 'border-primary');
            selectedVehicleId = card.dataset.vehicleId;
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
    if (step === step2) {
        await updateProgress(2);
        // Step2'ye geçildiğinde araçları yükle (lazy loading - sadece bir kez)
        const vehiclesList = document.getElementById('vehiclesList');
        if (vehiclesList && vehiclesList.innerHTML.trim() === '') {
            await showVehicles();
        }
    }
    if (step === step3) await updateProgress(3);


}
async function firstStep() {
    // var covarageByCompany = await apiGetFetch("coverage-choices:kasko");
    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");
    const personalForm = document.getElementById('personalForm');
    const vehiclesList = document.getElementById('vehiclesList');
    const addVehicleBtn = document.getElementById('addVehicleBtn');
    const backStepBtn = document.getElementById('backStepBtn');
    const tcInputNoLogin = document.getElementById('tcNoLogin');
    const phoneInputNoLogin = document.getElementById('phoneNoLogin');
    const tcInputLoggedIn = document.getElementById('tcLoggedIn');
    const phoneInputLoggedIn = document.getElementById('phoneLoggedIn');
    const emailInput = document.getElementById('email');
    const emailNoLoginInput = document.getElementById('emailNoLogin');
    const birthDateInput = document.getElementById('birthDate');
    const birthDateNoLoginInput = document.getElementById('birthDateNoLogin');
    const fullNameInput = document.getElementById('fullName');
    
    // Müşteri tipi toggle
    const customerTypeIndividual = document.getElementById('customerTypeIndividual');
    const customerTypeCorporate = document.getElementById('customerTypeCorporate');
    const labelIndividual = document.getElementById('labelIndividual');
    const labelCorporate = document.getElementById('labelCorporate');
    
    // Müşteri tipini radio button'dan al
    function getCustomerType() {
        if (customerTypeCorporate && customerTypeCorporate.checked) {
            return 'corporate';
        }
        return 'individual';
    }
    
    // Müşteri tipi değişikliği
    function updateCustomerTypeUI() {
        const isCorporateCustomer = getCustomerType() === 'corporate';
        const birthDateLoggedInContainer = document.getElementById('birthDateLoggedInContainer');
        const birthDateNoLoginContainer = document.getElementById('birthDateNoLoginContainer');
        const birthDateRow = document.getElementById('birthDateRow');
        const emailRowNoLogin = document.getElementById('emailRowNoLogin');
        const emailRow = document.getElementById('emailRow');
        const phoneRowLoggedInElement = document.getElementById('phoneRowLoggedIn');
        const customerTypeToggle = document.getElementById('customerTypeToggle');
        
        // Giriş yapılmış mı kontrol et
        const isLoggedIn = phoneRowLoggedInElement && 
                          window.getComputedStyle(phoneRowLoggedInElement).display !== 'none' &&
                          phoneRowLoggedInElement.offsetParent !== null;
        
        // Giriş yapılmışsa müşteri tipi toggle'ını gizle
        if (isLoggedIn && customerTypeToggle) {
            customerTypeToggle.style.display = 'none';
        } else if (!isLoggedIn && customerTypeToggle) {
            customerTypeToggle.style.display = 'block';
        }
        
        // Giriş yapılmışsa hem e-posta hem doğum tarihi göster, müşteri tipine göre değişiklik yapma
        if (isLoggedIn) {
            if (emailRow) emailRow.style.display = 'flex';
            if (birthDateLoggedInContainer) birthDateLoggedInContainer.style.display = 'block';
            if (emailInput) emailInput.setAttribute('required', 'required');
            if (birthDateInput) birthDateInput.setAttribute('required', 'required');
            return; // Giriş yapılmışsa müşteri tipine göre değişiklik yapma
        }
        
        if (isCorporateCustomer) {
            // Kurumsal müşteri: Doğum tarihi gizle, E-posta göster
            if (birthDateLoggedInContainer) birthDateLoggedInContainer.style.display = 'none';
            if (birthDateNoLoginContainer) birthDateNoLoginContainer.style.display = 'none';
            if (birthDateRow) {
                birthDateRow.style.display = 'none';
                birthDateRow.style.setProperty('display', 'none', 'important');
            }
            if (emailRowNoLogin) {
                emailRowNoLogin.style.display = 'flex';
                emailRowNoLogin.style.setProperty('display', 'flex', 'important');
            }
            if (birthDateInput) {
                birthDateInput.removeAttribute('required');
                birthDateInput.value = ''; // Değeri temizle
            }
            if (birthDateNoLoginInput) {
                birthDateNoLoginInput.removeAttribute('required');
                birthDateNoLoginInput.value = ''; // Değeri temizle
            }
            // required attribute'larını kaldır, manuel validasyon yapacağız
            if (emailInput) emailInput.removeAttribute('required');
            if (emailNoLoginInput) emailNoLoginInput.removeAttribute('required');
            
            // Radio buton stilleri
            if (labelIndividual) {
                labelIndividual.style.background = 'transparent';
                labelIndividual.style.color = '#6c757d';
            }
            if (labelCorporate) {
                labelCorporate.style.background = '#0d6efd';
                labelCorporate.style.color = 'white';
            }
        } else {
            // Bireysel müşteri: E-posta gizle, Doğum tarihi göster
            if (birthDateLoggedInContainer) birthDateLoggedInContainer.style.display = 'block';
            if (birthDateNoLoginContainer) birthDateNoLoginContainer.style.display = 'block';
            if (birthDateRow) {
                birthDateRow.style.display = 'flex';
                birthDateRow.style.setProperty('display', 'flex', 'important');
            }
            if (emailRowNoLogin) {
                emailRowNoLogin.style.display = 'none';
                emailRowNoLogin.style.setProperty('display', 'none', 'important');
            }
            // required attribute'larını kaldır, manuel validasyon yapacağız
            if (birthDateInput) birthDateInput.removeAttribute('required');
            if (birthDateNoLoginInput) birthDateNoLoginInput.removeAttribute('required');
            if (emailInput) {
                emailInput.removeAttribute('required');
                emailInput.value = ''; // Değeri temizle
            }
            if (emailNoLoginInput) {
                emailNoLoginInput.removeAttribute('required');
                emailNoLoginInput.value = ''; // Değeri temizle
            }
            
            // Radio buton stilleri
            if (labelIndividual) {
                labelIndividual.style.background = '#0d6efd';
                labelIndividual.style.color = 'white';
            }
            if (labelCorporate) {
                labelCorporate.style.background = 'transparent';
                labelCorporate.style.color = '#6c757d';
            }
        }
    }
    
    // Radio button değişikliklerini dinle
    if (customerTypeIndividual) {
        customerTypeIndividual.addEventListener('change', () => {
            updateCustomerTypeUI();
        });
    }
    
    if (customerTypeCorporate) {
        customerTypeCorporate.addEventListener('change', () => {
            updateCustomerTypeUI();
        });
    }
    
    // Başlangıç durumunu ayarla
    updateCustomerTypeUI();
    
    // Başlangıçta gizli olan inputların required attribute'unu kaldır
    // phoneRowLoggedIn başlangıçta gizli olduğu için
    if (tcInputLoggedIn) tcInputLoggedIn.removeAttribute('required');
    if (phoneInputLoggedIn) phoneInputLoggedIn.removeAttribute('required');
    
    // Her iki telefon inputuna da format ekle (functions.js'ten)
    setupPhoneFormatting(phoneInputNoLogin);
    setupPhoneFormatting(phoneInputLoggedIn);
    
    // Aktif inputları belirlemek için helper fonksiyon
    function getActiveInputs() {
        // phoneRowLoggedIn görünürse giriş yapılmış demektir
        const isLoggedIn = phoneRowLoggedIn && 
                          window.getComputedStyle(phoneRowLoggedIn).display !== 'none' &&
                          phoneRowLoggedIn.offsetParent !== null;
        return {
            tc: isLoggedIn ? tcInputLoggedIn : tcInputNoLogin,
            phone: isLoggedIn ? phoneInputLoggedIn : phoneInputNoLogin
        };
    }
    const infoAfterLogin = document.getElementById('infoAfterLogin');
    const phoneRowNoLogin = document.getElementById('phoneRowNoLogin');
    const phoneRowLoggedIn = document.getElementById('phoneRowLoggedIn');
    const emailRow = document.getElementById('emailRow');
    const birthDateRow = document.getElementById('birthDateRow');
    const buttonRowNoLogin = document.getElementById('buttonRowNoLogin');
    const buttonRowLoggedIn = document.getElementById('buttonRowLoggedIn');
    const step1SubmitBtn = document.getElementById('step1SubmitBtn');
    const step1SubmitBtnLoggedIn = document.getElementById('step1SubmitBtnLoggedIn');

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
        const inputs = getActiveInputs();
        const currentData = {
            identityNumber: parseInt(inputs.tc?.value || 0),
            phone: inputs.phone?.value || '',
            email: emailInput?.value || emailNoLoginInput?.value || '',
            birthDate: birthDateInput?.value || birthDateNoLoginInput?.value || '',
            fullName: fullNameInput?.value || '',
            city: citySelect?.value || '',
            district: districtSelect?.value || '',
            customerType: getCustomerType()
        };
        return JSON.stringify(originalCustomerData) !== JSON.stringify(currentData);
    }
    if (state) {

        customer = await apiGetFetch("customers/me");

        if (customer) {
            // Giriş yapılmışsa: TC/Telefon yan yana, Email/Doğum Tarihi yan yana
            if (phoneRowNoLogin) phoneRowNoLogin.style.display = "none";
            if (phoneRowLoggedIn) phoneRowLoggedIn.style.display = "flex";
            if (emailRow) emailRow.style.display = "flex";
            if (birthDateRow) birthDateRow.style.display = "none";
            if (buttonRowNoLogin) buttonRowNoLogin.style.display = "none";
            if (buttonRowLoggedIn) buttonRowLoggedIn.style.display = "flex";
            // Giriş yapıldığında TC inputunu disabled yap
            if (tcInputLoggedIn) tcInputLoggedIn.disabled = true;
            // Müşteri tipine göre required attribute'ları ayarla
            // Önce updateCustomerTypeUI'yi çağır, sonra müşteri bilgilerini yükle
            updateCustomerTypeUI();
            // Giriş yapıldığında loggedIn inputlarını required yap, noLogin inputlarını kaldır
            if (tcInputLoggedIn) tcInputLoggedIn.setAttribute('required', 'required');
            if (phoneInputLoggedIn) phoneInputLoggedIn.setAttribute('required', 'required');
            if (tcInputNoLogin) tcInputNoLogin.removeAttribute('required');
            if (phoneInputNoLogin) phoneInputNoLogin.removeAttribute('required');
            
            infoAfterLogin.style.display = "block";
            // Customer bilgisini parametre olarak geç, gereksiz API çağrısını önle
            loadCities2(customer);
            if (tcInputLoggedIn) tcInputLoggedIn.value = customer.identityNumber || '';
            if (phoneInputLoggedIn) {
                const phoneNumber = customer.primaryPhoneNumber?.number || '';
                phoneInputLoggedIn.value = phoneNumber ? formatPhoneNumber(phoneNumber) : '';
            }
            if (emailInput) emailInput.value = customer.primaryEmail || '';
            if (birthDateInput) birthDateInput.value = customer.birthDate || '';
            if (fullNameInput) fullNameInput.value = customer.fullName || '';
            originalCustomerData = {
                identityNumber: customer.identityNumber,
                phone: customer.primaryPhoneNumber?.number,
                email: customer.primaryEmail,
                birthDate: birthDateInput.value,
                fullName: customer.fullName,
                city: customer.city?.value,
                district: customer.district?.value
            };



            // Bilgiler tam doluysa otomatik olarak ikinci adıma geç (bildirim gösterme)
            if (customer.identityNumber && customer.fullName && customer.primaryPhoneNumber?.number && customer.primaryEmail && customer.birthDate && customer.city?.value) {
                await showStep(step2);
                // showVehicles artık showStep içinde çağrılıyor (lazy loading)
            }


            citySelect.addEventListener("change", async function () {
                await loadDistricts2(this.value);
            });
        }
    } else {
        // Giriş yapılmamışsa: TC, Telefon alt alta
        if (phoneRowNoLogin) phoneRowNoLogin.style.display = "flex";
        if (phoneRowLoggedIn) phoneRowLoggedIn.style.display = "none";
        if (emailRow) emailRow.style.display = "none";
        if (buttonRowNoLogin) buttonRowNoLogin.style.display = "flex";
        if (buttonRowLoggedIn) buttonRowLoggedIn.style.display = "none";
        // Müşteri tipine göre required attribute'ları ayarla
        // updateCustomerTypeUI() birthDateRow'u da kontrol edecek
        updateCustomerTypeUI();
        // Giriş yapılmamışsa loggedIn inputlarının required'ını kaldır
        if (tcInputLoggedIn) tcInputLoggedIn.removeAttribute('required');
        if (phoneInputLoggedIn) phoneInputLoggedIn.removeAttribute('required');

        if (tcInputNoLogin) tcInputNoLogin.disabled = false;
        if (phoneInputNoLogin) phoneInputNoLogin.disabled = false;
        
        // Doğum tarihi inputlarını senkronize et
        if (birthDateNoLoginInput && birthDateInput) {
            birthDateNoLoginInput.addEventListener('change', function() {
                birthDateInput.value = this.value;
            });
            birthDateInput.addEventListener('change', function() {
                birthDateNoLoginInput.value = this.value;
            });
        }
    }



    addVehicleBtn?.addEventListener('click', async () => {
        const vehicleModal = document.getElementById('vehicleModal');
        vehicleModal.style.display = "flex";
        var aracOlustur = await createVehicle();
        if (!aracOlustur) {
            return;
        }
        else {
           await  window.loadTrafikModule();
        }
        return;
    });





    personalForm.addEventListener('submit', async e => {
        
        e.preventDefault();
        
        // Gizli olan required inputların required attribute'unu kaldır
        // offsetParent null ise element gizlidir
        function isElementVisible(element) {
            if (!element) return false;
            
            // Element'in kendisini kontrol et
            const elementStyle = window.getComputedStyle(element);
            if (elementStyle.display === 'none' || 
                elementStyle.visibility === 'hidden' || 
                element.offsetParent === null) {
                return false;
            }
            
            // Parent container'ları kontrol et
            let parent = element.parentElement;
            while (parent && parent !== personalForm) {
                const parentStyle = window.getComputedStyle(parent);
                if (parentStyle.display === 'none' || 
                    parentStyle.visibility === 'hidden') {
                    return false;
                }
                parent = parent.parentElement;
            }
            
            return true;
        }
        
        // Tüm inputları kontrol et ve görünmeyenlerin required'ını kaldır
        const allInputs = personalForm.querySelectorAll('input[required]');
        allInputs.forEach(input => {
            if (!isElementVisible(input)) {
                input.removeAttribute('required');
                console.log('Removed required from hidden input:', input.id);
            }
        });
        
        // Özellikle TC ve Phone inputlarını kontrol et (aynı ID sorunu nedeniyle)
        if (tcInputNoLogin && !isElementVisible(tcInputNoLogin)) {
            tcInputNoLogin.removeAttribute('required');
        }
        if (tcInputLoggedIn && !isElementVisible(tcInputLoggedIn)) {
            tcInputLoggedIn.removeAttribute('required');
        }
        if (phoneInputNoLogin && !isElementVisible(phoneInputNoLogin)) {
            phoneInputNoLogin.removeAttribute('required');
        }
        if (phoneInputLoggedIn && !isElementVisible(phoneInputLoggedIn)) {
            phoneInputLoggedIn.removeAttribute('required');
        }
        
        // Doğum tarihi ve email inputlarını kontrol et
        // Özellikle birthDateNoLogin için parent container'ları kontrol et
        const birthDateRow = document.getElementById('birthDateRow');
        const birthDateNoLoginContainer = document.getElementById('birthDateNoLoginContainer');
        
        if (birthDateInput && !isElementVisible(birthDateInput)) {
            birthDateInput.removeAttribute('required');
            console.log('Removed required from birthDateInput (hidden)');
        }
        if (birthDateNoLoginInput) {
            // birthDateRow veya birthDateNoLoginContainer gizliyse required'ı kaldır
            const isBirthDateRowVisible = birthDateRow && 
                window.getComputedStyle(birthDateRow).display !== 'none' &&
                birthDateRow.offsetParent !== null;
            const isBirthDateContainerVisible = birthDateNoLoginContainer && 
                window.getComputedStyle(birthDateNoLoginContainer).display !== 'none' &&
                birthDateNoLoginContainer.offsetParent !== null;
            
            if (!isElementVisible(birthDateNoLoginInput) || !isBirthDateRowVisible || !isBirthDateContainerVisible) {
                birthDateNoLoginInput.removeAttribute('required');
                console.log('Removed required from birthDateNoLoginInput (hidden or parent hidden)');
            }
        }
        if (emailInput && !isElementVisible(emailInput)) {
            emailInput.removeAttribute('required');
            console.log('Removed required from emailInput (hidden)');
        }
        if (emailNoLoginInput && !isElementVisible(emailNoLoginInput)) {
            emailNoLoginInput.removeAttribute('required');
            console.log('Removed required from emailNoLoginInput (hidden)');
        }
        
        // Son bir kontrol: Tüm required inputları tekrar kontrol et
        const remainingRequiredInputs = personalForm.querySelectorAll('input[required]');
        remainingRequiredInputs.forEach(input => {
            if (!isElementVisible(input)) {
                input.removeAttribute('required');
                console.log('Final check - Removed required from:', input.id);
            }
        });
        
        // Özellikle birthDateNoLogin için bir kez daha kontrol et
        if (birthDateNoLoginInput && birthDateNoLoginInput.hasAttribute('required')) {
            const birthDateRowCheck = document.getElementById('birthDateRow');
            if (birthDateRowCheck && (window.getComputedStyle(birthDateRowCheck).display === 'none' || birthDateRowCheck.offsetParent === null)) {
                birthDateNoLoginInput.removeAttribute('required');
                console.log('Final check - Removed required from birthDateNoLoginInput (birthDateRow is hidden)');
            }
        }
        
        // Manuel validasyon: Giriş yapılmamışsa müşteri tipine göre kontrol et
        const phoneRowLoggedInElement = document.getElementById('phoneRowLoggedIn');
        const isLoggedIn = phoneRowLoggedInElement && 
                          window.getComputedStyle(phoneRowLoggedInElement).display !== 'none' &&
                          phoneRowLoggedInElement.offsetParent !== null;
        
        if (!isLoggedIn) {
            const isCorporateCustomer = getCustomerType() === 'corporate';
            const birthDateRow = document.getElementById('birthDateRow');
            const emailRowNoLogin = document.getElementById('emailRowNoLogin');
            
            if (isCorporateCustomer) {
                // Kurumsal müşteri: E-posta zorunlu
                const emailValue = emailNoLoginInput?.value || '';
                if (!emailValue || emailValue.trim() === '') {
                    return await showMessage("E-posta adresi gereklidir!", "error");
                }
            } else {
                // Bireysel müşteri: Doğum tarihi zorunlu
                const birthDateValue = birthDateNoLoginInput?.value || '';
                if (!birthDateValue || birthDateValue.trim() === '') {
                    return await showMessage("Doğum tarihi gereklidir!", "error");
                }
            }
        }
        
        isInfoChange = checkInfoChanged();
        if (customer) {
            if (!citySelect || !districtSelect || !fullNameInput) {
                return await showMessage("Lütfen tüm alanları doldurun!", "error");
            }

            if (!isInfoChange) {
                // Bilgiler tam doluysa bildirim göster
                if (customer.identityNumber && customer.fullName && customer.primaryPhoneNumber?.number && customer.primaryEmail && customer.birthDate && customer.city?.value) {
                    await showMessage('Bilgiler olduğu için ikinci adıma geçildi.', "success");
                }
                await showStep(step2);

            }
            else {
              
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
                        "number": cleanPhoneNumber(phoneInputLoggedIn?.value || ''),
                        "countryCode": 90
                    },
                    "cityReference": document.getElementById('cityTraffic').value,
                    "districtReference": document.getElementById('districtTraffic').value,
                };
                originalCustomerData = {
                    identityNumber: parseInt(tcInputLoggedIn?.value || 0),
                    phone: cleanPhoneNumber(phoneInputLoggedIn?.value || ''),
                    email: emailInput.value,
                    birthDate: birthDateInput.value,
                    fullName: fullNameInput.value,
                    city: citySelect.value,
                    district: districtSelect.value
                };
                const response = await apiPutFetch('customers/' + customer.id, updateData);
                if (response) {
                    await showMessage('Bilgiler başarıyla güncellendi.', "success");
                    await showStep(step2);
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
                                phone: phoneInputNoLogin?.value || phoneInputLoggedIn?.value || null
                            }
                        };

                        localStorage.setItem('state', JSON.stringify(state));

                        const me = await apiGetFetch('customers/me');
                        if (me) {
                            state.user.custumerId = me.id;
                            state.user.fullName = me.fullName;
                            state.user.identityNumber = me.identityNumber || null;
                            state.user.primaryPhoneNumber = me.primaryPhoneNumber?.number || null;
                            state.user.primaryEmail = me.primaryEmail || null;
                            state.user.birthDate = me.birthDate || null;
                            // API'den dönen diğer kullanıcı bilgilerini de ekleyebiliriz
                            if (me.address) state.user.address = me.address;
                            if (me.city) state.user.city = me.city;
                            if (me.district) state.user.district = me.district;
                            customer = me;
                        }
                        localStorage.setItem('state', JSON.stringify(state));

                        //
                        mfaAreaTraffic.style.display = "none";
                        infoAfterLogin.style.display = "block";
                        // Giriş yapıldıktan sonra email row'u göster
                        // Giriş yapıldıktan sonra: TC/Telefon yan yana, Email/Doğum Tarihi yan yana
                        if (phoneRowNoLogin) phoneRowNoLogin.style.display = "none";
                        if (phoneRowLoggedIn) phoneRowLoggedIn.style.display = "flex";
                        if (emailRow) emailRow.style.display = "flex";
                        if (birthDateRow) birthDateRow.style.display = "none";
                        if (buttonRowNoLogin) buttonRowNoLogin.style.display = "none";
                        if (buttonRowLoggedIn) buttonRowLoggedIn.style.display = "flex";
                        // Giriş yapıldıktan sonra TC inputunu disabled yap
                        if (tcInputLoggedIn) tcInputLoggedIn.disabled = true;
                        // Müşteri tipine göre required attribute'ları ayarla
                        updateCustomerTypeUI();
                        // Giriş yapıldığında loggedIn inputlarını required yap, noLogin inputlarını kaldır
                        if (tcInputLoggedIn) tcInputLoggedIn.setAttribute('required', 'required');
                        if (phoneInputLoggedIn) phoneInputLoggedIn.setAttribute('required', 'required');
                        if (tcInputNoLogin) tcInputNoLogin.removeAttribute('required');
                        if (phoneInputNoLogin) phoneInputNoLogin.removeAttribute('required');
                        // loadCities2();
                        await window.loginMenuModule();
                        firstStep();

                        // backStepBtn.classList.add('d-none');

                    } else {
                        showMessage(json.detail || 'Doğrulama hatası');
                    }
                } catch (err) {
                    await showMessage(err.message, "error");
                }
                return;
            }

            // Acente ID kontrolü
            const agentId = await checkAndGetAgentId();
            if (!agentId) {
                return;
            }
            
            const inputs = getActiveInputs();
            const isCorporateCustomer = getCustomerType() === 'corporate';
            
            // $type property'si JSON objesinin ilk property'si olmalı
            let postData = {};
            
            if (isCorporateCustomer) {
                // Kurumsal müşteri
                const emailValue = emailInput?.value || emailNoLoginInput?.value || '';
                if (!emailValue) {
                    return await showMessage("E-posta adresi gereklidir!", "error");
                }
                postData = {
                    "$type": "corporate",
                    "taxNumber": Number(inputs.tc?.value || 0),
                    "email": emailValue,
                    "phoneNumber": { number: cleanPhoneNumber(inputs.phone?.value || ''), countryCode: 90 },
                    "agentId": agentId
                };
            } else {
                // Bireysel müşteri
                const birthDateValue = birthDateInput?.value || birthDateNoLoginInput?.value || '';
                if (!birthDateValue) {
                    return await showMessage("Doğum tarihi gereklidir!", "error");
                }
                postData = {
                    "$type": "individual",
                    "identityNumber": Number(inputs.tc?.value || 0),
                    "birthDate": birthDateValue,
                    "phoneNumber": { number: cleanPhoneNumber(inputs.phone?.value || ''), countryCode: 90 },
                    "agentId": agentId
                };
            }
            
            console.log('API Request Data:', postData);

            try {
                const res = await fetch('https://api.insurup.com/api/auth/customer/login-or-register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(postData)
                });
                const json = await res.json();

                if (res.ok && json.token) {
                    // Geçici MFA token'ı kaydet
                    mfaToken = json.token;
                    mfaAreaTraffic.style.display = 'block';
                    await showMessage('📲 SMS ile doğrulama kodu gönderildi. Lütfen kodu girin.', 'success');
                    mfaCodeTraffic.focus();
                } else {
                    await showMessage(json.detail || JSON.stringify(json) || 'Bilinmeyen hata', "error");
                }

            } catch (err) {
                await showMessage(err.message, "error");

            }
        }



    });
    
}
async function loadCities2(customer = null) {
    const citySelect = document.getElementById("cityTraffic");
    
    // Eğer customer parametre olarak gelmediyse al (geriye dönük uyumluluk için)
    if (!customer) {
        customer = await apiGetFetch("customers/me");
    }
    
    // Şehirleri paralel olarak yükle (customer zaten varsa)
    const citiesPromise = apiGetFetch(`address-parameters/cities`);
    const cities = (await citiesPromise).sort((a, b) => a.text.localeCompare(b.text));

    cities.forEach(city => {
        let option = document.createElement("option");
        option.value = city.value;
        option.text = city.text;
        citySelect.appendChild(option);
    });

    if (customer?.city?.value) {
        citySelect.value = customer.city?.value.toString();
        if (customer.district?.value) {
            await loadDistricts2(citySelect.value, customer.district?.value);
        }
    }
}
async function loadDistricts2(cityValue, selectedDistrict = null) {
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

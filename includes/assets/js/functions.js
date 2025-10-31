




//Requests
async function apiGetFetch(endpoint, isRetry = false) {

    console.log("get fetch çalıştı.");

    let state = localStorage.getItem('state') ? JSON.parse(localStorage.getItem('state')) : null;
    let token = state ? state.token.accessToken : null;
    if (!token) { return; }
    
    try {
        const res = await fetch('https://api.insurup.com/api/' + endpoint, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
            }

        });
        console.log("HTTP get Status:", res.status);

        if (res.status === 401 && !isRetry) {


            const newToken = await refreshOldToken();
            if (newToken) {


                return await apiGetFetch(endpoint, isRetry = true);
            } else {
                await showMessage('Oturum yok. Lütfen giriş yapın.', "warning");
                return;
            }
        }
        if (!res.ok) {
            await showMessage('API Hatası: ' + res.status, "error");
            return
        }
        return await res.json();
    } catch (err) {
        console.log(err.message);
        return null;
    }
}




async function apiPostFetch(endpoint, data, isRetry = false) {
    console.log("post fetct çalıştı.");


    try {
        let token = localStorage.getItem('state') ? JSON.parse(localStorage.getItem('state')).token.accessToken : null;
        if (!token) {
            await showMessage('Oturum yok. Lütfen giriş yapın.', "warning");
            return;
        }


        const res = await fetch('https://api.insurup.com/api/' + endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',

            },
            body: JSON.stringify(data)
        });

        if (res.status === 401 && !isRetry) {
            console.warn("401 geldi, refresh denenecek...");

            const newToken = await refreshOldToken();
            if (newToken) {

                return await apiPostFetch(endpoint, data, true);
            } else {
                await showMessage('Oturum yok. Lütfen giriş yapın.', "warning");
                return;
            }
        }
        if (!res.ok) {

            await showMessage('API Hatası: ' + res.status, "error");
            return
        }
        return await res.json();
    } catch (err) {
        console.error(err.message);
        return null;
    }
}





async function apiPutFetch(endpoint, data, isRetry = false) {
    console.log("put fetct çalıştı.");


    try {
        let token = localStorage.getItem('state') ? JSON.parse(localStorage.getItem('state')).token.accessToken : null;
        if (!token) {
            await showMessage('Oturum yok. Lütfen giriş yapın.', "warning");
            return;
        }

        const res = await fetch('https://api.insurup.com/api/' + endpoint, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',

            },
            body: JSON.stringify(data)
        });

        if (res.status === 401 && !isRetry) {
            console.warn("401 geldi, refresh denenecek...");

            const newToken = await refreshOldToken();
            if (newToken) {

                return await apiPutFetch(endpoint, data, true);
            } else {

                await showMessage('Oturum yok. Lütfen giriş yapın.', "warning");
                return;

            }
        }
        if (!res.ok) {
            await showMessage('API Hatası: ' + res.status, "error");
            return
        }

        return true;
    } catch (err) {
        alert(err.message);
        return null;
    }
}





// Refresh Token
async function refreshOldToken() {


    console.log("refresh token çalıştı.");
    let state = JSON.parse(localStorage.getItem("state"));

    const refreshToken = state.token.refreshToken;
    if (!refreshToken) return null;

    try {
        const response = await fetch('https://api.insurup.com/api/auth/customer/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });

        const json = await response.json();

        if (response.ok && json.accessToken) {
            state.token.accessToken = json.accessToken;
            state.token.refreshToken = json.refreshToken;
            localStorage.setItem('state', JSON.stringify(state));
            console.log('✅ Token yenilendi');

            return json.accessToken;
        } else {
            console.warn(json.detail || 'Token yenileme hatası');
            return null;
        }
    } catch (err) {
        console.error(err.message);
        return null;
    }
}




async function isAuth(container) {
    const state = JSON.parse(localStorage.getItem("state"));


    const token = state?.token.accessToken;
    console.log("isAuth token = ", token);
    if (!token) {
        console.log("is auth çalıştı");
        container.innerHTML = `<p style="color:red; text-align:center; font-weight:bold; margin-top:20px;">
            Oturumunuz doldu veya çıkış yapıldı. Lütfen giriş yapın.
        </p>
        <div style="text-align:center; margin-top:10px;">
            <button id="loginBtn2" class="btn btn-primary">Giriş Yap</button>
        </div>`;
        document.getElementById('loginBtn2').addEventListener('click', () => window.location.href = '/login-register/');
        return false; // uyarı gösterildi
    }
    else {
        return true;
    }
}



// show message

async function showMessage(message, type, duration = 4) {
    let notif = document.getElementById('notif');
    notif.textContent = message;

    // Renkleri tipine göre ayarla
    if (type === 'success') notif.style.background = 'green';
    else if (type === 'error') notif.style.background = 'red';
    else if (type === 'warning') notif.style.background = 'orange';
    else notif.style.background = 'gray';

    // Başlangıçta görünür ve opak
    notif.style.display = 'block';
    notif.style.opacity = '1';
    notif.style.transition = 'opacity 0.5s ease'; // 0.5 saniyelik geçiş

    // duration sonra yavaşça kaybol
    setTimeout(() => {
        notif.style.opacity = '0'; // opaklığı azalt
        // transition bitince display:none yap
        setTimeout(() => {
            notif.style.display = 'none';
        }, 500); // transition süresiyle eşleşmeli
    }, duration * 1000);
}

// Global teminatlar modal fonksiyonu
window.showWarrantiesModal = async function(proposalId, productId) {
    // Modal HTML'ini kontrol et, yoksa oluştur
    let modalElement = document.getElementById('globalWarrantiesModal');
    if (!modalElement) {
        // Modal HTML'ini oluştur
        const modalHTML = `
            <div class="modal fade" id="globalWarrantiesModal" tabindex="-1" aria-labelledby="globalWarrantiesModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="globalWarrantiesModalLabel">
                                <i class="fas fa-shield-alt text-primary me-2"></i>
                                Sigorta Teminatları
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div id="warrantiesContent">
                                <div class="text-center">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Yükleniyor...</span>
                                    </div>
                                    <p class="mt-2 text-muted">Teminatlar yükleniyor...</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Modal'ı body'ye ekle
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modalElement = document.getElementById('globalWarrantiesModal');
    }
    
    const modal = new bootstrap.Modal(modalElement);
    const contentDiv = document.getElementById('warrantiesContent');
    
    // Modal'ı aç
    modal.show();
    
    // Loading göster
    contentDiv.innerHTML = `
        <div class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Yükleniyor...</span>
            </div>
            <p class="mt-2 text-muted">Teminatlar yükleniyor...</p>
        </div>
    `;
    
    try {
        // API'den teminatları çek
        const coverageData = await apiGetFetch(`proposals/${proposalId}/products/${productId}/coverage`);
        
        if (coverageData && coverageData.coverage) {
            const coverage = coverageData.coverage;
            
            // Teminatları güzel bir tasarımla göster
            let html = `
                <div class="company-info" style="background: linear-gradient(135deg, #007bff, #0056b3); color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h5><i class="fas fa-shield-alt me-2"></i>Trafik Sigortası Teminatları</h5>
                    <p class="mb-0">Sigorta Branşı: ${coverage.productBranch || 'TRAFIK'}</p>
                </div>
                <div class="row">
            `;
            
            // Teminat türlerini ve açıklamalarını tanımla
            const coverageTypes = {
                'maddiHasarAracBasina': 'Maddi Hasar (Araç Başına)',
                'maddiHasarKazaBasina': 'Maddi Hasar (Kaza Başına)',
                'sakatlanmaVeOlumKisiBasina': 'Sakatlanma ve Ölüm (Kişi Başına)',
                'sakatlanmaVeOlumKazaBasina': 'Sakatlanma ve Ölüm (Kaza Başına)',
                'tedaviSaglikGiderleriKisiBasina': 'Tedavi Sağlık Giderleri (Kişi Başına)',
                'tedaviSaglikGiderleriKazaBasina': 'Tedavi Sağlık Giderleri (Kaza Başına)',
                'hukuksalKorumaAracaBagli': 'Hukuksal Koruma (Araca Bağlı)',
                'hukuksalKorumaSurucuyeBagli': 'Hukuksal Koruma (Sürücüye Bağlı)',
                'immKombine': 'IMM Kombine',
                'ferdiKaza': 'Ferdi Kaza',
                'acilSaglik': 'Acil Sağlık',
                'cekiciHizmeti': 'Çekici Hizmeti',
                'aracBakimPlani': 'Araç Bakım Planı'
            };
            
            let coverageCount = 0;
            
            // Her teminat türünü kontrol et
            Object.keys(coverageTypes).forEach((key, index) => {
                if (coverage[key] && coverage[key].$type !== 'UNDEFINED') {
                    const coverageType = coverage[key];
                    const coverageName = coverageTypes[key];
                    
                    html += `
                        <div class="col-md-6 mb-3">
                            <div class="warranty-item" style="border-left: 3px solid #28a745; padding-left: 15px; margin-bottom: 15px; background: #f8f9fa; padding: 12px 15px; border-radius: 5px;">
                                <h6 style="color: #28a745; font-weight: 600; margin-bottom: 8px;">
                                    <i class="fas fa-check-circle text-success me-2"></i>${coverageName}
                                </h6>
                                <p style="margin-bottom: 5px; color: #6c757d;">
                                    <strong>Teminat Türü:</strong> ${coverageType.$type || 'Tanımsız'}
                                </p>
                                ${coverageType.limit ? `<p style="margin-bottom: 5px; color: #6c757d;"><strong>Limit:</strong> <span class="badge bg-primary" style="font-size: 0.75rem;">${coverageType.limit}</span></p>` : ''}
                                ${coverageType.deductible ? `<p style="margin-bottom: 5px; color: #6c757d;"><strong>Muafiyet:</strong> <span class="badge bg-warning" style="font-size: 0.75rem;">${coverageType.deductible}</span></p>` : ''}
                                ${coverageType.description ? `<p style="margin-bottom: 5px; color: #6c757d;"><strong>Açıklama:</strong> ${coverageType.description}</p>` : ''}
                            </div>
                        </div>
                    `;
                    coverageCount++;
                }
            });
            
            if (coverageCount === 0) {
                html = `
                    <div class="text-center">
                        <i class="fas fa-info-circle text-info fa-3x mb-3"></i>
                        <h5>Teminat Detayları Henüz Belirlenmedi</h5>
                        <p class="text-muted">Bu ürün için teminat detayları henüz hazırlanmamış. Lütfen daha sonra tekrar kontrol ediniz.</p>
                    </div>
                `;
            } else {
                html += `
                    </div>
                    <div class="alert alert-info mt-3">
                        <i class="fas fa-info-circle me-2"></i>
                        <strong>Not:</strong> Yukarıdaki teminatlar genel bilgilerdir. Detaylı bilgi için sigorta şirketi ile iletişime geçiniz.
                    </div>
                `;
            }
            
            contentDiv.innerHTML = html;
        } else {
            contentDiv.innerHTML = `
                <div class="text-center">
                    <i class="fas fa-exclamation-triangle text-warning fa-3x mb-3"></i>
                    <h5>Teminat Bilgisi Bulunamadı</h5>
                    <p class="text-muted">Bu ürün için teminat bilgisi mevcut değil.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Teminatlar yüklenirken hata:', error);
        contentDiv.innerHTML = `
            <div class="text-center">
                <i class="fas fa-exclamation-circle text-danger fa-3x mb-3"></i>
                <h5>Hata Oluştu</h5>
                <p class="text-muted">Teminatlar yüklenirken bir hata oluştu. Lütfen tekrar deneyin.</p>
            </div>
        `;
    }
};

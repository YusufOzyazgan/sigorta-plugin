window.loadLoginRegisterModule = async function () {
    console.log('loadLoginRegisterModule çağrıldı');

    const state = JSON.parse(localStorage.getItem("state"));
    const token = state?.token.accessToken;

    if (token) {
        window.location.href = window.location.origin + "/";
        return;
    }

    console.log('Form elementleri aranıyor...');
    const loginForm = document.getElementById('loginForm');
    console.log('loginForm bulundu:', loginForm);
    const messageDiv = document.getElementById('message');
    const registerBtn = document.getElementById('btnRegister');
    const loginBtn = document.getElementById('btnLogin');
    const dobArea = document.getElementById('dobArea');
    const mfaArea = document.getElementById('mfaArea');
    const mfaInput = document.getElementById('mfaCode');
    const submitBtn = document.getElementById('submitBtn');
    
    // Telefon inputuna format ekle
    const phoneInput = document.getElementById('phone-login');
    if (phoneInput) {
        if (typeof setupPhoneFormatting === 'function') {
            setupPhoneFormatting(phoneInput);
        } else {
            console.error('setupPhoneFormatting fonksiyonu tanımlı değil! functions.js yüklü mü?');
        }
    }

    let currentAction = 'login'; // login veya register
    let mfaToken = null; // geçici MFA token
    let isTaxNumber = false; // TC No (false) veya Vergi No (true)
    
    // Başlangıç durumunu ayarla
    if (loginBtn) {
        loginBtn.style.background = 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)';
        loginBtn.style.color = 'white';
        loginBtn.style.boxShadow = '0 4px 15px rgba(13, 110, 253, 0.4)';
    }
    if (registerBtn) {
        registerBtn.style.background = 'transparent';
        registerBtn.style.color = '#6c757d';
        registerBtn.style.boxShadow = 'none';
    }
    
    const idTypeToggle = document.getElementById('idTypeToggle');
    const idLabel = document.getElementById('idLabel');
    const idTypeHint = document.getElementById('idTypeHint');
    const tcInput = document.getElementById('tc-login');
    
    // Toggle butonuna tıklama
    if (idTypeToggle) {
        idTypeToggle.addEventListener('click', function() {
            isTaxNumber = !isTaxNumber;
            updateIdTypeUI();
        });
    }
    
    function updateIdTypeUI() {
        const toggleText = document.getElementById('toggleText');
        if (isTaxNumber) {
            idLabel.textContent = 'Vergi Kimlik No';
            tcInput.placeholder = 'Vergi Kimlik No (10 haneli)';
            tcInput.setAttribute('maxlength', '10');
            idTypeHint.innerHTML = '<i class="fas fa-info-circle me-1"></i>Vergi Kimlik No ile devam ediyorsunuz';
            idTypeToggle.style.background = 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)';
            idTypeToggle.style.color = '#000';
            if (toggleText) toggleText.textContent = 'TC No';
        } else {
            idLabel.textContent = 'TC Kimlik No';
            tcInput.placeholder = 'TC Kimlik No (11 haneli)';
            tcInput.setAttribute('maxlength', '11');
            idTypeHint.innerHTML = '<i class="fas fa-info-circle me-1"></i>TC Kimlik No ile devam ediyorsunuz';
            idTypeToggle.style.background = '#f8f9fa';
            idTypeToggle.style.color = '#6c757d';
            if (toggleText) toggleText.textContent = 'Vergi No';
        }
        
        // Kayıt ol kısmında vergi numarası aktifse doğum tarihini gizle
        if (currentAction === 'register') {
            const dobInput = document.getElementById('dob');
            if (isTaxNumber) {
                dobArea.style.display = 'none';
                if (dobInput) dobInput.removeAttribute('required');
            } else {
                dobArea.style.display = 'block';
                if (dobInput) dobInput.setAttribute('required', 'required');
            }
        }
        
        // Input'u temizle
        tcInput.value = '';
    }

    function showMessage(msg, type = 'error') {
        if (!messageDiv) return;
        messageDiv.innerHTML = `<div class="alert alert-${type === 'error' ? 'danger' : 'success'}">${msg}</div>`;
    }
    document.addEventListener('click', function (e) {
        if (e.target && e.target.id === 'btnLogin') {
            currentAction = 'login';

            // Login butonu aktif
            loginBtn.style.background = 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)';
            loginBtn.style.color = 'white';
            loginBtn.style.boxShadow = '0 4px 15px rgba(13, 110, 253, 0.4)';

            // Register butonu pasif
            registerBtn.style.background = 'transparent';
            registerBtn.style.color = '#6c757d';
            registerBtn.style.boxShadow = 'none';

            dobArea.style.display = 'none';
            submitBtn.innerText = 'Giriş Yap';
        }

        if (e.target && e.target.id === 'btnRegister') {
            currentAction = 'register';

            // Register butonu aktif
            registerBtn.style.background = 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)';
            registerBtn.style.color = 'white';
            registerBtn.style.boxShadow = '0 4px 15px rgba(13, 110, 253, 0.4)';

            // Login butonu pasif
            loginBtn.style.background = 'transparent';
            loginBtn.style.color = '#6c757d';
            loginBtn.style.boxShadow = 'none';

            // Vergi numarası aktifse doğum tarihini gizle
            const dobInput = document.getElementById('dob');
            if (isTaxNumber) {
                dobArea.style.display = 'none';
                if (dobInput) dobInput.removeAttribute('required');
            } else {
                dobArea.style.display = 'block';
                if (dobInput) dobInput.setAttribute('required', 'required');
            }
            submitBtn.innerText = 'Kayıt Ol';
        }
    });


    if (!loginForm) {
        console.error('loginForm bulunamadı!');
        return;
    }
    
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        console.log('Form submit edildi!');
        
        if (!loginForm) {
            console.error('loginForm null!');
            return;
        }
        
        // Gizli required inputların required attribute'unu kaldır
        const allRequiredInputs = loginForm.querySelectorAll('input[required]');
        allRequiredInputs.forEach(input => {
            const isVisible = input.offsetParent !== null && 
                             window.getComputedStyle(input).display !== 'none' &&
                             window.getComputedStyle(input).visibility !== 'hidden';
            if (!isVisible) {
                input.removeAttribute('required');
                console.log('Gizli required input bulundu ve kaldırıldı:', input.id);
            }
        });

        const tc = document.getElementById('tc-login').value.trim();
        console.log('TC/Vergi No:', tc);
        let phone = '';
        if (typeof cleanPhoneNumber === 'function') {
            phone = cleanPhoneNumber(document.getElementById('phone-login').value);
        } else {
            // Fallback: Manuel temizleme
            phone = document.getElementById('phone-login').value.replace(/\D/g, '');
            if (phone.startsWith('0')) phone = phone.substring(1);
            console.error('cleanPhoneNumber fonksiyonu tanımlı değil! functions.js yüklü mü?');
        }
        const dob = document.getElementById('dob').value || null;
        const mfaCode = mfaInput ? mfaInput.value.trim() : '';
        
        // TC/Vergi No ve telefon doğrulama
        if (isTaxNumber) {
            // Vergi No validasyonu (10 haneli)
            if (!tc || tc.length !== 10) { 
                showMessage('Vergi Kimlik No 10 haneli olmalıdır.'); 
                return; 
            }
            if (!/^\d+$/.test(tc)) {
                showMessage('Vergi Kimlik No sadece rakamlardan oluşmalıdır.');
                return;
            }
        } else {
            // TC No validasyonu
            if (!tc || tc.length !== 11) { 
                showMessage('TC Kimlik No 11 haneli olmalıdır.'); 
                return; 
            }
            var validateTc = await validateTCKN(tc);
            if (!validateTc) {
                showMessage("Lütfen Geçerli bir TC Kimlik Numarası Girin.", "error");
                return;
            }
        }

        if (phone.startsWith('0')) { showMessage('Telefon 0 ile başlamamalıdır.'); return; }
        if (phone.length !== 10) { showMessage('Telefon 10 haneli olmalıdır.'); return; }


        // MFA doğrulama adımı
        if (mfaArea.style.display === 'block') {
            if (!mfaCode) { showMessage('Lütfen SMS kodunu giriniz.'); return; }
            try {
                const res = await fetch('https://api.insurup.com/api/auth/customer/verify-mfa', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: mfaToken, code: mfaCode })
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
                            phone: phone || null
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
                    }
                    localStorage.setItem('state', JSON.stringify(state));

                    submitBtn.disabled = true;
                    showMessage('Doğrulama başarılı! Yönlendiriliyorsunuz...', 'success');
                    setTimeout(() => {
                        window.location.href = window.location.origin + "/panel/";
                    }, 1500);
                } else {
                    showMessage(json.detail || 'Doğrulama hatası');
                }
            } catch (err) {
                showMessage(err.message);

            }
            return;
        }

        // Acente ID kontrolü
        console.log('Acente ID kontrol ediliyor...');
        if (typeof getInsurupAgentId !== 'function') {
            console.error('getInsurupAgentId fonksiyonu tanımlı değil!');
            showMessage('Sistem hatası: getInsurupAgentId fonksiyonu bulunamadı.', "error");
            return;
        }
        const agentId = getInsurupAgentId();
        console.log('Acente ID:', agentId);
        if (!agentId) {
            console.log('Acente ID boş!');
            showMessage('Acente ID ayarlanmamış. Lütfen WordPress admin panelinden Acente ID\'yi girin.', "error");
            return;
        }
        
        const postData = {
            "$type": "individual",
            "phoneNumber": { number: phone, countryCode: 90 },
            "agentId": agentId
        };
        
        // TC No veya Vergi No ekle
        if (isTaxNumber) {
            postData.taxNumber = Number(tc);
        } else {
            postData.identityNumber = Number(tc);
        }
        
        // Doğum tarihi sadece TC No ile kayıt olurken ekle
        if (currentAction === 'register' && !isTaxNumber) {
            postData.birthDate = dob;
        }

        console.log('API isteği gönderiliyor:', postData);
        try {
            const res = await fetch('https://api.insurup.com/api/auth/customer/login-or-register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData)
            });
            console.log('API yanıt durumu:', res.status);
            const json = await res.json();
            console.log('API yanıt:', json);

            if (res.ok && json.token) {
                // Geçici MFA token'ı kaydet
                mfaToken = json.token;
                mfaArea.style.display = 'block';
                showMessage('📲 SMS ile doğrulama kodu gönderildi. Lütfen kodu girin.', 'success');
                mfaInput.focus();
            } else {
                showMessage(json.detail || JSON.stringify(json) || 'Bilinmeyen hata');
            }

        } catch (err) {
            showMessage(err.message);

        }
    });
    function validateTCKN(input) {
        const s = String(input).replace(/\s+/g, '').replace(/[^0-9]/g, '');
        if (s.length !== 11) return false;
        if (s[0] === '0') return false;

        const digits = s.split('').map(Number);

        const sumOdd = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
        const sumEven = digits[1] + digits[3] + digits[5] + digits[7];
        const calc10 = ((sumOdd * 7) - sumEven) % 10;
        if (calc10 !== digits[9]) return false;

        const sumFirst10 = digits.slice(0, 10).reduce((a, b) => a + b, 0);
        const calc11 = sumFirst10 % 10;
        if (calc11 !== digits[10]) return false;

        return true;
    }
};

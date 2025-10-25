window.loadLoginRegisterModule = async function () {

    const state = JSON.parse(localStorage.getItem("state"));
    const token = state?.token.accessToken;

    if (token) {
        window.location.href = window.location.origin + "/";
    }


    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');
    const registerBtn = document.getElementById('btnRegister');
    const loginBtn = document.getElementById('btnLogin');
    const dobArea = document.getElementById('dobArea');
    const mfaArea = document.getElementById('mfaArea');
    const mfaInput = document.getElementById('mfaCode');
    const submitBtn = document.getElementById('submitBtn');

    let currentAction = 'login'; // login veya register
    let mfaToken = null; // geçici MFA token

    function showMessage(msg, type = 'error') {
        messageDiv.innerHTML = `<div class="alert alert-${type === 'error' ? 'danger' : 'success'}">${msg}</div>`;
    }
    document.addEventListener('click', function (e) {
        if (e.target && e.target.id === 'btnLogin') {
            currentAction = 'login';

            // Login butonu aktif
            loginBtn.classList.add('bg-primary');
            loginBtn.classList.remove('bg-light', 'text-dark');

            // Register butonu pasif
            registerBtn.classList.add('bg-light', 'text-dark');
            registerBtn.classList.remove('bg-primary');

            dobArea.style.display = 'none';
            submitBtn.innerText = 'Giriş Yap';
        }

        if (e.target && e.target.id === 'btnRegister') {
            currentAction = 'register';

            // Register butonu aktif
            registerBtn.classList.add('bg-primary');
            registerBtn.classList.remove('bg-light', 'text-dark');

            // Login butonu pasif
            loginBtn.classList.add('bg-light', 'text-dark');
            loginBtn.classList.remove('bg-primary');

            dobArea.style.display = 'block';
            submitBtn.innerText = 'Kayıt Ol';
        }
    });


    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const tc = document.getElementById('tc-login').value.trim();
        let phone = document.getElementById('phone-login').value.replace(/\D/g, '');
        const dob = document.getElementById('dob').value || null;
        const mfaCode = mfaInput.value.trim();
        console.log("submit çalıştı." + tc + " " + phone + " " + dob + " " + mfaCode);
        var validateTc = await validateTCKN(tc);
        // TC ve telefon doğrulama

        if (!tc || tc.length !== 11) { showMessage('TC doğru girilmelidir.'); return; }

        if (phone.startsWith('0')) { showMessage('Telefon 0 ile başlamamalıdır.'); return; }
        if (phone.length !== 10) { showMessage('Telefon 10 haneli olmalıdır.'); return; }
        if (!validateTc) {
            console.log("tc valid değil.");
            await showMessage("Lüfen Geçerli bir TC Kimlik Numarası Girin.", "error");
            return;
        }
        else {
            console.log("tc valid");
        }


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
                    if (!me) {
                        state.user.custumerId = me.id;
                        state.user.fullName = me.fullName;
                    }
                    localStorage.setItem('state', JSON.stringify(state));

                    submitBtn.disabled = true;
                    await showMessage('Doğrulama başarılı! Yönlendiriliyorsunuz...', 'success');
                    setTimeout(() => {
                        window.location.href = window.location.origin + "/dashboard/";
                    }, 1500);
                } else {
                    console.log("res.ok:", res.ok, "json:", json);
                    showMessage(json.detail || 'Doğrulama hatası');
                }
            } catch (err) {
                showMessage(err.message);
                console.log(err.message);

            }
            return;
        }

        const postData = {
            "$type": "individual",
            "identityNumber": Number(tc),
            "birthDate": currentAction === 'register' ? dob : null,
            "phoneNumber": { number: phone, countryCode: 90 },
            "agentId": "0198a25c-1a13-7965-bd4b-61c2c703333a"
        };

        try {
            console.log("fetch çalıştı.");
            const res = await fetch('https://api.insurup.com/api/auth/customer/login-or-register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData)
            });
            const json = await res.json();

            if (res.ok && json.token) {
                // Geçici MFA token'ı kaydet
                console.log("token sonucu: " + json);
                mfaToken = json.token;
                mfaArea.style.display = 'block';
                showMessage('📲 SMS ile doğrulama kodu gönderildi. Lütfen kodu girin.', 'success');
                mfaInput.focus();
            } else {
                console.log("hata sonucu: " + json);
                showMessage(json.detail || JSON.stringify(json) || 'Bilinmeyen hata');
            }

        } catch (err) {
            console.log("fetch error", err);
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

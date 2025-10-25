<?php if (!defined('ABSPATH'))
    exit;
function tc_phone_login_form_shortcode()
{
    ob_start(); ?>
    <div class="container d-flex justify-content-center align-items-center vh-100">
        <div class="card shadow-lg p-4" style="max-width: 500px; width: 100%;">
            <div class="text-center mb-4">
                <div class="mb-3"> <i class="fas fa-shield-alt fa-2x text-primary"></i> </div>
                <h2 class="">Sigorta Portalı</h2>

            </div>
            <!-- Buttons -->
            <div class="d-flex  gap-2 justify-content-center w-100 align-items-center">
                <button class="btn btn-primary" id="login">Giriş Yap</button>
                <button class="btn btn-light" id="register">Kayıt Ol</button>
            </div>
            <hr /> <br>
            <form id="loginForm">
                <div class="mb-3 text-start"> <label for="tc" class="form-label">TC Kimlik No</label>
                    <input type="text" class="form-control shadow" id="tc" placeholder="TC Kimlik No" maxlength="11"
                        required>

                </div>
                <div class="mb-3 text-start "> <label for="phone" class="form-label">Cep Telefonu</label>

                    <input type="tel" class="form-control shadow" id="phone" placeholder="5XX XXX XX XX" maxlength="13"
                        required>


                    <div hidden class="mb-3 text-start" id="dobArea"> <label for="dob" class="form-label">Doğum
                            Tarihiniz</label>
                        <input type="date" class="form-control shadow" id="dob">

                    </div>

                    <div class="d-flex justify-content-center mt-4 align-items-center">
                        <button type="submit" class="btn btn-primary w-75 d-flex justify-content-center align-items-center">
                            <span id="submitText">Giriş Yap</span>
                            <i class="fas fa-sign-in-alt ms-2"></i>
                        </button>
                    </div>
            </form>
            <div id="message" class="mt-3 text-center" style="display: none;"></div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const loginForm = document.getElementById('loginForm');
            const messageDiv = document.getElementById('message');
            const registerBtn = document.getElementById('register');
            const loginBtn = document.getElementById('login');
            const dobArea = document.getElementById('dobArea');
            const submitText = document.getElementById('submitText');
            const dob = document.getElementById('dob');
          


            registerBtn.addEventListener('click', function (e) {
                registerBtn.classList.add('btn-primary');
                registerBtn.classList.remove('btn-light');
                loginBtn.classList.remove('btn-primary');
                loginBtn.classList.add('btn-light');
                dobArea.hidden = false;
                submitText.innerText = 'Kayıt Ol';
            });

            loginBtn.addEventListener('click', function (e) {
                loginBtn.classList.add('btn-primary');
                loginBtn.classList.remove('btn-light');
                registerBtn.classList.remove('btn-primary');
                registerBtn.classList.add('btn-light');
                dobArea.hidden = true;
                submitText.innerText = 'Giriş Yap';
            });



            // TC No formatı - sadece rakam 
            const tcInput = document.getElementById('tc');
            tcInput.addEventListener('input', function (e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 11) value = value.slice(0, 11);
                e.target.value = value;
            });

            // Telefon formatı - otomatik boşluk ekleme 
            const phoneInput = document.getElementById('phone');
            phoneInput.addEventListener('input', function (e) {
                let value = e.target.value.replace(/\D/g, '');

                // Maksimum 11 rakam
                if (value.length > 11) {
                    value = value.slice(0, 11);
                }

                // Format uygula: 5XX XXX XX XX
                let formattedValue = '';
                if (value.length > 0) formattedValue = value[0];
                if (value.length > 1) formattedValue += value[1];
                if (value.length > 2) formattedValue += value[2];
                if (value.length > 3) formattedValue += ' ' + value[3];
                if (value.length > 4) formattedValue += value[4];
                if (value.length > 5) formattedValue += value[5];
                if (value.length > 6) formattedValue += ' ' + value[6];
                if (value.length > 7) formattedValue += value[7];
                if (value.length > 8) formattedValue += ' ' + value[8];
                if (value.length > 9) formattedValue += value[9];
                if (value.length > 10) formattedValue += value[10];

                e.target.value = formattedValue;
            });

            // Telefon input'una focus olduğunda placeholder'ı temizle 
            phoneInput.addEventListener('focus', function () {
                if (this.value === '') this.placeholder = '';
            });

            // Telefon input'undan çıkıldığında placeholder'ı geri getir 
            phoneInput.addEventListener('blur', function () {
                if (this.value === '') this.placeholder = '5XX XXX XX XX';
            });

            // Form gönderimi 
            loginForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const tc = tcInput.value.trim();

                // Telefon numarasından boşlukları kaldır ve başına 0 ekle 
                let phone = phoneInput.value.replace(/\s/g, '');
               

                // TC No validasyonu 
                if (tc.length !== 11) {
                    showMessage('TC Kimlik No 11 haneli olmalıdır', 'error');
                    tcInput.focus();
                    return;
                }

                // TC No sadece rakam kontrolü
                if (!/^\d{11}$/.test(tc)) {
                    showMessage('TC Kimlik No sadece rakam içermelidir', 'error');
                    tcInput.focus();
                    return;
                }

                // TC No algoritma kontrolü (basit)
                if (!validateTCKN(tc)) {
                    showMessage('Geçersiz TC Kimlik No', 'error');
                    tcInput.focus();
                    return;
                }

                // Telefon validasyonu
                if (phone.length !== 10) {
                    showMessage('Telefon numarası ' + phone.length + ' haneli, 10 haneli olmalıdır!', 'error');
                    phoneInput.focus();
                    return;
                }

                // Telefon sadece rakam kontrolü 
                if (!/^\d{10}$/.test(phone)) {
                    console.log(phone);
                    showMessage('Telefon numarası sadece rakam içermelidir', 'error');
                    phoneInput.focus();
                    return;
                }

                // Telefon format kontrolü (05 ile başlamalı)
                if (!phone.startsWith('5')) {
                    showMessage('Telefon numarası 5 ile başlamalıdır', 'error');
                    phoneInput.focus();
                    return;
                }

                // Loading durumu 
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<div class="spinner-border" role="status"><span class="visually-hidden">Giriş Yapılıyor...</span></div>';

                //  Giriş işlemi ----

                const url = "https://api.insurup.com/api/auth/customer/login-or-register";
                var dobValue = null;
                 if (dob.value){
                    dobValue = dob.value;
                }
            
                // Gönderilecek veri
                const data = {
                    "$type": "individual",
                    "identityNumber": Number(tc),
                    "birthDate": dobValue,
                    "phoneNumber": {
                        "number": phone.toString(),
                        "countryCode": 90,
                        "areaCode": null,
                        "numberWithoutAreaCode": null
                    },
                    "agentId": "0198a25c-1a13-7965-bd4b-61c2c703333a"
                };

                // fetch ile POST isteği
                fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                })
                    .then(response => response.json())
                    .then(result => {
                        console.log("result :"+result);
                        if (result && typeof result.token === "string" && result.token.trim() !== "") {
                           
                            console.log("Başarılı:", result);
                            localStorage.setItem('token', result.token);
                            
                            showMessage('Giriş başarılı! Yönlendiriliyorsunuz...', 'success');

                            const dashboardPage = '<?php echo get_permalink(get_page_by_title("Dashboard")->ID ?? 0); ?>';
                            window.location.href = dashboardPage && dashboardPage !== '<?php echo home_url(); ?>' ? dashboardPage : '<?php echo home_url(); ?>';
                        } else {
                           console.log(typeof result); // "object" olmalı
                            console.log("Başarısız:", result);
                            submitBtn.disabled = false;
                            showMessage('İşlem Başarısız... \n Hata: '+result.detail, 'error');
                        
                            submitBtn.innerText = submitText.innerText;
                        }
                    })
                    .catch(error => {
                       
                        console.error("Hata oluştu:", error);
                        showMessage('Hata oluştu \n Hata: '+result.detail, 'error');

                    });


              
                loginForm.reset();

               
            });

            // Mesaj gösterme fonksiyonu 
            function showMessage(message, type) {
                if (type === 'success') {
                    messageDiv.innerHTML = `<div class="alert alert-success">${message}</div>`;
                    messageDiv.className = 'mt-3 text-success text-center';
                } else {
                    messageDiv.innerHTML = `<div class="alert alert-danger">${message}</div>`;
                    messageDiv.className = 'mt-3 text-danger text-center';
                }

                // Mesajı göster 
                messageDiv.style.display = 'block';

                // Submit butonunu eski haline getir 
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Giriş Yap</span><i class="fas fa-sign-in-alt"></i>';

                // 5 saniye sonra mesajı gizle 
                setTimeout(function () {
                    messageDiv.style.display = 'none';
                    messageDiv.innerHTML = '';
                }, 5000);
            }

            // TC Kimlik No algoritma kontrolü
            function validateTCKN(tc) {
                if (tc.length !== 11) return false;
                if (tc[0] === '0') return false;
                if (
                    tc[0] === tc[1] && tc[1] === tc[2] && tc[2] === tc[3] &&
                    tc[3] === tc[4] && tc[4] === tc[5] && tc[5] === tc[6] &&
                    tc[6] === tc[7] && tc[7] === tc[8] && tc[8] === tc[9] &&
                    tc[9] === tc[10]
                ) return false;

                let oddSum = parseInt(tc[0]) + parseInt(tc[2]) + parseInt(tc[4]) +
                    parseInt(tc[6]) + parseInt(tc[8]);
                let evenSum = parseInt(tc[1]) + parseInt(tc[3]) + parseInt(tc[5]) +
                    parseInt(tc[7]);

                let digit10 = (oddSum * 7 - evenSum) % 10;
                if (parseInt(tc[9]) !== digit10) return false;

                let sum = 0;
                for (let i = 0; i < 10; i++) sum += parseInt(tc[i]);
                let digit11 = sum % 10;
                if (parseInt(tc[10]) !== digit11) return false;

                return true;
            }
        });
    </script>









    <?php return ob_get_clean();
}
add_shortcode('tc_phone_login', 'tc_phone_login_form_shortcode');
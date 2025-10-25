




//Requests
async function apiGetFetch(endpoint, isRetry = false) {

    console.log("get fetch çalıştı.");

    let state = localStorage.getItem('state') ? JSON.parse(localStorage.getItem('state')) : null;
    let token = state ? state.token.accessToken : null;
    if (!token) {
        await showMessage('Oturum yok. Lütfen giriş yapın.', "warning");
        return;
    }
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

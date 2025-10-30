window.loginMenuModule = async function () {
    const avatar = document.getElementById('userAvatar');
    const dropdown = document.getElementById('userDropdown');
    
    const logoutBtn = document.getElementById("logoutBtn");
    const loginBtn = document.getElementById('loginBtn');
  
    const state = JSON.parse(localStorage.getItem("state"));
    const siteUrl = window.location.origin;

    function toggleDropdown() {
        dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    }

    if (state?.token?.accessToken) {
        document.getElementById("onLogin").style.display = "block";
        document.getElementById("onLogout").style.display = "none";

        const dropdown = document.getElementById('userDropdown');
        const bilgilerimBtn = document.getElementById("bilgilerimBtn");
        const varliklarimBtn = document.getElementById("varliklarimBtn");
        const tekliflerimBtn = document.getElementById("tekliflerimBtn");
        const policelerimBtn = document.getElementById("policelerimBtn");
        const loginBtn = document.getElementById("loginBtn");

        // Dropdown toggle
        document.getElementById('userAvatar')?.addEventListener('click', e => {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
        });

        // Linkler
        bilgilerimBtn?.addEventListener('click', e => {
            e.preventDefault(); e.stopPropagation();
            dropdown.style.display = 'none';
            location.href = siteUrl +"/bilgilerim/";
        });

        varliklarimBtn?.addEventListener('click', e => {
            e.preventDefault(); e.stopPropagation();
            dropdown.style.display = 'none';
            location.href = siteUrl+"/varliklarim/";
        });

        panelBtn?.addEventListener('click', e => {
            e.preventDefault(); e.stopPropagation();
            dropdown.style.display = 'none';
            location.href = siteUrl+"/panel/";
        });
        
        

        tekliflerimBtn?.addEventListener('click', e => {
            e.preventDefault(); e.stopPropagation();
            dropdown.style.display = 'none';
            location.href = siteUrl+"/tekliflerim/";
        });

        policelerimBtn?.addEventListener('click', e => {
            e.preventDefault(); e.stopPropagation();
            dropdown.style.display = 'none';
            location.href = siteUrl+"/policelerim/";
        });

        loginBtn?.addEventListener('click', e => {
            localStorage.removeItem('state');
            location.href = siteUrl + "/login-register/";
        });

        // Sayfa herhangi bir yere tıklayınca dropdown kapanacak
        document.addEventListener('click', () => dropdown && (dropdown.style.display = 'none'));
        const loginUrl = '<?php echo esc_url(home_url("/login-register/")); ?>';

        logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            localStorage.removeItem('state');
            window.location.href = siteUrl + "/login-register/";
        });

        document.addEventListener("click", function () {
            dropdown.style.display = "none";
        });

    } else {
        document.getElementById("onLogin").style.display = "none";
        document.getElementById("onLogin").style.display = "none";
        document.getElementById("onLogout").style.display = "block";


        loginBtn?.addEventListener('click', function () {
            window.location.href = siteUrl + "/login-register/";
        });
    }
};
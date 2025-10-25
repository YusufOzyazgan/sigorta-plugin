
window.loadDashboardModule = async function () {
    document.addEventListener('DOMContentLoaded', function () {
        const tabs = document.querySelectorAll('.dashboard-tab');
        const dashboardBoxes = document.getElementById('dashboardBoxes');
        const tabContent = document.getElementById('tabContent');
        const avatar = document.getElementById('userAvatar');
        const dropdown = document.getElementById('userDropdown');
        const bilgilerimBtn = document.getElementById("bilgilerimBtn");


        let state = null;
        try {
            state = JSON.parse(localStorage.getItem("state")) || {};
        } catch (e) {
            state = {};
        }

        if (!state?.token.accessToken) {
            document.getElementById("onLogout").style.display = "block";
        }
        else {

            document.getElementById("onLogin").style.display = "block";

            bilgilerimBtn.addEventListener("click", function (e) {
                e.preventDefault();
                openTab("bilgilerim");
            });

            avatar.addEventListener('click', () => {
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            });
        }







        const logoutBtn = document.getElementById('logoutBtn');
        const loginBtn = document.getElementById('loginBtn');

        if (logoutBtn) {
            logoutBtn.addEventListener('click', function () {
                localStorage.removeItem('state');
                window.location.href = '/login-register/';
            });
        }

        if (loginBtn) {
            loginBtn.addEventListener('click', function () {
                localStorage.removeItem('state');

                window.location.href = '/login-register/';
            });
        }


        async function openTab(tabName) {
            tabs.forEach(t => t.classList.remove('active'));

            const activeTab = document.querySelector(`.dashboard-tab[data-tab="${tabName}"]`);
            if (activeTab) activeTab.classList.add('active');

            dashboardBoxes.style.display = tabName === 'dashboard' ? 'flex' : 'none';
            tabContent.innerHTML = '';
            console.log("tabname = " + tabName);
            if (tabName === 'varliklarim' && window.loadVarliklarimModule) {
                await window.loadVarliklarimModule(tabContent);
            } else if (tabName === 'policelerim' && window.loadPolicelerimModule) {
                await window.loadPolicelerimModule(tabContent);
            } else if (tabName === 'tekliflerim' && window.loadTekliflerimModule) {
                await window.loadTekliflerimModule(tabContent);
            } else if (tabName === 'bilgilerim' && window.loadBilgilerimModule) {

                console.log("bilgilerim tabı çalışıyor");
                await window.loadBilgilerimModule(tabContent);
            }
            else if (tabName === 'trafik' && window.loadTrafikModule) {
                console.log("trafik tabı çalışıyor");
                await window.loadTrafikModule(tabContent);
            }
            else if (tabName === 'kasko' && window.loadKaskoModule) {
                console.log("Kasko tabı çalışıyor");
                await window.loadKaskoModule(tabContent);
            }
            else if (tabName === 'dask' && window.loadDaskModule) {
                console.log("DASK tabı çalışıyor");
                await window.loadDaskModule(tabContent);
            }
            else if (tabName === 'konut' && window.loadKonutModule) {
                console.log("Konut tabı çalışıyor");
                await window.loadKonutModule(tabContent);
            }
            else if (tabName === 'tss' && window.loadTssModule) {
                console.log("TSS tabı çalışıyor");
                await window.loadTssModule(tabContent);
            }



            else if (tabName !== 'dashboard') {
                tabContent.innerHTML = `<p style="text-align:center; padding:20px;">İçerik burada gösterilecek.</p>`;
            }
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', function (e) {
                e.preventDefault();
                openTab(tab.dataset.tab);
            });
        });

        const boxes = document.querySelectorAll('.dashboard-box');
        boxes.forEach(box => {
            box.addEventListener('click', () => openTab(box.dataset.tab));
        });


        openTab('dashboard');
    });
}


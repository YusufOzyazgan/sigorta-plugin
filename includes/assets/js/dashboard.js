
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

            // Sidebar menü öğelerini güncelle
            const sidebarItems = document.querySelectorAll('.sidebar-menu-item');
            sidebarItems.forEach(item => {
                item.classList.remove('active');
                if (item.dataset.tab === tabName) {
                    item.classList.add('active');
                }
            });

            // Dashboard ana sayfası için sigorta kartlarını göster/gizle
            const sigortaSection = document.querySelector('.sigorta-section');
            if (sigortaSection) {
                if (tabName === 'dashboard') {
                    sigortaSection.style.display = 'block';
                    tabContent.innerHTML = '';
                    return; // Dashboard'da sadece sigorta kartlarını göster
                } else {
                    sigortaSection.style.display = 'none';
                }
            }
            
            tabContent.innerHTML = '';
            console.log("tabname = " + tabName);
            if (tabName === 'varliklarim' && window.loadVarliklarimModule) {
                await window.loadVarliklarimModule(tabContent);
            } else if (tabName === 'policelerim' && window.loadPolicelerimModule) {
                await window.loadPolicelerimModule(tabContent);
            } else if (tabName === 'tekliflerim' && window.loadTekliflerimModule) {
                await window.loadTekliflerimModule(tabContent);
            }             else if (tabName === 'bilgilerim' && window.loadBilgilerimModule) {

                console.log("bilgilerim tabı çalışıyor");
                await window.loadBilgilerimModule(tabContent);
            }
            else if (tabName === 'trafik' || tabName === 'kasko' || tabName === 'tss' || tabName === 'konut' || tabName === 'dask') {
                // Sigorta kartları için sayfa yönlendirmeleri (openTab içinden çağrılırsa)
                const urlMap = {
                    'trafik': '/trafik-sigortasi/',
                    'kasko': '/kasko/',
                    'tss': '/tamamlayici-saglik-sigortasi/',
                    'konut': '/konut-sigortasi/',
                    'dask': '/dask/'
                };
                
                if (urlMap[tabName]) {
                    window.location.href = urlMap[tabName];
                }
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

        // Sidebar menü öğeleri - direkt href ile yönlendirme yapıyor, JavaScript gerekmez


        openTab('dashboard');
    });
}


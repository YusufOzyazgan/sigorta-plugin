<?php
if (!defined('ABSPATH')) exit;


add_shortcode('policelerim', function () {
    ob_start(); ?>
    
    <div id="policelerim-container"></div>

    <script>
        window.loadPolicelerimModule = async function (container) {
            const isLogin = await isAuth(container);
            if (!isLogin) {
                console.log("isLogin false döndürdü -> giriş yok");
                return;
            }
            container.innerHTML = "";

            const state = JSON.parse(localStorage.getItem("state"));
            let token = state?.token.accessToken;
            let id = state.user?.costumerId;

            if (!id) {
                const me = await apiGetFetch('customers/me');
                state.user.costumerId = me.id;
                id = me.id;
                localStorage.setItem('state', JSON.stringify(state));
            }

            async function loadPolicies() {
                var policies = false; 

                let html = "<h2>Poliçelerim</h2>";

                if (!policies) {
                    html += "<p style='text-align:center;'>Henüz poliçe bulunmamaktadır.</p>";
                    container.innerHTML = html;
                    return;
                }

                html += "<table class='table table-striped'><thead><tr><th>Poliçe ID</th><th>Ad</th><th>Durum</th><th>İşlemler</th></tr></thead><tbody>";
                policies.forEach(p => {
                    html += `<tr>
                        <td>${p.id || "-"}</td>
                        <td>${p.name || "-"}</td>
                        <td>${p.status || "-"}</td>
                        <td>
                            <button class="btn btn-sm btn-info viewDocBtn" data-policyid="${p.id}">Doküman Görüntüle</button>
                            <button class="btn btn-sm btn-success sendDocBtn" data-policyid="${p.id}">Doküman Gönder</button>
                        </td>
                    </tr>`;
                });
                html += "</tbody></table>";
                container.innerHTML = html;
            }

            await loadPolicies();
        };

        document.addEventListener("DOMContentLoaded", function(){
            const container = document.getElementById("policelerim-container");
            if (typeof window.loadPolicelerimModule === "function") {
                window.loadPolicelerimModule(container);
            }
        });
    </script>

    <?php
    return ob_get_clean();
});

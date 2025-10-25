window.loadTekliflerimModule = async function (container) {
    const isLogin = await isAuth(container);
    if (!isLogin) {
        console.log("isLogin false döndürdü -> giriş yok");
        return;
    }

    container.innerHTML = '';
    var state = JSON.parse(localStorage.getItem("state"));
    var token = state?.token.accessToken;
    var id = state.user?.costumerId;

    const endpoint = "https://api.insurup.com/graphql";

    const query = `
    {
        proposals(skip: 0, take: 50, order: [{createdAt: DESC}]) {
            totalCount
            items {
                id
                productBranch
                insuredCustomerName
                insuredCustomerIdentity
                insuredCustomerType
                state
                successRate
                productsCount
                succeedProductsCount
                createdAt
                agentUserCreatedBy {
                    name
                }
                vehicleModel {
                    brand {
                        text
                        value
                    }
                    year
                    type {
                        text
                        value
                    }
                }
                channel
                vehicleId
                propertyId
                insuredCustomerId
            }
        }
    }`;

    let response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
    });

   
    var isRetry = false;
    if ((!response || response.status === 401) && !isRetry) {
        isRetry = true;
        var newToken = await refreshOldToken();
        response = await fetch(endpoint, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + newToken
            }
        });
    }
    if (!response && isRetry === true) {
        alert("Teklifler alınamadı lütfen daha sonra tekrar deneyin.");
    }

    const result = await response.json();
    const proposals = result.data.proposals.items;

    // HTML tablo
    let html = `
    <div class="container mt-4">
        <h1 class="text-center">Teklifler</h1>
        <div id="proposalsTableContainer"></div>
    </div>
    <div class="table-responsive">
        <table class="table table-bordered table-striped">
            <thead class="table-dark">
                <tr>
                    <th>Ürün Branşı</th>
                    <th>Varlık</th>
                    <th>Teklif Alma Tarihi</th>
                    <th>Durum</th>
                    <th>İşlemler</th>
                </tr>
            </thead>
            <tbody>
    `;

    proposals.forEach(p => {
        const productBranch = `<strong>${p.productBranch}</strong>`;
        const asset = p.productBranch === "TSS"
            ? "Standart Paket"
            : (p.vehicleModel?.brand?.text && p.vehicleModel?.type?.text
                ? p.vehicleModel.brand.text + " " + p.vehicleModel.type.text
                : "Araç");
                
        const date = new Date(p.createdAt).toLocaleString();
        const statusColor = p.state === "POLICELED" ? "bg-success text-white" : "bg-warning text-dark";
        const statusText = p.state === "POLICELED" ? "Poliçeleşti" : "Poliçeleşmedi";

        html += `
        <tr>
            <td class="text-center">${productBranch}</td>
            <td>${asset}</td>
            <td>${date}</td>
            <td><div class="${statusColor} p-2 rounded-2 text-center">${statusText}</div></td>
            <td><button class="btn  my-dashboard-btn bg-primary" onclick="loadDetail('${p.id}')">Detay</button></td>
        </tr>
        `;
    });

    html += `</tbody></table></div></div>`;

    container.innerHTML = html;

    window.loadDetail = async function (id) {
        if (!window.loadTeklifDetayModule) {
            console.error("loadTeklifDetayModule fonksiyonu tanımlı değil!");
            return;
        }
        container.innerHTML = '';
        await window.loadTeklifDetayModule(container, id);
    };
};

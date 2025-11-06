window.loadTekliflerimModule = async function (container) {
    const isLogin = await isAuth(container);
    if (!isLogin) {
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
    let proposals = result.data.proposals.items;

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

    proposals = proposals.filter(p => p.state === "ACTIVE");
    
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

        // Tarih kontrolü: createdAt ile şu anki tarih arasındaki fark
        const createdAt = new Date(p.createdAt);
        const now = new Date();
        const diffTime = now - createdAt;
        const diffDays = diffTime / (1000 * 60 * 60 * 24); // Gün cinsinden fark
        
        // 1 günden fazla geçmişse süresi dolmuş
        const isExpired = diffDays > 1;
        const buttonText = isExpired ? "Süresi Dolmuş" : "Detay";
        const buttonClass = isExpired ? "btn bg-secondary " : "btn bg-primary";
        const buttonDisabled = isExpired ? "disabled" : "";
        const buttonOnclick = isExpired ? "" : `onclick="loadDetail('${p.id}')"`;

        html += `
        <tr>
            <td class="text-center">${productBranch}</td>
            <td>${asset}</td>
            <td>${date}</td>
            <td><div class="${statusColor} rounded-2 text-center" style="padding: 4px 8px; font-size: 0.9rem;">${statusText}</div></td>
            <td class="text-center"><button class="${buttonClass} text-capitalize" style="width: 140px; display: flex; justify-content: center; align-items: center; margin: 0 auto; padding: 4px 8px; font-size: 0.9rem;" ${buttonDisabled} ${buttonOnclick}>${buttonText}</button></td>
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

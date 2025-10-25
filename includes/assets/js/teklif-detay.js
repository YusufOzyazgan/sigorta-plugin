


window.loadTeklifDetayModule = async function (container, proposalId) {

    console.log("Load teklif modül çağırıldı.")

    console.log("ProposalId:", proposalId);
    if (!proposalId) {
        console.log("teklif idsi yok .");
        return;
    }

    var state = JSON.parse(localStorage.getItem("state"));
    var token = state?.token.accessToken;

    const isLogin = await isAuth(container);
    if (isLogin === false) {
        console.log("isLogin False döndürdü");
        return;
    }

    container.innerHTML = "";
    container.innerHTML += `
        <div id="proposals" style="display: none;" >
            <h1> En Uygun Teklifleri Tek Tıkla Al </h1>   
            <div id="products-container" class="row g-4"></div>
                
            <!-- ürünler burada oluşacak  -->
            
            <div class="m-4" id="loadingStatus"> </div>
            <div class="mt-5 pt-4 border-top">
                <h2 class="mb-3">Trafik Sigortası Hakkında</h2>
                <p>Zorunlu Trafik Sigortası, Türkiye'de araç sahiplerinin yaptırmak zorunda olduğu bir sigorta türüdür. Bu
                    sigorta, olası bir kazada karşı tarafa verebileceğiniz maddi ve bedensel zararları teminat altına alır.
                    Yukarıdaki tekliflerden size uygun olanı seçerek hemen satın alabilirsiniz.</p>
            </div>
        </div>`;


    // Ürünleri sayfaya ekleyen fonksiyon
    async function renderProducts(products) {
        console.log("render products çalıştı")

        if (!products || products.length === 0) {
            console.log("render products içinde product yok.");
            container.innerHTML += `<div class="text-danger text-center">Malesef başarılı teklif sonucunuz bulunmamaktadır.</div>`;

            return;
        }

        const proposalsArea = document.getElementById("proposals");
        proposalsArea.style.display = "block";
        const productsContainer = document.querySelector('#products-container');


        console.log("products : " + products);



        products.forEach(product => {


            const productCard = document.createElement('div');
            productCard.className = 'col-md-6 col-lg-4';


            productCard.innerHTML = `
                    <div class="card h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <img style="width: 80px;" src="${product.insuranceCompanyLogo}" alt="${product.insuranceCompanyName} Logo" class="company-logo">
                                <span class="text-muted small">${product.insuranceCompanyName}</span>
                            </div>
                            
                            <h5 class="card-title">${product.insuranceCompanyName}</h5>
                            <p class="card-text text-muted">Teklif No: ${product.offerNo}</p>
                            
                            <h4 class="text-primary mb-3">${product.premiums.insuranceCompanyProposalNumber}</h4>
                            
                            <div class="d-flex justify-content-between mb-3">
                                <span class="badge bg-success">${product.paymentType}</span>
                                <span class="text-muted small">${product.taxesIncluded ? 'Vergiler Dahil' : 'Vergiler Hariç'}</span>
                            </div>
                            
                            <div class="d-grid gap-2">
                                <button class="btn btn-outline-primary toggle-warranties" data-product-id="${product.id}">
                                    Teminatlar
                                </button>
                                <input type="hidden" value="${product.id}">
                                <button class="btn btn-primary">Satın Al</button>
                            </div>
                            
                            <div class="warranties" style="display: none;" id="warranties-${product.id}">
                                <h6 class="mt-3">Teminatlar:</h6>
                                <ul>
                                    ${product.warranties.map(warranty => `<li>${warranty}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                `;

            productsContainer.appendChild(productCard);
        });

        // Teminatlar butonlarına tıklama olayını ekle
        document.querySelectorAll('.toggle-warranties').forEach(button => {
            button.addEventListener('click', function () {
                const productId = this.getAttribute('data-product-id');
                const warrantiesDiv = document.getElementById(`warranties-${productId}`);

                if (warrantiesDiv.style.display === 'block') {
                    warrantiesDiv.style.display = 'none';
                    this.textContent = 'Teminatlar';
                } else {
                    warrantiesDiv.style.display = 'block';
                    this.textContent = 'Teminatları Gizle';
                }
            });
        });
    }




    async function loadProducts(proposal_Id) {
        let loading = true;
        let requestSayisi = 0;
        let succeedProductsCount = 0;
        let waitedProudctCount = 0;
        var activeProducts = [];
        var failedCount = 0;
        const loadingDiv = document.getElementById("loadingStatus");


        let response = await apiGetFetch("proposals/" + proposal_Id);
        loadingDiv.textContent = "Yükleniyor…";
        var products = response.products;
        console.log("ürünler:", products);

        let waitedCount = products.filter(c => c.state === "WAITING").length;

        while (waitedCount > 1) {

            response = await apiGetFetch("proposals/" + proposal_Id);
            products = response.products;
            waitedCount = products.filter(p => p.state === "WAITING").length;
            console.log("+1 istek daha yapıldı.")
        }


        for (const p of products) {
            if (p.state == "FAILED") {
                failedCount += 1;
            }
            if (p.state === "ACTIVE") {

                activeProducts.push(p);
                succeedProductsCount += 1;

            }
        }

        console.log("failed count: " + failedCount);
        console.log("waited count: " + waitedCount);
        console.log("succeded count: " + succeedProductsCount);
        loading = false;
        loadingDiv.textContent = "";
        await renderProducts(activeProducts);
        return true;
    }
    await loadProducts(proposalId);
    // await loadProducts("68daec384a5a429409a6328d");

}
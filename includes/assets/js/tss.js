window.loadTssModule = async function (container) {


    const step2Form = container.querySelector('#step2Form');

    console.log("first step çalıştı - tss.js");
    await firstStep();

    if (!step2Form) {
        console.warn('tss.js: #step2Form bulunamadı');
        return;
    }

    step2Form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const state = JSON.parse(localStorage.getItem("state")) || {};
        let customerId = state.user?.costumerId || "";
        if(customerId === ""){
            const me = await apiGetFetch("customers/me");
            state.user.costumerId = me.id;
            customerId = me.id;
            localStorage.setItem("state", JSON.stringify({ ...state, user: { ...state.user, costumerId: customerId } }));
        }

        // Boy ve kilo bilgilerini al
        const height = document.getElementById("height").value;
        const weight = document.getElementById("weight").value;

        // Önce boy ve kilo bilgilerini PUT ile kaydet
        try {
            const heightWeightData = {
                customerId: customerId,
                height: parseInt(height),
                weight: parseInt(weight)
            };

            // API endpoint'i - müşteri bilgilerini güncelle
            const updateEndpoint = `customers/${customerId}/health-info`;
            const updateResult = await apiPutFetch(updateEndpoint, heightWeightData);
            
            if (!updateResult) {
                await showMessage("Boy ve kilo bilgileri kaydedilemedi.", "error");
                return;
            }

            // Başarılı olduysa teklif alma isteğini at
            const formData = {
                $type: "tss",
                vehicleId: "",
                productBranch: "TSS",
                insurerCustomerId: customerId,
                insuredCustomerId: customerId,
                coverageGroupIds: ["690a0959a94b3bf6359fa2f2","690a09eaa94b3bf6359fa31b"],
                coverageTable: null,

                channel: "WEBSITE"
            };

            const response = await apiPostFetch("proposals", formData);
            if (response?.status === 200) {
                await showMessage("Teklif oluşturuldu. ", "success");
                const resultsEl = container.querySelector("#offerResults");
                if (!resultsEl) console.warn('tss.js: #offerResults bulunamadı');
                else resultsEl.innerHTML = `<pre>${JSON.stringify(response, null, 2)}</pre>`;
                if (typeof showStep === 'function') showStep(3);
            } else {
                await showMessage("Teklif oluşturulamadı.", "error");
                container.innerHTML = `
                <div class="alert alert-danger text-center mt-5">
                    <h4>Teklif oluşturulamadı.</h4>
                    <p>Lütfen bilgilerinizi kontrol edip tekrar deneyin.</p>
                    <button id="backToStep1" class="btn btn-primary mt-3">Yeniden Dene</button>
                </div>
                `;
                document.getElementById('backToStep1').addEventListener('click', async () => {
                    window.location.reload();
                });
            }
        } catch (err) {
            console.error('tss.js: boy/kilo kaydetme veya teklif alma hatası', err);
            await showMessage("İşlem sırasında bir hata oluştu.", "error");
        }
    });


    const backStepTssBtn = document.getElementById('backStepTss');
    backStepTssBtn?.addEventListener('click', async () => {
        console.log('geri butonu çalıştı');
        await backStepFunction();
    });

    //S await showStep(step1);
};

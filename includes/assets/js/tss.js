window.loadTssModule = async function (container) {


    const step2Form = container.querySelector('#step2Form');

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
                coverageGroupIds: ["690c5ce1f1178da1813164a4"],
                coverageTable: null,

                channel: "WEBSITE"
            };

            const response = await apiPostFetch("proposals", formData);
            if (response?.proposalId) {
                await showMessage("Teklif oluşturuldu. ", "success");
                const resultsEl = container.querySelector("#offerResults");
                resultsEl.innerHTML = "";
                if (typeof showStep === 'function') showStep(step3);
                await loadProposalDetails(response.proposalId);
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
        await backStepFunction();
    });

    //S await showStep(step1);
};

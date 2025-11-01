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
        const customerId = state.user?.costumerId || "";
        if(customerId === ""){
            const me = await apiGetFetch("customers/me");
            state.user.costumerId = me.id;
            localStorage.setItem("state", JSON.stringify(state));
            customerId = me.id;
            localStorage.setItem("state", JSON.stringify({ ...state, user: { ...state.user, costumerId: customerId } }));
        }

        const formData = {
            $type: "tss",
            vehicleId: "",
            productBranch: "TSS",
            insurerCustomerId: customerId,
            insuredCustomerId: customerId,
            coverageGroupIds: null,
            coverageTable: null,
            height: document.getElementById("height").value,

            channel: "WEBSITE"

        };

        try {
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
            console.error('tss.js: proposals isteği hata', err);
            await showMessage("Teklif oluşturulamadı.", "error");
        }
    });


    const backStepTssBtn = document.getElementById('backStepTss');
    backStepTssBtn?.addEventListener('click', async () => {
        console.log('geri butonu çalıştı');
        await backStepFunction();
    });

    //S await showStep(step1);
};

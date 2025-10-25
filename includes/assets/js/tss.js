window.loadTssModule = async function (container) {
    

  const addProposalBtn = document.querySelector('#addProposal');
  const step2Form = document.querySelector('#step2Form');
    let customer = null;
    const backStepBtn = document.getElementById('backStepBtn');
    await firstStep();
    backStepBtn.addEventListener('click', async () => {
        await backStepFunction();
    });

    step2Form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const height = container.querySelector("#height").value;
        const weight = container.querySelector("#weight").value;

        try {
            const offer = await apiPostFetch("tss-offer", {
                customerId: customer.id,
                height,
                weight
            });
            container.querySelector("#offerResult").innerHTML = `<pre>${JSON.stringify(offer, null, 2)}</pre>`;
            showStep(3);
        } catch (err) { console.error(err); alert("Teklif alınamadı."); }
    });


    container.querySelector("#backStep2").addEventListener("click", () => showStep(1));

   //S await showStep(step1);
};

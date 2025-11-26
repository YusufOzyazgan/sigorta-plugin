

window.loadimmModule = async function (container) {
    const content = document.getElementById("immTeklifForm");
  




 
    const addVehicleBtn = document.getElementById('addVehicleBtn');
    const backStepBtn = document.getElementById('backStepBtn');
    const step3 = document.querySelector("#step3");
   
    const addProposalBtn = document.getElementById('addProposal');
                                                     
    
    
    
    
    
    
    await firstStep();
    await showVehicles();
    
    
    
    addVehicleBtn.addEventListener('click', async () => {
        const vehicleModal = document.getElementById('vehicleModal');
        
        vehicleModal.style.display = "flex";
        
        const aracOlustur = await createVehicle();
        if (!aracOlustur) {
            return;
        }
        else {
            
            await window.loadimmModule(container);
        }
        
        return;
    });
    


    backStepBtn.addEventListener('click', async () => {
        await backStepFunction();
    });

    
    
    addProposalBtn.addEventListener('click', async () => {
        if (!selectedVehicleId) {
            await showMessage("Lütfen bir araç seçin!", "warning");
            return;
        }
        showStep(step3);

        const state = JSON.parse(localStorage.getItem("state"));
        const id = state.user?.costumerId || null;
        const formData = {
            $type: "imm",
            coverage:null,
            channel: "WEBSITE",
            coverageGroupIds: [],
            insuredCustomerId: id,
            insurerCustomerId: id,
            productBranch: "IMM",
            vehicleId: selectedVehicleId
        };
        const proposal = await apiPostFetch("proposals", formData);
        if (proposal?.proposalId) {
            await showMessage("Teklif oluşturuldu. ", "success");
            await loadProposalDetails(proposal.proposalId);
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
    });


}

window.loadIMMModule = window.loadimmModule;




window.loadkaskoModule = async function (container) {
    const content = document.getElementById("kaskoTeklifForm");
  





    const step1 = document.querySelector("#step1");
    const step2 = document.querySelector("#step2");
    const step3 = document.querySelector("#step3");
    const progressSteps = document.querySelectorAll("#stepProgress .step");
    const propertyAlert = document.querySelector("#propertyAlert");
    const addProposalBtn = document.getElementById('addProposal');
                                                     
    
    
    
    
    
    
    await firstStep();
    console.log("show vehicles'a geldi");
    await showVehicles();
    
    
    
    addVehicleBtn.addEventListener('click', async () => {
        console.log("crate vehicle butonu çalıştı. ");
        const vehicleModal = document.getElementById('vehicleModal');
        
        vehicleModal.style.display = "flex";
        
        const aracOlustur = await createVehicle();
        if (!aracOlustur) {
            return;
        }
        else {
            
            loadKaskoModule(container);
        }
        
        return;
    });
    


    backStepBtn.addEventListener('click', async () => {
        await backStepFunction();
    });

    
    
    addProposalBtn.addEventListener('click', async () => {
        console.log("teklif al buton çalışıyor ");
        if (!selectedVehicleId) {
            await showMessage("Lütfen bir araç seçin!", "warning");
            return;
        }
        showStep(step3);

        const state = JSON.parse(localStorage.getItem("state"));
        const id = state.user?.costumerId || null;
        const formData = {
            $type: "kasko",
            channel: "WEBSITE",
            coverageGroupIds: null,
            insuredCustomerId: id,
            insurerCustomerId: id,
            productBranch: "Kasko",
            vehicleId: selectedVehicleId
        };
        const proposal = await apiPostFetch("proposals", formData);
        if (proposal?.proposalId) {
            await showMessage("Teklif oluşturuldu. ", "success");
            await loadProposalDetails(proposal.proposalId);
        } else {
            await showMessage("Teklif oluşturulamadı.", "error");
        }
    });


}


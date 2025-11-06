


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
        <div id="loadingResults"></div>
        <div id="offerResults"></div>
    `;


    // loadProposalDetails fonksiyonunu kontrol et ve çağır
    if (typeof loadProposalDetails === 'function') {
        await loadProposalDetails(proposalId);
    } else {
        console.error('loadProposalDetails fonksiyonu bulunamadı! trafik.js dosyasının yüklendiğinden emin olun.');
        // Fallback: Basit bir yükleme
        try {
            const response = await apiGetFetch("proposals/" + proposalId);
            if (response && response.products) {
                const activeProducts = response.products.filter(p => p.state === "ACTIVE");
                if (typeof renderProposalResults === 'function') {
                    await renderProposalResults(activeProducts, proposalId);
                } else {
                    container.innerHTML = `<div class="alert alert-warning">renderProposalResults fonksiyonu bulunamadı!</div>`;
                }
            }
        } catch (err) {
            console.error('Teklif yükleme hatası:', err);
            container.innerHTML = `<div class="alert alert-danger">Teklif yüklenirken bir hata oluştu.</div>`;
        }
    }

}
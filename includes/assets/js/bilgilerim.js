window.loadBilgilerimModule = async function (container) {
    const isLogin = await isAuth(container);
    if (!isLogin) {
        return;
    }

    container.innerHTML = '';
    var state = JSON.parse(localStorage.getItem("state"));
    var token = state?.token.accessToken;
    var id = state.user?.costumerId;

    if (!id) {
        const me = await apiGetFetch('customers/me');
        state.user.costumerId = me.id;
        id = me.id;
        localStorage.setItem('state', JSON.stringify(state));
    }

    const data = await apiGetFetch('customers/me');
    if (!data) return;

    container.innerHTML = `
        <h1 class="text-center mb-2">Kişisel Bilgiler</h1>
        <form id="informations-form" class="p-3 border rounded shadow-sm bg-light">
            <!-- TC / İsim -->
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="form-label">TC Kimlik No</label>
                    <input type="text" id="identityNumber" class="form-control" disabled value="${data.identityNumber || ''}">
                </div>
                <div class="col-md-6">
                    <label class="form-label">Ad Soyad</label>
                    <input type="text" id="fullName" class="form-control" value="${data.fullName || ''}">
                </div>
            </div>

            <!-- Telefon / Mail -->
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="form-label">Telefon</label>
                    <input type="text" id="phoneNumber" class="form-control" value="${data.primaryPhoneNumber?.number ? formatPhoneNumber(data.primaryPhoneNumber.number) : ''}">
                </div>
                <div class="col-md-6">
                    <label class="form-label">E-posta</label>
                    <input type="email" id="myEmail" class="form-control" value="${data.primaryEmail || ''}">
                </div>
            </div>

            <!-- Doğum tarihi / Cinsiyet -->
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="form-label">Doğum Tarihi</label>
                    <input type="date" id="myBirthDate" class="form-control" value="${data.birthDate || ''}">
                </div>
                <div class="col-md-6">
                    <label class="form-label">Cinsiyet</label>
                    <select id="gender" class="form-select">
                        <option value="UNKNOWN" ${data.gender === '0' ? 'selected' : ''}>Seçiniz</option>
                        <option value="MALE" ${data.gender === 'MALE' ? 'selected' : ''}>Erkek</option>
                        <option value="FEMALE" ${data.gender === 'FEMALE' ? 'selected' : ''}>Kadın</option>
                        <option value="OTHER" ${data.gender === 'OTHER' ? 'selected' : ''}>Diğer</option>
                    </select>
                </div>
            </div>

            <!-- İl / İlçe -->
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="form-label">İl</label>
                    <select id="city" class="form-control">
                        <option value="">İl seçiniz</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label class="form-label">İlçe</label>
                    <select id="district" class="form-control">
                        <option value="">Önce il seçiniz</option>
                    </select>
                </div>
            </div>

            <div class="text-end">
                <button type="submit" class="btn bg-primary btn-primary">Değişiklikleri Kaydet</button>
            </div>
        </form>
    `;

    // İller ve ilçeler
    const citySelect = document.getElementById("city");
    const districtSelect = document.getElementById("district");

    async function loadCities() {
        const cities = (await apiGetFetch(`address-parameters/cities`))
            .sort((a, b) => a.text.localeCompare(b.text));

        cities.forEach(city => {
            let option = document.createElement("option");
            option.value = city.value;
            option.text = city.text;
            citySelect.appendChild(option);
        });

        if (data?.city?.value) {
            citySelect.value = data.city.value.toString();
            await loadDistricts(citySelect.value, data.district?.value);
        }
    }

    async function loadDistricts(cityValue, selectedDistrict = null) {
        districtSelect.innerHTML = "<option value=''>İlçe seçiniz</option>";
        if (!cityValue) return;

        const districts = (await apiGetFetch(`address-parameters/districts?cityReference=${cityValue}`))
            .sort((a, b) => a.text.localeCompare(b.text));

        districts.forEach(district => {
            let option = document.createElement("option");
            option.value = district.value;
            option.text = district.text;
            districtSelect.appendChild(option);
        });

        if (selectedDistrict) {
            districtSelect.value = selectedDistrict.toString();
        }
    }

    citySelect.addEventListener("change", async function () {
        await loadDistricts(this.value);
    });

    loadCities();
    
    // Telefon inputuna format ekle
    const phoneInput = document.getElementById('phoneNumber');
    if (phoneInput) {
        setupPhoneFormatting(phoneInput);
    }

    // Form gönderme
    document.querySelector('#informations-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = {
            "$type": "individual",
            "fullName": document.getElementById('fullName').value || null,
            "birthDate": document.getElementById('myBirthDate').value || null,
            "gender": document.getElementById('gender').value,
            "type": "INDIVIDUAL",
            "id": id,
            "job": 0,
            "primaryEmail": document.getElementById('myEmail').value || null,
            "primaryPhoneNumber": {
                "number": cleanPhoneNumber(document.getElementById('phoneNumber').value),
                "countryCode": 90
            },
            "cityReference": document.getElementById('city').value || null,
            "districtReference": document.getElementById('district').value || null,
        };

        const response = await apiPutFetch('customers/' + id, formData);
        if (response) {
            await showMessage('Bilgiler başarıyla güncellendi.', "success");
        } else {
            await showMessage('Bilgiler güncellenemedi. Lütfen tekrar deneyin.', "error");
        }
    });
};

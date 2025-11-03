<?php
if (!defined('ABSPATH')) exit;
?>

<!-- Konut Modal Component -->
<div class="modal fade" id="konutModal" tabindex="-1" aria-labelledby="konutModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="konutModalLabel">Konut Ekle</h5>
        <button  type="button" class="btn-close bg-light text-dark" data-bs-dismiss="modal" aria-label="Kapat"></button>
      </div>
      <div class="modal-body">
<?php include dirname(path: dirname(__DIR__)) . '/pages/konut-modal-content.php'; ?>
      </div>
    </div>
  </div>
</div>


<script>
document.addEventListener("DOMContentLoaded", function () {
    // bootstrap-select varsa yeniden başlat
    if (typeof jQuery !== 'undefined' && jQuery.fn.selectpicker) {
        jQuery('.selectpicker').selectpicker('refresh');
    }

    // Şehir dropdown’u doldur (global loadCities yoksa yerel fallback)
    (async function initCities() {
        var cityEl = document.getElementById('citySelectProperty');
        if (!cityEl) return;

        if (typeof loadCities === 'function') {
            try { loadCities('#citySelectProperty'); return; } catch(_) {}
        }

        try {
            // Yerel fallback: şehirleri doldur
            var cities = await apiGetFetch('address-parameters/cities');
            if (!Array.isArray(cities)) return;
            cities.sort(function(a,b){ return (a.text||'').localeCompare(b.text||''); });
            cityEl.innerHTML = '<option value="">Şehir Seçin</option>';
            cities.forEach(function(c){
                var opt = document.createElement('option');
                opt.value = c.value; opt.text = c.text; cityEl.appendChild(opt);
            });
            if (typeof jQuery !== 'undefined' && jQuery.fn.selectpicker) {
                jQuery(cityEl).selectpicker('refresh');
            }
        } catch (e) {
            console.warn('Şehirler yüklenemedi:', e);
        }
    })();
});
</script>
<script src="<?php echo plugin_dir_url(dirname(__FILE__)); ?>js/konut.js"></script>
<script src="<?php echo plugin_dir_url(dirname(__FILE__)); ?>js/varliklarim.js"></script>

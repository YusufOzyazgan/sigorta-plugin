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
<?php include plugin_dir_path(dirname(__DIR__)) . 'pages/konut-modal-content.php'; ?>
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

    // şehir dropdown’u varsa load fonksiyonu çağır
    if (typeof loadCities === 'function') {
        loadCities('#citySelectProperty');
    } else {
        console.warn("loadCities fonksiyonu bulunamadı (varliklarim.js veya konut.js içinde tanımlı olmalı).");
    }
});
</script>
<script src="<?php echo plugin_dir_url(__FILE__); ?>../assets/js/konut.js"></script>
<script src="<?php echo plugin_dir_url(__FILE__); ?>../assets/js/varliklarim.js"></script>

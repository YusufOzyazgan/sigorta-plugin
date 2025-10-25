<?php
if (!defined('ABSPATH'))
    exit;


function tekliflerim_enqueue_scripts()
{
    wp_enqueue_script(
        'tekliflerim-js',
        plugin_dir_url(dirname(__FILE__)) . 'assets/js/tekliflerim.js',
        array('jquery'),
        '1.0.0',
        true
    );

    wp_enqueue_script(
        'teklif-detay-js',
        plugin_dir_url(dirname(__FILE__)) . 'assets/js/teklif-detay.js',
        array('jquery'),
        '1.0.0',
        true
    );
}
add_action('wp_enqueue_scripts', 'tekliflerim_enqueue_scripts');

// Shortcode tanımı
function tekliflerim_shortcode()
{

    ob_start(); 
   
    ?>
    
   
    <div id="tekliflerim-container"></div>
    <script>
        document.addEventListener("DOMContentLoaded", function () {
            const container = document.getElementById("tekliflerim-container");
            if (typeof window.loadTekliflerimModule === "function") {
                window.loadTekliflerimModule(container);
            } else {
                console.error("loadTekliflerimModule tanımlı değil!");
            }
        });
    </script>

    <?php
    return ob_get_clean();
}
add_shortcode('tekliflerim', 'tekliflerim_shortcode');

<?php
if (!defined('ABSPATH')) exit;


function bilgilerim_enqueue_scripts() {
    wp_enqueue_script(
        'bilgilerim-js',
        plugin_dir_url(dirname(__FILE__)) . 'assets/js/bilgilerim.js',
        array('jquery'),
        '1.0.0',
        true
    );
}
add_action('wp_enqueue_scripts', 'bilgilerim_enqueue_scripts');

// Shortcode tanımı
function bilgilerim_shortcode() {
    ob_start(); ?>
    
    <div id="bilgilerim-container"></div>
    
    <div id="notif"
        style="position:fixed;bottom:80px;right:20px;padding:10px 20px;border-radius:5px;color:#fff;background:none;display:block;z-index:9999;">
    </div>
    <script>
        document.addEventListener("DOMContentLoaded", function () {
            const container = document.getElementById("bilgilerim-container");
            if (typeof window.loadBilgilerimModule === "function") {
                window.loadBilgilerimModule(container);
            } else {
                console.error("loadBilgilerimModule tanımlı değil!");
            }
        });
    </script>
    
    <?php
    return ob_get_clean();
}
add_shortcode('bilgilerim', 'bilgilerim_shortcode');

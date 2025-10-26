<?php
/*
Plugin Name: Sigorta Plugin
Description: Sigorta API tabanlı dashboard ve sayfalar.
Version: 1.0
Author: Y-B
*/

if (!defined('ABSPATH'))
    exit;


function sigorta_enqueue_scripts()
{

    // Elementor editörde çalışmayı durdur
    if (class_exists('\Elementor\Plugin') && \Elementor\Plugin::$instance->editor->is_edit_mode()) {
        return; // JS/CSS yükleme yok, JSON hatası engellendi
    }

    // Bootstrap
    wp_enqueue_style('bootstrap-css', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css', array(), '5.3.3');
    wp_enqueue_script('bootstrap-js', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js', array('jquery'), '5.3.3', true);

    // Bootstrap Select
    wp_enqueue_style('bootstrap-select-css', 'https://cdn.jsdelivr.net/npm/bootstrap-select@1.14.0-beta3/dist/css/bootstrap-select.min.css', array('bootstrap-css'), '1.14.0-beta3');
    wp_enqueue_script('bootstrap-select-js', 'https://cdn.jsdelivr.net/npm/bootstrap-select@1.14.0-beta3/dist/js/bootstrap-select.min.js', array('jquery', 'bootstrap-js'), '1.14.0-beta3', true);

    // Font Awesome
        wp_enqueue_style(
        'nunito-sans','https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&display=swap', array(), // Dependencies
        null // Versiyon (null bırakabilirsin)
    );
    wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

    // Plugin CSS
    wp_enqueue_style('sigorta-style', plugin_dir_url(__FILE__) . 'includes/assets/css/styles.css');

    // Plugin JS
    wp_enqueue_script(
        'sigorta-functions',
        plugin_dir_url(__FILE__) . 'includes/assets/js/functions.js',
        array('jquery', 'bootstrap-js', 'bootstrap-select-js'),
        '1.1',
        true
    );

  
}
add_action('wp_enqueue_scripts', 'sigorta_enqueue_scripts');


add_action('wp_ajax_sigorta_get_data', 'sigorta_get_data');
add_action('wp_ajax_nopriv_sigorta_get_data', 'sigorta_get_data');

function sigorta_get_data()
{

    // Elementor editörde JSON göndermeyi engelle
    if (class_exists('\Elementor\Plugin') && \Elementor\Plugin::$instance->editor->is_edit_mode()) {
        wp_send_json_error(['message' => 'Editör modunda devre dışı']);
        wp_die();
    }

    // Normal AJAX response
    $data = array(
        'success' => true,
        'info' => 'Sigorta verisi geldi'
    );

    wp_send_json_success($data);
    wp_die();
}

/**
 * Yardımcı fonksiyonlar ve sayfalar
 */
require_once plugin_dir_path(__FILE__) . 'includes/helper-functions.php';
require_once plugin_dir_path(__FILE__) . 'includes/pages/login-register.php';
require_once plugin_dir_path(__FILE__) . 'includes/pages/bilgilerim.php';
require_once plugin_dir_path(__FILE__) . 'includes/pages/tekliflerim.php';
require_once plugin_dir_path(__FILE__) . 'includes/pages/policelerim.php';
require_once plugin_dir_path(__FILE__) . 'includes/pages/varliklarim.php';
require_once plugin_dir_path(__FILE__) . 'includes/pages/trafik.php';
require_once plugin_dir_path(__FILE__) . 'includes/pages/tss.php';
require_once plugin_dir_path(__FILE__) . 'includes/pages/dask.php';
require_once plugin_dir_path(__FILE__) . 'includes/pages/konut.php';
require_once plugin_dir_path(__FILE__) . 'includes/pages/kasko.php';
require_once plugin_dir_path(__FILE__) . 'includes/pages/callback.php';

require_once plugin_dir_path(__FILE__) . 'includes/pages/dashboard.php';
require_once plugin_dir_path(__FILE__) . 'includes/loginMenu.php';
require_once plugin_dir_path(__FILE__) . 'includes/assets/components/warrantiesModal.php';


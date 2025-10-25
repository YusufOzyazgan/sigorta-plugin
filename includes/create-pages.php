<?php

if ( ! defined( 'ABSPATH' ) ) exit;

function sigorta_create_pages() {
    $pages = [
        // 'Bilgilerim'   => '[bilgilerim]',
        // 'Varlıklarım'  => '[varliklarim]',
        // 'Tekliflerim'  => '[tekliflerim]',
        // 'Policelerim'  => '[policelerim]',
        'Login-Register' => '[login-register]',
        'Dashboard'      => '[dashboard_content]'
    ];

    foreach ($pages as $title => $shortcode) {
        // Sayfa zaten varsa atla
        $existing_page = get_page_by_title($title);
        if ($existing_page) {
            continue;
        }

        // Yeni sayfayı oluştur
        $page_id = wp_insert_post([
            'post_title'   => $title,
            'post_content' => $shortcode,
            'post_status'  => 'publish',
            'post_type'    => 'page'
        ]);

        // Sadece Dashboard için Elementor Canvas şablonunu ayarla
        if ($page_id && $title === 'Dashboard' && class_exists('\Elementor\Plugin')) {
            update_post_meta($page_id, '_wp_page_template', 'elementor_canvas');
        }
    }
}

// Plugin aktif edildiğinde çalıştır



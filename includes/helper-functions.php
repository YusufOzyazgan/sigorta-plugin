<?php
if (!defined('ABSPATH')) {
    exit;
}


function sigorta_get_customer_id() {
    // WordPress'te session kullanımı için güvenli kontrol
    if (session_status() === PHP_SESSION_NONE) {
        if (!headers_sent()) {
            session_start();
        }
    }
    return isset($_SESSION['insurup_customerId']) ? $_SESSION['insurup_customerId'] : null;
}

/**
 * Veritabanı tablosu var mı kontrol et
 */
function sigorta_table_exists($table_name) {
    global $wpdb;
    
    // Information schema'dan kontrol et (daha güvenilir)
    $table_exists = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) 
        FROM information_schema.tables 
        WHERE table_schema = %s 
        AND table_name = %s",
        DB_NAME,
        $table_name
    ));
    
    return ($table_exists > 0);
}

/**
 * Veritabanı tablosu oluştur - Bekleyen Teklifler
 */
function sigorta_create_bekleyen_teklifler_table() {
    global $wpdb;
    
    $table_name = $wpdb->prefix . 'sigorta_bekleyen_teklifler';
    
    // Tablo zaten varsa oluşturma
    if (sigorta_table_exists($table_name)) {
        return true;
    }
    
    $charset_collate = $wpdb->get_charset_collate();
    
    // CREATE TABLE sorgusu - IF NOT EXISTS ile
    $sql = "CREATE TABLE IF NOT EXISTS $table_name (
        id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        proposal_id varchar(255) NOT NULL,
        product_id varchar(255) NOT NULL,
        customer_data longtext NOT NULL,
        proposal_data longtext NOT NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        status varchar(50) DEFAULT 'pending',
        PRIMARY KEY  (id),
        KEY proposal_id (proposal_id),
        KEY product_id (product_id),
        KEY status (status)
    ) $charset_collate;";
    
    // Hata ayıklama: Hataları göster
    $wpdb->show_errors();
    
    // Direkt SQL sorgusu çalıştır
    $result = $wpdb->query($sql);
    
    // Eğer sorgu başarısız olduysa dbDelta ile dene (dbDelta farklı format bekler)
    if ($result === false && !empty($wpdb->last_error)) {
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        
        // dbDelta için SQL formatı (her satır ayrı olmalı)
        $dbdelta_sql = "CREATE TABLE $table_name (
        id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        proposal_id varchar(255) NOT NULL,
        product_id varchar(255) NOT NULL,
        customer_data longtext NOT NULL,
        proposal_data longtext NOT NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        status varchar(50) DEFAULT 'pending',
        PRIMARY KEY  (id),
        KEY proposal_id (proposal_id),
        KEY product_id (product_id),
        KEY status (status)
    ) $charset_collate;";
        
        dbDelta($dbdelta_sql);
    }
    
    // Hata ayıklamayı kapat
    $wpdb->hide_errors();
    
    // Tekrar kontrol et
    $exists = sigorta_table_exists($table_name);
    
    if (!$exists) {
        // Son çare: Manuel SQL çalıştır
        $manual_sql = "CREATE TABLE IF NOT EXISTS `$table_name` (
            `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            `proposal_id` varchar(255) NOT NULL,
            `product_id` varchar(255) NOT NULL,
            `customer_data` longtext NOT NULL,
            `proposal_data` longtext NOT NULL,
            `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
            `status` varchar(50) DEFAULT 'pending',
            PRIMARY KEY (`id`),
            KEY `proposal_id` (`proposal_id`),
            KEY `product_id` (`product_id`),
            KEY `status` (`status`)
        ) $charset_collate;";
        
        $wpdb->query($manual_sql);
    }
    
    return sigorta_table_exists($table_name);
}

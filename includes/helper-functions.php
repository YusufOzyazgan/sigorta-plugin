<?php
if (!defined('ABSPATH')) {
    exit;
}


function sigorta_get_customer_id() {
    return isset($_SESSION['insurup_customerId']) ? $_SESSION['insurup_customerId'] : null;
}

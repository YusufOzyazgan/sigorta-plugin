<?php
// Sadece izin verilen domainler
$allowed_domains = ['sigortapiri.com', 'deneme.local'];
$domain = $_GET['domain'] ?? '';
if (in_array($domain, $allowed_domains)) {
    echo 'OK';
} else {
    http_response_code(403);
    echo 'UNAUTHORIZED';
}

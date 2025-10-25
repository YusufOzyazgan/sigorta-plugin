<?php
if ( ! defined( 'ABSPATH' ) ) exit;
function sigorta_varliklarim_shortcode() {

    // Test verileri
    $varliklar = [
        [
            'tip' => 'Arac',
            'uzun_isim' => 'Toyota Corolla 1.6 Elegance',
            'plaka' => '34 ABC 123',
            'model_yili' => '2020',
            'motor_no' => 'MTR123456789',
            'sasi_no' => 'SASI987654321',
            'kayit_tarihi' => '12 Ocak 2021',
            'koltuk_sayisi' => '5'
        ],
        [
            'tip' => 'Arac',
            'uzun_isim' => 'Honda Civic 1.5 Turbo',
            'plaka' => '06 CDE 456',
            'model_yili' => '2022',
            'motor_no' => 'MTR567891234',
            'sasi_no' => 'SASI123459876',
            'kayit_tarihi' => '15 Şubat 2022',
            'koltuk_sayisi' => '5'
        ],
        [
            'tip' => 'Konut',
            'uzun_isim' => 'Ev / Apartman - 120 m²',
            'adres' => 'İstanbul, Kadıköy, Moda Mah.',
            'yapim_yili' => '2015',
            'kat' => '3. Kat',
            'oda_sayisi' => '3+1',
            'kayit_tarihi' => '20 Mart 2018'
        ],
        [
            'tip' => 'Konut',
            'uzun_isim' => 'Villa - 250 m²',
            'adres' => 'Antalya, Alanya, Mahmutlar Mah.',
            'yapim_yili' => '2018',
            'kat' => 'Bahçe Katı',
            'oda_sayisi' => '4+1',
            'kayit_tarihi' => '10 Haziran 2019'
        ]
        
    ];

    $html = '<div class="d-flex align-content-center"> <h2 class="text-start mb-4">Varlıklarım</h2> <a href="#" class="text-primary ms-3 mb-4 border-primary shadow mt-3 pb-2 btn btn-light">Varlık Ekle...</a> </div>';
    $html .= '<div class="justify-content-center  row g-4">';

    foreach ($varliklar as $v) {
        $ikon = $v['tip'] === 'Arac' ? '🚗' : '🏠';

        $html .= '<div class="col-md-6 col-lg-5">
                    <div class="card shadow h-100 border-0 rounded-3">
                        <div class="card-body d-flex">
                            <div class="me-3 fs-1">' . $ikon . '</div>
                            <div class="flex-grow-1">';
        
        if ($v['tip'] === 'Arac') {
            $html .= '<h5 class="card-title fw-bold mb-2">' . esc_html($v['uzun_isim']) . '</h5>
                      <p class="mb-1"><strong>Plaka:</strong> ' . esc_html($v['plaka']) . '</p>
                      <p class="mb-1"><strong>Model Yılı:</strong> ' . esc_html($v['model_yili']) . '</p>
                      <p class="mb-1"><strong>Motor No:</strong> ' . esc_html($v['motor_no']) . '</p>
                      <p class="mb-1"><strong>Şasi No:</strong> ' . esc_html($v['sasi_no']) . '</p>
                      <p class="mb-1"><strong>Kayıt Tarihi:</strong> ' . esc_html($v['kayit_tarihi']) . '</p>
                      <p class="mb-1"><strong>Koltuk Sayısı:</strong> ' . esc_html($v['koltuk_sayisi']) . '</p>';
        } else {
            $html .= '<h5 class="card-title fw-bold mb-2">' . esc_html($v['uzun_isim']) . '</h5>
                      <p class="mb-1"><strong>Adres:</strong> ' . esc_html($v['adres']) . '</p>
                      <p class="mb-1"><strong>Yapım Yılı:</strong> ' . esc_html($v['yapim_yili']) . '</p>
                      <p class="mb-1"><strong>Kat:</strong> ' . esc_html($v['kat']) . '</p>
                      <p class="mb-1"><strong>Oda Sayısı:</strong> ' . esc_html($v['oda_sayisi']) . '</p>
                      <p class="mb-1"><strong>Kayıt Tarihi:</strong> ' . esc_html($v['kayit_tarihi']) . '</p>';
        }

        $html .= '       </div>
                        </div>
                    </div>
                  </div>';
    }

    $html .= '</div>'; // row kapanış

    return $html;
}

add_shortcode('varliklarim', 'sigorta_varliklarim_shortcode');

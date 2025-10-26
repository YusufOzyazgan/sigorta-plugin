<?php
if (!defined('ABSPATH'))
    exit;

function payment_callback_shortcode()
{
    ob_start();
    ?>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header bg-primary text-white">
                        <h4 class="mb-0">
                            <i class="fas fa-credit-card me-2"></i>
                            Ödeme İşlemi
                        </h4>
                    </div>
                    <div class="card-body text-center">
                        <div id="paymentStatus">
                            <div class="spinner-border text-primary mb-3" role="status">
                                <span class="visually-hidden">Yükleniyor...</span>
                            </div>
                            <h5>Ödeme işlemi gerçekleştiriliyor...</h5>
                            <p class="text-muted">Lütfen bekleyiniz, ödeme sayfasına yönlendiriliyorsunuz.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // URL parametrelerini al
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('status');
        const message = urlParams.get('message');
        const proposalId = urlParams.get('proposalId');
        const productId = urlParams.get('productId');
        
        // Ödeme sonucunu göster
        showPaymentResult(status, message, proposalId, productId);
    });

    function showPaymentResult(status, message, proposalId, productId) {
        const statusDiv = document.getElementById('paymentStatus');
        
        if (status === 'success') {
            statusDiv.innerHTML = `
                <div class="alert alert-success">
                    <i class="fas fa-check-circle me-3"></i>
                    <div class="d-inline-block">
                        <h4 class="mb-2">🎉 Ödeme Başarılı!</h4>
                        <p class="mb-3">Sigorta poliçeniz başarıyla oluşturuldu.</p>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card bg-light">
                                    <div class="card-body">
                                        <h6 class="card-title">
                                            <i class="fas fa-file-contract text-primary me-2"></i>
                                            Poliçe Bilgileri
                                        </h6>
                                        <p class="card-text small mb-1">
                                            <strong>Teklif ID:</strong> ${proposalId || 'N/A'}
                                        </p>
                                        <p class="card-text small mb-1">
                                            <strong>Ürün ID:</strong> ${productId || 'N/A'}
                                        </p>
                                        <p class="card-text small mb-0">
                                            <strong>Durum:</strong> <span class="badge bg-success">Aktif</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card bg-light">
                                    <div class="card-body">
                                        <h6 class="card-title">
                                            <i class="fas fa-envelope text-primary me-2"></i>
                                            Bildirimler
                                        </h6>
                                        <p class="card-text small mb-1">
                                            Poliçe detayları e-posta adresinize gönderildi.
                                        </p>
                                        <p class="card-text small mb-0">
                                            SMS ile bilgilendirme yapıldı.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-4">
                            <a href="/policelerim/" class="btn btn-primary me-2">
                                <i class="fas fa-list me-1"></i> Poliçelerim
                            </a>
                            <a href="/tekliflerim/" class="btn btn-outline-primary me-2">
                                <i class="fas fa-file-alt me-1"></i> Tekliflerim
                            </a>
                            <a href="/" class="btn btn-outline-secondary">
                                <i class="fas fa-home me-1"></i> Ana Sayfa
                            </a>
                        </div>
                    </div>
                </div>
            `;
        } else if (status === 'error') {
            statusDiv.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-3"></i>
                    <div class="d-inline-block">
                        <h4 class="mb-2">❌ Ödeme Başarısız!</h4>
                        <p class="mb-3">${message || 'Ödeme işlemi tamamlanamadı.'}</p>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card bg-light">
                                    <div class="card-body">
                                        <h6 class="card-title">
                                            <i class="fas fa-info-circle text-warning me-2"></i>
                                            Olası Nedenler
                                        </h6>
                                        <ul class="small mb-0">
                                            <li>Kart bilgileri hatalı</li>
                                            <li>Yetersiz bakiye</li>
                                            <li>Kart limiti aşıldı</li>
                                            <li>Teknik sorun</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card bg-light">
                                    <div class="card-body">
                                        <h6 class="card-title">
                                            <i class="fas fa-phone text-primary me-2"></i>
                                            Destek
                                        </h6>
                                        <p class="card-text small mb-1">
                                            <strong>Müşteri Hizmetleri:</strong><br>
                                            0850 XXX XX XX
                                        </p>
                                        <p class="card-text small mb-0">
                                            <strong>E-posta:</strong><br>
                                            destek@sigorta.com
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-4">
                            <a href="/trafik/" class="btn btn-primary me-2">
                                <i class="fas fa-redo me-1"></i> Tekrar Dene
                            </a>
                            <a href="/tekliflerim/" class="btn btn-outline-primary me-2">
                                <i class="fas fa-file-alt me-1"></i> Tekliflerim
                            </a>
                            <a href="/" class="btn btn-outline-secondary">
                                <i class="fas fa-home me-1"></i> Ana Sayfa
                            </a>
                        </div>
                    </div>
                </div>
            `;
        } else if (status === 'pending') {
            statusDiv.innerHTML = `
                <div class="alert alert-warning">
                    <i class="fas fa-clock me-3"></i>
                    <div class="d-inline-block">
                        <h4 class="mb-2">⏳ Ödeme Beklemede!</h4>
                        <p class="mb-3">Ödeme işleminiz işleniyor, lütfen bekleyiniz.</p>
                        <div class="spinner-border text-warning me-2" role="status">
                            <span class="visually-hidden">Yükleniyor...</span>
                        </div>
                        <span>İşlem tamamlandığında bilgilendirileceksiniz.</span>
                        <div class="mt-3">
                            <a href="/tekliflerim/" class="btn btn-outline-primary me-2">
                                <i class="fas fa-file-alt me-1"></i> Tekliflerim
                            </a>
                            <a href="/" class="btn btn-outline-secondary">
                                <i class="fas fa-home me-1"></i> Ana Sayfa
                            </a>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Bilinmeyen durum
            statusDiv.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-question-circle me-3"></i>
                    <div class="d-inline-block">
                        <h4 class="mb-2">ℹ️ Ödeme Durumu Belirsiz</h4>
                        <p class="mb-3">Ödeme durumunuz kontrol ediliyor...</p>
                        <div class="mt-3">
                            <a href="/tekliflerim/" class="btn btn-primary me-2">
                                <i class="fas fa-file-alt me-1"></i> Tekliflerim
                            </a>
                            <a href="/" class="btn btn-outline-secondary">
                                <i class="fas fa-home me-1"></i> Ana Sayfa
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    </script>
    <?php
    return ob_get_clean();
}
add_shortcode('payment_callback', 'payment_callback_shortcode');

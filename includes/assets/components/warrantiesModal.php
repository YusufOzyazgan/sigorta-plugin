<?php
if (!defined('ABSPATH'))
    exit;

function global_warranties_modal_component()
{
    ob_start();
    ?>
    
    <!-- Global Teminatlar Modal -->
    <div class="modal fade" id="globalWarrantiesModal" tabindex="-1" aria-labelledby="globalWarrantiesModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="globalWarrantiesModalLabel">
                        <i class="fas fa-shield-alt text-primary me-2"></i>
                        Sigorta Teminatları
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div id="warrantiesContent">
                        <div class="text-center">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Yükleniyor...</span>
                            </div>
                            <p class="mt-2 text-muted">Teminatlar yükleniyor...</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
                </div>
            </div>
        </div>
    </div>

    <style>
        .warranty-item {
            border-left: 3px solid #28a745;
            padding-left: 15px;
            margin-bottom: 15px;
            background: #f8f9fa;
            padding: 12px 15px;
            border-radius: 5px;
        }
        
        .warranty-item h6 {
            color: #28a745;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .warranty-item p {
            margin-bottom: 5px;
            color: #6c757d;
        }
        
        .warranty-item .badge {
            font-size: 0.75rem;
        }
        
        .company-info {
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .company-info h5 {
            margin-bottom: 5px;
        }
        
        .company-info .badge {
            background: rgba(255,255,255,0.2);
            color: white;
        }
        
        /* Modal responsive ayarları */
        @media (max-width: 768px) {
            .modal-dialog {
                margin: 0.5rem;
            }
            
            .warranty-item {
                margin-bottom: 10px;
                padding: 10px;
            }
            
            .company-info {
                padding: 12px;
            }
        }
    </style>
    
    <?php
    return ob_get_clean();
}

// Shortcode olarak kaydet
add_shortcode('warranties_modal', 'global_warranties_modal_component');


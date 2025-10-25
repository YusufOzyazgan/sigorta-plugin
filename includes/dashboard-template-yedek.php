<?php
/*
Template Name: Dashboard
*/

if (!defined('ABSPATH'))
	exit;

// Aktif tab
$tab = isset($_GET['tab']) ? sanitize_key($_GET['tab']) : 'dashboard';
$allowed_tabs = ['dashboard', 'bilgilerim', 'varliklarim', 'tekliflerim', 'policelerim'];
if (!in_array($tab, $allowed_tabs, true)) {
	$tab = 'dashboard';
}

// Shortcode map (pages altındaki sayfalara karşılık gelen shortcodlar)
$shortcodes = [
	'bilgilerim' => '[bilgilerim]',
	'varliklarim' => '[varliklarim]',
	'tekliflerim' => '[tekliflerim]',
	'policelerim' => '[policelerim]',
];
?>
<!--  sidebar -->
<div class="dashboard-container">
	<div class="dashboard-sidebar">
		<div class="sidebar-navigation mt-3">
			<a class="nav-item <?php echo $tab === 'dashboard' ? 'active' : ''; ?>"
				href="<?php echo esc_url(add_query_arg('tab', 'dashboard')); ?>">
				<i class="bi bi-signpost-split-fill"></i> <span>Sigorta Piri</span>
			</a>
			<a class="nav-item <?php echo $tab === 'bilgilerim' ? 'active' : ''; ?>"
				href="<?php echo esc_url(add_query_arg('tab', 'bilgilerim')); ?>">
				<i class="bi bi-person"></i><span>Bilgilerim</span>
			</a>
			<a class="nav-item <?php echo $tab === 'varliklarim' ? 'active' : ''; ?>"
				href="<?php echo esc_url(add_query_arg('tab', 'varliklarim')); ?>">
				<i class="bi bi-house-door"></i><span>Varlıklarım</span>
			</a>
			<a class="nav-item <?php echo $tab === 'tekliflerim' ? 'active' : ''; ?>"
				href="<?php echo esc_url(add_query_arg('tab', 'tekliflerim')); ?>">
				<i class="bi bi-file-earmark-text"></i><span>Tekliflerim</span>
			</a>
			<a class="nav-item <?php echo $tab === 'policelerim' ? 'active' : ''; ?>"
				href="<?php echo esc_url(add_query_arg('tab', 'policelerim')); ?>">
				<i class="bi bi-shield-lock"></i><span>Policelerim</span>
			</a>
		</div>

		<div class="dashboard-user-info">
			<div class="user-avatar">
				<?php $current_user = wp_get_current_user();
				if ($current_user->ID)
					echo get_avatar($current_user->ID, 60); ?>
			</div>
			<div class="user-details">
				<h4><?php echo esc_html($current_user->display_name); ?></h4>
				<p><?php echo esc_html($current_user->user_email); ?></p>
			</div>
			<div class="logout-button  d-grid gap-2 ">
				<a class="btn btn-danger d-flex align-items-center justify-content-center gap-2" id="custom-logout">
					<i class="fas fa-sign-out-alt"></i> Çıkış Yap
				</a>
				<a href="<?php echo home_url(); ?>"
					class="btn btn-secondary d-flex align-items-center justify-content-center gap-2 mt-2"><i
						class="bi bi-house-door"></i> Ana Sayfa</a>
			</div>
		</div>
	</div>

	<div class="dashboard-content ">
		<div class="page-content-wrapper ">
			<div class="page-section active">
				<div class="page-content">
					<?php if ($tab === 'dashboard'): ?>
						<div class="welcome-banner text-center mb-5">
							<h2 class="fw-bold">Sigorta Piri sistemine giriş yaptınız</h2>
							<p class="text-muted">Hızlı erişim kartlarından birini seçerek işlemlerinize başlayın.</p>
						</div>

						<div class="row g-4">
							<!-- Bilgilerim -->
							<div class="col-md-7 col-sm-6">
								<a href="<?php echo esc_url(add_query_arg('tab', 'bilgilerim')); ?>"
									class="dashboard-card d-block">
									<div class="card d-flex text-center shadow-sm h-100">
										<div class="card-body py-4">

											<h3 class="card-title">Bilgilerim <i class="bi bi-person"></i></h3>
											<p class="card-text">Hesap ve iletişim bilgilerinizi görüntüleyin.</p>
										</div>
									</div>
								</a>
							</div>

							<!-- Varlıklarım -->
							<div class="col-md-7 ms-auto col-sm-6">
								<a href="<?php echo esc_url(add_query_arg('tab', 'varliklarim')); ?>"
									class="dashboard-card d-block">
									<div class="card d-flex text-center shadow-sm h-100">
										<div class="card-body py-4">


											<h3 class="card-title">Varlıklarım <i class="bi bi-house-door"></i></h3>
											<p class="card-text">Varlıklarınızı yönetin.</p>
										</div>
									</div>
								</a>
							</div>

							<!-- Tekliflerim -->
							<div class="col-md-7 col-sm-6">
								<a href="<?php echo esc_url(add_query_arg('tab', 'tekliflerim')); ?>"
									class="dashboard-card d-block">
									<div class="card d-flex  text-center shadow-sm h-100">
										<div class="card-body py-4">

											<h3 class="card-title">Tekliflerim <i class="bi bi-file-earmark-text"></i></h3>
											<p class="card-text">Tekliflerinizi görüntüleyin ve yönetin.</p>
										</div>
									</div>
								</a>
							</div>

							<!-- Poliçelerim -->
							<div class="col-md-7 ms-auto col-sm-6">
								<a href="<?php echo esc_url(add_query_arg('tab', 'policelerim')); ?>"
									class="dashboard-card d-block">
									<div class="card d-flex text-center shadow-sm h-100">
										<div class="card-body py-4">

											<h3 class="card-title">Poliçelerim <i class="bi bi-shield-lock"></i></h3>
											<p class="card-text">Aktif poliçelerinizi inceleyin.</p>
										</div>
									</div>
								</a>
							</div>
						</div>
					<?php else: ?>
						<?php
						if (isset($shortcodes[$tab])) {
							echo do_shortcode($shortcodes[$tab]);
						} else {
							echo '<div class="alert alert-warning">İçerik bulunamadı.</div>';
						}
						?>
					<?php endif; ?>
				</div>
			</div>
		</div>
	</div>
</div>
<?php
$login_page = get_page_by_title('Login-Register');
$login_url = $login_page ? get_permalink($login_page) : home_url();
?>
<script>

	if (!localStorage.getItem('token')) {
		window.location.href = "<?php echo esc_url($login_url); ?>";
		console.log("Token yok");
	}
	const logoutBtn = document.getElementById('custom-logout');

	document.addEventListener("DOMContentLoaded", function () {

		if (logoutBtn) {
			logoutBtn.addEventListener('click', function () {


				localStorage.removeItem('token');
				
				window.location.href = '<?php echo home_url(); ?>';
			});
		}
	});
</script>
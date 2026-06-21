// GAS Web App URL
const GAS_URL = "PASTE_GAS_WEBAPP_URL_HERE";

// Global State
const STATE = { activeUser: null, activeRole: null, gender: null, charts: [] };

// Master Menu Configuration per Role (STRICT LIST)
const MENU_DATA = {
  "ADMIN": [
    {id: "dashboard", label: "Dashboard", icon: "bi-grid"},
    {id: "guru", label: "Data Guru", icon: "bi-person-video3"},
    {id: "murid", label: "Data Murid", icon: "bi-people"},
    {id: "kelas", label: "Penempatan Kelas", icon: "bi-layout-text-sidebar-reverse"},
    {id: "tahfidz", label: "Tahfidz", icon: "bi-book"},
    {id: "keputrian", label: "Keputrian", icon: "bi-gender-female"},
    {id: "pembinaan", label: "Adab & Pembinaan", icon: "bi-shield-check"},
    {id: "kurban", label: "Tabungan Kurban", icon: "bi-wallet2"},
    {id: "pengumuman", label: "Pengumuman", icon: "bi-megaphone"},
    {id: "dokumen", label: "Dokumen", icon: "bi-folder2-open"},
    {id: "pengaturan", label: "Pengaturan", icon: "bi-gear"},
    {id: "backup", label: "Backup", icon: "bi-database-down"}
  ],
  "KEPSEK": [
    {id: "dashboard", label: "Dashboard", icon: "bi-grid"},
    {id: "tahfidz", label: "Tahfidz", icon: "bi-book"},
    {id: "pembinaan", label: "Adab & Pembinaan", icon: "bi-shield-check"},
    {id: "kurban", label: "Tabungan Kurban", icon: "bi-wallet2"},
    {id: "dokumen", label: "Dokumen", icon: "bi-folder2-open"},
    {id: "pengumuman", label: "Pengumuman", icon: "bi-megaphone"}
  ],
  "GURU": [
    {id: "dashboard", label: "Dashboard", icon: "bi-grid"},
    {id: "tahfidz", label: "Tahfidz", icon: "bi-book"},
    {id: "pembinaan", label: "Adab & Pembinaan", icon: "bi-shield-check"},
    {id: "kurban", label: "Tabungan Kurban", icon: "bi-wallet2"},
    {id: "pengumuman", label: "Pengumuman", icon: "bi-megaphone"}
  ],
  "GURU_TAHFIDZ": [
    {id: "dashboard", label: "Dashboard", icon: "bi-grid"},
    {id: "tahfidz", label: "Tahfidz", icon: "bi-book"},
    {id: "dokumen", label: "Dokumen", icon: "bi-folder2-open"}
  ],
  "AYAH_BUNDA": [
    {id: "dashboard", label: "Dashboard Ananda", icon: "bi-grid"},
    {id: "tahfidz", label: "Tahfidz", icon: "bi-book"},
    {id: "pembinaan", label: "Adab & Pembinaan", icon: "bi-shield-check"},
    {id: "kurban", label: "Tabungan Kurban", icon: "bi-wallet2"},
    {id: "dokumen", label: "Dokumen", icon: "bi-folder2-open"},
    {id: "pengumuman", label: "Pengumuman", icon: "bi-megaphone"}
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  // Clear cache on load if at root purely for simulation safety
  if(window.location.hash === "") localStorage.clear();
  
  // UI Bindings
  document.getElementById("sidebar-toggle")?.addEventListener("click", () => { 
    document.getElementById("main-sidebar").classList.add("mobile-show"); 
    document.getElementById("sidebar-backdrop").classList.remove("d-none"); 
  });
  document.getElementById("sidebar-backdrop")?.addEventListener("click", () => { 
    document.getElementById("main-sidebar").classList.remove("mobile-show"); 
    document.getElementById("sidebar-backdrop").classList.add("d-none"); 
  });

  document.getElementById("login-form")?.addEventListener("submit", (e) => { e.preventDefault(); executeAuth(); });
  document.getElementById("btn-logout-trigger")?.addEventListener("click", () => { localStorage.clear(); checkAuthSession(); });

  window.addEventListener("hashchange", routerEngine);
  checkAuthSession();
});

function executeAuth() {
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value;
  const btn = document.getElementById("btn-login");
  const spinner = document.getElementById("btn-login-spinner");
  const text = document.getElementById("btn-login-text");

  btn.disabled = true; spinner.classList.remove("d-none"); text.textContent = "Verifikasi...";

  setTimeout(() => {
    let auth = false; let data = {};
    if (u === "admin") { auth = true; data = { role: "ADMIN", name: "Renaldi (Admin)", gender: "L" }; }
    else if (u === "kepsek") { auth = true; data = { role: "KEPSEK", name: "Bapak Kepala Sekolah", gender: "L" }; }
    else if (u === "gurutahfidz") { auth = true; data = { role: "GURU_TAHFIDZ", name: "Ustadz Ahmad Fauzi", gender: "L" }; }
    else if (u === "guru") { auth = true; data = { role: "GURU", name: "Ustadzah Fatimah", gender: "Perempuan" }; }
    else if (u === "wali") { auth = true; data = { role: "AYAH_BUNDA", name: "Ayah Abdullah", gender: "L" }; }

    if (auth) {
      localStorage.setItem("iims_token", "dummy-token");
      localStorage.setItem("iims_role", data.role);
      localStorage.setItem("iims_name", data.name);
      localStorage.setItem("iims_gender", data.gender);
      document.getElementById("username").value = ""; 
      document.getElementById("password").value = "";
      checkAuthSession();
    } else {
      alert("Gagal! Gunakan username: admin, kepsek, gurutahfidz, guru, atau wali.");
    }
    
    btn.disabled = false; spinner.classList.add("d-none"); text.textContent = "Masuk";
  }, 600);
}

function checkAuthSession() {
  const token = localStorage.getItem("iims_token");
  const role = localStorage.getItem("iims_role");
  const name = localStorage.getItem("iims_name");
  const gender = localStorage.getItem("iims_gender");

  if (token && role && name) {
    STATE.activeUser = name; STATE.activeRole = role; STATE.gender = gender;
    document.getElementById("login-container").classList.add("d-none");
    document.getElementById("app-container").classList.remove("d-none");
    buildMenu(); routerEngine();
  } else {
    document.getElementById("app-container").classList.add("d-none");
    document.getElementById("login-container").classList.remove("d-none");
    window.location.hash = "";
  }
}

function buildMenu() {
  document.getElementById("user-welcome-text").textContent = `Selamat Datang, ${STATE.activeUser}`;
  document.getElementById("user-role-badge").textContent = STATE.activeRole.replace("_", " ");
  
  const menuContainer = document.getElementById("dynamic-menu");
  menuContainer.innerHTML = "";
  
  let userMenus = MENU_DATA[STATE.activeRole] || [];

  // Jika GURU dan Perempuan, tambahkan menu Keputrian
  if (STATE.activeRole === "GURU" && STATE.gender === "Perempuan") {
    userMenus.splice(2, 0, {id: "keputrian", label: "Keputrian", icon: "bi-gender-female"});
  }

  userMenus.forEach(item => {
    menuContainer.innerHTML += `
      <a href="#/${item.id}" class="nav-link" id="menu-${item.id}">
        <i class="${item.icon}"></i> <span>${item.label}</span>
      </a>`;
  });
}

function routerEngine() {
  const hash = window.location.hash || "#/dashboard";
  const route = hash.replace("#/", "");

  // Reset Charts & UI
  STATE.charts.forEach(c => c.destroy()); STATE.charts = [];
  document.querySelectorAll(".sidebar-menu .nav-link").forEach(el => el.classList.remove("active"));
  document.getElementById(`menu-${route}`)?.classList.add("active");
  document.getElementById("main-sidebar").classList.remove("mobile-show");
  document.getElementById("sidebar-backdrop").classList.add("d-none");

  const view = document.getElementById("main-view-container");

  if (route === "dashboard") {
    if (STATE.activeRole === "ADMIN") view.innerHTML = renderAdminDB();
    else if (STATE.activeRole === "KEPSEK") view.innerHTML = renderKepsekDB();
    else if (STATE.activeRole === "AYAH_BUNDA") view.innerHTML = renderWaliDB();
    else view.innerHTML = renderGuruDB();
    renderCharts(STATE.activeRole);
  } else {
    view.innerHTML = `
      <div class="card-enterprise text-center py-5">
        <i class="bi bi-tools fs-1 text-muted mb-3"></i>
        <h5>Modul ${route.toUpperCase()} sedang dalam tahap pengembangan</h5>
      </div>`;
  }
}

// ================= RENDER HTML VIEW (DASHBOARD) =================
function renderAdminDB() {
  return `
    <div class="row">
      <div class="col-12 col-md-4 col-lg-2 mb-3"><div class="card-metric"><div class="metric-title">Total Murid</div><div class="metric-value text-primary">324</div></div></div>
      <div class="col-12 col-md-4 col-lg-2 mb-3"><div class="card-metric"><div class="metric-title">Total Guru</div><div class="metric-value text-success">28</div></div></div>
      <div class="col-12 col-md-4 col-lg-2 mb-3"><div class="card-metric"><div class="metric-title">Total Setoran</div><div class="metric-value text-info">1.250</div></div></div>
      <div class="col-12 col-md-4 col-lg-2 mb-3"><div class="card-metric"><div class="metric-title">Surah Selesai</div><div class="metric-value text-warning">840</div></div></div>
      <div class="col-12 col-md-4 col-lg-2 mb-3"><div class="card-metric"><div class="metric-title">Berhalangan</div><div class="metric-value text-danger">12</div></div></div>
      <div class="col-12 col-md-4 col-lg-2 mb-3"><div class="card-metric"><div class="metric-title">Pembinaan</div><div class="metric-value text-secondary">5</div></div></div>
    </div>
    <div class="row">
      <div class="col-12 col-lg-8">
        <div class="card-enterprise h-100">
          <div class="card-title-enterprise"><i class="bi bi-graph-up text-primary me-2"></i> Grafik Perkembangan Tahfidz</div>
          <canvas id="chart-tahfidz"></canvas>
        </div>
      </div>
      <div class="col-12 col-lg-4">
        <div class="card-enterprise h-100">
          <div class="card-title-enterprise"><i class="bi bi-activity text-success me-2"></i> Aktivitas Terbaru</div>
          <ul class="list-group list-group-flush fs-7">
            <li class="list-group-item px-0">Setoran baru dari <strong>Ahmad</strong> (Al-Mulk)</li>
            <li class="list-group-item px-0">Pembayaran Kurban <strong>Rp 500rb</strong> via Transfer</li>
            <li class="list-group-item px-0">Laporan keputrian Kelas 9 diperbarui</li>
          </ul>
        </div>
      </div>
    </div>`;
}

function renderKepsekDB() {
  return `
    <div class="row">
      <div class="col-12 col-md-4 mb-3"><div class="card-metric"><div class="metric-title">KPI Tahfidz</div><div class="metric-value text-success">92%</div></div></div>
      <div class="col-12 col-md-4 mb-3"><div class="card-metric"><div class="metric-title">Total Kurban Terkumpul</div><div class="metric-value text-primary">Rp 45.000.000</div></div></div>
      <div class="col-12 col-md-4 mb-3"><div class="card-metric"><div class="metric-title">Pelanggaran Adab</div><div class="metric-value text-danger">3 Kasus</div></div></div>
    </div>
    <div class="card-enterprise">
      <div class="card-title-enterprise">Ranking Tahfidz (Top 5)</div>
      <div class="table-responsive">
        <table class="table table-bordered fs-7">
          <thead class="table-light"><tr><th>Nama</th><th>Kelas</th><th>Capaian Hafalan</th></tr></thead>
          <tbody>
            <tr><td>M. Abdullah</td><td>9-A</td><td>5 Juz, 12 Surah</td></tr>
            <tr><td>Aisyah</td><td>8-B</td><td>4 Juz, 10 Surah</td></tr>
          </tbody>
        </table>
      </div>
    </div>`;
}

function renderGuruDB() {
  return `
    <div class="row">
      <div class="col-12 col-md-4 mb-3"><div class="card-metric"><div class="metric-title">Murid Binaan</div><div class="metric-value text-primary">32 Anak</div></div></div>
      <div class="col-12 col-md-4 mb-3"><div class="card-metric"><div class="metric-title">Setoran Minggu Ini</div><div class="metric-value text-success">28 Setoran</div></div></div>
      <div class="col-12 col-md-4 mb-3"><div class="card-metric"><div class="metric-title">Catatan Pembinaan</div><div class="metric-value text-warning">2 Catatan</div></div></div>
    </div>
    <div class="card-enterprise">
      <div class="card-title-enterprise">Monitoring Kelas Binaan</div>
      <div class="table-responsive">
        <table class="table table-striped fs-7">
          <thead><tr><th>Nama Murid</th><th>Surah Aktif</th><th>Ayat Terakhir</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>Zaid</td><td>Al-Waqi'ah</td><td>Ayat 40</td><td><span class="badge bg-success">Lancar</span></td></tr>
            <tr><td>Fatimah</td><td>Ar-Rahman</td><td>Ayat 12</td><td><span class="badge bg-warning text-dark">Mengulang</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>`;
}

function renderWaliDB() {
  return `
    <div class="row">
      <div class="col-12 col-md-6 mb-3">
        <div class="card-enterprise h-100">
          <div class="card-title-enterprise text-primary">Profil Hafalan Ananda</div>
          <table class="table table-borderless table-sm fs-7">
            <tr><td class="text-muted w-50">Nama</td><td class="fw-bold">: Raihan Alvaro</td></tr>
            <tr><td class="text-muted">Kelas</td><td>: 8-A</td></tr>
            <tr><td class="text-muted">Surah Aktif</td><td>: <span class="badge bg-primary">Al-Mulk (Ayat 15)</span></td></tr>
            <tr><td class="text-muted">Total Selesai</td><td>: 14 Surah</td></tr>
            <tr><td class="text-muted">Predikat</td><td>: Mumtaz</td></tr>
          </table>
          <div class="mt-3"><canvas id="chart-wali"></canvas></div>
        </div>
      </div>
      <div class="col-12 col-md-6 mb-3">
        <div class="card-enterprise h-100">
          <div class="card-title-enterprise text-success">Tabungan Kurban</div>
          <div class="d-flex justify-content-between fs-7 mb-1"><span class="text-muted">Target: Rp 3.500.000</span><span class="fw-bold text-success">71% Lunas</span></div>
          <div class="progress mb-3" style="height: 10px;"><div class="progress-bar bg-success" style="width: 71%"></div></div>
          <p class="fs-7 m-0">Sudah Dibayar: <strong>Rp 2.500.000</strong></p>
          <p class="fs-7 m-0">Sisa Tagihan: <strong class="text-danger">Rp 1.000.000</strong></p>
          <hr>
          <div class="card-title-enterprise text-warning fs-6 border-0 pb-0 mt-3">Riwayat Pembinaan</div>
          <div class="alert alert-light border fs-7 p-2 m-0"><i class="bi bi-star-fill text-warning"></i> Membantu merapikan masjid (+ Poin Adab)</div>
        </div>
      </div>
    </div>`;
}

function renderCharts(role) {
  setTimeout(() => {
    if (role === "ADMIN") {
      const ctx = document.getElementById('chart-tahfidz');
      if (ctx) STATE.charts.push(new Chart(ctx, { type: 'bar', data: { labels: ['Kelas 7', 'Kelas 8', 'Kelas 9'], datasets: [{ label: 'Rata-rata Juz Selesai', data: [1.2, 2.5, 4.1], backgroundColor: '#0A3663' }] }, options: { responsive: true, plugins: { legend: { display: false } } } }));
    }
    if (role === "AYAH_BUNDA") {
      const ctx2 = document.getElementById('chart-wali');
      if (ctx2) STATE.charts.push(new Chart(ctx2, { type: 'line', data: { labels: ['Jul', 'Ags', 'Sep', 'Okt'], datasets: [{ label: 'Progress Hafalan (Baris)', data: [10, 25, 45, 60], borderColor: '#D4AF37', fill: false }] }, options: { responsive: true } }));
    }
  }, 100);
}

// CENTRALIZED API CONNECTION ENDPOINT
const GAS_URL = "PASTE_GAS_WEBAPP_URL_HERE";

const STATE = {
  activeUser: null,
  activeRole: null,
  academicYear: "2026/2027",
  semester: "Ganjil",
  activeCharts: []
};

document.addEventListener("DOMContentLoaded", () => {
  initSystemCore();
});

function initSystemCore() {
  const toggleBtn = document.getElementById("sidebar-toggle");
  const sidebar = document.getElementById("main-sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");

  if (toggleBtn) toggleBtn.addEventListener("click", () => { sidebar.classList.add("mobile-show"); backdrop.classList.remove("d-none"); });
  if (backdrop) backdrop.addEventListener("click", () => { sidebar.classList.remove("mobile-show"); backdrop.classList.add("d-none"); });

  const loginForm = document.getElementById("login-form");
  if (loginForm) loginForm.addEventListener("submit", (e) => { e.preventDefault(); executeAuth(); });

  const logoutBtn = document.getElementById("btn-logout-trigger");
  if (logoutBtn) logoutBtn.addEventListener("click", executeLogout);

  window.addEventListener("hashchange", routerEngine);
  checkAuthSession();
}

function checkAuthSession() {
  const token = localStorage.getItem("iims_token");
  const role = localStorage.getItem("iims_role");
  const name = localStorage.getItem("iims_name");

  if (token && role && name) {
    STATE.activeUser = name; STATE.activeRole = role;
    document.getElementById("login-container").classList.add("d-none");
    document.getElementById("app-container").classList.remove("d-none");
    syncUI(); routerEngine();
  } else {
    document.getElementById("app-container").classList.add("d-none");
    document.getElementById("login-container").classList.remove("d-none");
    window.location.hash = "";
  }
}

function executeAuth() {
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value;
  const btnText = document.getElementById("btn-login-text");
  
  btnText.textContent = "Verifikasi...";
  document.getElementById("btn-login-spinner").classList.remove("d-none");
  document.getElementById("btn-login").disabled = true;

  setTimeout(() => {
    let auth = false; let data = {};
    if (u === "admin" && p === "Admin@IIMS2026") { auth = true; data = { token: "T1", role: "ADMIN", name: "Renaldi (Super Admin)" }; }
    else if (u === "kepsek") { auth = true; data = { token: "T2", role: "KEPSEK", name: "Drs. H. Syuhada, M.Pd" }; }
    else if (u === "gurutahfidz") { auth = true; data = { token: "T3", role: "GURU_TAHFIDZ", name: "Ust. Ahmad Fauzi" }; }
    else if (u === "guru") { auth = true; data = { token: "T4", role: "GURU", name: "Ustadzah Fatimah", gender: "Perempuan" }; }
    else if (u === "wali") { auth = true; data = { token: "T5", role: "AYAH_BUNDA", name: "Ayah Abdullah" }; }

    if (auth) {
      localStorage.setItem("iims_token", data.token); localStorage.setItem("iims_role", data.role);
      localStorage.setItem("iims_name", data.name); if(data.gender) localStorage.setItem("iims_gender", data.gender);
      document.getElementById("username").value = ""; document.getElementById("password").value = "";
      checkAuthSession();
    } else {
      alert("Otentikasi Gagal. Periksa Username/Password.");
    }
    btnText.textContent = "Masuk";
    document.getElementById("btn-login-spinner").classList.add("d-none");
    document.getElementById("btn-login").disabled = false;
  }, 800);
}

function executeLogout() { localStorage.clear(); checkAuthSession(); }

function syncUI() {
  document.getElementById("user-welcome-text").textContent = `Selamat Datang, ${STATE.activeUser}`;
  document.getElementById("user-role-badge").textContent = STATE.activeRole.replace("_", " ");
  renderDynamicMenu();
}

function renderDynamicMenu() {
  const c = document.getElementById("dynamic-menu");
  c.innerHTML = "";
  const role = STATE.activeRole;
  const gender = localStorage.getItem("iims_gender") || "Laki-laki";

  // Menu Configuration with 'space' dividers for Enterprise grouping
  const menuConfig = [
    { id: "dashboard", label: "Dashboard Utama", icon: "bi-grid-1x2", roles: ["ADMIN", "KEPSEK", "GURU", "GURU_TAHFIDZ"] },
    { id: "dashboard-ananda", label: "Monitoring Ananda", icon: "bi-person-badge", roles: ["AYAH_BUNDA"] },
    { space: true, roles: ["ADMIN"] },
    { id: "guru", label: "Data Guru", icon: "bi-person-video3", roles: ["ADMIN"] },
    { id: "murid", label: "Data Murid", icon: "bi-people", roles: ["ADMIN"] },
    { id: "kelas", label: "Penempatan Kelas", icon: "bi-door-open", roles: ["ADMIN"] },
    { space: true, roles: ["ADMIN", "KEPSEK", "GURU", "GURU_TAHFIDZ", "AYAH_BUNDA"] },
    { id: "tahfidz", label: "Tahfidz Core", icon: "bi-journal-check", roles: ["ADMIN", "KEPSEK", "GURU_TAHFIDZ", "GURU", "AYAH_BUNDA"] },
    { space: true, roles: ["ADMIN", "KEPSEK", "GURU", "AYAH_BUNDA"] },
    { id: "keputrian", label: "Data Keputrian", icon: "bi-gender-female", roles: ["ADMIN", "GURU"], cond: () => role === "ADMIN" || (role === "GURU" && gender === "Perempuan") },
    { id: "pembinaan", label: "Adab & Pembinaan", icon: "bi-shield-check", roles: ["ADMIN", "KEPSEK", "GURU", "AYAH_BUNDA"] },
    { space: true, roles: ["ADMIN", "KEPSEK", "GURU", "AYAH_BUNDA"] },
    { id: "kurban", label: "Tabungan Kurban", icon: "bi-wallet2", roles: ["ADMIN", "KEPSEK", "GURU", "AYAH_BUNDA"] },
    { id: "dokumen", label: "Dokumen Center", icon: "bi-folder2-open", roles: ["ADMIN", "KEPSEK", "GURU_TAHFIDZ", "AYAH_BUNDA"] },
    { id: "pengumuman", label: "Pengumuman", icon: "bi-megaphone", roles: ["ADMIN", "KEPSEK", "GURU", "AYAH_BUNDA"] },
    { space: true, roles: ["ADMIN"] },
    { id: "pengaturan", label: "Pengaturan", icon: "bi-sliders", roles: ["ADMIN"] },
    { id: "backup", label: "Database Backup", icon: "bi-database-down", roles: ["ADMIN"] }
  ];

  menuConfig.forEach(item => {
    if (item.roles.includes(role)) {
      if (item.cond && !item.cond()) return;
      if (item.space) {
        c.innerHTML += `<div class="sidebar-divider"></div>`;
      } else {
        c.innerHTML += `<a href="#/${item.id}" class="nav-link" id="menu-link-${item.id}"><i class="${item.icon}"></i> <span>${item.label}</span></a>`;
      }
    }
  });
}

function routerEngine() {
  const hash = window.location.hash || "#/dashboard";
  let route = hash.replace("#/", "");
  if(STATE.activeRole === "AYAH_BUNDA" && route === "dashboard") route = "dashboard-ananda";

  STATE.activeCharts.forEach(c => c.destroy()); STATE.activeCharts = [];
  document.querySelectorAll("#dynamic-menu .nav-link").forEach(l => l.classList.remove("active"));
  const aLink = document.getElementById(`menu-link-${route}`);
  if (aLink) aLink.classList.add("active");

  const v = document.getElementById("main-view-container");
  document.getElementById("main-sidebar").classList.remove("mobile-show");
  document.getElementById("sidebar-backdrop").classList.add("d-none");

  switch(route) {
    case "dashboard":
      if(STATE.activeRole === "ADMIN") v.innerHTML = viewDashboardAdmin();
      else if(STATE.activeRole === "KEPSEK") v.innerHTML = viewDashboardKepsek();
      else v.innerHTML = viewDashboardGuru();
      initCharts(STATE.activeRole);
      break;
    case "dashboard-ananda":
      v.innerHTML = viewDashboardWali();
      initCharts("AYAH_BUNDA");
      break;
    default:
      v.innerHTML = `<div class="card-enterprise text-center py-5"><i class="bi bi-tools fs-1 text-muted mb-3"></i><h5>Modul ${route} (Tahap Pengembangan)</h5></div>`;
      break;
  }
}

// VISUAL VIEWS (Modern Enterprise Minimalist)
function viewDashboardAdmin() {
  return `
    <div class="row">
      <div class="col-12 col-sm-6 col-xl-3 mb-4"><div class="iims-card-widget"><div><div class="widget-metric-number">324</div><div class="widget-metric-label">Total Murid</div></div><div class="widget-icon-box bg-primary-subtle text-primary"><i class="bi bi-people"></i></div></div></div>
      <div class="col-12 col-sm-6 col-xl-3 mb-4"><div class="iims-card-widget"><div><div class="widget-metric-number">28</div><div class="widget-metric-label">Total Guru</div></div><div class="widget-icon-box bg-success-subtle text-success"><i class="bi bi-person-video3"></i></div></div></div>
      <div class="col-12 col-sm-6 col-xl-3 mb-4"><div class="iims-card-widget"><div><div class="widget-metric-number">1,420</div><div class="widget-metric-label">Total Surah Selesai</div></div><div class="widget-icon-box bg-warning-subtle text-warning"><i class="bi bi-journal-check"></i></div></div></div>
      <div class="col-12 col-sm-6 col-xl-3 mb-4"><div class="iims-card-widget"><div><div class="widget-metric-number">12</div><div class="widget-metric-label">Pembinaan Tinggi</div></div><div class="widget-icon-box bg-danger-subtle text-danger"><i class="bi bi-shield-exclamation"></i></div></div></div>
    </div>
    <div class="row">
      <div class="col-12 col-lg-8 mb-4">
        <div class="card-enterprise h-100">
          <div class="card-title-enterprise"><i class="bi bi-bar-chart-fill text-primary"></i> Capaian Juz per Kelas (Rata-rata)</div>
          <canvas id="chart-admin-bar" style="max-height: 280px;"></canvas>
        </div>
      </div>
      <div class="col-12 col-lg-4 mb-4">
        <div class="card-enterprise h-100">
          <div class="card-title-enterprise text-danger"><i class="bi bi-droplet-fill"></i> Siswi Haid (Pekan Ini)</div>
          <div class="fs-8 text-muted mb-2">Terupdate berdasarkan laporan guru keputrian.</div>
          <ul class="list-group list-group-flush fs-7 mb-3 border-top">
            <li class="list-group-item px-0 d-flex justify-content-between align-items-center">Aisyah Humaira <span class="badge bg-light text-dark border">Kelas 7-A</span></li>
            <li class="list-group-item px-0 d-flex justify-content-between align-items-center">Zahra Nabila <span class="badge bg-light text-dark border">Kelas 8-B</span></li>
            <li class="list-group-item px-0 d-flex justify-content-between align-items-center">Fatimah Az-Zahra <span class="badge bg-light text-dark border">Kelas 9-A</span></li>
          </ul>
          <button class="btn btn-sm btn-outline-danger w-100 mt-auto" onclick="showHaidModal()">Lihat Semua (12 Siswi)</button>
        </div>
      </div>
    </div>`;
}

function viewDashboardKepsek() {
  return `
    <div class="row">
      <div class="col-12 col-md-4 mb-4"><div class="iims-card-widget"><div><div class="widget-metric-number">92%</div><div class="widget-metric-label">KPI Target Tahfidz</div></div><div class="widget-icon-box bg-success-subtle text-success"><i class="bi bi-graph-up"></i></div></div></div>
      <div class="col-12 col-md-4 mb-4"><div class="iims-card-widget"><div><div class="widget-metric-number">Rp 45M</div><div class="widget-metric-label">Kurban Terkumpul</div></div><div class="widget-icon-box bg-primary-subtle text-primary"><i class="bi bi-wallet2"></i></div></div></div>
      <div class="col-12 col-md-4 mb-4"><div class="iims-card-widget"><div><div class="widget-metric-number">4</div><div class="widget-metric-label">Menunggu Validasi</div></div><div class="widget-icon-box bg-warning-subtle text-warning"><i class="bi bi-file-earmark-check"></i></div></div></div>
    </div>
    <div class="row">
      <div class="col-12 mb-4">
        <div class="card-enterprise">
          <div class="card-title-enterprise"><i class="bi bi-bar-chart-fill text-primary"></i> Monitoring Capaian Surah per Kelas</div>
          <p class="fs-8 text-muted mb-3">Catatan: Setoran hafalan dilaporkan dan divalidasi oleh sistem setiap hari <strong>Jumat</strong>.</p>
          <canvas id="chart-kepsek-bar" style="max-height: 250px;"></canvas>
        </div>
      </div>
    </div>`;
}

function viewDashboardGuru() {
  return `
    <div class="row">
      <div class="col-12 col-md-4 mb-4"><div class="iims-card-widget"><div><div class="widget-metric-number">32</div><div class="widget-metric-label">Murid Binaan</div></div><div class="widget-icon-box bg-primary-subtle text-primary"><i class="bi bi-people"></i></div></div></div>
      <div class="col-12 col-md-4 mb-4"><div class="iims-card-widget"><div><div class="widget-metric-number">28</div><div class="widget-metric-label">Setor Pekan Ini</div></div><div class="widget-icon-box bg-success-subtle text-success"><i class="bi bi-check2-circle"></i></div></div></div>
      <div class="col-12 col-md-4 mb-4"><div class="iims-card-widget"><div><div class="widget-metric-number">5</div><div class="widget-metric-label">Catatan Pembinaan</div></div><div class="widget-icon-box bg-danger-subtle text-danger"><i class="bi bi-shield-exclamation"></i></div></div></div>
    </div>
    <div class="card-enterprise">
      <div class="card-title-enterprise"><i class="bi bi-display text-primary"></i> Monitoring Halaqah Kelas Binaan</div>
      <div class="table-responsive mt-2">
        <table class="table table-enterprise align-middle">
          <thead><tr><th>Nama Murid</th><th>Surah Aktif</th><th>Ayat Terakhir</th><th>Status Setoran (Jumat)</th></tr></thead>
          <tbody>
            <tr><td class="fw-medium">Muhammad Abdullah</td><td>Al-Kahf</td><td>Ayat 10</td><td><span class="badge bg-success-subtle text-success border border-success-subtle px-2">Sudah Setor</span></td></tr>
            <tr><td class="fw-medium">Aisyah Humaira</td><td>An-Naba'</td><td>Ayat 20</td><td><span class="badge bg-success-subtle text-success border border-success-subtle px-2">Sudah Setor</span></td></tr>
            <tr><td class="fw-medium">Zaid Ramadhan</td><td>—</td><td>—</td><td><span class="badge bg-danger-subtle text-danger border border-danger-subtle px-2">Belum Setor</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>`;
}

function viewDashboardWali() {
  return `
    <div class="row">
      <div class="col-12 col-md-6 mb-4">
        <div class="card-enterprise h-100">
          <div class="card-title-enterprise text-primary"><i class="bi bi-person-vcard"></i> Profil Monitoring Ananda</div>
          <table class="table table-sm table-borderless fs-7 mt-2 mb-0">
            <tr><td width="40%" class="text-muted">Nama Lengkap</td><td class="fw-bold text-dark">: Raihan Alvaro</td></tr>
            <tr><td class="text-muted">Kelas / Halaqah</td><td class="text-dark">: VIII-A / Ust. Ahmad Fauzi</td></tr>
            <tr><td class="text-muted">Surah Aktif</td><td>: <span class="badge bg-primary px-2">Al-Mulk (Ayat 15)</span></td></tr>
            <tr><td class="text-muted">Total Surah Selesai</td><td class="text-dark">: 14 Surah</td></tr>
            <tr><td class="text-muted">Predikat Terakhir</td><td class="text-dark">: <span class="badge bg-success-subtle text-success px-2">Mumtaz</span></td></tr>
          </table>
          <div class="fs-8 text-muted mt-3 border-top pt-2"><i class="bi bi-info-circle"></i> Info: Setoran diupdate setiap hari Jumat.</div>
        </div>
      </div>
      <div class="col-12 col-md-6 mb-4">
        <div class="card-enterprise h-100">
          <div class="card-title-enterprise text-success"><i class="bi bi-wallet2"></i> Tabungan Kurban Ananda</div>
          <div class="d-flex justify-content-between fs-7 mb-1"><span class="text-muted">Target: Rp 3.500.000</span><span class="fw-bold text-success">71% Lunas</span></div>
          <div class="progress mb-3" style="height: 8px;"><div class="progress-bar bg-success" style="width: 71%"></div></div>
          <div class="row text-center mt-3 fs-7 border-top pt-3">
            <div class="col-6 border-end"><div class="text-muted mb-1">Sudah Dibayar</div><strong class="text-success fs-6">Rp 2.500.000</strong></div>
            <div class="col-6"><div class="text-muted mb-1">Sisa Tagihan</div><strong class="text-danger fs-6">Rp 1.000.000</strong></div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 mb-4">
        <div class="card-enterprise">
          <div class="card-title-enterprise text-warning"><i class="bi bi-shield-check"></i> Riwayat Pembinaan & Adab Terakhir</div>
          <div class="alert alert-light border fs-7 py-2 px-3 mb-2"><i class="bi bi-heart-fill text-success me-2"></i>Membantu merapikan mushaf Al-Quran di Masjid (+Poin Adab)</div>
          <div class="alert alert-light border fs-7 py-2 px-3 mb-0"><i class="bi bi-exclamation-circle-fill text-warning me-2"></i>Terlambat masuk halaqah pagi (-5 Poin)</div>
        </div>
      </div>
    </div>`;
}

// MODAL CONTROLLERS
function showHaidModal() {
  document.getElementById("modal-global-title").innerHTML = `<i class="bi bi-droplet-fill text-danger"></i> Daftar Siswi Berhalangan (Haid)`;
  document.getElementById("modal-global-body").innerHTML = `
    <div class="table-responsive">
      <table class="table table-sm table-enterprise">
        <thead><tr><th>Nama Siswi</th><th>Kelas</th><th>Tanggal Lapor</th></tr></thead>
        <tbody>
          <tr><td>Aisyah Humaira</td><td>7-A</td><td>18/06/2026</td></tr>
          <tr><td>Zahra Nabila</td><td>8-B</td><td>19/06/2026</td></tr>
          <tr><td>Fatimah Az-Zahra</td><td>9-A</td><td>20/06/2026</td></tr>
          <tr><td>Khadijah</td><td>9-C</td><td>21/06/2026</td></tr>
        </tbody>
      </table>
    </div>
    <div class="text-end mt-2"><button class="btn btn-sm btn-secondary" data-bs-dismiss="modal">Tutup</button></div>
  `;
  new bootstrap.Modal(document.getElementById('iims-standard-modal')).show();
}

// CHART ENGINE (Only Bar/Doughnut based on Feedback)
function initCharts(role) {
  setTimeout(() => {
    if (role === "ADMIN") {
      const ctx1 = document.getElementById('chart-admin-bar');
      if (ctx1) {
        const c1 = new Chart(ctx1, {
          type: 'bar',
          data: {
            labels: ['Kelas 7', 'Kelas 8', 'Kelas 9'],
            datasets: [{ label: 'Rata-rata Capaian Juz', data: [1.2, 2.5, 4.1], backgroundColor: '#0A3663', borderRadius: 4 }]
          },
          options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
        });
        STATE.activeCharts.push(c1);
      }
    } else if (role === "KEPSEK") {
      const ctx2 = document.getElementById('chart-kepsek-bar');
      if (ctx2) {
        const c2 = new Chart(ctx2, {
          type: 'bar',
          data: {
            labels: ['7-A', '7-B', '8-A', '8-B', '9-A', '9-B'],
            datasets: [{ label: 'Total Surah Selesai', data: [85, 78, 120, 115, 180, 175], backgroundColor: '#D4AF37', borderRadius: 4 }]
          },
          options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
        });
        STATE.activeCharts.push(c2);
      }
    }
  }, 100);
}

/**
 * ============================================================================
 * IIMS v1.0 CORE APPLICATION JS ENGINE (SPA ARCHITECTURE)
 * Architect: Renaldi (Senior Frontend Architect)
 * Release Year: 2026
 * ============================================================================
 */

// CENTRALIZED API CONNECTION ENDPOINT
const GAS_URL = "PASTE_GAS_WEBAPP_URL_HERE";

// GLOBAL STATE DATA CONTEXT
const STATE = {
  activeUser: null,
  activeRole: null,
  academicYear: "2026/2027",
  semester: "Ganjil",
  activeCharts: []
};

// COMPONENT INITIALIZATION WHEN SYSTEM LOADS
document.addEventListener("DOMContentLoaded", () => {
  initSystemCore();
});

function initSystemCore() {
  setupGlobalDOMEvents();
  checkAuthenticationSession();
}

function setupGlobalDOMEvents() {
  // Toggle Sidebar Event Handler
  const toggleBtn = document.getElementById("sidebar-toggle");
  const sidebar = document.getElementById("main-sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("mobile-show");
      backdrop.classList.toggle("d-none");
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", () => {
      sidebar.classList.remove("mobile-show");
      backdrop.classList.add("d-none");
    });
  }

  // Interseptor Form Login
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      executeAuthenticationAction();
    });
  }

  // Trigger Action Logout
  const logoutBtn = document.getElementById("btn-logout-trigger");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      executeTerminationSession();
    });
  }

  // Listener Routing Hash Hash-SPA
  window.addEventListener("hashchange", routerEngine);
}

// ============================================================================
// SYSTEM SESSION AUTHENTICATION CORE ENGINE
// ============================================================================
function checkAuthenticationSession() {
  const token = localStorage.getItem("iims_token");
  const role = localStorage.getItem("iims_role");
  const name = localStorage.getItem("iims_name");

  if (token && role && name) {
    STATE.activeUser = name;
    STATE.activeRole = role;
    
    document.getElementById("login-container").classList.add("d-none");
    document.getElementById("app-container").classList.remove("d-none");
    
    syncShellUserInterfaceElements();
    routerEngine();
  } else {
    document.getElementById("app-container").classList.add("d-none");
    document.getElementById("login-container").classList.remove("d-none");
    window.location.hash = "";
  }
}

function executeAuthenticationAction() {
  const userField = document.getElementById("username").value.trim();
  const passField = document.getElementById("password").value;
  
  const btnText = document.getElementById("btn-login-text");
  const btnSpinner = document.getElementById("btn-login-spinner");
  const loginBtn = document.getElementById("btn-login");

  // Visual Processing Baseline State Trigger
  btnText.textContent = "Memverifikasi akun...";
  btnSpinner.classList.remove("d-none");
  loginBtn.disabled = true;

  // SPREADSHEET BACKEND API CONTRACT EMULATION
  setTimeout(() => {
    // Validasi Skenario Dummy Berdasarkan Aturan Bisnis Fondasi (Semua Role Dipenuhi)
    let authenticated = false;
    let userData = {};

    if (userField === "admin" && passField === "Admin@IIMS2026") {
      authenticated = true;
      userData = { token: "T-ADM-098231", role: "ADMIN", name: "Renaldi (Super Admin)" };
    } else if (userField === "kepsek") {
      authenticated = true;
      userData = { token: "T-KPS-881232", role: "KEPSEK", name: "Drs. H. Syuhada, M.Pd" };
    } else if (userField === "gurutahfidz") {
      authenticated = true;
      userData = { token: "T-GTF-112343", role: "GURU_TAHFIDZ", name: "Ustadz Ahmad Fauzi, S.Th.I" };
    } else if (userField === "guru") {
      authenticated = true;
      userData = { token: "T-GRU-774321", role: "GURU", name: "Ustadzah Fatimah, S.Pd", gender: "Perempuan" };
    } else if (userField === "wali") {
      authenticated = true;
      userData = { token: "T-ABN-449012", role: "AYAH_BUNDA", name: "Ayah/Bunda Abdullah" };
    }

    if (authenticated) {
      localStorage.setItem("iims_token", userData.token);
      localStorage.setItem("iims_role", userData.role);
      localStorage.setItem("iims_name", userData.name);
      if(userData.gender) localStorage.setItem("iims_gender", userData.gender);

      showNotificationToast("Otentikasi berhasil! Menyiapkan dashboard...", "success");
      
      // Mengosongkan form login
      document.getElementById("username").value = "";
      document.getElementById("password").value = "";

      setTimeout(() => {
        checkAuthenticationSession();
      }, 800);
    } else {
      showNotificationToast("Kombinasi Username atau Password salah.", "danger");
    }

    // Reset Form Input State
    btnText.textContent = "MASUK";
    btnSpinner.classList.add("d-none");
    loginBtn.disabled = false;
  }, 1200);
}

function executeTerminationSession() {
  localStorage.clear();
  STATE.activeUser = null;
  STATE.activeRole = null;
  showNotificationToast("Sesi berhasil diakhiri.", "success");
  window.location.hash = "";
  checkAuthenticationSession();
}

function syncShellUserInterfaceElements() {
  document.getElementById("user-welcome-text").textContent = `Selamat Datang, ${STATE.activeUser}`;
  document.getElementById("user-role-badge").textContent = STATE.activeRole.replace("_", " ");
  document.getElementById("academic-year-text").textContent = `Tahun Ajaran: ${STATE.academicYear} | Semester: ${STATE.semester}`;
  document.getElementById("profile-name").textContent = STATE.activeUser;
  document.getElementById("profile-role").textContent = STATE.activeRole;
  document.getElementById("announcement-ticker-content").innerHTML = `📢 Pengumuman: Munaqasyah Tahfidz Akbar Gelombang I Tingkat SMP Islam Al Azhar 52 Bengkulu dilaksanakan serentak mulai tanggal 15 Februari 2027.`;
  
  renderDynamicSidebarMenu();
}

// ============================================================================
// ENGINE PERMISSION MATRIX & MENU SIDEBAR DINAMIS
// ============================================================================
function renderDynamicSidebarMenu() {
  const menuContainer = document.getElementById("dynamic-menu");
  if (!menuContainer) return;
  menuContainer.innerHTML = "";

  const role = STATE.activeRole;
  const gender = localStorage.getItem("iims_gender") || "Laki-laki";
  
  // Kamus Skema Menu Navigasi Lengkap
  const menuConfig = [
    { id: "dashboard", label: "Dashboard", icon: "bi-grid-1x2-fill", roles: ["ADMIN", "KEPSEK", "GURU", "GURU_TAHFIDZ"] },
    { id: "dashboard-ananda", label: "Dashboard Ananda", icon: "bi-person-badge-fill", roles: ["AYAH_BUNDA"] },
    { id: "guru", label: "Data Guru", icon: "bi-person-video3", roles: ["ADMIN"] },
    { id: "murid", label: "Data Murid", icon: "bi-people-fill", roles: ["ADMIN"] },
    { id: "kelas", label: "Penempatan Kelas", icon: "bi-door-open-fill", roles: ["ADMIN"] },
    { id: "tahfidz", label: "Tahfidz Core", icon: "bi-journal-check", roles: ["ADMIN", "KEPSEK", "GURU_TAHFIDZ", "GURU", "AYAH_BUNDA"] },
    { id: "keputrian", label: "Keputrian", icon: "bi-gender-female", roles: ["ADMIN", "GURU"], cond: () => role === "ADMIN" || (role === "GURU" && gender === "Perempuan") },
    { id: "pembinaan", label: "Adab & Pembinaan", icon: "bi-shield-exclamation", roles: ["ADMIN", "KEPSEK", "GURU", "AYAH_BUNDA"] },
    { id: "kurban", label: "Tabungan Kurban", icon: "bi-wallet2", roles: ["ADMIN", "KEPSEK", "GURU", "AYAH_BUNDA"] },
    { id: "pengumuman", label: "Pengumuman", icon: "bi-megaphone", roles: ["ADMIN", "KEPSEK", "GURU", "AYAH_BUNDA"] },
    { id: "dokumen", label: "Dokumen Center", icon: "bi-folder-symlink", roles: ["ADMIN", "KEPSEK", "GURU_TAHFIDZ", "AYAH_BUNDA"] },
    { id: "pengaturan", label: "Pengaturan", icon: "bi-sliders", roles: ["ADMIN"] },
    { id: "backup", label: "Database Backup", icon: "bi-database-fill-down", roles: ["ADMIN"] }
  ];

  menuConfig.forEach(item => {
    if (item.roles.includes(role)) {
      if (item.cond && !item.cond()) return; // Skip if dynamic condition fails
      
      const link = document.createElement("a");
      link.href = `#/${item.id}`;
      link.className = "nav-link";
      link.id = `menu-link-${item.id}`;
      link.innerHTML = `<i class="${item.icon}"></i> <span>${item.label}</span>`;
      menuContainer.appendChild(link);
    }
  });
}

// ============================================================================
// SINGLE PAGE APPLICATION (SPA) ROUTER ENGINE
// ============================================================================
function routerEngine() {
  const currentHash = window.location.hash || "#/dashboard";
  let route = currentHash.replace("#/", "");
  if(STATE.activeRole === "AYAH_BUNDA" && route === "dashboard") route = "dashboard-ananda";

  // Ambil elemen judul halaman
  const pageTitle = document.getElementById("current-page-title");
  
  // Destruksi Seluruh Grafik Chart.js Yang Aktif Agar Memori Tidak Bocor
  STATE.activeCharts.forEach(c => c.destroy());
  STATE.activeCharts = [];

  // Sinkronisasi status navigasi sidebar aktif
  document.querySelectorAll("#dynamic-menu .nav-link").forEach(link => link.classList.remove("active"));
  const currentActiveLink = document.getElementById(`menu-link-${route}`);
  if (currentActiveLink) currentActiveLink.classList.add("active");

  const viewContainer = document.getElementById("main-view-container");
  
  // Tutup menu mobile jika sedang terbuka
  document.getElementById("main-sidebar").classList.remove("mobile-show");
  document.getElementById("sidebar-backdrop").classList.add("d-none");

  // CENTRAL ROUTING ENGINE SWITCH COMPONENT INTERFACES
  switch (route) {
    case "dashboard":
      pageTitle.textContent = "Executive Dashboard";
      if(STATE.activeRole === "ADMIN") viewContainer.innerHTML = viewAdminDashboard();
      else if(STATE.activeRole === "KEPSEK") viewContainer.innerHTML = viewKepsekDashboard();
      else if(STATE.activeRole === "GURU_TAHFIDZ" || STATE.activeRole === "GURU") viewContainer.innerHTML = viewGuruDashboard();
      initDashboardCharts(STATE.activeRole);
      break;

    case "dashboard-ananda":
      pageTitle.textContent = "Dashboard Monitoring Ananda";
      viewContainer.innerHTML = viewAyahBundaDashboard();
      initDashboardCharts("AYAH_BUNDA");
      break;

    case "murid":
      pageTitle.textContent = "Manajemen Data Murid";
      viewContainer.innerHTML = viewDataMuridModule();
      break;

    case "tahfidz":
      pageTitle.textContent = "Core Tahfidz & Halaqah";
      viewContainer.innerHTML = viewTahfidzCoreModule();
      break;

    case "kurban":
      pageTitle.textContent = "Tabungan & Setoran Kurban";
      viewContainer.innerHTML = viewKurbanModule();
      break;

    default:
      pageTitle.textContent = "Modul Beroperasi";
      viewContainer.innerHTML = `
        <div class="card p-5 text-center shadow-sm rounded-4">
          <i class="bi bi-tools text-muted fs-1 mb-3"></i>
          <h4>Modul [${route.toUpperCase()}] Sedang Dikembangkan</h4>
          <p class="text-muted">Pipeline backend engine dan kaitan visual disiapkan dalam sprint berjalan.</p>
          <a href="#/dashboard" class="btn btn-primary-alazhar mx-auto px-4">Kembali ke Dashboard</a>
        </div>`;
      break;
  }
}

// ============================================================================
// COMPONENT VISUAL ENGINE CODES (DASHBOARD TEMPLATE LAYOUTS)
// ============================================================================

function injectMutiaraCard() {
  return `
    <div class="col-12 mb-4">
      <div class="mutiara-islami-card">
        <div class="mutiara-islami-title"><i class="bi bi-quote"></i> MUTIARA ISLAMI HARI INI</div>
        <div class="mutiara-islami-text">"Sebaik-baik kalian adalah orang yang belajar Al-Qur'an dan mengajarkannya."</div>
        <div class="text-end text-muted mt-2 font-monospace fs-7">— HR. Bukhari</div>
      </div>
    </div>`;
}

function viewAdminDashboard() {
  return `
    <div class="row">
      ${injectMutiaraCard()}
      <div class="col-12 col-sm-6 col-xl-3 mb-4">
        <div class="iims-card-widget">
          <div><div class="widget-metric-number">324</div><div class="widget-metric-label">Total Murid</div></div>
          <div class="widget-icon-box bg-primary-subtle text-primary"><i class="bi bi-people-fill"></i></div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-xl-3 mb-4">
        <div class="iims-card-widget">
          <div><div class="widget-metric-number">28</div><div class="widget-metric-label">Total Guru Binaan</div></div>
          <div class="widget-icon-box bg-success-subtle text-success"><i class="bi bi-person-badge-fill"></i></div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-xl-3 mb-4">
        <div class="iims-card-widget">
          <div><div class="widget-metric-number">1.420</div><div class="widget-metric-label">Setoran Pekan Ini</div></div>
          <div class="widget-icon-box bg-warning-subtle text-warning"><i class="bi bi-journal-check"></i></div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-xl-3 mb-4">
        <div class="iims-card-widget">
          <div><div class="widget-metric-number">12</div><div class="widget-metric-number text-danger d-inline">/ 3</div><div class="widget-metric-label">Haid / Pelanggaran Tinggi</div></div>
          <div class="widget-icon-box bg-danger-subtle text-danger"><i class="bi bi-exclamation-triangle-fill"></i></div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-lg-8 mb-4"><div class="card p-4 rounded-4 shadow-sm border-0 bg-white"><h5>Perkembangan Tahfidz Bulanan</h5><canvas id="chart-tahfidz-analitik"></canvas></div></div>
      <div class="col-12 col-lg-4 mb-4"><div class="card p-4 rounded-4 shadow-sm border-0 bg-white"><h5>Distribusi Status Kurban</h5><canvas id="chart-kurban-pie"></canvas></div></div>
    </div>`;
}

function viewKepsekDashboard() {
  return `
    <div class="row">
      ${injectMutiaraCard()}
      <div class="col-12 col-md-4 mb-4">
        <div class="iims-card-widget">
          <div><div class="widget-metric-number">92.4%</div><div class="widget-metric-label">KPI Capaian Target Tahfidz</div></div>
          <div class="widget-icon-box bg-success-subtle text-success"><i class="bi bi-graph-up-arrow"></i></div>
        </div>
      </div>
      <div class="col-12 col-md-4 mb-4">
        <div class="iims-card-widget">
          <div><div class="widget-metric-number">Rp 45.2M</div><div class="widget-metric-label">Dana Kurban Terkumpul</div></div>
          <div class="widget-icon-box bg-primary-subtle text-primary"><i class="bi bi-cash-coin"></i></div>
        </div>
      </div>
      <div class="col-12 col-md-4 mb-4">
        <div class="iims-card-widget">
          <div><div class="widget-metric-number">4</div><div class="widget-metric-label">Dokumen Menunggu Approval</div></div>
          <div class="widget-icon-box bg-danger-subtle text-danger position-relative"><i class="bi bi-file-earmark-check-fill"></i></div>
        </div>
      </div>
    </div>
    <div class="row"><div class="col-12 mb-4"><div class="card p-4 rounded-4 shadow-sm border-0"><h5 class="mb-3">Statistik Indeks Kedisiplinan & Adab Murid</h5><canvas id="chart-pembinaan-bar" style="max-height:300px;"></canvas></div></div></div>`;
}

function viewGuruDashboard() {
  return `
    <div class="row">
      ${injectMutiaraCard()}
      <div class="col-12 col-md-6 col-xl-4 mb-4">
        <div class="iims-card-widget">
          <div><div class="widget-metric-number">32</div><div class="widget-metric-label">Murid Kelas Binaan</div></div>
          <div class="widget-icon-box bg-primary-subtle text-primary"><i class="bi bi-person-workspace"></i></div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-xl-4 mb-4">
        <div class="iims-card-widget">
          <div><div class="widget-metric-number">28</div><div class="widget-metric-label">Sudah Setor Hari Ini</div></div>
          <div class="widget-icon-box bg-success-subtle text-success"><i class="bi bi-check-circle-fill"></i></div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-xl-4 mb-4">
        <div class="iims-card-widget">
          <div><div class="widget-metric-number">4</div><div class="widget-metric-label">Belum / Berhalangan</div></div>
          <div class="widget-icon-box bg-danger-subtle text-danger"><i class="bi bi-x-circle-fill"></i></div>
        </div>
      </div>
    </div>
    <div class="table-card-wrapper mt-2">
      <div class="table-action-header fw-bold text-dark"><i class="bi bi-display me-2"></i> MONITORING REALTIME HALAQAH KELAS BINAAN</div>
      <div class="table-responsive">
        <table class="table iims-table align-middle">
          <thead>
            <tr><th>Nama Murid</th><th>Surah Aktif</th><th>Ayat Akhir</th><th>Kondisi Kelancaran</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr><td>Muhammad Abdullah</td><td>Al-Kahf</td><td>Ayat 1-10</td><td><span class="badge bg-success">Sangat Lancar</span></td><td><span class="badge bg-success-subtle text-success">Selesai</span></td></tr>
            <tr><td>Aisyah Humaira</td><td>An-Naba'</td><td>Ayat 1-20</td><td><span class="badge bg-warning text-dark">Terbata-bata</span></td><td><span class="badge bg-success-subtle text-success">Selesai</span></td></tr>
            <tr><td>Zaid Ramadhan</td><td>—</td><td>—</td><td>—</td><td><span class="badge bg-danger-subtle text-danger">Haid / Absen</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>`;
}

function viewAyahBundaDashboard() {
  return `
    <div class="row">
      ${injectMutiaraCard()}
      <div class="col-12 col-md-6 mb-4">
        <div class="card p-4 rounded-4 shadow-sm border-0 h-100 bg-white">
          <h5 class="text-primary border-bottom pb-2"><i class="bi bi-child"></i> Data Profil Ananda</h5>
          <table class="table table-sm table-borderless mt-3 fs-6">
            <tr><td width="40%" class="text-muted">Nama Lengkap:</td><td class="fw-bold">Raihan Alvaro</td></tr>
            <tr><td class="text-muted">Kelas / Halaqah:</td><td>VIII-A / Ustadz Ahmad Fauzi</td></tr>
            <tr><td class="text-muted">Surah Aktif:</td><td><span class="badge bg-primary">Al-Mulk (Ayat 15)</span></td></tr>
            <tr><td class="text-muted">Total Surah Selesai:</td><td>14 Surah</td></tr>
            <tr><td class="text-muted">Predikat Capaian:</td><td><span class="badge bg-warning text-dark">Jayyid Jiddan</span></td></tr>
          </table>
        </div>
      </div>
      <div class="col-12 col-md-6 mb-4">
        <div class="card p-4 rounded-4 shadow-sm border-0 h-100 bg-white">
          <h5 class="text-success border-bottom pb-2"><i class="bi bi-piggy-bank"></i> Tabungan Kurban Ananda</h5>
          <div class="d-flex justify-content-between align-items-center mt-3 mb-2">
            <span class="text-muted">Target: <strong>Rp 3.500.000</strong></span>
            <span class="text-success fw-bold">71% Lunas</span>
          </div>
          <div class="progress mb-3" style="height: 12px;"><div class="progress-bar bg-success" role="progressbar" style="width: 71%"></div></div>
          <div class="row text-center mt-2 fs-7">
            <div class="col-6 border-end"><div>Terbayar</div><strong class="text-success">Rp 2.500.000</strong></div>
            <div class="col-6"><div>Sisa Sifat Tagihan</div><strong class="text-danger">Rp 1.000.000</strong></div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-lg-8 mb-4"><div class="card p-4 rounded-4 shadow-sm border-0 bg-white"><h5>Kurva Progres Hafalan Ananda</h5><canvas id="chart-ananda-progress"></canvas></div></div>
      <div class="col-12 col-lg-4 mb-4">
        <div class="card p-4 rounded-4 shadow-sm border-0 bg-white h-100">
          <h5>Catatan Log Pembinaan Terakhir</h5>
          <div class="alert alert-warning py-2 px-3 mt-3 fs-7" role="alert"><i class="bi bi-info-circle-fill me-2"></i>Terlambat mengikuti halaqah pagi (Poin: 5)</div>
          <div class="alert alert-success py-2 px-3 fs-7" role="alert"><i class="bi bi-heart-fill me-2"></i>Membantu merapikan mushaf Al-Quran (+Poin Adab)</div>
        </div>
      </div>
    </div>`;
}

// ============================================================================
// COMPONENT DATA ENGINE: DATA MURID (ADMIN LEVEL CRUD CRADLE)
// ============================================================================
function viewDataMuridModule() {
  return `
    <div class="table-card-wrapper">
      <div class="table-action-header d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div class="d-flex align-items-center gap-2">
          <input type="text" class="form-control form-control-sm" placeholder="Cari NIS atau Nama..." style="width: 220px;">
          <button class="btn btn-sm btn-outline-secondary"><i class="bi bi-search"></i></button>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-success" onclick="triggerGlobalModalEmulation('Import Excel Murid', 'import-murid')"><i class="bi bi-file-earmark-excel"></i> Import</button>
          <button class="btn btn-sm btn-secondary"><i class="bi bi-download"></i> Export</button>
          <button class="btn btn-sm btn-primary-alazhar" onclick="triggerGlobalModalEmulation('Tambah Data Murid Baru', 'add-murid')"><i class="bi bi-plus-circle"></i> Tambah Murid</button>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table iims-table">
          <thead>
            <tr><th>NIS <span class="text-danger">*</span></th><th>NISN</th><th>Nama Murid</th><th>Gender</th><th>Orang Tua (Ayah/Bunda)</th><th>Status</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            <tr><td>24001</td><td>0112345678</td><td class="fw-semibold text-dark">Ahmad Dani</td><td>Laki-laki</td><td>Hendrawan / Susi</td><td><span class="badge bg-success">Aktif</span></td><td><button class="btn btn-sm btn-outline-primary py-0 px-2" onclick="showNotificationToast('Fitur Edit Data diaktifkan dalam Sprint 2','info')"><i class="bi bi-pencil"></i></button></td></tr>
            <tr><td>24002</td><td>0119876543</td><td class="fw-semibold text-dark">Fatima Zahra</td><td>Perempuan</td><td>Syahrial / Aminah</td><td><span class="badge bg-success">Aktif</span></td><td><button class="btn btn-sm btn-outline-primary py-0 px-2"><i class="bi bi-pencil"></i></button></td></tr>
          </tbody>
        </table>
      </div>
    </div>`;
}

function viewTahfidzCoreModule() {
  return `
    <div class="card p-4 rounded-4 shadow-sm border-0 bg-white">
      <div class="border-bottom pb-3 mb-4 d-flex justify-content-between align-items-center">
        <h5 class="m-0 text-primary"><i class="bi bi-book-half me-2"></i> Input Setoran Hafalan Baru</h5>
        <span class="text-muted fs-7">Sesi Mengajar: <strong>${STATE.activeUser}</strong></span>
      </div>
      <form id="iims-tahfidz-entry-form" onsubmit="event.preventDefault(); executeSaveSetoranTahfidzEmulation();">
        <div class="row">
          <div class="col-12 col-md-6 mb-3">
            <label class="form-label font-weight-bold">Pilih Kelas Binaan <span class="text-danger">*</span></label>
            <select class="form-select" required>
              <option value="">-- Pilih Kelas --</option>
              <option value="K7A">Kelas 7-A</option>
              <option value="K8A">Kelas 8-A</option>
            </select>
          </div>
          <div class="col-12 col-md-6 mb-3">
            <label class="form-label">Pilih Murid <span class="text-danger">*</span></label>
            <select class="form-select" required>
              <option value="">-- Pilih Nama Murid --</option>
              <option value="24001">Ahmad Dani (NIS: 24001)</option>
              <option value="24002">Fatima Zahra (NIS: 24002)</option>
            </select>
          </div>
        </div>
        <div class="card p-3 my-3 bg-light border-0 rounded-3 fs-7">
          <div class="row">
            <div class="col-6 col-md-3">Surah Terakhir: <strong class="d-block text-dark">An-Naba'</strong></div>
            <div class="col-6 col-md-3">Ayat Terakhir: <strong class="d-block text-dark">Ayat 20</strong></div>
            <div class="col-6 col-md-3">Nilai Terakhir: <strong class="d-block text-success">Mumtaz (95)</strong></div>
            <div class="col-6 col-md-3">Tanggal Setor: <strong class="d-block text-muted">18/06/2026</strong></div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-4 mb-3"><label class="form-label">Surah Setor <span class="text-danger">*</span></label><select class="form-select" required><option>An-Naba'</option><option>An-Nazi'at</option></select></div>
          <div class="col-6 col-md-4 mb-3"><label class="form-label">Ayat Mulai <span class="text-danger">*</span></label><input type="number" class="form-control" value="21" required></div>
          <div class="col-6 col-md-4 mb-3"><label class="form-label">Ayat Akhir <span class="text-danger">*</span></label><input type="number" class="form-control" value="40" required></div>
        </div>
        <div class="row">
          <div class="col-12 col-md-6 mb-3"><label class="form-label">Nilai Kelancaran (1-100) <span class="text-danger">*</span></label><input type="number" class="form-control" value="90" required></div>
          <div class="col-12 col-md-6 mb-3"><label class="form-label">Nilai Tajwid (1-100) <span class="text-danger">*</span></label><input type="number" class="form-control" value="92" required></div>
        </div>
        <div class="mb-4"><label class="form-label">Catatan Tambahan Guru</label><textarea class="form-control" rows="2" placeholder="Tulis catatan kelancaran atau makhraj di sini..."></textarea></div>
        <button type="submit" class="btn btn-primary-alazhar px-4"><i class="bi bi-cloud-arrow-up-fill me-2"></i> Simpan Setoran</button>
      </form>
    </div>`;
}

function viewKurbanModule() {
  if (STATE.activeRole === "AYAH_BUNDA") {
    return `
      <div class="card p-4 rounded-4 shadow-sm border-0 bg-white">
        <h5><i class="bi bi-upload text-success me-2"></i> Upload Bukti Setoran Tabungan Kurban</h5>
        <p class="text-muted fs-7">Kirimkan bukti transfer bank secara digital untuk divalidasi oleh Tim Keuangan Administrasi IIMS.</p>
        <form onsubmit="event.preventDefault(); showNotificationToast('Bukti kurban berhasil dikirim ke Admin. Status: Menunggu Validasi.', 'success');">
          <div class="mb-3"><label class="form-label">Tanggal Transfer <span class="text-danger">*</span></label><input type="date" class="form-control" required value="2026-06-21"></div>
          <div class="mb-3"><label class="form-label">Nominal Transfer (Rp) <span class="text-danger">*</span></label><input type="number" class="form-control" placeholder="Contoh: 500000" required></div>
          <div class="mb-4"><label class="form-label">Unggah File Bukti / Screenshot Transaksi <span class="text-danger">*</span></label><input type="file" class="form-control" required></div>
          <button type="submit" class="btn btn-success px-4">Submit Bukti Setoran</button>
        </form>
      </div>`;
  }
  return `
    <div class="table-card-wrapper">
      <div class="table-action-header fw-bold text-dark"><i class="bi bi-shield-check text-warning me-2"></i> PIPELINE VERIFIKASI SETORAN KURBAN (ADMIN/KEPSEK LEVEL)</div>
      <div class="table-responsive">
        <table class="table iims-table">
          <thead>
            <tr><th>Nama Murid</th><th>Tanggal Transmisi</th><th>Nominal</th><th>Dokumen Bukti</th><th>Status</th><th>Otorisasi</th></tr>
          </thead>
          <tbody>
            <tr><td>Raihan Alvaro</td><td>21/06/2026</td><td>Rp 500.000</td><td><a href="#" class="link-primary text-decoration-none"><i class="bi bi-file-image"></i> transfer_bukti.jpg</a></td><td><span class="badge bg-warning text-dark">Menunggu Validasi</span></td><td><button class="btn btn-xs btn-success py-0 px-2 fs-7" onclick="showNotificationToast('Transaksi Terverifikasi Sah. Database Diupdate!', 'success')">Validasi</button> <button class="btn btn-xs btn-danger py-0 px-2 fs-7">Tolak</button></td></tr>
          </tbody>
        </table>
      </div>
    </div>`;
}

// ============================================================================
// SYSTEM ENGINE DIALOG MODAL & TOAST COMPONENT INJECTOR
// ============================================================================
function triggerGlobalModalEmulation(title, type) {
  document.getElementById("modal-global-title").textContent = title;
  const body = document.getElementById("modal-global-body");
  
  if (type === 'add-murid') {
    body.innerHTML = `
      <form onsubmit="event.preventDefault(); bootstrap.Modal.getInstance(document.getElementById('iims-standard-modal')).hide(); showNotificationToast('Data murid berhasil disimpan ke database.', 'success');">
        <div class="row mb-3">
          <div class="col-6"><label class="form-label">NIS <span class="text-danger">*</span></label><input type="text" class="form-control" required></div>
          <div class="col-6"><label class="form-label">NISN</label><input type="text" class="form-control"></div>
        </div>
        <div class="mb-3"><label class="form-label">Nama Lengkap Murid <span class="text-danger">*</span></label><input type="text" class="form-control" required></div>
        <button type="submit" class="btn btn-primary-alazhar w-100">Simpan Permanen</button>
      </form>`;
  } else if (type === 'import-murid') {
    body.innerHTML = `
      <div class="p-3 text-center">
        <i class="bi bi-cloud-arrow-up text-success display-4"></i>
        <p class="mt-2">Pilih file template spreadsheet murid (*.xlsx)</p>
        <input type="file" class="form-control mb-3" id="file-import-excel" accept=".xlsx">
        <button class="btn btn-success w-100" onclick="bootstrap.Modal.getInstance(document.getElementById('iims-standard-modal')).hide(); showNotificationToast('Proses importing selesai: 32 Record ditambahkan.', 'success')">Eksekusi Parsing Import</button>
      </div>`;
  }

  const modalElement = new bootstrap.Modal(document.getElementById('iims-standard-modal'));
  modalElement.show();
}

function showNotificationToast(message, type = "success") {
  const toastEl = document.getElementById("iims-global-toast");
  const toastMsg = document.getElementById("toast-message-content");
  
  toastEl.classList.remove("bg-success", "bg-danger", "bg-info", "bg-warning");
  
  if (type === "success") toastEl.classList.add("bg-success");
  else if (type === "danger") toastEl.classList.add("bg-danger");
  else if (type === "warning") toastEl.classList.add("bg-warning", "text-dark");
  else toastEl.classList.add("bg-info");
  
  toastMsg.textContent = message;
  const bToast = new bootstrap.Toast(toastEl, { delay: 4000 });
  bToast.show();
}

function executeSaveSetoranTahfidzEmulation() {
  showNotificationToast("Menyimpan setoran ke database...", "info");
  setTimeout(() => {
    showNotificationToast("Setoran Berhasil Disimpan. PROGRES_HAFALAN terupdate otomatis!", "success");
    routerEngine(); // Refresh view
  }, 1000);
}

// ============================================================================
// SYSTEM ENGINE DATA GRAPHICS (CHART.JS INJECTOR CONTEXT)
// ============================================================================
function initDashboardCharts(role) {
  setTimeout(() => {
    if (role === "ADMIN") {
      const ctx1 = document.getElementById('chart-tahfidz-analitik');
      if (ctx1) {
        const c1 = new Chart(ctx1, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
            datasets: [{ label: 'Akumulasi Jumlah Juz Terhafal', data: [120, 145, 190, 240, 280, 312], borderColor: '#0A3663', tension: 0.3, fill: true, backgroundColor: 'rgba(10,54,99,0.03)' }]
          },
          options: { responsive: true, plugins: { legend: { display: false } } }
        });
        STATE.activeCharts.push(c1);
      }

      const ctx2 = document.getElementById('chart-kurban-pie');
      if (ctx2) {
        const c2 = new Chart(ctx2, {
          type: 'doughnut',
          data: {
            labels: ['Lunas', 'Proses Tabungan', 'Belum Mulai'],
            datasets: [{ data: [65, 25, 10], backgroundColor: ['#198754', '#ffc107', '#dc3545'] }]
          },
          options: { responsive: true }
        });
        STATE.activeCharts.push(c2);
      }
    } else if (role === "KEPSEK") {
      const ctx3 = document.getElementById('chart-pembinaan-bar');
      if (ctx3) {
        const c3 = new Chart(ctx3, {
          type: 'bar',
          data: {
            labels: ['Kelas 7-A', 'Kelas 7-B', 'Kelas 8-A', 'Kelas 8-B', 'Kelas 9-A', 'Kelas 9-B'],
            datasets: [
              { label: 'Poin Pelanggaran', data: [45, 12, 90, 24, 15, 60], backgroundColor: '#dc3545' },
              { label: 'Poin Prestasi Adab', data: [80, 95, 60, 110, 130, 90], backgroundColor: '#198754' }
            ]
          },
          options: { responsive: true, scales: { y: { beginAtZero: true } } }
        });
        STATE.activeCharts.push(c3);
      }
    } else if (role === "AYAH_BUNDA") {
      const ctx4 = document.getElementById('chart-ananda-progress');
      if (ctx4) {
        const c4 = new Chart(ctx4, {
          type: 'line',
          data: {
            labels: ['Pekan 1', 'Pekan 2', 'Pekan 3', 'Pekan 4'],
            datasets: [{ label: 'Jumlah Ayat Disetor', data: [15, 22, 18, 35], borderColor: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.1)', fill: true, tension: 0.2 }]
          },
          options: { responsive: true }
        });
        STATE.activeCharts.push(c4);
      }
    }
  }, 100);
}

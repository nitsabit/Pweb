var PRODI = { "Informatika": "25", "Sistem Informasi": "26", "Teknik Elektro": "24", "Manajemen": "30" };
var RAW = [
  ["Aditya Pratama","Informatika"],["Agus Setiawan","Teknik Elektro"],["Ahmad Fauzi","Informatika"],
  ["Aisyah Nurhaliza","Sistem Informasi"],["Alya Putri Maharani","Informatika"],["Andini Kusuma","Manajemen"],
  ["Arif Rahman Hakim","Teknik Elektro"],["Bagas Saputra","Informatika"],["Bayu Nugroho","Sistem Informasi"],
  ["Citra Ayu Lestari","Manajemen"],["Dewi Sartika Putri","Sistem Informasi"],
  ["Dinda Permata Sari","Informatika"],["Eko Prasetyo","Teknik Elektro"],["Fajar Ramadhan","Informatika"],
  ["Fitri Handayani","Manajemen"],["Galih Wicaksono","Sistem Informasi"],["Gita Savitri","Informatika"],
  ["Hana Salsabila","Sistem Informasi"],["Ilham Maulana","Teknik Elektro"],["Indah Cahyani","Manajemen"],
  ["Intan Permatasari","Informatika"],["Joko Santoso","Teknik Elektro"],["Chairunnisa` Tsabitah","Informatika"],["Kartika Dewi","Sistem Informasi"],
  ["Laila Rahmawati","Manajemen"],["Mega Puspita","Informatika"],["Muhammad Rizky","Informatika"],
  ["Nabila Azzahra","Sistem Informasi"],["Nanda Kurniawan","Teknik Elektro"],["Nurul Aini","Manajemen"],
  ["Putra Wijaya","Informatika"],["Rina Wulandari","Sistem Informasi"],["Rizal Firmansyah","Teknik Elektro"],
  ["Sinta Maharani","Manajemen"],["Siti Nurhaliza","Informatika"],["Tegar Adi Nugraha","Teknik Elektro"],
  ["Vina Oktaviani","Sistem Informasi"],["Wahyu Hidayat","Informatika"],["Widya Lestari","Manajemen"],
  ["Yoga Pradipta","Informatika"],["Yuliana Sari","Sistem Informasi"],["Zahra Amelia","Informatika"]
];
var STUDENTS = RAW.map(function (r, i) {
  return { nama: r[0], prodi: r[1], nim: "50" + PRODI[r[1]] + "2510" + String(i + 1) };
});

// Nama diawali query > salah satu kata diawali query > query ada di dalam nama.
function suggest(query, limit) {
  var q = String(query || "").trim().toLowerCase();
  if (!q) return [];
  var out = [];
  STUDENTS.forEach(function (s) {
    var n = s.nama.toLowerCase(), score = -1, idx = -1;
    if (n.indexOf(q) === 0) { score = 0; idx = 0; }
    else {
      var w = n.indexOf(" " + q);
      if (w >= 0) { score = 1; idx = w + 1; }
      else { var c = n.indexOf(q); if (c >= 0) { score = 2; idx = c; } }
    }
    if (score >= 0) out.push({ s: s, score: score, idx: idx, len: q.length });
  });
  out.sort(function (a, b) {
    return a.score - b.score || a.idx - b.idx || a.s.nama.localeCompare(b.s.nama, "id");
  });
  return out.slice(0, limit || 6);
}

var COURSES = [
  { kode: "EF2101", nama: "Struktur Data", sks: 3, dosen: ["Dr. Hendra Wijaya, M.Kom.", "Ir. Sri Mulyani, M.T."] },
  { kode: "EF2203", nama: "Basis Data", sks: 3, dosen: ["Dr. Ratna Kusumawati, M.Cs."] },
  { kode: "EF234301", nama: "Pemrograman Web", sks: 3, dosen: ["Fajar Baskoro, S.Kom., M.T.", "Dewi Anggraini, M.Kom."] },
  { kode: "EF3102", nama: "Jaringan Komputer", sks: 3, dosen: ["Ir. Bambang Sutrisno, M.T."] },
  { kode: "EF3204", nama: "Kecerdasan Buatan", sks: 3, dosen: ["Prof. Dr. Lestari Handayani, M.Sc."] },
  { kode: "EF3301", nama: "Rekayasa Perangkat Lunak", sks: 3, dosen: ["Agus Prasetyo, S.Kom., M.T."] },
  { kode: "MK2001", nama: "Statistika dan Probabilitas", sks: 2, dosen: ["Dr. Yusuf Maulana, M.Si."] },
  { kode: "MK2102", nama: "Kalkulus Lanjut", sks: 3, dosen: ["Dr. Yusuf Maulana, M.Si.", "Nurul Hidayah, M.Pd."] }
];

var $ = function (id) { return document.getElementById(id); };
var el = {
  form: $("reg"), nama: $("nama"), list: $("nama-list"), nim: $("nim"),
  matkul: $("matkul"), dosen: $("dosen"), status: $("status"), regs: $("regs"), empty: $("empty")
};
var current = [], active = -1, registrations = [];
var STORE_KEY = "registrasi-mata-kuliah-v2";

var live = document.createElement("div");
live.className = "sr";
live.setAttribute("aria-live", "polite");
document.body.appendChild(live);
function announce(t) { live.textContent = ""; setTimeout(function () { live.textContent = t; }, 30); }

/* Combobox */
function setExpanded(open) {
  el.list.hidden = !open;
  el.nama.setAttribute("aria-expanded", open ? "true" : "false");
  if (!open) { active = -1; el.nama.removeAttribute("aria-activedescendant"); }
}
function highlightOption(i) {
  var opts = el.list.querySelectorAll(".option");
  opts.forEach(function (o, k) { o.setAttribute("aria-selected", k === i ? "true" : "false"); });
  active = i;
  if (i >= 0 && opts[i]) {
    el.nama.setAttribute("aria-activedescendant", opts[i].id);
    opts[i].scrollIntoView({ block: "nearest" });
  } else {
    el.nama.removeAttribute("aria-activedescendant");
  }
}
function renderList() {
  el.list.textContent = "";
  var q = el.nama.value.trim();
  current = suggest(q, 6);
  if (!q) { setExpanded(false); return; }
  if (!current.length) {
    var none = document.createElement("li");
    none.className = "nomatch";
    none.setAttribute("role", "presentation");
    none.textContent = "Tidak ada saran. Nama disimpan sesuai ketikan.";
    el.list.appendChild(none);
    setExpanded(true);
    announce("Tidak ada saran.");
    return;
  }
  current.forEach(function (m, i) {
    var li = document.createElement("li");
    li.id = "opt-" + i;
    li.className = "option";
    li.setAttribute("role", "option");
    li.setAttribute("aria-selected", "false");
    var nm = document.createElement("span");
    nm.className = "nm";
    var t = m.s.nama;
    nm.appendChild(document.createTextNode(t.slice(0, m.idx)));
    var b = document.createElement("b");
    b.textContent = t.slice(m.idx, m.idx + m.len);
    nm.appendChild(b);
    nm.appendChild(document.createTextNode(t.slice(m.idx + m.len)));
    var nim = document.createElement("span");
    nim.className = "nim";
    nim.textContent = m.s.nim;
    li.appendChild(nm);
    li.appendChild(nim);
    li.addEventListener("pointerdown", function (e) { e.preventDefault(); });
    li.addEventListener("mousedown", function (e) { e.preventDefault(); });
    li.addEventListener("click", function () { choose(i); });
    li.addEventListener("pointermove", function () { if (active !== i) highlightOption(i); });
    el.list.appendChild(li);
  });
  setExpanded(true);
  highlightOption(-1);
  announce(current.length + " saran tersedia. Gunakan panah atas dan bawah.");
}
function choose(i) {
  var m = current[i];
  if (!m) return;
  el.nama.value = m.s.nama;
  el.nim.value = m.s.nim;
  clearError("nama"); clearError("nim");
  setExpanded(false);
  announce("Dipilih " + m.s.nama + ", NIM " + m.s.nim + ".");
}
el.nama.addEventListener("input", function () { clearError("nama"); renderList(); });
el.nama.addEventListener("focus", function () { if (el.nama.value.trim() && el.list.hidden) renderList(); });
el.nama.addEventListener("blur", function () { setExpanded(false); });
el.nama.addEventListener("keydown", function (e) {
  var open = !el.list.hidden && current.length > 0;
  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (!open) { if (el.nama.value.trim()) renderList(); if (current.length) highlightOption(0); return; }
    highlightOption(active < current.length - 1 ? active + 1 : 0);
  } else if (e.key === "ArrowUp") {
    if (!open) return;
    e.preventDefault();
    highlightOption(active > 0 ? active - 1 : current.length - 1);
  } else if (e.key === "Enter") {
    if (open && active >= 0) { e.preventDefault(); choose(active); }
  } else if (e.key === "Escape") {
    if (!el.list.hidden) { e.preventDefault(); setExpanded(false); }
    else if (el.nama.value) { el.nama.value = ""; }
  } else if (e.key === "Tab") {
    setExpanded(false);
  }
});

/* Mata kuliah dan dosen */
COURSES.forEach(function (c, i) {
  el.matkul.appendChild(new Option(c.kode + " - " + c.nama + " (" + c.sks + " SKS)", String(i)));
});
function fillDosen() {
  el.dosen.textContent = "";
  if (el.matkul.value === "") {
    el.dosen.disabled = true;
    el.dosen.appendChild(new Option("- Pilih mata kuliah dulu -", ""));
    return;
  }
  var c = COURSES[Number(el.matkul.value)];
  el.dosen.disabled = false;
  if (c.dosen.length > 1) el.dosen.appendChild(new Option("- Pilih dosen -", ""));
  c.dosen.forEach(function (d) { el.dosen.appendChild(new Option(d, d)); });
}
el.matkul.addEventListener("change", function () { clearError("matkul"); clearError("dosen"); fillDosen(); });
el.dosen.addEventListener("change", function () { clearError("dosen"); });
el.nim.addEventListener("input", function () {
  el.nim.value = el.nim.value.replace(/\D/g, "").slice(0, 10);
  clearError("nim");
});

/* Validasi */
function setError(f, msg) { $(f + "-err").textContent = msg; $(f).setAttribute("aria-invalid", "true"); }
function clearError(f) { $(f + "-err").textContent = ""; $(f).removeAttribute("aria-invalid"); }
function validate() {
  var bad = [];
  var nama = el.nama.value.trim(), nim = el.nim.value.trim();
  ["nama", "nim", "matkul", "dosen"].forEach(clearError);
  if (nama.length < 3) { setError("nama", "Nama wajib diisi, minimal 3 huruf."); bad.push("nama"); }
  if (!/^\d{10}$/.test(nim)) { setError("nim", "NIM harus 10 digit angka."); bad.push("nim"); }
  if (el.matkul.value === "") { setError("matkul", "Mata kuliah wajib dipilih."); bad.push("matkul"); }
  else if (!el.dosen.value) { setError("dosen", "Dosen wajib dipilih."); bad.push("dosen"); }
  if (!bad.length) {
    var kode = COURSES[Number(el.matkul.value)].kode;
    if (registrations.some(function (r) { return r.nim === nim && r.kode === kode; })) {
      setError("matkul", "NIM " + nim + " sudah terdaftar di mata kuliah ini.");
      bad.push("matkul");
    }
  }
  return bad;
}

el.form.addEventListener("submit", function (e) {
  e.preventDefault();
  el.status.textContent = "";
  var bad = validate();
  if (bad.length) { $(bad[0]).focus(); return; }
  var c = COURSES[Number(el.matkul.value)];
  registrations.push({
    nama: el.nama.value.trim(), nim: el.nim.value.trim(),
    kode: c.kode, matkul: c.nama, dosen: el.dosen.value
  });
  save();
  renderRegs();
  el.status.textContent = "Data tersimpan.";
  resetForm(true);
});
function resetForm(keepStatus) {
  el.form.reset();
  ["nama", "nim", "matkul", "dosen"].forEach(clearError);
  fillDosen();
  setExpanded(false);
  if (!keepStatus) el.status.textContent = "";
}
$("reset").addEventListener("click", function () { resetForm(false); el.nama.focus(); });

/* Tabel */
function cell(text, cls) {
  var td = document.createElement("td");
  if (cls) td.className = cls;
  td.textContent = text;
  return td;
}
function renderRegs() {
  el.regs.textContent = "";
  el.empty.hidden = registrations.length > 0;
  registrations.forEach(function (r, i) {
    var tr = document.createElement("tr");
    tr.appendChild(cell(String(i + 1), "num"));
    tr.appendChild(cell(r.nama));
    tr.appendChild(cell(r.nim, "num"));
    tr.appendChild(cell(r.kode + " " + r.matkul));
    tr.appendChild(cell(r.dosen));
    el.regs.appendChild(tr);
  });
}
function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(registrations.slice(-50))); } catch (e) {} }
function load() {
  try {
    var raw = localStorage.getItem(STORE_KEY);
    if (raw) { var a = JSON.parse(raw); if (Array.isArray(a)) registrations = a; }
  } catch (e) {}
}
load();
fillDosen();
renderRegs();

let students = [
  { nim: "231001", nama: "Andi Pratama", jurusan: "Informatika", email: "andi@mail.com" },
  { nim: "231002", nama: "Siti Aisyah", jurusan: "Sistem Informasi", email: "siti@mail.com" },
  { nim: "231003", nama: "Budi Santoso", jurusan: "Teknik Komputer", email: "budi@mail.com" },
  { nim: "231004", nama: "Nina Marlina", jurusan: "Manajemen", email: "nina@mail.com" },
  { nim: "231005", nama: "Rizky Pratama", jurusan: "Informatika", email: "rizky@mail.com" },
  { nim: "231006", nama: "Dewi Lestari", jurusan: "Sistem Informasi", email: "dewi@mail.com" },
  { nim: "231007", nama: "Maya Sari", jurusan: "Manajemen", email: "maya@mail.com" },
  { nim: "231008", nama: "Hendra Wijaya", jurusan: "Informatika", email: "hendra@mail.com" },
  { nim: "231009", nama: "Lina Kurnia", jurusan: "Sistem Informasi", email: "lina@mail.com" },
  { nim: "231010", nama: "Agus Setiawan", jurusan: "Teknik Komputer", email: "agus@mail.com" },
  { nim: "231011", nama: "Rina Amelia", jurusan: "Manajemen", email: "rina@mail.com" }
];

const PER_PAGE = 5;
let page = 1;
let keyword = "";
let editIndex = null;

const form = document.getElementById("studentForm");
const tbody = document.getElementById("tableBody");
const info = document.getElementById("info");
const pagination = document.getElementById("pagination");
const searchInput = document.getElementById("search");

const iconEdit = '<svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>';
const iconDelete = '<svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/></svg>';

function escapeHTML(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

function filtered() {
  const k = keyword.toLowerCase();
  return students
    .map((s, i) => ({ ...s, idx: i }))
    .filter(s => Object.values(s).some(v => String(v).toLowerCase().includes(k)));
}

function render() {
  const data = filtered();
  const totalPages = Math.max(1, Math.ceil(data.length / PER_PAGE));
  if (page > totalPages) page = totalPages;

  const start = (page - 1) * PER_PAGE;
  const rows = data.slice(start, start + PER_PAGE);

  tbody.innerHTML = rows.length
    ? rows.map((s, i) => `
      <tr>
        <td>${start + i + 1}</td>
        <td>${escapeHTML(s.nim)}</td>
        <td>${escapeHTML(s.nama)}</td>
        <td>${escapeHTML(s.jurusan)}</td>
        <td>${escapeHTML(s.email)}</td>
        <td>
          <div class="actions">
            <button class="action edit" data-edit="${s.idx}" aria-label="Edit">${iconEdit}</button>
            <button class="action delete" data-del="${s.idx}" aria-label="Hapus">${iconDelete}</button>
          </div>
        </td>
      </tr>`).join("")
    : '<tr><td colspan="6" style="text-align:center;padding:28px">Data tidak ditemukan</td></tr>';

  info.textContent = data.length
    ? `Menampilkan ${start + 1} - ${start + rows.length} dari ${data.length} data`
    : "Menampilkan 0 data";

  let html = `<button data-page="${Math.max(1, page - 1)}">&laquo;</button>`;
  for (let p = 1; p <= totalPages; p++) {
    html += `<button data-page="${p}" class="${p === page ? "active" : ""}">${p}</button>`;
  }
  html += `<button data-page="${Math.min(totalPages, page + 1)}">&raquo;</button>`;
  pagination.innerHTML = html;
}

function resetForm() {
  form.reset();
  editIndex = null;
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const item = {
    nim: form.nim.value.trim(),
    nama: form.nama.value.trim(),
    jurusan: form.jurusan.value,
    email: form.email.value.trim()
  };
  if (editIndex === null) students.push(item);
  else students[editIndex] = item;
  resetForm();
  render();
});

document.getElementById("btnBatal").addEventListener("click", resetForm);

tbody.addEventListener("click", e => {
  const edit = e.target.closest("[data-edit]");
  const del = e.target.closest("[data-del]");
  if (edit) {
    editIndex = +edit.dataset.edit;
    const s = students[editIndex];
    form.nim.value = s.nim;
    form.nama.value = s.nama;
    form.jurusan.value = s.jurusan;
    form.email.value = s.email;
    form.nim.focus();
  }
  if (del && confirm("Hapus data mahasiswa ini?")) {
    students.splice(+del.dataset.del, 1);
    render();
  }
});

pagination.addEventListener("click", e => {
  const b = e.target.closest("[data-page]");
  if (b) { page = +b.dataset.page; render(); }
});

searchInput.addEventListener("input", () => {
  keyword = searchInput.value.trim();
  page = 1;
  render();
});

render();

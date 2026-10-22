const KEY = 'anggota_perpus';
const SEED = [
  {id:1,nama:'Andi Pratama',nim:'231001',prodi:'Informatika',alamat:'Surabaya',telp:'081234567890',email:'andi@mail.com',jenis:'Mahasiswa'},
  {id:2,nama:'Siti Aisyah',nim:'231002',prodi:'Sistem Informasi',alamat:'Sidoarjo',telp:'081234567891',email:'siti@mail.com',jenis:'Mahasiswa'},
  {id:3,nama:'Dr. Budi Santoso',nim:'198001012005',prodi:'Teknik Komputer',alamat:'Surabaya',telp:'081234567892',email:'budi@mail.com',jenis:'Dosen'},
  {id:4,nama:'Nina Marlina',nim:'231004',prodi:'Manajemen',alamat:'Gresik',telp:'081234567893',email:'nina@mail.com',jenis:'Mahasiswa'},
  {id:5,nama:'Rizky Pratama',nim:'231005',prodi:'Informatika',alamat:'Surabaya',telp:'081234567894',email:'rizky@mail.com',jenis:'Mahasiswa'},
  {id:6,nama:'Wawan Setiawan',nim:'199005052015',prodi:'Informatika',alamat:'Malang',telp:'081234567895',email:'wawan@mail.com',jenis:'Tenaga Kependidikan'}
];
const PRODI = ['Informatika','Sistem Informasi','Teknik Komputer','Manajemen','Akuntansi','Teknik Elektro'];

function getAll(){
  try{
    const d = JSON.parse(localStorage.getItem(KEY));
    if(Array.isArray(d)) return d;
  }catch(e){}
  localStorage.setItem(KEY, JSON.stringify(SEED));
  return [...SEED];
}
function saveAll(list){ localStorage.setItem(KEY, JSON.stringify(list)); }
function esc(s){ return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function toast(msg, type='ok'){
  const t = document.createElement('div');
  t.className = 'toast ' + type; t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), 3000);
}
// notifikasi yang bertahan setelah pindah halaman
function flash(msg, type='ok'){ sessionStorage.setItem('flash', JSON.stringify({msg,type})); }
function showFlash(){
  const f = sessionStorage.getItem('flash');
  if(f){ sessionStorage.removeItem('flash'); const {msg,type}=JSON.parse(f); toast(msg,type); }
}

function layout(active){
  const items = [
    ['beranda','Beranda','index.html'],
    ['tentang','Tentang','index.html#tentang'],
    ['layanan','Layanan','index.html#layanan'],
    ['anggota','Daftar Anggota','anggota.html'],
    ['daftar','Pendaftaran Anggota','daftar.html']
  ];
  document.getElementById('nav').innerHTML =
    `<nav class="nav"><a class="brand" href="index.html"><span class="logo">📚</span>Perpustakaan Universitas</a>
     <ul>${items.map(i=>`<li><a href="${i[2]}" class="${i[0]===active?'active':''}">${i[1]}</a></li>`).join('')}
     <li><a class="btn dark sm" href="login.html">Login Petugas</a></li></ul></nav>`;
  document.getElementById('foot').innerHTML =
    `<footer><div><b>Perpustakaan Universitas</b><br>Jl. Kampus No. 1, Surabaya</div>
     <div><b>Kontak</b><br>perpus@universitas.ac.id<br>(031) 555-0123</div>
     <div><b>Jam Layanan</b><br>Senin–Jumat: 08.00–20.00<br>Sabtu: 08.00–14.00</div></footer>`;
  showFlash();
}

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Konfigurasi Koneksi ke MySQL (XAMPP)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // Default user XAMPP
  password: '',      // Default password XAMPP (kosong)
  database: 'campus_flow_ai' // Sesuai dengan nama database di phpMyAdmin kamu
});

// Cek Koneksi ke Database
db.connect((err) => {
  if (err) {
    console.error('❌ Gagal terhubung ke MySQL:', err.message);
  } else {
    console.log('✅ Terhubung ke Database MySQL!');
  }
});

// Route Tes Halaman Utama
app.get('/', (req, res) => {
  res.send('Server CampusFlow AI Backend Berhasil Jalan!');
});

// ==================== ROUTE BIMBINGAN MAHASISWA ====================

// GET: Ambil daftar mahasiswa bimbingan
app.get('/api/mahasiswa', (req, res) => {
  const sql = 'SELECT * FROM mahasiswa ORDER BY id DESC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST: Tambah data bimbingan baru
app.post('/api/mahasiswa', (req, res) => {
  const { nama, pesan } = req.body;
  const sql = 'INSERT INTO mahasiswa (nama, pesan) VALUES (?, ?)';
  
  db.query(sql, [nama, pesan], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, nama, pesan });
  });
});

// PUT: Edit data bimbingan
app.put('/api/mahasiswa/:id', (req, res) => {
  const { id } = req.params;
  const { nama, pesan } = req.body;
  const sql = 'UPDATE mahasiswa SET nama = ?, pesan = ? WHERE id = ?';

  db.query(sql, [nama, pesan, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Data berhasil diperbarui', id, nama, pesan });
  });
});

// DELETE: Hapus data bimbingan
app.delete('/api/mahasiswa/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM mahasiswa WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Data mahasiswa berhasil dihapus' });
  });
});

// ==================== ROUTE PENILAIAN MAHASISWA ====================

// GET: Ambil semua data nilai mahasiswa
app.get('/api/penilaian', (req, res) => {
  const sql = 'SELECT * FROM penilaian_mahasiswa';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST: Tambah data nilai baru
app.post('/api/penilaian', (req, res) => {
  const { NIM, Nama, Tugas, Nilai_UTS, Nilai_UAS } = req.body;
  const sql = 'INSERT INTO penilaian_mahasiswa (NIM, Nama, Tugas, `Nilai UTS`, `Nilai UAS`) VALUES (?, ?, ?, ?, ?)';
  
  db.query(sql, [NIM, Nama, Tugas, Nilai_UTS, Nilai_UAS], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Data nilai berhasil ditambahkan' });
  });
});

// PUT: Update data nilai berdasarkan NIM
app.put('/api/penilaian/:nim', (req, res) => {
  const { nim } = req.params;
  const { Nama, Tugas, Nilai_UTS, Nilai_UAS } = req.body;
  const sql = 'UPDATE penilaian_mahasiswa SET Nama = ?, Tugas = ?, `Nilai UTS` = ?, `Nilai UAS` = ? WHERE NIM = ?';

  db.query(sql, [Nama, Tugas, Nilai_UTS, Nilai_UAS, nim], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Data nilai berhasil diperbarui' });
  });
});

// DELETE: Hapus data nilai berdasarkan NIM
app.delete('/api/penilaian/:nim', (req, res) => {
  const { nim } = req.params;
  const sql = 'DELETE FROM penilaian_mahasiswa WHERE NIM = ?';

  db.query(sql, [nim], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Data nilai berhasil dihapus' });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server Backend berjalan di http://localhost:${PORT}`);
});
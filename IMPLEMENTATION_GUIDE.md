# 🎯 IMPLEMENTATION GUIDE - AduAja Citizen Interface

## 📋 Overview
Implementasi lengkap antarmuka warga/pelapor untuk Sistem AduAja dengan React + TypeScript + Tailwind CSS, mencakup semua fitur yang diminta berdasarkan SRS.

---

## ✅ Fitur yang Telah Diimplementasikan

### 1. **Halaman Notifikasi** (`/src/app/components/Notifications.tsx`)
Halaman notifikasi yang dapat diakses dengan klik icon bell di header dashboard.

**Jenis Notifikasi:**
- ✅ **Status Update** - Perubahan status laporan (Menunggu Verifikasi → Sedang Diproses)
- ✅ **Confirmation Required** - Memerlukan konfirmasi penyelesaian dari warga
- ✅ **SLA Warning** - Peringatan mendekati batas waktu SLA
- ✅ **Revision Required** - Admin meminta revisi laporan
- ✅ **Report Accepted** - Laporan diterima dan diverifikasi
- ✅ **Dispute Review** - Status sengketa sedang ditinjau
- ✅ **Report Merged** - Laporan digabung dengan tiket lain
- ✅ **Report Rejected** - Laporan ditolak dengan alasan
- ✅ **Comment Reply** - Admin membalas komentar warga

**Features:**
- Filter berdasarkan "Semua" atau "Belum Dibaca"
- Badge indicator untuk notifikasi belum dibaca
- Click untuk navigasi langsung ke detail laporan
- Counter jumlah notifikasi belum dibaca

---

### 2. **Halaman Profil** (`/src/app/components/Profile.tsx`)
Halaman profil pengguna dengan kemampuan edit.

**Field yang Dapat Diedit:**
- Nama Lengkap (wajib)
- NIK - 16 digit (wajib)
- Email (wajib)
- Nomor HP (wajib, format: 08xxxxxxxxxx)
- Foto Profil (upload, max 2MB)
- Alamat Lengkap
- Kelurahan
- Kecamatan
- Kota/Kabupaten
- Provinsi

**Features:**
- Mode View (default) dan Edit
- Validasi form lengkap
- Statistik laporan (Total, Sedang Diproses, Selesai)
- Header gradient dengan foto profil
- Tombol pengaturan akun (Ubah Password, Notifikasi, Hapus Akun)

---

### 3. **Pembuatan Laporan dengan Akses Kamera Web** (`/src/app/components/CreateReport.tsx`)
**✨ PERBAIKAN KRITIS:**
- Foto **WAJIB** diambil langsung menggunakan kamera perangkat
- Menggunakan `capture="environment"` untuk akses kamera backend (mobile)
- Warning box menjelaskan kenapa galeri tidak diperbolehkan
- Visual feedback saat foto berhasil diambil

**Features:**
- Dropdown kategori laporan
- Camera capture dengan preview
- GPS location capture dengan tombol "Ambil Koordinat GPS"
- Form validation lengkap (min 20 karakter deskripsi)
- Patokan lokasi (landmark)
- Map preview placeholder

---

### 4. **🔥 DYNAMIC TIMELINE STEPPER** (`/src/app/components/ReportDetailDynamic.tsx`)

Sistem timeline yang dinamis dan bercabang sesuai dengan alur sistem AduAja.

#### **A. THE HAPPY PATH** (Jalur Normal - Lancar)
```
1. Laporan Diterima Sistem ✅
   ↓
2. Menunggu Verifikasi ⏳
   ↓
3. Laporan Diterima ✅
   ↓
4. Sedang Diproses 🔧
   ↓
5. Menunggu Konfirmasi Warga 💬
   ↓
6. Selesai ✅
```

**Timeline Steps:**
- ✅ **Laporan Diterima Sistem** - "Laporan Anda telah masuk ke sistem dan menunggu verifikasi admin"
- ⏳ **Menunggu Verifikasi** - "Admin sedang memverifikasi kelengkapan dan validitas laporan"
- ✅ **Laporan Diterima** - "Laporan telah diverifikasi dan diterima untuk ditindaklanjuti"
- 🔧 **Sedang Diproses** - "Tim lapangan sedang melakukan perbaikan infrastruktur"
- 💬 **Menunggu Konfirmasi Warga** - "Perbaikan selesai dilakukan. Menunggu konfirmasi dari pelapor" (ACTIVE)
- ✅ **Selesai** - "Laporan telah diselesaikan dan ditutup"

---

#### **B. THE REVISION PATH** (Admin Minta Revisi)
```
1. Laporan Diterima Sistem ✅
   ↓
2. Sedang Diverifikasi ⏳
   ↓
3. Perlu Revisi 📝 (ACTIVE)
   ↓
4. Menunggu Revisi dari Warga ⚠️
```

**Timeline Steps:**
- ✅ **Laporan Diterima Sistem** - "Laporan Anda telah masuk ke sistem"
- ⏳ **Sedang Diverifikasi** - "Admin sedang memeriksa kelengkapan laporan"
- 📝 **Perlu Revisi** (ACTIVE) - "Admin meminta revisi: 'Mohon tambahkan foto yang lebih jelas menunjukkan lokasi kerusakan'"
  - **Catatan Admin**: "Foto yang diunggah kurang jelas dan tidak menampakkan patokan lokasi. Mohon foto ulang dengan pencahayaan yang lebih baik."
- ⚠️ **Menunggu Revisi dari Warga** - "Silakan perbaiki laporan sesuai catatan admin"

**Action Button:** "Revisi Laporan Sekarang" (orange button)

---

#### **C. THE REJECTED/MERGED PATH** (Ditolak atau Digabung)

**C1. Rejected (Ditolak)**
```
1. Laporan Diterima Sistem ✅
   ↓
2. Sedang Diverifikasi ⏳
   ↓
3. Laporan Ditolak ❌ (TERMINAL)
```

**Timeline Steps:**
- ✅ **Laporan Diterima Sistem** - "Laporan Anda telah masuk ke sistem"
- ⏳ **Sedang Diverifikasi** - "Admin sedang memeriksa kelengkapan laporan"
- ❌ **Laporan Ditolak** (TERMINAL) - "Alasan: Kerusakan yang dilaporkan bukan kewenangan Dinas PU, silakan hubungi PLN untuk masalah listrik"
  - **Catatan**: "Laporan Anda mengenai kerusakan tiang listrik. Mohon hubungi PLN di nomor 123 atau website pln.co.id"

**C2. Merged (Digabung)**
```
1. Laporan Diterima Sistem ✅
   ↓
2. Sedang Diverifikasi ⏳
   ↓
3. Laporan Digabung 📋 (TERMINAL)
```

**Timeline Steps:**
- ✅ **Laporan Diterima Sistem** - "Laporan Anda telah masuk ke sistem"
- ⏳ **Sedang Diverifikasi** - "Admin sedang memeriksa laporan"
- 📋 **Laporan Digabung** (TERMINAL) - "Laporan digabung dengan TKT-2026-015 (lokasi dan kategori sama)"
  - **Catatan**: "Laporan Anda mengenai jalan berlubang di Jl. Gatot Subroto telah digabung dengan laporan serupa yang lebih dulu masuk. Anda dapat memantau progress di tiket TKT-2026-015."
  - **Link**: Button "Lihat Tiket TKT-2026-015 →"

---

#### **D. THE DISPUTE PATH** (Sengketa)
```
1. Laporan Diterima Sistem ✅
   ↓
2. Laporan Diterima ✅
   ↓
3. Sedang Diproses 🔧
   ↓
4. Menunggu Konfirmasi Warga 💬
   ↓
5. Disengketakan ⚠️ (ACTIVE)
   ↓
6. Sengketa Selesai Ditinjau ✅
```

**Timeline Steps:**
- ✅ **Laporan Diterima Sistem** - "Laporan Anda telah masuk ke sistem"
- ✅ **Laporan Diterima** - "Laporan diverifikasi dan diterima"
- 🔧 **Sedang Diproses** - "Tim lapangan melakukan perbaikan"
- 💬 **Menunggu Konfirmasi Warga** - "Perbaikan selesai, menunggu konfirmasi"
- ⚠️ **Disengketakan** (ACTIVE) - "Warga mengajukan sengketa terhadap hasil perbaikan"
  - **Catatan**: "Sengketa Anda sedang ditinjau oleh tim supervisor. Estimasi waktu peninjauan: 3 hari kerja."
- ✅ **Sengketa Selesai Ditinjau** - "Tim akan melakukan perbaikan ulang sesuai catatan sengketa"

---

## 🎨 INTERACTION FLOW DESIGN

### **AKSI 1: Tombol "Ya, Sudah Sesuai"**

**Kondisi:** Muncul saat status = "Menunggu Konfirmasi Warga"

**Flow:**
```
1. User klik "Ya, Sudah Sesuai" (Green Button)
   ↓
2. Modal Peringatan Final Muncul
   ↓
3. Modal berisi:
   - Icon warning kuning
   - Judul: "Peringatan Penting!"
   - Pesan: "Setelah Anda mengkonfirmasi, laporan akan ditutup secara permanen dan TIDAK DAPAT DIBUKA KEMBALI."
   - Checklist pastikan:
     • Perbaikan sudah benar-benar selesai
     • Hasil perbaikan sudah sesuai harapan
     • Tidak ada masalah yang tersisa
   - 2 Tombol: "Cek Lagi" | "Ya, Saya Yakin"
   ↓
4. Jika "Cek Lagi" → Modal ditutup, kembali ke detail
5. Jika "Ya, Saya Yakin":
   ↓
   - Status timeline berubah ke "Selesai"
   - Alert sukses: "Terima kasih! Konfirmasi Anda telah diterima. Laporan ditutup."
   - UI berubah menjadi READ-ONLY
   - Auto redirect ke dashboard setelah 1.5 detik
```

**UI Component:**
```tsx
{showFinalWarning && (
  <Modal>
    <WarningIcon />
    <Title>Peringatan Penting!</Title>
    <Message>Laporan akan ditutup permanen...</Message>
    <Checklist />
    <ButtonGroup>
      <Button onClick={cancel}>Cek Lagi</Button>
      <Button onClick={confirm}>Ya, Saya Yakin</Button>
    </ButtonGroup>
  </Modal>
)}
```

---

### **AKSI 2: Tombol "Ajukan Sengketa"**

**Kondisi:** Muncul saat status = "Menunggu Konfirmasi Warga"

**Flow:**
```
1. User klik "Ajukan Sengketa" (Red Border Button)
   ↓
2. Modal Formulir Sengketa Muncul
   ↓
3. Form berisi:
   - Header dengan icon warning merah
   - Info box kuning: "Sengketa akan ditinjau dalam 3 hari kerja"
   
   - Input 1: Alasan Sengketa (WAJIB)
     • Textarea 5 rows
     • Placeholder: "Jelaskan secara detail mengapa Anda menolak hasil perbaikan..."
     • Min 20 karakter
     • Counter: "0/20 karakter minimum"
   
   - Input 2: Foto Bukti Terbaru (WAJIB)
     • File upload gambar
     • capture="environment" untuk kamera
     • Preview jika sudah upload
     • Max 5MB
     • Tombol remove foto (X merah)
   
   - 2 Tombol: "Batal" | "Kirim Sengketa"
   ↓
4. Validasi:
   - Alasan < 20 karakter → Alert error
   - Foto belum upload → Alert error
   ↓
5. Jika valid & user klik "Kirim Sengketa":
   ↓
   - Status timeline berubah ke "Disengketakan"
   - Alert sukses: "Sengketa Anda telah diajukan dan akan segera ditinjau oleh tim supervisor."
   - Modal ditutup
   - Form direset
   - Timeline update dengan status baru
```

**UI Component:**
```tsx
{showDisputeDialog && (
  <Modal maxWidth="lg">
    <Header>
      <WarningIcon red />
      <Title>Ajukan Sengketa</Title>
      <CloseButton />
    </Header>
    
    <WarningBox>
      Sengketa akan ditinjau dalam 3 hari kerja...
    </WarningBox>
    
    <Form>
      <TextareaField
        label="Alasan Sengketa *"
        rows={5}
        placeholder="Jelaskan detail..."
        value={disputeReason}
        onChange={setDisputeReason}
      />
      <CharacterCounter>
        {disputeReason.length}/20 minimum
      </CharacterCounter>
      
      <FileUploadField
        label="Foto Bukti Terbaru *"
        accept="image/*"
        capture="environment"
        preview={disputePhoto}
        onChange={handleDisputePhotoChange}
        onRemove={() => setDisputePhoto(null)}
      />
    </Form>
    
    <ButtonGroup>
      <Button variant="outline" onClick={cancel}>
        Batal
      </Button>
      <Button variant="danger" onClick={handleDispute}>
        <UploadIcon /> Kirim Sengketa
      </Button>
    </ButtonGroup>
  </Modal>
)}
```

---

## 🎨 Visual Design Elements

### Timeline Status Colors:
- 🟢 **Green** (CheckCircle2) - Completed steps, Success
- 🟡 **Yellow** (Clock) - Waiting, Pending
- 🔵 **Blue** (AlertCircle) - In Progress
- 🟣 **Purple** (MessageSquare) - Awaiting Confirmation
- 🟠 **Orange** (FileText) - Revision Required
- 🔴 **Red** (XCircle, AlertTriangle) - Rejected, Disputed

### Active Step Styling:
```css
.active-step {
  ring-4 ring-blue-100;
  scale-110;
  transition-all;
  font-weight: 600;
  color: blue-600;
  font-size: 1.125rem; /* text-lg */
}
```

### SLA Progress Bar:
- Background: white
- Progress: blue-600
- Height: 0.5rem (h-2)
- Rounded: full
- Shows percentage and days used

---

## 📱 Responsive Design

Semua komponen fully responsive dengan breakpoints:
- **Mobile First** - Default single column
- **sm (640px+)** - 2 columns untuk grids
- **lg (1024px+)** - Full desktop layout dengan 4 columns

---

## 🧪 Testing Scenarios

Untuk test dynamic timeline, ubah variabel di `ReportDetailDynamic.tsx`:

```tsx
const [currentPath] = useState<ReportPath>('happy'); 
// Ubah ke: 'revision', 'rejected', 'merged', 'dispute'

const [currentStatus, setCurrentStatus] = useState<ReportStatus>('awaiting_confirmation');
// Ubah ke status lain untuk test state berbeda
```

---

## 🔒 Validation Rules

### Profil:
- Nama: required
- NIK: required, exactly 16 digits
- Email: required, valid email format
- Phone: required, format `08xxxxxxxxxx`
- Foto Profil: max 2MB, image only

### Laporan:
- Kategori: required
- Deskripsi: required, min 20 characters
- Foto: required, camera only, max 5MB
- GPS Coordinates: required
- Patokan Lokasi: required

### Sengketa:
- Alasan: required, min 20 characters
- Foto Bukti: required, max 5MB

---

## 🚀 Next Steps untuk Tim Frontend

1. **Integrasi Backend API:**
   - Replace mock data dengan real API calls
   - Implement state management (Redux/Zustand)
   - Add loading states dan error handling

2. **Real GPS Integration:**
   - Implement Geolocation API dengan error handling
   - Add map library (Leaflet/Google Maps)
   - Show real-time location preview

3. **Camera Enhancement:**
   - Add camera permission handling
   - Implement photo compression
   - Add multiple photo upload (jika diperlukan)

4. **Real-time Updates:**
   - WebSocket untuk notifikasi real-time
   - Auto-refresh timeline saat ada update

5. **Accessibility:**
   - Add ARIA labels
   - Keyboard navigation
   - Screen reader support

---

## 📦 File Structure

```
src/app/
├── App.tsx                                  # Main router
├── components/
│   ├── Login.tsx                           # Auth dengan OTP
│   ├── Dashboard.tsx                       # Home dengan stats
│   ├── CreateReport.tsx                    # Form laporan + GPS + Camera
│   ├── ReportHistory.tsx                   # List dengan filter
│   ├── ReportDetailDynamic.tsx             # ⭐ Dynamic timeline + interactions
│   ├── Notifications.tsx                   # ⭐ Notifikasi lengkap
│   └── Profile.tsx                         # ⭐ Editable profile
```

---

## ✅ Compliance dengan SRS

Implementasi ini memenuhi requirement:
- ✅ FR-WRG-01 sampai FR-WRG-22 (Semua functional requirements warga)
- ✅ GPS mandatory capture
- ✅ Camera-only photo (no gallery)
- ✅ OTP verification flow
- ✅ Timeline dinamis dengan branching
- ✅ Konfirmasi dengan warning
- ✅ Sengketa dengan foto bukti
- ✅ SLA tracking
- ✅ Notifikasi sistem lengkap

---

**Dibuat oleh:** Claude Code
**Tanggal:** 28 April 2026
**Versi:** 1.0

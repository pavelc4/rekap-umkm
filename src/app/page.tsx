import Image from 'next/image';

// SVG Icon Components for clarity and reuse
const TelegramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
    <path d="M22 2 11 13" />
    <path d="m22 2-7 20-4-9-9-4 20-7z" />
  </svg>
);

const SheetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 13H8" />
    <path d="M16 13h-2" />
    <path d="M16 17h-2" />
    <path d="M10 17H8" />
  </svg>
);

const CodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
);


export default function Home() {
  return (
    <div className="min-h-screen bg-base-100 font-[family-name:var(--font-geist-sans)] text-base-content overflow-y-scroll snap-y snap-mandatory">
      {/* Navbar */}
      <header className="navbar bg-base-100/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex-1">
            <a className="btn btn-ghost text-2xl font-bold text-primary-content">Rekap UMKM</a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero min-h-screen bg-gradient-to-b from-base-200 to-base-100 snap-center py-20">
          <div className="hero-content text-center max-w-4xl mx-auto">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-extrabold text-primary-content leading-tight">
                Pencatatan Keuangan <span className="text-primary">Super Mudah</span> untuk UMKM
              </h1>
              <p className="py-8 text-xl leading-relaxed text-base-content/80">
                Ucapkan selamat tinggal pada pencatatan manual yang rumit. Dengan Rekap UMKM, catat semua pemasukan langsung dari Telegram dan data akan tersimpan rapi di Google Sheets secara otomatis.
              </p>
              <a href="https://t.me/pavelccc_bot" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg rounded-2xl shadow-lg hover:scale-105 transform transition-transform duration-300 text-lg">
                Mulai Gunakan Bot Gratis
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto py-24 px-4 snap-center max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-content">Kenapa Rekap UMKM?</h2>
            <p className="text-base-content/70 mt-4 text-lg">Solusi cerdas untuk bisnis Anda, dirancang untuk kemudahan dan efisiensi.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-screen-lg mx-auto">
            {/* Feature 1: Telegram */}
            <div className="card card-glass rounded-2xl border border-primary/20 hover:shadow-primary/20 shadow-lg transition-all duration-300 transform hover:-translate-y-2 w-full min-h-[300px]">
              <div className="card-body items-center text-center p-8 flex flex-col justify-between">
                <div className="bg-primary/10 p-4 rounded-2xl">
                  <TelegramIcon />
                </div>
                <h3 className="card-title text-2xl font-bold mt-6">Integrasi Telegram</h3>
                <p className="mt-2 text-base-content/80">Cukup kirim pesan ke bot Telegram kami untuk mencatat pemasukan. Semudah mengirim chat!</p>
              </div>
            </div>
            {/* Feature 2: Google Sheets */}
            <div className="card card-glass rounded-2xl border border-primary/20 hover:shadow-primary/20 shadow-lg transition-all duration-300 transform hover:-translate-y-2 w-full min-h-[300px]">
              <div className="card-body items-center text-center p-8 flex flex-col justify-between">
                <div className="bg-primary/10 p-4 rounded-2xl">
                  <SheetIcon />
                </div>
                <h3 className="card-title text-2xl font-bold mt-6">Otomatis ke Google Sheets</h3>
                <p className="mt-2 text-base-content/80">Semua data transaksi Anda akan langsung terorganisir dalam Google Sheet pribadi Anda.</p>
              </div>
            </div>
            {/* Feature 3: Open Source */}
            <div className="card card-glass rounded-2xl border border-primary/20 hover:shadow-primary/20 shadow-lg transition-all duration-300 transform hover:-translate-y-2 w-full min-h-[300px]">
              <div className="card-body items-center text-center p-8 flex flex-col justify-between">
                <div className="bg-primary/10 p-4 rounded-2xl">
                  <CodeIcon />
                </div>
                <h3 className="card-title text-2xl font-bold mt-6">Gratis & Open Source</h3>
                <p className="mt-2 text-base-content/80">Layanan ini sepenuhnya gratis dan dikembangkan secara terbuka untuk komunitas.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-base-200 py-24 snap-center">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-primary-content">Hanya 3 Langkah Mudah</h2>
                <p className="text-base-content/70 mt-4 text-lg">Mulai dalam hitungan menit, tanpa kerumitan.</p>
            </div>
            <ul className="steps steps-vertical lg:steps-horizontal w-full text-lg">
              <li className="step step-primary">Tambahkan Bot ke Telegram</li>
              <li className="step step-primary">Kirim Perintah Pertama Anda</li>
              <li className="step step-primary">Lihat Laporan di Google Sheet</li>
            </ul>
          </div>
        </section>

        {/* Example Usage Section */}
        <section className="container mx-auto py-24 px-4 snap-center max-w-7xl">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-primary-content">Contoh Penggunaan</h2>
                <p className="text-base-content/70 mt-4 text-lg">Lihat betapa mudahnya mencatat transaksi.</p>
            </div>
            <div className="mockup-code rounded-2xl max-w-2xl mx-auto text-left shadow-lg">
                <pre data-prefix="$"><code>/income 150k Penjualan Baju Lengan Panjang</code></pre>
                <pre data-prefix=">" className="text-success"><code>🎉 Berhasil! Income Rp 150.000 (Penjualan Baju Lengan Panjang) sudah dicatat.</code></pre>
                <pre className="bg-base-300/30"> </pre>
                <pre data-prefix="$"><code>/add_new_sheet Laporan Keuangan Juli</code></pre>
                <pre data-prefix=">" className="text-success"><code>✅ Sheet baru "Laporan Keuangan Juli" berhasil dibuat!</code></pre>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer footer-center p-6 bg-base-300 text-base-content snap-end">
        <aside>
          <p>Copyright © 2025 - Dibuat dengan ❤️ untuk UMKM Indonesia</p>
        </aside>
      </footer>
    </div>
  );
}
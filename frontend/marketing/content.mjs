import {getPlan} from '../../server/policy-v4.mjs';
import {templateCatalog} from '../../server/template-catalog.mjs';
import {profilePlans, policyVersion} from '../../server/policy-v4.mjs';
import {profilePages} from '../../server/profile-pages.mjs';

export {profilePlans, policyVersion};
export const templates=templateCatalog.map(t=>({...t,pageCount:Object.keys(profilePages[t.id]||{}).length}));

export const essentials = [
  ['hosting','Hosting & SSL','Selama berlangganan'],
  ['mail','1 email bisnis','Selama berlangganan'],
  ['domain','Domain tahun pertama','Gratis pada paket 12–48 bulan'],
  ['edit','Revisi minor','Tanpa batas jumlah permintaan']
];

export const steps = [
  {title:'Pilih template',body:'Buka desain dan halaman yang sesuai dengan bisnis Anda.'},
  {title:'Pilih paket',body:'Periksa durasi dan total biaya paket yang Anda pilih.'},
  {title:'Kirim informasi bisnis',body:'Lengkapi informasi, logo, foto, dan konten website Anda.'},
  {title:'Tim Rasio menyiapkan website',body:'Kami menyesuaikan template dengan materi bisnis Anda.'},
  {title:'Tinjau hasilnya',body:'Periksa website dan ajukan perubahan sebelum digunakan.'}
];

export const faqs = [
  ['Apakah saya perlu membuat website sendiri?','Tidak. Anda memilih template dan mengirim materi bisnis. Rasio menyiapkan website berdasarkan template tersebut. Setelah tayang, Anda dapat meminta revisi minor atau mengedit field konten yang didukung melalui CMS.'],
  ['Apa saja yang termasuk dalam langganan?','Setup template, hosting, SSL, 1 email bisnis, CMS, revisi minor tanpa batas jumlah, dan AI Chatbot sesuai ketersediaan saat peluncuran. Paket 12, 24, dan 48 bulan juga mendapatkan domain gratis tahun pertama.'],
  ['Apakah domain gratis selama 48 bulan?','Domain gratis selama tahun pertama untuk paket 12, 24, dan 48 bulan. Biaya perpanjangan domain tahun berikutnya ditanggung pelanggan. Pilihan ekstensi, ketersediaan, dan biaya tambahan ditampilkan sebelum pembayaran.'],
  ['Apa yang termasuk revisi minor?','Perubahan konten kecil pada struktur yang sudah ada, seperti nomor WhatsApp, alamat, kalimat pendek, atau foto yang Anda sediakan. Perubahan layout, halaman, fitur, dan integrasi baru memerlukan pembahasan terpisah. Tidak ada batas jumlah permintaan revisi minor selama langganan aktif.'],
  ['Apakah harga per bulan ditagihkan setiap bulan?',`Angka per bulan adalah harga ekuivalen. Paket 12, 24, dan 48 bulan dibayar sekaligus untuk periode yang dipilih. Total selalu ditampilkan bersama harga bulanan. Paket 1 bulan dibayar Rp${getPlan('profile',1).totalPrice.toLocaleString('id-ID')} untuk Profile atau Rp${getPlan('store',1).totalPrice.toLocaleString('id-ID')} untuk Store.`],
  ['Bagaimana perpanjangan dan pembatalannya?','Harga perpanjangan, cara berhenti berlangganan, dan ketentuan pengembalian dana akan dijelaskan sebelum Anda menyetujui pesanan.'],
  ['Apakah saya mendapatkan source code website?','Langganan menggunakan template dan teknologi Rasio selama layanan aktif, bukan pembelian source code. Konten dan aset bisnis tetap milik Anda. Rincian hak penggunaan, ekspor data, dan ketentuan proyek custom dijelaskan dalam ketentuan layanan sebelum pemesanan.'],
  ['Apakah AI Chatbot termasuk dalam paket?','Ya. AI Chatbot termasuk dalam Rasio Profile, Rasio Store, dan Rasio Custom untuk membantu menjawab pertanyaan berdasarkan informasi bisnis Anda. Ketersediaannya mengikuti peluncuran masing-masing layanan.']
];

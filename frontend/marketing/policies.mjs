import {profilePlans} from './content.mjs';
import {rupiah} from './components.mjs';

export const customerPolicies = [
  ['terms.html','Syarat Layanan',[
    ['Layanan website berlangganan','Anda memilih template dan mengirim informasi bisnis. Rasio menyiapkan website, hosting, SSL, dan 1 email bisnis. CMS digunakan untuk memperbarui konten yang didukung template. AI Chatbot termasuk dalam setiap layanan sesuai ketersediaan saat peluncuran.'],
    ['Harga dan pembayaran',profilePlans.map(p=>`${p.months} bulan: ${rupiah(p.totalPrice)} total (${rupiah(p.monthlyEquivalent)}/bulan ekuivalen).`).join(' ')+' Paket dibayar di muka untuk durasi yang dipilih. Total, pajak, dan biaya tambahan harus terlihat sebelum Anda menyetujui pembayaran.'],
    ['Revisi minor tanpa batas','Selama langganan aktif, Anda dapat meminta koreksi teks pendek, kontak, tautan, dan penggantian foto pada tempat yang sudah tersedia. Tidak ada batas jumlah permintaan dalam cakupan ini.'],
    ['Perubahan di luar cakupan','Desain ulang, halaman atau fitur baru, integrasi, serta input data massal memerlukan pembahasan dan persetujuan biaya terpisah. Jadwal pengerjaan disampaikan melalui kanal dukungan.'],
    ['Sebelum berlangganan','Periksa paket, domain, total biaya, perpanjangan, pembatalan, pengembalian dana, serta hak atas konten dan website. Rasio Custom menggunakan penawaran proyek tersendiri.']
  ]],
  ['domain-policy.html','Domain',[
    ['Gratis pada tahun pertama','Paket 12, 24, dan 48 bulan mendapatkan pendaftaran domain gratis selama tahun pertama. Paket 1 bulan tidak termasuk domain gratis.'],
    ['Pilihan dan biaya domain','Ketersediaan nama, ekstensi yang termasuk, batas harga pendaftaran, domain premium, dan biaya tambahan ditampilkan sebelum pembayaran. Anda juga dapat menggunakan domain yang sudah dimiliki. Ketentuan manfaat yang tidak digunakan dijelaskan sebelum pemesanan.'],
    ['Perpanjangan terpisah','Biaya perpanjangan domain tahun kedua dan seterusnya ditanggung pelanggan, termasuk saat langganan website masih aktif. Tanggal kedaluwarsa dan harga domain diinformasikan sebelum pembayaran. Masa aktif domain dapat berbeda dari masa aktif website.'],
    ['Registrasi dan pengelolaan','Data registran mengikuti pelanggan atau bisnis yang berhak serta persyaratan registrar. Pengelolaan teknis oleh Rasio dilakukan atas otorisasi pelanggan.'],
    ['Transfer domain','Berhenti berlangganan website tidak otomatis mengalihkan hak registran kepada Rasio. Transfer mengikuti ketentuan registrar; biaya yang terkait harus dijelaskan sebelum pelaksanaan. Domain tidak digunakan sebagai jaminan tagihan website yang tidak terkait.']
  ]],
  ['cancellation-policy.html','Pembatalan & Pengembalian Dana',[
    ['Berhenti pada akhir periode','Pilihan untuk tidak memperpanjang dan tanggal berakhirnya layanan akan dijelaskan sebelum Anda berlangganan. Berhenti pada akhir periode berbeda dari meminta pengakhiran lebih dini.'],
    ['Pembatalan sebelum website tayang','Permohonan perlu mempertimbangkan apakah setup individual sudah dimulai serta pengeluaran pihak ketiga yang telah disetujui. Tidak ada potongan biaya setup tersembunyi. Domain yang telah didaftarkan tetap mengikuti hak registran.'],
    ['Pengakhiran lebih dini','Penilaian pengembalian dana mempertimbangkan layanan yang sudah dan belum diberikan, biaya pihak ketiga yang telah diungkap, perjanjian, dan hak pelanggan. Tidak berlaku pernyataan bahwa semua pembayaran otomatis hangus.'],
    ['Jika layanan tidak sesuai','Hak pelanggan untuk meminta pemenuhan layanan, pembatalan, atau pengembalian yang layak tidak dihilangkan oleh persetujuan pesanan.'],
    ['Prosedur dan rincian biaya','Sebelum Anda menyetujui pesanan, syarat lengkap akan menjelaskan kanal pengajuan, bukti yang diperlukan, perhitungan refund, waktu pemrosesan, serta jalur keberatan. Tidak ada pembayaran yang dapat dilakukan melalui halaman ini.']
  ]],
  ['renewal-policy.html','Perpanjangan Langganan',[
    ['Periksa periode berikutnya','Paket, durasi, harga per bulan, total, dan tanggal aktif periode berikutnya ditampilkan sebelum konfirmasi. Harga perpanjangan tidak menggunakan harga promosi awal secara otomatis.'],
    ['Persetujuan pembayaran','Mekanisme persetujuan, pilihan tidak memperpanjang, dan pengingat akan dijelaskan sebelum Anda berlangganan. Tidak ada penagihan otomatis melalui halaman ini.'],
    ['Website dan domain','Keduanya memiliki masa aktif terpisah. Pada paket 48 bulan, domain hanya gratis pada tahun pertama. Domain perlu diperpanjang pada tahun berikutnya agar tetap berfungsi.'],
    ['Saat masa aktif berakhir','Ketentuan pengingat, masa tenggang, penghentian layanan, dan pemulihan akses akan tersedia sebelum pemesanan. Tidak ada masa tenggang tertentu yang dijanjikan melalui halaman ini.']
  ]],
  ['ownership-policy.html','Kepemilikan & Data',[
    ['Konten dan aset bisnis','Logo, foto, video, teks, daftar produk, dan data bisnis tetap menjadi milik atau berada di bawah hak penggunaan sah pelanggan. Penggunaannya oleh Rasio terbatas pada kebutuhan penyiapan dan pengelolaan website.'],
    ['Template dan teknologi Rasio','Langganan memberikan hak penggunaan template, CMS, dan teknologi Rasio selama layanan aktif, sesuai ketentuan layanan. Langganan bukan pembelian atau pengalihan source code.'],
    ['Domain dan karya khusus','Hak registran domain mengikuti data pelanggan dan ketentuan registrar. Hak atas karya yang dibuat khusus, output AI, dan proyek Rasio Custom dijelaskan dalam penawaran masing-masing.'],
    ['Ekspor konten','Aset asli dan data bisnis pelanggan dibedakan dari source code, kredensial internal, dan teknologi pihak ketiga. Bentuk ekspor, cara meminta, serta masa akses setelah layanan berakhir akan dijelaskan sebelum pemesanan.'],
    ['Data setelah langganan berakhir','Ketentuan penyimpanan, pemulihan, backup, dan penghapusan data akan tersedia sebelum berlangganan. Pengakhiran layanan tidak berarti seluruh data langsung dihapus atau hak atas aset pelanggan beralih kepada Rasio.']
  ]]
];

export function renderCustomerPolicies({home,asset}){
  const links=customerPolicies.map(([file,title])=>`<a href="${file}">${title}</a>`).join('');
  const shell=(title,content)=>`<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title} — Rasio Labs</title><link rel="stylesheet" href="policy-v4.css"></head><body class="policy-ui"><a class="skip" href="#main">Lewati navigasi</a><header class="policy-header"><a href="${home}"><img src="${asset}rasiolabs-logo.png" width="130" height="43" alt="Rasio Labs"></a><nav aria-label="Navigasi"><a href="${home}#harga">Harga</a><a href="policies.html">Kebijakan</a></nav></header><main id="main" class="policy-main"><h1>${title}</h1>${content}</main><footer class="policy-footer"><nav aria-label="Kebijakan layanan">${links}</nav><small>Rasio Labs</small></footer></body></html>`;
  return [
    ['policies.html',shell('Kebijakan Layanan',`<nav class="policy-index" aria-label="Daftar kebijakan">${links}</nav>`)],
    ...customerPolicies.map(([file,title,sections])=>[file,shell(title,sections.map(([heading,body])=>`<h2>${heading}</h2><p>${body}</p>`).join(''))])
  ];
}

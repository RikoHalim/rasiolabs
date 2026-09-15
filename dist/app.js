const productContent = {
  store: {
    url: "tokomerekanda.com",
    brand: "NAMA BRAND",
    kicker: "KOLEKSI TERBARU",
    title: "Toko milik brand Anda.",
    action: "Lihat produk",
  },
  profile: {
    url: "bisnisanda.id",
    brand: "NAMA BISNIS",
    kicker: "PROFIL PERUSAHAAN",
    title: "Jelaskan bisnis Anda dengan ringkas.",
    action: "Lihat layanan",
  },
};

const tabs = document.querySelectorAll("[data-product]");
const preview = document.querySelector("[data-site-preview]");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const selection = productContent[tab.dataset.product];
    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });

    preview.querySelector("[data-preview-url]").textContent = selection.url;
    preview.querySelector("[data-preview-brand]").textContent = selection.brand;
    preview.querySelector("[data-preview-kicker]").textContent = selection.kicker;
    preview.querySelector("[data-preview-title]").textContent = selection.title;
    preview.querySelector(".preview-button").textContent = selection.action;
  });
});

const domainForm = document.querySelector("[data-domain-form]");
const domainInput = domainForm?.querySelector("input");
const domainStatus = document.querySelector("[data-domain-status]");

domainForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const rawValue = domainInput.value.trim().toLowerCase();
  const cleanedValue = rawValue
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\.[a-z]{2,}$/i, "")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/^-+|-+$/g, "");

  if (!cleanedValue) {
    domainStatus.textContent = "Masukkan nama bisnis tanpa spasi, misalnya rasiostore.";
    domainInput.focus();
    return;
  }

  domainInput.value = cleanedValue;
  domainStatus.innerHTML = `<strong>${cleanedValue}.com</strong> siap diperiksa. <a class="inline-order-link" href="/order.html?domain=${encodeURIComponent(cleanedValue)}.com">Lanjutkan pengecekan →</a>`;
});

const filterButtons = document.querySelectorAll("[data-filter]");
const templateCards = document.querySelectorAll("[data-category]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    templateCards.forEach((card) => {
      const visible = selectedFilter === "all" || card.dataset.category === selectedFilter;
      card.classList.toggle("is-hidden", !visible);
    });
  });
});

document.querySelectorAll(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const answer = item.querySelector(".faq-answer");
    const symbol = button.querySelector("span");
    const willOpen = button.getAttribute("aria-expanded") !== "true";

    button.setAttribute("aria-expanded", String(willOpen));
    answer.hidden = !willOpen;
    symbol.textContent = willOpen ? "−" : "+";
  });
});

const detailDialog = document.createElement('dialog');
detailDialog.className = 'dialog';
detailDialog.setAttribute('aria-label', 'Detail layanan Rasio');
document.body.append(detailDialog);
function showDetail(title, copy, imageUrl, orderUrl) {
  detailDialog.replaceChildren();
  const close = document.createElement('button'); close.className = 'dialog-close'; close.textContent = 'Tutup ×'; close.onclick = () => detailDialog.close();
  const heading = document.createElement('h2'); heading.textContent = title;
  const body = document.createElement('p'); body.textContent = copy;
  detailDialog.append(close, heading);
  if (imageUrl) { const img = document.createElement('img'); img.src = imageUrl; img.alt = title; detailDialog.append(img); }
  detailDialog.append(body);
  if (orderUrl) { const link = document.createElement('a'); link.className = 'button'; link.href = orderUrl; link.textContent = 'Pilih template →'; detailDialog.append(link); }
  detailDialog.showModal();
}
document.querySelectorAll('[data-template-detail]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  const card = link.closest('.template-card');
  showDetail(card.querySelector('h3').textContent,
    card.dataset.category === 'store' ? 'Konsep template toko online: katalog, detail produk, checkout, pesanan, dan chatbot. Logo, warna, foto, serta produk disesuaikan dengan bisnis Anda.' : 'Konsep template company profile: profil bisnis, layanan, portofolio, formulir kontak, dan chatbot. Konten dapat diedit dari dashboard.',
    card.querySelector('img')?.getAttribute('src'), card.querySelector('.button').getAttribute('href'));
}));
document.querySelectorAll('[data-consult]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  showDetail('Ceritakan kebutuhan proyek Anda.', 'Jalur Rasio Custom mencakup website, software internal, marketplace multivendor, dan integrasi khusus. Siapkan tujuan proyek, fitur utama, referensi, dan target waktu. Kanal konsultasi akan tersedia saat Rasio diluncurkan.');
}));

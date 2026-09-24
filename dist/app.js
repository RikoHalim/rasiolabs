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
  const domain = RasioDomain.normalize(domainInput.value);
  const error = RasioDomain.error(domain);
  domainInput.setAttribute('aria-invalid', String(Boolean(error)));
  domainStatus.textContent = error;
  domainStatus.hidden = !error;
  if (error) {
    domainInput.focus();
    return;
  }
  const type = document.querySelector('[data-product][aria-selected="true"]').dataset.product;
  window.location.assign(`/order.html?domain=${encodeURIComponent(domain)}&type=${type}`);
});
domainInput?.addEventListener('input', () => {
  domainInput.removeAttribute('aria-invalid');
  domainStatus.hidden = true;
});

const filterButtons = document.querySelectorAll("[data-filter]");
const sectorButtons = document.querySelectorAll('[data-sector-filter]');
const templateCards = document.querySelectorAll('.template-card[data-category]');
let selectedType = 'all';
let selectedSector = 'all';
function filterTemplates() {
  let count = 0;
  templateCards.forEach(card => {
    const visible = (selectedType === 'all' || card.dataset.category === selectedType) &&
      (selectedSector === 'all' || card.dataset.sector === selectedSector);
    card.hidden = !visible;
    if (visible) count++;
  });
  [[filterButtons, 'filter', selectedType], [sectorButtons, 'sectorFilter', selectedSector]].forEach(([buttons, key, selected]) => {
    buttons.forEach(button => {
      const active = button.dataset[key] === selected;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  });
  document.querySelector('[data-template-count]').textContent = `${count} template untuk bisnis Anda`;
  document.querySelector('[data-template-empty]').hidden = count > 0;
}
filterButtons.forEach(button => button.addEventListener('click', () => {
  selectedType = button.dataset.filter;
  filterTemplates();
}));
sectorButtons.forEach(button => button.addEventListener('click', () => {
  selectedSector = button.dataset.sectorFilter;
  filterTemplates();
}));
document.querySelector('[data-reset-templates]')?.addEventListener('click', () => {
  selectedType = selectedSector = 'all';
  filterTemplates();
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
function showDetail(title, copy, previewNode, orderUrl) {
  detailDialog.replaceChildren();
  const close = document.createElement('button'); close.className = 'dialog-close'; close.textContent = 'Tutup ×'; close.onclick = () => detailDialog.close();
  const heading = document.createElement('h2'); heading.textContent = title;
  const body = document.createElement('p'); body.textContent = copy;
  detailDialog.append(close, heading);
  if (previewNode) { const preview = previewNode.cloneNode(true); preview.classList.add('dialog-template-preview'); detailDialog.append(preview); }
  detailDialog.append(body);
  if (orderUrl) { const link = document.createElement('a'); link.className = 'button'; link.href = orderUrl; link.textContent = 'Pilih template →'; detailDialog.append(link); }
  if (previewNode) {
    const contact = document.createElement('p');
    const whatsapp = document.createElement('a');
    whatsapp.href = 'https://wa.me/60142317052?text=' + encodeURIComponent('Halo Rasio, saya tertarik dengan template ' + title + '.');
    whatsapp.target = '_blank'; whatsapp.rel = 'noopener';
    whatsapp.className = 'text-link'; whatsapp.textContent = 'WhatsApp: +60142317052 ↗';
    contact.append(whatsapp); detailDialog.append(contact);
  }
  detailDialog.showModal();
}
document.querySelectorAll('[data-template-detail]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  const card = link.closest('.template-card');
  showDetail(card.querySelector('h3').textContent,
    card.dataset.category === 'store' ? 'Konsep template toko online: katalog, detail produk, checkout, pesanan, dan chatbot. Logo, warna, foto, serta produk disesuaikan dengan bisnis Anda.' : 'Konsep template company profile: profil bisnis, layanan, portofolio, formulir kontak, dan chatbot. Setup awal dibantu tim Rasio. Anda dapat mengubah teks, gambar, dan logo melalui CMS sederhana; SEO dasar dan tombol WhatsApp sudah termasuk.',
    card.querySelector('.template-media'), card.querySelector('.button').getAttribute('href'));
}));

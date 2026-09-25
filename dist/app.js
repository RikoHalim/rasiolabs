const tabs = document.querySelectorAll("[data-product]");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
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
  const type = document.querySelector('[data-product][aria-pressed="true"]').dataset.product;
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

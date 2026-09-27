(() => {
  const buttons = [...document.querySelectorAll('[data-offer-duration]')];
  const cards = [...document.querySelectorAll('[data-price-service]')];
  if (!buttons.length || !cards.length) return;

  const base = {profile: 109000, store: 210000};
  const discounts = {1: 0, 12: .5, 24: .7, 48: .75};
  const rupiah = amount => `Rp${amount.toLocaleString('id-ID')}`;

  function render(months) {
    const discount = discounts[months];
    buttons.forEach(button => {
      const selected = Number(button.dataset.offerDuration) === months;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    cards.forEach(card => {
      const monthlyNormal = base[card.dataset.priceService];
      const monthly = Math.round(monthlyNormal * (1 - discount));
      const total = monthly * months;
      const normalTotal = monthlyNormal * months;
      card.querySelector('[data-offer-badge]').textContent = discount ? `Diskon ${Math.round(discount * 100)}%` : 'Tanpa diskon';
      card.querySelector('[data-offer-normal]').textContent = `${rupiah(monthlyNormal)}/bulan`;
      card.querySelector('[data-offer-normal]').hidden = !discount;
      card.querySelector('[data-offer-monthly]').innerHTML = `${rupiah(monthly)}<small>/bulan</small>`;
      card.querySelector('[data-offer-billing]').textContent = `Bayar ${months} bulan ${rupiah(total)} sekaligus${discount ? ` (harga normal ${rupiah(normalTotal)})` : ''}. Domain termasuk dalam paket.`;
      const link = card.querySelector('.offer-order');
      const url = new URL(link.href, location.href);
      url.searchParams.set('duration', String(months));
      link.href = url.pathname + url.search;
    });
  }

  buttons.forEach(button => button.addEventListener('click', () => render(Number(button.dataset.offerDuration))));
  render(24);
})();

import {getPlan} from './policy-v4.js';
(() => {
  const buttons = [...document.querySelectorAll('[data-offer-duration]')];
  const cards = [...document.querySelectorAll('[data-price-service]')];
  if (!buttons.length || !cards.length) return;

  const rupiah = amount => `Rp${amount.toLocaleString('id-ID')}`;

  function render(months) {
    const discount = months > 1;
    buttons.forEach(button => {
      const selected = Number(button.dataset.offerDuration) === months;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    cards.forEach(card => {
      const monthlyNormal = getPlan(card.dataset.priceService,1).monthlyEquivalent;
      const plan = getPlan(card.dataset.priceService, months);
      const monthly = plan.monthlyEquivalent;
      const total = plan.totalPrice;
      const normalTotal = monthlyNormal * months;
      card.querySelector('[data-offer-badge]').textContent = plan.badge || ''; 
      card.querySelector('[data-offer-normal]').textContent = `${rupiah(monthlyNormal)}/bulan`;
      card.querySelector('[data-offer-normal]').hidden = !discount;
      card.querySelector('[data-offer-monthly]').innerHTML = `${rupiah(monthly)}<small>/bulan</small>`;
      card.querySelector('[data-offer-billing]').textContent = `Total dibayar di muka ${rupiah(total)} untuk ${months} bulan. Harga per bulan adalah ekuivalen.`;
      const domainBenefit = card.querySelector('[data-domain-benefit]');
      domainBenefit.classList.toggle('domain-not-included', months === 1);
      domainBenefit.textContent = months === 1 ? 'Domain tidak termasuk' : 'Domain gratis tahun pertama';
      domainBenefit.setAttribute('aria-label', months === 1 ? 'Domain gratis: tidak termasuk dalam paket 1 bulan' : 'Domain gratis selama 1 tahun: termasuk dalam paket');
      card.querySelector('.offer-renewal').textContent = 'Tarif perpanjangan diberikan sebelum konfirmasi.';
      if(!card.querySelector('[data-minor-benefit]')){const item=document.createElement('li');item.dataset.minorBenefit='';item.textContent='Revisi minor tanpa batas jumlah selama aktif';card.querySelector('ul')?.append(item);}
      const link = card.querySelector('.offer-order');
      const url = new URL(link.href, location.href);
      url.searchParams.set('duration', String(months));
      link.href = url.pathname + url.search;
    });
  }

  buttons.forEach(button => button.addEventListener('click', () => render(Number(button.dataset.offerDuration))));
  render(24);
})();

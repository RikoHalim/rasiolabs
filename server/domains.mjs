export function domainPrices(raw) {
  if (!raw) return {};
  let input;
  try { input = JSON.parse(raw); } catch { return {}; }
  const result = {};
  for (const extension of ['com', 'id', 'co.id']) {
    const price = input?.[extension];
    if (Number.isSafeInteger(price) && price > 0 && price <= 100000000) result[extension] = price;
  }
  return result;
}

export function domainFee(duration, domain, rawPrices) {
  if (duration !== 1) return null;
  const extension = domain.slice(domain.indexOf('.') + 1);
  return domainPrices(rawPrices)[extension] ?? null;
}

export function quotedDomainFee(order, input) {
  if (order.domain_included !== 0) {
    if (input !== undefined && input !== null && input !== 0) throw new Error('Domain sudah termasuk dalam pesanan ini.');
    return order.domain_fee ?? 0;
  }
  const fee = input === undefined ? order.domain_fee : input;
  if (fee !== null && (!Number.isSafeInteger(fee) || fee <= 0 || fee > 100000000)) throw new Error('Isi harga domain tahunan yang valid.');
  if (order.payment_status === 'verified' && fee !== order.domain_fee) throw new Error('Harga domain pada pesanan yang sudah dibayar tidak dapat diubah.');
  return fee;
}

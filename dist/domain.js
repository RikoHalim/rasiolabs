(() => {
  const normalize = value => value.trim().toLowerCase();
  function error(value) {
    const domain = normalize(value);
    if (!domain || !domain.includes('.')) return 'Masukkan domain lengkap, misalnya namabisnis.com atau namabisnis.co.id.';
    const labels = domain.split('.');
    const validLabel = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
    if (domain.length > 253 || !labels.every(label => validLabel.test(label)) || !/^[a-z]{2,63}$/.test(labels.at(-1))) {
      return 'Periksa format domain. Gunakan nama tanpa spasi, diikuti .com, .co.id, atau ekstensi lainnya.';
    }
    return '';
  }
  window.RasioDomain = { normalize, error };
})();

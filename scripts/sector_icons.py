"""Small two-tone SVG illustrations for the service industry cards."""

ART = {
 'fashion': '<path fill="#cddcff" d="m12 6-7 4 3 6 4-2v13h16V14l4 2 3-6-7-4-4 3h-8z"/><path d="m12 6-7 4 3 6 4-2v13h16V14l4 2 3-6-7-4c-1 5-11 5-12 0Z"/>',
 'beauty': '<rect x="12" y="13" width="16" height="19" rx="4" fill="#cddcff"/><path d="M12 19h16M16 13V8h8v5M20 8V4h9M29 4v3"/><path d="M18 24h4"/>',
 'home': '<path d="m6 18 14-12 14 12M10 15v17h20V15"/><path fill="#cddcff" d="M16 32V21h8v11"/>',
 'food': '<path fill="#cddcff" d="M10 10h20l-2 22H12z"/><path d="M10 10h20l-2 22H12ZM10 10l4-5h12l4 5M15 16h10"/><path d="M16 23h8M18 27h4"/>',
 'hobby': '<path fill="#cddcff" d="M8 13h24v17H8z"/><path d="M8 13h24v17H8zM15 13v-3a5 5 0 0 1 10 0v3M14 20h5m-2.5-2.5v5"/><circle cx="26" cy="21" r="1.5" fill="currentColor" stroke="none"/>',
 'electronics': '<rect x="8" y="7" width="24" height="19" rx="3" fill="#cddcff"/><path d="M8 26 5 32h30l-3-6M17 29h6M16 13l-3 4 3 4m8-8 3 4-3 4"/>',
 'sport': '<path d="M14 20h12M5 16v8m30-8v8"/><rect x="8" y="11" width="6" height="18" rx="2" fill="#cddcff"/><rect x="26" y="11" width="6" height="18" rx="2" fill="#cddcff"/>',
 'family': '<path fill="#cddcff" d="M9 17h24c0 8-5 12-12 12S9 25 9 17Z"/><path d="M21 17V5c7 0 12 5 12 12M9 17 7 10H3"/><circle cx="14" cy="33" r="2"/><circle cx="28" cy="33" r="2"/>',
 'pet': '<path fill="#cddcff" d="M20 20c-4 0-12 8-10 12s7 0 10 0 8 4 10 0-6-12-10-12Z"/><ellipse cx="9" cy="17" rx="3" ry="4"/><ellipse cx="16" cy="10" rx="3" ry="4"/><ellipse cx="25" cy="10" rx="3" ry="4"/><ellipse cx="32" cy="17" rx="3" ry="4"/>',
 'craft': '<path d="m13 25 16-19M13 15l16 19M20 20l3-3"/><circle cx="10" cy="12" r="5" fill="#cddcff"/><circle cx="10" cy="28" r="5" fill="#cddcff"/>',
 'consulting': '<rect x="6" y="12" width="28" height="20" rx="4" fill="#cddcff"/><path d="M14 12V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4M6 20c9 5 19 5 28 0M18 21h4v5h-4z"/>',
 'building': '<rect x="10" y="5" width="20" height="29" rx="2" fill="#cddcff"/><path d="M6 34h28M16 11h2m4 0h2M16 17h2m4 0h2M16 23h2m4 0h2M17 34v-6h6v6"/>',
 'education': '<path fill="#cddcff" d="m3 14 17-8 17 8-17 8z"/><path d="m3 14 17-8 17 8-17 8ZM10 18v10c6 5 14 5 20 0V18M36 15v12"/>',
 'factory': '<path fill="#cddcff" d="M6 33V18l10-6v8l9-6v19z"/><path d="M6 33V18l10-6v8l9-6v19ZM26 33h9L32 5h-5l-1 14M11 26h2m7 0h2M5 33h30"/>',
 'hospitality': '<path d="M5 15v19M35 20v14M5 29h30"/><path fill="#cddcff" d="M5 23h30v6H5zM19 17h11a5 5 0 0 1 5 5v1H19z"/><rect x="9" y="17" width="7" height="6" rx="2"/>',
 'health': '<path fill="#cddcff" d="M15 6h10v9h9v10h-9v9H15v-9H6V15h9z"/>',
 'law': '<path d="M20 6v28M12 34h16M8 12h24M20 6l-3 3m3-3 3 3M9 12 4 24h10L9 12Zm22 0-5 12h10l-5-12Z"/><path fill="#cddcff" d="M4 24h10a5 5 0 0 1-10 0m22 0h10a5 5 0 0 1-10 0"/>',
 'travel': '<path fill="#cddcff" d="m5 17 13 3L30 7c4-4 7-1 3 3L21 23l3 12-4 1-5-10-7 4-3-3 5-7-6-1z"/>',
 'restaurant': '<path d="M10 6v10m-4-10v8a4 4 0 0 0 8 0V6M10 18v16M29 6v28M29 6c-6 3-7 10-7 15h7"/><path fill="#cddcff" d="M29 6c-6 3-7 10-7 15h7Z"/>',
 'community': '<circle cx="20" cy="12" r="5" fill="#cddcff"/><path fill="#cddcff" d="M11 33v-5a9 9 0 0 1 18 0v5z"/><path d="M7 13a4 4 0 0 0 0 8M33 13a4 4 0 0 1 0 8M5 26c-2 2-2 4-2 7h4M35 26c2 2 2 4 2 7h-4"/>',
 'market': '<path d="M7 18v16h26V18M15 34V24h10v10"/><path fill="#cddcff" d="m8 6-4 11a4 4 0 0 0 8 0 4 4 0 0 0 8 0 4 4 0 0 0 8 0 4 4 0 0 0 8 0L32 6z"/><path d="M14 6l-2 11m8-11v11m6-11 2 11"/>',
 'logistics': '<path fill="#cddcff" d="M4 10h20v20H4zM24 18h8l5 6v6H24z"/><path d="M24 18h8l5 6H24"/><circle cx="11" cy="30" r="4" fill="white"/><circle cx="30" cy="30" r="4" fill="white"/>',
 'booking': '<rect x="6" y="8" width="28" height="26" rx="4" fill="#cddcff"/><path d="M6 16h28M13 5v7m14-7v7m-13 12 4 4 8-8"/>',
 'operations': '<rect x="13" y="5" width="14" height="10" rx="2" fill="#cddcff"/><rect x="4" y="26" width="12" height="9" rx="2" fill="#cddcff"/><rect x="24" y="26" width="12" height="9" rx="2" fill="#cddcff"/><path d="M20 15v6M10 26v-5h20v5"/>',
 'property': '<circle cx="13" cy="14" r="8" fill="#cddcff"/><path d="m19 20 14 14m-5-5 4-4m-9-1 4-4"/><circle cx="11" cy="12" r="2"/>',
 'finance': '<path d="M5 6v28h30"/><path fill="#cddcff" d="M10 24h5v10h-5zM20 17h5v17h-5zM30 8h5v26h-5z"/><path d="m10 17 9-9 4 3 8-7"/>'
}

NAMES = {
 'Fashion & aksesori':'fashion','Beauty & skincare':'beauty','Home & living':'home','Makanan kemasan':'food','Hobi & lifestyle':'hobby','Elektronik & gadget':'electronics','Olahraga & outdoor':'sport','Ibu & anak':'family','Pet supplies':'pet','Kerajinan lokal':'craft',
 'Konsultan & jasa':'consulting','Properti & konstruksi':'building','Pendidikan & kursus':'education','Manufaktur & B2B':'factory','Hospitality & kreatif':'hospitality','Klinik & wellness':'health','Firma hukum':'law','Travel & wisata':'travel','F&B & hospitality':'restaurant','Organisasi & komunitas':'community',
 'Marketplace multivendor':'market','Distribusi & logistik':'logistics','Layanan & reservasi':'booking','Pendidikan & komunitas':'education','Operasional perusahaan':'operations','Manufaktur':'factory','Retail & grosir':'market','Properti':'property','Kesehatan':'health','Keuangan perusahaan':'finance'
}

def sector_icon(title):
    art = ART[NAMES[title]]
    return f'<span class="sector-icon" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" focusable="false">{art}</svg></span>'

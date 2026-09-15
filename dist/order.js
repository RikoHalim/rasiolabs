const orderShell = document.querySelector("[data-order-shell]");

if (orderShell) {
  const params = new URLSearchParams(window.location.search);
  const initialType = params.get("type") === "profile" ? "profile" : "store";
  const requestedTemplate = params.get("template");
  const initialTemplate = ['Mono', 'Kanasari', 'Sora'].includes(requestedTemplate) ? requestedTemplate : (initialType === "profile" ? "Mono" : "Kanasari");
  const requestedDomain = RasioDomain.normalize(params.get('domain') || '');
  const initialDomain = RasioDomain.error(requestedDomain) ? '' : requestedDomain;

  let currentStep = 1;
  let selectedPackage = initialType;
  let selectedTemplate = initialTemplate;
  let selectedDomain = '';

  const packageNames = { profile: "Rasio Profile", store: "Rasio Store" };
  const panels = [...document.querySelectorAll("[data-step-panel]")];
  const stepButtons = [...document.querySelectorAll("[data-go-step]")];
  const nextButton = document.querySelector("[data-next]");
  const previousButton = document.querySelector("[data-previous]");
  const progressBar = document.querySelector("[data-progress-bar]");
  const stepLabel = document.querySelector("[data-step-label]");
  const businessForm = document.querySelector("[data-business-form]");
  const summaryToggle = document.querySelector("[data-summary-toggle]");

  summaryToggle.addEventListener("click", () => {
    const summary = summaryToggle.closest(".order-summary");
    const isOpen = summary.classList.toggle("is-open");
    summaryToggle.setAttribute("aria-expanded", String(isOpen));
    summaryToggle.firstChild.textContent = isOpen ? "Tutup rincian " : "Lihat rincian ";
    summaryToggle.querySelector("span").textContent = isOpen ? "−" : "+";
  });

  function updateSummary() {
    const packageName = packageNames[selectedPackage];
    document.querySelectorAll("[data-summary-template], [data-selected-template], [data-review-template]")
      .forEach((node) => { node.textContent = selectedTemplate; });
    document.querySelectorAll("[data-summary-package], [data-review-package]")
      .forEach((node) => { node.textContent = packageName; });
    document.querySelectorAll("[data-summary-domain], [data-review-domain]")
      .forEach((node) => { node.textContent = selectedDomain || "Belum dipilih"; });
  }

  function setStep(step) {
    currentStep = Math.min(4, Math.max(1, step));
    panels.forEach((panel) => {
      const active = Number(panel.dataset.stepPanel) === currentStep;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
    stepButtons.forEach((button) => {
      const number = Number(button.dataset.goStep);
      button.classList.toggle("is-active", number === currentStep);
      button.classList.toggle("is-complete", number < currentStep);
      if (number === currentStep) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    previousButton.disabled = currentStep === 1;
    nextButton.hidden = currentStep === 4;
    stepLabel.textContent = `Langkah ${String(currentStep).padStart(2, "0")} / 04`;
    progressBar.style.width = `${currentStep * 25}%`;
    updateSummary();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  nextButton.addEventListener("click", () => {
    if (currentStep === 1 && !selectedDomain) {
      const error = RasioDomain.error(domainInput.value);
      if (!error && results.hidden) renderDomainResults();
      domainStatus.hidden = false;
      domainStatus.textContent = error || 'Pilih salah satu domain di bawah untuk melanjutkan.';
      if (error) { domainInput.setAttribute('aria-invalid', 'true'); domainInput.focus(); }
      else results.querySelector('button')?.focus();
      return;
    }

    if (currentStep === 3 && !businessForm.reportValidity()) return;
    setStep(currentStep + 1);
  });

  previousButton.addEventListener("click", () => setStep(currentStep - 1));

  stepButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const destination = Number(button.dataset.goStep);
      if (destination <= currentStep) setStep(destination);
    });
  });

  const domainForm = document.querySelector("[data-order-domain-form]");
  const domainInput = document.querySelector("#order-domain");
  const results = document.querySelector("[data-domain-results]");
  const domainStatus = document.querySelector('[data-order-domain-status]');

  if (initialDomain) domainInput.value = initialDomain;

  domainForm.addEventListener("submit", (event) => {
    event.preventDefault();
    renderDomainResults();
  });

  domainInput.addEventListener('input', () => {
    selectedDomain = '';
    results.hidden = true;
    domainStatus.hidden = true;
    domainInput.removeAttribute('aria-invalid');
    domainForm.classList.remove('needs-input');
    updateSummary();
  });

  function renderDomainResults() {
    const domain = RasioDomain.normalize(domainInput.value);
    const error = RasioDomain.error(domain);
    domainInput.setAttribute('aria-invalid', String(Boolean(error)));
    domainStatus.textContent = error;
    domainStatus.hidden = !error;
    if (error) {
      domainForm.classList.add("needs-input");
      domainInput.focus();
      return;
    }

    domainInput.value = domain;
    selectedDomain = '';
    updateSummary();
    domainForm.classList.remove("needs-input");
    results.hidden = false;
    const name = domain.split('.')[0];
    const domains = [...new Set([domain, `${name}.com`, `${name}.id`, `${name}.co.id`])];
    results.innerHTML = '<p class="domain-results-note">Contoh pilihan domain. Ketersediaan dan harga belum diperiksa pada prototipe ini.</p>' + domains.map((choice, index) => `
      <button class="domain-result${index === 0 ? " is-recommended" : ""}" type="button" data-domain-choice="${choice}" aria-pressed="false">
        <span><b>${choice}</b><small>${index === 0 ? "Domain yang Anda cari" : "Alternatif domain"}</small></span>
        <span><small>Harga</small><strong>Dari API registrar</strong></span>
        <i aria-hidden="true">Pilih →</i>
      </button>
    `).join("");

    results.querySelectorAll("[data-domain-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedDomain = button.dataset.domainChoice;
        domainStatus.hidden = true;
        results.querySelectorAll(".domain-result").forEach((item) => {
          item.classList.toggle("is-selected", item === button);
          item.setAttribute('aria-pressed', String(item === button));
        });
        updateSummary();
      });
    });
  }

  document.querySelector("[data-existing-domain]").addEventListener("click", () => {
    selectedDomain = "Domain milik sendiri";
    domainStatus.hidden = true;
    domainInput.removeAttribute('aria-invalid');
    domainForm.classList.remove('needs-input');
    results.hidden = false;
    results.innerHTML = '<div class="existing-domain-state"><b>Domain milik sendiri dipilih</b><span>Tim Rasio akan mengirim panduan pengaturan DNS setelah pembayaran.</span></div>';
    updateSummary();
  });

  document.querySelectorAll("[data-package]").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.package === selectedPackage);
    button.addEventListener("click", () => {
      selectedPackage = button.dataset.package;
      document.querySelectorAll("[data-package]").forEach((item) => item.classList.toggle("is-selected", item === button));
      if (selectedPackage === 'profile') selectedTemplate = 'Mono';
      else if (selectedTemplate === 'Mono') selectedTemplate = 'Kanasari';
      updateSummary();
    });
  });

  const consent = document.querySelector("[data-review-consent]");
  const checkoutButton = document.querySelector("[data-demo-checkout]");
  const checkoutNote = document.querySelector("[data-checkout-note]");

  consent.addEventListener("change", () => { checkoutButton.disabled = !consent.checked; });
  checkoutButton.addEventListener("click", () => {
    checkoutNote.textContent = "Prototipe selesai. Pada versi produksi, tombol ini membuka checkout payment gateway.";
    checkoutNote.classList.add("is-confirmed");
  });

  updateSummary();
  if (initialDomain) renderDomainResults();
  setStep(1);
}

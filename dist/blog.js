(() => {
  const library = document.querySelector('.blog-library');
  if (!library) return;
  const buttons = [...library.querySelectorAll('[data-blog-filter]')];
  const cards = [...library.querySelectorAll('[data-blog-category]')];
  const count = library.querySelector('[data-blog-count]');
  buttons.forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.blogFilter;
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let visible = 0;
    cards.forEach(card => {
      card.hidden = selected !== 'all' && card.dataset.blogCategory !== selected;
      if (!card.hidden) visible++;
    });
    count.textContent = `${visible} artikel${selected === 'all' ? '' : ' · ' + button.textContent}`;
  }));
})();

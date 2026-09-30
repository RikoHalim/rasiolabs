(() => {
  const track = document.querySelector('.testimonial-loop-track');
  const group = track?.querySelector('.testimonial-loop-group');
  if (!track || !group) return;

  const duplicate = group.cloneNode(true);
  duplicate.setAttribute('aria-hidden', 'true');
  track.append(duplicate);
  track.classList.add('is-ready');
})();

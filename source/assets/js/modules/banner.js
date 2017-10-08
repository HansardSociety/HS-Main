const bannerHeight = () => {
  const vhFull = Math.max(window.innerHeight);
  const vhSemi = Math.max(window.innerHeight * .6666);
  const bannerFull = document.querySelector('.banner--full');
  const bannerSemi = document.querySelector('.banner--semi');

  if (bannerFull) bannerFull.style.height = `${ vhFull }px`;
  if (bannerSemi) bannerSemi.style.height = `${ vhSemi }px`;
}

export { bannerHeight }

const hDrag = (() => {
  const containers = document.querySelectorAll('.JS-h-drag');
  let isDown = false;
  let startX;
  let scrollLeft;

  containers.forEach(function (drag) {
    drag.addEventListener('mousedown', (e) => {
      isDown = true;
      drag.classList.add('JS-active');
      startX = e.pageX - drag.offsetLeft;
      scrollLeft = drag.scrollLeft;
    });

    drag.addEventListener('mouseleave', () => {
      isDown = false;
      drag.classList.remove('JS-active');
    });

    drag.addEventListener('mouseup', () => {
      isDown = false;
      drag.classList.remove('JS-active');
    });

    drag.addEventListener('mousemove', (e) => {
      if(!isDown) return;
      e.preventDefault();

      const x = e.pageX - drag.offsetLeft;
      // const walk = (x - startX) * 3; //scroll-fast
      const walk = x - startX; //scroll-fast

      drag.scrollLeft = scrollLeft - walk;

      // console.log(walk);
    });
  });
})();

export { hDrag }

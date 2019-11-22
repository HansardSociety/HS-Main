const imgCaptions = (() => {
  let copyElems = document.querySelectorAll(".copy--lp");

  if (copyElems) {
    copyElems.forEach((copyElem) => {
      let imgElems = copyElem.querySelectorAll("img");

      if (imgElems) {
        imgElems.forEach((imgElem) => {
          let alt = imgElem.getAttribute("alt");
          let caption = document.createElement("span");

          caption.innerHTML = alt;
          caption.classList.add("img-caption")

          imgElem.parentElement.appendChild(caption);
        });
      }
    });
  }
  return;
})();

export { imgCaptions }

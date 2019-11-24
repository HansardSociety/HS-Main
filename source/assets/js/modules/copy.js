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

const setIcons = (() => {
  let tocLinks = document.querySelectorAll(".toc-link");
  let iconTemplate = document.querySelector("script[id='icon-template']").innerHTML.replace(/`/g, "");

  if (tocLinks) {
    tocLinks.forEach((el) => {
      let tocText = el.innerText;
      let tocIcon = iconTemplate
        .replace("{{icon}}", "ios-arrow-thin-up")
        .replace("{{size}}", "xs");

      el.innerHTML = tocIcon.trim() + tocText.trim();
    });
  }
  return;
})();

export { imgCaptions, setIcons }

const setIcons = (() => {
  let tocLinks = document.querySelectorAll(".toc-link");

  if (tocLinks) {
    let iconTemplate = document.querySelector("script[id='icon-template']");

    if (iconTemplate) {
      iconTemplate = iconTemplate.innerHTML.replace(/`/g, "");

      tocLinks.forEach((el) => {
        let tocText = el.innerText;
        let tocIcon = iconTemplate
          .replace("{{icon}}", "ios-arrow-thin-up")
          .replace("{{size}}", "xs");

        el.innerHTML = tocIcon.trim() + tocText.trim();
      });
    }
  }
  return;
})();

export { setIcons }

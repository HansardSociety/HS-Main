
const historyNav = (() => {
  if (document.querySelector(".page-storage")) {
    const histBtn = document.querySelector(".hist-btn");
    const title = document.querySelector(".banner__title").innerText;
    const path = window.location.pathname;

    let category = document.querySelector(".banner__content .meta-label > a:nth-child(1)").innerText.toLowerCase();
    let subCategory = document.querySelector(".banner__content .meta-label > a:nth-child(2)");
    subCategory = subCategory ? subCategory.innerText.toLowerCase() : null;

    let storedPages = sessionStorage.getItem("pages");

    if (!storedPages) {
      storedPages = [];

      storedPages.unshift({
        title,
        path,
        category: category,
        subCategory: subCategory
      });
      storedPages = JSON.stringify(storedPages);

      sessionStorage.setItem("pages", storedPages);

    } else {

      // Parse JSON
      storedPages = JSON.parse(storedPages).slice(0, 5); // parse and slice to first 6
      storedPages = storedPages.filter(page => page.path !== path); // de-dupe
      storedPages.unshift({
        title,
        path,
        category: category,
        subCategory: subCategory
      }); // set page data

      // Create hist elems
      function createHistItem(pageTitle, pagePath, pageCategory, pageSubCategory) {
        let histBtnItemTmpl = histBtn.querySelector(".hist-btn__tmpl").innerHTML;
        let elem = document.createElement("li");

        elem.innerHTML = histBtnItemTmpl;

        let link = elem.querySelector(".hist-btn__link");
        let cat = elem.querySelector(".hist-btn__cat");

        link.setAttribute("href", pagePath);
        link.setAttribute("title", `Go to: ${ pageTitle }`);
        link.innerText = pageTitle;
        link.classList.remove("is-active");

        let catHtml = `<a href="/${ pageCategory }" title="Go to: ${ pageCategory }">${ pageCategory }</a>`;
        if (pageSubCategory) {
          catHtml += ` / <a href="/${ pageCategory }/${ pageSubCategory }" title="Go to: ${ pageSubCategory }">${ pageSubCategory }</a>`;
        }
        cat.innerHTML = catHtml;

        return elem;
      }

      storedPages.forEach(page => {
        let histItemElem = createHistItem(
          page.title,
          page.path,
          page.category,
          page.subCategory
        );

        if (page.path !== path) {
          histBtn.querySelector(".hist-btn__recent > .hist-btn__section").appendChild(histItemElem);

        }
      });

      // Create storage item
      storedPages = JSON.stringify(storedPages);
      sessionStorage.setItem("pages", storedPages);
    }
  }
})();

export { historyNav }

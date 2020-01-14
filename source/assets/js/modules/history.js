
const historyNav = (() => {
  const pageStorageElem = document.querySelector(".page-storage")
  
  if (pageStorageElem) {
    const histBtn = document.querySelector(".hist-btn");
    const path = window.location.pathname;

    const pageData = JSON.parse(pageStorageElem.dataset.pageStorage);

    let title = pageData.title;
    let category = pageData.category;
    let subCategory = pageData.subCategory;

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

      // Show prev-page button
      if (storedPages.length > 1) {
        histBtn.classList.add("has-page-storage");

        const prevPageBtn = histBtn.querySelector(".hist-btn__off > .btn:nth-child(2)");
        prevPageBtn.addEventListener("click", function(e) {
          e.preventDefault;
          history.back();
        });
      }

      // Create hist elems
      function createHistItem(pageTitle, pagePath, pageCategory, pageSubCategory) {
        pageTitle = decodeURIComponent(pageTitle.replace(/\+/g, "%20"));

        console.log(pageTitle)

        let histBtnItemTmpl = histBtn.querySelector(".hist-btn__tmpl").innerHTML;
        let elem = document.createElement("li");

        elem.innerHTML = histBtnItemTmpl;

        let link = elem.querySelector(".hist-btn__link");
        let cat = elem.querySelector(".hist-btn__cat");

        link.setAttribute("href", pagePath);
        link.setAttribute("title", `Go to: ${ pageTitle }`);
        link.innerText = pageTitle.length > 90 ? pageTitle.substring(0, 89).trim() + "…" : pageTitle;
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

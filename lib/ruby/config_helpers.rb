module ConfigHelpers
  def siteCategories(level)
    categories = {
      top_all: ["about", "blog", "events", "insight", "legal", "projects", "publications"],
      top_main: ["events", "insight", "blog", "publications", "projects"],
      sub: ["education", "training", "research"]
    }
    categories[level]
  end

  def feedPages(pagesData, categoryLev = :category)
    rejectIndices = pagesData.reject{ |id, page| page.index_page == true }
    pagesByDate = rejectIndices.sort_by{ |id, page| - page[:date_time][:integer] }

    mainCats = siteCategories(:top_main)
    mainSubCats = siteCategories(:sub)

    if categoryLev == :sub_category
      categories = mainSubCats
    else
      categories = mainCats
    end

    pagesByCategory = pagesByDate.group_by{ |id, page| page[categoryLev] }.compact
    selectedPages = pagesByCategory.select{ |category, pages| categories.include? category }

    yield(selectedPages)
  end
end

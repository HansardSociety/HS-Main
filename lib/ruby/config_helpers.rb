module ConfigHelpers

  def feedPages(pagesData, categoryLev = :category)
    pagesByDate = pagesData.sort_by{ |id, page| - page[:date_time][:integer] }

    mainCats = ["blog", "events", "research", "resources", "intelligence"]
    mainSubCats = ["training", "publications"]

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

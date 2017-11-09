module ConfigHelpers

  def feedPages(pagesData)
    pagesByDate = pagesData.sort_by{ |id, page| - page[:date_time][:integer] }
    mainCategories = ["blog", "events", "research", "resources", "intelligence"]
    pagesByCategory = pagesByDate.group_by{ |id, page| page[:category] }
    mainCategoryPages = pagesByCategory.select{ |category, pages| mainCategories.include? category }

    yield(mainCategoryPages)
  end
end

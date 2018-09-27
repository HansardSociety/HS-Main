require "yaml"

module ConfigHelpers

  def siteConfig
    YAML.load_file("data/hs/universal/5mkIBy6FCEk8GkOGKEQKi4.yaml")[:site_config]
  end

  ##		=Category levels
  ########################################

  def siteCategories(level)

    topCategoriesAll = []
    siteConfig[:categories].map do |cat|
      topCategoriesAll << cat[:name]
    end

    topCategoriesMain = []
    siteConfig[:categories].select{|cat| cat[:enable_tagging]}.map do |cat|
      topCategoriesMain << cat[:name]
    end

    subCategories = []
    siteConfig[:categories].select{|cat| cat[:sub_categories]}.map do |cat|
      cat[:sub_categories].map do |subCat|
        subCategories << subCat
      end
    end

    categories = {
      top_all: topCategoriesAll,
      top_main: topCategoriesMain,
      sub: subCategories
    }

    categories[level]
  end

  ##		=Feed pages
  ########################################

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

  ##		=Theme pages
  ########################################

  def getThemePages(srcPages, themeName)
    srcPages.select{|id, page|
      page[:theme] && page[:theme].include?(themeName)
    }.sort_by{|id, page|
      - page[:date_time][:integer]
    }
  end
end

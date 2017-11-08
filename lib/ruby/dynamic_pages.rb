def proxyBase(url, template, data)
  proxy url, template, ignore: true, locals: { entry_data: data }
end

def dynPageBase(data, template)
  data.each do |id, entryData|
    slug = entryData.slug
    viewTemplate = "/views/templates/#{ template }.html"

    proxy "/#{ slug }.html",
          viewTemplate,
          ignore: true,
          locals: { entry_data: entryData }
  end
end

module DynamicPages

  ###########################################################################
  ##		=Contentful pages
  ###########################################################################

  def dynamicContentfulPages(env)

    # Only run if data dir exists
    if Dir.exist?(config.data_dir)
      childPages = data.hs.child_page
      landingPages = data.hs.landing_page

      ##		=Core pages
      ########################################

      dynPageBase(data.hs.homepage, "home")
      dynPageBase(childPages, "child-page")
      dynPageBase(landingPages, "landing-page")

      ##		=Feed pages
      ########################################

      # Middleman development error with merged data, but works fine
      # in build envs - workaround so we can at least work on feed pages
      # in development.
      allPages = (env == "dev" ? childPages : childPages.merge(landingPages))

      mainCategories = ["blog", "events", "research", "resources", "intelligence"]
      pagesByCategory = allPages.group_by{ |id, page| page[:category] }
      mainCategoryPages = pagesByCategory.select{ |category, pages| mainCategories.include? category }

      mainCategoryPages.each do |category, pages|
        paginatePages = pages.each_slice(5).to_a

        paginatePages.each_with_index do |paginatedPagesData, index|
          url = "/#{ category }/feed/page-#{ index + 1 }.html"
          viewTemplate = "/views/templates/feed-page.html"

          proxy url,
                viewTemplate,
                ignore: true,
                layout: "fetch",
                locals: { entry_data: "paginatedPagesData" }
        end
      end
    end
  end

  ###########################################################################
  ##		=Custom pages
  ###########################################################################

  def dynamicCustomPages()

    # AJAX elements
    # proxy "/ajax.html", "/views/templates/ajax.html", :layout => false
  end
end

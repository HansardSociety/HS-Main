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

# Feed pages for infinite-scroll
# def feedPages()
#   childPages = data.hs.child_page
#   landingPages = data.hs.landing_page
#   allPages = landingPages.merge(childPages)

#   pagesByCategory = allPages.group_by{ |page| page[:category] }

#   pagesWithSubCategory = allPages.select{ |page| page[:sub_category] != nil }
#   pagesBySubCategory = pagesWithSubCategory.group_by{ |page| page[:sub_category] }

#   pagesByCategory.each do |id, entryData|
#     slug = entryData.slug

#     proxy "/#{ slug }.html",
#           "/views/templates/feed-page.html",
#           ignore: true,
#           locals: { entry_data: entryData }
#   end
# end

module DynamicPages

  # Contentful pages
  def dynamicContentfulPages()

    # Only run if data dir exists
    if Dir.exist?(config.data_dir)

      # Core templates
      dynPageBase(data.hs.homepage, "home")
      dynPageBase(data.hs.child_page, "child-page")
      dynPageBase(data.hs.landing_page, "landing-page")
    end
  end

  # Custom pages
  def dynamicCustomPages()

    # AJAX elements
    # proxy "/ajax.html", "/views/templates/ajax.html", :layout => false
  end
end

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

  # Contentful pages
  def dynamicContentfulPages()

    # Only run if data dir exists
    if Dir.exist?(config.data_dir)

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

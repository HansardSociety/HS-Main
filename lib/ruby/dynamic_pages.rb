def proxyBase(url, template, data)
  proxy url, template, ignore: true, locals: { entry_data: data }
end

def dynPageBase(data, template)
  data.each do |id, entry_data|
    slug = entry_data.slug
    category = entry_data.category
    sub_category = (entry_data.sub_category if entry_data.sub_category)
    viewTemplate = "/views/templates/#{ template }.html"

    if template == "home"
      proxyBase("/index.html", viewTemplate, entry_data)

    elsif !sub_category && sub_category != "none"
      proxyBase("#{ category }/#{ slug }.html", viewTemplate, entry_data)

    else
      proxyBase("#{ category }/#{ sub_category }/#{ slug }.html", viewTemplate, entry_data)
    end
  end
end

module DynamicPages

  ##		=Contentful pages
  ########################################

  def dynamicContentfulPages()

    # Only run if data dir exists
    if Dir.exist?(config.data_dir)

      dynPageBase(data.hs.homepage, "home")
      dynPageBase(data.hs.child_page, "child-page")
      dynPageBase(data.hs.landing_page, "landing-page")
    end
  end

  ##		=Custom pages
  ########################################

  def dynamicCustomPages()

    # AJAX elements
    # proxy "/ajax.html", "/views/templates/ajax.html", :layout => false
  end
end

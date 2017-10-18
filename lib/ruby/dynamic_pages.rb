def dynPageBase(data, template)
  data.each do |id, entry_data|
    slug = entry_data.slug
    category = entry_data.category
    sub_category = (entry_data.sub_category if entry_data.sub_category)
    # template = "/views/templates/#{ template }.html"

    if sub_category && sub_category != "none"
      proxy "#{ category }/#{ slug }.html",
            "/views/templates/#{ template }.html",
            ignore: true,
            locals: { entry_data: entry_data }
    else
      proxy "#{ category }/#{ sub_category }/#{ slug }.html",
            "/views/templates/#{ template }.html",
            ignore: true,
            locals: { entry_data: entry_data }
    end
  end
end

module DynamicPages

  ##		=Contentful pages
  ########################################

  def dynamicContentfulPages()

    # Only run if data dir exists
    if Dir.exist?(config.data_dir)

      # Homepage
      data.hs.homepage.each do |id, home|
        proxy "/index.html",
              "/views/templates/home.html",
              ignore: true,
              locals: { home: home }
      end

      dynPageBase(data.hs.child_page, "child-page")
      # dynPageBase(data.hs.landing_page, "landing-page")

      # Child pages
      # data.hs.child_page.each do |id, child_page|
      #   proxy "#{ child_page.category.parameterize + "/" + child_page.slug }.html",
      #         "/views/templates/child-page.html",
      #         ignore: true,
      #         locals: { child_page: child_page }
      # end

      # Landing pages
      # data.hs.landing_page.each do |id, landing_page|
      #   slug = landing_page.slug
      #   category = landing_page.category
      #   sub_category = (landing_page.sub_category if landing_page.sub_category)
      #   template = "/views/templates/landing-page.html"

      #   if sub_category && sub_category != "none"
      #     proxy "#{ category }/#{ slug }.html",
      #           template,
      #           ignore: true,
      #           locals: { landing_page: landing_page }
      #   else
      #     proxy "#{ category }/#{ sub_category }/#{ slug }.html",
      #           template,
      #           ignore: true,
      #           locals: { landing_page: landing_page }
      #   end
      # end

      # Child pages
      # data.hs.root_page.each do |id, root_page|
      #   proxy "#{ root_page.category.parameterize }/index.html",
      #         "/views/templates/root-page.html",
      #         ignore: true,
      #         locals: { root_page: root_page }
      # end
    end
  end

  ##		=Custom pages
  ########################################

  def dynamicCustomPages()

    # AJAX elements
    # proxy "/ajax.html", "/views/templates/ajax.html", :layout => false
  end
end

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

      # Child pages
      data.hs.child_page.each do |id, child_page|
        proxy "#{ child_page.category.parameterize + "/" + child_page.slug }.html",
              "/views/templates/child-page.html",
              ignore: true,
              locals: { child_page: child_page }
      end

      # Landing pages
      data.hs.landing_page.each do |id, landing_page|
        proxy "#{ landing_page.category.parameterize + "/" + landing_page.slug }.html",
              "/views/templates/landing-page.html",
              ignore: true,
              locals: { landing_page: landing_page }
      end

      # Child pages
      data.hs.root_page.each do |id, root_page|
        proxy "#{ root_page.category.parameterize }/index.html",
              "/views/templates/root-page.html",
              ignore: true,
              locals: { root_page: root_page }
      end
    end
  end

  ##		=Custom pages
  ########################################

  def dynamicCustomPages()

    # AJAX elements
    # proxy "/ajax.html", "/views/templates/ajax.html", :layout => false
  end
end

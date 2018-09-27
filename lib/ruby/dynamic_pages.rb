require "lib/ruby/config_helpers"
require "yaml"

include ConfigHelpers

def proxyBase(url, template, layout, data, altData = {})
  defaults = {
    page_number: false,
    feed_category: false
  }
  altData = defaults.merge(altData)

  proxy url,
        template,
        ignore: true,
        layout: layout,
        locals: {
          entry_data: data,
          alt_data: altData
        }
end

def dynPageBase(data, template)
  data.each do |id, entryData|
    url = "/#{ entryData.slug }.html"
    viewTemplate = "/views/templates/#{ template }.html"

    proxyBase(url, viewTemplate, "layout", entryData)
  end
end

module DynamicPages

  ###########################################################################
  ##		=Contentful pages
  ###########################################################################

  def dynamicContentfulPages(env)

    # Only run if data dir exists
    if Dir.exist?(config.data_dir)
      childPages = @app.data.hs.child_page
      landingPages = @app.data.hs.landing_page
      themePages = @app.data.hs.theme_page
      allMainPages = (env == "dev" ? childPages : childPages.merge(landingPages)) # FIX: landing pages not working in dev env

      ##		=Core pages
      ########################################

      dynPageBase(@app.data.hs.homepage, "home")
      dynPageBase(childPages, "child-page")
      dynPageBase(landingPages, "landing-page")
      # dynPageBase(themePages, "theme-page")

      ##		=Feed pages
      ########################################

      categoryLevels = [:category, :sub_category]

      categoryLevels.each do |catLev|
        feedPages(allMainPages, catLev) do |catPages|
          catPages.each do |category, pages|
            paginated = pages.each_slice(6).to_a

            paginated.each_with_index do |pagesData, index|
              stub = pagesData.map{ |id, page| catLev == :sub_category ? "#{ page[:category] }/#{ page[:sub_category] }" : "#{ page[:category] }" }
              url = "/#{ stub[0] }/feed/page-#{ index + 1 }.html"
              viewTemplate = "/views/templates/feed-page.html"

              proxyBase(
                url,
                viewTemplate,
                "basic",
                pagesData,
                {
                  feed_data: {
                    feed_page: (index + 1),
                    feed_category: category,
                    feed_total: paginated.length
                  }
                }
              )
            end
          end
        end
      end

      # ##		=Theme feed pages
      # ########################################

      # themes = []
      # siteConfig[:themes].each do |theme|
      #   themes << theme[:name]
      # end

      # themes.each do |theme|
      #   paginated = getThemePages(allMainPages, theme).each_slice(6).to_a

      #   paginated.each_with_index do |pagesData, index|
      #     proxyBase(
      #       "#{ theme }/feed/page-#{ index + 1 }.html",
      #       "/views/templates/feed-page.html",
      #       "basic",
      #       pagesData,
      #       {
      #         feed_data: {
      #           feed_page: (index + 1),
      #           feed_category: theme,
      #           feed_total: paginated.length
      #         }
      #       }
      #     )
      #   end
      # end
    end
  end

  ###########################################################################
  ##		=Custom pages
  ###########################################################################

  def dynamicCustomPages()
    proxy "/static/search.html",
          "/views/static/search.html",
          ignore: true,
          layout: "iframe",
          locals: { no_index: true }
  end
end

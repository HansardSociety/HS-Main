require "lib/ruby/config_helpers"
require "yaml"

include ConfigHelpers

def proxyBase(url, template, layout, data)
  proxy url,
        template,
        ignore: true,
        layout: layout,
        locals: {
          entry_data: data
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
      childPages = data.hs.child_page
      landingPages = data.hs.landing_page
      themePages = data.hs.theme_page
      allMainPages = (env == "dev" ? childPages : childPages.merge(landingPages)) # FIX: landing pages not working in dev env

      ##		=Core pages
      ########################################

      dynPageBase(data.hs.homepage, "home")
      dynPageBase(childPages, "child-page")
      dynPageBase(landingPages, "landing-page")
      dynPageBase(themePages, "theme-page")

      ##		=Feed pages
      ########################################

      categoryLevels = [:category, :sub_category]

      categoryLevels.each do |catLev|
        feedPages(allMainPages, catLev) do |catPages|
          catPages.each do |category, pages|
            paginatePages = pages.each_slice(6).to_a

            paginatePages.each_with_index do |paginatedPagesData, index|
              stub = paginatedPagesData.map{ |id, page| catLev == :sub_category ? "#{ page[:category] }/#{ page[:sub_category] }" : "#{ page[:category] }" }
              url = "/#{ stub[0] }/feed/page-#{ index + 1 }.html"
              viewTemplate = "/views/templates/feed-page.html"

              proxyBase(url, viewTemplate, "fetch", paginatedPagesData)
            end
          end
        end
      end

      ##		=Theme feed pages
      ########################################

      siteSettings = YAML.load_file("data/hs/universal/5mkIBy6FCEk8GkOGKEQKi4.yaml")
      themes = siteSettings[:site_structure][:themes].to_a

      themes.each do |theme|
        paginated = getThemePages(allMainPages, theme).each_slice(6).to_a

        paginated.each_with_index do |pageData, index|
          proxyBase(
            "#{ theme }/feed/page-#{ index + 1 }.html",
            "/views/templates/feed-page.html",
            "fetch",
            pageData
          )
        end
      end
    end
  end

  ###########################################################################
  ##		=Custom pages
  ###########################################################################

  def dynamicCustomPages()
    #...
  end
end

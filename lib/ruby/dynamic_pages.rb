require "lib/ruby/config_helpers"

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

      ##		=Core pages
      ########################################

      dynPageBase(data.hs.homepage, "home")
      dynPageBase(childPages, "child-page")
      dynPageBase(landingPages, "landing-page")

      ##		=Feed pages
      ########################################

      feedPages(env == "dev" ? childPages : childPages.merge(landingPages)) do |catPages|
        catPages.each do |category, pages|
          paginatePages = pages.each_slice(5).to_a

          paginatePages.each_with_index do |paginatedPagesData, index|
            url = "/#{ category }/feed/page-#{ index + 1 }.html"
            viewTemplate = "/views/templates/feed-page.html"

            proxyBase(url, viewTemplate, "fetch", paginatedPagesData)
          end
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

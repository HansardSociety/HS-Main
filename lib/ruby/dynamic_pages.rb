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

      feedPagesData = (env == "dev" ? childPages : childPages.merge(landingPages))

      categoryLevels = [:category, :sub_category]
      categoryLevels.each do |catLev|
        feedPages(feedPagesData, catLev) do |catPages|
          catPages.each do |category, pages|
            paginatePages = pages.each_slice(3).to_a

            paginatePages.each_with_index do |paginatedPagesData, index|

              stub = paginatedPagesData.map{ |id, page| catLev == :sub_category ? "#{ page[:category] }/#{ page[:sub_category] }" : "#{ page[:category] }" }

              url = "/#{ stub[0] }/feed/page-#{ index + 1 }.html"
              viewTemplate = "/views/templates/feed-page.html"

              proxyBase(url, viewTemplate, "fetch", paginatedPagesData)
            end
          end
        end
      end
    end
  end

  ###########################################################################
  ##		=Custom pages
  ###########################################################################

  def dynamicCustomPages()
    if Dir.exist?(config.data_dir)
      data.hs.form_newsletter.each do |id, form|
        proxyBase(
          "/forms/form-#{ form.ID }.html",
          "/views/templates/forms.html",
          "fetch",
          form
        )
      end
    end
  end
end

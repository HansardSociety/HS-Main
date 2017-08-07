module CustomHelpers

  # Symbolize keys
  def convertToRegularHash(data)
    JSON.parse(JSON(data), symbolize_names: true)
  end

  # Markdown
  def markdown(data, type='paragraph')
    Kramdown::Document.new(type == 'byline' ? data.gsub(/(\n|\n\n)/, ' ') + "\n{: .E-fz-by }" : data).to_html
  end

  # Global variables
  def siteData(var)
    convertToRegularHash(data.hs.universal).values[0][var]
  end

  # Internal URLs (for envs)
  def internalURL(cat, slug)
    "#{ siteData(:siteURL) }/#{ cat }/#{ slug }#{ config[:ENV] == 'development' ? '.html' : '' }"
  end

  # Related content/ tagging by category
  def relatedContent(entryData, opts = {})

    defaults = {
      blogCount: 5
    }

    opts = defaults.merge(opts)

    @blogCount = opts[:blogCount] - 1

    # Symbolize entry data to convert to regular hash
    @entryData = convertToRegularHash(entryData)

    # Core pages-data
    @childPages = data.hs.child_page
    @landingPages = data.hs.landing_page

    # All pages - remove about and legal pages
    @allPages = @childPages.merge(@landingPages).reject{ |id, page|
      [ 'about', 'legal' ].include? page[:category]
    }

    # Recursively symbolize keys
    @allPagesSymKeys = convertToRegularHash(@allPages).values

    # Group and sort pages
    @sortPagesByDate = @allPagesSymKeys.sort_by{ |page| - page[:date_time][:integer] }
    @groupPagesByCategory = @sortPagesByDate.group_by{ |val| val[:category] }
    @orderCategories = [ 'events', 'intelligence', 'blog', 'research', 'resources' ]
    @sortPagesByCategory = @groupPagesByCategory.sort_by{ |val| @orderCategories.index(val) }

    # Map organised pages
    @sortPagesByCategory.map do |category, pages|

      # Filter tagged pages
      @pagesTagged = pages.select{ |page|

        # Get pages with at least one corresponding tag
        @hasSameTags = page[:tags].any?{ |tags| @entryData[:tags].include?(tags) }

        # Filter the entry page and pages that are included as featured items
        @notThisPage = page[:ID] != @entryData[:ID]
        @notFeaturedPage = @entryData[:featured].any?{ |featPage|
          page[:ID] != featPage[:ID]
        }

        page if @hasSameTags && @notThisPage && @notFeaturedPage
      }.compact

      # Registration pages
      @registrationPages = @pagesTagged.select{ |page|
        @pageTypes = ([ 'events', 'intelligence' ].include? page[:category])
        @isInPast = page[:date_time][:integer] >= Time.now.strftime('%s').to_i

        @pageTypes && @isInPast
      }[0..2]

      # Blog pages
      @blogPages = @pagesTagged.select{ |page| page[:category] == 'blog' }[0..@blogCount]

      # Research pages
      @researchPages = @pagesTagged.select{ |page| page[:category] == 'research' }[0..2]

      # Concatenate tagged page-types
      @relatedContent = [ @registrationPages, @blogPages, @researchPages ].reduce([], :concat)

      @relatedContent.map do |page|

        yield page
      end
    end
  end
end

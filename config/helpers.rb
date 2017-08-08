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
  def internalURL(slug, cat)
    "#{ siteData(:siteURL) }/#{ cat + '/' if cat }#{ slug }#{ config[:ENV] == 'development' ? '.html' : '' }"
  end

  # Pages by date
  def pagesByDate

    # # Core pages-data
    # @childPages = data.hs.child_page
    # @landingPages = data.hs.landing_page

    # # All pages - remove about and legal pages
    # @allMainPages = @childPages.merge(@landingPages).select{ |id, page|
    #   siteData(:main_categories).include? page[:category]
    # }

    # # Recursively symbolize keys
    # @allPagesRegHash = convertToRegularHash(@allMainPages).values

    # # Sort pages by date (descending)
    # @sortPagesByDate = @allPagesRegHash.sort_by{ |page| - page[:date_time][:integer] }
  end

  # Latest content
  def latestContent(opts = {})
    @childPages = data.hs.child_page
    @landingPages = data.hs.landing_page
    @allPages = @childPages.merge(@landingPages)

    defaults = {
      yield: false,
      num: @allPages.length,
      pageCategories: siteData(:main_categories)
    }
    opts = defaults.merge(opts)

    @allMainPages = @allPages.select{ |id, page|
      opts[:pageCategories].include? page[:category]
    }

    @allPagesRegHash = convertToRegularHash(@allMainPages).values
    @sortPagesByDate = @allPagesRegHash.sort_by{ |page| - page[:date_time][:integer] }
    @pages = @sortPagesByDate[0..opts[:num]]

    if opts[:yield] == true
      @pages.map do |page|
        yield page
      end
    else
      @pages.map{ |page| page}
    end
  end

  # Related content/ tagging by category
  def relatedContent(entryData, opts = {})
    defaults = { blogCount: 5 }
    opts = defaults.merge(opts)

    # Control number of blog posts
    # Subtract 1 as data pulled from Contentful (starts at 1)
    @blogCount = opts[:blogCount] - 1

    # Symbolize entry data to convert to regular hash
    @entryData = convertToRegularHash(entryData)

    # Group and sort pages
    @groupPagesByCategory = latestContent.group_by{ |val| val[:category] }
    @orderCategories = [ 'events', 'intelligence', 'blog', 'research', 'resources' ]
    @sortPagesByCategory = @groupPagesByCategory.sort_by{ |val| @orderCategories.index(val) }

    # Map organised pages
    @sortPagesByCategory.map do |category, pages|

      # Filter tagged pages
      @pagesTagged = pages.select{ |page|

        # Get pages with at least one corresponding tag
        @hasSameTags = page[:tags].any?{ |tags| @entryData[:tags].include? tags }

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

      # Select pages by category and concatenate
      @blogPages = @pagesTagged.select{ |page| page[:category] == 'blog' }[0..@blogCount]
      @researchPages = @pagesTagged.select{ |page| page[:category] == 'research' }[0..2]
      @resourcesPages = @pagesTagged.select{ |page| page[:category] == 'resources' }[0..2]
      @relatedContent = [ @registrationPages, @blogPages, @researchPages ].reduce([], :concat)

      @relatedContent.map do |page|
        yield page
      end
    end
  end
end

module CustomHelpers

  # Convert MM data to regular hash
  def convertToRegularHash(data)
    JSON.parse(JSON(data), symbolize_names: true)
  end

  # Markdown
  def markdown(data, type='paragraph')
    Kramdown::Document.new(type == 'byline' ? data.gsub(/(\n|\n\n)/, ' ') + "\n{: .strap-md }" : data).to_html
  end

  # Global variables
  def siteData(var)
    convertToRegularHash(data.hs.universal).values[0][var]
  end

  # Internal URLs (for envs)
  def internalURL(slug, cat)
    "#{ siteData(:siteURL) }/#{ cat + '/' if cat }#{ slug }#{ config[:ENV] == 'development' ? '.html' : '' }"
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

    # Output
    @pages.map{ |page| opts[:yield] == true ? yield(page) : page }
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
        @notFeaturedPage = @entryData[:featured] ? @entryData[:featured].any?{ |featPage|
          page[:ID] != featPage[:ID]
        } : true

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

      # Output
      @relatedContent.map{ |page| yield page }
    end
  end
end

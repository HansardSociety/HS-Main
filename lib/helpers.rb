module CustomHelpers

  # Convert MM data to regular hash
  def convertToRegularHash(data)
    JSON.parse(JSON(data), symbolize_names: true)
  end

  # Markdown
  def markdown(data, type="paragraph")
    Kramdown::Document.new(type == "byline" ? data.gsub(/(\n|\n\n)/, " ") + "\n{: .strap-md }" : data).to_html
  end

  # Global variables
  def siteData(var)
    convertToRegularHash(data.hs.universal).values[0][var]
  end

  # Internal URLs (for envs)
  def internalURL(slug, cat)
    "#{ siteData(:siteURL) }/#{ cat + "/" if cat }#{ slug }#{ config[:ENV] == "development" ? ".html" : "" }"
  end

  # Partial data
  def hashify(data)
    Hash[data.map{ |key, val| [key.to_sym, val] }]
  end

  # Registration data and fallback
  def altData(data, opts = {})
    defaults = {
      type: "date_time",
      content_type: ""
    }
    opts = defaults.merge(opts)

    featuredData = data[:featured]

    if opts[:type] == "date_time"
      featuredData && featuredData[0][:"#{ opts[:content_type] }"] \
        ? featuredData[0][:"#{ opts[:content_type] }"][:date_time] \
        : data[:date_time]

    elsif opts[:type] == "category"
      featuredData && featuredData[0][:"#{ opts[:content_type] }"] \
        ? featuredData[0][:"#{ opts[:content_type] }"][:category].gsub("-", " ") \
        : data[:category].gsub("-", " ")
    end
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
    }.compact

    @allPagesRegHash = convertToRegularHash(@allMainPages).values
    @sortPagesByDate = @allPagesRegHash.sort_by{ |page| - page[:date_time][:integer] }
    @pages = @sortPagesByDate[0..opts[:num]]

    # Output
    @pages.map{ |page| opts[:yield] == true ? yield(page) : page }
  end

  # Related content/ tagging by category
  def relatedContent(entryData, blogCount)

    # Control number of blog posts
    # Subtract 1 as data pulled from Contentful (starts at 1)
    @blogCount = blogCount ? blogCount - 1 : 2

    # Symbolize entry data to convert to regular hash
    @entryData = convertToRegularHash(entryData)

    # Group and sort pages
    @groupPagesByCategory = latestContent.group_by{ |val| val[:category] }
    @orderCategories = ["events", "intelligence", "blog", "resources", "research"]
    @sortPagesByCategory = @groupPagesByCategory.sort_by{ |category, pages| @orderCategories.index(category) }

    # Map organised pages
    @sortPagesByCategory.map do |category, pages|

      # Filter tagged pages
      @pagesTagged = pages.select{ |page|

        # Only include tagged pages
        if page[:tags]

          # Get pages with at least one corresponding tag
          @hasSameTags = page[:tags].any?{ |tags| @entryData[:tags].include? tags }

          @hasFeatured = @entryData[:featured]

          # Filter the entry page and pages that are included as featured items
          @notThisPage = page[:ID] != @entryData[:ID]
          @notFeaturedPage = !@entryData[:featured].any?{ |featPage|
             page[:ID].include? featPage[:ID]
          } if @hasFeatured

          # Check if pages has featured items...
          if @hasFeatured
            page if @hasSameTags && @notThisPage && @notFeaturedPage
          else
            page if @hasSameTags && @notThisPage
          end
        end
      }.compact

      # Registration pages
      @registrationPages = @pagesTagged.select{ |page|
        @pageTypes = ["events"].include? page[:category]
        @timeNow = Time.now.strftime("%s").to_i
        @isInPast = altData(page, { type: "date_time", content_type: "registration" })[:integer].to_i >= @timeNow

        @pageTypes && @isInPast
      }[0..2]

      # Select pages by category and concatenate
      @blogPages = @pagesTagged.select{ |page| page[:category] == "blog" }[0..@blogCount]
      @otherPages = @pagesTagged.select{ |page|
        ["intelligence", "research", "resources"].include? page[:category]
      }[0..2]
      @concatPages = [@registrationPages, @blogPages, @otherPages].reduce([], :concat)

      # Output
      @concatPages.map{ |page| yield page }
    end
  end
end
require "json"
require "lib/ruby/config_helpers"

include ConfigHelpers

module CustomHelpers

  ###########################################################################
  ##		=Basic helpers
  ###########################################################################

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
  def internalURL(slug)
    "#{ siteData(:siteURL) }/#{ slug }#{ config[:ENV] == "development" ? (slug.include?("/index") ? "" :  ".html") : "" }"
  end

  # Partial data
  def hashify(data)
    Hash[data.map{ |key, val| [key.to_sym, val] }]
  end

  ###########################################################################
  ##		=Feed data
  ###########################################################################

  def countFeedPages(setCategory)
    childPages = data.hs.child_page
    landingPages = data.hs.landing_page
    allPages = childPages.merge(landingPages)

    feedPages(allPages) do |catPages, urlStub|
      getCategoryPages = catPages.select{ |category, pages| category == setCategory }

      getCategoryPages.each do |category, pages|
        paginatedPages = pages.each_slice(3).to_a
        numberOfPages = paginatedPages.size

        yield("#{ numberOfPages }")
      end
    end
  end

  ###########################################################################
  ##		=Registration data and fallback
  ###########################################################################

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

  ###########################################################################
  ##		=Latest content
  ###########################################################################

  def latestContent(opts = {})
    childPages = data.hs.child_page
    landingPages = data.hs.landing_page
    allPages = childPages.merge(landingPages)

    defaults = {
      yield: false,
      start: 0,
      num: allPages.length,
      page_cats: siteData(:main_categories)
    }
    opts = defaults.merge(opts)

    pageCategories = opts[:page_cats]
    itemCount = opts[:num] - 1
    start = opts[:start]
    isYield = opts[:yield]

    # Only include specified category/ sub-category and not page indices
    allMainPages = allPages.select{ |id, page|
      (pageCategories.include? (page[:category] || page[:sub_category])) && !page[:index_page]
    }.compact

    allPagesRegHash = convertToRegularHash(allMainPages).values
    sortPagesByDate = allPagesRegHash.sort_by{ |page| - page[:date_time][:integer] }
    pages = sortPagesByDate[start..itemCount]

    # Output
    pages.map{ |page| isYield ? yield(page) : page }
  end

  ###########################################################################
  ##		=Related content/ tagging by category
  ###########################################################################

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

  ###########################################################################
  ##		=Data URIs
  ###########################################################################

  # Main card placeholder data URI
  def mainCardDataURI
    "data:image/png;base64,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"
  end

  # Side card placeholder data URI
  def sideCardDataURI
    "data:image/png;base64,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"
  end

  # Feed item placeholder data URI
  def feedItemCardDataURI
    "data:image/png;base64,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"
  end
end

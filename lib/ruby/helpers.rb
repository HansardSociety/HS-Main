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
    isDev = config[:ENV] == "development"

    "#{ siteData(:siteURL) }/#{ slug }#{ isDev ? ".html" : "" }"
  end

  # Partial data
  def hashify(data)
    Hash[data.map{ |key, val| [key.to_sym, val] }]
  end

  # Assets folder
  def assetsDir
    "/#{ "." if config[:ENV] == "development" }assets"
  end

  # Basic truncate
  def truncate(text, opts = {})
    defaults = { num: 100, elipsis: true }
    opts = defaults.merge(opts)

    num = opts[:num]
    elipsis = opts[:elipsis]

    if text.length > num

      # Truncated text
      visibleText = text[0..num].gsub(/[^0-9a-zA-Z]+$/, "") + (elipsis ? "<span aria-hidden='true'>…</span>" : "")

      # Store truncated text in span tag for SEO
      hiddenText = "<span class='e-hidden'>" + text[(num + 1)..500] + "</span>"

      visibleText + hiddenText
    else
      text
    end
  end

  # Truncate and strip HTML
  def truncateHtml(text, opts = {})
    defaults = { num: 140, elipsis: true }
    opts = defaults.merge(opts)

    num = opts[:num]
    elipsis = opts[:elipsis]

    if text.length > num
      plainText = text.gsub(/<\/?[^>]*>/, "")
      truncatedText = truncate(plainText, { num: num, elipsis: elipsis })

      truncatedText
    else
      text
    end
  end

  ###########################################################################
  ##		=Colors
  ###########################################################################

  def catColor(color)
    category = color.parameterize.underscore.to_sym

    colors = {
      blog: "purple",
      events: "hot-pink",
      insight: "sea-green",
      projects: "brand-green",
      publications: "orange",
      greyscale: "greyscale"
    }

    colors[category]
  end

  # Color profile
  def colorProfile(color)
    colors = {
      dark: ["black", "brand-green", "dark-grey", "hot-pink", "orange", "purple", "slate-blue"],
      light: ["light-grey", "sea-green", "white"],
      greyscale: ["black", "dark-grey", "light-grey", "white"],
      dark_greyscale: ["black", "dark-grey"],
      light_greyscale: ["light-grey", "white"]
    }

    colors[color]
  end

  # Panel BGCs
  def panelBgc(bgc, opts = {})
    defaults = { gradient: false }
    opts = defaults.merge(opts)

    isGradient = opts[:gradient]

    isDarkBgc = colorProfile(:dark).include?(bgc)
    isLightBgc = colorProfile(:light).include?(bgc)
    isGreyscaleBgc = colorProfile(:greyscale).include?(bgc)
    isDarkGreyscaleBgc = colorProfile(:dark_greyscale).include?(bgc)
    isLightGreyscaleBgc = colorProfile(:light_greyscale).include?(bgc)

    colWhite = "e-col-greyscale-0"

    if isGreyscaleBgc
      if isDarkGreyscaleBgc
       "#{ colWhite } #{ bgc == "black" ? "e-bgc-greyscale-3" : "e-bgc-greyscale-2" }"
      else
        "#{ bgc == "white" ? "e-bgc-greyscale-0" : "e-bgc-greyscale-1" }"
      end
    else
      bgcClass = isGradient ? "e-bg-grad-#{ bgc }" : "e-bgc-#{ bgc }-1"

      "#{ colWhite if isDarkBgc } #{ bgcClass }"
    end
  end

  ###########################################################################
  ##		=Feed data
  ###########################################################################

  def countFeedPages(setCategory)
    childPages = data.hs.child_page
    landingPages = data.hs.landing_page
    allPages = childPages.merge(landingPages)

    feedPages(allPages) do |catPages|
      getCategoryPages = catPages.select{ |category, pages| category == setCategory }

      getCategoryPages.each do |category, pages|
        paginatedPages = pages.each_slice(3).to_a
        numberOfPages = paginatedPages.size

        yield("#{ numberOfPages }")
      end
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
      page_cats: siteCategories(:top_main),
      sub_cats: false
    }
    opts = defaults.merge(opts)

    pageCategories = opts[:page_cats]
    itemCount = opts[:num] - 1
    start = opts[:start]

    isSubCats = opts[:sub_cats]
    isYield = opts[:yield]

    # Only include specified category/ sub-category and not page indices
    allMainPages = allPages.select do |id, page|
      category = isSubCats ? page[:sub_category] : page[:category]
      [pageCategories].include?(category) && !page[:index_page]
    end

    allPagesRegHash = convertToRegularHash(allMainPages.compact).values
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
    @orderCategories = siteCategories(:top_main)
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
        @isInPast = (page[:date_time_alt] ? page[:date_time_alt][:integer] : page[:date_time][:integer]) >= @timeNow

        @pageTypes && @isInPast
      }[0..2]

      # Select pages by category and concatenate
      @blogPages = @pagesTagged.select{ |page| page[:category] == "blog" }[0..@blogCount]
      @otherPages = @pagesTagged.select{ |page|
        ["insight", "projects", "publications"].include? page[:category]
      }[0..2]
      @concatPages = [@registrationPages, @blogPages, @otherPages].reduce([], :concat)

      # Output
      @concatPages.map{ |page| yield page }
    end
  end
end

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
    text = type == "byline" ? data.gsub(/(\n|\n\n)/, " ") + "\n{: .strap-md }" : data

    Kramdown::Document.new(text).to_html
  end

  # Markdown strip HTML
  def markdownStrip(data)
    markdown(data).gsub(/<\/?[^>]*>/, "")
  end

  # Global variables
  def siteData(var)
    convertToRegularHash(data.hs.universal).values[0][var]
  end

  # Internal URLs (for envs)
  def internalURL(slug)
    isDev = config[:ENV] == "development"

    "#{ siteData(:site_url) if !isDev }/#{ isDev ? slug : slug.gsub("/index", "") }#{ ".html" if isDev }"
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

  # All child and landing pages
  def allChildLandingPages()
    childPages = data.hs.child_page
    landingPages = data.hs.landing_page

    childPages.merge(landingPages)
  end

  ###########################################################################
  ##		=Colors
  ###########################################################################

  # Category colors
  def catColor(setCategory)
    getCat = siteData(:site_config)[:categories].select{ |category| category[:name] == setCategory }
    getCat.map{ |category| category[:color] }[0]
  end

  # Color profile
  def colorProfile(color)

    darkColors = []
    siteConfig[:color_groups].select{|colName, colVals| colVals[:dark]}.map do |colName, colVals|
      darkColors << "#{ colName }"
    end

    lightColors = []
    siteConfig[:color_groups].select{|colName, colVals| !colVals[:dark]}.map do |colName, colVals|
      lightColors << "#{ colName }" << "light-grey"
    end

    monoColors = []
    siteConfig[:color_groups].select{|colName, colVals| colVals[:mono]}.map do |colName, colVals|
      monoColors << "#{ colName }" << "light-grey"
    end

    lightMonoColors = []
    siteConfig[:color_groups].select{|colName, colVals| colVals[:mono] && !colVals[:dark]}.map do |colName, colVals|
      lightMonoColors << "#{ colName }" << "light-grey"
    end

    darkMonoColors = []
    siteConfig[:color_groups].select{|colName, colVals| colVals[:mono] && colVals[:dark]}.map do |colName, colVals|
      darkMonoColors << "#{ colName }"
    end

    colors = {
      dark: darkColors,
      light: lightColors,
      mono: monoColors,
      light_mono: lightMonoColors,
      dark_mono: darkMonoColors
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
    isMonoBgc = colorProfile(:mono).include?(bgc)
    isDarkMonoBgc = colorProfile(:dark_mono).include?(bgc)
    isLightMonoBgc = colorProfile(:light_mono).include?(bgc)

    colWhite = "e-col-white-1"

    bgcClass = isGradient ? "e-bg-grad-#{ bgc }" : "e-bgc-#{ bgc }-2"

    "#{ colWhite if isDarkBgc } #{ bgcClass }"


    if isMonoBgc
      if isDarkMonoBgc
       "#{ colWhite } #{ bgc == "black" ? "e-bgc-black-2" : "e-bgc-black-3" }"
      else
        "#{ bgc == "light-grey" ? "e-bgc-white-2" : "e-bgc-white-1" }"
      end
    else
      bgcClass = isGradient ? "e-bg-grad-#{ bgc }" : "e-bgc-#{ bgc }-1"

      "#{ colWhite if isDarkBgc } #{ bgcClass }"
    end
  end

  ###########################################################################
  ##		=Feed data
  ###########################################################################

  def countFeedPages(setCategory, opts = {})
    defaults = { sub_cat: false }
    opts = defaults.merge(opts)

    feedPages(allChildLandingPages()) do |catPages|
      getCategoryPages = catPages.select{ |category, pages| category == setCategory }

      getCategoryPages.each do |category, pages|

        if opts[:sub_cat]
          getSubCatPages = pages.select{ |id, page| page.sub_category == opts[:sub_cat] }
          rejectIndices = getSubCatPages.reject{ |id, page| page.index_page == true }
          paginated = rejectIndices.each_slice(6).to_a.length
        else
          rejectIndices = pages.reject{ |id, page| page.index_page == true }
          paginated = rejectIndices.each_slice(6).to_a.length
        end

        yield("#{ paginated }")
      end
    end
  end

  ###########################################################################
  ##		=Latest content
  ###########################################################################

  def latestContent(opts = {})
    defaults = {
      yield: false,
      start: 0,
      num: allChildLandingPages().length,
      page_cats: siteCategories(:top_main),
      sub_cats: false,
      dedupe_entry_id: false
    }
    opts = defaults.merge(opts)

    pageCategories = opts[:page_cats]
    itemCount = opts[:num] - 1
    start = opts[:start]
    dedupe = opts[:dedupe_entry_id]

    isSubCats = opts[:sub_cats]
    isYield = opts[:yield]

    # Only include specified category/ sub-category and not page indices
    allMainPages = allChildLandingPages().select do |id, page|
      category = isSubCats ? page[:sub_category] : page[:category]

      pageCategories.include?(category) && !page[:index_page]
    end

    # De-dupe entry
    if dedupe
      allMainPages.reject!{ |id, page| page[:ID] == dedupe }
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

  def relatedContent(entryData, opts = {})

    # Symbolize entry data to convert to regular hash
    entryData = convertToRegularHash(entryData)

    # Group and sort pages
    groupPagesByCategory = latestContent.group_by{ |val| val[:category] }
    orderCategories = siteCategories(:top_main)
    sortPagesByCategory = groupPagesByCategory.sort_by{ |category, pages| orderCategories.index(category) }

    # Default options
    defaults = {
      blog_count: 2,
      ignore_past_events: true,
      page_count: 1,
      tag_type: :tags,
      yield_block: true
    }
    opts = defaults.merge(opts)

    blogCount = opts[:blog_count] - 1 # subtract 1 as data pulled from Contentful (starts at 1)
    ignorePastEvents = opts[:ignore_past_events] # remove events with registration dates older than time-now
    pageCount = opts[:page_count]
    tagType = opts[:tag_type] # tag type - ie. theme or tag
    yieldBlock = opts[:yield_block]

    # Map organised pages
    sortPagesByCategory.map do |category, pages|

      # Filter tagged pages
      pagesTagged = pages.select{ |page|

        # Only include tagged pages
        if page[tagType]

          # Get pages with at least one corresponding tag
          hasSameTags = page[tagType].any?{ |tags| entryData[tagType].include? tags }

          hasFeatured = entryData[:featured]

          # Filter the entry page and pages that are included as featured items
          notThisPage = page[:ID] != entryData[:ID]
          notFeaturedPage = !entryData[:featured].any?{ |featPage|
             page[:ID].include? featPage[:ID]
          } if hasFeatured

          # Check if pages has featured items...
          if hasFeatured
            page if hasSameTags && notThisPage && notFeaturedPage
          else
            page if hasSameTags && notThisPage
          end
        end
      }.compact

      # Overwrite pages count for :theme to include all 'tagged' theme pages
      if tagType == :theme
        blogCount = pagesTagged.length
        pageCount = pagesTagged.length
      end

      # Registration pages
      registrationPages = pagesTagged.select{ |page|
        pageTypes = page[:date_time_alt]
        timeNow = Time.now.strftime("%s").to_i

        isInPast = (page[:date_time_alt] ? page[:date_time_alt][:integer] : page[:date_time][:integer]) >= timeNow

        ignorePastEvents ? pageTypes && isInPast : pageTypes
      }[0..pageCount]

      # Select pages by category and concatenate
      blogPages = pagesTagged.select{ |page| page[:category] == "blog" }[0..blogCount]
      otherPages = pagesTagged.select{ |page|
        page[:category] != "blog" && !page[:date_time_alt]
      }[0..pageCount]
      concatPages = [registrationPages, blogPages, otherPages].reduce([], :concat)

      # Output
      concatPages.map{ |page| yieldBlock ? yield(page) : page }
    end
  end
end

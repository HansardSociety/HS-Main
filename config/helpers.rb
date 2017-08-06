module CustomHelpers

  # Symbolize keys
  def symbolizeKeys(data)
    JSON.parse(JSON(data), symbolize_names: true)
  end

  # Markdown
  def markdown(data, type='paragraph')
    Kramdown::Document.new(type == 'byline' ? data.gsub(/(\n|\n\n)/, ' ') + "\n{: .E-fz-by }" : data).to_html
  end

  # Global variables
  def globalVar
    Hash[*data.hs.universal(0).map{ |k, v| v.deep_symbolize_keys }]
  end

  # Related content/ tagging by category
  def relatedContent(entryData, opts = {})

    defaults = {
      context: "uncategorised"
    }

    opts = defaults.merge(opts)

    # Symbolize entry data to convert to regular hash
    @entryData = symbolizeKeys(entryData)

    # Core pages-data
    @childPages = data.hs.child_page
    @landingPages = data.hs.landing_page

    # All pages - remove about and legal pages
    @allPages = @childPages.merge(@landingPages).reject{ |id, page|
      [ 'about', 'legal' ].include? page[:category]
    }

    # Recursively symbolize keys
    @allPagesSymKeys = symbolizeKeys(@allPages)

    # Group and sort pages
    @groupPagesByCategory = @allPagesSymKeys.group_by{ |id, val| val[:category] }
    @orderCategories = [ 'events', 'intelligence', 'blog', 'research', 'resources' ]
    @sortPagesByCategory = @groupPagesByCategory.sort_by{ |key, val| @orderCategories.index(key) }

    @some1 = @allPagesSymKeys.values.sort_by{ |page| - page[:date_time][:integer] }
    @some2 = @some1.group_by{ |val| val[:category] }
    @some3 = @some2.sort_by{ |val| @orderCategories.index(val) }
    # @some3 = Hash[@some2.sort]
    # puts @some3[0].each{|x,y| y[:title]}

    @some3.map do |category, pages|

      pages.map do |page|
        puts page[:category] + ' :: ' + page[:date_time][:date]
      end
    end

    # Map organised pages
    @sortPagesByCategory.map do |category, pages|

      # Order pages by date
      @pagesByDate = pages.sort_by{ |id, page| - page[:date_time][:integer] }

      # Tagged pages
      @pagesTagged = @pagesByDate.map{ |id, page|

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
      }[0..1]

      # Blog pages
      @blogPages = @pagesTagged.select{ |page| page[:category] == 'blog' }[0..4]

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

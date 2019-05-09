require "uri"
require "json"

$seperator = " > "

###########################################################################
## =Detatch category
###########################################################################

def detachCategory(data, opts = {})
  defaults = { part: 0 }
  opts = defaults.merge(opts)
  part = opts[:part]

  data.include?($seperator) ? data.split($seperator)[part].parameterize : data.parameterize
end

###########################################################################
## =Target ID
###########################################################################

def targetID(type, dataTitle, dataID)
  "#{ type }-" + dataTitle.split("::")[0].parameterize + "-" + dataID.sys[:id] + "-" + "#{ rand(0...1000) }"
end

###########################################################################
## =Slug
###########################################################################

def slug(data)
  isThemePage = data.content_type.id == "theme_page"
  indexPage = data.content_type.id == "landing_page" ? data.index_page : false
  slug = data.slug

  if !isThemePage
    category = detachCategory(data.category)

    if data.category.include? $seperator
      subCategory = detachCategory(data.category, { part: 1 })

      if indexPage
        "#{ category }/#{ subCategory }/index"
      else
        "#{ category }/#{ subCategory }/#{ slug }"
      end
    else
      if indexPage
        "#{ category }/index"
      else
        "#{ category }/#{ slug }"
      end
    end
  else
    "#{ slug }"
  end
end

###########################################################################
## =Date/ time
###########################################################################

def dateTime(data)
  dateTimeData = {
    integer: data.date_time.strftime("%s").to_i,
    date: data.date_time.strftime("%d.%m.%y"),
    time: data.date_time.strftime("%I:%M %p"),
    day: data.date_time.strftime("%d"),
    month: data.date_time.strftime("%b"),
    year: data.date_time.strftime("%Y")
  }
end

###########################################################################
## =Media data
###########################################################################

def media(data, opts = {})
  defaults = {
    focus: false,
    title: false
  }
  opts = defaults.merge(opts)

  mediaData = {
    url: "https:#{ data.url }",
    alt: data.description,
    title: (data.title if opts[:title]),
    focus: (opts[:focus] && opts[:focus].image_focus ? opts[:focus].image_focus.parameterize : "center")
  }.compact
end

###########################################################################
## =Meta label
###########################################################################

def metaLabel(data, opts = {})
  defaults = { reg_data: false }
  opts = defaults.merge(opts)

  regData = opts[:reg_data]

  hasSubcategory = data.category.include?($seperator)
  hasNestedRegistration = data.content_type.id == "child_page" && data.featured && data.featured[0].content_type.id == "registration"

  category = detachCategory(data.category)
  subCategory = detachCategory(data.category, { part: 1 }) if hasSubcategory

  baseLabel = "#{ category }#{ " / " + subCategory if hasSubcategory }".gsub("-", " ")

  if regData
    "#{ baseLabel } / #{ dateTime(regData)[:date] }"
  else
    if hasNestedRegistration
      "#{ baseLabel } / #{ dateTime(data.featured[0])[:date] }"
    else
      if category == "blog"
        "#{ baseLabel } / #{ dateTime(data)[:date] }"
      elsif category == "publications"
        "#{ baseLabel }#{ " / " + dateTime(data)[:year] if data.content_type.id != "landing_page" || (data.content_type.id == "landing_page" && !data.index_page) }"
      else
        "#{ baseLabel }"
      end
    end
  end
end

###########################################################################
## =Shared page data
###########################################################################

def sharedPageBase(pageType, ctx, data)

  # Shared
  ctx.ID = data.sys[:id]
  ctx.TYPE = data.content_type.id
  ctx.title = data.title.gsub('"', "&quot;").rstrip
  ctx.banner_image = media(data.banner_image, focus: data) if data.banner_image
  ctx.introduction = data.introduction.gsub('"', "&quot;")

  # Landing/ home page
  if ["homePage", "landingPage", "themePage"].include? pageType
    ctx.subtitle = data.subtitle
  end

  # Child/ landing page/ theme page
  if ["childPage", "landingPage", "themePage"].include? pageType
    ctx.seo_title = data.seo_title
  end

  # Child/ landing page
  if ["childPage", "landingPage"].include? pageType
    ctx.slug = slug(data)
    ctx.category = detachCategory(data.category)
    ctx.category_orig = data.category.downcase
    ctx.meta_label = metaLabel(data)
    ctx.keywords = data.keywords

    # Has sub-category
    if data.category.include?($seperator)
      ctx.sub_category = detachCategory(data.category, { part: 1 })
    end

    # Theming
    if data.theme
      ctx.theme = []
      ctx.theme_orig = []

      data.theme.map do |theme|
        ctx.theme << theme.parameterize if !theme.include?($seperator)
        ctx.theme_orig << theme.downcase

        if theme.include?($seperator)
          subTheme = theme.split($seperator)[1].parameterize

          ctx.sub_theme = []
          ctx.sub_theme << subTheme if !ctx.sub_theme.include?(subTheme)
        end
      end
    end

    # Has alternative date/ time
    if pageType == "childPage" && data.featured && data.featured[0].content_type.id == "registration"
      ctx.date_time = dateTime(data.featured[0])
      ctx.date_time_alt = dateTime(data.featured[0])
    else
      ctx.date_time = dateTime(data)
    end

    ctx.noindex = data.noindex
    ctx.blog_count = data.blog_count if data.blog_count
    ctx.tags = data.theme.map{ |tag| tag.gsub("'", "").parameterize } if data.theme
  end
end

###########################################################################
## =Profile data
###########################################################################

def profile(data)
  profileData = {
    cta_id: ((data.full_name + "-" + data.sys[:id]).parameterize if data.full_name), # only if "people"
    full_name: data.full_name,
    role: data.role,
    organisation: data.organisation,
    biog: data.biog,
    email: data.email,
    tel: data.tel,
    twitter: data.twitter,
    linkedin: data.linkedin,
    photo: ({
      url: data.photo.url,
      alt: data.photo.description
    } if data.photo)
  }.compact
end

###########################################################################
## =Featured data
###########################################################################

def featuredData(data, opts = {})
  defaults = { parent_data: false }
  opts = defaults.merge(opts)
  parentData = opts[:parent_data]

  isPage = ["child_page", "landing_page"].include? data.content_type.id
  isProduct = data.content_type.id == "product"
  isPeople = data.content_type.id == "people"
  isRegistration = data.content_type.id == "registration"

  featuredAuthorData = {}
  featuredPageData = {}
  featuredProductData = {}
  featuredRegistrationData = {}

  ## =Core
  ########################################

  featuredCoreData = {
    ID: data.sys[:id],
    TYPE: data.content_type.id
  }

  ## =People
  ########################################

  if isPeople
    featuredAuthorData = profile(data)
  end

  ## =Page
  ########################################

  if isPage
    featuredPageData = {
      title: data.title,
      meta_label: metaLabel(data),
      slug: slug(data),
      category: (detachCategory(data.category) if data.category),
      sub_category: (detachCategory(data.category, { part: 1 }) if data.category.include? $seperator),
      introduction: data.introduction,
      banner_image: media(data.banner_image, focus: data),
      product_image: (media(data.featured[0].image) if data.content_type.id == "child_page" && data.featured && data.featured[0].content_type.id == "product"),
      date_time: dateTime(data)
    }.compact
  end

  ## =Product
  ########################################

  if isProduct
    featuredProductData = {
      meta_title: data.meta_title,
      title: data.title,
      meta_label: metaLabel(parentData),
      price: data.price,
      typeform: ("#{ data.typeform }?product_name=#{ URI::encode(data.meta_title) }&item_price=#{ URI::encode("£#{ data.price }") }#{ data.media ? "&download=https:#{data.media.url}" : ""  }" if data.typeform),
      image: {
        url: data.image.url,
        alt: data.image.description
      },
      download: (data.media.url if data.media)
    }.compact
  end

  ## =Registration
  ########################################

  if isRegistration
    featuredRegistrationData = {
      meta_title: data.meta_title,
      meta_label: metaLabel(parentData, { reg_data: data }),
      venue: data.venue,
      price: data.price,
      date_time: dateTime(data),
      embed_code: data.embed_code,
      modal: {
        cta_id: targetID("registration", data.meta_title, data),
        content: data.embed_code
      }
    }
  end

  # Merge
  featuredCoreData.merge(
    **featuredAuthorData,
    **featuredPageData,
    **featuredProductData,
    **featuredRegistrationData
  ).compact
end

###########################################################################
## =Form
###########################################################################

def form(data)
  {
    ID: data.sys[:id],
    TYPE: data.content_type.id,
    meta_title: data.meta_title,
    footer: data.footer,
    confirmation: data.confirmation,
    elements: data.elements.map do |elem|
      {
        label: elem.label.parameterize.gsub("-required", ""),
        input_type: elem.input_type.parameterize,
        required: elem.required
      }
    end
  }
end

###########################################################################
## =Calls to action
###########################################################################

def ctaData(cta)
  isDownload = cta.content_type.id == "cta_download"
  isModal = cta.content_type.id == "cta_modal"
  isPage = cta.content_type.id == "cta_page"

  {
    ID: cta.sys[:id],
    TYPE: cta.content_type.id,
    title: cta.title,
    button_text: cta.button_text,
    file: (media(cta.file, title: true) if isDownload),
    page_slug: (slug(cta.page) if isPage),
    page_slug_anchor: (cta.url_anchor if isPage && cta.url_anchor),
    modal: ({
      cta_id: targetID("modal", cta.title, cta),
      content: (cta.modal if cta.modal),
      form: (form(cta.form) if cta.form)
    }.compact if isModal)
  }.compact
end

def callsToAction(data)

  if defined?(data.calls_to_action) && data.calls_to_action
    data.calls_to_action.map do |cta|
      ctaData(cta)
    end
  elsif defined?(data.call_to_action) && data.call_to_action
    ctaData(data.call_to_action)
  end
end

###########################################################################
## =Text box
###########################################################################

def textBox(data)
  {
    title: data.title,
    show_title: data.show_title,
    background_color: data.background_color.parameterize,
    copy: data.copy,
    copy_size: (data.copy_size ? data.copy_size.parameterize : "normal"),
    image: (media(data.image) if data.image),
    image_border: data.image_border,
    inline_header: data.inline_header,
    calls_to_action: callsToAction(data)
  }.compact
end

###########################################################################
## =Panels
###########################################################################

def panels(ctx, data)
  ctx.panels = data.panels.map do |panel|
    isPanelAccordians = panel.content_type.id == "panel_accordians"
    isPanelBand = panel.content_type.id == "panel_band"
    isPanelCarouselCustom = panel.content_type.id == "panel_carousel"
    isPanelCarouselCategory = panel.content_type.id == "panel_carousel_category"
    isPanelChart = panel.content_type.id == "panel_chart"
    isPanelContent = panel.content_type.id == "panel_content"
    isPanelFeed = panel.content_type.id == "panel_feed"
    isPanelHeader = panel.content_type.id == "panel_header"
    isPanelTextBoxes = panel.content_type.id == "panel_text_boxes"

    panelAccordians = {}
    panelBand = {}
    panelCarouselCustom = {}
    panelCarouselCategory = {}
    panelChart = {}
    panelContent = {}
    panelFeed = {}
    panelTextBoxes = {}

    ## =Core
    ########################################

    # Contains all panel_header fields too
    panelShared = {
      ID: panel.sys[:id],
      TYPE: panel.content_type.id,
      background_color: panel.background_color.parameterize,
      calls_to_action: (callsToAction(panel) if !isPanelChart && !isPanelTextBoxes),
      title: panel.title,
      heading_level: ((panel.heading_level ? panel.heading_level.parameterize : "level-2") if !isPanelHeader)
    }.compact

    if isPanelAccordians || isPanelBand || isPanelContent
      panelShared.merge!({
        copy: panel.copy
      }.compact)
    end

    if isPanelBand || isPanelContent
      panelShared.merge!({
        image: (media(panel.image) if panel.image),
      }.compact)
    end

    if isPanelBand || isPanelChart || isPanelContent || isPanelFeed || isPanelTextBoxes
      panelShared.merge!({
        show_title: panel.show_title
      }.compact)
    end

    ## =Accordions
    ########################################

    if isPanelAccordians
      panelAccordians = {
        accordians: panel.accordians.map do |accordian|
          {
            ID: accordian.sys[:id],
            cta_id: targetID("accordian", accordian.title, accordian),
            title: accordian.title,
            copy: accordian.copy,
            calls_to_action: callsToAction(accordian)
          }.compact
        end
      }
    end

    ## =Band
    ########################################

    if isPanelBand
      panelBand = {
        copy_size: (panel.copy_size ? panel.copy_size.parameterize : "medium"),
        image_size: (panel.image_size.parameterize if panel.image_size),
        overlap: panel.overlap
      }
    end

    ## =Carousel (custom)
    ########################################

    if isPanelCarouselCustom
      panelCarouselCustom = {
        carousel: panel.items.map do |item|
          isLandingPage = item.content_type.id == "landing_page"
          isChildPage = item.content_type.id == "child_page"
          isPeople = item.content_type.id == "people"
          isQuote = item.content_type.id == "quote"

          {
            ID: item.sys[:id],
            TYPE: item.content_type.id,
            profile: (profile(item) if isPeople),
            quote: ({
              text: item.quote,
              full_name: item.full_name,
              role: item.role,
              organisation: item.organisation,
              logo: ({
                url: item.logo.url,
                description: item.logo.description
              }.compact if item.logo)
            }.compact if isQuote),
            page: ({
              ID: item.sys[:id],
              TYPE: item.content_type.id,
              title: item.title.gsub('"', "&quot;").rstrip,
              banner_image: (media(item.banner_image, focus: item) if item.banner_image),
              introduction: item.introduction.gsub('"', "&quot;"),
              slug: slug(item),
              category: detachCategory(item.category),
              category_orig: item.category.downcase,
              meta_label: metaLabel(item)
            } if isChildPage || isLandingPage)
          }.compact
        end
      }
    end

    ## =Carousel (category)
    ########################################

    if isPanelCarouselCategory
      panelCarouselCategory = {
        category: panel.category.downcase
      }.compact
    end

    ## =Chart
    ########################################

    if isPanelChart
      def chartPanelData(data)
        chartPanelData = {
          ID: data.sys[:id],
          TYPE: data.content_type.id,
        }

        chartData = {}
        textBoxData = {}

        if data.content_type.id == "chart"
          chartData = {
            title: data.title,
            caption: data.caption,
            show_header: data.show_header,
            chart_type: data.chart_type.split(" ").map.with_index{ |x, i| i > 0 ? x.capitalize : x.downcase }.join, # Convert to camelCase
            chart_datasets: data.datasets.to_json.to_s, # Arr
            chart_labels: (data.labels ? data.labels.to_json.to_s : "[]"), # Arr / optional
            chart_options: (data.options ? data.options.to_json.to_s : "{}"), # Obj
            chart_custom_config: (data.custom_config ? data.custom_config.to_json.to_s : "{}"), # Obj / optional
            chart_width: data.width,
            chart_height: data.height,
            citation: data.citation
          }
        end

        if data.content_type.id == "text_box"
          textBoxData = textBox(data)
        end

        chartPanelData.merge(
          **chartData,
          **textBoxData
        ).compact
      end

      panelChart = {
        charts_row_1: panel.charts_row_1.map{|entry| chartPanelData(entry)},
        charts_row_2: (panel.charts_row_2.map{|entry| chartPanelData(entry)} if panel.charts_row_2),
        rows_width: (panel.rows_width.parameterize if panel.rows_width)
      }
    end

    ## =Content
    ########################################

    if isPanelContent
      panelContent = {
        copy_size: (panel.copy_size ? panel.copy_size.parameterize : "normal"),
        show_more: ({
          cta_id: targetID("expand", panel.title, panel),
          content: panel.show_more
        }.compact if panel.show_more),
        image_border: panel.image_border,
        image_shrink: panel.image_shrink,
        tweet: ({
          text: URI::encode(panel.tweet_text),
          media: panel.tweet_media
        } if panel.tweet_text)
      }
    end

    ## =Feed
    ########################################

    if isPanelFeed
      panelFeed = {
        feed: {
          category: detachCategory(panel.feed_category),
          sub_category: (
            detachCategory(panel.feed_category, { part: 1 }) if panel.feed_category.include? $seperator
          )
        }.compact
      }
    end

    ## =Text boxes
    ########################################

    if isPanelTextBoxes
      panelShared.merge!({
        container_size: panel.container_size.parameterize,
        text_boxes: panel.text_boxes.map{|tb| textBox(tb)}
      }.compact)
    end

    ## =Merge panels
    ########################################

    panelShared.merge(
      **panelAccordians,
      **panelBand,
      **panelCarouselCategory,
      **panelCarouselCustom,
      **panelContent,
      **panelFeed,
      **panelChart,
      **panelTextBoxes
    ).compact
  end
end

###########################################################################
## =Universal
###########################################################################

class UniversalMap < ContentfulMiddleman::Mapper::Base
  def map(context, entry)
    context.ID = entry.sys[:id]
    context.TYPE = entry.content_type.id
    context.title = entry.title
    context.site_title = entry.site_title
    context.site_title_seo = entry.site_title_seo
    context.site_url = entry.site_url
    context.test_site_url = entry.test_site_url
    context.copyright = entry.copyright
    context.default_banner = media(entry.default_banner)
    context.logo = {
      mobile: media(entry.logo_mobile),
      desktop: media(entry.logo_desktop)
    }

    ## =Newsletter
    ########################################

    context.main_newsletter = {
      title: entry.main_newsletter.title,
      copy: entry.main_newsletter.copy,
      call_to_action: (callsToAction(entry.main_newsletter) if entry.main_newsletter.call_to_action),
    }

    ## =Categories/sub-categories
    ########################################

    context.site_config = entry.site_config

    ## =Redirects
    ########################################

    context.url_redirects = entry.redirects

    ## =Social
    ########################################

    context.twitter = entry.twitter
    context.linkedin = entry.linkedin
    context.facebook = entry.facebook

    ## =Meta
    ########################################

    context.meta = {
      analytics: entry.meta_analytics
    }

    ## =Footer pages
    ########################################

    context.footer_pages = entry.footer_pages.map do |page|
      {
        title: page.title,
        slug: slug(page)
      }
    end

  end
end

###########################################################################
##  =Homepage
###########################################################################

class HomeMap < ContentfulMiddleman::Mapper::Base
  def map(context, entry)
    sharedPageBase("homePage", context, entry)
    context.slug = "index"

    if entry.featured_pages
      context.featured_pages = entry.featured_pages.map do |page|
        {
          ID: page.sys[:id],
          title: page.title,
          meta_label: metaLabel(page),
          slug: slug(page),
          category: (detachCategory(page.category) if page.category),
          sub_category: (detachCategory(page.category, { part: 1 }) if page.category.include? $seperator),
          introduction: page.introduction,
          banner_image: media(page.banner_image, focus: page),
          date_time: dateTime(page)
        }
      end
    end

    if entry.panels
      panels(context, entry)
    end
  end
end

###########################################################################
##  =Navbar
###########################################################################

class NavbarMap < ContentfulMiddleman::Mapper::Base
  def map(context, entry)

    context.title = entry.title.rstrip
    context.order = entry.order
    context.sub_cat_group_1 = entry.sub_cat_group_1
    context.sub_cat_group_2 = entry.sub_cat_group_2

    # External pages
    if entry.url
      context.external_url = entry.url
    end

    # Column 1 items
    if entry.items_col_1
      context.items_col_1 = entry.items_col_1.map do |item|
        shared = {
          ID: item.sys[:id],
          TYPE: item.content_type.id,
          title: item.title
        }

        # Child/landing page
        if ["child_page", "landing_page"].include?(item.content_type.id)
          {
            slug: slug(item),
            category: detachCategory(item.category),
            sub_category: (detachCategory(item.category, { part: 1 }) if item.category.include? $seperator)
          }.merge(shared)

        # Theme page
        elsif item.content_type.id == "theme_page"
          {
            slug: item.slug,
            category: "_THEME_"
          }.merge(shared)

        # Text box
        elsif item.content_type.id == "text_box"
          {
            copy: item.copy,
            show_title: item.show_title,
            call_to_action: (callsToAction(item) if item.call_to_action),
            category: "_TEXT_BOX_"
          }.merge(shared)
        end
      end
    end

    # Column 2 items
    if entry.items_col_2
      context.items_col_2 = entry.items_col_2.map do |item|

        # Shared
        shared = {
          ID: item.sys[:id],
          TYPE: item.content_type.id,
          title: item.title
        }

        # Child/landing page
        if ["child_page", "landing_page"].include?(item.content_type.id)
          {
            slug: slug(item),
            category: detachCategory(item.category),
            sub_category: (detachCategory(item.category, { part: 1 }) if item.category.include? $seperator)
          }.merge(shared)

        # Theme page
        elsif item.content_type.id == "theme_page"
          {
            slug: item.slug,
            category: "_THEME_"
          }.merge(shared)

        # Text box
        elsif item.content_type.id == "text_box"
          {
            copy: item.copy,
            show_title: item.show_title,
            call_to_action: callsToAction(item),
            category: "_TEXT_BOX_"
          }.merge(shared)
        end
      end
    end
  end
end

###########################################################################
##  =People
###########################################################################

class PeopleMap < ContentfulMiddleman::Mapper::Base
  def map(context, entry)
    context.ID = entry.sys[:id]
    context.TYPE = entry.content_type.id
    context.full_name = entry.full_name
    context.role = entry.role
    context.organisation = entry.organisation
    context.biog = entry.biog
    context.email = entry.email
    context.tel = entry.tel
    context.twitter = entry.twitter
    context.linkedin = entry.linkedin
    context.employment = (entry.employment.parameterize if entry.employment)
    context.photo = media(entry.photo)
  end
end

###########################################################################
##  =Landing page
###########################################################################

class LandingPageMap < ContentfulMiddleman::Mapper::Base
  def map(context, entry)
    sharedPageBase("landingPage", context, entry) # core page data
    context.show_introduction = entry.show_introduction
    context.latest_carousel = entry.latest_carousel # latest related cards carousel
    context.share_buttons = entry.share_buttons

    # Check if set as index of category/ sub-category
    if entry.index_page
      context.index_page = entry.index_page
    end

    # Call(s) to action
    if entry.calls_to_action
      context.calls_to_action = callsToAction(entry)
    end

    # Panels
    if entry.panels
      panels(context, entry)
    end
  end
end

###########################################################################
##  =Child page
###########################################################################

class ChildPageMap < ContentfulMiddleman::Mapper::Base
  def map(context, entry)
    sharedPageBase("childPage", context, entry) # core page data

    context.copy = entry.copy # main copy
    context.canonical_link = entry.canonical_link

    # Featured
    if entry.featured
      context.featured = entry.featured.map do |featured|
        if featured.content_type
          featuredData(featured, { parent_data: entry })
        end
      end
    end

    # External links
    if entry.external_links
      context.external_links = entry.external_links.map do |link|
        {
          title: link.title,
          category: link.category.parameterize,
          outlet: PublicSuffix.parse(URI.parse(link.url).host).domain,
          url: link.url
        }
      end
    end
  end
end

###########################################################################
##  =Theme page
###########################################################################

class ThemePageMap < ContentfulMiddleman::Mapper::Base
  def map(context, entry)
    sharedPageBase("themePage", context, entry) # core page data
    context.theme = entry.title.parameterize
    context.slug = "#{ entry.slug }/index"
  end
end

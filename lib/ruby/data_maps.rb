markerSym = "❱❱"
$marker = "#{ markerSym }"

###########################################################################
##		=Detatch category
###########################################################################

def detachCategory(data, opts = {})
  defaults = { part: 0 }
  opts = defaults.merge(opts)
  part = opts[:part]

  data.include?($marker) ? data.split($marker)[part].parameterize : data.parameterize
end

###########################################################################
##		=Target ID
###########################################################################

def targetID(type, dataTitle, dataID)
  "#{ type }-" + dataTitle.split("::")[0].parameterize + "-" + dataID.sys[:id]
end

###########################################################################
##		=Slug
###########################################################################

def slug(data)
  indexPage = data.content_type.id == "landing_page" ? data.index_page : false
  category = detachCategory(data.category)
  slug = data.slug

  if data.category.include? $marker
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
end

###########################################################################
##		=Date/ time
###########################################################################

def dateTime(data)
  dateTimeData = {
    integer: data.date_time.strftime("%s").to_i,
    date: data.date_time.strftime("%d %b, %y"),
    time: data.date_time.strftime("%I:%M %p"),
    day: data.date_time.strftime("%d"),
    month: data.date_time.strftime("%b"),
    year: data.date_time.strftime("%Y")
  }
end

###########################################################################
##		=Media data
###########################################################################

def media(data, opts = {})
  defaults = {
    focus: false,
    title: false
  }
  opts = defaults.merge(opts)

  mediaData = {
    url: data.url,
    alt: data.description,
    title: (data.title if opts[:title]),
    focus: (opts[:focus].image_focus.parameterize if opts[:focus])
  }.compact
end

###########################################################################
##		=Meta label
###########################################################################

def metaLabel(data, opts = {})
  defaults = { reg_data: false }
  opts = defaults.merge(opts)

  regData = opts[:reg_data]

  hasSubcategory = data.category.include?($marker)
  hasNestedRegistration = data.featured && data.featured[0].content_type.id == "registration"

  category = detachCategory(data.category)
  subCategory = detachCategory(data.category, { part: 1 }) if hasSubcategory

  baseLabel = "#{ category }#{ " / " + subCategory if hasSubcategory }"

  if regData
    "#{ baseLabel } / #{ dateTime(regData)[:date] }"
  else
    if hasNestedRegistration
      "#{ baseLabel } / #{ dateTime(data.featured[0])[:date] }"
    else
      category == "blog" ? "#{ baseLabel } / #{ dateTime(data)[:date] }" : "#{ baseLabel }"
    end
  end
end

###########################################################################
##		=Shared page data
###########################################################################

def sharedPageBase(pageType, ctx, data)

  # Shared
  ctx.ID = data.sys[:id]
  ctx.TYPE = data.content_type.id
  ctx.title = data.title
  ctx.banner_image = media(data.banner_image, focus: data)
  ctx.introduction = data.introduction

  # Landing/ home page
  if ["landingPage", "homePage"].include? pageType
    ctx.subtitle = data.subtitle
  end

  # Child/ landing page
  if ["childPage", "landingPage"].include? pageType

    ctx.category = detachCategory(data.category)
    ctx.meta_label = metaLabel(data)
    ctx.slug = slug(data)

    # Has sub-category
    if data.category.include? $marker
      ctx.sub_category = detachCategory(data.category, { part: 1 })
    end

    # Has alternative date/ time
    if data.featured && data.featured[0].content_type.id == "registration"
      ctx.date_time = dateTime(data.featured[0])
      ctx.date_time_alt = dateTime(data.featured[0])
    else
      ctx.date_time = dateTime(data)
    end

    ctx.blog_count = data.blog_count if data.blog_count
    ctx.tags = data.tags.map{ |tag| tag.gsub("'", "").parameterize } if data.tags
  end
end

###########################################################################
##		=Profile data
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
##		=Featured data
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

  # Core
  featuredCoreData = {
    ID: data.sys[:id],
    TYPE: data.content_type.id
  }

  # People
  if isPeople
    featuredAuthorData = profile(data)
  end

  # Page
  if isPage
    featuredPageData = {
      title: data.title,
      meta_label: metaLabel(data),
      slug: slug(data),
      category: (detachCategory(data.category) if data.category),
      sub_category: (detachCategory(data.category, { part: 1 }) if data.category.include? $marker),
      introduction: data.introduction,
      banner_image: media(data.banner_image, focus: data),
      date_time: dateTime(data)
    }.compact
  end

  # Product
  if isProduct
    featuredProductData = {
      title: data.title,
      meta_label: metaLabel(parentData),
      product_id: data.product_id,
      price: data.price,
      image: {
        url: data.image.url,
        alt: data.image.description
      },
      download: (data.media.url if data.media)
    }.compact
  end

  # Registration
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

  # Merged
  featuredCoreData.merge(
    **featuredAuthorData,
    **featuredPageData,
    **featuredProductData,
    **featuredRegistrationData
  ).compact
end

###########################################################################
##		=Calls to action
###########################################################################

def callsToAction(data)

  ctaData = (defined?(data.calls_to_action) && data.calls_to_action ? data.calls_to_action.map do |cta|
    isDownload = cta.content_type.id == "cta_download"
    isModal = cta.content_type.id == "cta_modal"
    isPage = cta.content_type.id == "cta_page"

    {
      ID: cta.sys[:id],
      TYPE: cta.content_type.id,
      title: cta.title,
      button_text: cta.button_text,
      file: (media(cta.file, title: true) if isDownload),
      modal: ({
        cta_id: targetID("modal", cta.title, cta),
        content: cta.modal,
      }.compact if isModal),
      page: ({
        title: "Hello"
      }.compact if isPage)
    }.compact
  end : nil)
end

###########################################################################
##		=Panels
###########################################################################

def panels(ctx, data)
  ctx.panels = data.panels.map do |panel|
    isPanelAccordians = panel.content_type.id == "panel_accordians"
    isPanelCarouselCustom = panel.content_type.id == "panel_carousel"
    isPanelCarouselCategory = panel.content_type.id == "panel_carousel_category"
    isPanelContent = panel.content_type.id == "panel_content"
    isPanelFeed = panel.content_type.id == "panel_feed"
    isPanelHeader = panel.content_type.id == "panel_header"

    panelAccordians = {}
    panelCarouselCustom = {}
    panelCarouselCategory = {}
    panelContent = {}
    panelFeed = {}

    ##		=Panel core
    ########################################

    # Contains all panel_header fields too
    panelCore = {
      ID: panel.sys[:id],
      TYPE: panel.content_type.id,
      title: panel.title,
      calls_to_action: callsToAction(panel),
      copy: (panel.copy if isPanelContent || isPanelAccordians),
      background_color: (panel.background_color.parameterize if !isPanelAccordians),
      show_title: (panel.show_title if isPanelContent || isPanelFeed),
    }.compact

    ##		=Panel accordions
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

    ##		=Panel carousel (custom)
    ########################################

    if isPanelCarouselCustom
      panelCarouselCustom = {
        carousel: panel.items.map do |item|
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
              image: ({
                url: item.image.url,
                description: item.image.description
              }.compact if item.image),
              image_type: item.image_type
            }.compact if isQuote)
          }.compact
        end
      }
    end

    ##		=Panel carousel (category)
    ########################################

    if isPanelCarouselCategory
      panelCarouselCategory = {
        category: panel.category.downcase
      }.compact
    end

    ##		=Panel content
    ########################################

    if isPanelContent
      panelContent = {
        copy_size: (panel.copy_size.parameterize if panel.copy_size),
        show_more: ({
          cta_id: targetID("expand", panel.title, panel),
          content: panel.show_more
        }.compact if panel.show_more),
        image: media(panel.image),
        image_size: panel.image_size.parameterize,
        share_buttons: panel.share_buttons
      }
    end

    ##		=Panel feed
    ########################################

    if isPanelFeed
      panelFeed = {
        feed: {
          category: detachCategory(panel.feed_category),
          sub_category: (
            detachCategory(panel.feed_category, { part: 1 }) if panel.feed_category.include? $marker
          ),
          initial_count: panel.initial_count,
          dedupe: panel.dedupe
        }.compact
      }
    end

    ##		=Merge panels
    ########################################

    panelCore.merge(
      **panelContent,
      **panelAccordians,
      **panelCarouselCustom,
      **panelCarouselCategory,
      **panelFeed
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
    context.site_url = entry.site_url

    context.newsletter_text = entry.newsletter_text
    context.newsletter_embed = entry.newsletter_embed

    context.uncss_urls = entry.uncss_urls

    context.twitter = entry.twitter
    context.linkedin = entry.linkedin
    context.facebook = entry.facebook

    context.logo = {
      mobile: media(entry.logo_mobile),
      desktop: media(entry.logo_desktop)
    }

    context.meta = {
      analytics: entry.meta_analytics
    }
  end
end

###########################################################################
##  =Homepage
###########################################################################

class HomeMap < ContentfulMiddleman::Mapper::Base
  def map(context, entry)
    sharedPageBase("homePage", context, entry)
    context.slug = "index"

    if entry.panels
      panels(context, entry)
    end
  end
end

###########################################################################
##  =Navigation
###########################################################################

class NavigationMap < ContentfulMiddleman::Mapper::Base
  def map(context, entry)

    context.title = entry.title

    # Site pages
    if entry.pages
      context.pages = entry.pages.map do |page|
        {
          title: page.title,
          slug: slug(page),
          category: detachCategory(page.category),
          sub_category: (detachCategory(page.category, { part: 1 }) if page.category.include? $marker)
        }.compact
      end
    end

    # External pages
    if entry.url
      context.external_url = entry.url
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

    # Check if set as index of category/ sub-category
    if entry.index_page
      context.index_page = entry.index_page
    end

    # Call(s) to action
    if entry.calls_to_action
      context.calls_to_action = callsToAction(entry)
    end

    # Featured content
    # if entry.featured
    #   context.featured = entry.featured.map do |featured|
    #     featuredData(featured)
    #   end
    # end

    if entry.panels
      panels(context, entry)
    end

    # Tagging
    if entry.tags
      context.tags = entry.tags.map{ |tag| tag.gsub("'", "").parameterize }
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

    # Featured
    if entry.featured
      context.featured = entry.featured.map do |featured|
        # featuredData(featured, { parentData: entry })
        featuredData(featured, { parent_data: entry })
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

    # Tags
    if entry.tags
      context.tags = entry.tags.map{ |tag| tag.gsub("'", "").parameterize }
    end
  end
end

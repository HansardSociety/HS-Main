############################################################
##  =Shared
############################################################

# Parameterize sub-category
def subCategorySlugify(data)
  data.sub_category.split(" :: ")[1].parameterize
end

# Slug
def slug(ctx, data, opts = {})
  defaults = {
    category: data.category.parameterize,
    indexPage: false,
    slug: data.slug,
    subCategory: data.sub_category
  }
  opts = defaults.merge(opts)

  category = opts[:category]
  indexPage = opts[:indexPage]
  slug = opts[:slug]
  subCategory = opts[:subCategory]

  if subCategory
    ctx.slug = "#{ category }/#{ subCategorySlugify(data) }/#{ indexPage ? "index" : slug }"
  else
    ctx.slug = "#{ category }/#{ indexPage ? "index" : slug }"
  end
end

# Date/ time formatting
def dateTime(data)
  dateTimeData = {
    integer: data.date_time.strftime('%s').to_i,
    date: data.date_time.strftime('%d %b, %y'),
    time: data.date_time.strftime('%I:%M %p'),
    day: data.date_time.strftime('%d'),
    month: data.date_time.strftime('%b'),
    year: data.date_time.strftime('%Y')
  }
end

# Media data (ie. images/ files)
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

# Meta label
def metaLabel(data, opts = {})
  defaults = {
    dataAlt: false
  }
  opts = defaults.merge(opts)

  dataAlt = opts[:dataAlt]
  isPage = ["child_page", "landing_page"].include? data.content_type.id

  # Check if alternative data, eg. product/ registration
  if dataAlt
    isProduct = dataAlt.content_type.id == "product"
    isRegistration = dataAlt.content_type.id == "registration"

    # In case sub-category isn't defined (though it should always be!)
    if data.sub_category
      isRegistration \
        ? "#{ data.category } / #{ subCategorySlugify(data).gsub("-", " ") } / #{ dateTime(dataAlt)[:date] }" \
        : "#{ data.category } / #{ subCategorySlugify(data).gsub("-", " ") }"

    else
      isRegistration \
        ? "#{ data.category } / #{ dateTime(dataAlt)[:date] }" \
        : "#{ data.category }"
    end

  elsif isPage
    usesDate = ["Blog", "Events"].include? data.category
    isBlog = data.category == "Blog"
    isEvent = data.category == "Events"

    isBlog \
      ? "#{ data.category } / #{ dateTime(data)[:date] }" \
      : "#{ data.category }"
  end
end

# Core page data
def sharedPageBase(pageType, ctx, data)

  # Shared
  ctx.ID = data.sys[:id]
  ctx.TYPE = data.content_type.id
  ctx.title = data.title
  ctx.banner_image = media(data.banner_image, focus: data)

  # Landing/ home page
  if ["landingPage", "homePage"].include? pageType
    ctx.subtitle = data.subtitle
  end

  # Child/ landing page
  if ["childPage", "landingPage"].include? pageType
    ctx.category = data.category.parameterize

    # Has sub-category
    if data.sub_category
      ctx.sub_category = subCategorySlugify(data)
    end

    ctx.introduction = data.introduction
    ctx.date_time = dateTime(data)

    # Has alternative date/ time
    if data.featured && data.featured[0].content_type.id == "registration"
      ctx.date_time_alt = dateTime(data.featured[0])
    end

    ctx.blog_count = data.blog_count if data.blog_count
    ctx.tags = data.tags.map{ |tag| tag.gsub("'", '').parameterize } if data.tags
  end
end

# Featured page
def featuredPage(data)
  featuredPageData = ({
    title: data.title,
    slug: data.slug.parameterize,
    category: (data.category.parameterize if data.category),
    sub_category: (subCategorySlugify(data) if data.sub_category),
    introduction: data.introduction,
    banner_image: media(data.banner_image, focus: data),
    date_time: dateTime(data),
    date_time_alt: (dateTime(data.featured[0]) if data.featured && data.featured[0].content_type.id == 'registration')
  }.compact if ['child_page', 'landing_page'].include? data.content_type.id)
end

# Calls to action
def callsToAction(data)
  ctaData = (defined?(data.calls_to_action) && data.calls_to_action ? data.calls_to_action.map do |cta| {
    ID: cta.sys[:id],
    title: cta.title.split(" :: ")[0], # split '::' for contentful name-spacing
    action: cta.action.parameterize, # eg. modal, download etc
    button_text: cta.button_text,
    file: (media(cta.file, title: true) if cta.file),
    modal: ({
      cta_id: (cta.title.split(" :: ")[0].parameterize + '-' + cta.sys[:id]), # split '::' for contentful name-spacing
      content: cta.modal,
      width: (cta.modal_width ? cta.modal_width.parameterize : 'wide')
    }.compact if cta.action == 'Modal')
  }.compact end : nil)
end

def profile(data)
  profileData = {
    cta_id: ((data.full_name + '-' + data.sys[:id]).parameterize if data.full_name), # only if 'people'
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

############################################################
## =Universal
############################################################

class UniversalMap < ContentfulMiddleman::Mapper::Base
  def map(context, entry)
    context.ID = entry.sys[:id]
    context.TYPE = entry.content_type.id
    context.title = entry.title

    context.site_title = entry.site_title
    context.site_url = entry.site_url
    context.main_categories = entry.main_categories.map{ |cat| cat.parameterize.gsub("'", "") }
    context.newsletter_text = entry.newsletter_text
    context.newsletter_embed = entry.newsletter_embed
    context.uncss_urls = entry.uncss_urls

    context.logo = {
      mobile: media(entry.logo_mobile),
      desktop: media(entry.logo_desktop)
    }

    context.meta = {
      analytics: entry.meta_analytics
    }
  end
end

############################################################
##  =Homepage
############################################################

class HomeMap < ContentfulMiddleman::Mapper::Base
  def map(context, entry)
    sharedPageBase("homePage", context, entry)
    context.slug = "index"
  end
end

############################################################
##  =Navigation
############################################################

class NavigationMap < ContentfulMiddleman::Mapper::Base
  def map(context, entry)

    context.title = entry.title

    # Site pages
    if entry.pages
      context.pages = entry.pages.map do |page| {
        title: page.title,
        slug: page.slug,
        category: page.category.parameterize
      }
      end
    end

    # External pages
    if entry.url
      context.external_url = entry.url
    end
  end
end

############################################################
##  =People
############################################################

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

############################################################
##  =Landing page
############################################################

class LandingPageMap < ContentfulMiddleman::Mapper::Base
  def map(context, entry)
    slug(context, entry, { indexPage: entry.index_page ? true : false })
    sharedPageBase("landingPage", context, entry) # core page data
    context.latest_carousel = entry.latest_carousel # latest related cards carousel

    # Check if set as index of category/ sub-category
    if entry.index_page
      context.index_page = entry.index_page
    end

    # Call(s) to action
    if entry.calls_to_action
      context.calls_to_action = callsToAction(entry)
    end

    # Featured
    if entry.featured
      context.featured = entry.featured.map do |featured| {
        ID: featured.sys[:id],
        TYPE: featured.content_type.id,
        page: featuredPage(featured)
      }.compact
      end # End: Featured map
    end # End: All featured

    # Panels
    if entry.panels
      context.panels = entry.panels.map do |panel| {

        # Core
        ID: panel.sys[:id],
        TYPE: panel.content_type.id,
        title: panel.title,

        # Calls to action
        calls_to_action: callsToAction(panel),

        # Panel content and accordians
        label: (panel.label if [ 'panel_accordians', 'panel_content' ].include? panel.content_type.id),
        copy: (panel.copy if [ 'panel_accordians', 'panel_content' ].include? panel.content_type.id),

        # Panel content
        copy_size: (panel.copy_size.parameterize if panel.content_type.id == 'panel_content' && panel.copy_size),
        show_title: (panel.show_title if panel.content_type.id == 'panel_content'),
        section_header: (panel.section_header if panel.content_type.id == 'panel_content'),
        background_color: (panel.background_color.parameterize if (['panel_content', 'panel_carousel'].include? panel.content_type.id) && panel.background_color),
        show_more: ({
          cta_id: (panel.title.split('::')[0].parameterize + '-' + panel.sys[:id]), # split '::' for contentful name-spacing
          content: panel.show_more
        }.compact if panel.content_type.id == 'panel_content' && panel.show_more),
        image: (media(panel.image) if panel.content_type.id == 'panel_content' && panel.image),
        panel_width: ((panel.panel_width ? panel.panel_width.parameterize : 'wide') if panel.content_type.id == 'panel_content'),
        share_buttons: (panel.share_buttons if panel.content_type.id == 'panel_content'),

        # Panel carousel cards
        carousel: (panel.content_type.id == 'panel_carousel' ? panel.items.map do |item| {
          ID: item.sys[:id],
          TYPE: item.content_type.id,

          # Profile
          profile: (profile(item) if item.content_type.id == 'people'),

          # Quotes
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
          }.compact if item.content_type.id == 'quote')
        }.compact end : nil),

        # Panel accordian
        accordians: (panel.content_type.id == 'panel_accordians' ? panel.accordians.map do |accordian| {
          ID: accordian.sys[:id],
          cta_id: ('accordian-' + accordian.title.split('::')[0].parameterize + '-' + accordian.sys[:id]), # split '::' for contentful name-spacing
          title: accordian.title,
          copy: accordian.copy,
          calls_to_action:  callsToAction(accordian)
        }.compact end : nil)
      }.compact
      end
    end

    # Tagging
    if entry.tags
      context.tags = entry.tags.map{ |tag| tag.gsub("'", '').parameterize }
    end
  end
end

############################################################
##  =Child page
############################################################

class ChildPageMap < ContentfulMiddleman::Mapper::Base
  def map(context, entry)
    slug(context, entry)
    sharedPageBase("childPage", context, entry) # core page data
    context.meta_label = entry.featured && (["product", "registration"].include? entry.featured[0].content_type.id) ? metaLabel(entry, { dataAlt: entry.featured[0] }) : metaLabel(entry)
    context.copy = entry.copy # main copy

    # Featured
    if entry.featured
      context.featured = entry.featured.map do |featured| {
        ID: featured.sys[:id],
        TYPE: featured.content_type.id,
        meta_label: ((["product", "registration"].include? featured.content_type.id) ? metaLabel(entry, { dataAlt: featured }) : metaLabel(featured)), # only include alt data if registration/ product

        # Featured (people)
        author: (profile(featured) if featured.content_type.id == 'people'),

        # Featured registration
        registration: ({
          meta_title: featured.meta_title,
          venue: featured.venue,
          price: featured.price,
          date_time: dateTime(featured),
          embed_code: featured.embed_code,
          modal: {
            cta_id: (featured.meta_title.split('::')[0].parameterize + '-' + featured.sys[:id]), # split '::' for contentful name-spacing
            content: featured.embed_code
          }
        }.compact if featured.content_type.id == 'registration'),

        # Featured product
        product: ({
          title: featured.title,
          product_id: featured.product_id,
          price: featured.price,
          image: {
            url: featured.image.url,
            alt: featured.image.description
          },
          download: (featured.media.url if featured.media)
        }.compact if featured.content_type.id == 'product'),

        # Featured page
        page: featuredPage(featured)
      }.compact
      end # End: Featured map
    end # End: All featured

    # External links
    if entry.external_links
      context.external_links = entry.external_links.map do |link| {
        title: link.title,
        category: link.category.parameterize,
        outlet: PublicSuffix.parse(URI.parse(link.url).host).domain,
        url: link.url
      }
      end
    end

    # Tags
    if entry.tags
      context.tags = entry.tags.map{ |tag| tag.gsub("'", '').parameterize }
    end
  end
end

############################################################
##  Root page
############################################################

class RootPageMap < ContentfulMiddleman::Mapper::Base
  def map(context, entry)

    ##  Core
    ##############################

    sharedPageBase("rootPage", context, entry)
    context.category = entry.category.parameterize

    ##  Banner image
    ##############################

    if entry.banner_image
      context.banner_image = media(entry.banner_image, focus: entry)
    end
  end
end

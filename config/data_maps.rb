############################################################
##  =Shared
############################################################

#   Core
# ***********************************************************

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

# Core page data
def pageBase(pageType, ctx, data)

  # Shared
  ctx.ID = data.sys[:id]
  ctx.TYPE = data.content_type.id
  ctx.title = data.title
  ctx.banner_image = media(data.banner_image, focus: data)

  # Landing/ root/ home page
  if ["landingPage", "rootPage", "homePage"].include? pageType
    ctx.subtitle = data.subtitle
  end

  if ["childPage", "landingPage", "rootPage"].include? pageType
    ctx.category = data.category.parameterize
  end

  # Child/ landing page
  if ["childPage", "landingPage"].include? pageType
    ctx.slug = data.slug.parameterize
    ctx.introduction = data.introduction
    ctx.date_time = dateTime(data)
  end
end

#   Nested data
# ***********************************************************

# Featured page
def featuredPage(data)
  featuredPageData = ({
    title: data.title,
    slug: data.slug.parameterize,
    category: data.category.parameterize,
    introduction: data.introduction,
    banner_image: media(data.banner_image, focus: data),
    date_time: (dateTime(data) if !data.featured || data.featured[0].content_type.id != 'registration'),
    category_alt: (data.featured[0].category.parameterize if data.featured && (['product', 'registration'].include? data.featured[0].content_type.id)),
    reg_date_time: (dateTime(data.featured[0]) if data.featured && data.featured[0].content_type.id == 'registration')
  }.compact if [ 'child_page', 'landing_page'].include? data.content_type.id)
end

# Calls to action
def callsToAction(data)
  ctaData = (defined?(data.calls_to_action) && data.calls_to_action ? data.calls_to_action.map do |cta| {
    ID: cta.sys[:id],
    title: cta.title.split('::')[0], # split '::' for contentful name-spacing
    action: cta.action.parameterize, # eg. modal, download etc
    button_text: cta.button_text,
    file: (media(cta.file, title: true) if cta.file),
    modal: ({
      cta_id: (cta.title.split('::')[0].parameterize + '-' + cta.sys[:id]), # split '::' for contentful name-spacing
      content: cta.modal,
      width: (cta.modal_width ? cta.modal_width.parameterize : 'wide')
    }.compact if cta.action == 'Modal')
  }.compact end : nil)
end

############################################################
## =Global
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
    context.placeholder_image = media(entry.placeholder_image)

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
    pageBase("homePage", context, entry)
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
    pageBase("landingPage", context, entry) # core page data
    context.latest_carousel = entry.latest_carousel # latest related cards carousel

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
        background_color: (panel.background_color.parameterize if panel.content_type.id == 'panel_content' && panel.background_color),
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
          profile: ({
            cta_id: ((item.full_name + '-' + item.sys[:id]).parameterize if item.full_name), # only if 'people'
            full_name: item.full_name,
            role: item.role,
            organisation: item.organisation,
            biog: item.biog,
            email: item.email,
            tel: item.tel,
            twitter: item.twitter,
            linkedin: item.linkedin,
            photo: ({
              url: item.photo.url,
              alt: item.photo.description
            } if item.photo)
          }.compact if item.content_type.id == 'people')
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

    # Blog count
    if entry.blog_count
      context.blog_count = entry.blog_count
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
    pageBase("childPage", context, entry) # core page data
    context.copy = entry.copy # main copy

    ##  Featured
    ##############################

    if entry.featured
      context.featured = entry.featured.map do |featured| {
        ID: featured.sys[:id],
        TYPE: featured.content_type.id,

        ##  Featured (people)
        ##############################

        author: ({
          full_name: featured.full_name,
          role: featured.role,
          organisation: featured.organisation,
          biog: ({
            id: (featured.full_name.parameterize + '-' + featured.sys[:id]),
            content: featured.biog
          } if featured.biog),
          email: featured.email,
          twitter: featured.twitter,
          linkedin: featured.linkedin,
          photo: {
            url: featured.photo.url,
            alt: featured.photo.description
          }
        }.compact if featured.content_type.id == 'people'),

        # Featured registration
        registration: ({
          meta_title: featured.meta_title,
          category: featured.category.parameterize,
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
          category: featured.category.parameterize,
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

    ##  External links
    ##############################

    if entry.external_links
      context.external_links = entry.external_links.map do |link| {
        title: link.title,
        category: link.category.parameterize,
        outlet: PublicSuffix.parse(URI.parse(link.url).host).domain,
        url: link.url
      }
      end
    end

    ##  Tagging
    ##############################

    if entry.blog_count
      context.blog_count = entry.blog_count
    end

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

    pageBase("rootPage", context, entry)
    context.category = entry.category.parameterize

    ##  Banner image
    ##############################

    if entry.banner_image
      context.banner_image = media(entry.banner_image, focus: entry)
    end
  end
end

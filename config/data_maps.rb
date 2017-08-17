############################################################
## =Shared
############################################################

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

def media(data, opts = {})
  defaults = { focus: false }
  opts = defaults.merge(opts)

  mediaData = {
    url: data.url,
    alt: data.description,
    focus: (opts[:focus].image_focus.parameterize if opts[:focus])
  }.compact
end

def pageCore(ctx, data)
  ctx.ID = data.sys[:id]
  ctx.TYPE = data.content_type.id
  ctx.category = data.category.parameterize
  ctx.title = data.title
  ctx.slug = data.slug.parameterize
  ctx.introduction = data.introduction
  ctx.banner_image = media(data.banner_image, focus: data)
  ctx.date_time = dateTime(data)
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

    # Logo
    context.logo = {
      mobile: {
        url: entry.logo_mobile.url,
        alt: entry.logo_mobile.description
      },
      desktop: {
        url: entry.logo_desktop.url,
        alt: entry.logo_desktop.description
      }
    }

    # Meta
    context.meta = {
      analytics: entry.meta_analytics
    }

    context.placeholder_image = {
      url: entry.placeholder_image.url,
      alt: entry.placeholder_image.description
    }
  end
end

############################################################
##  Homepage
############################################################

class HomeMap < ContentfulMiddleman::Mapper::Base
  def map(context, entry)
    context.ID = entry.sys[:id]
    context.TYPE = entry.content_type.id
    context.title = entry.title
    context.subtitle = entry.subtitle
    context.banner_image = media(entry.banner_image, focus: entry)
  end
end

############################################################
##  Navigation
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
    pageCore(context, entry) # core page data
    context.subtitle = entry.subtitle # subtitle (in banner)
    context.latest_carousel = entry.latest_carousel # latest related cards carousel

    # Call(s) to action
    if entry.actions
      context.calls_to_action = entry.actions.map do |cta| {
        title: cta.title.split('::')[0], # split '::' for contentful name-spacing
        action: cta.action.parameterize,
        button_text: cta.button_text,
        file: ({
          title: cta.file.title,
          url: cta.file.url
        } if cta.action == 'Download'),
        modal: ({
          cta_id: (cta.title.split('::')[0].parameterize + '-' + cta.sys[:id] + 'banner'), # split '::' for contentful name-spacing
          content: cta.modal
        } if cta.action == 'Modal'),
      }.compact
      end
    end

    # Featured
    if entry.featured
      context.featured = entry.featured.map do |featured| {
        ID: featured.sys[:id],
        TYPE: featured.content_type.id,

        page: ({
          title: featured.title,
          slug: featured.slug.parameterize,
          category: featured.category.parameterize,
          category_alt: (featured.featured[0].category.parameterize if featured.featured && (['product', 'registration'].include? featured.featured[0].content_type.id)),
          introduction: featured.introduction,
          banner_image: media(featured.banner_image, focus: featured),
          date_time: (dateTime(featured) if !featured.featured || featured.featured[0].content_type.id != 'registration'),
          reg_date_time: (dateTime(featured.featured[0]) if featured.featured && featured.featured[0].content_type.id == 'registration')
        }.compact if [ 'child_page', 'landing_page'].include? featured.content_type.id)
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
        calls_to_action: (defined?(panel.calls_to_action) && panel.calls_to_action != nil ? panel.calls_to_action.map do |cta| {
          ID: cta.sys[:id],
          title: cta.title.split('::')[0], # split '::' for contentful name-spacing
          action: cta.action.parameterize, # eg. modal, download etc
          button_text: cta.button_text,
          file: ({
            title: cta.file.title,
            url: cta.file.url
          } if cta.file != nil),
          modal: ({
            cta_id: (cta.title.split('::')[0].parameterize + '-' + cta.sys[:id]), # split '::' for contentful name-spacing
            content: cta.modal,
            width: (cta.modal_width ? cta.modal_width.parameterize : 'wide')
          }.compact if cta.action == 'Modal')
        }.compact end : nil),

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
        image: ({
          url: panel.image.url,
          alt: panel.image.description
        }.compact if panel.content_type.id == 'panel_content' && panel.image),
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
          calls_to_action:  (accordian.calls_to_action ? accordian.calls_to_action.map do |cta| {
            ID: cta.sys[:id],
            title: cta.title.split('::')[0], # split '::' for contentful name-spacing
            action: cta.action.parameterize, # eg. modal, download etc
            button_text: cta.button_text,
            file: ({
              title: cta.file.title,
              url: cta.file.url
            } if cta.file != nil),
            modal: ({
              id: (cta.title.split('::')[0].parameterize + '-' + cta.sys[:id]), # split '::' for contentful name-spacing
              content: cta.modal
            } if cta.action == 'modal')
          }.compact end : nil)
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
    pageCore(context, entry) # core page data
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

        ##  Featured (registration)
        ##############################

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

        ##  Featured (product)
        ##############################

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

        ##  Featured (page)
        ##############################

        page: ({
          title: featured.title,
          slug: featured.slug.parameterize,
          category: featured.category.parameterize,
          category_alt: (featured.featured[0].category.parameterize if featured.featured && (['product', 'registration'].include? featured.featured[0].content_type.id)),

          # Banner image
          banner_image: media(featured.banner_image, focus: featured),

          # Blog/ event
          date_time: (dateTime(featured) if featured.date_time),
          reg_date_time: (dateTime(featured.featured[0]) if featured.featured && featured.featured[0].content_type.id == 'registration')
        }.compact if [ 'child_page', 'landing_page'].include? featured.content_type.id)
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

    context.ID = entry.sys[:id]
    context.TYPE = entry.content_type.id
    context.category = entry.category.parameterize
    context.title = entry.title
    context.subtitle = entry.subtitle

    ##  Banner image
    ##############################

    if entry.banner_image
      context.banner_image = media(entry.banner_image, focus: entry)
    end
  end
end

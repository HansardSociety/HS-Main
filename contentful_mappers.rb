############################################################
##  Global
############################################################

class UniversalMap < ContentfulMiddleman::Mapper::Base
  def map(context, entry)
    context.ID       = entry.sys[:id]
    context.TYPE     = entry.content_type.id
    context.title    = entry.title

    ##  Logo
    ##############################

    context.logo = {
      mobile: {
        url:           entry.logo_mobile.url,
        alt:           entry.logo_mobile.description
      },
      desktop: {
        url:           entry.logo_desktop.url,
        alt:           entry.logo_desktop.description
      }
    }

    ##  Meta content
    ##############################

    context.meta = {
      analytics:       entry.meta_analytics
    }
  end
end

############################################################
##  People
############################################################

class PeopleMap < ContentfulMiddleman::Mapper::Base
  def map(context, entry)
    context.ID           = entry.sys[:id]
    context.TYPE         = entry.content_type.id
    context.full_name    = entry.full_name
    context.title        = entry.title
    context.first_name   = entry.first_name
    context.surname      = entry.surname
    context.role         = entry.role
    context.organisation = entry.organisation
    context.biog         = entry.biog
    context.email        = entry.email
    context.tel          = entry.tel
    context.twitter      = entry.twitter
    context.linkedin     = entry.linkedin
    context.employment   = (entry.employment.parameterize if entry.employment)
    context.photo = {
      url:   entry.photo.url,
      alt:   entry.photo.description
    }
  end
end

############################################################
##  Homepage
############################################################

class HomeMap < ContentfulMiddleman::Mapper::Base
  def map(context, entry)
    context.ID           = entry.sys[:id]
    context.TYPE         = entry.content_type.id
    context.title        = entry.title
    context.subtitle     = entry.subtitle
    context.banner_image = {
      url:   entry.banner_image.url,
      alt:   entry.banner_image.description,
      focus: entry.image_focus.parameterize
    }
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
        title:    page.title,
        slug:     page.slug,
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
##  Landing page
############################################################

class LandingPageMap < ContentfulMiddleman::Mapper::Base
  def map(context, entry)

    ##  Core
    ##############################

    context.ID              = entry.sys[:id]
    context.TYPE            = entry.content_type.id
    context.category        = entry.category.parameterize
    context.title           = entry.title
    context.slug            = entry.slug.parameterize
    context.subtitle        = entry.subtitle
    context.introduction    = entry.introduction
    context.latest_carousel = entry.latest_carousel

    ##  Call(s) to action
    ##############################

    if entry.actions
      context.calls_to_action = entry.actions.map do |cta| {
        title:       cta.title.split('::')[0], # split '::' for contentful name-spacing
        action:      cta.action.parameterize,
        button_text: cta.button_text,
        file: ({
          title:       cta.file.title,
          url:         cta.file.url
        } if cta.action == 'Download'),
        modal: ({
          cta_id:   (cta.title.split('::')[0].parameterize + '-' + cta.sys[:id] + 'banner'), # split '::' for contentful name-spacing
          content:  cta.modal
        } if cta.action == 'Modal'),
      }.reject{ |key, value| value.nil? }
      end
    end

    ##  Banner image
    ##############################

    if entry.banner_image
      context.banner_image = {
        url:   entry.banner_image.url,
        alt:   entry.banner_image.description,
        focus: entry.image_focus.parameterize
      }
    end

    ##  Date/ time
    ##############################

    if entry.date_time
      context.date_time = {
        integer: entry.date_time.strftime('%s').to_i,
        date:    entry.date_time.strftime('%d %b, %y')
      }
    end

    ##  Panels
    ##############################

    if entry.panels
      context.panels = entry.panels.map do |panel| {

        # Core
        ID:              panel.sys[:id],
        TYPE:            panel.content_type.id,
        title:           panel.title,
        copy:            (panel.copy if panel.copy), # optional

        # Calls to action
        calls_to_action: (defined?(panel.calls_to_action) && panel.calls_to_action != nil ? panel.calls_to_action.map do |cta| {
          ID:            cta.sys[:id],
          title:         cta.title.split('::')[0], # split '::' for contentful name-spacing
          action:        cta.action.parameterize, # eg. modal, download etc
          button_text:   cta.button_text,
          file: ({
            title:       cta.file.title,
            url:         cta.file.url
          } if cta.file != nil),
          modal: ({
            cta_id:      (cta.title.split('::')[0].parameterize + '-' + cta.sys[:id]), # split '::' for contentful name-spacing
            content:     cta.modal
          } if cta.action == 'Modal')
        }.reject{ |key, value| value.nil? } end : nil),

        # Panel promoted
        label:      (panel.label if panel.content_type.id == 'panel_promoted'),
        image: ({
          url:      panel.image.url,
          alt:      panel.image.description
        } if panel.content_type.id == 'panel_promoted' && panel.image), # optional

        # Panel content
        show_more: ({
          cta_id:        ('modal-' + panel.title.split('::')[0].parameterize + '-' + panel.sys[:id]), # split '::' for contentful name-spacing
          content:       panel.show_more
        } if panel.content_type.id == 'panel_content' && panel.show_more), # optional
        share_buttons:   (panel.share_buttons if panel.content_type.id == 'panel_content'),
        images: (panel.content_type.id == 'panel_content' && panel.images ? panel.images.map do |image| {
          url:      image.url,
          alt:      image.description
        }.reject{ |key, value| value.nil? } end : nil),

        # Panel accordian
        accordians: (panel.content_type.id == 'panel_accordians' ? panel.accordians.map do |accordian| {
          ID:               accordian.sys[:id],
          cta_id:           ('accordian-' + accordian.title.split('::')[0].parameterize + '-' + accordian.sys[:id]), # split '::' for contentful name-spacing
          title:            accordian.title,
          copy:             accordian.copy,
          calls_to_action:  (accordian.calls_to_action ? accordian.calls_to_action.map do |cta| {
            ID:             cta.sys[:id],
            title:          cta.title.split('::')[0], # split '::' for contentful name-spacing
            action:         cta.action.parameterize, # eg. modal, download etc
            button_text:    cta.button_text,
            file: ({
              title:        cta.file.title,
              url:          cta.file.url
            } if cta.file != nil),
            modal: ({
              id:           (cta.title.split('::')[0].parameterize + '-' + cta.sys[:id]), # split '::' for contentful name-spacing
              content:      cta.modal
            } if cta.action == 'modal')
          }.reject{ |key, value| value.nil? } end : nil)
        }.reject{ |key, value| value.nil? } end : nil)
      }.reject{ |key, value| value.nil? }
      end
    end

    ##  Tags
    ##############################

    if entry.tags
      context.tags = entry.tags.map do |tag| {
        tag: tag.gsub("'", '').parameterize
      }
      end
    end
  end
end

############################################################
##  Child page
############################################################

class ChildPageMap < ContentfulMiddleman::Mapper::Base
  def map(context, entry)

    ##  Core
    ##############################

    context.ID           = entry.sys[:id]
    context.TYPE         = entry.content_type.id
    context.category     = entry.category.parameterize
    context.title        = entry.title
    context.slug         = entry.slug.parameterize
    context.introduction = entry.introduction
    context.copy         = entry.copy
    context.our_people   = entry.our_people

    ##  Banner image
    ##############################

    if entry.banner_image
      context.banner_image = {
        url:   entry.banner_image.url,
        alt:   entry.banner_image.description,
        focus: entry.image_focus.parameterize
      }
    end

    ##  Featured
    ##############################

    if entry.featured
      context.featured = entry.featured.map do |featured| {

        ##  Featured (people)
        ##############################

        author: ({
          full_name:    featured.full_name,
          role:         featured.role,
          organisation: featured.organisation,
          biog: ({
            id:         (featured.full_name.parameterize + '-' + featured.sys[:id]),
            content:    featured.biog
          } if featured.biog),
          email:        featured.email,
          twitter:      featured.twitter,
          linkedin:     featured.linkedin,
          photo: {
            url:        featured.photo.url,
            alt:        featured.photo.description
          }
        }.reject{ |key, value| value.nil? } if featured.content_type.id == 'people'),

        ##  Featured (registration)
        ##############################

        registration: ({
          title:        featured.title,
          date_time: {
            integer:    entry.date_time.strftime('%s').to_i,
            date:       featured.date.strftime('%I:%M %p, %d %b, %y'),
            day:        featured.date.strftime('%d'),
            month:      featured.date.strftime('%b'),
            year:       featured.date.strftime('%y')
          },
          embed_code:   featured.embed_code,
          url:          featured.url
        }.reject{ |key, value| value.nil? } if featured.content_type.id == 'registration'),

        ##  Featured (product)
        ##############################

        product: ({
          title:        featured.title,
          category:     featured.category,
          product_id:   featured.product_id,
          price:        featured.price,
          image: {
            url:        featured.image.url,
            alt:        featured.image.description
          },
          download:     (featured.media.url if featured.media)
        }.reject{ |key, value| value.nil? } if featured.content_type.id == 'product'),

        ##  Featured (page)
        ##############################

        page: ({

          # Core
          ID:         featured.sys[:id],
          title:      featured.title,
          slug:       featured.slug.parameterize,
          category:   featured.category.parameterize,

          # Banner image
          banner_image: {
            url:      featured.banner_image.url,
            alt:      featured.banner_image.description,
            focus:    featured.image_focus.parameterize
          },

          # Blog/ event
          date_time: ({
            integer: featured.date_time.strftime('%s').to_i,
            date:    featured.date_time.strftime('%d %b, %y')
          }.reject{ |key, value| value.nil? } if featured.date_time),
        }.reject{ |key, value| value.nil? } if featured.content_type.id == 'child_page')
      }.reject{ |key, value| value.nil? }
      end # End: Featured map
    end # End: All featured

    ##  Date/ time
    ##############################

    if entry.date_time
      context.date_time = {
        integer: entry.date_time.strftime('%s').to_i,
        date:    entry.date_time.strftime('%d %b, %y')
      }
    end

    ##  Tags
    ##############################

    if entry.tags
      context.tags = entry.tags.map do |tag| {
        tag: tag.gsub("'", '').parameterize
      }
      end
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

    context.ID           = entry.sys[:id]
    context.TYPE         = entry.content_type.id
    context.category     = entry.category.parameterize
    context.title        = entry.title
    context.subtitle     = entry.subtitle

    ##  Banner image
    ##############################

    if entry.banner_image
      context.banner_image = {
        url:   entry.banner_image.url,
        alt:   entry.banner_image.description,
        focus: entry.image_focus.parameterize
      }
    end
  end
end

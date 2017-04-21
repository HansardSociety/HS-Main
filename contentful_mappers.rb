############################################################
##  Navigation
############################################################

class NavigationMap < ContentfulMiddleman::Mapper::Base
  def map(context, entry)

    context.title = entry.title

    if entry.pages
      context.pages = entry.pages.map do |page| {
        title:    page.title,
        slug:     page.slug.parameterize,
        category: page.category.parameterize
      }
      end
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

    context.ID           = entry.sys[:id]
    context.TYPE         = entry.content_type.id
    context.category     = entry.category.parameterize
    context.title        = entry.title
    context.slug         = entry.slug.parameterize
    context.subtitle     = entry.subtitle
    context.introduction = entry.introduction
    context.toc          = entry.table_of_contents

    ##  Call(s) to action
    ##############################

    if entry.actions
      context.calls_to_action = entry.actions.map do |cta| {
        title:       cta.title.split('::')[0],
        action:      cta.action.parameterize,
        button_text: cta.button_text,
        file: ({
          title:       cta.file.title,
          url:         cta.file.url
        } if cta.file != nil),
        modal: ({
          id:       (cta.title.split('::')[0].parameterize + '-' + cta.sys[:id]),
          content:  cta.modal
        } if cta.action == 'modal'),
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
        label:           panel.label,
        panel_type:      panel.panel_type.parameterize,
        copy:            panel.copy,
        show_more: ({
          id:            ('modal-' + panel.title.split('::')[0].parameterize + '-' + panel.sys[:id]),
          content:       panel.show_more
        } if panel.show_more != nil),

        # Calls to action
        calls_to_action: (panel.calls_to_action ? panel.calls_to_action.map do |cta| {
          ID:            cta.sys[:id],
          title:         cta.title.split('::')[0],
          action:        cta.action.parameterize,
          button_text:   cta.button_text,
          file: ({
            title:       cta.file.title,
            url:         cta.file.url
          } if cta.file != nil),
          modal: ({
            id:          (cta.title.split('::')[0].parameterize + '-' + cta.sys[:id]),
            content:     cta.modal
          } if cta.action == 'modal')
        }.reject{ |key, value| value.nil? } end : nil),

        # Header image
        image: ({
          url:           panel.image.url,
          alt:           panel.image.description,
          caption:       panel.image_caption
        } if panel.image),

        # Share buttons
        share_buttons:  panel.share_buttons,

        # Accordian
        accordian: (panel.accordian ? panel.accordian.map do |accordian| {
          id:               accordian.sys[:id],
          title:            accordian.title,
          copy:             accordian.copy,
          calls_to_action:  (accordian.calls_to_action ? accordian.calls_to_action.map do |cta| {
            ID:             cta.sys[:id],
            title:          cta.title.split('::')[0],
            action:         cta.action.parameterize,
            button_text:    cta.button_text,
            file: ({
              title:       cta.file.title,
              url:         cta.file.url
            } if cta.file != nil),
            modal: ({
              id:          (cta.title.split('::')[0].parameterize + '-' + cta.sys[:id]),
              content:     cta.modal
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

    ##  Banner image
    ##############################

    if entry.banner_image
      context.banner_image = {
        url:   entry.banner_image.url,
        alt:   entry.banner_image.description,
        focus: entry.image_focus.parameterize
      }
    end

    ##  Promoted (people)
    ##############################

    if entry.promoted && entry.promoted.content_type.id == 'people'
      context.author = {
        full_name:    entry.promoted.full_name,
        role:         entry.promoted.role,
        organisation: entry.promoted.organisation,
        biog: ({
          id:       (entry.promoted.full_name.parameterize + '-' + entry.promoted.sys[:id]),
          content:  entry.promoted.biog
        } if entry.promoted.biog),
        email:        entry.promoted.email,
        twitter:      entry.promoted.twitter,
        linkedin:     entry.promoted.linkedin,
        photo: {
          url:        entry.promoted.photo.url,
          alt:        entry.promoted.photo.description
        }
      }
    end

    ##  Promoted (registration)
    ##############################

    if entry.promoted && entry.promoted.content_type.id == 'registration'
      context.registration = {
        title:        entry.promoted.title,
        date:         entry.promoted.date.strftime('%d %b, %y'),
        embed_code:   entry.promoted.embed_code
      }
    end

    ##  Promoted (pages)
    ##############################

    if entry.promoted && entry.promoted.content_type.id == 'child_page'

      @linked_product = entry.promoted.promoted && entry.promoted.promoted.content_type.id == 'product'

      context.promoted_page = {

        # Core
        ID:         entry.promoted.sys[:id],
        title:      entry.promoted.title,
        slug:       entry.promoted.slug.parameterize,
        category:   entry.promoted.category.parameterize,

        # Banner image
        banner_image: ({
          url:      entry.promoted.banner_image.url,
          alt:      entry.promoted.banner_image.description,
          focus:    entry.promoted.image_focus.parameterize
        } if entry.promoted.banner_image),

        # Product
        product: ({
          ID:       entry.promoted.promoted.sys[:id],
          title:    entry.promoted.promoted.title,
          price:    entry.promoted.promoted.price,
          download: entry.promoted.promoted.media.url,
          image: {
            url:    entry.promoted.promoted.image.url,
            alt:    entry.promoted.promoted.image.description
          }
        } if @linked_product)
      }.reject{ |key, value| value.nil? }
    end

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

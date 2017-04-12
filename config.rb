require 'slim'
Slim::Engine.default_options[:pretty] = true

require 'public_suffix'


##############################
## Page options
##############################

## Layouts
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

##############################
## Helpers
##############################

# helpers do
#
# end

##############################
## Build/ Dev
##############################

# Build
configure :build do
  ignore 'assets/**'
  ignore 'layouts/**'
  ignore 'partials/**'
  ignore 'templates/**'

  activate :external_pipeline,
    name: :gulp,
    command: 'npm run build',
    source: '.tmp',
    latency: 1
end

# Server
configure :server do
  activate :directory_indexes
  activate :external_pipeline,
    name: :gulp,
    command: 'npm run start',
    source: '.tmp'
end

##############################
## Contentful
##############################

# Navigation map
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

# Landing page map
class LandingPageMap < ContentfulMiddleman::Mapper::Base
  def map(context, entry)

    # Core
    context.ID           = entry.sys[:id]
    context.TYPE         = entry.content_type.id
    context.category     = entry.category.parameterize
    context.title        = entry.title
    context.slug         = entry.slug.parameterize
    context.subtitle     = entry.subtitle
    context.introduction = entry.introduction

    # Call to action(s)
    if entry.actions
      context.actions = entry.actions.map do |action| {
        title:   action.title,
        action:  action.action.parameterize,
        text:    action.button_text,
        file: {
          title: action.file.title,
          url:   action.file.url
        },
        content: action.modal
      }.reject{ |key, value| value.nil? }
      end
    end

    # Banner image
    if entry.banner_image
      context.banner_image = {
        url:   entry.banner_image.url,
        alt:   entry.banner_image.description,
        focus: entry.image_focus.parameterize
      }
    end

    # Date/ time
    if entry.date_time
      context.date_time = {
        integer: entry.date_time.strftime('%s').to_i,
        date:    entry.date_time.strftime('%d %b, %y')
      }
    end

    # Panels
    if entry.panels
      context.panels = entry.panels.map do |panel| {
        ID:           panel.sys[:id],
        TYPE:         panel.content_type.id,
        title:        panel.title,
        panel_type:   panel.panel_type.parameterize,
        copy_header:  panel.copy_header,
        copy_body:    panel.copy_body,
        header_image: {
          url:        panel.header_image.url,
          alt:        panel.header_image.description
        }
      }
      end
    end

    # Tags
    if entry.tags
      context.tags = entry.tags.map do |tag| {
        tag: tag.gsub("'", '').parameterize
      }
      end
    end
  end
end

# Child page map
class ChildPageMap < ContentfulMiddleman::Mapper::Base
  def map(context, entry)

    # Core
    context.ID           = entry.sys[:id]
    context.TYPE         = entry.content_type.id
    context.category     = entry.category.parameterize
    context.title        = entry.title
    context.slug         = entry.slug.parameterize
    context.introduction = entry.introduction
    context.copy         = entry.copy

    # Banner image
    if entry.banner_image
      context.banner_image = {
        url:   entry.banner_image.url,
        alt:   entry.banner_image.description,
        focus: entry.image_focus.parameterize
      }
    end

    # Promoted (people)
    if entry.promoted && entry.promoted.content_type.id == 'people'
      context.author = {
        full_name:    entry.promoted.full_name,
        role:         entry.promoted.role,
        organisation: entry.promoted.organisation,
        biog:         entry.promoted.biog,
        email:        entry.promoted.email,
        twitter:      entry.promoted.twitter,
        linkedin:     entry.promoted.linkedin,
        photo: {
          url:        entry.promoted.photo.url,
          alt:        entry.promoted.photo.description
        }
      }
    end

    # Promoted (registration)
    if entry.promoted && entry.promoted.content_type.id == 'registration'
      context.registration = {
        title:        entry.promoted.title,
        date:         entry.promoted.date.strftime('%d %b, %y'),
        embed_code:   entry.promoted.embed_code
      }
    end

    # Promoted (child_page/ landing_page)
    if entry.promoted && entry.promoted.content_type.id == 'child_page'

      @linked_product = entry.promoted.promoted && entry.promoted.promoted.content_type.id == 'product'

      context.promoted_page = {

        # Promoted core
        ID:         entry.promoted.sys[:id],
        title:      entry.promoted.title,
        slug:       entry.promoted.slug.parameterize,
        category:   entry.promoted.category.parameterize,

        # Promoted banner image
        banner_image: ({
          url:      entry.promoted.banner_image.url,
          alt:      entry.promoted.banner_image.description,
          focus:    entry.promoted.image_focus.parameterize
        } if entry.promoted.banner_image),

        # Promoted page with product
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

    # Date/ time
    if entry.date_time
      context.date_time = {
        integer: entry.date_time.strftime('%s').to_i,
        date:    entry.date_time.strftime('%d %b, %y')
      }
    end

    # Tags
    if entry.tags
      context.tags = entry.tags.map do |tag| {
        tag: tag.gsub("'", '').parameterize
      }
      end
    end
  end
end

# Contentful config
activate :contentful do |f|
  f.space         = { hs: 'xkbace0jm9pp' }
  f.access_token  = 'd1270ddb68c436e381efa9ae456472610081a17d7e9e3fbb3d8309b702a852e2'
  f.cda_query     = { include: 4 }
  f.content_types = {
    SITE: '__GLOBAL__',
    child_page:   { mapper: ChildPageMap,   id: 'child_page' },
    landing_page: { mapper: LandingPageMap, id: 'landing_page' },
    navigation:   { mapper: NavigationMap,  id: 'navigation' }
  }
end

##############################
## Page proxies
##############################

# Only run if data dir exists
if Dir.exist?(config.data_dir)

  # Homepage
  # data.hs.home.each do |id, home|
  #   proxy "/index.html",
  #         "/templates/home.html",
  #         ignore: true,
  #         locals: { home: home }
  # end

  # Child pages
  data.hs.child_page.each do |id, child_page|
    proxy "#{ child_page.category.parameterize + '/' + child_page.slug }.html",
          "/templates/child-page.html",
          ignore: true,
          locals: { child_page: child_page }
  end

  # Landing pages
  data.hs.landing_page.each do |id, landing_page|
    proxy "#{ landing_page.category.parameterize + '/' + landing_page.slug }.html",
          "/templates/landing-page.html",
          ignore: true,
          locals: { landing_page: landing_page }
  end
end

##############################
## Archive
##############################

# Navigation map
# class NavigationMap < ContentfulMiddleman::Mapper::Base
#   def map(context, entry)
#     context.title   = entry.title
#     if entry.pages
      # context.categories = entry.pages.group_by(&:category).map do |cat, pages| {
      #   catparameterize: pages.map do |page| {
      #     title: page.title,
      #     slug: page.slug.parameterize
      #   }
#         end
#       }
#       end
#     end
#   end
# end

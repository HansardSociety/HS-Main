require 'slim'
Slim::Engine.default_options[:pretty] = true

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
        :title => page.title,
        :slug => page.slug.parameterize,
        :category => page.category.parameterize
      }
      end
    end
  end
end

# Child page map
class ChildPageMap < ContentfulMiddleman::Mapper::Base
  def map(context, entry)

    # Core
    context.ID = entry.sys[:id]
    context.category = entry.category.parameterize
    context.title = entry.title
    context.slug = entry.slug.parameterize
    context.introduction = entry.introduction
    context.copy = entry.copy

    # Banner image
    if entry.banner_image
      context.banner_image = {
        :url => entry.banner_image.url,
        :description => entry.banner_image.description,
        :focus => entry.image_focus.parameterize
      }
    end

    # Promoted (people)
    if entry.promoted && entry.promoted.content_type.id == 'people'
      context.author = {
        :full_name => entry.promoted.full_name,
        :twitter => entry.promoted.twitter,
        :email => entry.promoted.email,
        :photo => {
          :url => entry.promoted.photo.url,
          :alt => entry.promoted.photo.description
        }
      }
    end

    # Promoted (product)
    if entry.promoted && entry.promoted.content_type.id == 'product'
      context.product = {
        :ID => entry.promoted.sys[:id],
        :title => entry.promoted.title,
        :category => entry.promoted.category.parameterize,
        :price => entry.promoted.price,
        :download => entry.promoted.media.url,
        :image => {
          :url => entry.promoted.image.url,
          :alt => entry.promoted.image.description
        }
      }
    end

    # Promoted (child_page/ landing_page)
    if entry.promoted && entry.promoted.content_type.id == 'child_page'
      @linked_product = entry.promoted.promoted && entry.promoted.promoted.content_type.id == 'product'

      context.promoted_page = {
        :ID => entry.promoted.sys[:id],
        :title => entry.promoted.title,
        :slug => entry.promoted.slug.parameterize,
        :category => entry.promoted.category.parameterize,
        :banner_image => {
          :url => entry.promoted.banner_image.url,
          :alt => entry.promoted.banner_image.description
        },
        :product => ({
          :ID => entry.promoted.promoted.sys[:id],
          :title => entry.promoted.promoted.title,
          :price => entry.promoted.promoted.price,
          :download => entry.promoted.promoted.media.url
        } if @linked_product)
      }.reject{ |key, value| value.nil? }
    end

    # Date/ time
    if entry.date_time
      context.date_time = {
        :integer => entry.date_time.strftime('%s').to_i,
        :date => "#{ entry.date_time.day }/#{ entry.date_time.month }/#{ entry.date_time.year }"
      }
    end

    # Tags
    # if entry.tags
    #   context.tags = entry.tags.parameterize
    #   context.sidebar = data.hs.child_page.map do |tag| {
    #
    #   }
    #   end
    # end
  end
end

# Contentful config
activate :contentful do |f|
  f.space         = { hs: 'xkbace0jm9pp' }
  f.access_token  = 'd1270ddb68c436e381efa9ae456472610081a17d7e9e3fbb3d8309b702a852e2'
  f.cda_query     = { include: 4 }
  f.content_types = {
    SITE: '__GLOBAL__',
    child_page: { mapper: ChildPageMap, id: 'child_page' },
    navigation: { mapper: NavigationMap, id: 'navigation' }
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
  #         :ignore => true,
  #         :locals => { :home => home }
  # end

  # Child pages
  data.hs.child_page.each do |id, child_page|
    proxy "#{ child_page.slug.parameterize + '/' + child_page.slug }.html",
          "/templates/child-page.html",
          :ignore => true,
          :locals => { :child_page => child_page }
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
#       context.categories = entry.pages.group_by(&:category).map do |cat, pages| {
#         cat.parameterize => pages.map do |page| {
#           :title => page.title,
#           :slug => page.slug.parameterize
#         }
#         end
#       }
#       end
#     end
#   end
# end

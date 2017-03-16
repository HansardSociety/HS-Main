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
    context.title = entry.title
    context.slug = entry.slug.parameterize
    context.category = entry.category.parameterize
    context.introduction = entry.introduction
    context.copy = entry.copy
    if entry.banner_image
      context.banner_image = {
        :url => entry.banner_image.url,
        :description => entry.banner_image.description,
        :focus => entry.image_focus.parameterize
      }
    end
    if entry.promoted
      context.promoted = {
        :title => entry.promoted.title,
        :slug => entry.promoted.slug,
        :category => entry.promoted.category.parameterize,
        :banner_image => entry.promoted.banner_image.url,
        :banner_alt => entry.promoted.banner_image.description
      }
    end
  end
end

activate :contentful do |f|
  f.space         = { hs: 'xkbace0jm9pp' }
  f.access_token  = 'd1270ddb68c436e381efa9ae456472610081a17d7e9e3fbb3d8309b702a852e2'
  f.cda_query     = { include: 2 }
  f.content_types = {
    __GLOBAL__: '__GLOBAL__',
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
    proxy "/#{ child_page.category + '/' + child_page.slug }.html",
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

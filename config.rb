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
## Page proxies
##############################

# Only run if data dir exists
if Dir.exist?(config.data_dir)

  # Homepage
  data.hs.home.each do |id, home|
    proxy "/index.html",
          "/templates/home.html",
          :ignore => true,
          :locals => { :home => home }
  end

  # Child pages
  data.hs.child_page.each do |id, child_page|
    proxy "/#{ child_page.category.downcase.gsub(' ', '-') + '/' + child_page.slug }.html",
          "/templates/child-page.html",
          :ignore => true,
          :locals => { :child_page => child_page }
  end
end

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

activate :contentful do |f|
  f.space         = { hs: 'xkbace0jm9pp' }
  f.access_token  = '94f4e91e316abf614c2a6537891640e9ab4c80a74b1b482accc0f1f22eefa688'
  f.cda_query     = { limit: 1000 }
  f.content_types = {
    __GLOBAL__: '__GLOBAL__',
    carousel: 'carousel',
    child_page: 'child_page',
    home: 'home',
    landing_page: 'landing_page',
    navigation: 'navigation',
    promotion: 'promotion'
  }
end

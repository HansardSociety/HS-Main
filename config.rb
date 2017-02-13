require 'slim'
Slim::Engine.default_options[:pretty] = true

##############################
## Page options
##############################

## Layouts
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

## Directories

##############################
## Page proxies
##############################

# data.hs.home.each do |home|
#   proxy "/#{home.id}.html", "layouts/home.html", :ignore => true
# end

data.hs.home.each do |id, home|
  proxy "/index.html",
        "/templates/home.html",
        :ignore => true,
        :locals => { :home => home }
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

ignore 'assets/**'
ignore 'layouts/**'
ignore 'partials/**'
ignore 'templates/**'

# Build
configure :build do
  activate :external_pipeline,
    name: :gulp,
    command: 'npm run build',
    source: '.tmp',
    latency: 1
end

# Server
configure :server do
  activate :external_pipeline,
    name: :gulp,
    command: 'npm run start',
    source: '.tmp',
    latency: 1
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
    promotion: 'promotion'
  }
end

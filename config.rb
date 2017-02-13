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

## Proxy pages
# proxy '/this-page-has-no-template.html', '/template-file.html', locals: {
#  which_fake_page: 'Rendering a fake page with a local variable' }

##############################
## Helpers
##############################

# helpers do
#
# end

##############################
## Build
##############################

# MM build
configure :build do
  ignore 'css/**'
  ignore 'js/**'
  ignore 'layouts/**'
  ignore 'partials/**'

  activate :external_pipeline,
    name: :gulp,
    command: 'npm run build',
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

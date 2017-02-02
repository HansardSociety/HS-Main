require 'slim'

##############################
## Page options
##############################

## Layouts
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

## Directories

## Proxy pages
# proxy "/this-page-has-no-template.html", "/template-file.html", locals: {
#  which_fake_page: "Rendering a fake page with a local variable" }

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
end

##############################
## External pipeline
##############################

activate :external_pipeline,
  :name => 'gulp',
  :command => (build? ? 'npm run build' : 'npm start'),
  :source => '.tmp',
  :latency => 1

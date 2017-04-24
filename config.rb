require 'slim'
require 'public_suffix'
require 'contentful_mappers'

############################################################
##  Variables
############################################################

set :SITE_TITLE,  'Hansard Society'
set :SITE_URL,    ''

############################################################
##  Helpers
############################################################

# helpers do
#   def myTag
#     {tag: 'button'}
#   end
# end

############################################################
##  Markdown
############################################################

set :markdown_engine, :kramdown

############################################################
##  Page options
############################################################

page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

############################################################
##  Build/ Dev
############################################################

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

############################################################
##  Contentful
############################################################

# Contentful options
activate :contentful do |f|
  f.space         = { hs: 'xkbace0jm9pp' }
  f.access_token  = 'd1270ddb68c436e381efa9ae456472610081a17d7e9e3fbb3d8309b702a852e2'
  f.cda_query     = { include: 6 }
  f.content_types = {
    child_page: { mapper: ChildPageMap, id: 'child_page' },
    homepage: { mapper: HomeMap, id: 'home' },
    landing_page: { mapper: LandingPageMap, id: 'landing_page' },
    root_page: { mapper: RootPageMap, id: 'root_page' },
    navigation: { mapper: NavigationMap, id: 'navigation' },
    universal: { mapper: UniversalMap, id: 'universal' }
  }
end

############################################################
##  Page proxies
############################################################

# Only run if data dir exists
if Dir.exist?(config.data_dir)

  # Homepage
  data.hs.homepage.each do |id, home|
    proxy "/index.html",
          "/templates/home.html",
          ignore: true,
          locals: { home: home }
  end

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

  # Child pages
  data.hs.root_page.each do |id, root_page|
    proxy "#{ root_page.category.parameterize }.html",
          "/templates/root-page.html",
          ignore: true,
          locals: { root_page: root_page }
  end
end

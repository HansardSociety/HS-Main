require 'slim'
require 'public_suffix'
require 'contentful_mappers'
require 'securerandom'
require 'json'

############################################################
##  Variables
############################################################

set :SITE_TITLE,    'Hansard Society'
set :SITE_URL,      ''

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
##  Envs
############################################################

##  Build
##############################

configure :build do

  # Env variable
  set :ENV, 'production'

  # Cache-busting assets
  manifest = File.read('source/assets/rev-manifest.json')
  manifest_hash = JSON.parse(manifest)
  set :CSS_MAIN,     '/' + manifest_hash['main.css']
  set :CSS_SNIPCART, '/' + manifest_hash['snipcart.css']
  set :CSS_VENDOR,   '/' + manifest_hash['vendor.css']
  set :JS_MAIN,      '/' + manifest_hash['main.js']
  set :JS_VENDOR,    '/' + manifest_hash['vendor.js']

  # Snipcart
  set :SNIPCART_API, 'ZTgyODg2YTctZWRmMy00NjY1LTkyOGUtOTZjZDg4NGIxNWNhNjM2MDAwMjg2MjA3NjcyNDEw'

  ignore 'assets/**'
  ignore 'layouts/**'
  ignore 'partials/**'
  ignore 'templates/**'

  activate :directory_indexes

  activate :external_pipeline,
    name: :gulp,
    command: 'npm run epipe:build',
    source: '.tmp',
    latency: 1
end

##  Server
##############################

configure :server do

  # Env variable
  set :ENV, 'development'

  # Assets
  set :CSS_MAIN,     '/main.css'
  set :CSS_SNIPCART, '/snipcart.css'
  set :CSS_VENDOR,   '/vendor.css'
  set :JS_MAIN,      '/main.js'
  set :JS_VENDOR,    '/vendor.js'

  # Snipcart
  set :SNIPCART_API, 'ZDExODZhOTktNzZkYy00NmRkLTg1OWQtYmU0YTQ3MGE0M2Q0NjM2MDAwMjg2MjA3NjcyNDEw'

  activate :directory_indexes
  activate :external_pipeline,
    name: :gulp,
    command: 'npm run epipe:dev',
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
  f.all_entries   = true
  f.content_types = {
    child_page:   { mapper: ChildPageMap,   id: 'child_page' },
    homepage:     { mapper: HomeMap,        id: 'home' },
    landing_page: { mapper: LandingPageMap, id: 'landing_page' },
    root_page:    { mapper: RootPageMap,    id: 'root_page' },
    navigation:   { mapper: NavigationMap,  id: 'navigation' },
    universal:    { mapper: UniversalMap,   id: 'universal' },
    people:       { mapper: PeopleMap,      id: 'people' }
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

############################################################
##  Misc
############################################################

after_build do
  File.rename 'build/redirects', 'build/_redirects'
end

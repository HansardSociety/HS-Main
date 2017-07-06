require 'contentful_mappers'
require 'dotenv'
require 'json'
require 'securerandom'
require 'slim'
require 'public_suffix'

# DOTENV
Dotenv.load

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

##  Vars
##############################

# KEYS = JSON.parse(File.read('./.keys.json'))

# # Snipcart
# snipcart_live_tkn = KEYS['snipcart']['live']
# snipcart_test_tkn = KEYS['snipcart']['test']

# # Contentful
# contentful_live_tkn    = KEYS['contentful']['token']['live']
# contentful_preview_tkn = KEYS['contentful']['token']['preview']
# contentful_space_id    = KEYS['contentful']['space-id']

##  Contentful
##############################

contentful_tkn     = nil
contentful_preview = false

case ENV['CONTENTFUL_ENV']
when 'live'
  contentful_tkn     = ENV['CONTENTFUL_LIVE_TKN']
when 'preview'
  contentful_tkn     = ENV['CONTENTFUL_PREVIEW_TKN']
  contentful_preview = true
end

activate :contentful do |f|
  f.use_preview_api = contentful_preview
  f.space           = { hs: ENV['CONTENTFUL_SPACE_ID'] }
  f.access_token    = contentful_tkn
  f.cda_query       = { include: 6 }
  f.all_entries     = true
  f.content_types   = {
    child_page:   { mapper: ChildPageMap,   id: 'child_page' },
    homepage:     { mapper: HomeMap,        id: 'home' },
    landing_page: { mapper: LandingPageMap, id: 'landing_page' },
    root_page:    { mapper: RootPageMap,    id: 'root_page' },
    navigation:   { mapper: NavigationMap,  id: 'navigation' },
    universal:    { mapper: UniversalMap,   id: 'universal' },
    people:       { mapper: PeopleMap,      id: 'people' }
  }
end

##  Shared
##############################

def sharedBuildEnv

  # Cache-busting assets
  manifest = File.read('source/assets/rev-manifest.json')
  manifest_hash = JSON.parse(manifest)
  set :CSS_MAIN,     '/' + manifest_hash['main.css']
  set :CSS_SNIPCART, '/' + manifest_hash['snipcart.css']
  set :CSS_VENDOR,   '/' + manifest_hash['vendor.css']
  set :JS_MAIN,      '/' + manifest_hash['main.js']
  set :JS_VENDOR,    '/' + manifest_hash['vendor.js']

  ignore 'assets/**'
  ignore 'layouts/**'
  ignore 'partials/**'
  ignore 'templates/**'

  activate :directory_indexes

  activate :external_pipeline,
    name: :gulp,
    command: 'yarn run epipe:build',
    source: '.tmp',
    latency: 1
end

##  Build
##############################

configure :prod do
  sharedBuildEnv()
  set :SNIPCART_API, ENV['SNIPCART_LIVE_TKN']
  set :build_dir, 'build/prod'
  set :ENV, 'production'
  after_build do
    File.rename 'build/prod/redirects', 'build/prod/_redirects'
  end
end

##  Test site
##############################

configure :test do
  sharedBuildEnv()
  set :SNIPCART_API, ENV['SNIPCART_PREVIEW_TKN']
  set :build_dir, 'build/test-site'
  set :ENV, 'test'
  after_build do
    File.rename 'build/test-site/redirects', 'build/test-site/_redirects'
  end
end

##  Development
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
  set :SNIPCART_API, ENV['SNIPCART_PREVIEW_TKN']

  activate :directory_indexes
  activate :external_pipeline,
    name: :gulp,
    command: 'yarn run epipe:dev',
    source: '.tmp'
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

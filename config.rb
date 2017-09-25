# Config
require "./lib/data_maps"
require "./lib/helpers"
require "./lib/netlify"

require "dotenv"
require "json"
require "public_suffix"
require "slim"
require "unicode/display_width/string_ext"
require "yaml"

###########################################################################
##		=Core
###########################################################################

# Dotenv
Dotenv.load

# Import custom helpers
helpers CustomHelpers

# Kramdown opts
set :markdown_engine, :kramdown

# Slim opts
Slim::Engine.set_options sort_attrs: false

# Import Netlify opts
include Netlify

###########################################################################
##		=Variables
###########################################################################

set :SITE_TITLE, "Hansard Society"
set :SITE_URL, ""

###########################################################################
##		=Page options
###########################################################################

page "/*.xml", layout: false
page "/*.json", layout: false
page "/*.txt", layout: false

###########################################################################
##		=Environments
###########################################################################

##  Contentful
##############################

contentful_tkn       = nil
contentful_preview   = false

case ENV["CONTENTFUL_ENV"]
when "live"
  contentful_tkn     = ENV["CONTENTFUL_LIVE_TKN"]
when "preview"
  contentful_tkn     = ENV["CONTENTFUL_PREVIEW_TKN"]
  contentful_preview = true
end

activate :contentful do |f|
  f.use_preview_api = contentful_preview
  f.space           = { hs: ENV["CONTENTFUL_SPACE_ID"] }
  f.access_token    = contentful_tkn
  f.cda_query       = { include: 6 }
  f.all_entries     = true
  f.content_types   = {
    child_page:   { mapper: ChildPageMap,   id: "child_page" },
    homepage:     { mapper: HomeMap,        id: "home" },
    landing_page: { mapper: LandingPageMap, id: "landing_page" },
    root_page:    { mapper: RootPageMap,    id: "root_page" },
    navigation:   { mapper: NavigationMap,  id: "navigation" },
    universal:    { mapper: UniversalMap,   id: "universal" },
    people:       { mapper: PeopleMap,      id: "people" }
  }
end

##  Shared build config
##############################

def sharedBuildEnv
  ignore "assets/**"
  ignore "layouts/**"
  ignore "partials/**"
  ignore "templates/**"

  # Cache-busting assets

  manifest = File.read("source/assets/rev-manifest.json")
  manifest_hash = JSON.parse(manifest)

  cssMainHash = manifest_hash["main.css"]
  cssSnipcartHash = manifest_hash["snipcart.css"]
  cssVendorHash = manifest_hash["vendor.css"]
  jsMainHash = manifest_hash["main.js"]
  jsVendorHash = manifest_hash["vendor.js"]

  set :CSS_MAIN,     "/" + cssMainHash
  set :CSS_SNIPCART, "/" + cssSnipcartHash
  set :CSS_VENDOR,   "/" + cssVendorHash
  set :JS_MAIN,      "/" + jsMainHash
  set :JS_VENDOR,    "/" + jsVendorHash

  # Netlify
  redirects()
  headers(cssMainHash, cssVendorHash, jsMainHash, jsVendorHash)

  # Pretty html filenames
  activate :directory_indexes

  # Enable gzip
  activate :gzip

  activate :external_pipeline,
    name: :gulp,
    command: "yarn run epipe:build",
    source: ".tmp/assets",
    latency: 1
end

##  Build
##############################

configure :prod do
  sharedBuildEnv()

  set :ENV, "production"
  set :SNIPCART_TKN, ENV["SNIPCART_LIVE_TKN"]
  set :build_dir, "build/prod"

  after_build do
    File.rename "build/prod/.redirects", "build/prod/_redirects"
    File.rename "build/prod/.headers", "build/prod/_headers"
  end
end

##  Preview site
##############################

configure :preview do
  sharedBuildEnv()

  set :ENV, "preview"
  set :SNIPCART_TKN, ENV["SNIPCART_PREVIEW_TKN"]
  set :build_dir, "build/preview"
end

##  Development
##############################

configure :server do

  # Env variable
  set :ENV, "development"

  # Assets
  set :CSS_MAIN,     "/main.css"
  set :CSS_SNIPCART, "/snipcart.css"
  set :CSS_VENDOR,   "/vendor.css"
  set :JS_MAIN,      "/main.js"
  set :JS_VENDOR,    "/vendor.js"

  # Snipcart
  set :SNIPCART_TKN, ENV["SNIPCART_PREVIEW_TKN"]

  activate :directory_indexes
  activate :external_pipeline,
    name: :gulp,
    command: "yarn run epipe:dev",
    source: ".tmp/assets"
end

###########################################################################
##		=Page proxies
###########################################################################

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
    proxy "#{ child_page.category.parameterize + "/" + child_page.slug }.html",
          "/templates/child-page.html",
          ignore: true,
          locals: { child_page: child_page }
  end

  # Landing pages
  data.hs.landing_page.each do |id, landing_page|
    proxy "#{ landing_page.category.parameterize + "/" + landing_page.slug }.html",
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

# AJAX elements
proxy "/ajax.html", "/templates/ajax.html", :layout => false

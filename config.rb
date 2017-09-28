require "dotenv"
require "json"
require "public_suffix"
require "slim"
require "yaml"

# Config
require "lib/ruby/build_envs"
require "lib/ruby/contentful"
require "lib/ruby/data_maps"
require "lib/ruby/dynamic_pages"
require "lib/ruby/helpers"

# Dotenv
Dotenv.load

# Template helpers
helpers CustomHelpers

# Kramdown opts
set :markdown_engine, :kramdown

# Slim opts
Slim::Engine.set_options sort_attrs: false, pretty: true

# Import libs
include BuildEnvs
include ContentfulConfig
include DynamicPages

# Page options
page "/*.xml", layout: false
page "/*.json", layout: false
page "/*.txt", layout: false

# Site variables
set :SITE_TITLE, "Hansard Society"
set :SITE_URL, ""

# Contentful config
contentfulEnvs()

# Build environments
buildProd()
buildPreview()
buildDev()

# Dymnamic pages
dynamicContentfulPages()
dynamicCustomPages()

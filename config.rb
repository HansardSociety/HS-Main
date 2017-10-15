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

###########################################################################
##		=Templating
###########################################################################

# Directory structure
set :layouts_dir, "views/layouts"

helpers CustomHelpers # helpers
set :markdown_engine, :kramdown # Kramdown
Slim::Engine.set_options sort_attrs: false # Slim

# Page options
page "/*.xml", layout: false
page "/*.json", layout: false
page "/*.txt", layout: false

# Site variables
set :SITE_TITLE, "Hansard Society"
set :SITE_URL, ""

###########################################################################
##		=Build
###########################################################################

include BuildEnvs
include ContentfulConfig
include DynamicPages

# Contentful config
contentfulEnvs()

# Build environments
buildProd()
buildPreview()
buildDev()

# Dymnamic pages
dynamicContentfulPages()
dynamicCustomPages()

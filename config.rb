# 0.5.0

require "dotenv"
require "json"
require "kramdown"
require "public_suffix"
require "slim"
require "yaml"
require "cgi"

# Config
require "lib/ruby/build_envs"
require "lib/ruby/contentful"
require "lib/ruby/data_maps"
require "lib/ruby/helpers"

# Dotenv
Dotenv.load

helpers CustomHelpers # helpers
set :markdown_engine, :kramdown # Kramdown
# Slim::Engine.set_options sort_attrs: false

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
devServer()

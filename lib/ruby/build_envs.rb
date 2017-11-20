require "fileutils"
require "json"

require "lib/ruby/dynamic_pages"
require "lib/ruby/netlify"

include DynamicPages
include Netlify

module BuildEnvs
  MM_ENV = ENV["MM_ENV"]

  ##		=Core
  ########################################

  def coreConfig()
    set :layouts_dir, "views/layouts"

    # Page options
    page "/*.xml", layout: false
    page "/*.json", layout: false
    page "/*.txt", layout: false

    # Site variables
    set :SITE_TITLE, "Hansard Society"
    set :SITE_URL, ""

    # Dynamic pages
    dynamicContentfulPages(MM_ENV)
  end

  ##		=Build core
  ########################################

  def buildCore()

    ##		=Core
    ########################################

    # Core config
    coreConfig()

    # Vars
    @buildSrc = "build/#{ MM_ENV }"

    # Ignore
    ignore "assets/**"
    ignore "views/**"

    # relative links
    set :relative_links, true

    ##		=Cache busting
    ########################################

    manifest = File.read("source/assets/rev-manifest.json")
    manifest_hash = JSON.parse(manifest)

    cssAppHash = manifest_hash["app.css"]
    cssSnipcartHash = manifest_hash["snipcart.css"]
    cssVendorHash = manifest_hash["vendor.css"]
    jsAppHash = manifest_hash["app.js"]
    jsVendorHash = manifest_hash["vendor.js"]

    set :CSS_APP, "/.assets/#{ cssAppHash }"
    set :CSS_SNIPCART, "/.assets/#{ cssSnipcartHash }"
    set :CSS_VENDOR, "/.assets/#{ cssVendorHash }"
    set :JS_APP, "/.assets/#{ jsAppHash }"
    set :JS_VENDOR, "/.assets/#{ jsVendorHash }"

    set :build_dir, "build/#{ MM_ENV }"

    # Netlify
    redirects()

    # After build
    after_build do

      # Redirects
      if MM_ENV == "prod"
        File.rename "build/prod/.redirects", "build/prod/_redirects"
      end

      # http/2 headers
      File.rename "#{ @buildSrc }/.headers", "#{ @buildSrc }/_headers"

      # Rename assets dir
      # File.rename "#{ @buildSrc }/.assets", "#{ @buildSrc }/assets"

    end
  end

  ##		=Production
  ########################################

  def buildProd()
    configure :prod do
      buildCore()

      set :ENV, "production"
      set :SNIPCART_TKN, ENV["SNIPCART_LIVE_TKN"]
    end
  end

  ##		=Preview
  ########################################

  def buildPreview()
    configure :preview do
      buildCore()

      set :ENV, "preview"
      set :SNIPCART_TKN, ENV["SNIPCART_PREVIEW_TKN"]
    end
  end

  ##		=Development
  ########################################

  def devServer()
    configure :server do

      # External pipeline
      activate :external_pipeline,
        name: :gulp,
        command: "yarn run epipe:dev",
        source: "source/.assets",
        latency: 1

      # Core config
      coreConfig()

      # Env variable
      set :ENV, "development"

      # Assets
      set :CSS_APP, "/app.css"
      set :CSS_SNIPCART, "/snipcart.css"
      set :CSS_VENDOR, "/vendor.css"
      set :JS_APP, "/app.js"
      set :JS_VENDOR, "/vendor.js"

      # Snipcart
      set :SNIPCART_TKN, ENV["SNIPCART_PREVIEW_TKN"]
    end
  end
end

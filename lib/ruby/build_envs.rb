require "fileutils"
require "lib/ruby/netlify"
include Netlify

module BuildEnvs

  ##		=Shared
  ########################################

  def sharedBuildEnv(buildEnv)

    ##		=Core
    ########################################

    # Vars
    isProd = (buildEnv == 'prod')
    buildDir = (isProd ? 'prod' : 'preview')
    @buildSrc = "build/#{ buildDir }"

    # Ignore
    ignore "assets/{[!fonts]}**"
    ignore "views/**"

    # relative links
    set :relative_links, true

    ##		=External pipeline
    ########################################

    # Must run first since 'manifest_hash' is dependent
    # on 'rev-manifest.json', which is generated by gulp

    activate :external_pipeline,
      name: :gulp,
      command: "yarn run epipe:prod",
      source: ".tmp/assets",
      latency: 1

    ##		=Cache busting
    ########################################

    manifest = File.read("source/assets/rev-manifest.json")
    manifest_hash = JSON.parse(manifest)

    cssAppHash = manifest_hash["app.css"]
    cssSnipcartHash = manifest_hash["snipcart.css"]
    cssVendorHash = manifest_hash["vendor.css"]
    jsAppHash = manifest_hash["app.js"]
    jsVendorHash = manifest_hash["vendor.js"]

    set :CSS_APP, "/assets/styles/#{ cssAppHash }"
    set :CSS_SNIPCART, "/assets/styles/#{ cssSnipcartHash }"
    set :CSS_VENDOR, "/assets/styles/#{ cssVendorHash }"
    set :JS_APP, "/assets/scripts/#{ jsAppHash }"
    set :JS_VENDOR, "/assets/scripts/#{ jsVendorHash }"

    # Netlify
    redirects()
    # headers({
    #   logoMob: "getData('universal')"
    # })

    # Pretty html filenames
    activate :directory_indexes

    # Enable gzip
    # activate :gzip

    # Move assets
    def moveAssets(ext, dest)
      assetDest = "#{ @buildSrc }/assets/#{ dest }"

      FileUtils.mkdir_p assetDest
      FileUtils.mv Dir.glob("#{ @buildSrc }/*.#{ ext }"), assetDest
    end

    # After build
    after_build do

      # Redirects
      if buildEnv == "prod"
        File.rename "build/prod/.redirects", "build/prod/_redirects"
      end

      # http/2 headers
      File.rename "#{ @buildSrc }/.headers", "#{ @buildSrc }/_headers"

      # Move assets
      moveAssets("css", "styles")
      moveAssets("js", "scripts")

      # Node scripts
      runNodeScripts = "yarn run #{ isProd ? 'post:prod' : 'post:preview' }"
      system runNodeScripts
    end
  end

  ##		=Production
  ########################################

  def buildProd()
    configure :prod do
      sharedBuildEnv("prod")

      set :ENV, "production"
      set :SNIPCART_TKN, ENV["SNIPCART_LIVE_TKN"]
      set :build_dir, "build/prod"
    end
  end

  ##		=Preview
  ########################################

  def buildPreview()
    configure :preview do
      sharedBuildEnv("preview")

      set :ENV, "preview"
      set :SNIPCART_TKN, ENV["SNIPCART_PREVIEW_TKN"]
      set :build_dir, "build/preview"
    end
  end

  ##		=Development
  ########################################

  def buildDev()
    configure :server do

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

      activate :directory_indexes
      activate :external_pipeline,
        name: :gulp,
        command: "yarn run epipe:dev",
        source: ".tmp/assets"
    end
  end
end

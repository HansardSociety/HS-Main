require "fileutils"
require "csv"
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
    dynamicCustomPages()
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
    ignore "data/*.erb"
    ignore "views/**"

    # relative links
    set :relative_links, true

    ##		=Cache busting
    ########################################

    manifest = File.read("source/assets/rev-manifest.json")
    manifest_hash = JSON.parse(manifest)

    cssAppHash = manifest_hash["app.css"]
    cssVendorHash = manifest_hash["vendor.css"]
    jsAppHash = manifest_hash["app.js"]
    jsCheckoutHash = manifest_hash["checkout.js"]
    jsChartHash = manifest_hash["chart.js"]
    jsVendorHash = manifest_hash["vendor.js"]

    ##		=Vars
    ########################################

    set :CSS_APP, "/#{ cssAppHash }"
    set :CSS_VENDOR, "/#{ cssVendorHash }"
    set :JS_APP, "/#{ jsAppHash }"
    set :JS_CHECKOUT, "/#{ jsCheckoutHash }"
    set :JS_CHART, "/#{ jsChartHash }"
    set :JS_VENDOR, "/#{ jsVendorHash }"
    set :build_dir, @buildSrc

    ##		=Post-processing
    ########################################

    activate :minify_html,
      simple_doctype: true,
      remove_intertag_spaces: true

    ##		=Netlify
    ########################################

    redirects()
    headers()

    ##		=After build
    ########################################

    after_build do

      # Redirects
      if MM_ENV == "prod"

        File.rename "build/prod/.redirects", "build/prod/_redirects"
        FileUtils.cp_r Dir.glob("source/assets/images/favicons/**"), "#{ @buildSrc }"

        # Generate content CSV
        jsonDB = JSON.parse(File.open("#{ @buildSrc }/db/search.json").read)
        csvStr = CSV.generate do |csv|
          jsonDB.each do |hash|
            csv << hash.values
          end
        end
        File.open("#{ @buildSrc }/db/content.csv", "w+") { |f| f.write(csvStr) }
      end

      if MM_ENV == "prod"
        # Submit Algolia DB
        system "node ./lib/js/_after-build"
      end

      # http/2 headers
      File.rename "#{ @buildSrc }/.headers", "#{ @buildSrc }/_headers"

      # Rename assets dir
      File.rename "#{ @buildSrc }/.assets", "#{ @buildSrc }/assets"
    end
  end

  ##		=Production
  ########################################

  def buildProd()
    configure :prod do
      buildCore()

      set :ENV, "production"
    end
  end

  ##		=Preview
  ########################################

  def buildPreview()
    configure :preview do
      buildCore()

      set :ENV, "preview"
    end
  end

  ##		=Development
  ########################################

  def devServer()
    configure :server do

      # External pipeline
      activate :external_pipeline,
        name: :gulp,
        command: "npm run epipe:dev",
        source: "source/.assets",
        latency: 1

      # Core config
      coreConfig()

      # Env variable
      set :ENV, "development"

      # Assets
      set :CSS_APP, "/app.css"
      set :CSS_VENDOR, "/vendor.css"
      set :JS_APP, "/app.js"
      set :JS_CHART, "/chart.js"
      set :JS_CHECKOUT, "/checkout.js"
      set :JS_VENDOR, "/vendor.js"
    end
  end
end

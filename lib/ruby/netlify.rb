require "lib/ruby/config_helpers"

module Netlify

  # Redirects
  def redirects()
    File.open("source/.redirects", "w+") do |file|
      universalData[:redirects].each do |redirect|
        redirectStr = "#{ redirect["from"] } #{ redirect["to"] } #{ redirect["protocol"] if redirect["protocol"] }"
        file << "#{ redirectStr.rstrip }\n"
      end
    end
  end

  # headers
  def headers()
    manifest = File.read("source/assets/rev-manifest.json")
    manifest_hash = JSON.parse(manifest)
    cssAppHash = manifest_hash["app.css"]
    cssVendorHash = manifest_hash["vendor.css"]
    jsAppHash = manifest_hash["app.js"]
    jsVendorHash = manifest_hash["vendor.js"]

    File.open("source/.headers", "w+") do |file|
      file << "/*\n"
      file << "  Link: </assets/#{ cssAppHash }>; rel=preload; as=style\n"
      file << "  Link: </assets/#{ cssVendorHash }>; rel=preload; as=style\n"
      file << "  Link: </assets/#{ jsAppHash }>; rel=preload; as=script\n"
      file << "  Link: </assets/#{ jsVendorHash }>; rel=preload; as=script\n"
      file << "  Link: </assets/images/icon-sprite.svg>; rel=preload; as=image\n"
    end
  end
end

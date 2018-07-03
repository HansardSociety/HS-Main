module Netlify

  # Redirects
  def redirects()
    File.open("source/.redirects", "w+") do |file|
      file << "/home /\n"
      file << "/audit /research/audit-of-political-engagement\n"
      file << "/blog/bridging-representative-and-direct-democracy-ireland's-citizens'-assemblies /blog/bridging-representative-and-direct-democracy-irelands-citizens-assemblies\n"
      file << "/newsletter https://www.hansardsociety.org.uk/#panel-0\n"
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
      file << "/server-push-path\n"
      file << "  Link: </assets/#{ cssAppHash }>; rel=preload; as=style\n"
      file << "  Link: </assets/#{ cssVendorHash }>; rel=preload; as=style\n"
      file << "  Link: </assets/#{ jsAppHash }>; rel=preload; as=script\n"
      file << "  Link: </assets/#{ jsVendorHash }>; rel=preload; as=script\n"
    end
  end
end

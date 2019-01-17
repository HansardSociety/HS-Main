module Netlify

  # Redirects
  def redirects()
    File.open("source/.redirects", "w+") do |file|
      file << "/home /\n"
      file << "/media /media/contacts-for-the-media\n"
      file << "/audit /research/audit-of-political-engagement\n"
      file << "/blog/bridging-representative-and-direct-democracy-ireland's-citizens'-assemblies /blog/bridging-representative-and-direct-democracy-irelands-citizens-assemblies\n"
      file << "/newsletter /about/newsletter\n"
      file << "/resources/publications/* /publications/:splat\n"
      file << "/* /about/404.html 404\n"
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

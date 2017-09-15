module Netlify

  # Redirects
  def redirects()
    File.open("./netlify/.redirects", "w+") do |file|
      file << "/home /\n"
      file << "/audit /research/audit-of-political-engagement\n"
      file << "/newsletter https://hansardsociety.activehosted.com/f/9\n"
    end
  end

  # headers
  def headers(cssMainHash, cssVendorHash, jsMainHash, jsVendorHash)
    File.open("./netlify/.headers", "w+") do |file|
      file << "/*\n"
      file << "  Link: </#{ cssMainHash }>; rel=preload; as=style\n"
      file << "  Link: </#{ cssVendorHash }>; rel=preload; as=style\n"
      file << "  Link: </#{ jsMainHash }>; rel=preload; as=script\n"
      file << "  Link: </#{ jsVendorHash }>; rel=preload; as=script\n"
    end
  end
end

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
  # def headers(opts = {})
  #   defaults = {
  #     cssMainHash: "",
  #     cssVendorHash: "",
  #     jsMainHash: "",
  #     jsVendorHash: "",
  #     logoMob: ""
  #   }
  #   opts = defaults.merge(opts)

  #   File.open("./netlify/.headers", "w+") do |file|
  #     file << "/*\n"
  #     # file << "  Link: </#{ cssMainHash }>; rel=preload; as=style\n"
  #     # file << "  Link: </#{ cssVendorHash }>; rel=preload; as=style\n"
  #     # file << "  Link: </#{ jsMainHash }>; rel=preload; as=script\n"
  #     # file << "  Link: </#{ jsVendorHash }>; rel=preload; as=script\n"
  #     file << "  Link: </AvenirLTStd-Book.woff2>; rel=preload; as=font\n"
  #     file << "  Link: </AvenirLTStd-Medium.woff2>; rel=preload; as=font\n"
  #     file << "  Link: </AvenirLTStd-Heavy.woff2>; rel=preload; as=font\n"
  #     file << "  Link: </#{ opts[:logoMob] }>; rel=preload; as=image\n"
  #   end
  # end

  def headers()
    File.open("./netlify/.headers", "w+") do |file|
      file << "/*\n"
      # file << "  Link: </#{ cssMainHash }>; rel=preload; as=style\n"
      # file << "  Link: </#{ cssVendorHash }>; rel=preload; as=style\n"
      # file << "  Link: </#{ jsMainHash }>; rel=preload; as=script\n"
      # file << "  Link: </#{ jsVendorHash }>; rel=preload; as=script\n"
      # file << "  Link: </AvenirLTStd-Book.woff2>; rel=preload; as=font\n"
      # file << "  Link: </AvenirLTStd-Medium.woff2>; rel=preload; as=font\n"
      # file << "  Link: </AvenirLTStd-Heavy.woff2>; rel=preload; as=font\n"
      # file << "  Link: </#{ opts[:logoMob] }>; rel=preload; as=image\n"
    end
  end
end

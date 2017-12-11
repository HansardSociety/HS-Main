module Netlify

  # Redirects
  def redirects()
    File.open("source/.redirects", "w+") do |file|
      file << "/home /\n"
      file << "/audit /research/audit-of-political-engagement\n"
      file << "/newsletter https://hansardsociety.activehosted.com/f/9\n"
    end
  end

  # headers
  def headers(opts = {})
    # defaults = {
    #   cssMainHash: "",
    #   cssVendorHash: "",
    #   jsMainHash: "",
    #   jsVendorHash: "",
    #   logoMob: ""
    # }
    # opts = defaults.merge(opts)

    File.open("./netlify/.headers", "w+") do |file|
      file << "/*\n"
      file << "  Link: </AvenirLTStd-Roman.woff2>; rel=preload; as=font\n"
      file << "  Link: </AvenirLTStd-Heavy.woff2>; rel=preload; as=font\n"
    end
  end
end

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
  def headers()
    File.open("source/.headers", "w+") do |file|
      file << "/*\n"
      # file << "  Link: </assets/fonts/AvenirLTStd-Roman.woff2>; rel=preload; as=font\n"
      # file << "  Link: </assets/fonts/AvenirLTStd-Heavy.woff2>; rel=preload; as=font\n"
      # file << "  Link: </assets/images/svg/sprite.symbol.svg>; rel=preload; as=image\n"
    end
  end
end

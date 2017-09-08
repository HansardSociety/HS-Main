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
  def headers()
    File.open("./netlify/.headers", "w+") do |file|
      file << "/server-push-path\n"
      file << "  Link: </main-.css>; rel=preload; as=style\n"
      file << "  Link: </vendor-.css>; rel=preload; as=style\n"
      file << "  Link: </main-.js>; rel=preload; as=script\n"
      file << "  Link: </main-.css>; rel=preload; as=style\n"
    end
  end
end

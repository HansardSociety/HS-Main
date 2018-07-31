ignoreRegex = /(.json|.headers|.redirects|.css|.js|.eot|.svg|.woff|.woff2|.ttf|.png|.jpg|.jpeg|.gif|.keep)$/

xml.instruct!
xml.urlset("xmlns" => "http://www.sitemaps.org/schemas/sitemap/0.9") do
  sitemap.resources.each do |resource|
    xml.url do
      xml.loc URI.join("https://www.hansardsociety.org.uk", resource.url)
    end if resource.url !~ ignoreRegex
  end
end

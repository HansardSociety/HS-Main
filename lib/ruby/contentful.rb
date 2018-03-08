module ContentfulConfig
  def contentfulEnvs()
    contentful_tkn = nil
    contentful_preview = false

    case ENV["CONTENTFUL_ENV"]
    when "live"
      contentful_tkn = ENV["CONTENTFUL_LIVE_TKN"]
      contentful_space = ENV["CONTENTFUL_SPACE_ID"]
    when "preview"
      contentful_tkn = ENV["CONTENTFUL_PREVIEW_TKN"]
      contentful_space = ENV["CONTENTFUL_SPACE_ID"]
      contentful_preview = true
    end

    activate :contentful do |f|
      f.use_preview_api = contentful_preview
      f.space = { hs: contentful_space }
      f.access_token = contentful_tkn
      f.cda_query = { include: 6 }
      f.all_entries = true
      f.content_types = {
        navigation: { mapper: NavigationMap, id: "navigation" },
        universal: { mapper: UniversalMap, id: "universal" },
        child_page: { mapper: ChildPageMap, id: "child_page" },
        homepage: { mapper: HomeMap, id: "home" },
        landing_page: { mapper: LandingPageMap, id: "landing_page" },
        people: { mapper: PeopleMap, id: "people" }
      }
    end
  end
end

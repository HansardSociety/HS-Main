module ContentfulConfig
  def contentfulEnvs()
    contentful_tkn       = nil
    contentful_preview   = false

    case ENV["CONTENTFUL_ENV"]
    when "live"
      contentful_tkn     = ENV["CONTENTFUL_LIVE_TKN"]
    when "preview"
      contentful_tkn     = ENV["CONTENTFUL_PREVIEW_TKN"]
      contentful_preview = true
    end

    activate :contentful do |f|
      f.use_preview_api = contentful_preview
      f.space           = { hs: ENV["CONTENTFUL_SPACE_ID"] }
      f.access_token    = contentful_tkn
      f.cda_query       = { include: 6 }
      f.all_entries     = true
      f.content_types   = {
        child_page:   { mapper: ChildPageMap,   id: "child_page" },
        homepage:     { mapper: HomeMap,        id: "home" },
        # landing_page: { mapper: LandingPageMap, id: "landing_page" },
        # root_page:    { mapper: RootPageMap,    id: "root_page" },
        navigation:   { mapper: NavigationMap,  id: "navigation" },
        universal:    { mapper: UniversalMap,   id: "universal" },
        people:       { mapper: PeopleMap,      id: "people" }
      }
    end
  end
end

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
    when "experimental"
      contentful_tkn = ENV["EXP_CONTENTFUL_LIVE_TKN"]
      contentful_space = ENV["EXP_CONTENTFUL_SPACE_ID"]
    end

    activate :contentful do |f|
      f.use_preview_api = contentful_preview
      f.space = { hs: contentful_space }
      f.access_token = contentful_tkn
      f.cda_query = { include: 6 }
      f.all_entries = true
      f.content_types = {
        child_page: { mapper: ChildPageMap, id: "child_page" },
        form_newsletter: { mapper: FormMap, id: "form_newsletter" },
        homepage: { mapper: HomeMap, id: "home" },
        landing_page: { mapper: LandingPageMap, id: "landing_page" },
        navigation: { mapper: NavigationMap, id: "navigation" },
        people: { mapper: PeopleMap, id: "people" },
        universal: { mapper: UniversalMap, id: "universal" }
      }
    end
  end
end

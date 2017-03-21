# Content Model

````
..
|-- SITE
| |-- organisation
| |-- logo_mobile
| |-- contact
| | |-- # social media accounts, email etc
| | ..
| |-- strapline
| ..
|-- navigation
| |-- title
| | |-- # Our work, Events, Research, Blog, Journal
| | ..
| |-- pages (ref, many)
| | |-- # landing_page, child_page, url
| | ..
| |-- url
| ..
|-- home
| |-- meta_title
| |-- strapline
| |-- banner_image
| |-- panels (ref, many)
| | |-- carousel
| | |-- promotion
| | ..
| ..
|-- landing_page
| |-- title
| |-- category
| | |-- # About, Blog, Events, Intelligence, Research, Resources
| | ..
| |-- introduction (250-290 chars)
| |-- banner_image
| |-- image_focus
| |-- panels (ref, many)
| |-- slug
| ..
|-- child_page
| |-- title
| |-- category
| | |-- # About, Blog, Events, Intelligence, Research, Resources
| | ..
| |-- introduction (250-290 chars)
| |-- copy
| |-- promoted (ref, single)
| | |-- # landing_page, child_page, product
| | ..
| |-- banner_image
| |-- image_focus
| |-- sidebar (ref, many)
| | |-- # different types of side-bar content (auto-sorted and
| | |   # titled) presented as cards, lists etc and extracted
| | |   # from other 'pages'. Top item = feature.
| | ..
| |-- slug
| |-- tags
| | |-- # events, projects
| | ..
| ..
|-- carousel
| |-- meta_title
| |-- carousel_title [opt]
| |-- category [opt]
| |-- cards (ref, many)
| | |-- child_page
| | |-- landing_page
| | ..
| ..
|-- promotion
| |-- meta_title
| |-- content (ref, single)
| | |-- testimonial
| | |-- call_to_action
| | |-- featured_copy
| | ..
| ..
|-- product
| |-- title
| |-- price
| |-- image
| |-- (dimensions etc)
| ..
|-- registration
| |-- title
| |-- date_time
| |-- venue
| |-- price
| |-- url
| |-- embed_code
| ..
..
````

# Content Model

````
..
|-- __GLOBAL__
| |-- organisation
| |-- contact
| | |-- # social media accounts, email etc
| | ..
| |-- navigation (ref, many)
| | |-- # navigation_item
| | ..
| ..
|-- navigation_item (ref, many)
| |-- # landing_page, child_page
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
| |-- page_title
| |-- category
| |-- banner_image
| |-- introduction (250-290 chars)
| |-- panels (ref, many)
| |-- slug
| ..
|-- child_page
| |-- title
| |-- category
| | |-- # projects, events, about, intelligence, publications, blog
| | ..
| |-- banner_image
| |-- introduction (250-290 chars)
| |-- copy
| |-- side_bar (ref, many)
| | |-- # different types of side-bar content (auto-sorted and
| |     # titled) presented as cards, lists etc and extracted
| |     # from other 'pages'. Top item = feature.
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
..
````

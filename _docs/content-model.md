# Content Model

````
..
|-- __GLOBAL__
| |-- organisation
| |-- logo_mobile
| |-- contact
| | |-- # social media accounts, email etc
| | ..
| |-- our_work (ref, many)
| | |-- # child_page, landing_page:
| | |   # research, intelligence, resources
| | ..
| |-- about (ref, many)
| | |-- # child_page: about
| | |   # boxes: newsletter, contact/ social media
| | ..
| |-- events (ref, single)
| | |-- # landing_page: events
| | ..
| |-- journal (ref, single)
| | |-- # landing_page: journal
| | ..
| |--
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
| |-- title
| |-- category
| |-- banner_image
| |-- introduction (250-290 chars)
| |-- panels (ref, many)
| |-- slug
| ..
|-- child_page
| |-- title
| |-- category
| | |-- # about, blog, events, intelligence, research, resources
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

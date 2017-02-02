# Contentful Entries

````
..
|-- landing_page
| |-- meta_title
| |-- page_title
| |-- category
| |-- introduction
| |-- panels (ref, many)
| |-- slug
| ..
|-- child_page
| |-- meta_title
| |-- page_title
| |-- category
| | |-- # projects, events, about, intelligence, publications, blog
| | ..
| |-- introduction
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
|-- panel
| |-- meta_title
| |-- panel_title [opt]
| |-- category [opt]
| |-- cards (ref, many)
| | |-- child_page
| | |-- landing_page
| | ..
| ..
..
````

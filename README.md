# MDX to Sanity 🤖

Move the posts from the codebase one by one would be annoying and error-prone.
This script scans the `/posts` directory, catches all `.mdx` files, parses the FrontMatter, and publishes them on Sanity.

## Disclaimer 😬

This script is not abstracted and made to fit my own use-case. If you decide to use it, you may need to fork and adapt it to your needs.

## Configuration 👩‍🏫

| Environment variables  | 🧋 |
| -- | -- |
| TOKEN | your Sanity studio token with **write** permissions |
| PROJECT_ID | the ID of your Sanity Studio |
| DATASET | the name of the dataset (usually `production`) |

| Runtime Constants | value | 🤷 |
| -- | -- | -- |
| POSTS_GLOB | `['posts/*.mdx']` | where and which files the script will get |

👉 these are probably the stuff you will want to adapt first
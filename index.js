require('dotenv').config()
const sanityClient = require('@sanity/client')
const matter = require('gray-matter')
const fg = require('fast-glob')
const { promises: fs } = require('fs')

const { PROJECT_ID, TOKEN, DATASET } = process.env
const POSTS_GLOB = ['posts/*.mdx']

const client = sanityClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  useCdn: false
})

const success = (id, type, name) => {
  console.log(`✔  Entry ${id} of type ${type} created: ${name}`)
}

const idFromTitle = (title) => title.toLowerCase().replace(' ', '-')

const createAllPosts = async (glob = []) => {
  const posts = await fg(glob)

  const results = await Promise.all(posts.map(buildPostData))

  results.forEach(async result => {
    const { _id, _type, title } = await client.createIfNotExists(result)

    success(_id, _type, title)
  })

  return `🏁  Success: ${results.length} entries created.`
}

const addCategory = async (categoryName) => {
  const uniqueID = idFromTitle(categoryName)

  const { _id, _type, title } = await client.createIfNotExists({ title: categoryName, _id: uniqueID, _type: "category", description: 'placeholder'  })
  success(_id, _type, title)

  return { title: categoryName, _key: uniqueID  }
}

const buildPostData = async (postPath) => {
  const text = await fs.readFile( __dirname + '/' + postPath, 'utf8')
  const { content, data } = matter(text)

  // allow category reference to be strong
  await Promise.all(data.keywords.map(addCategory))

  return {
    _type: 'post',
    _id: idFromTitle(data.title),
    title: data.title,
    description: data.pitch,
    lastUpdated: data.date,
    categories: data.keywords.map(word => ({
      _key: idFromTitle(word),
      _ref: idFromTitle(word)
    })),
    slug: {
      current: data.path.substring(1),
      key: data.path.substring(1),
      _type: 'slug'
    },
    body: content
  }
}

createAllPosts(POSTS_GLOB)
# Hacker News (HN) GraphQL Server

### An Apollo GraphQL Server serving content from Y Combinator's infamous news source

### Getting Started

Clone the repo, run `yarn install` and `node index.js` to boot up the Apollo Server.

Navigate to [localhost:4000](http://localhost:4000) to start running queries and inspecting the schema.

### Test Queries

Copy and Paste any of the queries in [this directory](tests/testing.md) to get a sense of how this API may be used.

### Structure and Thought

API on GitHub: https://github.com/HackerNews/API

Access Patterns for this API:

- getStory: id -> Story: { Comments: [] }
- getTopStories: (limiter) -> [Story: { Comments: [] }]
- getUser: (username) -> User: { Stories: [] }

Since this would be a PWA, I would like to cache the most recent/top stories, or even a list of whichever ones
the user clicks a button indicator on, to know which they'd like to keep offline.

So maybe, just need one or two queries to access this, like:

```
type Query {
	listTopStories(limit: Int): [Story]
	"""
	Story and Comments have child nodes,
	but all descendants are Comments by nature
	"""
	listDescendants(id: ID): [Comment]
	getUserById(id: ID!): User
}
```

Those stories would have nested comments beneath them, which in turn may have nested descendants to one or two levels
of depth themselves.

```
listTopStories {
	...Listable, # interface Story extends
	url
}
```

### Apollo Graph Manager

Useful for analytics, error reporting, and versioning: https://www.apollographql.com/docs/tutorial/production/#what-are-the-benefits-of-graph-manager

To publish API to Graph Manager, first put ENGINE_API_KEY in .env file.

While the Apollo Server is running (i.e. run `node index.js` in root), run:

`npx apollo service:push --endpoint=http://localhost:4000`

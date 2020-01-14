const { ApolloServer, gql } = require('apollo-server');
const { listTopStories, listDescendents } = require('./helpers/api');

/**
 *	## Y Combinator Hacker News (HN) GraphQL API Mockup ##
 *
 * API on GitHub: https://github.com/HackerNews/API#new-top-and-best-stories
 *
 *
 * Access Patterns for this API:
 *
 * getStory: id -> Story: { Comments: [] }
 * getTopStories: () -> [Story: { Comments: [] }]
 * getUser: (username) -> User: { Stories: [] }
 *
 * Ref link: https://github.com/HackerNews/API#new-top-and-best-stories
 * Since this will be a PWA, I would like to cache the most recent/top stories, or even a list of whichever ones
 * the user clicks a button indicator on, to know which they'd like to keep offline.
 *
 * So maybe, just need one or two queries to access this, like:
 * 	type Query {
 * 		listTopStories(): [Story]
 * 		listDescendants(id: ID): [Comment] # Story and Comments have desc., but all desc are Comments by nature
 * }
 *
 * Those stories would have nested comments beneath them, which in turn may have nested descendants to one or two levels
 * of depth themselves.
 *
 * 	listTopStories {
 * 		...Listable, # interface Story extends
 * 		url,
 *
 * }
 *
 * 	## Apollo Graph Manager ##
 *
 * 	Useful for analytics, error reporting, and versioning: https://www.apollographql.com/docs/tutorial/production/#what-are-the-benefits-of-graph-manager
 *
 * 	To publish API to Graph Manager, first put ENGINE_API_KEY in .env file, then:
 * 	Run: `npx apollo service:push --endpoint=http://localhost:4000`
 * 	while this server is running (i.e. run `node index.js` in root).
 *
 *
 *
 */

const typeDefs = gql`
  type Story implements Listable {
    id: ID!
    deleted: Boolean
    by: User
    time: String
    type: String
    # Unique
    text: String
    dead: Boolean
    comments: [Comment]
    url: String # comments don't have urls
    score: Int
    title: String
  }

  type Comment implements Listable {
    id: ID!
    by: User
    time: String
    text: String
    type: String
    # Unique
    parent: Story
  }

  type User {
    id: ID
    created: String
    karma: Int
    about: String
    stories: [Story]
    comments: [Comment]
  }

  interface Listable {
    id: ID!
    by: User
    type: String
    time: String
    text: String
  }

  type Query {
    listTopStories: [Story]
    listDescendants: [Comment]
  }
`;

const fixture = {
  by: 'leventov',
  descendants: 36,
  id: 22025113,
  kids: [
    22025738,
    22026162,
    22043153,
    22025515,
    22025585,
    22025699,
    22026999,
    22030278,
    22028658,
    22028909,
    22025674
  ],
  score: 127,
  time: 1578815978,
  title: 'Climatescape.org – Mapping the global landscape of climate-saving organizations',
  type: 'story',
  url: 'https://climatescape.org/'
};

const resolvers = {
  Listable: {
    __resolveType(obj, context, info) {
      if (obj.type === 'story') {
        return 'Story';
      }
      if (obj.type === 'comment') {
        return 'Comment';
      }
      return null;
    }
  },
  Query: {
    listTopStories,
    listDescendants: id => [fixture]
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: true
  // engine: {
  //   apiKey: process.env.ENGINE_API_KEY
  //   schemaTag: 'production'
  // }
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

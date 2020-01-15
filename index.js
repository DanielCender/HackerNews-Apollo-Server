const { ApolloServer, gql } = require('apollo-server');
const {
  listTopStories,
  listDescendants,
  getComments,
  getUser,
  getUserById,
  getUserStories,
  getUserComments,
  getCommentParent
} = require('./helpers/api');

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
 *    getUserById(id: ID!): User
 * }
 *
 * Those stories would have nested comments beneath them, which in turn may have nested descendants to one or two levels
 * of depth themselves.
 *
 * 	listTopStories {
 * 		...Listable, # interface Story extends
 * 		url
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
  """
  The basic building blocks of HN, blog posts essentially.
  """
  type Story implements Listable {
    id: ID!
    deleted: Boolean
    by: User
    time: String
    type: String
    # Unique
    text: String
    dead: Boolean
    comments: [Comment]!
    url: String
    score: Int
    title: String
  }

  """
  The messages that sit below a Story,
  can be nested like a directed graph through the "kids" property.
  """
  type Comment implements Listable {
    id: ID!
    by: User
    time: String
    text: String
    type: String
    # Unique
    """
    parent field returns either Story or Comment
    """
    parent: Parent
    kids: [Comment]
  }

  type User {
    id: ID
    created: String
    karma: Int
    about: String
    stories(limit: Int): [Story]!
    comments(limit: Int): [Comment]!
  }

  """
  Contains fields common to both Story and Comment types
  """
  interface Listable {
    id: ID!
    by: User
    type: String
    time: String
    text: String
  }

  union Parent = Story | Comment

  type Query {
    listTopStories(limit: Int): [Story]!
    listDescendants(id: ID!): [Comment]!
    getUserById(id: ID!): User
  }
`;

const resolvers = {
  Listable: {
    __resolveType(obj, ctx, info) {
      if (obj.type === 'story') {
        return 'Story';
      }
      if (obj.type === 'comment') {
        return 'Comment';
      }
      return null;
    }
  },
  Parent: {
    __resolveType(obj, ctx, info) {
      if (obj.type === 'story') {
        return 'Story';
      }
      if (obj.type === 'comment') {
        return 'Comment';
      }
      return null;
    }
  },
  Comment: {
    parent: getCommentParent,
    kids: getComments,
    by: getUser
  },
  Story: {
    comments: getComments,
    by: getUser
  },
  User: {
    stories: getUserStories,
    comments: getUserComments
  },
  Query: {
    listTopStories,
    listDescendants,
    getUserById
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: true
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

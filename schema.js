const { gql } = require('apollo-server');

module.exports = gql`
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

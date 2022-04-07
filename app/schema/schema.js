const graphql = require("graphql");

const db = require("../models/index");

var slugify = require("slugify");

const Place = db.places;
const User = db.users;
const Category = db.categories;

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLNumber,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

//Schema defines data on the Graph like object types(book type), the relation between
//these object types and describes how they can reach into the graph to interact with
//the data to retrieve or mutate the data

const PlaceType = new GraphQLObjectType({
  name: "Place",
  //We are wrapping fields in the function as we don’t want to execute this until
  //everything is inilized. For example below code will throw an error AuthorType not
  //found if not wrapped in a function
  fields: () => ({
    // https://graphql.org/graphql-js/type/
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    desc: { type: GraphQLString },
    //categories: {}, => GraphQLList
    lat: {
      type: GraphQLString,
      resolve(parent, args) {
        // TODO: return Decimal
        return parent.lat.toString();
      },
    },
    lon: {
      type: GraphQLString,
      resolve(parent, args) {
        // TODO: return Decimal
        return parent.lon.toString();
      },
    },
    //assets: {},
    //visits: {},
    planified: { type: GraphQLBoolean },
    user: {
      type: UserType,
      resolve(parent, args) {
        // TODO: use User.findById(parent.id)
        return User.findOne({ id: parent.id });
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    firstname: { type: GraphQLString },
    lastname: { type: GraphQLString },
    email: { type: GraphQLString },
    isAdmin: { type: GraphQLBoolean },
    /*
    places: {
      type: new GraphQLList(PlaceType),
      resolve(parent, args) {
        return Place.find({ user: parent.id });
      },
    },
    */
  }),
});

const CategoryType = new GraphQLObjectType({
  name: "Category",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    desc: { type: GraphQLString },
    slug: { type: GraphQLString },
    color: { type: GraphQLString },
  }),
});

//RootQuery describes how users can use the graph and grab data.
//E.g Root query to get all authors, get all books, get a particular
//book or get a particular author.
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    place: {
      type: PlaceType,
      //argument passed by the user while making the query
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //Here we define how to get data from a database source

        //this will return the book with id passed in argument
        //by the user
        return Place.findById(args.id);
      },
    },
    places: {
      type: new GraphQLList(PlaceType),
      resolve(parent, args) {
        return Place.find({});
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findById(args.id);
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find({});
      },
    },
    category: {
      type: CategoryType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Category.findById(args.id);
      },
    },
    categories: {
      type: new GraphQLList(CategoryType),
      resolve(parent, args) {
        return Category.find({});
      },
    },
  },
});

//Very similar to RootQuery helps users to add/update to the database.
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addPlace: {
      type: PlaceType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        desc: { type: new GraphQLNonNull(GraphQLString) },
        //categories: {}, => GraphQLList
        lat: { type: new GraphQLNonNull(GraphQLString) },
        lon: { type: new GraphQLNonNull(GraphQLString) },
        //assets: {},
        //visits: {},
        planified: { type: new GraphQLNonNull(GraphQLBoolean) },
        user: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let place = new Place({
          name: args.name,
          desc: args.desc,
          lat: args.lat,
          lon: args.lon,
          planified: args.planified,
          user: args.user,
        });
        return place.save();
      },
    },
    addUser: {
      type: UserType,
      args: {
        //GraphQLNonNull make these fields required
        firstname: { type: GraphQLString },
        lastname: { type: GraphQLString },
        email: { type: GraphQLString },
        //isAdmin: { type: GraphQLBoolean },
      },
      resolve(parent, args) {
        let user = new User({
          firstname: args.firstname,
          lastname: args.lastname,
          email: args.email,
          isAdmin: true, // args.isAdmin,
        });
        let newUser = user.save();
        return newUser;
      },
    },
    addCategory: {
      type: CategoryType,
      args: {
        //GraphQLNonNull make these fields required
        name: { type: GraphQLString },
        desc: { type: GraphQLString },
        color: { type: GraphQLString },
      },
      resolve(parent, args) {
        let category = new Category({
          name: args.name,
          desc: args.desc,
          slug: slugify(args.name),
          color: args.color,
        });
        return category.save();
      },
    },
  },
});

//Creating a new GraphQL Schema, with options query which defines query
//we will allow users to use when they are making requests.
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

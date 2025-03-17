require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { ApolloServer } = require("apollo-server-express");
const jwt = require("jsonwebtoken");

// Import REST Routes
const authRoutes = require("./routes/auth");
const userProfileRoutes = require("./routes/user_profile");

// Import GraphQL Schema & Resolvers
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ✅ Include REST APIs
app.use("/auth", authRoutes);
app.use("/user_profile", userProfileRoutes);

// ✅ Set up GraphQL Server with JWT Context
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer Token
    if (token) {
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return { user };
      } catch (err) {
        console.error("❌ Invalid token");
      }
    }
    return {};
  },
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(
      `📌 GraphQL Playground: http://localhost:${PORT}${server.graphqlPath}`
    );
  });
}

startServer();

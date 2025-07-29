import { betterAuth } from "better-auth/*";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/academix";
export const client = new MongoClient(MONGO_URI);
export const auth = betterAuth({
  database: mongodbAdapter(client.db("academix")),
  emailAndPassword: {
    enabled: true,
    // autoSignIn: false, // Uncomment to disable auto sign-in after registration
  },
  // Example: Add social providers
  // socialProviders: {
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID!,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  //   },
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID!,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  //   },
  // },
  // Example: Add plugins (e.g., two factor authentication)
  // plugins: [
  //   twoFactor()
  // ]
});

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";


const MONGO_URL = process.env.MONGO_URI || "mongodb://localhost:27017/academix";
export const client = new MongoClient(MONGO_URL);

export const auth = betterAuth({
  database: mongodbAdapter(client.db("academix")),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseUrl: process.env.BETTER_AUTH_URL!,
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy",
    },
  },
});

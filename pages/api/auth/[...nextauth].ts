import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import { OAuthConfig } from "next-auth/providers";
import { randomBytes } from "crypto";

// Helper function to generate a random nonce
const generateNonce = () => {
  return randomBytes(32).toString("base64url");
};

// Helper function to decode JWT token
const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Define types for better type safety
interface ExtendedToken {
  accessToken?: string;
  idToken?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  error?: string;
}

// Environment variables are now properly loaded

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "ssojet",
      name: "SSOJet",
      type: "oauth",
      wellKnown: `${process.env.SSOJET_AUTHORITY || "https://ssojet.com"}/.well-known/openid-configuration`,
      authorization: {
        params: {
          scope: "openid profile email",
          response_type: "code",
          nonce: undefined, // Next-Auth will handle nonce automatically
          
        },
      },
      clientId: process.env.SSOJET_CLIENT_ID || "your_client_id_here",
      clientSecret: process.env.SSOJET_CLIENT_SECRET || "your_client_secret_here",
      checks: ["pkce", "state", "nonce"],
      idToken: true,
      profile(profile, tokens) {
        console.log("Profile from provider:", profile);
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
      async request({ url, init }) {
        console.log("Making request to:", url);
        try {
          const response = await fetch(url, init);
          if (!response.ok) {
            const error = await response.text();
            console.error("Provider request failed:", {
              status: response.status,
              error: error,
            });
            throw new Error(`Request failed:  ${error}`);
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error("Request error:", error);
          throw error;
        }
      },
    } as OAuthConfig<any>,
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && account.id_token) {
        try {
          // Decode the ID token to get user information
          const decodedToken = decodeToken(account.id_token);
          console.log("Decoded ID token:", decodedToken);

          // Update token with user information
          token.user = {
            id: decodedToken.sub,
            name: decodedToken.name,
            email: decodedToken.email,
            image: decodedToken.picture,
          };
          token.accessToken = account.access_token;
          token.idToken = account.id_token;
        } catch (error) {
          console.error("Error processing token:", error);
          token.error = "Failed to process authentication token";
        }
      }
      return token;
    },
    async session({ session, token }) {
      console.log(
        "Processing session with token:",
        JSON.stringify(token, null, 2)
      );

      // Copy user information from token to session
      if (token.user) {
        session.user = token.user;
      }

      // Add tokens to session
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;
      session.error = token.error;

      // Log the final session state
      console.log("Final session state:", JSON.stringify(session, null, 2));

      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(code, metadata) {
      console.error("Auth error:", { code, metadata });
    },
    warn(code) {
      console.warn("Auth warning:", code);
    },
    debug(code, metadata) {
      console.log("Auth debug:", { code, metadata });
    },
  },
  events: {
    async signIn(message) {
      console.log("Sign in event:", message);
    },
    async error(message) {
      console.error("Auth error event:", message);
    },
  },
};

// Type augmentation for next-auth
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    idToken?: string;
    error?: string;
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    };
  }
}

export default NextAuth(authOptions);

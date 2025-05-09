import jwt from "jsonwebtoken";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { userLogin } from "./api/auth";

export const authOptions: AuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { type: "email" },
                password: { type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) return null;

                const loginData = {
                    email: credentials.email,
                    password: credentials.password,
                };

                try {
                    const user = await userLogin(loginData);

                    if (user?.accessToken) {
                        return {
                            ...user,
                            decodedToken: jwt.decode(user.accessToken),
                        };
                    } else {
                        throw new Error("User not found or missing access token");
                    }
                } catch (error) {
                    throw new Error(error instanceof Error ? error.message : String(error));
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.decodedToken = user.decodedToken;
            }

            if (trigger === "update") {
                return {
                    ...token,
                    ...session.user,
                };
            }

            // if (token.accessToken) {
            //     const decoded: any = token.decodedToken;
            //     const exp = decoded?.exp ?? 0;
            //     const now = Math.floor(Date.now() / 1000);

            //     if (exp - now < 60) {
            //         try {
            //             const newToken = await generateToken();

            //             if (newToken?.accessToken) {
            //                 token.accessToken = newToken.accessToken;
            //                 token.decodedToken = jwt.decode(newToken.accessToken);
            //             }
            //         } catch (error) {
            //             console.error("Token refresh failed:", error);
            //         }
            //     }
            // }

            return token;
        },
        async session({ session, token }) {
            session.user = token;
            return session;
        },
    },
    pages: {
        signIn: "/",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

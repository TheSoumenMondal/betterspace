import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import { Resend } from "resend";
import { env } from "@/env";
import { db } from "@/server/db";

const resend = new Resend(env.RESEND_API_KEY);

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	account: {
		accountLinking: {
			enabled: true,
		},
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
	},

	baseURL: env.BETTER_AUTH_URL,
	trustedOrigins: [env.APP_URL],
	socialProviders: {
		google: {
			prompt: "select_account",
			enabled: true,
			clientId: env.BETTER_AUTH_GOOGLE_CLIENT_ID,
			clientSecret: env.BETTER_AUTH_GOOGLE_CLIENT_SECRET,
		},
	},
	user: {
		additionalFields: {
			hasCompletedOnboarding: {
				type: "boolean",
				defaultValue: false,
				required: true,
			},
			plan: {
				type: "string",
				defaultValue: "free",
				required: true,
			},
			nextAllowedSyncAt: {
				type: "date",
				defaultValue: null,
				required: false,
			},
		},
	},

	plugins: [
		emailOTP({
			async sendVerificationOTP({ email, otp, type }) {
				if (type === "sign-in" || type === "email-verification") {
					await resend.emails.send({
						from: "Betterspace <[email protected]>",
						to: email,
						subject: "Your OTP Code",
						html: `
							<div style="font-family: sans-serif; padding: 20px;">
								<h2>Verify your email</h2>
								<p>Your one-time password (OTP) is:</p>
								<h1 style="letter-spacing: 4px;">${otp}</h1>
								<p>This code will expire in a few minutes.</p>
							</div>
						`,
					});
				}
			},
		}),
		nextCookies(),
	],
});

export type Session = typeof auth.$Infer.Session;

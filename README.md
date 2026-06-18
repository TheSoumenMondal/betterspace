# BetterSpace

BetterSpace is an AI-powered workspace designed to unify and automate your daily workflows by seamlessly integrating your Inbox and Calendar. It leverages artificial intelligence to manage meetings, organize emails, and automate follow-ups, transforming scattered tools into a streamlined, intelligent central hub.

## Key Features

- **Unified Inbox & Calendar:** Connect your Google Workspace (Gmail and Calendar) to manage your schedule and communications in one place.
- **AI Automation:** Utilizes OpenAI to intelligently organize data, automate follow-ups, and streamline meeting management.
- **Robust Authentication:** Secure authentication system using Better Auth, supporting both Email/Password and direct Google OAuth.
- **Background Processing:** Reliable background task execution and webhooks management powered by Inngest.
- **Modern UI:** Built with Next.js 15 and Tailwind CSS, featuring a highly responsive, accessible, and premium interface.

## Technology Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Package Manager:** [Bun](https://bun.sh/)
- **Database & ORM:** PostgreSQL, [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication:** [Better Auth](https://better-auth.com/)
- **API Layer:** [tRPC](https://trpc.io/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Integrations:** Corsair (OAuth sync), Inngest (Background Jobs), Resend (Transactional Emails)
- **Tooling:** Biome (Linting/Formatting), TypeScript

## Prerequisites

Before you begin, ensure you have the following installed:
- [Bun](https://bun.sh/) (v1.0 or higher)
- [PostgreSQL](https://www.postgresql.org/) database (local or cloud-hosted)
- Node.js (v20+ recommended)

## Setup and Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/betterspace.git
   cd betterspace
   ```

2. **Install dependencies:**
   Using Bun is required to avoid dependency conflicts.
   ```bash
   bun install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file and populate it with your actual credentials.
   ```bash
   cp .env.example .env
   ```
   Open `.env` and configure your keys (Database URL, Google OAuth, OpenAI, Resend, etc.). Note: Ensure `APP_URL` and `BETTER_AUTH_URL` are aligned. If you are using ngrok for webhooks, set them to your public ngrok URL.

4. **Set up the Database:**
   Run the Drizzle migrations to initialize your database schema.
   ```bash
   bun run db:push
   ```
   *(If you are using a standard migration workflow, utilize `bun run db:migrate` based on your scripts).*

5. **Initialize Integration Secrets (Corsair):**
   If you are setting up the Google Calendar or Gmail plugins, use the Corsair CLI to configure your client credentials.
   ```bash
   bun corsair setup --plugin=gmail client_id=YOUR_CLIENT_ID client_secret=YOUR_CLIENT_SECRET
   ```

## Running the Application

To start the development environment:

1. **Start the Next.js server:**
   ```bash
   bun run dev
   ```

2. **Start the Inngest Dev Server:**
   In a separate terminal, start Inngest to process background jobs and webhooks.
   ```bash
   npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
   ```

3. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Troubleshooting

- **Corsair Decryption Errors:** If you encounter `Error: Unsupported state or unable to authenticate data` when running `corsair setup`, it means your `CORSAIR_KEK` in `.env` has changed since the last setup. You must either revert to your original key or clear the encrypted integrations table in your database and re-run the setup.
- **OAuth Redirect Mismatch:** Ensure that the `APP_URL` defined in your environment variables exactly matches the authorized redirect URIs in your Google Cloud Console.
- **Build Errors:** Always use `bun` instead of `npm` to resolve packages, as peer dependencies are strictly managed in the Bun lockfile.

## Code Quality

This project enforces strict formatting and linting using [Biome](https://biomejs.dev/). To check for issues:
```bash
bun check
```
To format the codebase:
```bash
bun run format
```

## License

All rights reserved.

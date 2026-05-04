I Got This is a Next.js App Router project for shared household coordination.

## Getting Started

### Prerequisites

- Bun installed locally
- Doppler CLI installed and authenticated
- Access to the Doppler project and config for this app

### Local setup

1. Install dependencies with Bun:

```bash
bun install
```

2. Log in to Doppler and attach the local project/config:

```bash
doppler login
doppler setup
```

3. Run the app through Doppler so `DATABASE_URL` and future secrets come from Doppler-managed config:

```bash
bun run dev
```

### Prisma

All Prisma commands are wrapped in Doppler so the database URL is always resolved from secrets management:

```bash
bun run db:generate
bun run db:migrate
bun run db:push
bun run db:studio
```

### Environment variables

Do not place real secrets in a checked-in `.env` file. The app expects `DATABASE_URL` to be provided by Doppler at runtime.

Required values managed by Doppler:

- `DATABASE_URL`
- `AUTH_SECRET`

The repository includes `.env.example` as a non-secret reference only.

## Development

Run the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses `next/font` to automatically optimize and load the Geist font family.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

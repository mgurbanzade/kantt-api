## Running the app through Docker

You need to define env variables in `.env` file first.
Check `.env.example` for references

Open your terminal and run

```bash
docker-compose up
```

## Seeding the db with Docker

Check out `prisma/seed.ts` for log in credentials

```bash
yarn docker:seed
```

#!/bin/sh

# Check the MIGRATE_FLAG environment variable
if [ "$MIGRATE_FLAG" = "true" ]; then
    npx prisma migrate dev --name init
    echo "Migration complete!"
    npx prisma db seed
    echo "Prisma DB seeding complete!"
else
    echo "Migration skipped!"
    npx prisma generate
    echo "Generate prisma client complete!"
fi

# Run the original command (npm run watch:dev)
npm run watch:dev

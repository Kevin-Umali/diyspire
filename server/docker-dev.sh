#!/bin/sh

echo "Prisma DB push..."
npx prisma db push
echo "Prisma DB push complete!"
npx prisma generate
echo "Generate prisma client complete!"

# Run the original command (npm run watch:dev)
npm run watch:dev

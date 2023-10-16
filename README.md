# Make Me Project

A platform that provides unique DIY (Do It Yourself) project suggestions using OpenAI. Explore a variety of projects, their materials, and steps to create them.

## Structure

- `/client`: Contains frontend of the platform. It allows users to navigate through projects, filter by category and difficulty, and view project details. [Client details](./client/README.md)
- `/server`: Backend API responsible for fetching project data and managing interactions with OpenAI. [Server details](./server/README.md)

## Setup

1. Clone the repository.
2. Set up both the client and server by following their respective READMEs.

```
make-me-project
├─ .github
│  ├─ dependabot.yml
│  └─ workflows
│     ├─ codeql.yml
│     └─ stale.yml
├─ .gitignore
├─ .husky
│  ├─ pre-commit
│  └─ _
│     ├─ .gitignore
│     └─ husky.sh
├─ client
│  ├─ .eslintrc.json
│  ├─ .gitattributes
│  ├─ .gitignore
│  ├─ .lintstagedrc.json
│  ├─ app
│  │  ├─ community
│  │  │  ├─ community.tsx
│  │  │  ├─ loading.tsx
│  │  │  └─ page.tsx
│  │  ├─ error.tsx
│  │  ├─ faq
│  │  │  ├─ faq.tsx
│  │  │  ├─ loading.tsx
│  │  │  └─ page.tsx
│  │  ├─ globals.css
│  │  ├─ guide
│  │  │  ├─ guide.tsx
│  │  │  ├─ loading.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ [guide_name]
│  │  │     ├─ guide-name.tsx
│  │  │     ├─ loading.tsx
│  │  │     └─ page.tsx
│  │  ├─ icon.ico
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  ├─ project-detail
│  │  │  ├─ loading.tsx
│  │  │  ├─ page.tsx
│  │  │  ├─ project-detail.tsx
│  │  │  └─ [id]
│  │  │     ├─ loading.tsx
│  │  │     ├─ page.tsx
│  │  │     └─ project-detail-by-id.tsx
│  │  └─ robots.ts
│  ├─ components
│  │  ├─ community
│  │  │  └─ diy-card.tsx
│  │  ├─ custom-markdown.tsx
│  │  ├─ footer.tsx
│  │  ├─ generate
│  │  │  ├─ budget-filter.tsx
│  │  │  ├─ category-filter.tsx
│  │  │  ├─ difficulty-filter.tsx
│  │  │  ├─ generate-loading.tsx
│  │  │  ├─ material-input.tsx
│  │  │  ├─ project-tabs.tsx
│  │  │  ├─ purpose-filter.tsx
│  │  │  ├─ safety-check.tsx
│  │  │  ├─ time-availability-filter.tsx
│  │  │  └─ tools-available-input.tsx
│  │  ├─ navbar.tsx
│  │  ├─ page-loader.tsx
│  │  ├─ project-detail
│  │  │  ├─ project-image.tsx
│  │  │  ├─ project-info.tsx
│  │  │  ├─ project-step.tsx
│  │  │  └─ share-dialog.tsx
│  │  ├─ theme-provider.tsx
│  │  └─ ui
│  │     ├─ accordion.tsx
│  │     ├─ alert-dialog.tsx
│  │     ├─ alert.tsx
│  │     ├─ badge.tsx
│  │     ├─ button.tsx
│  │     ├─ card.tsx
│  │     ├─ checkbox.tsx
│  │     ├─ dialog.tsx
│  │     ├─ input.tsx
│  │     ├─ label.tsx
│  │     ├─ select.tsx
│  │     ├─ separator.tsx
│  │     ├─ skeleton.tsx
│  │     ├─ tabs.tsx
│  │     ├─ toast.tsx
│  │     ├─ toaster.tsx
│  │     ├─ tooltip.tsx
│  │     └─ use-toast.ts
│  ├─ components.json
│  ├─ constants
│  │  └─ index.ts
│  ├─ context
│  │  └─ currencyContext.tsx
│  ├─ hooks
│  │  ├─ useClipboard.ts
│  │  └─ useInterval.ts
│  ├─ interfaces
│  │  └─ index.ts
│  ├─ lib
│  │  ├─ index.ts
│  │  └─ utils.ts
│  ├─ next-env.d.ts
│  ├─ next.config.js
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ android-chrome-192x192.png
│  │  ├─ android-chrome-512x512.png
│  │  ├─ apple-touch-icon.png
│  │  ├─ favicon-16x16.png
│  │  └─ favicon-32x32.png
│  ├─ README.md
│  ├─ tailwind.config.ts
│  └─ tsconfig.json
├─ package.json
├─ README.md
└─ server
   ├─ .dockerignore
   ├─ .eslintrc.json
   ├─ .gitattributes
   ├─ .gitignore
   ├─ .lintstagedrc.json
   ├─ docker-compose.dev.yml
   ├─ docker-compose.yml
   ├─ docker-dev.sh
   ├─ Dockerfile
   ├─ Dockerfile.dev
   ├─ jest.config.ts
   ├─ nodemon.json
   ├─ package.json
   ├─ prisma
   │  ├─ schema.prisma
   │  └─ seed.ts
   ├─ README.md
   ├─ src
   │  ├─ controllers
   │  │  ├─ community.controller.ts
   │  │  ├─ counter.controller.ts
   │  │  ├─ guide.controller.ts
   │  │  ├─ openai.controller.ts
   │  │  ├─ share.controller.ts
   │  │  └─ unsplash.controller.ts
   │  ├─ index.ts
   │  ├─ middleware
   │  │  ├─ cache-response.ts
   │  │  ├─ error-handler.ts
   │  │  ├─ request-limit.ts
   │  │  └─ schema-validate.ts
   │  ├─ routes
   │  │  ├─ community.routes.ts
   │  │  ├─ counter.routes.ts
   │  │  ├─ guide.routes.ts
   │  │  ├─ index.routes.ts
   │  │  ├─ openai.routes.ts
   │  │  ├─ share.routes.ts
   │  │  └─ unsplash.routes.ts
   │  ├─ schema
   │  │  ├─ community.schema.ts
   │  │  ├─ guide.schema.ts
   │  │  ├─ openai.schema.ts
   │  │  ├─ share.schema.ts
   │  │  └─ unsplash.schema.ts
   │  ├─ server.ts
   │  └─ utils
   │     ├─ index.ts
   │     └─ response-template.ts
   └─ tsconfig.json

```

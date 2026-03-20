import type { PostArgs } from './post-1'

export const post4 = ({
  heroImage,
  blockImage,
  author,
}: PostArgs): any => {
  return {
    slug: 'managing-multiple-tech-stacks-with-coolify',
    _status: 'published',
    authors: [author],
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'A conversation with YARQA on how Coolify brings order to the chaos of running Node.js, Python, Go, and more — all on a single self-hosted server.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'block',
            fields: {
              blockName: 'Disclaimer',
              blockType: 'banner',
              content: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          type: 'text',
                          detail: 0,
                          format: 1,
                          mode: 'normal',
                          style: '',
                          text: 'Disclaimer:',
                          version: 1,
                        },
                        {
                          type: 'text',
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: ' This content is fabricated and for demonstration purposes only. To edit this post, ',
                          version: 1,
                        },
                        {
                          type: 'link',
                          children: [
                            {
                              type: 'text',
                              detail: 0,
                              format: 0,
                              mode: 'normal',
                              style: '',
                              text: 'navigate to the admin dashboard',
                              version: 1,
                            },
                          ],
                          direction: 'ltr',
                          fields: {
                            linkType: 'custom',
                            newTab: true,
                            url: '/admin',
                          },
                          format: '',
                          indent: 0,
                          version: 3,
                        },
                        {
                          type: 'text',
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: '.',
                          version: 1,
                        },
                      ],
                      direction: 'ltr',
                      format: '',
                      indent: 0,
                      textFormat: 0,
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  version: 1,
                },
              },
              style: 'info',
            },
            format: '',
            version: 2,
          },
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'What is Coolify and Why Should You Care?',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 2,
                mode: 'normal',
                style: '',
                text: 'Me:',
                version: 1,
              },
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: ' YARQA, I keep hearing about Coolify. What exactly is it, and why is everyone in the self-hosting community talking about it?',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 2,
                mode: 'normal',
                style: '',
                text: 'YARQA:',
                version: 1,
              },
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: ' Great question. Coolify is an open-source, self-hostable platform-as-a-service (PaaS) — think Heroku or Render, but running entirely on your own infrastructure. It gives you a beautiful web UI to deploy, manage, and monitor applications and databases across one or more servers. The real power? It handles Docker Compose, Dockerfile, and Nixpacks-based deployments out of the box, meaning you can deploy virtually any tech stack without managing containers by hand.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'The Multi-Stack Problem',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 2,
                mode: 'normal',
                style: '',
                text: 'Me:',
                version: 1,
              },
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: " My situation is a bit messy. I'm running a Next.js blog, a FastAPI backend for a ML project, and a Go microservice — all on the same VPS. Managing them manually is a nightmare. Does Coolify actually help with that?",
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 2,
                mode: 'normal',
                style: '',
                text: 'YARQA:',
                version: 1,
              },
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: " That's exactly the use case Coolify was built for. Each application lives in its own isolated project inside Coolify, with its own environment variables, domains, and deployment pipeline. You connect your Git repositories, Coolify auto-detects the stack (or you tell it explicitly), and from that point on, every push to your main branch triggers an automatic redeploy. Your Next.js app, FastAPI service, and Go binary all coexist cleanly — no port conflicts, no shared process managers to babysit.",
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'block',
            fields: {
              blockName: 'Example Docker Compose for a Multi-Stack Setup',
              blockType: 'code',
              code: `# coolify-managed docker-compose.yml example
# Coolify generates and manages this per-service — shown here for illustration

version: '3.8'

services:
  nextjs-blog:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - DATABASE_URL=\${DATABASE_URL}
    labels:
      - "coolify.managed=true"
      - "traefik.enable=true"
      - "traefik.http.routers.blog.rule=Host(\`blog.yourdomain.com\`)"

  fastapi-ml:
    image: python:3.11-slim
    build:
      context: ./ml-service
    environment:
      - MODEL_PATH=/app/models
      - API_KEY=\${ML_API_KEY}
    labels:
      - "coolify.managed=true"
      - "traefik.http.routers.ml.rule=Host(\`api.yourdomain.com\`)"

  go-microservice:
    build:
      context: ./go-service
    environment:
      - PORT=8080
      - DB_HOST=\${DB_HOST}
    labels:
      - "coolify.managed=true"
      - "traefik.http.routers.go.rule=Host(\`svc.yourdomain.com\`)"`,
              language: 'yaml',
            },
            format: '',
            version: 2,
          },
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Reverse Proxy and SSL — Out of the Box',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 2,
                mode: 'normal',
                style: '',
                text: 'Me:',
                version: 1,
              },
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: " What about HTTPS? I've been manually managing nginx configs and Let's Encrypt renewals. That's been painful.",
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 2,
                mode: 'normal',
                style: '',
                text: 'YARQA:',
                version: 1,
              },
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: " That pain goes away entirely. Coolify ships with Traefik as its built-in reverse proxy and automatically provisions and renews Let's Encrypt certificates for every domain you assign to an application. You type in your domain in the UI, point your DNS, and Coolify handles the rest — HTTPS, HTTP-to-HTTPS redirects, certificate rotation. No more editing nginx.conf at 2 AM.",
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'block',
            fields: {
              blockName: '',
              blockType: 'mediaBlock',
              media: blockImage.id,
            },
            format: '',
            version: 2,
          },
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Managing Databases Alongside Your Apps',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 2,
                mode: 'normal',
                style: '',
                text: 'Me:',
                version: 1,
              },
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: ' Each of my services needs its own database — PostgreSQL for the blog, Redis for the ML job queue, and MongoDB for the Go service. Is that manageable inside Coolify?',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 2,
                mode: 'normal',
                style: '',
                text: 'YARQA:',
                version: 1,
              },
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: ' Absolutely. Coolify has a dedicated "Databases" section where you can spin up PostgreSQL, MySQL, MariaDB, MongoDB, Redis, or KeyDB with a single click. Each database gets its own credentials, and Coolify injects the connection string directly into your application\'s environment variables. You can also schedule automated backups to S3-compatible storage. For your specific setup, you\'d have three database entries in the UI, each scoped to the project that needs it.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Zero-Downtime Deployments and Rollbacks',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 2,
                mode: 'normal',
                style: '',
                text: 'Me:',
                version: 1,
              },
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: ' Production deployments scare me. I once accidentally took down the blog for an hour because a bad build went live. Does Coolify have any guard rails?',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 2,
                mode: 'normal',
                style: '',
                text: 'YARQA:',
                version: 1,
              },
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: " Yes — Coolify keeps a full deployment history for every application. If a new build goes sideways, you can roll back to any previous deployment with one click directly from the dashboard. For rolling updates, Coolify waits for the new container to pass its health check before routing traffic to it, so your old container stays live until the new one is confirmed healthy. That's zero-downtime deployments without any complex Kubernetes machinery.",
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Getting Started: Installing Coolify on Your VPS',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 2,
                mode: 'normal',
                style: '',
                text: 'Me:',
                version: 1,
              },
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: " I'm sold. What does the installation actually look like?",
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 2,
                mode: 'normal',
                style: '',
                text: 'YARQA:',
                version: 1,
              },
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: " It's a single curl command on any fresh Debian/Ubuntu VPS with at least 2 GB of RAM. Coolify installs Docker, sets up Traefik, and launches the dashboard — the whole thing takes under five minutes.",
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'block',
            fields: {
              blockName: 'Coolify Installation',
              blockType: 'code',
              code: `# Install Coolify on a fresh VPS (Debian/Ubuntu)
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

# After installation, access the dashboard at:
# http://YOUR_SERVER_IP:8000

# Optional: point a domain to your server IP, then configure
# Coolify to use it via Settings > Instance Domain`,
              language: 'bash',
            },
            format: '',
            version: 2,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Once the dashboard is up, you add your server under "Servers", connect your Git provider (GitHub, GitLab, Gitea, or Bitbucket) under "Sources", and then create a new Project for each of your applications. From there the workflow is: create application → select repository → set environment variables → deploy. Coolify watches your branch for new commits and redeploys automatically.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Final Thoughts',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Managing multiple tech stacks on a single VPS no longer has to mean a tangle of shell scripts, cron jobs, and manual nginx edits. Coolify gives you a coherent control plane for every application and database you run — regardless of whether it is written in JavaScript, Python, Go, or anything else that can be containerized. The self-hosted model keeps your data and costs entirely under your control, while the polished UI means you spend less time on DevOps and more time shipping features.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'block',
            fields: {
              blockName: 'Dynamic Components',
              blockType: 'banner',
              content: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          type: 'text',
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: "This content above is completely dynamic using custom layout building blocks configured in the CMS. This can be anything you'd like from rich text and images, to highly designed, complex components.",
                          version: 1,
                        },
                      ],
                      direction: 'ltr',
                      format: '',
                      indent: 0,
                      textFormat: 0,
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  version: 1,
                },
              },
              style: 'info',
            },
            format: '',
            version: 2,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    heroImage: heroImage.id,
    meta: {
      description:
        'A conversation with YARQA on how Coolify brings order to the chaos of running Node.js, Python, Go, and more — all on a single self-hosted server.',
      image: heroImage.id,
      title: 'Managing Multiple Tech Stacks with Coolify',
    },
    relatedPosts: [], // this is populated by the seed script
    title: 'Managing Multiple Tech Stacks with Coolify',
  }
}

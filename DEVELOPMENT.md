# SAO Global Travel - Development Setup

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check

# Lint code
npm run lint

# Format code
npm run format
```

## Environment Setup

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

## Project Structure

```
src/
├── routes/          # File-based routing (TanStack Router)
├── components/      # React components
├── lib/             # Utility functions
├── hooks/           # Custom React hooks
├── integrations/    # External integrations (Supabase, etc.)
├── server.ts        # SSR entry point
├── start.ts         # TanStack Start configuration
└── styles.css       # Global styles & design tokens
```

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Routing**: TanStack Router with file-based routing
- **CSS**: Tailwind CSS v4 with custom design system
- **Build**: Vite 8 + TanStack Start
- **Backend**: Supabase (PostgreSQL)
- **Component Library**: shadcn/ui components
- **Validation**: Zod

## Design System

Colors defined in `src/styles.css` using OKLCH format:
- Navy: `--sao-navy`
- Gold: `--sao-gold`
- Ivory: `--sao-ivory`
- Red: `--sao-red`

## CI/CD Pipeline

GitHub Actions workflow runs on push to `main`:
1. Checkout code
2. Setup Node.js (v20, v22)
3. Install dependencies
4. Type check
5. Lint code
6. Build project
7. Verify output

## Deployment

Connected to Vercel for automatic deployments. Push to `main` branch to deploy.

Also connected to Lovable for visual development at https://lovable.dev

## Performance Tips

- Videos in components are local (assets/), not external URLs
- Scroll-driven animations use `requestAnimationFrame`
- Images are optimized with `width` and `height` attributes
- Reduced-motion respects browser preferences
- Mobile animations simplified for better performance

## Troubleshooting

### npm install fails
```bash
npm install --legacy-peer-deps
```

### Build fails with missing types
```bash
npm run type-check
```

### Port already in use
```bash
npm run dev -- --port 3001
```

### Clear cache
```bash
rm -rf node_modules .next dist .output
npm install
```

## Resources

- [TanStack Start Docs](https://tanstack.com/start)
- [TanStack Router Docs](https://tanstack.com/router)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Supabase Docs](https://supabase.com/docs)
- [Vite Docs](https://vitejs.dev)

## Support

For issues, check the GitHub repository issues or contact the development team.

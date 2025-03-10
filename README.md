# HeartGuard AI

A heart disease prediction application built with React, TypeScript, and a custom backend.

## Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)
- Visual Studio Code
- Git (optional, for version control)

## Local Development Setup

1. Clone or download the project files to your local machine.

2. Open the project in Visual Studio Code:
   ```bash
   code .
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory with your backend API configuration:
   ```env
   VITE_API_URL=your_backend_api_url
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5173`

## Recommended VS Code Extensions

For the best development experience, install these VS Code extensions:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/     # React components
├── pages/         # Page components
├── stores/        # Zustand stores
├── types/         # TypeScript types
├── utils/         # Utility functions
└── lib/           # Library configurations
```

## Backend Integration

The application is designed to work with a custom backend API. The frontend uses mock data for demonstration purposes, but you can replace it with your own backend implementation.

To integrate your backend:

1. Update the API client configuration in `src/lib/supabase.ts` (this file is now a placeholder for your custom implementation)
2. Replace mock API calls in the components with actual API calls to your backend
3. Update the authentication flow to work with your backend authentication system

## Features

- User authentication (sign up, sign in, profile management)
- Heart disease risk prediction based on medical parameters
- Dashboard with statistics and visualization
- Admin panel for user management
- Responsive design for all devices

## Environment Variables

The project uses these environment variables:

- `VITE_API_URL` - Your backend API URL
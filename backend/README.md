# Backend Service

This is the backend service for the RTM application, built with Node.js and TypeScript.

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files and environment variables
│   ├── constants/      # Application-wide constants
│   ├── controllers/    # Request handlers and business logic
│   ├── decorators/     # TypeScript decorators for routes and middleware
│   ├── functions/      # Reusable utility functions
│   ├── middleware/     # Express middleware
│   ├── models/         # Database models and schemas
│   ├── modules/        # Feature modules
│   ├── services/       # Business logic and external service integrations
│   ├── shared/         # Shared utilities and types
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Helper utilities
│   ├── validators/     # Request validation schemas
│   └── index.ts        # Application entry point
├── test/               # Test files
├── build/              # Compiled JavaScript output
├── .env                # Environment variables
├── .env.example        # Example environment variables
├── tsconfig.json       # TypeScript configuration
├── package.json        # Project dependencies and scripts
└── Dockerfile          # Docker configuration
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- TypeScript (installed as a dev dependency)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Copy `.env.example` to `.env` and update the environment variables:
   ```bash
   cp .env.example .env
   ```

### Development

1. After making changes to the source code (especially when adding new endpoints), compile TypeScript to JavaScript:
   ```bash
   npx tsc
   ```

2. Start the development server:
   ```bash
   node build/index.js
   ```

   The server will be available at `http://localhost:3500` by default (port may vary based on your configuration).

### Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

This will compile TypeScript files to the `build` directory.

## Scripts

- `npm run dev` - Start the development server with auto-reload
- `npm run build` - Build the application
- `npm start` - Start the production server
- `npm test` - Run tests
- `npm run lint` - Lint the codebase
- `npm run format` - Format the code using Prettier

## Docker

To run the application using Docker:

```bash
docker build -t rtm-backend .
docker run -p 3000:3000 rtm-backend
```

## Contributing

1. Create a new branch for your feature or bugfix
2. Make your changes
3. Run tests and ensure they pass
4. Submit a pull request

## License

This project is proprietary and confidential.

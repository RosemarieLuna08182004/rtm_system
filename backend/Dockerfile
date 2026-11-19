# Backend API image. Build: docker build -t rtm-backend .   Run: docker run -p 8081:8081 --env-file .env rtm-backend
FROM node:20-slim

WORKDIR /app

# Install all dependencies (TypeScript is needed to compile), then build
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build:production

# Hosts such as Render set PORT themselves; this is the default for local runs
ENV NODE_ENV=production
ENV PORT=8081
EXPOSE 8081

CMD ["node", "build/index.js"]

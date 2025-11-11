# frontend/Dockerfile
# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder
WORKDIR /app

ARG VITE_API_BASE_URL=http://backend:8080/api/v1
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- RUNTIME STAGE ----------
FROM nginx:stable-alpine
# Remove default nginx index if present (optional)
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

# expose port 80 (nginx)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

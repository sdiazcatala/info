Set-Content -Path "Dockerfile" -Value @"
FROM docker.m.daocloud.io/node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM docker.m.daocloud.io/nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
"@

Write-Host "✅ Dockerfile actualizado correctamente con mirrors."
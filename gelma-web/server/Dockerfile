# ============================================
# Dockerfile para Backend GELMA
# ============================================
# Imagen base de Node.js (LTS)
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json primero (para caché de Docker)
COPY package*.json ./

# Instalar dependencias
# --production=false instala también devDependencies (nodemon)
RUN npm ci --production=false

# Copiar el resto del código
COPY . .

# Crear directorio para logs si es necesario
RUN mkdir -p logs

# Exponer puerto del backend
EXPOSE 5000

# Variables de entorno por defecto (pueden ser sobreescritas)
ENV NODE_ENV=development
ENV PORT=5000

# Comando para iniciar en desarrollo con nodemon
# nodemon reinicia automáticamente cuando hay cambios
CMD ["npm", "run", "dev"]

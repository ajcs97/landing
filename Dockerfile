# Etapa 1: Construcción
FROM node:20-alpine AS builder

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos
COPY package*.json ./
# COPY vite.config.* ./
# COPY tsconfig.* ./
# COPY src ./src
# COPY public ./public
COPY . .
# Instalar dependencias
RUN npm install

# Construir la aplicación
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:stable-alpine

# Elimina la configuración por defecto de nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar archivos construidos desde la etapa anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx si la tienes
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]


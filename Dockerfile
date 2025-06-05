# # Etapa 1: Construcción
# FROM node:20-alpine AS builder
#
# # Crear directorio de trabajo
# WORKDIR /app
#
# # Copiar archivos
# COPY package*.json ./
# COPY . .
# # Instalar dependencias
# RUN npm install  && npm run build
#
#
# # Etapa 2: Servir con Nginx
# FROM nginx:stable-alpine
#
# # Elimina la configuración por defecto de nginx
# RUN rm -rf /usr/share/nginx/html/*
#
# # Copiar la landing page estática a Nginx
# COPY landing /usr/share/nginx/html/landing
#
# # Copiar archivos construidos desde la etapa anterior
# COPY --from=builder /app/dist /usr/share/nginx/html/react-app
#
# # Copiar configuración personalizada de nginx si la tienes
# COPY nginx.conf /etc/nginx/conf.d/default.conf
#
# # Exponer el puerto 80
# EXPOSE 80
#
# # Comando por defecto
# CMD ["nginx", "-g", "daemon off;"]


# Etapa 1: Construcción
FROM node:18-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos necesarios
COPY package*.json ./
COPY . .
# Instalar dependencias sin --legacy-peer-deps
RUN npm install

# Build en modo desarrollo para evitar diferencias de comportamiento
RUN npm run build 

# Etapa 2: Servir con Nginx
FROM nginx:stable-alpine

# Eliminar contenido por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copiar contenido estático (landing)
COPY landing /usr/share/nginx/html/landing

# Copiar build de React
COPY --from=builder /app/dist /usr/share/nginx/html/react-app

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]


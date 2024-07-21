# Dockerfile para la construcción de la imagen de producción de la aplicación Angular

# Etapa de construcción
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Etapa de producción
FROM nginx:alpine
COPY --from=builder /app/docs/browser /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf
RUN mkdir -p /var/cache/nginx/client_temp
RUN chown -R nginx:nginx /var/cache/nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

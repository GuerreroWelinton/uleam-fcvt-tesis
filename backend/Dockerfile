# Dockerfile para la construcción de la imagen de la API REST
# Etapa de construcción
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de producción
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist /app
COPY package*.json ./
RUN npm install --production
EXPOSE 3000
CMD ["node", "app.js"]

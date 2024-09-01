# Usa una imagen base de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install --production

# Copia el resto de los archivos
COPY . .

# Compila el código de TypeScript
RUN npm run build

# Expone el puerto en el que corre la app
EXPOSE 3045

# Comando para ejecutar la app
CMD ["npm", "run", "start:prod"]
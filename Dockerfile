# Usamos la imagen oficial de Playwright que ya tiene Chromium
FROM mcr.microsoft.com/playwright:v1.42.0-jammy

WORKDIR /app

# Inicializar proyecto e instalar Express
RUN npm init -y && npm install express

# Instalar Dembrandt globalmente
RUN npm install -g dembrandt

# Copiar el código del servidor
COPY server.js .

EXPOSE 6000

CMD ["node", "server.js"]
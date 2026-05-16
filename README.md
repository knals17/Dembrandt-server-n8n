# Dembrandt Server para N8N

Template Docker para Portainer para extraer System Design de sitios web existentes, diseñado para integrarse con flujos de trabajo de N8N.

## Descripcion

Este proyecto es un servidor API Express.js que envuelve el paquete npm [Dembrandt](https://www.npmjs.com/package/dembrandt) para realizar web scraping y extraer datos estructurados en JSON. Diseñado especificamente para funcionar como un contenedor Docker que puede ser desplegado facilmente desde Portainer y consumido por automatizaciones de N8N.

## Caracteristicas

- Extraccion de datos de sitios web mediante web scraping con Dembrandt
- API REST simple con un solo endpoint
- Contenedor Docker listo para desplegar en Portainer
- Integracion directa con N8N mediante llamadas HTTP
- Soporte para Chromium (incluido en la imagen base de Playwright)
- Limpieza automatica de archivos temporales entre extracciones

## Requisitos Previos

- Docker instalado
- Portainer (opcional, para gestion visual de contenedores)
- N8N (para automatizaciones)

## Instalacion y Ejecucion

### Metodo 1: Docker Compose

```bash
# Clonar el repositorio
git clone https://github.com/knals17/Dembrandt-server-n8n.git
cd Dembrandt-server-n8n

# Ejecutar con Docker Compose
docker-compose up --build
```

### Metodo 2: Portainer

1. En Portainer, crear un nuevo Stack o servicio
2. Usar el contenido del archivo `docker-compose.yml`
3. Desplegar el stack

### Metodo 3: Docker Directo

```bash
# Construir la imagen
docker build -t dembrandt-api .

# Ejecutar el contenedor
docker run -d -p 6000:6000 --name dembrandt_api dembrandt-api
```

## Uso de la API

### Endpoint: Extraer datos de una URL

**URL:** `http://localhost:6000/extract`

**Metodo:** `POST`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "url": "https://sitio-web-ejemplo.com"
}
```

**Respuesta exitosa (200):**
```json
{
  "// datos extraidos por Dembrandt en formato JSON"
}
```

**Respuesta de error (400):**
```json
{
  "error": "La URL es requerida"
}
```

**Respuesta de error (500):**
```json
{
  "error": "Error al procesar la URL"
}
```

## Variables de Entorno

| Variable | Descripcion | Valor por defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto donde corre el servidor | `6000` |

## Ejemplo con curl

```bash
curl -X POST http://localhost:6000/extract \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

## Integracion con N8N

Para usar este servicio en un workflow de N8N:

1. Agregar un nodo **"HTTP Request"** en tu workflow
2. Configurar el nodo:
   - **Metodo:** POST
   - **URL:** `http://dembrandt_api:6000/extract` (o `http://localhost:6000/extract` si esta fuera de Docker)
   - **Body Content Type:** JSON
   - **Body:** `{"url": "https://sitio-a-extraer.com"}`
3. Conectar el nodo a tus siguientes pasos en el workflow

## Estructura del Proyecto

```
Dembrandt-server-n8n/
├── server.js           # Servidor Express con el endpoint /extract
├── Dockerfile          # Definicion de la imagen Docker
├── docker-compose.yml  # Configuracion de Docker Compose
└── README.md           # Este archivo
```

## Tecnologia

- **Runtime:** Node.js
- **Framework:** Express.js
- **Web Scraping:** Dembrandt + Playwright (Chromium)
- **Contenedor:** Docker

## Licencia

MIT
const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const execPromise = promisify(exec);

const app = express();
app.use(express.json());

app.post('/extract', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'La URL es requerida' });

    console.log(`Iniciando extracción para: ${url}`);
    const outputDir = path.join(__dirname, 'output');

    try {
        // 1. Limpiar ejecuciones anteriores
        if (fs.existsSync(outputDir)) {
            fs.rmSync(outputDir, { recursive: true, force: true });
        }

        // 2. Ejecutar Dembrandt
        await execPromise(`npx dembrandt "${url}" --save-output --slow`);

        // 3. Buscar el archivo JSON recursivamente en la carpeta output
        const findJsonFile = (dir) => {
            if (!fs.existsSync(dir)) return null;
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const fullPath = path.join(dir, file);
                if (fs.statSync(fullPath).isDirectory()) {
                    const found = findJsonFile(fullPath);
                    if (found) return found;
                } else if (file.endsWith('.json')) {
                    return fullPath;
                }
            }
            return null;
        };

        const jsonPath = findJsonFile(outputDir);
        if (!jsonPath) throw new Error('Dembrandt no generó ningún archivo JSON');

        // 4. Leer y devolver el JSON
        const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        res.json(jsonData);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message || 'Error al procesar la URL' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Dembrandt API corriendo en el puerto ${PORT}`));

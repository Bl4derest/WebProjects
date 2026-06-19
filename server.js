const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// Compatible con Replit, Render y ejecución local
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Subir podcast
app.post("/upload", upload.single("podcast"), (req, res) => {
    res.json({
        message: "Podcast subido correctamente"
    });
});

// Obtener lista de podcasts
app.get("/podcasts", (req, res) => {
    fs.readdir("./uploads", (err, files) => {
        if (err) {
            return res.status(500).json({
                error: "Error al leer los podcasts"
            });
        }

        const podcasts = files.map(file => ({
            name: file,
            url: `/uploads/${file}`
        }));

        res.json(podcasts);
    });
});

// Eliminar podcast
app.delete("/podcasts/:name", (req, res) => {
    const filePath = path.join(
        __dirname,
        "uploads",
        req.params.name
    );

    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).json({
                error: "No se pudo eliminar el podcast"
            });
        }

        res.json({
            message: "Podcast eliminado"
        });
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
});
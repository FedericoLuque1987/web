import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import Reserva from './models/Reserva.js';
import { leerReservas, guardarReservas } from './services/reservasService.js';
import { requiereAutenticacion } from './middlewares/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'mi_clave_secreta',
    resave: false,
    saveUninitialized: false
}));
const PORT = 3000;

const rutaPublic = path.join(__dirname, '../public');
const rutaViews = path.join(__dirname, 'views');

app.use(express.static(rutaPublic));

console.log("Carpeta estática registrada:", rutaPublic);

app.get('/saludo', (req, res) => {
    res.send('Hola desde el servidor Express');
});

app.post("/login", (req, res) => {
    const usuarioCorrecto = "profe@example.com";
    const passwordCorrecta = "1234";

    const usuarioCorrecto1 = "fede@fede.com";
    const passwordCorrecta1 = "321";

    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        res.send("Faltan datos en el formulario.");
        return;
    }

    if (email === usuarioCorrecto && password === passwordCorrecta) {
        req.session.autenticado = true;
        req.session.usuario = email;
        res.send("Bienvenido, has iniciado sesión correctamente.");
        return;
    }

    if (email === usuarioCorrecto1 && password === passwordCorrecta1) {
        req.session.autenticado = true;
        req.session.usuario = email;
        res.send("Bienvenido Federico, has iniciado sesión correctamente.");
        return;
    }

    if (email !== usuarioCorrecto && password === passwordCorrecta) {
        res.send("Usuario incorrecto.");
    } else if (email === usuarioCorrecto && password !== passwordCorrecta) {
        res.send("Contraseña incorrecta.");
    } else {
        res.send("Usuario y contraseña incorrectos.");
    }
});

app.get('/reserva', requiereAutenticacion, (req, res) => {
    res.sendFile(path.join(rutaViews, 'reserva.html'));
});

app.post('/reserva', requiereAutenticacion, (req, res) => {
    const { fechaClase, tipoClase, asistentes } = req.body;

    if (!fechaClase || !tipoClase || !asistentes) {
        res.send("Faltan datos obligatorios en la reserva.");
        return;
    }

    if (Number(asistentes) <= 0) {
        res.send("El número de asistentes debe ser mayor que cero.");
        return;
    }

    if (Number(tipoClase) == 0) {
        res.send("Debes seleccionar una clase válida.");
        return;
    }

    const nuevaReserva = new Reserva(
        fechaClase,
        tipoClase,
        Number(asistentes),
        Number(tipoClase) * Number(asistentes)
    );

    const reservas = leerReservas();
    reservas.push(nuevaReserva);

    guardarReservas(reservas, (error) => {
        if (error) {
            res.send('Error al guardar la reserva.');
        } else {
            res.sendFile(path.join(rutaPublic, 'resumen.html'));
        }
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).send('Error al cerrar la sesión');
        }
        res.send('Sesión cerrada correctamente');
    });
});

app.use((req, res) => {
    res.status(404).send('Error 404: página no encontrada');
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

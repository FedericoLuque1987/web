export function requiereAutenticacion(req, res, next) {
    if (!req.session.autenticado) {
        return res.status(401).send('Acceso no autorizado');
    }
    next();
}

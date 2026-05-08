class Reserva {
    constructor(fecha, tipo, unidades, precio, usuario) {
        this.fecha = fecha;
        this.tipo = tipo;
        this.unidades = Number(unidades);
        this.precio = Number(precio);
        this.usuario = usuario;
    }
}

export default Reserva;

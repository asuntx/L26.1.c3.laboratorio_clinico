export default class Cl_mExamen {
    _tabla = "examen";
    _id = "";
    _estudios = [];
    _nombrePaciente;
    _cedulaPaciente;
    _whatsappPaciente;
    _estado;
    _metodoPago;
    _monto;
    _fecha;
    constructor({ id = "", nombrePaciente, cedulaPaciente, whatsappPaciente, estado, monto, metodoPago, fecha, }) {
        this._id = id;
        this._nombrePaciente = nombrePaciente;
        this._cedulaPaciente = cedulaPaciente;
        this._whatsappPaciente = whatsappPaciente;
        this._estado = estado;
        this._monto = monto;
        this._metodoPago = metodoPago;
        this._fecha = fecha;
    }
    get id() {
        return this._id;
    }
    set id(id) {
        this._id = id;
    }
    set nombrePaciente(v) {
        this._nombrePaciente = v;
    }
    get nombrePaciente() {
        return this._nombrePaciente;
    }
    set cedulaPaciente(v) {
        this._cedulaPaciente = v;
    }
    get cedulaPaciente() {
        return this._cedulaPaciente;
    }
    set whatsappPaciente(v) {
        this._whatsappPaciente = v;
    }
    get whatsappPaciente() {
        return this._whatsappPaciente;
    }
    set estado(v) {
        this._estado = v;
    }
    get estado() {
        return this._estado;
    }
    set metodoPago(v) {
        this._metodoPago = v;
    }
    get metodoPago() {
        return this._metodoPago;
    }
    set monto(v) {
        this._monto = v;
    }
    get monto() {
        return this._monto;
    }
    set fecha(v) {
        this._fecha = v;
    }
    get fecha() {
        return this._fecha;
    }
    agregarEstudio(estudio) {
        this._estudios.push(estudio);
    }
    eliminarEstudio(id) {
        this._estudios = this._estudios.filter((e) => e.id !== id);
    }
    tieneEstudio(codigo) {
        return this._estudios.some((e) => e.codigo === codigo);
    }
    set estudios(estudios) {
        this._estudios = estudios;
    }
    get estudios() {
        return this._estudios;
    }
    calcularMonto() {
        this._monto = this._estudios.reduce((acc, est) => acc + (est.precio || 0), 0);
    }
    toJSON() {
        return {
            tabla: this._tabla,
            nombrePaciente: this._nombrePaciente,
            cedulaPaciente: this._cedulaPaciente,
            whatsappPaciente: this._whatsappPaciente,
            estado: this._estado,
            monto: this._monto,
            metodoPago: this._metodoPago,
            fecha: this._fecha,
            estudios: this._estudios,
        };
    }
}
//# sourceMappingURL=Cl_mExamen.js.map
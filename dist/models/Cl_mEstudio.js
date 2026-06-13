export default class Cl_mEstudio {
    _tabla = "estudio";
    _id = "";
    _examenId;
    _codigo;
    _nombre;
    _precio;
    _resultado;
    _valorReferencia;
    constructor({ id = "", examenId, codigo, nombre, precio, resultado, valorReferencia, }) {
        this._id = id;
        this._examenId = examenId;
        this._codigo = codigo;
        this._nombre = nombre;
        this._precio = precio;
        this._resultado = resultado;
        this._valorReferencia = valorReferencia;
    }
    get id() {
        return this._id;
    }
    get examenId() {
        return this._examenId;
    }
    set examenId(value) {
        this._examenId = value;
    }
    get codigo() {
        return this._codigo;
    }
    set codigo(value) {
        this._codigo = value;
    }
    get nombre() {
        return this._nombre;
    }
    set nombre(value) {
        this._nombre = value;
    }
    get precio() {
        return this._precio;
    }
    set precio(value) {
        this._precio = value;
    }
    get resultado() {
        return this._resultado;
    }
    set resultado(value) {
        this._resultado = value;
    }
    get valorReferencia() {
        return this._valorReferencia;
    }
    set valorReferencia(value) {
        this._valorReferencia = value;
    }
    toJSON() {
        return {
            tabla: this._tabla,
            examenId: this._examenId,
            codigo: this._codigo,
            nombre: this._nombre,
            precio: this._precio,
            resultado: this._resultado,
            valorReferencia: this._valorReferencia,
        };
    }
}
//# sourceMappingURL=Cl_mEstudio.js.map
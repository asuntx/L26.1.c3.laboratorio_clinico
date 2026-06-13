export default class Cl_mEstudio {
  private _tabla: string = "estudio";
  private _id: string = "";
  private _examenId: string;
  private _codigo: string;
  private _nombre: string;
  private _precio: number;
  private _resultado: string;
  private _valorReferencia: string;
  constructor({
    id = "",
    examenId,
    codigo,
    nombre,
    precio,
    resultado,
    valorReferencia,
  }: {
    id?: string;
    examenId: string;
    codigo: string;
    nombre: string;
    precio: number;
    resultado: string;
    valorReferencia: string;
  }) {
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
  set examenId(value: string) {
    this._examenId = value;
  }

  get codigo() {
    return this._codigo;
  }
  set codigo(value: string) {
    this._codigo = value;
  }

  get nombre() {
    return this._nombre;
  }
  set nombre(value: string) {
    this._nombre = value;
  }

  get precio() {
    return this._precio;
  }
  set precio(value: number) {
    this._precio = value;
  }

  get resultado() {
    return this._resultado;
  }
  set resultado(value: string) {
    this._resultado = value;
  }

  get valorReferencia() {
    return this._valorReferencia;
  }

  set valorReferencia(value: string) {
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

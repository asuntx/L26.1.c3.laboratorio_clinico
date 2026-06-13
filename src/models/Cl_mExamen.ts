import Cl_mEstudio from "./Cl_mEstudio";

export default class Cl_mExamen {
  private _tabla: string = "examen";
  private _id: string = "";
  private _estudios: Cl_mEstudio[] = [];
  private _nombrePaciente: string;
  private _cedulaPaciente: string;
  private _whatsappPaciente: string;
  private _estado: "pendiente" | "listo";
  private _metodoPago: "efectivo" | "tarjeta" | "transferencia" | "pagoMovil";
  private _monto: number;
  private _fecha: Date;
  constructor({
    id = "",
    nombrePaciente,
    cedulaPaciente,
    whatsappPaciente,
    estado,
    monto,
    metodoPago,
    fecha,
  }: {
    id?: string;
    nombrePaciente: string;
    cedulaPaciente: string;
    whatsappPaciente: string;
    estado: "pendiente" | "listo";
    monto: number;
    metodoPago: "efectivo" | "tarjeta" | "transferencia" | "pagoMovil";
    fecha: Date;
  }) {
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
  set id(id: string) {
    this._id = id;
  }

  set nombrePaciente(v: string) {
    this._nombrePaciente = v;
  }
  get nombrePaciente() {
    return this._nombrePaciente;
  }
  set cedulaPaciente(v: string) {
    this._cedulaPaciente = v;
  }
  get cedulaPaciente() {
    return this._cedulaPaciente;
  }
  set whatsappPaciente(v: string) {
    this._whatsappPaciente = v;
  }
  get whatsappPaciente() {
    return this._whatsappPaciente;
  }
  set estado(v: "pendiente" | "listo") {
    this._estado = v;
  }
  get estado() {
    return this._estado;
  }
  set metodoPago(v: "efectivo" | "tarjeta" | "transferencia" | "pagoMovil") {
    this._metodoPago = v;
  }
  get metodoPago() {
    return this._metodoPago;
  }
  set monto(v: number) {
    this._monto = v;
  }
  get monto() {
    return this._monto;
  }
  set fecha(v: Date) {
    this._fecha = v;
  }
  get fecha() {
    return this._fecha;
  }
  agregarEstudio(estudio: Cl_mEstudio) {
    this._estudios.push(estudio);
  }

  eliminarEstudio(id: string) {
    this._estudios = this._estudios.filter((e) => e.id !== id);
  }

  tieneEstudio(codigo: string): boolean {
    return this._estudios.some((e) => e.codigo === codigo);
  }

  set estudios(estudios: Cl_mEstudio[]) {
    this._estudios = estudios;
  }

  get estudios() {
    return this._estudios;
  }

  calcularMonto() {
    this._monto = this._estudios.reduce(
      (acc, est) => acc + (est.precio || 0),
      0,
    );
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

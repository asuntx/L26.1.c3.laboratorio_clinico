export default class Cl_vExamen {
    ui;
    inNombrePaciente;
    inWhatsappPaciente;
    selEstado;
    inMonto;
    selMetodoPago;
    inFecha;
    btEnviar;
    btVolver;
    constructor() {
        this.ui = document.getElementById("examen");
        this.inNombrePaciente = document.getElementById("examen_inNombrePaciente");
        this.inWhatsappPaciente = document.getElementById("examen_inWhatsappPaciente");
        this.selEstado = document.getElementById("examen_selEstado");
        this.inMonto = document.getElementById("examen_inMonto");
        this.selMetodoPago = document.getElementById("examen_selMetodoPago");
        this.inFecha = document.getElementById("examen_inFecha");
        this.btEnviar = document.getElementById("examen_btEnviar");
        this.btVolver = document.getElementById("examen_btVolver");
    }
    get nombrePaciente() {
        return this.inNombrePaciente.value.trim();
    }
    get whatsappPaciente() {
        return this.inWhatsappPaciente.value.trim();
    }
    get estado() {
        return this.selEstado.value;
    }
    get monto() {
        return parseFloat(this.inMonto.value) || 0;
    }
    get metodoPago() {
        return this.selMetodoPago.value;
    }
    get fecha() {
        return new Date(this.inFecha.value);
    }
    onEnviar(callback) {
        this.btEnviar.onclick = callback;
    }
    onVolver(callback) {
        this.btVolver.onclick = callback;
    }
    mostrar() {
        this.ui.removeAttribute("hidden");
    }
    ocultar() {
        this.ui.setAttribute("hidden", "true");
    }
}
//# sourceMappingURL=Cl_vExamen.js.map
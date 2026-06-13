import Cl_mExamen from "../models/Cl_mExamen.js";
import Cl_mEstudio from "../models/Cl_mEstudio.js";
import Cl_sEstudio from "../services/Cl_sEstudio.js";
import Cl_sExamen from "../services/Cl_sExamen.js";
export default class Cl_cAnalista {
    modelo;
    vista;
    examenActual = null;
    estudiosActuales = [];
    constructor({ modelo, vista }) {
        this.modelo = modelo;
        this.vista = vista;
        this.vista.onSeleccionarExamen((examen) => this.onSeleccionarExamen(examen));
        this.vista.onFiltrar((filtro) => {
            this.vista.mostrarExamenes(this.modelo.filtrarExamenes(filtro));
        });
        this.vista.onGuardarResultado((estudioId, resultado) => this.onGuardarResultado(estudioId, resultado));
        this.vista.onEnviarWhatsApp(() => this.onEnviarWhatsApp());
        this.vista.onProcesar(() => this.onProcesar());
        this.vista.mostrar();
        this.cargarExamenes();
    }
    async cargarExamenes() {
        const resultado = await Cl_sExamen.getExamenes();
        if (!resultado.ok) {
            alert("Error: No se pudo conectar con el servidor");
            return;
        }
        const examenes = resultado.tabla.map((e) => new Cl_mExamen({
            id: e.id,
            nombrePaciente: e.nombrePaciente,
            cedulaPaciente: e.cedulaPaciente ?? "",
            whatsappPaciente: e.whatsappPaciente,
            estado: e.estado,
            monto: e.monto,
            metodoPago: e.metodoPago,
            fecha: new Date(e.fecha),
        }));
        this.modelo.examenes = examenes;
        this.vista.mostrarExamenes(this.modelo.filtrarExamenes("todos"));
    }
    async onSeleccionarExamen(examen) {
        this.examenActual = examen;
        // Carga los estudios desde el MockAPI usando el ID del examen
        const resultado = await Cl_sEstudio.getEstudios(examen.id);
        if (!resultado.ok) {
            alert("Error al cargar estudios");
            return;
        }
        this.estudiosActuales = resultado.tabla.map((e) => new Cl_mEstudio({
            id: e.id,
            examenId: e.examenId,
            codigo: e.codigo || "",
            nombre: e.nombre,
            precio: e.precio || 0,
            valorReferencia: e.valorReferencia,
            resultado: e.resultado ?? "",
        }));
        this.vista.mostrarEstudios(this.estudiosActuales, examen);
    }
    async onGuardarResultado(estudioId, resultado) {
        const res = await Cl_sEstudio.actualizarResultado(estudioId, resultado);
        alert(res.mensaje);
        if (res.ok && this.examenActual) {
            // Actualizar en el arreglo local para evaluar
            const index = this.estudiosActuales.findIndex(e => e.id === estudioId);
            if (index !== -1) {
                this.estudiosActuales[index].resultado = resultado;
            }
            this.onSeleccionarExamen(this.examenActual); // refresca tabla de estudios
            this.cargarExamenes(); // refresca tabla izquierda
        }
    }
    async onProcesar() {
        if (!this.examenActual) {
            alert("Seleccione un examen primero");
            return;
        }
        const todosListos = this.estudiosActuales.every(e => e.resultado && e.resultado.trim() !== "");
        if (!todosListos) {
            if (!confirm("Faltan resultados por ingresar. ¿Está seguro que desea procesar y finalizar el examen de todos modos?")) {
                return;
            }
        }
        if (this.examenActual.estado !== "listo") {
            await Cl_sExamen.actualizarExamen(this.examenActual.id, { estado: "listo" });
            this.examenActual.estado = "listo";
            alert("Examen procesado y marcado como listo.");
            this.onSeleccionarExamen(this.examenActual);
            this.cargarExamenes();
        }
        else {
            alert("El examen ya estaba procesado.");
        }
    }
    onEnviarWhatsApp() {
        if (!this.examenActual) {
            alert("Seleccione un examen primero");
            return;
        }
        const lineas = this.estudiosActuales.map((e) => `*${e.nombre}*: ${e.resultado || "pendiente"} (ref: ${e.valorReferencia})`);
        const mensaje = encodeURIComponent(`Hola ${this.examenActual.nombrePaciente}, sus resultados de laboratorio son:\n\n` +
            lineas.join("\n") +
            `\n\nGracias por confiar en nosotros.`);
        const numero = this.examenActual.whatsappPaciente.replace(/\D/g, "");
        window.open(`https://wa.me/${numero}?text=${mensaje}`, "_blank");
    }
}
//# sourceMappingURL=Cl_cAnalista.js.map
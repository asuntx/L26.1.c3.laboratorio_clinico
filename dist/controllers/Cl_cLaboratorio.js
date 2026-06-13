import Cl_mExamen from "../models/Cl_mExamen.js";
import Cl_sExamen from "../services/Cl_sExamen.js";
export default class Cl_cLaboratorio {
    modelo;
    vista;
    procesarCallback;
    constructor({ modelo, vista, procesarCallback, }) {
        this.modelo = modelo;
        this.vista = vista;
        this.procesarCallback = procesarCallback;
        this.vista.onProcesarExamen((examen) => this.onProcesarExamen(examen));
        this.vista.onFiltrar((filtro) => {
            this.vista.mostrarExamenes(this.modelo.filtrarExamenes(filtro));
        });
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
            id: e.id ?? "",
            nombrePaciente: e.nombrePaciente ?? "",
            whatsappPaciente: e.whatsappPaciente ?? "",
            estado: e.estado ?? "pendiente",
            monto: e.monto ?? 0,
            metodoPago: e.metodoPago ?? "efectivo",
            fecha: new Date(e.fecha),
        }));
        this.modelo.examenes = examenes;
        this.vista.mostrarExamenes(this.modelo.filtrarExamenes("todos"));
    }
    // No oculta la vista — en dashboard el panel izquierdo permanece visible
    onProcesarExamen(examen) {
        this.procesarCallback(examen);
    }
}
//# sourceMappingURL=Cl_cLaboratorio.js.map
import Cl_sEstudio from "../services/Cl_sEstudio.js";
import Cl_mEstudio, { ESTUDIOS_DISPONIBLES } from "../models/Cl_mEstudio.js";
import Cl_sExamen from "../services/Cl_sExamen.js";
export default class Cl_cEstudio {
    modelo;
    vista;
    volverCallback;
    constructor({ modelo, vista, volverCallback, }) {
        this.modelo = modelo;
        this.vista = vista;
        this.volverCallback = volverCallback;
        this.vista.onAgregar(() => this.onAgregar());
        this.vista.onEliminar(() => this.onEliminar());
        this.vista.onVolver(() => this.onVolver());
        // Mostrar info del paciente y cargar estudios
        this.vista.mostrarInfoExamen(modelo.nombrePaciente, modelo.whatsappPaciente);
        this.vista.mostrar();
        this.cargarEstudios();
    }
    async onAgregar() {
        const selName = this.vista.nombre;
        if (!selName) {
            alert("Seleccione un estudio");
            return;
        }
        const estDef = ESTUDIOS_DISPONIBLES.find(e => e.nombre === selName);
        if (!estDef) {
            alert("Estudio no encontrado en el catálogo");
            return;
        }
        const estudio = new Cl_mEstudio({
            examenId: this.modelo.id,
            nombre: estDef.nombre,
            unidad: estDef.unidad,
            rangoReferencia: estDef.rangoReferencia,
            precio: estDef.precio,
            resultado: "",
        });
        const res = await Cl_sEstudio.agregar(estudio);
        if (!res.ok) {
            alert(res.mensaje);
            return;
        }
        // Actualizar el monto del examen
        this.modelo.monto += estDef.precio;
        await Cl_sExamen.actualizarExamen(this.modelo.id, { monto: this.modelo.monto });
        this.vista.limpiarInputs();
        this.cargarEstudios();
    }
    async onEliminar() {
        const estudioId = this.vista.estudioId;
        if (!estudioId) {
            alert("Seleccione un estudio de la tabla");
            return;
        }
        // Buscar el estudio a eliminar para saber cuánto restar
        const estSeleccionado = this.estudiosActuales.find(e => e.id === estudioId);
        if (!confirm("¿Eliminar este estudio?"))
            return;
        const res = await Cl_sEstudio.eliminar(estudioId);
        if (!res.ok) {
            alert(res.mensaje);
            return;
        }
        if (estSeleccionado) {
            this.modelo.monto -= estSeleccionado.precio;
            if (this.modelo.monto < 0)
                this.modelo.monto = 0;
            await Cl_sExamen.actualizarExamen(this.modelo.id, { monto: this.modelo.monto });
        }
        this.vista.limpiarInputs();
        this.cargarEstudios();
    }
    onVolver() {
        this.vista.ocultar();
        this.volverCallback();
    }
    estudiosActuales = [];
    async cargarEstudios() {
        const res = await Cl_sEstudio.getEstudios(this.modelo.id);
        if (!res.ok) {
            alert("Error al cargar estudios");
            return;
        }
        this.estudiosActuales = res.tabla.map((e) => new Cl_mEstudio({ id: e.id, examenId: e.examenId, nombre: e.nombre, unidad: e.unidad, rangoReferencia: e.rangoReferencia, resultado: e.resultado ?? "", precio: e.precio ?? 0 }));
        // Renderizamos el monto actual en el panel (usando mostrarInfoExamen o similar)
        this.vista.mostrarInfoExamen(this.modelo.nombrePaciente, `${this.modelo.whatsappPaciente} — Total: Bs ${this.modelo.monto.toFixed(2)}`);
        this.vista.mostrarEstudiantes(this.estudiosActuales);
    }
}
//# sourceMappingURL=Cl_cEstudio.js.map
import Cl_mExamen from "../models/Cl_mExamen.js";
import Cl_mEstudio from "../models/Cl_mEstudio.js";
import Cl_sExamen from "../services/Cl_sExamen.js";
import Cl_sEstudio from "../services/Cl_sEstudio.js";
export default class Cl_cClinica {
    modelo;
    vista;
    examenActual = null;
    constructor({ modelo, vista, }) {
        this.modelo = modelo;
        this.vista = vista;
        this.vista.onFiltrar((filtro) => {
            this.vista.mostrarExamenes(this.modelo.filtrarExamenes(filtro));
        });
        this.vista.onBuscarPacientesPorEstudio((codigo) => this.onBuscarPacientesPorEstudio(codigo));
        this.vista.onVerEstudios((examen) => this.onVerEstudios(examen));
        this.vista.onGuardarExamen(() => this.onGuardarExamen());
        this.vista.onCancelarExamen(() => this.vista.ocultarPanelNuevoExamen());
        this.vista.onEliminarEstudio((id) => this.onEliminarEstudio(id));
        this.vista.onCerrarEstudios(() => {
            this.examenActual = null;
            this.vista.ocultarPanelEstudios();
        });
        this.vista.onAgregarEstudioCatalogo((est) => this.onAgregarEstudioCatalogo(est));
        this.vista.onEliminarEstudioCatalogo((id) => this.onEliminarEstudioCatalogo(id));
        this.cargarExamenes();
        this.cargarCatalogo();
    }
    async cargarCatalogo() {
        const res = await Cl_sEstudio.getDisponibles();
        if (res.ok) {
            this.vista.renderizarCheckboxesEstudios(res.tabla);
            this.vista.mostrarEstudiosCatalogo(res.tabla);
        }
        else {
            alert("Error al cargar el catálogo de estudios");
        }
    }
    recargarVistaLista() {
        this.vista.ocultarPanelEstudios();
        this.cargarExamenes();
    }
    // --- EXAMENES ---
    async cargarExamenes() {
        const resultado = await Cl_sExamen.getExamenes();
        if (!resultado.ok) {
            alert("Error: No se pudo conectar con el servidor");
            return;
        }
        const resEstudios = await Cl_sEstudio.getTabla({ tabla: "estudio" });
        const examenes = resultado.tabla.map((e) => {
            const ex = new Cl_mExamen({
                id: e.id ?? "",
                nombrePaciente: e.nombrePaciente ?? "",
                cedulaPaciente: e.cedulaPaciente ?? "",
                whatsappPaciente: e.whatsappPaciente ?? "",
                estado: e.estado ?? "pendiente",
                monto: e.monto ?? 0,
                metodoPago: e.metodoPago ?? "efectivo",
                fecha: new Date(e.fecha),
            });
            if (resEstudios.ok) {
                const misEstudios = resEstudios.tabla.filter(st => st.examenId === ex.id);
                ex.estudios = misEstudios.map(st => new Cl_mEstudio({
                    id: st.id,
                    examenId: st.examenId,
                    codigo: st.codigo || "",
                    nombre: st.nombre,
                    valorReferencia: st.valorReferencia,
                    resultado: st.resultado ?? "",
                    precio: st.precio ?? 0
                }));
            }
            return ex;
        });
        this.modelo.examenes = examenes;
        this.vista.mostrarExamenes(this.modelo.filtrarExamenes("todos"));
    }
    onBuscarPacientesPorEstudio(codigo) {
        if (!codigo) {
            alert("Por favor, ingrese un código de estudio");
            return;
        }
        const nombres = this.modelo.nombresHicieronEstudio(codigo);
        if (nombres.length > 0) {
            alert(`Pacientes que se han realizado el estudio ${codigo}:\n\n- ` + nombres.join("\n- "));
        }
        else {
            alert(`No se encontraron pacientes para el estudio ${codigo}.`);
        }
    }
    async onGuardarExamen() {
        const seleccionados = this.vista.estudiosSeleccionados;
        if (seleccionados.length === 0) {
            alert("Debe seleccionar al menos un estudio a realizar.");
            return;
        }
        const cedula = this.vista.cedulaPaciente;
        const existe = await Cl_sExamen.verificarCedula(cedula);
        if (existe) {
            alert("Ya existe un examen registrado para esta cédula.");
            return;
        }
        const examen = new Cl_mExamen({
            nombrePaciente: this.vista.nombrePaciente,
            cedulaPaciente: cedula,
            whatsappPaciente: this.vista.whatsappPaciente,
            estado: "pendiente",
            monto: 0,
            metodoPago: this.vista.metodoPago,
            fecha: this.vista.fecha,
        });
        const resultadoExamen = await Cl_sExamen.agregar(examen);
        if (!resultadoExamen.ok) {
            alert(resultadoExamen.mensaje);
            return;
        }
        // Setear id devuelto por mockapi al modelo local
        examen.id = resultadoExamen.tabla.id;
        // Guardar todos los estudios seleccionados vinculados a este examen
        for (const estDef of seleccionados) {
            const estudio = new Cl_mEstudio({
                examenId: examen.id,
                codigo: estDef.codigo || "",
                nombre: estDef.nombre,
                valorReferencia: estDef.valorReferencia,
                precio: estDef.precio,
                resultado: "",
            });
            const resEstudio = await Cl_sEstudio.agregar(estudio);
            if (resEstudio.ok) {
                examen.agregarEstudio(estudio);
            }
        }
        // Actualizar el monto acumulado del examen
        examen.calcularMonto();
        await Cl_sExamen.actualizarExamen(examen.id, { monto: examen.monto });
        alert("Examen y estudios guardados correctamente.");
        this.vista.ocultarPanelNuevoExamen();
        this.cargarExamenes();
    }
    // --- ESTUDIOS ---
    async onVerEstudios(examen) {
        this.examenActual = examen;
        this.vista.mostrarPanelEstudios();
        await this.cargarEstudios();
    }
    async cargarEstudios() {
        if (!this.examenActual)
            return;
        const res = await Cl_sEstudio.getEstudios(this.examenActual.id);
        if (!res.ok) {
            alert("Error al cargar estudios");
            return;
        }
        this.examenActual.estudios = res.tabla.map((e) => new Cl_mEstudio({
            id: e.id,
            examenId: e.examenId,
            codigo: e.codigo || "",
            nombre: e.nombre,
            valorReferencia: e.valorReferencia,
            resultado: e.resultado ?? "",
            precio: e.precio ?? 0
        }));
        this.vista.mostrarInfoExamen(this.examenActual.nombrePaciente, `${this.examenActual.whatsappPaciente} — Total: Bs ${this.examenActual.monto.toFixed(2)}`);
        this.vista.mostrarEstudios(this.examenActual.estudios);
    }
    async onEliminarEstudio(estudioId) {
        if (!this.examenActual)
            return;
        if (!estudioId) {
            alert("Seleccione un estudio de la tabla");
            return;
        }
        if (!confirm("¿Eliminar este estudio?"))
            return;
        const res = await Cl_sEstudio.eliminar(estudioId);
        if (!res.ok) {
            alert(res.mensaje);
            return;
        }
        // Acumulador en examen (Lógica de negocio en el modelo)
        this.examenActual.eliminarEstudio(estudioId);
        this.examenActual.calcularMonto();
        await Cl_sExamen.actualizarExamen(this.examenActual.id, { monto: this.examenActual.monto });
        this.cargarEstudios();
        this.cargarExamenes();
    }
    // --- CATÁLOGO ---
    async onAgregarEstudioCatalogo(est) {
        if (!est.codigo || !est.nombre || !est.valorReferencia || est.precio <= 0) {
            alert("Por favor complete todos los campos del estudio correctamente");
            return;
        }
        const res = await Cl_sEstudio.agregarDisponible(est);
        if (res.ok) {
            alert("Estudio agregado al catálogo");
            this.cargarCatalogo();
        }
        else {
            alert(res.mensaje);
        }
    }
    async onEliminarEstudioCatalogo(id) {
        if (!confirm("¿Eliminar este estudio del catálogo?"))
            return;
        const res = await Cl_sEstudio.eliminarDisponible(id);
        if (res.ok) {
            this.cargarCatalogo();
        }
        else {
            alert(res.mensaje);
        }
    }
}
//# sourceMappingURL=Cl_cClinica.js.map
import Cl_sMockApi from "./Cl_sMockApi.js";
export default class Cl_sEstudio extends Cl_sMockApi {
    static async agregar(nuevoEstudio) {
        if (!nuevoEstudio.nombre || nuevoEstudio.nombre.trim() === "") {
            return { ok: false, mensaje: "El nombre del estudio es obligatorio" };
        }
        return super.agregar(nuevoEstudio.toJSON());
    }
    static async getEstudios(examenId) {
        const uri = `${this.apiUrl}estudio?examenId=${examenId}`;
        const respuesta = await this.fetchMockApi({ method: "GET", uri });
        if (!respuesta.ok)
            return { ok: false, tabla: [] };
        return { ok: true, tabla: respuesta.data ?? [] };
    }
    static async actualizarResultado(mockApiId, resultado) {
        if (!resultado || resultado.trim() === "") {
            return { ok: false, mensaje: "El resultado no puede estar vacío" };
        }
        return super.modificar(mockApiId, "estudio", { resultado });
    }
    static async eliminar(mockApiId) {
        return super.eliminar(mockApiId, "estudio");
    }
    // --- Catálogo ---
    static async agregarDisponible(estudio) {
        return super.agregar({ tabla: "estudio", examenId: "null", ...estudio });
    }
    static async getDisponibles() {
        const uri = `${this.apiUrl}estudio?examenId=null`;
        const respuesta = await this.fetchMockApi({ method: "GET", uri });
        if (!respuesta.ok)
            return { ok: false, tabla: [] };
        return { ok: true, tabla: respuesta.data ?? [] };
    }
    static async eliminarDisponible(id) {
        return super.eliminar(id, "estudio");
    }
}
//# sourceMappingURL=Cl_sEstudio.js.map
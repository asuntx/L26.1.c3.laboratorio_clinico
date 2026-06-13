import Cl_mEstudio from "../models/Cl_mEstudio.js";
import Cl_sMockApi from "./Cl_sMockApi.js";

export default class Cl_sEstudio extends Cl_sMockApi {
  static async agregar(
    nuevoEstudio: Cl_mEstudio,
  ): Promise<{ ok: boolean; mensaje: string }> {
    if (!nuevoEstudio.nombre || nuevoEstudio.nombre.trim() === "") {
      return { ok: false, mensaje: "El nombre del estudio es obligatorio" };
    }
    return super.agregar(nuevoEstudio.toJSON());
  }

  static async getEstudios(
    examenId: string,
  ): Promise<{ ok: boolean; tabla: any[] }> {
    const uri = `${this.apiUrl}estudio?examenId=${examenId}`;
    const respuesta = await this.fetchMockApi({ method: "GET", uri });
    if (!respuesta.ok) return { ok: false, tabla: [] };
    return { ok: true, tabla: respuesta.data ?? [] };
  }

  static async actualizarResultado(
    mockApiId: string,
    resultado: string,
  ): Promise<{ ok: boolean; mensaje: string }> {
    if (!resultado || resultado.trim() === "") {
      return { ok: false, mensaje: "El resultado no puede estar vacío" };
    }
    return super.modificar(mockApiId, "estudio", { resultado });
  }

  static async eliminar(
    mockApiId: string,
  ): Promise<{ ok: boolean; mensaje: string }> {
    return super.eliminar(mockApiId, "estudio");
  }

  // --- Catálogo ---
  static async agregarDisponible(estudio: any): Promise<{ ok: boolean; mensaje: string; tabla?: any }> {
    return super.agregar({ tabla: "estudio", examenId: "null", ...estudio });
  }

  static async getDisponibles(): Promise<{ ok: boolean; tabla: any[] }> {
    const uri = `${this.apiUrl}estudio?examenId=null`;
    const respuesta = await this.fetchMockApi({ method: "GET", uri });
    if (!respuesta.ok) return { ok: false, tabla: [] };
    return { ok: true, tabla: respuesta.data ?? [] };
  }

  static async eliminarDisponible(id: string): Promise<{ ok: boolean; mensaje: string }> {
    return super.eliminar(id, "estudio");
  }
}

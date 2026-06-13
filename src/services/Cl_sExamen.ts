import Cl_mExamen from "../models/Cl_mExamen.js";
import Cl_sMockApi from "./Cl_sMockApi.js";

export default class Cl_sExamen extends Cl_sMockApi {
  static async getExamenes(): Promise<{ ok: boolean; tabla: any[] }> {
    return super.getTabla({ tabla: "examen" });
  }

  static async existe(
    examenId: number,
  ): Promise<{ ok: boolean; existe: boolean }> {
    return super.existeId({
      tabla: "examen",
      tablaId: examenId,
      tablaIdName: "id",
    });
  }

  static async verificarCedula(cedula: string): Promise<boolean> {
    const res = await this.getExamenes();
    if (!res.ok) return false;
    return res.tabla.some((examen) => examen.cedulaPaciente === cedula);
  }

  static async agregar(
    nuevoExamen: Cl_mExamen,
  ): Promise<{ ok: boolean; mensaje: string; tabla?: any }> {
    // VALIDACIÓN 1: Nombre del paciente
    if (
      !nuevoExamen.nombrePaciente ||
      nuevoExamen.nombrePaciente.trim() === ""
    ) {
      return { ok: false, mensaje: "El nombre del paciente es obligatorio" };
    }

    // VALIDACIÓN 2: Cédula del paciente
    if (
      !nuevoExamen.cedulaPaciente ||
      nuevoExamen.cedulaPaciente.trim() === ""
    ) {
      return { ok: false, mensaje: "La cédula del paciente es obligatoria" };
    }

    // VALIDACIÓN 3: WhatsApp del paciente
    if (
      !nuevoExamen.whatsappPaciente ||
      nuevoExamen.whatsappPaciente.trim() === ""
    ) {
      return { ok: false, mensaje: "El WhatsApp del paciente es obligatorio" };
    }

    // VALIDACIÓN 4: Guardar en MockAPI
    return super.agregar(nuevoExamen.toJSON());
  }

  static async actualizarExamen(
    mockApiId: string,
    cambios: Record<string, unknown>,
  ): Promise<{ ok: boolean; mensaje: string }> {
    return super.modificar(mockApiId, "examen", cambios);
  }
}

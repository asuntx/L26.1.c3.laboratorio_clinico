import Cl_mExamen from "./Cl_mExamen.js";

export default class Cl_mLaboratorio {
  private _examenes: Cl_mExamen[] = [];

  get examenes() { return this._examenes; }
  set examenes(v: Cl_mExamen[]) { this._examenes = v; }

  addExamen(examen: Cl_mExamen) {
    this._examenes.push(examen);
  }

  filtrarExamenes(filtro: "todos" | "pendiente" | "listo"): Cl_mExamen[] {
    if (filtro === "todos") return this._examenes;
    return this._examenes.filter(e => e.estado === filtro);
  }
  nombresHicieronEstudio(codigo:string): string[] {
    let resultados:string[] = []
    this.examenes.forEach(examen => {
      if(examen.tieneEstudio(codigo)) {
        resultados.push(examen.nombrePaciente)
      }
    })
    return resultados
  }
}
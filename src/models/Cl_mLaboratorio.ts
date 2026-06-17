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

  filtrarExamenesPorNombre(nombre: string): Cl_mExamen[] {
    if (!nombre) return this._examenes;
    return this._examenes.filter(e => e.nombrePaciente.toLowerCase().includes(nombre.toLowerCase()));
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

  calcularIngresosTotales(): number {
    return this.examenes.reduce((acc, ex) => acc + ex.monto, 0);
  }

  calcularIngresosPorMetodo(metodo: string): number {
    return this.examenes
      .filter(ex => ex.metodoPago === metodo)
      .reduce((acc, ex) => acc + ex.monto, 0);
  }

  estudiosMasSolicitados(): { nombre: string; cantidad: number }[] {
    const conteo: Record<string, number> = {};
    this.examenes.forEach(ex => {
      ex.estudios.forEach(est => {
        const key = est.nombre || est.codigo;
        if (!conteo[key]) conteo[key] = 0;
        conteo[key]++;
      });
    });

    return Object.entries(conteo)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }
}
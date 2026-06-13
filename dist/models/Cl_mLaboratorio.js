export default class Cl_mLaboratorio {
    _examenes = [];
    get examenes() { return this._examenes; }
    set examenes(v) { this._examenes = v; }
    addExamen(examen) {
        this._examenes.push(examen);
    }
    filtrarExamenes(filtro) {
        if (filtro === "todos")
            return this._examenes;
        return this._examenes.filter(e => e.estado === filtro);
    }
    nombresHicieronEstudio(codigo) {
        let resultados = [];
        this.examenes.forEach(examen => {
            if (examen.tieneEstudio(codigo)) {
                resultados.push(examen.nombrePaciente);
            }
        });
        return resultados;
    }
}
//# sourceMappingURL=Cl_mLaboratorio.js.map
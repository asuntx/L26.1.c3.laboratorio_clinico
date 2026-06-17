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
    filtrarExamenesPorNombre(nombre) {
        if (!nombre)
            return this._examenes;
        return this._examenes.filter(e => e.nombrePaciente.toLowerCase().includes(nombre.toLowerCase()));
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
    calcularIngresosTotales() {
        return this.examenes.reduce((acc, ex) => acc + ex.monto, 0);
    }
    calcularIngresosPorMetodo(metodo) {
        return this.examenes
            .filter(ex => ex.metodoPago === metodo)
            .reduce((acc, ex) => acc + ex.monto, 0);
    }
    estudiosMasSolicitados() {
        const conteo = {};
        this.examenes.forEach(ex => {
            ex.estudios.forEach(est => {
                const key = est.nombre || est.codigo;
                if (!conteo[key])
                    conteo[key] = 0;
                conteo[key]++;
            });
        });
        return Object.entries(conteo)
            .map(([nombre, cantidad]) => ({ nombre, cantidad }))
            .sort((a, b) => b.cantidad - a.cantidad);
    }
}
//# sourceMappingURL=Cl_mLaboratorio.js.map
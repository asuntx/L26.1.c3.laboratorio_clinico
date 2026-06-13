export default class Cl_vLaboratorio {
    ui;
    tblRegistros;
    _procesarCallback = null;
    // stat counters (opcionales, solo si están en el HTML)
    statTotal = document.getElementById("stat-total");
    statPendiente = document.getElementById("stat-pendiente");
    statListo = document.getElementById("stat-listo");
    btFiltroTodos = document.getElementById("lab_filtroTodos");
    btFiltroPendientes = document.getElementById("lab_filtroPendientes");
    btFiltroListos = document.getElementById("lab_filtroListos");
    constructor() {
        this.ui = document.getElementById("laboratorio");
        this.tblRegistros = document.getElementById("laboratorio_tblRegistros");
    }
    onProcesarExamen(callback) {
        this._procesarCallback = callback;
    }
    onFiltrar(callback) {
        const botones = [this.btFiltroTodos, this.btFiltroPendientes, this.btFiltroListos];
        const setActivo = (btn) => {
            botones.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        };
        this.btFiltroTodos.onclick = () => { setActivo(this.btFiltroTodos); callback("todos"); };
        this.btFiltroPendientes.onclick = () => { setActivo(this.btFiltroPendientes); callback("pendiente"); };
        this.btFiltroListos.onclick = () => { setActivo(this.btFiltroListos); callback("listo"); };
    }
    mostrar() { this.ui.removeAttribute("hidden"); }
    ocultar() { this.ui.setAttribute("hidden", "true"); }
    mostrarExamenes(examenes) {
        // Actualizar stats
        if (this.statTotal)
            this.statTotal.textContent = String(examenes.length);
        if (this.statPendiente)
            this.statPendiente.textContent = String(examenes.filter(e => e.estado === "pendiente").length);
        if (this.statListo)
            this.statListo.textContent = String(examenes.filter(e => e.estado === "listo").length);
        this.tblRegistros.innerHTML = "";
        if (examenes.length === 0) {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td colspan="4" style="text-align:center;color:var(--gray-400);padding:24px;">Sin exámenes registrados</td>`;
            this.tblRegistros.appendChild(tr);
            return;
        }
        examenes.forEach((examen) => {
            const tr = document.createElement("tr");
            tr.style.cursor = "pointer";
            const fechaStr = examen.fecha instanceof Date && !isNaN(examen.fecha.getTime())
                ? examen.fecha.toLocaleDateString("es-VE", { day: "2-digit", month: "short" })
                : "—";
            tr.innerHTML = `
        <td><strong>${examen.nombrePaciente}</strong><br><small style="color:var(--gray-400)">${examen.whatsappPaciente}</small></td>
        <td><span class="badge badge-${examen.estado}">${examen.estado}</span></td>
        <td>${fechaStr}</td>
        <td><button type="button" class="btn btn-secondary" style="font-size:12px;height:28px;">Ver estudios</button></td>
      `;
            const btn = tr.querySelector("button");
            btn.onclick = (ev) => {
                ev.stopPropagation();
                this._procesarCallback?.(examen);
            };
            this.tblRegistros.appendChild(tr);
        });
    }
}
//# sourceMappingURL=Cl_vLaboratorio.js.map
export default class Cl_vAnalista {
    ui;
    tblExamenes;
    secEstudios;
    emptyState;
    lblPaciente;
    tblEstudios;
    btEnviarWhatsApp;
    btProcesar;
    btFiltroTodos = document.getElementById("analista_filtroTodos");
    btFiltroPendientes = document.getElementById("analista_filtroPendientes");
    btFiltroListos = document.getElementById("analista_filtroListos");
    _seleccionarCallback = null;
    _guardarCallback = null;
    _whatsappCallback = null;
    constructor() {
        this.ui = document.getElementById("analista");
        this.tblExamenes = document.getElementById("analista_tblExamenes");
        this.secEstudios = document.getElementById("analista_secEstudios");
        this.emptyState = document.getElementById("analista-empty-state");
        this.lblPaciente = document.getElementById("analista_lblPaciente");
        this.tblEstudios = document.getElementById("analista_tblEstudios");
        this.btEnviarWhatsApp = document.getElementById("analista_btEnviarWhatsApp");
        this.btProcesar = document.getElementById("analista_btProcesar");
        this.btEnviarWhatsApp.onclick = () => this._whatsappCallback?.();
    }
    onProcesar(callback) {
        this.btProcesar.onclick = callback;
    }
    onSeleccionarExamen(callback) {
        this._seleccionarCallback = callback;
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
    onGuardarResultado(callback) {
        this._guardarCallback = callback;
    }
    onEnviarWhatsApp(callback) {
        this._whatsappCallback = callback;
    }
    mostrar() { this.ui.removeAttribute("hidden"); }
    ocultar() { this.ui.setAttribute("hidden", "true"); }
    mostrarExamenes(examenes) {
        this.tblExamenes.innerHTML = "";
        if (examenes.length === 0) {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td colspan="3" style="text-align:center;color:var(--gray-400);padding:24px;">Sin exámenes registrados</td>`;
            this.tblExamenes.appendChild(tr);
            return;
        }
        examenes.forEach((examen) => {
            const tr = document.createElement("tr");
            tr.style.cursor = "pointer";
            tr.innerHTML = `
        <td><strong>${examen.nombrePaciente}</strong><br><small style="color:var(--gray-400)">${examen.whatsappPaciente}</small></td>
        <td><span class="badge badge-${examen.estado}">${examen.estado}</span></td>
        <td><button type="button" class="btn btn-secondary" style="font-size:12px;height:28px;">Ver estudios</button></td>
      `;
            tr.onclick = () => {
                this.tblExamenes.querySelectorAll("tr").forEach(r => r.classList.remove("row-selected"));
                tr.classList.add("row-selected");
                this._seleccionarCallback?.(examen);
            };
            this.tblExamenes.appendChild(tr);
        });
    }
    mostrarEstudios(estudios, examen) {
        this.emptyState?.setAttribute("hidden", "true");
        this.secEstudios.removeAttribute("hidden");
        this.lblPaciente.textContent = `Paciente: ${examen.nombrePaciente}  ·  ${examen.whatsappPaciente}`;
        this.tblEstudios.innerHTML = "";
        if (estudios.length === 0) {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td colspan="5" style="text-align:center;color:var(--gray-400);padding:20px;">Sin estudios registrados para este examen</td>`;
            this.tblEstudios.appendChild(tr);
            return;
        }
        estudios.forEach((estudio, idx) => {
            const inputId = `analista_resultado_${idx}`;
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td><span style="color:var(--gray-500); font-family:monospace;">${estudio.codigo || "N/A"}</span></td>
        <td>${estudio.nombre}</td>
        <td>${estudio.valorReferencia}</td>
        <td><input type="text" id="${inputId}" class="tbl-input" value="${estudio.resultado || ""}" placeholder="Ej: 14.5" /></td>
        <td><button type="button" class="btn btn-success" style="font-size:12px;height:28px;">Guardar</button></td>
      `;
            const btn = tr.querySelector("button");
            btn.onclick = () => {
                const input = document.getElementById(inputId);
                this._guardarCallback?.(estudio.id, input.value.trim()); // usa MockAPI id
            };
            this.tblEstudios.appendChild(tr);
        });
    }
}
//# sourceMappingURL=Cl_vAnalista.js.map
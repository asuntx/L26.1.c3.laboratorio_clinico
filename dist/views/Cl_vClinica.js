export default class Cl_vClinica {
    // Lista
    secLaboratorio;
    tblExamenes;
    statTotal = document.getElementById("stat-total");
    statPendiente = document.getElementById("stat-pendiente");
    statListo = document.getElementById("stat-listo");
    btFiltroTodos = document.getElementById("lab_filtroTodos");
    btFiltroPendientes = document.getElementById("lab_filtroPendientes");
    btFiltroListos = document.getElementById("lab_filtroListos");
    btCierreCaja = document.getElementById("lab_btCierreCaja");
    btMasSolicitados = document.getElementById("lab_btMasSolicitados");
    btAbrirNuevoExamen = document.getElementById("lab_btNuevoExamen");
    inBuscarEstudio = document.getElementById("clinica_inBuscarEstudio");
    btBuscarPacientes = document.getElementById("clinica_btBuscarPacientes");
    inBuscarNombre = document.getElementById("clinica_inBuscarNombre");
    // Nuevo Examen (Modal)
    modalNuevoExamen = document.getElementById("modal_nuevoExamen");
    btCerrarTop = document.getElementById("examen_btCerrarTop");
    inNombrePaciente = document.getElementById("examen_inNombrePaciente");
    inCedulaPaciente = document.getElementById("examen_inCedulaPaciente");
    inWhatsappPaciente = document.getElementById("examen_inWhatsappPaciente");
    selMetodoPago = document.getElementById("examen_selMetodoPago");
    inFecha = document.getElementById("examen_inFecha");
    btGuardarExamen = document.getElementById("examen_btEnviar");
    btCancelarExamen = document.getElementById("examen_btVolver");
    // Catálogo (Modal)
    btCatalogo = document.getElementById("lab_btCatalogo");
    modalCatalogo = document.getElementById("modal_catalogo");
    btCerrarCatalogo = document.getElementById("cat_btCerrarTop");
    inCatCodigo = document.getElementById("cat_inCodigo");
    inCatNombre = document.getElementById("cat_inNombre");
    inCatValorRef = document.getElementById("cat_inValorRef");
    inCatPrecio = document.getElementById("cat_inPrecio");
    btAgregarCatalogo = document.getElementById("cat_btAgregar");
    tblCatalogo = document.getElementById("cat_tblRegistros");
    _agregarEstudioCatalogoCallback = null;
    _eliminarEstudioCatalogoCallback = null;
    chkEstudiosContenedor = document.getElementById("examen_chkEstudios");
    // Estudios
    secEstudio;
    emptyState = document.getElementById("lab-empty-state");
    inEstudioId = document.getElementById("estudio_inEstudioId");
    infoExamen = document.getElementById("estudio_pacienteInfo");
    btCerrarEstudio = document.getElementById("estudio_btVolver");
    tblEstudios = document.getElementById("estudio_tblRegistros");
    _verEstudiosCallback = null;
    _eliminarEstudioCallback = null;
    constructor() {
        this.secLaboratorio = document.getElementById("laboratorio");
        this.tblExamenes = document.getElementById("laboratorio_tblRegistros");
        this.secEstudio = document.getElementById("estudio");
        this.btAbrirNuevoExamen.onclick = () => this.mostrarPanelNuevoExamen();
        this.btCerrarTop.onclick = () => this.ocultarPanelNuevoExamen();
        this.btCatalogo.onclick = () => this.mostrarPanelCatalogo();
        this.btCerrarCatalogo.onclick = () => this.ocultarPanelCatalogo();
        this.btAgregarCatalogo.onclick = () => {
            this._agregarEstudioCatalogoCallback?.({
                codigo: this.inCatCodigo.value.trim(),
                nombre: this.inCatNombre.value.trim(),
                valorReferencia: this.inCatValorRef.value.trim(),
                precio: parseFloat(this.inCatPrecio.value) || 0,
            });
        };
    }
    renderizarCheckboxesEstudios(estudios) {
        this.chkEstudiosContenedor.innerHTML = "";
        estudios.forEach((estudio) => {
            const label = document.createElement("label");
            label.className = "checkbox-item";
            const chk = document.createElement("input");
            chk.type = "checkbox";
            chk.value = estudio.nombre;
            chk.dataset.codigo = estudio.codigo;
            chk.dataset.precio = String(estudio.precio);
            chk.dataset.valorRef = estudio.valorReferencia;
            const span = document.createElement("span");
            span.textContent = `${estudio.nombre} (Bs ${estudio.precio})`;
            label.appendChild(chk);
            label.appendChild(span);
            this.chkEstudiosContenedor.appendChild(label);
        });
    }
    // --- GETTERS EXAMEN ---
    get nombrePaciente() { return this.inNombrePaciente.value.trim(); }
    get cedulaPaciente() { return this.inCedulaPaciente.value.trim(); }
    get whatsappPaciente() { return this.inWhatsappPaciente.value.trim(); }
    get metodoPago() { return this.selMetodoPago.value; }
    get fecha() { return new Date(this.inFecha.value); }
    get estudioId() { return this.inEstudioId.value; }
    get estudiosSeleccionados() {
        const checkboxes = this.chkEstudiosContenedor.querySelectorAll("input[type='checkbox']:checked");
        const seleccionados = [];
        checkboxes.forEach(chk => {
            seleccionados.push({
                codigo: chk.dataset.codigo || "",
                nombre: chk.value,
                valorReferencia: chk.dataset.valorRef || "",
                precio: parseFloat(chk.dataset.precio || "0")
            });
        });
        return seleccionados;
    }
    // --- LISTA EXAMENES ---
    mostrarExamenes(examenes) {
        if (this.statTotal)
            this.statTotal.textContent = String(examenes.length);
        if (this.statPendiente)
            this.statPendiente.textContent = String(examenes.filter(e => e.estado === "pendiente").length);
        if (this.statListo)
            this.statListo.textContent = String(examenes.filter(e => e.estado === "listo").length);
        this.tblExamenes.innerHTML = "";
        if (examenes.length === 0) {
            this.tblExamenes.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--gray-400);padding:24px;">Sin exámenes registrados</td></tr>`;
            return;
        }
        examenes.forEach((examen) => {
            const tr = document.createElement("tr");
            tr.style.cursor = "pointer";
            const fechaStr = examen.fecha instanceof Date && !isNaN(examen.fecha.getTime())
                ? examen.fecha.toLocaleDateString("es-VE", { day: "2-digit", month: "short" })
                : "—";
            tr.innerHTML = `
        <td><strong>${examen.nombrePaciente}</strong><br><small style="color:var(--gray-400)">${examen.cedulaPaciente} · ${examen.whatsappPaciente}</small></td>
        <td><span class="badge badge-${examen.estado}">${examen.estado}</span></td>
        <td>${fechaStr}</td>
        <td><strong>Bs ${examen.monto.toFixed(2)}</strong></td>
        <td><button type="button" class="btn btn-secondary" style="font-size:12px;height:28px;">Ver estudios</button></td>
      `;
            const btn = tr.querySelector("button");
            btn.onclick = (ev) => {
                ev.stopPropagation();
                this._verEstudiosCallback?.(examen);
            };
            this.tblExamenes.appendChild(tr);
        });
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
    onBuscarPacientesPorEstudio(callback) {
        this.btBuscarPacientes.onclick = () => {
            callback(this.inBuscarEstudio.value.trim().toUpperCase());
        };
    }
    onBuscarPorNombre(callback) {
        this.inBuscarNombre.addEventListener("input", () => {
            callback(this.inBuscarNombre.value.trim().toLowerCase());
        });
    }
    onCierreCaja(callback) {
        this.btCierreCaja.onclick = callback;
    }
    onMasSolicitados(callback) {
        this.btMasSolicitados.onclick = callback;
    }
    onVerEstudios(callback) {
        this._verEstudiosCallback = callback;
    }
    // --- NUEVO EXAMEN ---
    onGuardarExamen(callback) { this.btGuardarExamen.onclick = callback; }
    onCancelarExamen(callback) { this.btCancelarExamen.onclick = callback; }
    // --- ESTUDIOS ---
    mostrarInfoExamen(paciente, info) {
        this.infoExamen.textContent = `${paciente}  ·  ${info}`;
    }
    mostrarEstudios(estudios) {
        this.tblEstudios.innerHTML = "";
        if (estudios.length === 0) {
            this.tblEstudios.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--gray-400);padding:20px;">Sin estudios registrados</td></tr>`;
            return;
        }
        estudios.forEach((estudio) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td><span style="color:var(--gray-500); font-family:monospace;">${estudio.codigo || "N/A"}</span></td>
        <td>${estudio.nombre}</td>
        <td>${estudio.valorReferencia}</td>
        <td>Bs ${estudio.precio?.toFixed(2) || "0.00"}</td>
        <td><strong>${estudio.resultado || "<span style='color:var(--gray-400)'>pendiente</span>"}</strong></td>
        <td>
          <button type="button" class="btn btn-danger btn-eliminar-estudio" style="font-size:12px; height:26px; padding:0 8px;">✕</button>
        </td>
      `;
            const btnEliminar = tr.querySelector(".btn-eliminar-estudio");
            btnEliminar.onclick = (e) => {
                e.stopPropagation();
                this._eliminarEstudioCallback?.(estudio.id);
            };
            tr.onclick = () => {
                this.tblEstudios.querySelectorAll("tr").forEach(r => r.classList.remove("row-selected"));
                tr.classList.add("row-selected");
                this.inEstudioId.value = estudio.id;
            };
            this.tblEstudios.appendChild(tr);
        });
    }
    onEliminarEstudio(callback) { this._eliminarEstudioCallback = callback; }
    onCerrarEstudios(callback) { this.btCerrarEstudio.onclick = callback; }
    // --- PANELES VISIBILITY ---
    mostrarPanelNuevoExamen() {
        // Clear form
        this.inNombrePaciente.value = "";
        this.inCedulaPaciente.value = "";
        this.inWhatsappPaciente.value = "";
        this.inFecha.value = "";
        // Clear checkboxes
        const checkboxes = this.chkEstudiosContenedor.querySelectorAll("input[type='checkbox']");
        checkboxes.forEach(chk => chk.checked = false);
        this.modalNuevoExamen.showModal();
    }
    ocultarPanelNuevoExamen() {
        this.modalNuevoExamen.close();
    }
    mostrarPanelEstudios() {
        this.secLaboratorio.removeAttribute("hidden");
        this.emptyState.setAttribute("hidden", "true");
        this.secEstudio.removeAttribute("hidden");
    }
    ocultarPanelEstudios() {
        this.secEstudio.setAttribute("hidden", "true");
        this.emptyState.removeAttribute("hidden");
    }
    // --- CATÁLOGO ---
    mostrarPanelCatalogo() {
        this.inCatCodigo.value = "";
        this.inCatNombre.value = "";
        this.inCatValorRef.value = "";
        this.inCatPrecio.value = "";
        this.modalCatalogo.showModal();
    }
    ocultarPanelCatalogo() {
        this.modalCatalogo.close();
    }
    mostrarEstudiosCatalogo(estudios) {
        this.tblCatalogo.innerHTML = "";
        if (estudios.length === 0) {
            this.tblCatalogo.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--gray-400);padding:20px;">Sin estudios en el catálogo</td></tr>`;
            return;
        }
        estudios.forEach((est) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${est.codigo}</td>
        <td>${est.nombre}</td>
        <td>${est.valorReferencia}</td>
        <td>Bs ${parseFloat(est.precio).toFixed(2)}</td>
        <td style="text-align: right;">
          <button type="button" class="btn btn-danger btn-eliminar-cat" style="padding: 4px 8px; height: auto;">🗑️</button>
        </td>
      `;
            const btnEliminar = tr.querySelector(".btn-eliminar-cat");
            btnEliminar.onclick = () => {
                this._eliminarEstudioCatalogoCallback?.(est.id);
            };
            this.tblCatalogo.appendChild(tr);
        });
    }
    onAgregarEstudioCatalogo(callback) { this._agregarEstudioCatalogoCallback = callback; }
    onEliminarEstudioCatalogo(callback) { this._eliminarEstudioCatalogoCallback = callback; }
}
//# sourceMappingURL=Cl_vClinica.js.map
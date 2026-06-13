import { ESTUDIOS_DISPONIBLES } from "../models/Cl_mEstudio.js";
export default class Cl_vEstudio {
    ui;
    emptyState;
    infoExamen;
    inExamenId;
    selNombre;
    inEstudioId; // guarda el MockAPI id del estudio seleccionado
    btAgregar;
    btEliminar;
    btVolver;
    tblRegistros;
    constructor() {
        this.ui = document.getElementById("estudio");
        this.emptyState = document.getElementById("lab-empty-state");
        this.infoExamen = document.getElementById("estudio_pacienteInfo");
        this.inExamenId = document.getElementById("estudio_inExamenId");
        this.selNombre = document.getElementById("estudio_inNombre");
        this.inEstudioId = document.getElementById("estudio_inEstudioId");
        // Poblar dropdown
        ESTUDIOS_DISPONIBLES.forEach(est => {
            const op = document.createElement("option");
            op.value = est.nombre;
            op.text = `${est.nombre} (Bs ${est.precio})`;
            this.selNombre.appendChild(op);
        });
        this.btAgregar = document.getElementById("estudio_btAgregar");
        this.btEliminar = document.getElementById("estudio_btEliminar");
        this.btVolver = document.getElementById("estudio_btVolver");
        this.tblRegistros = document.getElementById("estudio_tblRegistros");
    }
    get examenId() { return this.inExamenId.value.trim(); }
    get estudioId() { return this.inEstudioId.value.trim(); }
    get nombre() { return this.selNombre.value.trim(); }
    mostrarInfoExamen(paciente, info) {
        if (this.infoExamen) {
            this.infoExamen.textContent = `${paciente}  ·  ${info}`;
        }
    }
    onAgregar(callback) { this.btAgregar.onclick = callback; }
    onEliminar(callback) { this.btEliminar.onclick = callback; }
    onVolver(callback) { this.btVolver.onclick = callback; }
    mostrar() {
        this.ui.removeAttribute("hidden");
        this.emptyState?.setAttribute("hidden", "true");
    }
    ocultar() {
        this.ui.setAttribute("hidden", "true");
        this.emptyState?.removeAttribute("hidden");
        this.limpiarInputs();
    }
    mostrarEstudiantes(estudios) {
        this.tblRegistros.innerHTML = "";
        if (estudios.length === 0) {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td colspan="5" style="text-align:center;color:var(--gray-400);padding:20px;">Sin estudios registrados</td>`;
            this.tblRegistros.appendChild(tr);
            return;
        }
        estudios.forEach((est) => {
            const tr = document.createElement("tr");
            tr.style.cursor = "pointer";
            tr.innerHTML = `
        <td>${est.nombre}</td>
        <td>${est.unidad}</td>
        <td>${est.rangoReferencia}</td>
        <td>Bs ${est.precio?.toFixed(2) ?? "0.00"}</td>
        <td>${est.resultado || "<span style='color:var(--gray-400)'>Pendiente</span>"}</td>
      `;
            tr.onclick = () => {
                this.tblRegistros.querySelectorAll("tr").forEach(r => r.classList.remove("row-selected"));
                tr.classList.add("row-selected");
                this.inEstudioId.value = est.id;
                this.selNombre.value = est.nombre;
            };
            this.tblRegistros.appendChild(tr);
        });
    }
    limpiarInputs() {
        this.inEstudioId.value = "";
        this.selNombre.value = "";
    }
}
//# sourceMappingURL=Cl_vEstudio.js.map
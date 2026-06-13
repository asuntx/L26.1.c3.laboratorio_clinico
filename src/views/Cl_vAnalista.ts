import I_vAnalista from "../interfaces/I_vAnalista.js";
import Cl_mExamen from "../models/Cl_mExamen.js";
import Cl_mEstudio from "../models/Cl_mEstudio.js";

export default class Cl_vAnalista implements I_vAnalista {
  private ui: HTMLElement;
  private tblExamenes: HTMLTableSectionElement;
  private secEstudios: HTMLElement;
  private emptyState: HTMLElement | null;
  private lblPaciente: HTMLElement;
  private tblEstudios: HTMLTableSectionElement;
  private btEnviarWhatsApp: HTMLButtonElement;
  private btProcesar: HTMLButtonElement;

  private btFiltroTodos = document.getElementById("analista_filtroTodos") as HTMLButtonElement;
  private btFiltroPendientes = document.getElementById("analista_filtroPendientes") as HTMLButtonElement;
  private btFiltroListos = document.getElementById("analista_filtroListos") as HTMLButtonElement;

  private _seleccionarCallback: ((examen: Cl_mExamen) => void) | null = null;
  private _guardarCallback: ((estudioId: string, resultado: string) => void) | null = null;
  private _whatsappCallback: (() => void) | null = null;

  constructor() {
    this.ui = document.getElementById("analista") as HTMLElement;
    this.tblExamenes = document.getElementById("analista_tblExamenes") as HTMLTableSectionElement;
    this.secEstudios = document.getElementById("analista_secEstudios") as HTMLElement;
    this.emptyState = document.getElementById("analista-empty-state");
    this.lblPaciente = document.getElementById("analista_lblPaciente") as HTMLElement;
    this.tblEstudios = document.getElementById("analista_tblEstudios") as HTMLTableSectionElement;
    this.btEnviarWhatsApp = document.getElementById("analista_btEnviarWhatsApp") as HTMLButtonElement;
    this.btProcesar = document.getElementById("analista_btProcesar") as HTMLButtonElement;

    this.btEnviarWhatsApp.onclick = () => this._whatsappCallback?.();
  }

  onProcesar(callback: () => void): void {
    this.btProcesar.onclick = callback;
  }

  onSeleccionarExamen(callback: (examen: Cl_mExamen) => void): void {
    this._seleccionarCallback = callback;
  }

  onFiltrar(callback: (filtro: "todos" | "pendiente" | "listo") => void): void {
    const botones = [this.btFiltroTodos, this.btFiltroPendientes, this.btFiltroListos];
    const setActivo = (btn: HTMLButtonElement) => {
      botones.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    };

    this.btFiltroTodos.onclick = () => { setActivo(this.btFiltroTodos); callback("todos"); };
    this.btFiltroPendientes.onclick = () => { setActivo(this.btFiltroPendientes); callback("pendiente"); };
    this.btFiltroListos.onclick = () => { setActivo(this.btFiltroListos); callback("listo"); };
  }

  onGuardarResultado(callback: (estudioId: string, resultado: string) => void): void {
    this._guardarCallback = callback;
  }

  onEnviarWhatsApp(callback: () => void): void {
    this._whatsappCallback = callback;
  }

  mostrar(): void { this.ui.removeAttribute("hidden"); }
  ocultar(): void { this.ui.setAttribute("hidden", "true"); }

  mostrarExamenes(examenes: Cl_mExamen[]): void {
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

  mostrarEstudios(estudios: Cl_mEstudio[], examen: Cl_mExamen): void {
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
      const btn = tr.querySelector("button") as HTMLButtonElement;
      btn.onclick = () => {
        const input = document.getElementById(inputId) as HTMLInputElement;
        this._guardarCallback?.(estudio.id, input.value.trim()); // usa MockAPI id
      };
      this.tblEstudios.appendChild(tr);
    });
  }
}

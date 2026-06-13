import Cl_mExamen from "../models/Cl_mExamen.js";

export default interface I_vClinica {
  // Lista y Filtro
  mostrarExamenes(examenes: Cl_mExamen[]): void;
  onFiltrar(callback: (filtro: "todos" | "pendiente" | "listo") => void): void;
  onVerEstudios(callback: (examen: Cl_mExamen) => void): void;

  // Nuevo Examen
  nombrePaciente: string;
  cedulaPaciente: string;
  whatsappPaciente: string;
  metodoPago: "efectivo" | "tarjeta" | "transferencia" | "pagoMovil";
  fecha: Date;
  onGuardarExamen(callback: () => void): void;
  onCancelarExamen(callback: () => void): void;
  onBuscarPacientesPorEstudio(callback: (codigo: string) => void): void;

  // Estudios
  estudioId: string;
  estudiosSeleccionados: any[];
  mostrarInfoExamen(paciente: string, info: string): void;
  mostrarEstudios(estudios: any[]): void;
  onEliminarEstudio(callback: (id: string) => void): void;
  onCerrarEstudios(callback: () => void): void;

  // Paneles
  mostrarPanelNuevoExamen(): void;
  ocultarPanelNuevoExamen(): void;
  mostrarPanelEstudios(): void;
  ocultarPanelEstudios(): void;

  // Catálogo
  renderizarCheckboxesEstudios(estudios: any[]): void;
  mostrarPanelCatalogo(): void;
  ocultarPanelCatalogo(): void;
  mostrarEstudiosCatalogo(estudios: any[]): void;
  onAgregarEstudioCatalogo(callback: (est: any) => void): void;
  onEliminarEstudioCatalogo(callback: (id: string) => void): void;
}

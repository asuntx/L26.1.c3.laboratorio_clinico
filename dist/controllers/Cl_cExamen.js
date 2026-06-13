import Cl_mExamen from "../models/Cl_mExamen.js";
import Cl_sExamen from "../services/Cl_sExamen.js";
export default class Cl_cExamen {
    vista;
    volverCallback;
    constructor({ vista, volverCallback, }) {
        this.vista = vista;
        this.volverCallback = volverCallback;
        this.vista.onEnviar(() => this.btEnviarOnClick());
        this.vista.onVolver(() => this.onVolver());
        this.vista.mostrar();
    }
    async btEnviarOnClick() {
        const examen = new Cl_mExamen({
            nombrePaciente: this.vista.nombrePaciente,
            whatsappPaciente: this.vista.whatsappPaciente,
            estado: this.vista.estado,
            monto: this.vista.monto,
            metodoPago: this.vista.metodoPago,
            fecha: this.vista.fecha,
        });
        const resultado = await Cl_sExamen.agregar(examen);
        alert(resultado.mensaje);
        if (resultado.ok)
            this.volverCallback();
    }
    onVolver() {
        this.vista.ocultar();
        this.volverCallback();
    }
}
//# sourceMappingURL=Cl_cExamen.js.map
export default class Cl_sMockApi {
    static apiUrl = "https://6a25b8a65447714a6f83aa15.mockapi.io/lab/api/v1/";
    static async fetchMockApi({ method = "GET", uri, body, headers = {}, }) {
        if (this.apiUrl === "") {
            return { ok: false, status: 0, message: "API URL no configurada" };
        }
        try {
            const options = {
                method,
                headers: { "Content-Type": "application/json", ...headers },
            };
            if (body !== undefined) {
                options.body = JSON.stringify(body);
            }
            const respuesta = await fetch(uri, options);
            const status = respuesta.status;
            if (status === 404) {
                return { ok: true, status, data: [] };
            }
            if (!respuesta.ok) {
                return { ok: false, status, data: [] };
            }
            let data = null;
            try {
                data = await respuesta.json();
            }
            catch (_) {
                data = null;
            }
            return { ok: true, status, data };
        }
        catch (error) {
            return { ok: false, status: 0, message: error?.message };
        }
    }
    static async getTabla({ tabla }) {
        const uri = `${this.apiUrl}${tabla}`;
        const respuesta = await this.fetchMockApi({ method: "GET", uri });
        if (respuesta.status === 404) {
            return { ok: true, tabla: [] };
        }
        if (!respuesta.ok) {
            return { ok: false, tabla: [] };
        }
        return { ok: true, tabla: respuesta.data ?? [] };
    }
    static async existeId({ tabla, tablaId, tablaIdName, }) {
        const uri = `${this.apiUrl}${tabla}?${tablaIdName}=${tablaId}`;
        const respuesta = await this.fetchMockApi({ method: "GET", uri });
        // ¡El truco para domar a MockAPI!
        // Si el servidor responde 404, la conexión fue exitosa, pero no hay resultados.
        if (respuesta.status === 404) {
            return { ok: true, existe: false };
        }
        // Si falla por un error real del servidor (ej. 500)
        if (!respuesta.ok) {
            return { ok: false, existe: false };
        }
        // Si responde 200 (OK), verificamos si hay registros en `respuesta.data`
        return {
            ok: true,
            existe: Array.isArray(respuesta.data) && respuesta.data.length > 0,
        };
    }
    static async agregar(registro) {
        const tabla = registro?.tabla;
        const uri = tabla ? `${this.apiUrl}${tabla}` : this.apiUrl;
        const { tabla: _t, ...body } = registro; // no enviar 'tabla' al API
        const respuesta = await this.fetchMockApi({
            method: "POST",
            uri,
            body,
        });
        if (!respuesta.ok) {
            return { ok: false, mensaje: "Error al guardar el registro" };
        }
        return {
            ok: true,
            mensaje: "Registro guardado con ID: " + (respuesta.data?.id ?? ""),
            tabla: respuesta.data
        };
    }
    static async modificar(mockApiId, tabla, cambios) {
        const uri = `${this.apiUrl}${tabla}/${mockApiId}`;
        const respuesta = await this.fetchMockApi({ method: "PUT", uri, body: cambios });
        if (!respuesta.ok)
            return { ok: false, mensaje: "Error al modificar" };
        return { ok: true, mensaje: "Registro modificado" };
    }
    static async eliminar(mockApiId, tabla) {
        const uri = `${this.apiUrl}${tabla}/${mockApiId}`;
        const respuesta = await this.fetchMockApi({ method: "DELETE", uri });
        if (!respuesta.ok)
            return { ok: false, mensaje: "Error al eliminar" };
        return { ok: true, mensaje: "Registro eliminado" };
    }
}
//# sourceMappingURL=Cl_sMockApi.js.map
export default class Cl_sMockApi {
  protected static apiUrl: string = "https://6a25b8a65447714a6f83aa15.mockapi.io/lab/api/v1/";

  protected static async fetchMockApi({
    method = "GET",
    uri,
    body,
    headers = {},
  }: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    uri: string;
    body?: any;
    headers?: Record<string, string>;
  }): Promise<{ ok: boolean; status: number; data?: any; message?: string }> {
    if (this.apiUrl === "") {
      return { ok: false, status: 0, message: "API URL no configurada" };
    }
    try {
      const options: RequestInit = {
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

      let data: any = null;
      try {
        data = await respuesta.json();
      } catch (_) {
        data = null;
      }

      return { ok: true, status, data };
    } catch (error: any) {
      return { ok: false, status: 0, message: error?.message };
    }
  }

  static async getTabla({ tabla }: { tabla: string }): Promise<{
    ok: boolean;
    tabla: any[];
  }> {
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

  static async existeId({
    tabla,
    tablaId,
    tablaIdName,
  }: {
    tabla: string;
    tablaId: number;
    tablaIdName: string;
  }): Promise<{ ok: boolean; existe: boolean }> {
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

  static async agregar(
    registro: any,
  ): Promise<{ ok: boolean; mensaje: string; tabla?: any }> {
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

  static async modificar(
    mockApiId: string,
    tabla: string,
    cambios: Record<string, unknown>,
  ): Promise<{ ok: boolean; mensaje: string }> {
    const uri = `${this.apiUrl}${tabla}/${mockApiId}`;
    const respuesta = await this.fetchMockApi({ method: "PUT", uri, body: cambios });
    if (!respuesta.ok) return { ok: false, mensaje: "Error al modificar" };
    return { ok: true, mensaje: "Registro modificado" };
  }

  static async eliminar(
    mockApiId: string,
    tabla: string,
  ): Promise<{ ok: boolean; mensaje: string }> {
    const uri = `${this.apiUrl}${tabla}/${mockApiId}`;
    const respuesta = await this.fetchMockApi({ method: "DELETE", uri });
    if (!respuesta.ok) return { ok: false, mensaje: "Error al eliminar" };
    return { ok: true, mensaje: "Registro eliminado" };
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { lastValueFrom, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
 providedIn: 'root'
})
export class ApiService {
 private apiURL = environment.apiUrl || 'https://uber-nodejs-server-git-d61f89-guillermovillacuratorres-projects.vercel.app/api/';

 private httpOptions = {
   headers: new HttpHeaders({
     'Content-Type': 'application/json',
   }),
 };

 constructor(private http: HttpClient) {}

 private handleError(error: HttpErrorResponse) {
   console.error('Error en la solicitud:', error);
   return throwError(() => new Error('Hubo un error en la solicitud.'));
 }

 async agregarViaje(data: bodyViaje): Promise<any> {
   try {
     const body = {
       p_id_usuario: data.p_id_usuario,
       p_ubicacion_origen: data.p_ubicacion_origen,
       p_ubicacion_destino: data.p_ubicacion_destino,
       p_costo: data.p_costo,
       p_id_vehiculo: data.p_id_vehiculo,
       token: data.token
     };
 
     const response = await lastValueFrom(
       this.http.post<any>(`${this.apiURL}viaje/agregar`, body)
     );
     return response;
   } catch (error) {
     console.error('Error en agregarViaje:', error);
     throw error;
   }
 }

 async obtenerViaje(data: { p_id_usuario?: number; token: string }): Promise<any> {
   try {
     const params = new URLSearchParams();
     if (data.p_id_usuario) params.append('p_id_usuario', data.p_id_usuario.toString());
     if (data.token) params.append('token', data.token);

     const url = `${this.apiURL}viaje/obtener?${params.toString()}`;
     console.log('URL de la petición de viaje:', url);

     const response = await lastValueFrom(
       this.http.get<any>(url)
     );
     return response;
   } catch (error) {
     console.error('Error en obtenerViaje:', error);
     throw error;
   }
 }

 async obtenerVehiculo(data?: { p_id: number; token: string }): Promise<any> {
   try {
     const params = new URLSearchParams();
     if (data?.p_id) params.append('p_id', data.p_id.toString());
     if (data?.token) params.append('token', data.token);
 
     const url = `${this.apiURL}vehiculo/obtener?${params.toString()}`;
     console.log('URL de la petición:', url);
 
     const response = await lastValueFrom(
       this.http.get<any>(url)
     );
     return response;
   } catch (error) {
     console.error('Error detallado en obtenerVehiculo:', error);
     throw error;
   }
 }

 async obtenerUsuario(data: dataGetUser): Promise<any> {
   try {
     const params = {
       p_correo: data.p_correo,
       token: data.token,
     };

     const response = await lastValueFrom(
       this.http.get<any>(`${this.apiURL}user/obtener`, { params })
     );
     return response;
   } catch (error) {
     console.error('Error en obtenerUsuario:', error);
     throw error;
   }
 }

 async agregarUsuario(data: bodyUser, imageFile?: File): Promise<any> {
   try {
     const formData = new FormData();
     formData.append('p_nombre', data.p_nombre);
     formData.append('p_correo_electronico', data.p_correo_electronico);
     formData.append('p_telefono', data.p_telefono);
     if (data.token) formData.append('token', data.token);
     if (imageFile) formData.append('image_usuario', imageFile, imageFile.name);

     const response = await lastValueFrom(
       this.http.post<any>(`${this.apiURL}user/agregar`, formData)
     );
     return response;
   } catch (error) {
     console.error('Error en agregarUsuario:', error);
     throw error;
   }
 }

 async agregarVehiculo(data: bodyVehiculo, imageFile: File): Promise<any> {
   try {
     const formData = new FormData();
     formData.append('p_id_usuario', data.p_id_usuario.toString());
     formData.append('p_patente', data.p_patente);
     formData.append('p_marca', data.p_marca);
     formData.append('p_modelo', data.p_modelo);
     formData.append('p_anio', data.p_anio.toString());
     formData.append('p_color', data.p_color);
     formData.append('p_tipo_combustible', data.p_tipo_combustible);
     formData.append('token', data.token);
     formData.append('image', imageFile);

     const response = await lastValueFrom(
       this.http.post<any>(`${this.apiURL}vehiculo/agregar`, formData)
     );
     return response;
   } catch (error) {
     console.error('Error en agregarVehiculo:', error);
     throw error;
   }
 }

 async solicitarViaje(data: { id_viaje: number; id_usuario: number; token: string }): Promise<any> {
   try {
     const body = {
       p_id_viaje: data.id_viaje,
       p_id_usuario: data.id_usuario,
       token: data.token
     };

     const response = await lastValueFrom(
       this.http.post<any>(`${this.apiURL}viaje/solicitar`, body)
     );
     return response;
   } catch (error) {
     console.error('Error en solicitarViaje:', error);
     throw error;
   }
 }

 async actualizarEstadoViaje(data: { id: number; estado: number; token: string }): Promise<any> {
   try {
     const body = {
       p_id_viaje: data.id,
       p_id_estado: data.estado,
       token: data.token
     };

     const response = await lastValueFrom(
       this.http.put<any>(`${this.apiURL}viaje/actualizar-estado`, body)
     );
     return response;
   } catch (error) {
     console.error('Error en actualizarEstadoViaje:', error);
     throw error;
   }
 }
}

interface bodyViaje {
 p_id_usuario: number;
 p_ubicacion_origen: string;
 p_ubicacion_destino: string;
 p_costo: number;
 p_id_vehiculo: number;
 token: string;
}

interface bodyUser {
 p_nombre: string;
 p_correo_electronico: string;
 p_telefono: string;
 token?: string;
}

interface dataGetUser {
 p_correo: string;
 token: string;
}

interface bodyVehiculo {
 p_id_usuario: number;
 p_patente: string;
 p_marca: string;
 p_modelo: string;
 p_anio: number;
 p_color: string;
 p_tipo_combustible: string;
 token: string;
}

interface getViajeParams {
 p_id_usuario?: number;
 token: string;
}
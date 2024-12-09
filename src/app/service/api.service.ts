import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { lastValueFrom, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiURL = environment.apiUrl || 'https://uber-nodejs-server-git-d61f89-guillermovillacuratorres-projects.vercel.app/api/';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  // Métodos genéricos
  private handleError(error: HttpErrorResponse) {
    console.error('Error en la solicitud:', error);
    return throwError(() => new Error('Hubo un error en la solicitud.'));
  }

  getPosts(): Observable<any> {
    return this.http.get(`${this.apiURL}posts/`).pipe(retry(3), catchError(this.handleError));
  }

  getPost(id: string | number): Observable<any> {
    return this.http.get(`${this.apiURL}posts/${id}`).pipe(retry(3), catchError(this.handleError));
  }

  createPost(post: any): Observable<any> {
    return this.http
      .post(`${this.apiURL}posts/`, post, this.httpOptions)
      .pipe(retry(3), catchError(this.handleError));
  }

  updatePost(id: string | number, post: any): Observable<any> {
    return this.http
      .put(`${this.apiURL}posts/${id}`, post, this.httpOptions)
      .pipe(retry(3), catchError(this.handleError));
  }

  deletePost(id: string | number): Observable<any> {
    return this.http
      .delete(`${this.apiURL}posts/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Métodos específicos
  async agregarUsuario(data: bodyUser, imageFile?: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('p_nombre', data.p_nombre);
      formData.append('p_correo_electronico', data.p_correo_electronico);
      formData.append('p_telefono', data.p_telefono);

      if (data.token) {
        formData.append('token', data.token);
      }
      if (imageFile) {
        formData.append('image_usuario', imageFile, imageFile.name);
      }

      const response = await lastValueFrom(
        this.http.post<any>(`${this.apiURL}user/agregar`, formData)
      );
      return response;
    } catch (error) {
      console.error('Error en agregarUsuario:', error);
      throw error;
    }
  }

  async agregarVehiculo(vehiculoData: bodyVehiculo, imageFile: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('p_id_usuario', vehiculoData.p_id_usuario.toString());
      formData.append('p_patente', vehiculoData.p_patente);
      formData.append('p_marca', vehiculoData.p_marca);
      formData.append('p_modelo', vehiculoData.p_modelo);
      formData.append('p_anio', vehiculoData.p_anio.toString());
      formData.append('p_color', vehiculoData.p_color);
      formData.append('p_tipo_combustible', vehiculoData.p_tipo_combustible);
      formData.append('token', vehiculoData.token);
      formData.append('image', imageFile);

      // Iterar sobre FormData y convertirlo a un objeto
      const formDataObject: { [key: string]: any } = {};
      formData.forEach((value, key) => {
        formDataObject[key] = value;
      });

      console.log('Datos enviados al servidor:', formDataObject);

      const response = await lastValueFrom(
        this.http.post<any>(`${this.apiURL}vehiculo/agregar`, formData)
      );
      return response;
    } catch (error) {
      console.error('Error en agregarVehiculo:', error);
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

  async obtenerVehiculo(idUsuario: number, token: string): Promise<any> {
    try {
      const params = {
        p_id_usuario: idUsuario.toString(),
        token: token || '',
      };

      const response = await lastValueFrom(
        this.http.get<any>(`${this.apiURL}vehiculo/obtener`, { params })
      );
      return response;
    } catch (error) {
      console.error('Error en obtenerVehiculo:', error);
      throw error;
    }
  }
}

// Interfaces
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

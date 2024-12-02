import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

const llave = 'Llave1997';

@Injectable({
  providedIn: 'root'
})
export class SotorageService {
  constructor() { }
  
  // Cambiando de private a public o eliminando el modificador
  async getItem(key: string): Promise<string | null> {
    try {
      const obj = await Preferences.get({ key });
      return obj.value;
    } catch (error) {
      console.error(`Error obteniendo el item con la llave ${key}:`, error);
      return null;
    }
  }

  // Cambiando de private a public
  public async setItem(key: string, valor: string) {
    await Preferences.set({ key: key, value: valor });
  }

  // Cambiando de private a public
  public async removeItem(key: string) {
    await Preferences.remove({ key: key });
  }

  public async obtenerStorage() {
    const data = await this.getItem(llave);
    if (data == null) {
      return [];
    } else {
      return JSON.parse(data);
    }
  }

  public async agregarStorage(data: any) {
    await this.setItem(llave, JSON.stringify(data));
  }
}
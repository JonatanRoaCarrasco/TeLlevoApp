// Este archivo puede ser reemplazado durante la construcción usando el array `fileReplacements`.
// `ng build` reemplaza `environment.ts` con `environment.prod.ts`.
// La lista de reemplazos de archivos se puede encontrar en `angular.json`.

import { TestApiPageRoutingModule } from "src/app/page/test-api/test-api-routing.module";

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyBgo_6qqLBRmpygx1vUDptgW3DiHmgFLck",
    authDomain: "tellevoapp-a5fba.firebaseapp.com",
    projectId: "tellevoapp-a5fba",
    storageBucket: "tellevoapp-a5fba.appspot.com",
    messagingSenderId: "875567384773",
    appId: "1:875567384773:web:c2f0f6e6f9c3acb77ec8ac",
    measurementId: "G-WS1Z4L4DVP"
  },
  apiUrl:"https://uber-nodejs-server-git-d61f89-guillermovillacuratorres-projects.vercel.app/api/" //uber.matiivilla.cl
};

/*
 * Para facilitar la depuración en modo de desarrollo, puedes importar el siguiente archivo
 * para ignorar los marcos de pila de errores relacionados con la zona, como `zone.run`, `zoneDelegate.invokeTask`.
 *
 * Esta importación debe estar comentada en modo de producción porque tendrá un impacto negativo
 * en el rendimiento si se lanza un error.
 */
// import 'zone.js/plugins/zone-error';  // Incluido con Angular CLI.

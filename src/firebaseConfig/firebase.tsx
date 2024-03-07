import { initializeApp } from "firebase/app";
import { getFirestore  } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { usuarioData } from "../pages/helper";
import { getMessaging, getToken } from "firebase/messaging";


   // configuracion de base de dato desde el .env
   const firebaseConfig = {
   apiKey: "AIzaSyC2TGYzPLUOyhXq194zNdiXEl0G_e3cMdg",
   authDomain: "siscap-ionic.firebaseapp.com",
   databaseURL: "https://siscap-ionic-default-rtdb.firebaseio.com",
   projectId: "siscap-ionic",
   storageBucket: "siscap-ionic.appspot.com",
   messagingSenderId: "1062512984626",
   appId: "1:1062512984626:web:8326059f39b52c952eb22b",
   measurementId: "G-HXVZ71YHD9",
   cacheSize: 10000,
  enablePersistence: true
}



export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app); 

//notificacion



 //  login de sesion de usuarios
export async function loginUser(email: string, password: string) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
     const [ Rol ] = await usuarioData();

    return Rol; // Devolver el valor de 'rol'
  } catch (error) {
    console.error("Error al consultar la colección de usuarios: ", error);
    throw error; // Lanzar el error para que se maneje en el contexto que llama a esta función
  }
}


// // cerrar sesion 
 export function logoutUser() {
   return auth.signOut();
 }

// estado para comprobar el estado de sesion  del rol
 export function getCurrentUser() {
 return new Promise((resolve, reject) => {
    const unsuscribe = auth.onAuthStateChanged(async function(user) {
      if (user) {
        
        const [ Rol ] = await usuarioData();

         resolve(Rol)

     } else {
        resolve(null);
      }
      unsuscribe();
    });
  });
}
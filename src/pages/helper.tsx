
import { auth , db } from '../firebaseConfig/firebase';
import {  getDocs, collection} from 'firebase/firestore';

export async function usuarioData (){


const user = auth.currentUser;
   if(user){
    const UserDoc = collection(db, 'Users');
    const querySnapshot = await getDocs(UserDoc);

     let Rol;
     let Plant;
     let totalUsuarios = 0;
    
     
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      
      if (userData.uid === user.uid) {
        const roles = userData.rol
        const plantas = userData.plant 
        
         Rol = roles;
         Plant = plantas; 
       }   

       totalUsuarios++;
     });

   return [Rol, Plant , totalUsuarios]         
  }  

  return null; 
}

interface Planta {
  // Define las propiedades adecuadas para tus plantas
  nombre: string;
  edad: number;
  // Otras propiedades si es necesario
}
let cachedPlantData: Planta[] | null = null; // Almacenar en caché los datos de las plantas

export async function datoPlantas(): Promise<Planta[]> {
  if (cachedPlantData !== null) {
    // Si los datos ya están en caché, devuélvelos desde la caché en lugar de consultar nuevamente
    return cachedPlantData;
  }

  const PlantDoc = collection(db, 'Plants');
  try {
    const snapshot = await getDocs(PlantDoc);
    const plantas: Planta[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data() as Planta;
      plantas.push(data);
    });

    // Almacena los datos en caché
    cachedPlantData = plantas;

    return plantas;
  } catch (error) {
    console.error('Error al obtener las plantas:', error);
    throw error;
  }
}






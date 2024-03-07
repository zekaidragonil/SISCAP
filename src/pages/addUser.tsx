import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonList, IonFab, IonFabButton, IonIcon, IonSearchbar, IonBackButton, IonGrid, IonRow, IonCol, IonInput, IonSelectOption, IonSelect, IonButton, IonToast, IonAlert } from '@ionic/react';
import './Page.css';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { auth, db} from '../firebaseConfig/firebase';
import { getDocs, collection, doc, setDoc } from 'firebase/firestore';
import { datoPlantas } from '../pages/helper';
import { createUserWithEmailAndPassword , setPersistence, browserSessionPersistence } from 'firebase/auth'


const estadosVenezuela = [
  'Amazonas',
  'Anzoátegui',
  'Apure',
  'Aragua',
  'Barinas',
  'Bolívar',
  'Carabobo',
  'Cojedes',
  'Delta Amacuro',
  'Falcón',
  'Guárico',
  'Lara',
  'Mérida',
  'Miranda',
  'Monagas',
  'Nueva Esparta',
  'Portuguesa',
  'Sucre',
  'Táchira',
  'Trujillo',
  'Vargas',
  'Yaracuy',
  'Zulia'
];






const AddUsers: React.FC = () =>{
    const [selectedHydro, setSelectedHydro] = useState('');
    const [filteredPlants, setFilteredPlants] = useState([]);
    const [name, setNombre] = useState('');
    const [ci, setCedula] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setTelefono] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [repetirContraseña, setRepetirContraseña] = useState('');
    const [rol, setRol] = useState('');
    const [selectedPlant, setSelectedPlant] = useState('');
    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [showConfirmationAlert, setShowConfirmationAlert] = useState(false);
    const history = useHistory();
    const [estadoSeleccionado, setEstadoSeleccionado] = useState('');
   

    useEffect(() => {
        const Dates = async () => {
          const user = auth.currentUser;
          if (user) {
            const UserDoc = collection(db, 'Users');
            const querySnapshot = await getDocs(UserDoc);
    
            let Data: any = {};
            querySnapshot.forEach((doc) => {
              const userData = doc.data();
                Data = userData;
            });
            setRol(Data.rol);
          }
        };
        Dates();
      }, []);



      const handleUpdate = () => {
        setShowConfirmationAlert(true);
      };
    const handleHydroChange = (event: React.ChangeEvent<HTMLIonSelectElement>) => {
        setSelectedHydro(event.target.value);
      };
   
    useEffect(() => {
        const fetchPlants = async () => {
          const plantas = await datoPlantas();
          if (selectedHydro) {
            const plantasEncontradas = plantas.filter((plant: any) => plant.hidrologica === selectedHydro);
            setFilteredPlants(plantasEncontradas);
          } else {
            setFilteredPlants([]);
          }
        };
    
        fetchPlants();
      }, [selectedHydro]);

      const handleEstadoChange = (event) => {
        setEstadoSeleccionado(event.detail.value);
      };


      const guardarUsuario = async() => {
        if (contraseña !== repetirContraseña) {
            setMostrarAlerta(true);
            setTitulo('Error!!');
            setMensaje('Las contraseñas no coinciden');
    
            return;
          }

          setPersistence(auth, browserSessionPersistence)
  .then(() => {
    // Ahora, puedes crear el usuario sin que inicie sesión automáticamente
    return createUserWithEmailAndPassword(auth, email, contraseña);
  })
  .then((userCredential) => {
    const uid = userCredential.user?.uid;
    if (uid) {
        const usuarioRef = doc(db, 'Users', uid);
        let selectedPlantValue = '';

        if (rol === 'Gerente') {
          selectedPlantValue = selectedHydro;
        } else if (rol === 'Usuario') {
          selectedPlantValue = selectedPlant;
        } else if (rol === 'Administrador') {
          selectedPlantValue = 'Minaguas';
        } else if (rol === 'UTA'){
          selectedPlantValue = estadoSeleccionado;
        }

        setDoc(usuarioRef, {
            name,
            ci,
            email,
            phone,
            rol,
            plant: selectedPlantValue,
            uid: uid
          }).then(() => {
           
            setMostrarAlerta(true);
            setTitulo('Completado!!');
            setMensaje('Usuario guardado en la base de dato');
            
           // history.push(`/usuarios`, { successMessage: 'Usuario agregado con éxito' });
           // setUserSaved(true);
            //mostrarMensaje('Usuario agregado con éxito');
          })
          .catch((error) => {
            console.log('Error al guardar el usuario en Firestore:', error);
          });
        
    }
  })
  .catch((error) => {
    // Manejar errores si es necesario
    console.error('Error al crear el usuario:', error);
  });
            

      }


    return(
        <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton />
            </IonButtons>
            <IonTitle>Registro de Usuario</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonGrid >
            <IonRow>
              <IonCol size="6">
                <IonInput  onIonInput={(e) => setNombre(e.target.value)} label="Nombre" labelPlacement="floating" type='text' fill="outline"></IonInput>
              </IonCol>
              <IonCol size="6">
                <IonInput  onIonInput={(e) => setCedula(e.target.value)} label='Cedula' labelPlacement="floating" type="tel" fill="outline"></IonInput>
              </IonCol>
              <IonCol size="6">
                <IonInput   onIonInput={(e) => setEmail(e.target.value)} label='email' labelPlacement="floating" type='email' fill="outline"></IonInput>
              </IonCol>
              <IonCol size="6">
                <IonInput   onIonInput={(e) => setTelefono(e.target.value)} label='Telefono' labelPlacement="floating" type='tel' fill="outline"></IonInput>
              </IonCol>
              <IonCol size="6">
                <IonInput   onIonInput={(e) => setContraseña(e.target.value)} label='contraseña' labelPlacement="floating" type='password' fill="outline"></IonInput>
              </IonCol>
              <IonCol size="6">
                <IonInput   onIonInput={(e) => setRepetirContraseña(e.target.value)} label='Repetir contraseña' labelPlacement="floating" type='password' fill="outline"></IonInput>
              </IonCol>
              <IonCol size="6">
                <IonSelect onIonChange={(e) => setRol(e.target.value)} label="Rol" labelPlacement="floating" fill="outline">
                  <IonSelectOption value="Administrador">Administrador</IonSelectOption>
                  <IonSelectOption value="Gerente">Gerente</IonSelectOption>
                  <IonSelectOption value="Usuario">Usuario</IonSelectOption>
                  <IonSelectOption value="UTA">UTTA</IonSelectOption>
                </IonSelect>
              </IonCol>
              <IonCol size="6">
                {(rol === "Gerente" || rol === "Usuario") && (
                  <IonSelect  onIonChange={handleHydroChange} label="Hidrologica" labelPlacement="floating" fill="outline">
                    <IonSelectOption value="HIDROCAPITAL">HIDROCAPITAL</IonSelectOption>
                    <IonSelectOption value="HIDROCENTRO">HIDROCENTRO</IonSelectOption>
                    <IonSelectOption value="AGUAS DE YARACUY">AGUAS DE YARACUY</IonSelectOption>
                    <IonSelectOption value="HHIDROAMAZONAS">HIDROAMAZONA</IonSelectOption>
                    <IonSelectOption value="HIDROBOLIVAR">HIDROBOLIVAR</IonSelectOption>
                    <IonSelectOption value="HIDRODELTA">HDRODELTA</IonSelectOption>
                    <IonSelectOption value="AGUAS DE MONAGAS">AGUAS DE MONAGUAS</IonSelectOption>
                    <IonSelectOption value="HIDROCARIBE">HIDROCARIBE</IonSelectOption>
                    <IonSelectOption value="HIDROANDES">HIDROANDES</IonSelectOption>
                    <IonSelectOption value="AGUAS DE MERIDA">AGUAS DE MERIDA</IonSelectOption>
                    <IonSelectOption value="HIDROSUROESTE">HIDROSUROESTE</IonSelectOption>
                    <IonSelectOption value="HIDROFALCON">HIDROFALCON</IonSelectOption>
                    <IonSelectOption value="HIDROLARA">HIDROLARA</IonSelectOption>
                    <IonSelectOption value="HIDROLAGO">HIDROLAGO</IonSelectOption>
                    <IonSelectOption value="HIDROLLANOS">HIDROLLANOS</IonSelectOption>
                    <IonSelectOption value="HIDROANDES">HIDROANDES</IonSelectOption>
                    <IonSelectOption value="HIDROPORTUGUESA">AGUAS DE PORTUGUESA</IonSelectOption>
                  </IonSelect>
                )}
              </IonCol>
              <IonCol size="6">
                {rol === "Usuario" && (
                  <IonSelect onIonChange={(e) => setSelectedPlant(e.target.value)} label="Plantas" labelPlacement="floating" fill="outline">
                    {filteredPlants.map((plant) => (
                      <IonSelectOption key={plant.codigo} value={plant.name}>
                        {plant.name}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                )}
              </IonCol>
            </IonRow>
            <IonRow>
            {rol === "UTA" && (
                 <IonCol size='6'>
        <IonSelect onIonChange={handleEstadoChange} label="Estados" labelPlacement="floating" fill="outline" value={estadoSeleccionado}>
          <IonSelectOption value=""></IonSelectOption>
          {estadosVenezuela.map((estado, index) => (
            <IonSelectOption key={index} value={estado.toUpperCase()}>
              {estado}
            </IonSelectOption>
          ))}
        </IonSelect>
        </IonCol>
      )}
            </IonRow>
            <IonRow>
              <IonCol className='center'  size="12">
                <IonButton onClick={handleUpdate}>Guardar</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
          <IonAlert
        isOpen={showConfirmationAlert}
        onDidDismiss={() => setShowConfirmationAlert(false)}
        header={'Confirmar actualización'}
        message={'¿Estás seguro de que deseas crear el usuario?'}
        buttons={[
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              setShowConfirmationAlert(false);
            }
          },
          {
            text: 'Guardar',
            handler: () => {
                guardarUsuario();
            }
          }
        ]}
      />
          <IonAlert isOpen={mostrarAlerta}  onDidDismiss={() => setMostrarAlerta(false)} header={titulo}  message={mensaje} buttons={[
          {
            text: 'OK',
            handler: () => {
                setMostrarAlerta(false);
              history.goBack(); // Aquí rediriges hacia atrás cuando se presiona "OK"
            },
          },
        ]} ></IonAlert> 

        </IonContent>
      </IonPage>
    );

} 

export default AddUsers
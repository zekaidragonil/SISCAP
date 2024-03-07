import { IonAlert, IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar } from "@ionic/react";
import { useParams, useHistory } from 'react-router-dom'
import { useState, useEffect } from "react";
import { auth, db } from '../firebaseConfig/firebase';
import { getDocs, collection, doc, updateDoc } from 'firebase/firestore';
import { datoPlantas } from '../pages/helper';

const Editar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>({});
  const [name, setName] = useState('');
  const [ci, setCi] = useState('');
  const [phone, setPhone] = useState('');
  const [rol, setRol] = useState('');
  const [selectedPlant, setSelectedPlant] = useState('');
  const [selectedHydro, setSelectedHydro] = useState('');
  const [filteredPlants, setFilteredPlants] = useState<any[]>([]);
  const [showConfirmationAlert, setShowConfirmationAlert] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showCamposVaciosAlert, setShowCamposVaciosAlert] = useState(false);
  const [header, setHeader] = useState('');
  const [mensaje, setMensaje] = useState('');
  const history = useHistory();

  useEffect(() => {
    const Dates = async () => {
      const user = auth.currentUser;
      if (user) {
        const UserDoc = collection(db, 'Users');
        const querySnapshot = await getDocs(UserDoc);

        let Data: any = {};
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.uid === id) {
            Data = userData;
          }
        });
        setData(Data);
        setRol(Data.rol);
        setDataLoaded(true); // Marcamos que los datos están cargados
      }
    };
    Dates();
  }, [id]);

  const handleHydroChange = (event: React.ChangeEvent<HTMLIonSelectElement>) => {
    setSelectedHydro(event.target.value);
  };

  const handleUpdate = () => {
    setShowConfirmationAlert(true);
  };

  useEffect(() => {
    const fetchPlants = async () => {
      const plantas = await datoPlantas();
      if (selectedHydro) {
        const plantasEncontradas: any[] = plantas.filter((plant: any) => plant.hidrologica === selectedHydro);
        setFilteredPlants(plantasEncontradas);
      } else {
        setFilteredPlants([]);
      }
    };

    fetchPlants();
  }, [selectedHydro]);

  const confirmUpdate = async () => {
    const userDocRef = doc(db, 'Users', id);

    try {
      await updateDoc(userDocRef, {
        name,
        ci,
        phone,
        rol,
        plant: rol === 'Usuario' ? selectedPlant : selectedHydro,
      });

      setShowConfirmationAlert(false);
      setHeader('Éxito');
      setMensaje('Se editó correctamente');
      setShowCamposVaciosAlert(true);
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      setHeader('Error');
      setMensaje('Ocurrió un error al actualizar el usuario');
      setShowCamposVaciosAlert(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/users" />
          </IonButtons>
          <IonTitle></IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonGrid>
        <IonRow>
          <IonCol size="6">
            <IonInput label="Nombre" labelPlacement="floating" value={data.name} onIonInput={(e) => setName(String(e.target.value))}type='text' fill="outline"></IonInput>
          </IonCol>
          <IonCol size="6">
            <IonInput label="CI" labelPlacement="floating" value={data.ci} onIonChange={(e) => setCi(String(e.target.value))} type='text' fill="outline"></IonInput>
          </IonCol>
          <IonCol size="6">
            <IonInput label="Telefono" labelPlacement="floating" value={data.phone} onIonChange={(e) => setPhone(String(e.target.value))} type='text' fill="outline"></IonInput>
          </IonCol>
          <IonCol size="6">
            <IonSelect value={rol} onIonChange={(e) => setRol(e.target.value)} label="Rol" labelPlacement="floating" fill="outline">
              <IonSelectOption value="Administrador">Administrador</IonSelectOption>
              <IonSelectOption value="Gerente">Gerente</IonSelectOption>
              <IonSelectOption value="Usuario">Usuario</IonSelectOption>
            </IonSelect>
          </IonCol>
          <IonCol size="6">
            {(rol === "Gerente" || rol === "Usuario") && (
              <IonSelect value={selectedHydro} onIonChange={handleHydroChange} label="Hidrologica" labelPlacement="floating" fill="outline">
                <IonSelectOption value="HIDROCAPITAL">HIDROCAPITAL</IonSelectOption>
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
              <IonSelect value={selectedPlant} onIonChange={(e) => setSelectedPlant(e.target.value)} label="Plantas" labelPlacement="floating" fill="outline">
                {filteredPlants.map((plant) => (
                  <IonSelectOption key={plant.id} value={plant.name}>
                    {plant.name}
                  </IonSelectOption>
                ))}
              </IonSelect>
            )}
          </IonCol>
        </IonRow>
          
        <IonRow>
          <IonCol size="12" className='center'>
            <IonButton onClick={handleUpdate}>Actualizar</IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
      <IonAlert
        isOpen={showConfirmationAlert}
        onDidDismiss={() => setShowConfirmationAlert(false)}
        header={'Confirmar actualización'}
        message={'¿Estás seguro de que deseas actualizar el usuario?'}
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
            text: 'Actualizar',
            handler: () => {
              confirmUpdate();
            }
          }
        ]}
      />
      <IonAlert
        isOpen={showCamposVaciosAlert}
        header={header}
        message={mensaje}
        buttons={[
          {
            text: 'OK',
            handler: () => {
              setShowCamposVaciosAlert(false);
              history.goBack(); // Aquí rediriges hacia atrás cuando se presiona "OK"
            },
          },
        ]}
      />
    </IonPage>
  );
}

export default Editar;

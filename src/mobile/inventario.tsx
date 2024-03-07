import { IonAlert, IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonHeader, IonInput, IonPage, IonRow, IonTextarea, IonTitle,  IonToolbar } from '@ionic/react';
import React, { useState} from 'react';
import { useHistory, useParams }  from 'react-router-dom'
import {  getDoc,doc,updateDoc  } from 'firebase/firestore'
import { db, auth } from '../firebaseConfig/firebase'

const Inventario: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const [cloro, setCloro] = useState('');
    const [sulfato, setSulfato] = useState('');
    const [Reporte, setReporte] = useState('');
    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [showConfirmAlert, setShowConfirmAlert] = useState(false); 
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    
 

const handleGuardar = () => {
   const cantidadCloro = parseInt(cloro);
     const cantidadSulfato = parseInt(sulfato);

        if (!cloro || !sulfato ||!Reporte ) {
            setMostrarAlerta(true);
            setTitulo('Error!!');
            setMensaje('Los campos no puede ir vacios, porfavor verifiquelos o intente nueva mente  ');
          return;
        }

        if (cantidadCloro < 0 || cantidadSulfato < 0) {
            setMostrarAlerta(true);
            setTitulo('Error!!');
            setMensaje('Los valores negativos no están permitidos ');
          return;
        }
       
        if (cantidadCloro > 0 || cantidadSulfato > 0) {
          setShowConfirmAlert(true);
          return;
        }
      };
 
    async  function guardarInventario(){
        const cantidadCloro = parseInt(cloro);
        const cantidadSulfato = parseInt(sulfato);

        // referencia base de dato
        const plantRef = doc(db, 'Plants', id);
      
      
       const user = auth.currentUser
       const plantSnapshot = await getDoc(plantRef);
       const historial = await getDoc(plantRef);
      
       if (plantSnapshot.exists()) {
        const existingInventory = plantSnapshot.data().inventory || {};
        const historicoActual =  plantSnapshot.data().historico || {};
        const updatedInventory = {
          cloro: (parseInt(existingInventory.cloro || 0)) + cantidadCloro,
          sulfato: ( parseInt(existingInventory.sulfato || 0)) + cantidadSulfato,
          usuario: user.email,
        };
    
       await updateDoc(plantRef, { inventory: updatedInventory })
        .then(() => {
        console.log('Guardado con éxito');
       
        setShowSuccessAlert(true);
      })
      .catch((error) => {
        console.error('Error al guardar en el historico:', error);
      });;
 
        const fechaActual = new Date();
        const dia = fechaActual.getDate();
        const mes = fechaActual.getMonth();
        const ano = fechaActual.getFullYear();
        const fechaClave = `${dia}-${mes}-${ano}`;
       
        const cambios = {
          fecha: fechaClave,
          cloro: cantidadCloro,
          sulfato: cantidadSulfato,
          usuario: user.email,
          Repote : Reporte,
        };
        
        await updateDoc(plantRef, {
          [`historico.${fechaClave}`]: cambios,
        })
          .then(() => {
            console.log('Guardado con éxito');
          })
          .catch((error) => {
            console.error('Error al guardar en el historico:', error);
          });
      }
       
      setShowConfirmAlert(false);
       };
   
       const handleConfirmGuardar = () => {
        setShowConfirmAlert(false);
        guardarInventario();
      };

      const handleSuccessAlertClose = () => {
        setShowSuccessAlert(false);
        history.goBack(); // Regresar a la vista anterior
      };

     
     return (
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonBackButton defaultHref="/dashboard-plant" />
              </IonButtons>
              <IonTitle>Inventario planta</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
            <IonCard className="card">
              <IonCardHeader>
                <IonCardTitle className="ion-text-center">Registro de Inventario</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonRow>
                  <IonCol size="6">
                    <IonInput
                      type="number"
                      label="Cloro"
                      labelPlacement="floating"
                      fill="outline"
                      value={cloro}
                      onIonInput={(e) => setCloro(e.detail.value!)}
                      required
                    />
                  </IonCol>
                
                  <IonCol size="6">
                    <IonInput
                      type="number"
                      label="Sulfato"
                      labelPlacement="floating"
                      fill="outline"
                      value={sulfato}
                      onIonInput={(e) => setSulfato(e.detail.value!)} required
                    />
                  </IonCol>
                  <IonCol size='12'>
                  <IonTextarea label="Reporte de inventario" onInput={(e)=> setReporte(e.target.value)} labelPlacement="floating" fill="solid" required placeholder="Enter text"></IonTextarea>

                  </IonCol>
                  <IonCol size="12" className="ion-text-center">
                    <IonButton onClick={handleGuardar}>Guardar</IonButton>
                  </IonCol>
                </IonRow>
                <IonAlert
              isOpen={showConfirmAlert}
               header="Confirmación"
              message={`¿Está seguro que desea guardar ${cloro} de cloro y ${sulfato} de sulfato?`}
              buttons={[
              {
              text: 'No',
              role: 'cancel',
               handler: () => setShowConfirmAlert(false)
             },
              {
              text: 'Sí',
              handler: () => handleConfirmGuardar()
            }
          ]}
        />
                <IonAlert isOpen={mostrarAlerta}  onDidDismiss={() => setMostrarAlerta(false)} header={titulo}  message={mensaje} buttons={['OK']} ></IonAlert> 
                <IonAlert
              isOpen={showSuccessAlert}
              header="Éxito"
              message="Los datos se guardaron con éxito."
              buttons={[
                {
                  text: 'OK',
                  handler: handleSuccessAlertClose
                }
              ]}
            />
              </IonCardContent>
            </IonCard>
           
          </IonContent>
        </IonPage>
      );

}
export default Inventario;
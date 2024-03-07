import { IonAlert, IonBackButton, IonButton, IonButtons, IonCol, IonDatetime, IonDatetimeButton, IonGrid, IonHeader, IonInput, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonModal, IonRow, IonTextarea, IonTitle, IonToolbar } from "@ionic/react";
import React, { useEffect, useState} from 'react';
import { groupOne, groupTwo } from '../components/input'
import { useParams, useHistory } from 'react-router-dom';
import { db, auth } from '../firebaseConfig/firebase';
import { doc, getDoc,updateDoc } from 'firebase/firestore';



const Alerta: React.FC = () => {
     const { id } = useParams<{ id: string }>();
     const fecha = new URLSearchParams(window.location.search).get('fecha');
     const key = new URLSearchParams(window.location.search).get('key');
    const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
    const [Reporte, setReporte] = useState('');
    const [showConfirmAlert, setShowConfirmAlert] = useState(false); 
    const [showCamposVaciosAlert, setShowCamposVaciosAlert] = useState(false);
 
     const history = useHistory();
    
    const handleInputChange = (key: string, value: string) => {
        setInputValues((prevValues) => ({
          ...prevValues,
          [key]: value
        }));
      };

     

      const handleGuardar = async() => {
        setShowConfirmAlert(true);
        return;
      }

   const usuario = auth.currentUser   
  
   const handleConfirmGuardar = async () => {


    const combinedInputValues = {};
    [...groupOne, ...groupTwo].forEach((item) => {
        const value = inputValues[item.name] || '';
        combinedInputValues[item.name] = value;
      });

      const fechaActual = new Date();
      const dia = fechaActual.getDate();
      const mes = fechaActual.getMonth();
      const ano = fechaActual.getFullYear();
      const fechaClave = `${dia}-${mes}-${ano}`;
    
      combinedInputValues.key = key;
      combinedInputValues.fecha = fechaClave;
      combinedInputValues.Report = Reporte;
      combinedInputValues.usuario = usuario.email;
     combinedInputValues.id = id;
     combinedInputValues.estatus = 'solicitud';

     
     const InveRef = doc(db, 'Plants', id);
     const userDoc = await getDoc(InveRef);

     if (userDoc.exists()) {
        const userData = userDoc.data();

        if(!userData.reporte){

          userData.reporte = [];
        }  
            // Si el usuario ya tiene un arreglo de reportes, agrégale un nuevo reporte
            userData.reportes.push(combinedInputValues);
          await updateDoc(InveRef, userData);
  
         
          setShowCamposVaciosAlert(true);
         
     }else {
        // El documento del usuario no existe, maneja este caso según tus necesidades
        console.error('El documento del usuario no existe.');
      }
  
    }
    return(
        <div>
        <IonHeader>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonBackButton defaultHref="/dashboard-plant" />
                </IonButtons>
                <IonTitle>Registro: {fecha} </IonTitle>
              </IonToolbar>
            </IonHeader>
        <IonItemGroup className='ion-margin'>
          <IonItemDivider>
            <IonLabel>Clarificación</IonLabel>
          </IonItemDivider>
        
          <IonGrid>
            <IonRow>
              {groupOne.map((item) => {
                const key = item.name;
                return (
                  <IonCol size="6" key={key}>
                    <IonItem lines='none'>
                      <IonInput
                        id={key}
                        label={item.label}
                        labelPlacement='stacked'
                        type={item.type}
                        placeholder={item.placeholder}
                        inputmode="numeric"
                        onIonInput={(e) => handleInputChange(key, e.detail.value!)}
                      ></IonInput>
                    </IonItem>
                  </IonCol>
                );
              })}
               
            </IonRow>
          </IonGrid>
        </IonItemGroup>
        <IonItemGroup className='ion-margin'>
          <IonItemDivider>
            <IonLabel>Desinfecion</IonLabel>
          </IonItemDivider>
          <IonGrid>
            <IonRow>
              {groupTwo.map((item) => {
                const key = item.name;
                return (
                  <IonCol size="6" key={key}>
                    <IonItem lines='none'>
                      <IonInput
                        id={key}
                        label={item.label}
                        labelPlacement='stacked'
                        type={item.type}
                        placeholder={item.placeholder}
                        inputmode="numeric"
                        onIonInput={(e) => handleInputChange(key, e.detail.value!)}
                      ></IonInput>
                    </IonItem>
                  </IonCol>
                );
              })}
            </IonRow>
            <IonRow style={{ marginTop: '30px'}}>
            <IonTextarea label="Escriba el resumen del deporte " onInput={(e)=> setReporte(e.target.value)} labelPlacement="floating" fill="solid" required placeholder="Enter text"></IonTextarea>
            </IonRow>
             
          </IonGrid>
        </IonItemGroup>
        <IonButton expand="full"  onClick={handleGuardar} >
          Reporte
        </IonButton>
       <IonAlert
       isOpen={showConfirmAlert}
       header="Confirmación"
       message={'¿Estás seguro de que deseas guardar los siguientes datos?'}
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
<IonAlert
    isOpen={showCamposVaciosAlert}
    header={'Solicitud enviada'}
    message={"Su reporte se logro con exito"}
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
       
      </div>
  
    )
}


export default Alerta;
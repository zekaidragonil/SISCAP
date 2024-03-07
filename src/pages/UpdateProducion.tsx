import { IonAlert, IonBackButton, IonButton, IonButtons, IonCol, IonDatetime, IonDatetimeButton, IonGrid, IonHeader, IonInput, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonModal, IonRow, IonTextarea, IonTitle, IonToolbar } from "@ionic/react";
import React, { useEffect, useState} from 'react';
import { groupOne, groupTwo } from '../components/input'
import { useParams, useHistory } from 'react-router-dom';
import { db, auth } from '../firebaseConfig/firebase';
import { doc, getDoc,updateDoc, collection } from 'firebase/firestore';
const Update: React.FC = () =>{
    const { id } = useParams<{ id: string }>();
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
        const combinedInputValues: { [key: string]: any } = {};
      
        // ... Código para llenar combinedInputValues ...
        [...groupOne, ...groupTwo].forEach((item) => {
            const value = inputValues[item.name] || '';
            combinedInputValues[item.name] = value;
          });
        const fechaActual = new Date();
        const dia = fechaActual.getDate();
        const mes = fechaActual.getMonth();
        const ano = fechaActual.getFullYear();
        const fechaClave = `${dia}-${mes}-${ano}`;
      
        combinedInputValues.fecha_actualizacion = fechaClave;
        combinedInputValues.reporte_actualizacion = Reporte;
        combinedInputValues.usuario_actualizacion = usuario.email;
        //combinedInputValues.id = id;
        //combinedInputValues.estatus = 'pagado';
      
        const docRef = doc(db, 'Plants', id);
        const docSnapshot = await getDoc(docRef);
      
        if (docSnapshot.exists()) {
          const plantaData = docSnapshot.data();
          const produccion = { ...plantaData.Produccion };
          const alerta = { ...plantaData.reportes};
      
          // Utiliza filter para buscar el elemento por su 'key'
          const elementosEncontrados = Object.values(produccion).filter((item: any) => item.key === key);
          const alertRepote = Object.values(alerta).filter((item: any) => item.key === key) as { estatus: string }[];
      
          if (elementosEncontrados.length > 0  && alertRepote.length > 0)  {
           
            alertRepote[0].estatus = 'completado';

            const elementoEncontrado = elementosEncontrados[0];
          
            for (const campo in combinedInputValues) {
              elementoEncontrado[campo] = combinedInputValues[campo];
            }
            await updateDoc(docRef, { Produccion: produccion });
            await updateDoc(docRef, { reportes: alerta });
            setShowCamposVaciosAlert(true);

          }
        }
      };
      
    return(
        <div>
        <IonHeader>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonBackButton defaultHref='/solicitudes' />
                </IonButtons>
                <IonTitle> Actualizar registro </IonTitle>
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

export default Update;
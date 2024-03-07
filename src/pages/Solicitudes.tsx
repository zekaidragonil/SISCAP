import { IonButton, IonCol, IonContent, IonHeader, IonItem, IonLabel, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { datoPlantas } from "./helper";
import { createOutline, eyeSharp } from "ionicons/icons";
import '../pages/Page.css'


const Solicitudes: React.FC = () => {
    const [entregado, setEntregado] = useState(false);
    const [recibido, setRecibido] = useState(true);
    const [ solicitud, setSolicitud ] = useState<any[]>([]); 
    const [ completado, setCompletado ] = useState<any[]>([]); 
   
  useEffect(()=>{
  const Reportes = async () =>{
    let Completaod:any = []; 
    let Cantidad:any = []
    const Report = await datoPlantas();
    const solicitud = Report.forEach(element => {
      if(element.reportes){
       const repoteEncontrado = Object.values(element.reportes)
      const condicion =  repoteEncontrado.filter((item) => item.estatus === 'solicitud');
       Cantidad = condicion;
      }
      const completado = Object.values(element.reportes)
      const condicion =  completado.filter((it) => it.estatus === 'completado');
       Completaod = condicion;

    });
    
    setCompletado(Completaod)
    setSolicitud(Cantidad);
  }   
 Reportes();
  },[])


   return(
    <IonPage>
    <IonHeader>
      <IonToolbar>
      <IonTitle>{entregado ? 'Completado' : 'Recibidos'}</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
     <IonRow>
    <IonCol size="6" >
    <IonButton color="secondary" expand="full"onClick={() => { setEntregado(false);setRecibido(true);}} >Recibidos </IonButton>
    </IonCol>
    <IonCol size="6" >
    <IonButton  color="secondary" expand="full" onClick={() => { setEntregado(true); setRecibido(false)}}> Completado </IonButton>
    </IonCol>
    </IonRow>
      {recibido && (
         solicitud.map((user, index) => (
            <IonItem key={index} routerLink={`/showreport/${user['id']}?key=${user['key']}`} button detail={true} detailIcon={eyeSharp}>
              <IonLabel>
                <h3><span style={{fontWeight:550}}>Codigo  de la planta : </span> {user['id']}   -  <span style={{fontWeight:550}}> Correo del usuario:</span> {user['usuario']} </h3>
                <p> <span style={{fontWeight:550}} >Solicitud del reporte :</span> {user['Report']}   -     <span style={{fontWeight:550}}> {user['fecha']}</span></p>
              </IonLabel>
            </IonItem>
          ))
        )}

        {entregado && (
           completado.map((user, index) => (
            <IonItem key={index} routerLink={`/showreport/${user['id']}?key=${user['key']}`} button detail={true} detailIcon={eyeSharp}>
              <IonLabel>
                <h3><span style={{fontWeight:550}}>Codigo  de la planta : </span> {user['id']}   -  <span style={{fontWeight:550}}> Correo del usuario:</span> {user['usuario']} </h3>
                <p> <span style={{fontWeight:550}} >Solicitud del reporte :</span> {user['Report']}   -     <span style={{fontWeight:550}}> {user['fecha']}</span></p>
              </IonLabel>
            </IonItem>
          ))
        )}
    </IonContent>
  </IonPage>
   );
}

export default Solicitudes
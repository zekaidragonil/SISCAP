import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonText, IonTitle, IonToolbar } from "@ionic/react";
import { datoPlantas } from "./helper";

const ShowReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const key = new URLSearchParams(window.location.search).get('key');
  const [datos, setDatos] = useState<any[]>([]);

  useEffect(() => {
    const fetchReportes = async () => {
      const Report = await datoPlantas();
      const Cantidad: any[] = [];

      Report.forEach(element => {
        if (element.reportes) {
          const reportesEncontrados = Object.values(element.reportes);
          const condicion = reportesEncontrados.filter((item: any) => item.key === key);
          Cantidad.push(...condicion);
        }
      });

      setDatos(Cantidad);
    }

    fetchReportes();
  }, [id]);

  const renderRow = (label: string, value: any) => (
    <IonItem key={label}>
      <IonCol size="3">
        <IonLabel>{label}:</IonLabel>
      </IonCol>
      <IonCol size="9">
        <IonText>{value}</IonText>
      </IonCol>
    </IonItem>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
          <IonBackButton defaultHref="./" />
          </IonButtons>
          <IonTitle>Resumen de Solicitud</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {datos.map((user, index) => (
            <React.Fragment key={index}>
              {renderRow('Nombre', user.usuario)}
              {renderRow('Codigo de la Planta', user.id)}
              {renderRow('Fecha', user.fecha)}
              {renderRow('Uc entrada', user.UC_entrada)}
              {renderRow('Caudal', user.caudal)}
              {renderRow('Caudal salida', user.caudal_salidad)}
              {renderRow('Cloro', user.cloro_dosificado)}
              {renderRow('Cloro residual', user.cloro_residual)}
              {renderRow('Sulfato', user.sulfato_aluminio_dosificado)}
              {renderRow('Ntu entrada', user.ntu_entrada)}
              {renderRow('Ntu salida', user.ntu_salida)}
              {renderRow('Reporte', user.Report)}
               
              {/* Agrega más campos aquí si es necesario */}
            </React.Fragment>
          ))}
        </IonList>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
      {/* <IonButton routerLink={`/update_produccion/${id}?key=${key}`}>Actualizar</IonButton> */}
    </div>

      </IonContent>
    </IonPage>
  );
}

export default ShowReport;

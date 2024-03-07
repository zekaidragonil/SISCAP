import { IonButtons,  IonCard,  IonCardContent,  IonCardHeader,  IonCardSubtitle,  IonCardTitle,  IonCol,  IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { usuarioData, datoPlantas  } from "../pages/helper"; 
import { add, eyeOutline } from "ionicons/icons";
import LineChart from "../components/Graficos";
import { Link } from "react-router-dom";
const Gerente: React.FC = () =>{
  const [inventoryItems, setInventoryItems] = useState<{ codigo: string , name: string }[]>([])
    const [userPlant, setUserPlant] = useState<[Plant:string]>();
      const [cloroTotal, setCloroTotal] = useState(0);
      const [SulfatoTotal, setSulfatoTotal] = useState(0);
      const [CaudalTotal, setCaudalTotal] = useState(0);

   

    useEffect(() => {
        const DatoPlanta = async () => {
          try {
            const PlanTuser = await usuarioData();
        
            if (PlanTuser !== null) {
              const Plant = PlanTuser[1]
              // consulta de la plantas
             
               const plantas = await datoPlantas();   
               const plantaEncontrada: any = plantas.filter((plant: any) => plant.hidrologica === Plant);
                   
               let sumaUCEntrada = 0;
               let sumaCloro = 0;
               let sumaSulfato = 0;
               let sumaCaudal = 0;

     
               plantaEncontrada.forEach((planta: any) => {
               
                if (planta.Produccion) {
                  const produccionValues = Object.values(planta.Produccion);
                  const ultimosRegistros = produccionValues.slice(-7);
              
                  ultimosRegistros.forEach((registro: any) => {
                
                    if (registro.UC_entrada) {
                      sumaUCEntrada += parseFloat(registro.UC_entrada);
                     
                    }
                    if (registro.cloro_dosificado) {
                      sumaCloro += parseFloat(registro.cloro_dosificado);
                    }
                    if (registro.sulfato_aluminio_dosificado) {
                      sumaSulfato += parseFloat(registro.sulfato_aluminio_dosificado);
                    }
                    if (registro.caudal) {
                      sumaCaudal += parseFloat(registro.caudal);
                    }
                  });
            
                
                }
                });
                 //sumaUCEntrada.toFixed(2));
             
                 setCloroTotal(sumaCloro);
                 setSulfatoTotal(sumaSulfato);
                 setCaudalTotal(sumaCaudal);
                 setInventoryItems(plantaEncontrada)
                 setUserPlant(Plant)
            }
          } catch (error) {
            console.log(error);
          }
        };
        DatoPlanta();
      },[userPlant]);


 
const labels = ['cloro' ,'sulfato ', 'caudal']
const combinedData = {
  cloro: cloroTotal,
  sulfato: SulfatoTotal,
  caudal: CaudalTotal,
};
     
      return(    
        <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>{userPlant}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonToolbar>
        <LineChart
     labels={labels}
     data={combinedData}
        />
        <IonCard>
        <IonCardContent>
        <IonCardHeader>
     <IonCardTitle class='blanc'>Datos de los ultimos 7 dias</IonCardTitle>
              <IonCardSubtitle></IonCardSubtitle>
          </IonCardHeader>
          <IonGrid>
            <IonRow>
              <IonCol size="4">
                <IonCardSubtitle>Cloro:</IonCardSubtitle>
                <IonCardTitle>{cloroTotal.toFixed(2)}</IonCardTitle>
              </IonCol>

              <IonCol size="4">
           
                <IonCardSubtitle>Sulfato:</IonCardSubtitle>
                <IonCardTitle>{SulfatoTotal.toFixed(2)}</IonCardTitle>
              </IonCol>

              <IonCol size="4">
                <IonCardSubtitle>Caudal:</IonCardSubtitle>
                <IonCardTitle>{CaudalTotal.toFixed(2)}</IonCardTitle>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>
        </IonToolbar>
        <IonContent>
        <IonList>
        <IonList>
  {inventoryItems.map((plant) => (
    <Link to={`/showplant/${plant.codigo}`} className="seleccion" key={plant.codigo}>
      <IonItem button detail={true} detailIcon={eyeOutline}>
        <IonLabel>
          <h3>{plant.codigo}</h3>
          <p>{plant.name}</p>
        </IonLabel>
      </IonItem>
    </Link>
  ))}
</IonList>

     </IonList>
        </IonContent>
      </IonPage>  

    );
} 

export default Gerente
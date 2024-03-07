import React, { useEffect, useState } from "react"
import { useParams , useLocation, useHistory  } from 'react-router-dom'
import { datoPlantas } from "./helper";
import { IonBackButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar } from "@ionic/react";
import { arrowDownCircleOutline, eyeOutline } from "ionicons/icons";
import LineWeb from "../components/GraficosWeb";

const EstadosMapa: React.FC = () =>  {
    const { id } = useParams<{ id: string }>();
    const [inventoryItems, setInventoryItems] = useState<any[]>([]);
    const [Grafica,  setGrafica] = useState([]);
    const [cloroTotal, setCloroTotal] = useState(0);
    const [SulfatoTotal, setSulfatoTotal] = useState(0);
    const [CaudalTotal, setCaudalTotal] = useState(0);
    const [opcionSeleccionada, setOpcionSeleccionada] = useState('semana');
    const location = useLocation();
    const history = useHistory();


    

    useEffect(()=> {
   const MapeoData = async () =>{    
    const datos = await datoPlantas();
    const plantaEncontrada: any = datos.filter((plant: any) => plant.estado === id);
               let sumaUCEntrada = 0;
               let sumaCloro = 0;
               let sumaSulfato = 0;
               let sumaCaudal = 0;  
               const graficaData = [];       
               plantaEncontrada.forEach((planta: any) => {
                if (planta.Produccion) {
                  const produccionValues = Object.values(planta.Produccion);
                                        
                  graficaData.push(...produccionValues);
                  const ultimosRegistros = produccionValues.slice(-30);      
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

                setGrafica(graficaData);
                setInventoryItems(plantaEncontrada);
                  setCloroTotal(sumaCloro);
                  setSulfatoTotal(sumaSulfato);
                  setCaudalTotal(sumaCaudal);
            
                
               }

             MapeoData();
      },[id, opcionSeleccionada ])

    const cambiarOpcion = (event:any) => {
        const opcion = event.target.value;
        setOpcionSeleccionada(opcion);
      };
      const labels = ['cloro' ,'sulfato ', 'caudal']




    
  
   





    return (
        <IonPage key={location.key}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
            <IonBackButton defaultHref="/dashboard" />
            </IonButtons>
            <IonTitle>Producción de  {id} </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonGrid>
           <IonRow>
              <IonCol size='12' >
                <IonTitle className='ce'>Seleciones un periodo:</IonTitle>
              <IonSelect className=''
                  interface="action-sheet"
                  placeholder="Seleccionar período"
                  value={opcionSeleccionada} 
                  onIonChange={cambiarOpcion}
                  style={{ marginLeft: '50px', marginBottom: '20px' }}
                >
                  <IonSelectOption value="semana">Semanal</IonSelectOption>
                  <IonSelectOption value="mes">Mensual</IonSelectOption>
                  <IonSelectOption value="trimestral">Trimestral</IonSelectOption>
                  <IonSelectOption value="anual">Anual</IonSelectOption>
                </IonSelect>
              </IonCol>
              </IonRow>

         <IonCard className="grafica">
          <IonCardContent>
       
        <LineWeb id={id} labels={labels} dia={opcionSeleccionada} data={Grafica}  />
     </IonCardContent>
        </IonCard>
            <IonCard>
          <IonCardContent>
          <IonCardHeader>
       <IonCardTitle class='blanc'>Producion de los 30 dias</IonCardTitle>
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
            <IonCard className="plants" >
                      <IonCardHeader>
                        <IonCardTitle class='blanc'>Plantas del estado {id}</IonCardTitle>
                        <IonCardSubtitle></IonCardSubtitle>
                      </IonCardHeader>
                    </IonCard>
                    <IonList>
    {inventoryItems.map((plant) => (
      <IonItem key={plant.codigo} routerLink={`/showplant/${plant.codigo}`} button detail={true} detailIcon={eyeOutline}>
        <IonLabel>
          <h3>{plant.name} ({plant.codigo})</h3>
          <p>{plant.hidrologica}</p>
        </IonLabel>
      </IonItem>
    ))}
  </IonList>
          </IonGrid>
        </IonContent>
      </IonPage>
    )
  }


export default EstadosMapa

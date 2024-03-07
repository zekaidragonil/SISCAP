import { IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonFabButton, IonGrid, IonHeader, IonIcon, IonMenuButton, IonPage, IonRouterLink, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { personAddOutline, arrowForwardCircleOutline, podiumOutline } from 'ionicons/icons';
import React, { useEffect , useState} from 'react';
import { usuarioData, datoPlantas } from '../pages/helper'
import Mapa  from '../components/Mapa'

const dashboard: React.FC = () => {
  const [numUsers, setNumUsers] = useState(0);
  const [numPlants, setNumPlants] = useState(0);
  const [cloroTotal, setCloroTotal] = useState(0);
  const [SulfatoTotal, setSulfatoTotal] = useState(0);
  const [CaudalTotal, setCaudalTotal] = useState(0);

    useEffect(() => {
      const Datos =  async () =>{
        const Users = await usuarioData();
        const numero =   Users[2];
        setNumUsers(numero)     
      }
    Datos();
    },[])


    useEffect(() => {
      const DatosPlant = async () => {
       const plant = await datoPlantas();
         if(plant){
           const cantidaPlant = plant.length;
           setNumPlants(cantidaPlant);

           let sumaUCEntrada = 0;
           let sumaCloro = 0;
           let sumaSulfato = 0;
           let sumaCaudal = 0;

           plant.forEach((p) =>{
           if(p.Produccion){
           const produccion = Object.values(p.Produccion);
           const ultimosRegistros = produccion.slice(-30);
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
           })
           setCloroTotal(sumaCloro);
           setSulfatoTotal(sumaSulfato);
           setCaudalTotal(sumaCaudal);
          }  
      }  
      DatosPlant();
     },[]);


  return (
  <IonPage> 
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonMenuButton />
        </IonButtons>
        <IonTitle>Dashboard</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen>
      <IonGrid fixed={true} style={{ position: 'relative', zIndex: 1 }}>
        <IonRow>
          <IonCol size='6'>
            <IonRouterLink routerLink='/User'>
              <IonCard className='color'>
                <IonCardContent>
                  <IonRow>
                    <IonCol size="6" className='tamaño'>
                      <h2>{numUsers}</h2>
                      <p>Usuarios registrados</p>
                    </IonCol>
                    <IonCol size="6">
                      <IonIcon className="large-icon" icon={personAddOutline}></IonIcon>
                    </IonCol>
                  </IonRow>
                </IonCardContent>
                <IonCardSubtitle className='borde'>
                  <span>Ver usuarios</span>
                  <IonIcon className='siguiente' icon={arrowForwardCircleOutline}></IonIcon>
                </IonCardSubtitle>
              </IonCard>
            </IonRouterLink>
          </IonCol>
          <IonCol size='6'>
            <IonRouterLink routerLink='/busqueda' >
              <IonCard className='color'>
                <IonCardContent>
                  <IonRow>
                    <IonCol size="6" className='tamaño'>
                      <h2>{numPlants}</h2>
                      <p>Plantas registradas</p>
                    </IonCol>
                    <IonCol size="6">
                      <IonIcon className="large-icon" icon={podiumOutline}></IonIcon>
                    </IonCol>
                  </IonRow>
                </IonCardContent>
                <IonCardSubtitle className='borde'>
                  <span>Ver plantas</span>
                  <IonIcon className='siguiente' icon={arrowForwardCircleOutline}></IonIcon>
                </IonCardSubtitle>
              </IonCard>
            </IonRouterLink>
          </IonCol>
        </IonRow>
        <IonCard className='color'>
          <IonCardContent>
            <IonCardHeader>
              <IonCardTitle class='texto'>Producción y Consumo Nacional en los últimos 30 días. </IonCardTitle>
              <IonCardSubtitle></IonCardSubtitle>
            </IonCardHeader>
            <IonGrid>
              <IonRow>
                <IonCol size="4">
                  <IonCardSubtitle className='tex'>Inventario de Cloro (kg):</IonCardSubtitle>
                  <IonCardTitle className='nume'>{cloroTotal.toFixed(2)}</IonCardTitle>
                </IonCol>
                <IonCol size="4">
                  <IonCardSubtitle className='tex'> Inventario de Sulfato de aluminio (kg):</IonCardSubtitle>
                  <IonCardTitle className='nume'>{SulfatoTotal.toFixed(2)}</IonCardTitle>
                </IonCol>
                <IonCol size="4">
                  <IonCardSubtitle className='tex'>Caudal (lps):</IonCardSubtitle>
                  <IonCardTitle className='nume'> {CaudalTotal.toFixed(2)}</IonCardTitle>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
      </IonGrid>
       <div style={{ position: 'relative', zIndex: 0 }}>
       <Mapa />
     </div>
    </IonContent>
  </IonPage>
  );
}

export default dashboard;

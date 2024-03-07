
import React, { useEffect, useState } from "react"
import { useParams , useLocation, useHistory  } from 'react-router-dom'
import { datoPlantas, usuarioData } from "./helper";
import { IonBackButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar } from "@ionic/react";
import { arrowDownCircleOutline, eyeOutline } from "ionicons/icons";
import LineWeb from "../components/GraficosWeb";

const UTA: React.FC = () =>{

    const [inventoryItems, setInventoryItems] = useState<any[]>([]);
    const [Grafica,  setGrafica] = useState<any[]>([]);
    const [name, setEstado] = useState('');
    const [cloroTotal, setCloroTotal] = useState(0);
    const [SulfatoTotal, setSulfatoTotal] = useState(0);
    const [CaudalTotal, setCaudalTotal] = useState(0);
    const [opcionSeleccionada, setOpcionSeleccionada] = useState('semana');
    const [CaudalSalidaTotal, setCaudalTotalSalida] = useState(0);
    const [UcEntrada, setUcEntrada] = useState(0);
    const [CloroResidual, setCloroResidual] = useState(0);
    const [NtuEntrada, setNtuEntrada] = useState(0);
    const [NtuSalida, setNtuSalida] = useState(0);
    const location = useLocation();
    const history = useHistory();
    



  
    useEffect(()=> {

   const MapeoData = async () =>{  
    
      const  data =  await usuarioData();  
        const estado = data[1] 
    
         setEstado(estado)
    const datos = await datoPlantas();
    const plantaEncontrada: any = datos.filter((plant: any) => plant.estado ===  estado);
      let sumaUCEntrada = 0;
    let sumaCloro = 0;
    let sumaSulfato = 0;
    let sumaCaudalSalida = 0;
    let sumaCloroResidual = 0;
    let sumaNtuEntrada = 0;
    let sumaNtuSalida = 0;
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
          if (registro.Caudal_salida) {
            sumaCaudalSalida += parseFloat(registro.Caudal_salida);
          }
          if (registro.UC_entrada) {
            sumaUCEntrada += parseFloat(registro.UC_entrada);
          }
          if (registro.cloro_residual) {
            sumaCloroResidual += parseFloat(registro.cloro_residual);
          }
          if (registro.ntu_entrada) {
            sumaNtuEntrada += parseFloat(registro.ntu_entrada);
          }
          if (registro.ntu_salida) {
            sumaNtuSalida += parseFloat(registro.ntu_salida);
          }
                  });
                
                  }
                });

                setGrafica(graficaData);
                setInventoryItems(plantaEncontrada);
                setCloroTotal(sumaCloro);
                setSulfatoTotal(sumaSulfato);
               setCaudalTotal(sumaCaudal);
                setCaudalTotalSalida(sumaCaudalSalida);
                setUcEntrada(sumaUCEntrada);
               setCloroResidual(sumaCloroResidual);
                setNtuEntrada(sumaNtuEntrada)
                setNtuSalida(sumaNtuSalida)
               }

             MapeoData();
      },[  opcionSeleccionada ])


    const cambiarOpcion = (event:any) => {
        const opcion = event.target.value;
        setOpcionSeleccionada(opcion);
      };
      const labels = ['cloro' ,'sulfato ', 'caudal']

      



  return(
   
    <IonPage key={location.key}>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
     
        </IonButtons>
        <IonTitle>Producción de  {name} </IonTitle>
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
   
    <LineWeb  id={name} labels={labels} dia={opcionSeleccionada} data={Grafica}  />
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
            <IonCol size="3 ">
              <IonCardSubtitle>Inventario Cloro (kg) :</IonCardSubtitle>
              <IonCardTitle>{cloroTotal.toFixed(2)}</IonCardTitle>
            </IonCol>

            <IonCol size="3">
         
              <IonCardSubtitle>Inventario Sulfato de aluminio (kg) :</IonCardSubtitle>
              <IonCardTitle>{SulfatoTotal.toFixed(2)}</IonCardTitle>
            </IonCol>

            <IonCol size="3">
              <IonCardSubtitle>Caudal Entrada (lps) :</IonCardSubtitle>
              <IonCardTitle>{CaudalTotal.toFixed(2)}</IonCardTitle>
            </IonCol>
            <IonCol size="3">
              <IonCardSubtitle>Caudal Salida (lps):</IonCardSubtitle>
              <IonCardTitle>{CaudalSalidaTotal.toFixed(2)}</IonCardTitle>
            </IonCol>
          </IonRow>
          <IonRow>

            <IonCol size="3">         
              <IonCardSubtitle>Precloracion (PPM) </IonCardSubtitle>
              <IonCardTitle>{UcEntrada.toFixed(2)}</IonCardTitle>
            </IonCol>

            <IonCol size="3">
              <IonCardSubtitle>Cloro Residual:</IonCardSubtitle>
              <IonCardTitle>{CloroResidual.toFixed(2)}</IonCardTitle>
            </IonCol>
            <IonCol size="3">
              <IonCardSubtitle>Ntu Entrada:</IonCardSubtitle>
              <IonCardTitle>{NtuEntrada.toFixed(2)}</IonCardTitle>
            </IonCol>

            <IonCol size="3">
         
              <IonCardSubtitle>Ntu Salida </IonCardSubtitle>
              <IonCardTitle>{NtuSalida.toFixed(2)}</IonCardTitle>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
        <IonCard className="plants" >
           <IonCardHeader>
            <IonCardTitle class='blanc'>Plantas del estado </IonCardTitle>
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



export default UTA;
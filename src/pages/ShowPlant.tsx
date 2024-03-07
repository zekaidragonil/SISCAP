import React, { useEffect, useState } from "react";
import { datoPlantas } from "../pages/helper";
import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import LineChart from "../components/Graficos";
import ReportCard from "../components/card";
import { useParams } from 'react-router-dom'
import LineWeb from "../components/GraficosWeb";

const showPlant: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [Plants, setPlant] = useState<any>({ name: "" });
  const [Inventory, setPlantInv] = useState<any>({});
  const [historico, setHistorico] = useState<any[]>([]);
  const [Grafica,  setGrafica] = useState<any[]>([]);
  const [cloroTotal, setCloroTotal] = useState(0);
  const [SulfatoTotal, setSulfatoTotal] = useState(0);
  const [CaudalTotal, setCaudalTotal] = useState(0);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState('semana');

  useEffect(() => {
    const DatoPlanta = async () => {
      try {
        const plantas = await datoPlantas();
        const plantaEncontrada: any = plantas.find((plant: any) => plant.codigo === id);

        if (plantaEncontrada) {
          let sumaUCEntrada = 0;
          let sumaCloro = 0;
          let sumaSulfato = 0;
          let sumaCaudal = 0;

          if (plantaEncontrada.Produccion) {
            const produccionValues = Object.values(plantaEncontrada.Produccion);
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
            setGrafica(produccionValues);
          }

          setCloroTotal(sumaCloro);
          setSulfatoTotal(sumaSulfato);
          setCaudalTotal(sumaCaudal);
          setPlantInv(plantaEncontrada?.inventory);
          setPlant(plantaEncontrada);
          if(plantaEncontrada?.Produccion){
            setHistorico(plantaEncontrada?.Produccion);
          }
        
        } else {
          console.log("No se encontró la planta");
        }
      } catch (error) {
        console.log(error);
      }
    };
    DatoPlanta();
  }, [id]);

  const labels = ['cloro', 'sulfato', 'caudal'];
  const dias = 'semana'

  
  const cambiarOpcion = (event:any) => {
    const opcion = event.target.value;
    setOpcionSeleccionada(opcion);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
          <IonBackButton defaultHref="../" />
          </IonButtons>
          <IonTitle>{Plants.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard className="colores">
          <IonCardHeader>
            <IonCardTitle className="blanco">Inventario</IonCardTitle>
          </IonCardHeader>
          <IonGrid>
            <IonRow>
              <IonCol size="6">
                <IonCardTitle className="blance">Cloro (Cl2)</IonCardTitle>
                <IonCardSubtitle className="blanco">
                  {Inventory.cloro}
                </IonCardSubtitle>
              </IonCol>
              <IonCol size="6" className="inve">
                <IonCardTitle className="blance">
                  Al<sub>2</sub>(SO<sub>4</sub>)<sub>3</sub>
                </IonCardTitle>
                <IonCardSubtitle className="blanco">
                  {Inventory.sulfato}
                </IonCardSubtitle>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCard>
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
        <IonCard>
        <IonCardContent>
     <LineWeb name={Plants.name} dia={opcionSeleccionada} labels={labels} data={Grafica} />
</IonCardContent>
        </IonCard>
        <IonRow>
          <IonCol size="12">
            
              <ReportCard
                title="Reporte de consumo"
                data={historico}
                keys={["fecha", "cloro", "sulfato", "caudal"]}
                keyMap={{
                  fecha: "fecha",
                  cloro: "cloro_dosificado",
                  sulfato: "sulfato_aluminio_dosificado",
                  caudal: "caudal",
                }}
              />
          
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default showPlant;

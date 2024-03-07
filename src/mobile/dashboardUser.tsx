import React, { useEffect, useState } from "react";
//import "./android.css";
import { usuarioData, datoPlantas  } from "../pages/helper";
import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  IonMenuButton,
  IonText,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import LineChart from "../components/Graficos";
import { add,  ellipseSharp,  fileTrayFullOutline, storefrontOutline } from "ionicons/icons";
import ReportCard from "../components/card";
import { Link } from "react-router-dom";
import LineWeb from "../components/GraficosWeb";


const UsuarioDashboard: React.FC = () => {
  const [Plants, setPlant] = useState<any>("");
  const [rol, setRol] = useState("");
  const [Inventory, setPlantInv] = useState<any>([]);
  const [historico, setHistorico] = useState<any[]>([]);
  const [Grafica,  setGrafica] = useState<any[]>([]);
  const [cloroTotal, setCloroTotal] = useState(0);
  const [SulfatoTotal, setSulfatoTotal] = useState(0);
  const [CaudalTotal, setCaudalTotal] = useState(0);
  const [CaudalSalidaTotal, setCaudalTotalSalida] = useState(0);
  const [UcEntrada, setUcEntrada] = useState(0);
  const [CloroResidual, setCloroResidual] = useState(0);
  const [NtuEntrada, setNtuEntrada] = useState(0);
  const [NtuSalida, setNtuSalida] = useState(0);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState('semana');

  const id = Plants.codigo;


  interface Planta {
    name: string;
    inventory: string[];
    cloro: string;
    Produccion: string[];
  }

  useEffect(() => {
    const DatoPlanta = async () => {
      try {
        const PlanTuser = await usuarioData();
    
        if (PlanTuser !== null) {
          const Plant = PlanTuser[1]
          const rol = PlanTuser[0];
          // consulta de la plantas
         
          setRol(rol)
          const plantas = await datoPlantas();

          

          const plantaEncontrada: any = plantas.find((plant: any) => plant.name === Plant);
          let sumaUCEntrada = 0;
          let sumaCloro = 0;
          let sumaSulfato = 0;
          let sumaCaudalSalida = 0;
          let sumaCloroResidual = 0;
          let sumaNtuEntrada = 0;
          let sumaNtuSalida = 0;
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
         setGrafica(produccionValues);
        }   

        
          if (plantaEncontrada) {
            setPlantInv(plantaEncontrada?.inventory);
            setPlant(plantaEncontrada);
            setHistorico(plantaEncontrada?.Produccion);
            setCloroTotal(sumaCloro);
             setSulfatoTotal(sumaSulfato);
            setCaudalTotal(sumaCaudal);
             setCaudalTotalSalida(sumaCaudalSalida);
             setUcEntrada(sumaUCEntrada);
            setCloroResidual(sumaCloroResidual);
             setNtuEntrada(sumaNtuEntrada)
             setNtuSalida(sumaNtuSalida)
          } else {
            console.log("No se encontró la planta");
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    DatoPlanta();
  }, [Plants, opcionSeleccionada]);


  const cambiarOpcion = (event:any) => {
    const opcion = event.target.value;
    setOpcionSeleccionada(opcion);
  };
  const labels = ['cloro', 'sulfato', 'caudal'];
  const dias = 'semana'


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
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
                <IonCardTitle class="blance">Cloro (Cl2)</IonCardTitle>
                <IonCardSubtitle class="blanco">
                  {Inventory.cloro}
                </IonCardSubtitle>
              </IonCol>
              <IonCol size="6" class="inve">
                <IonCardTitle class="blance">
                  Al<sub>2</sub>(S0<sub>4</sub>)<sub>3</sub>
                </IonCardTitle>
                <IonCardSubtitle class="blanco">
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
        <IonCard className="plants">
          <IonCardContent>
           <LineWeb name={Plants.name}
         dia={opcionSeleccionada} labels={labels} data={Grafica} 
           /> 
      </IonCardContent>
        </IonCard>
        <IonCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',  }}>
        <IonCardTitle style={{margin: '10px 0'}} >Leyenda de la Grafica</IonCardTitle>
               
  <IonRow>
  <IonText style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '5px 0' }}>
      <IonIcon icon={ellipseSharp} style={{ color: 'rgba(94, 94, 94, 1)' }}></IonIcon> Inventario Sulfato de aluminio (kg) : {SulfatoTotal}
    </IonText>
  </IonRow>
  
  <IonRow>
  <IonText style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '5px 0' }}>
      <IonIcon icon={ellipseSharp} style={{ color: 'rgba(75, 192, 192, 1)' }}></IonIcon> Caudal Entrada (lps) : {CaudalTotal}
    </IonText>
  </IonRow>
  
  <IonRow>
    <IonText>
      <IonIcon icon={ellipseSharp} style={{ color: 'rgba(76, 40, 130, 1)' }}></IonIcon> Inventario  Cloro (kg) : {cloroTotal}
    </IonText>
  </IonRow>
  <IonRow>
  <IonText style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '5px 0' }}>
      <IonIcon icon={ellipseSharp} style={{ color: 'rgba( 90,  20, 50, 1)' }}></IonIcon> Precloracion (PPM)  : {UcEntrada}
    </IonText>
  </IonRow>

  <IonRow>
  <IonText style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '5px 0' }}>
      <IonIcon icon={ellipseSharp} style={{ color: 'rgba(75, 120, 180, 1)' }}></IonIcon> Caudal Salida (lps): {CaudalSalidaTotal}
    </IonText>
  </IonRow>

  <IonRow>
  <IonText style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '5px 0' }}>
      <IonIcon icon={ellipseSharp} style={{ color: 'rgba(0,0,255,1)' }}></IonIcon> Cloro Residual: {CloroResidual}
    </IonText>
  </IonRow>
 
  <IonRow>
  <IonText style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '5px 0' }}>
      <IonIcon icon={ellipseSharp} style={{ color: 'rgba(255,255,0,1)' }}></IonIcon> Ntu entrada : {UcEntrada}
    </IonText>
  </IonRow>
  
  <IonRow>
  <IonText style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '5px 0' }}>
      <IonIcon icon={ellipseSharp} style={{ color: 'rgba(128,0,128,1)' }}></IonIcon> Ntu salida: {NtuSalida}
    </IonText>
  </IonRow>
 
 
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
                caudal: "caudal"
              }}
              id={id}
              rol={rol}
              />

          </IonCol>
          {/* <IonCol size="12">
            <ReportCard
              title="Reporte de Produccion"
              data={historico}
              keys={["fecha", "UC_entrada", "ntu_entrada", "ntu_salida"]}
              keyMap={{
                fecha: "fecha",
                UC_entrada: "UC_entrada",
                sulfato: "sulfato_dosificado",
                ntu_entrada: "ntu_entrada",
                ntu_salida: "ntu_salida",
              }}

            />
          </IonCol> */}
        </IonRow>
      </IonContent>
      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton>
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>
        <IonFabList side="top">
        <Link to={`/inventario/${id}`}>
          <IonFabButton
            title="Agregar inventario"
            data-for="addInventoryTooltip"
          >
            <IonIcon icon={storefrontOutline}></IonIcon>
          </IonFabButton>
          </Link>
           <Link to={`/produccion/${id}`}>
          <IonFabButton title="Reporte del dia">
            <IonIcon icon={fileTrayFullOutline}></IonIcon>
          </IonFabButton>
          </Link>
        </IonFabList>
      </IonFab>
    </IonPage>
  );
};

export default UsuarioDashboard;

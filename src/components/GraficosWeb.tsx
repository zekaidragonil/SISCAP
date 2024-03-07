import React, { useEffect, useRef, FC, useMemo, useCallback } from "react";
import { Chart, CategoryScale, LinearScale, LineController, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { jsPDF } from 'jspdf';
Chart.register(CategoryScale, LinearScale, LineController, PointElement, Title, Tooltip, Legend);
import { useMediaQuery } from 'react-responsive';
import { IonButton, IonIcon } from "@ionic/react";
import { arrowDownCircleOutline } from "ionicons/icons";


interface LineChartProps {
  labels: string[];
  data: any[];
  dia: string;
  id: string;
  name: string;

  
}

const LineWeb: FC<LineChartProps> = ({ labels, data, dia, id, name, }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  // Memoriza los datos calculados
  const ultimosRegistros = useMemo(() => {
    let diasAtras = -7; // Por defecto, semanal

    if (dia === 'mes') {
      diasAtras = -30;
    } else if (dia === 'trimestral') {
      diasAtras = -90;
    } else if (dia === 'anual') {
      diasAtras = -365;
    }
    return data.slice(diasAtras);

  }, [data, dia]);

let dias  = 7
  
if (dia === 'mes') {
  dias =  30;
} else if (dia === 'trimestral') {
  dias =  90;
} else if (dia === 'anual') {
  dias =  365;
}
  

//totales
const totalCloro = useMemo(() => {
  const cloroArray = ultimosRegistros.map((item: any) => parseFloat(item.cloro_dosificado));
  const total = cloroArray.reduce((acc, current) => acc + current, 0);
  return total.toFixed(0);
}, [ultimosRegistros]);

const totalSulfato = useMemo(() => {
  const cloroArray = ultimosRegistros.map((item: any) => parseFloat(item.sulfato_aluminio_dosificado));
  const total = cloroArray.reduce((acc, current) => acc + current, 0);
  return total.toFixed(0);
}, [ultimosRegistros]);

const totalCualdad = useMemo(() => {
  const cloroArray = ultimosRegistros.map((item: any) => parseFloat(item.caudal));
  const monto = cloroArray.reduce((acc, current) => acc + current, 0);
   const total = monto / dias 
  return total.toFixed(0);
}, [ultimosRegistros]);

const totalUC = useMemo(() => {
  const cloroArray = ultimosRegistros.map((item: any) => parseFloat(item.UC_entrada));
  const total = cloroArray.reduce((acc, current) => acc + current, 0);
  return total.toFixed(0);
}, [ultimosRegistros]);

const totalClororesidual = useMemo(() => {
  const cloroArray = ultimosRegistros.map((item: any) => parseFloat(item.cloro_residual));
  const total = cloroArray.reduce((acc, current) => acc + current, 0);
  return total.toFixed(2);
}, [ultimosRegistros]);

const Totalntu_entrada = useMemo(() => {
  const cloroArray = ultimosRegistros.map((item: any) => parseFloat(item.ntu_entrada));
  const total = cloroArray.reduce((acc, current) => acc + current, 0);
  return total.toFixed(0);
}, [ultimosRegistros]);

const Totalntu_salida = useMemo(() => {
  const cloroArray = ultimosRegistros.map((item: any) => parseFloat(item.ntu_salida));
  const total = cloroArray.reduce((acc, current) => acc + current, 0);
  return total.toFixed(0);
}, [ultimosRegistros]);


// datos de algoritmo 
const label = useMemo(() => ultimosRegistros.map((item: any) => item.fecha), [ultimosRegistros]);
const cloroData = useMemo(() => ultimosRegistros.map((item: any) => item.cloro_dosificado), [ultimosRegistros]);
const sulfatoData = useMemo(() => ultimosRegistros.map((item: any) =>item.sulfato_aluminio_dosificado), [ultimosRegistros]);
const CaudalData = useMemo(() => ultimosRegistros.map((item: any) => item.caudal), [ultimosRegistros]);
const Caudal_salida = useMemo(() => ultimosRegistros.map((item: any) => item.Caudal_salida), [ultimosRegistros]);
const UC_entrada = useMemo(() => ultimosRegistros.map((item: any) => item.UC_entrada), [ultimosRegistros]);
const cloro_residual = useMemo(() => ultimosRegistros.map((item: any) => item.cloro_residual), [ultimosRegistros]);
const ntu_entrada = useMemo(() => ultimosRegistros.map((item: any) => item.ntu_entrada), [ultimosRegistros]);
const ntu_salida = useMemo(() => ultimosRegistros.map((item: any) => item.ntu_salida), [ultimosRegistros]);

// const cloro_residual = useMemo(() => ultimosRegistros.map((item:any)=> console.log(item.cloro_dosificado)), [ultimosRegistros] )
// Utiliza useCallback para memoizar la función de destrucción del gráfico


const handleDownloadClick = () => {
  const canvas = canvasRef.current;
  const periodo = dia === 'semana' ? 7 : dia === 'mes' ? 30 : dia === 'trimestral' ? 90 : dia === 'anual' ? 365 : 7;
  if (canvas) {
    if(id || name){
      const pdf = new jsPDF('landscape');
      const canvasImgData = canvas.toDataURL('image/png', 1.0);
  
      pdf.text(`PRODUCCION DEL ESTADO ${id || name} EN LOS ULTIMOS ${periodo} DIAS`, 50, 20);
      pdf.addImage(canvasImgData, 'png', 15, 30, 270, 150);
  
      // Genera un Blob con el contenido del PDF
      const pdfBlob = pdf.output('blob');
  
      // Crea un objeto URL para el Blob
      const pdfUrl = URL.createObjectURL(pdfBlob);
  
      // Crea un enlace de descarga
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = pdfUrl;
      a.download = `PRODUCCION_DEL_ESTADO_${id || name}_EN_LOS_ULTIMOS_${periodo}_DIAS.pdf`;
  
      // Simula un clic en el enlace para iniciar la descarga
      document.body.appendChild(a);
      a.click();
  
      // Limpia el objeto URL
      URL.revokeObjectURL(pdfUrl);
      document.body.removeChild(a);
    }

  }
};


  const destroyChart = useCallback((canvas:any) => {
    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
      existingChart.destroy();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        destroyChart(canvas); // Destruye el gráfico anterior si existe

        new Chart(ctx, {
          type: 'line',
          data: {
            labels: label,
            datasets: [
              {
                label: `Cloro Total:${totalCloro} (kg)` ,
                data: cloroData,
                fill: false,
                borderColor: 'rgba(76, 40, 130, 1)',
                borderWidth: 1,
                pointBackgroundColor: 'rgba(76, 40, 130, 1)',
                pointStyle: 'circle',
                pointRadius: 5,
              },
              {
                label: `Sulfato Total:${totalSulfato}`,
                data: sulfatoData,
                fill: false,
                borderColor: 'rgba(94, 94, 94, 1)',
                borderWidth: 1,
                pointBackgroundColor: 'rgba(94, 94, 94, 1)',
                pointStyle: 'cross',
                pointRadius: 5,
              },
              {
                label: `Caudal Promedio ${totalCualdad} Lps`,
                data: CaudalData,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                pointStyle: 'star',
                pointRadius: 5,
              },
              {
                label: `Uc Entrada Total:${totalUC}`,
                data: UC_entrada,
                fill: false,
                borderColor: 'rgba(75,192,192,1',
                borderWidth: 1,
                pointBackgroundColor: 'rgba(75,192,192,1',
                pointStyle: 'rectRounded',
                pointRadius: 5,
              },
              {
                label: `Cloro residual Total: ${totalClororesidual} `,
                data: cloro_residual,
                fill: false,
                borderColor: 'rgba(0,0,255,1)',
                borderWidth: 1,
                pointBackgroundColor: 'rgba(0,0,255,1)',
                pointStyle: 'dash',
                pointRadius: 5,
              },
              {
                label: `Ntu entrada Total: ${Totalntu_entrada}`,
                data: ntu_entrada,
                fill: false,
                borderColor: 'rgba(255,255,0,1)',
                borderWidth: 1,
                pointBackgroundColor: 'rgba(255,255,0,1)',
                pointStyle: 'crossRot',
                pointRadius: 5,
              },
              {
                label: `Ntu salida Total: ${Totalntu_salida}`,
                data: ntu_salida,
                fill: false,
                borderColor: 'rgba(128,0,128,1)',
                borderWidth: 1,
                pointBackgroundColor: 'rgba(128,0,128,1)',
                pointStyle: 'rectRot',
                pointRadius: 5,
              },
            ],
          },
          options: {
            scales: {
              x: {
                beginAtZero: true,
              },
              y: {
                beginAtZero: true,
              },
            },
            plugins: {
              legend: {
                display: !isMobile,
              },
            },
          },
        });
      }
    }
  }, [label, cloroData, sulfatoData, CaudalData, destroyChart, isMobile]);
  return (
    <div>
      <canvas ref={canvasRef} className="chart-canvas"></canvas>
      <IonButton onClick={handleDownloadClick}>
        Descargar Gráfica
        <IonIcon ios={arrowDownCircleOutline} md={arrowDownCircleOutline} slot="end"></IonIcon>
      </IonButton>
    </div>
  );
};


export default LineWeb;

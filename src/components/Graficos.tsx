import React, { useEffect, useRef, FC } from "react";
import { Chart, DoughnutController, CategoryScale, Title, Tooltip, LineController, ArcElement, Decimation, LineElement, PointElement, LinearScale, Legend } from 'chart.js';
Chart.register(CategoryScale, DoughnutController, Title, Tooltip, LineController, LineElement, PointElement, LinearScale, Legend, ArcElement, Decimation);

interface LineChartProps {
  labels: string[];
  data: {
    cloro: number;
    sulfato: number;
    caudal: number;
  };
  colors?: string[]; 
}

const LineChart: FC<LineChartProps> = ({ labels, data }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const colors = ['rgba(76, 40, 130, 0.2)', 'rgba(94, 94, 94, 0.2)', 'rgba(75,192,192,1)'];


  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const existingChart = Chart.getChart(canvas);
        if (existingChart) {
          existingChart.destroy();
        }
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Valores',
                data: [data.cloro, data.sulfato, data.caudal], // Utiliza los valores combinados
                backgroundColor: colors,
                borderColor: ['rgba(76, 40, 130, 1)'],
                borderWidth: 1,
              },
            ],
          },
          // Resto de opciones...
        });
      }
    }
  }, [labels, data]);

  return <canvas ref={canvasRef} className="chart-canvas"></canvas>;
};

export default LineChart;

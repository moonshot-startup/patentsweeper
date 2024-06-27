// PieChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import "./pie-chart.css";

Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function PieChart({ percentage, title = 'no-title' }) {
  const data = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: ['#36A2EB', 'white'],
        hoverBackgroundColor: ['#36A2EB', 'white']
      }
    ]
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      datalabels: {
        display: true,
        formatter: (value, context) => {
          if (context.dataIndex === 0) {
            return `${percentage}%`;
          }
          return '';
        },
        color: '#000',
        font: {
          weight: 'bold',
          size: '20'
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    }
  };

  return (
  <div className='pie-container'>
    <Pie data={data} options={options} />
    <span>{title}</span>
  </div>
  );
};

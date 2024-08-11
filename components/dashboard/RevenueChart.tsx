import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { dummyRevenueData } from '@/lib/dummyData';


ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const RevenueChart: React.FC = () => {
  const chartData = {
    labels: dummyRevenueData.labels,
    datasets: [
      {
        label: 'Revenue',
        data: dummyRevenueData.values,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default RevenueChart;

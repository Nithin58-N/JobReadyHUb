import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export const ScoreHistoryChart = ({ history }) => {
    const data = {
        labels: history.map(h => new Date(h.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Job Readiness Score',
                data: history.map(h => h.score),
                borderColor: 'rgb(79, 70, 229)',
                backgroundColor: 'rgba(79, 70, 229, 0.5)',
                tension: 0.3
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Your Progress Over Time',
            },
        },
        scales: {
            y: {
                min: 0,
                max: 100
            }
        }
    };

    return <Line options={options} data={data} />;
};

export const ScoreDoughnut = ({ score }) => {
    const data = {
        labels: ['Readiness', 'To Go'],
        datasets: [
            {
                data: [score, 100 - score],
                backgroundColor: [
                    'rgba(79, 70, 229, 1)',
                    'rgba(229, 231, 235, 1)',
                ],
                borderWidth: 0,
            },
        ],
    };

    const options = {
        cutout: '70%',
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
        }
    };

    // Add text in center via plugin or just overlay div in parent
    return <Doughnut data={data} options={options} />;
}

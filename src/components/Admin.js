import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { ref, onValue, update } from 'firebase/database'; // Import necessary functions
import { Bar } from 'react-chartjs-2'; // Import Bar chart from Chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; // Import necessary Chart.js components
import '../CSS/Admin.css'; // Adjust the path as necessary

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Admin = () => {
    const [grievances, setGrievances] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Number of Complaints by Domain',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Number of Complaints by Problem',
                data: [],
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    });

    useEffect(() => {
        const grievancesRef = ref(db, 'grievances'); // Reference to the grievances node
        const unsubscribe = onValue(grievancesRef, (snapshot) => {
            const data = snapshot.val();
            const grievancesData = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
            setGrievances(grievancesData);
            updateChartData(grievancesData); // Call the function to update chart data
        }, (error) => {
            console.error("Error fetching grievances: ", error);
        });

        // Clean up the listener when the component unmounts
        return () => unsubscribe();
    }, []);

    const updateChartData = (data) => {
        const domainCount = {};
        const problemCount = {};

        data.forEach(grievance => {
            domainCount[grievance.domain] = (domainCount[grievance.domain] || 0) + 1;
            problemCount[grievance.problem] = (problemCount[grievance.problem] || 0) + 1;
        });

        setChartData({
            labels: Object.keys(domainCount), // Domains as labels
            datasets: [
                {
                    label: 'Number of Complaints by Domain',
                    data: Object.values(domainCount), // Counts of each domain
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Number of Complaints by Problem',
                    data: Object.values(problemCount), // Counts of each problem
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                },
            ],
        });
    };

    const handleStatusChange = (id, status) => {
        const grievanceRef = ref(db, `grievances/${id}`);
        update(grievanceRef, { status, lastUpdated: Date.now() }) // Adding lastUpdated timestamp
            .then(() => {
                console.log(`Grievance ${id} updated to ${status}`);
                // Optionally notify user or update UI
            })
            .catch(error => {
                console.error("Error updating grievance: ", error);
            });
    };

    return (
        <div>
            <h2>Grievances</h2>
            <Bar 
                data={chartData} 
                options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += context.parsed.y;
                                    }
                                    return label;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                        },
                        y: {
                            beginAtZero: true,
                        },
                    },
                }} 
            />
            {grievances.length > 0 ? (
                grievances.map(grievance => (
                    <div key={grievance.id} className="grievance-card">
                        <h3>Domain: {grievance.domain}</h3>
                        <p>Problem: {grievance.problem}</p>
                        <p>Language: {grievance.language}</p>
                        <p>Votes: {grievance.votes}</p>
                        <p>Status: {grievance.status || 'Pending'}</p>
                        <button onClick={() => handleStatusChange(grievance.id, 'Being Studied')}>Being Studied</button>
                        <button onClick={() => handleStatusChange(grievance.id, 'Accepted')}>Accepted</button>
                        <button onClick={() => handleStatusChange(grievance.id, 'Addressed')}>Addressed</button>
                        <button onClick={() => handleStatusChange(grievance.id, 'Resolved')}>Resolved</button>
                    </div>
                ))
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Admin;
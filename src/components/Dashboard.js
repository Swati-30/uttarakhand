import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import '../CSS/Dashboard.css'; // Ensure proper styling

const Dashboard = () => {
    const [grievances, setGrievances] = useState([]);

    useEffect(() => {
        const userGrievancesRef = ref(db, 'grievances'); // Reference to the grievances node
        onValue(userGrievancesRef, (snapshot) => {
            const data = snapshot.val();
            const userGrievances = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
            setGrievances(userGrievances);
        }, (error) => {
            console.error("Error fetching grievances: ", error);
        });
    }, []);

    return (
        <div>
            <h2>Your Grievances</h2>
            {grievances.length > 0 ? (
                grievances.map(grievance => (
                    <div key={grievance.id} className="grievance-card">
                        <h3>Domain: {grievance.domain}</h3>
                        <p>Problem: {grievance.problem}</p>
                        <p>Votes: {grievance.votes}</p>
                        <p>Status: {grievance.status || 'Pending'}</p> {/* Reflecting the updated status */}
                        <p>Last Updated: {new Date(grievance.lastUpdated).toLocaleString()}</p> {/* Optional: Display last updated time */}
                    </div>
                ))
            ) : (
                <p>No grievances found.</p>
            )}
        </div>
    );
};

export default Dashboard;

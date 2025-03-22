import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WaitList.css";
import { User, Clock, RotateCw, Bell, Plus, X, ArrowLeft } from 'lucide-react';

export default function WaitList() {
    const [labs, setLabs] = useState([]);
    const [selectedLab, setSelectedLab] = useState(null);
    const [name, setName] = useState("");
    const [waitlist, setWaitlist] = useState([]);


    useEffect(() => {
        axios.get("http://127.0.0.1:3001/labs")
            .then((response) => setLabs(response.data))
            .catch((error) => console.error("Error fetching labs:", error));
    }, []);

    useEffect(() => {
        if (selectedLab) {
            fetchWaitlist();
        }
    }, [selectedLab]);

    const fetchWaitlist = () => {
        axios.get(`http://127.0.0.1:3001/waitlist/${selectedLab.lab_id}`)
            .then((response) => {
                setWaitlist(response.data);
            })
            .catch((error) => console.error("Error fetching waitlist:", error));
    };

    const joinWaitlist = () => {
        if (!name) return;
        axios.post("http://127.0.0.1:3001/waitlist", { lab_id: selectedLab.lab_id, user_name: name })
            .then(() => {
                fetchWaitlist();
                setName("");
            })
            .catch((error) => console.error("Error joining waitlist:", error));
    };

    const removeFromWaitlist = (userName) => {
        axios.delete(`http://127.0.0.1:3001/waitlist/${userName}`)
            .then(() => {
                fetchWaitlist();
            })
            .catch((error) => console.error("Error removing from waitlist:", error));
    };

    const calculateUtilization = () => {
        if (!selectedLab) return 0;
        return (((selectedLab.total_systems - selectedLab.available_systems) / selectedLab.total_systems) * 100).toFixed(0);
    };

    const getEstWaitTime = () => {
        return '~25 mins';
    }

    const goBackToLabSelection = () => {
        setSelectedLab(null);
    };


    return (
        <div className="waitlist-container">
            <h1 className="waitlist-title">Lab Waitlist</h1>
            <p className="waitlist-subtitle">Current status and statistics of the lab utilization system.</p>

            {selectedLab ? (
                <>
                    <button className="back-button" onClick={goBackToLabSelection}>
                        <ArrowLeft size={16} /> Back to Labs
                    </button>
                    <div className="lab-details-container">
                        <div className="lab-info-section">
                            <div className="lab-header">
                                <h2 className="lab-name">{selectedLab.lab_name}</h2>
                                {selectedLab.available_systems === 0 && (
                                    <span className="lab-status full">Full</span>
                                )}
                            </div>
                            <div className="lab-utilization">
                                <span className="utilization-label">Utilization</span>
                                <div className="progress-bar">
                                    <div className="progress" style={{ width: `${calculateUtilization()}%` }}></div>
                                </div>
                                <span className="utilization-text">{selectedLab.total_systems - selectedLab.available_systems}/{selectedLab.total_systems}</span>
                            </div>
                            <div className="lab-stats">
                                <div className="waitlist-users">
                                    <User className="icon" size={16} />
                                    <span>Waitlist: {waitlist.length} users</span>
                                </div>
                                <div className="est-wait-time">
                                    <Clock className="icon" size={16} />
                                    <span>Est. Wait Time: {getEstWaitTime()}</span>
                                </div>
                            </div>
                        </div>
                     <div className="join-waitlist-section">
                            <h3>Your Name</h3>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <button className="join-button" onClick={joinWaitlist}>
                                <Plus className="icon" size={16} />
                                Join Waitlist
                            </button>
                        </div>
                    </div>
<div className="lab-waitlist-section">
                        <div className="waitlist-header">
                            <h3>Lab Waitlist</h3>
                            <RotateCw className="refresh-icon" size={16} onClick={fetchWaitlist} />
                        </div>

                        <ul className="waitlist-list">
                            {waitlist.map((user, index) => (
                                <li key={index} className="waitlist-item">
                                    <div className="user-info">
                                        <div className="user-icon-circle">
                                            <Bell className="user-icon" size={16} />
                                        </div>
                                        <div className="user-details">
                                            <span className="user-name">{user.user_name}</span>
                                            <span className="user-status-pill">Lab access ready soon</span>
                                        </div>
                                    </div>
                                    <X className="remove-icon" size={16} onClick={() => removeFromWaitlist(user.user_name)} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            ) : (
                <div className="labs-grid">
                    {labs.map((lab) => (
                        <div
                            key={lab.lab_id}
                            className="lab-card"
                            onClick={() => setSelectedLab(lab)}
                        >
                            <h2 className="lab-name">{lab.lab_name}</h2>
                            <p className="lab-availability">Available: {lab.available_systems}/{lab.total_systems}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

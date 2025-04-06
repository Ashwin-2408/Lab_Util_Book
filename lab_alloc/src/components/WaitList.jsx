import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WaitList.css";
import { User, Clock, RotateCw, Bell, Plus, X, ArrowLeft } from 'lucide-react';

export default function WaitList() {
    const [labs, setLabs] = useState([]);
    const [selectedLab, setSelectedLab] = useState(null);
    const [name, setName] = useState("");
    const [waitlist, setWaitlist] = useState([]);
    const [utilization, setUtilization] = useState(0);
    const [isInWaitlist, setIsInWaitlist] = useState(false);

    useEffect(() => {
        axios.get("http://127.0.0.1:3001/labs")
            .then((response) => setLabs(response.data))
            .catch((error) => console.error("Error fetching labs:", error));
    }, []);

    useEffect(() => {
        if (selectedLab) {
            setUtilization(calculateUtilization());
            fetchWaitlist();
        }
    }, [selectedLab]);

    const fetchWaitlist = () => {
        if (!selectedLab || !selectedLab.lab_id) {
            console.warn("fetchWaitlist called without a selectedLab"); // Debugging log
            return;
        }
    
        axios.get(`http://127.0.0.1:3001/waitlist/${selectedLab.lab_id}`)
            .then((response) => {
                setWaitlist(response.data);
                setIsInWaitlist(response.data.some(user => user.user_name === name));
            })
            .catch((error) => console.error("Error fetching waitlist:", error));
    };
    
    const handleWaitlistToggle = () => {
        if (isInWaitlist) {
            axios.delete(`http://127.0.0.1:3001/waitlist/${selectedLab.lab_id}/${name}`)
                .then(() => {
                    fetchWaitlist();
                    setIsInWaitlist(false);
                })
                .catch((error) => console.error("Error removing from waitlist:", error));
        } else {
            if (!name) return;
            axios.post("http://127.0.0.1:3001/waitlist", { lab_id: selectedLab.lab_id, user_name: name })
                .then(() => {
                    fetchWaitlist();
                    setIsInWaitlist(true);
                })
                .catch((error) => console.error("Error joining waitlist:", error));
        }
    };

    const calculateUtilization = () => {
        if (!selectedLab || selectedLab.total_systems === 0) return 0;
        const utilized = selectedLab.total_systems - selectedLab.available_systems;
        return ((utilized / selectedLab.total_systems) * 100).toFixed(0);
    };

    const getEstWaitTime = () => {
        return `${waitlist.length * 2} hrs`;
    };

    const goBackToLabSelection = () => {
        setSelectedLab(null);
        setIsInWaitlist(false);
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
                                disabled={isInWaitlist}
                            />
                            <button 
                                className={`waitlist-toggle-button ${isInWaitlist ? "leave-waitlist-button" : "join-waitlist-button"}`}
                                onClick={handleWaitlistToggle}
                            >
                                {isInWaitlist ? <X className="icon" size={16} /> : <Plus className="icon" size={16} />}
                                {isInWaitlist ? "Leave Waitlist" : "Join Waitlist"}
                            </button>
                        </div>
                    </div>
                    <div className="lab-waitlist-section">
                        <div className="waitlist-header">
                            <h3>Lab Waitlist</h3>
                            <RotateCw data-testid="refresh-button" className="refresh-icon" size={16} onClick={fetchWaitlist} />
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

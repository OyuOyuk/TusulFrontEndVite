import { useState, useEffect } from 'react'

function Dashboard() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        setUser(decoded);
    }, []);

    return (
        <div>
            <h1>Welcome, {user?.email}</h1>
            <p>Role: {user?.role}</p>
            <p>ID: {user?.userId}</p>
        </div>
    )
}
export default Dashboard;
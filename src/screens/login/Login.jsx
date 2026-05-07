import './Login.css'
import { useState } from 'react'
import Button2 from '../../components/parts/button2'
import { Link, useNavigate } from 'react-router-dom'

function Login(){
    const navigate = useNavigate(); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/loginByEmail`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            
            localStorage.setItem("token", data.token);
            navigate("/dashboard");
            
        } catch (error) {
            setError(error.message || "Login failed. Please try again.");
        }
    };

    return (
        <div className="login_container">
            <div className='login_container2'>
                <div className="login_island">
                    <h1 className='login_header2'>Welcome Back to BrandBooks</h1>
                    <h3 className='login_header3'>Login to your account</h3>
                    <form onSubmit={handleLogin} className='login_form'>
                        <div className="input_group">
                            <label htmlFor="email" className='login_form_label'>Email</label>
                            <input 
                                type="email" 
                                placeholder="you@example.com"
                                id='email'
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                className={`login_form_input ${error ? 'input_error' : ''}`}
                            />
                        </div>
                        <div className="input_group">
                            <label htmlFor="password" className='login_form_label'>Password</label>
                            <input 
                                type="password" 
                                placeholder="Password" 
                                id='password'
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                className={`login_form_input ${error ? 'input_error' : ''}`}
                            />
                        </div>
                        {error && <p className="login_error">{error}</p>}
                        <Button2 text="Login" onClick={handleLogin}/>
                    </form>
                    <p className="signup_text">
                        Don't have an account? <Link to="/signup" className="signup_link">Sign up</Link>
                    </p>
                    <p className='textp'>or</p>
                    <button onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`} className = 'google_btn'>
                        Continue with Google
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
import './Login.css'
import { useState } from 'react'
import Button2 from '../../components/parts/button2'
import { Link } from 'react-router-dom'
function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Logging in with:", email, password);
        // Add login logic here
    };

    return (
        <div className="login_container" >
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
                        onChange={(e) => setEmail(e.target.value)}
                        className='login_form_input'
                    />
                </div>

                <div className="input_group">
                    <label htmlFor="password" className='login_form_label'>Password</label>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='login_form_input'
                    />
                </div>
                
                <Button2 text="Login" onClick={handleLogin}/>
            </form>
            <p className="signup_text">
            Don't have an account? <Link to="/signup" className="signup_link">Sign up</Link>
            </p>
            </div>
            </div>
        </div>
    );

}
export default Login;

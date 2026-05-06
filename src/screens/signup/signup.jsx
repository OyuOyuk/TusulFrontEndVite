import './signup.css'
import { useState } from 'react'
import Button2 from '../../components/parts/button2'
import { Link } from 'react-router-dom'

function Signup(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = (e) => {
        e.preventDefault();
        console.log("Signing up with:", name, email, password);
        // Add signup logic here
    };

    return (
        <div className="signup_container" >
            <div className='signup_container2'>
                <div className="signup_island">
                <h1 className='signup_header2'>Join BrandBooks</h1>
                <h3 className='signup_header3'>Create your account</h3>
                <form onSubmit={handleSignup} className='signup_form'>
                

                <div className="input_group">
                    <label htmlFor="email" className='signup_form_label'>Email</label>
                    <input 
                        type="email" 
                        placeholder="you@example.com"
                        id='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='signup_form_input'
                    />
                </div>

                <div className="input_group">
                    <label htmlFor="password" className='signup_form_label'>Password</label>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='signup_form_input'
                    />
                </div>
                
                <Button2 text="Sign Up" onClick={handleSignup}/>
            </form>
            <p className="signup_text">
            Already have an account? <Link to="/login" className="signup_link">Login</Link>
            </p>
            </div>
            </div>
        </div>
    );
}
export default Signup;

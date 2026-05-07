import './signup.css'
import { useState } from 'react'
import Button2 from '../../components/parts/button2'
import { Link, useNavigate } from 'react-router-dom'

function Signup(){
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            setStep(2); // show OTP screen
        } catch (error) {
            setError(error.message || "Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            localStorage.setItem("token", data.token);
            navigate("/dashboard");
        } catch (error) {
            setError(error.message || "Verification failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError('');
        setCode('');
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
        } catch (error) {
            setError("Failed to resend code. Please try again.");
        }
    };

    return (
        <div className="signup_container">
            <div className='signup_container2'>
                <div className="signup_island">

                    {step === 1 ? (
                        <>
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
                                {error && <p className="signup_error">{error}</p>}
                                <Button2 text={loading ? "Sending..." : "Sign Up"} onClick={handleSignup} />
                                
                            </form>
                            <p className="signup_text">
                                Already have an account? <Link to="/login" className="signup_link">Login</Link>
                            </p>
                            <p className='textp'> or </p>
                            <button onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`}className = 'google_btn'>
                                    Continue with Google
                                </button>
                        </>
                    ) : (
                        <>
                            <h1 className='signup_header2'>Check your email</h1>
                            <h3 className='signup_header3'>We sent a 6-digit code to<br /><strong>{email}</strong></h3>
                            <form onSubmit={handleVerify} className='signup_form'>
                                <div className="input_group">
                                    <label htmlFor="code" className='signup_form_label'>Verification Code</label>
                                    <input
                                        type="text"
                                        placeholder="123456"
                                        id='code'
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className='signup_form_input'
                                        maxLength={6}
                                        autoComplete="one-time-code"
                                    />
                                </div>
                                {error && <p className="signup_error">{error}</p>}
                                <Button2 text={loading ? "Verifying..." : "Verify"} onClick={handleVerify} />
                            </form>
                            <p className="signup_text">
                                Didn't get a code?{' '}
                                <span className="signup_link" style={{ cursor: 'pointer' }} onClick={handleResend}>
                                    Resend
                                </span>
                            </p>
                            <p className="signup_text">
                                <span className="signup_link" style={{ cursor: 'pointer' }} onClick={() => { setStep(1); setError(''); }}>
                                    ← Back
                                </span>
                            </p>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Signup;
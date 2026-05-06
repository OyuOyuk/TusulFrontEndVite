import BrandBook from '../../assets/BrandBook.svg'
import Button from '../parts/button';
import './component_sections.css'
import { useNavigate, useLocation } from 'react-router-dom';

function Header(){
    const navigate = useNavigate();
    const location = useLocation(); // This gets the current path (e.g., '/login')

    return (
        <header className="Header">
            <img src={BrandBook} alt="Logo" className="HeaderLogo" onClick={() => navigate('/')} />
            
            {location.pathname !== '/login' && location.pathname !== '/signup' && (
                <Button text="Login" onClick={() => navigate('/login')}/>
            )}
        </header>
    );
}

export default Header;
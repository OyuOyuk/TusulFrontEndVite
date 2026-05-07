import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import BrandBook from '../../assets/BrandBook.svg';
import GearSvg from  '../../assets/icons/gear.svg';
import Button from '../parts/button';
import './component_sections.css';
import { useNavigate, useLocation } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const { scrollY } = useScroll();

    const [hidden, setHidden] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (location.pathname === '/generate') {
            setHidden(true);
            return;
        }
       

        const previous = scrollY.getPrevious();
        if (latest > previous && latest > 150) {
            setHidden(true); // Scrolling down
        } else {
            setHidden(false); // Scrolling up
        }
    });

    // Force hidden state if on /generate route
    const isHidden = hidden || location.pathname === '/generate';

    return (
        <motion.header 
            className="Header"
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            animate={isHidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
        >
            <img src={BrandBook} alt="Logo" className="HeaderLogo" onClick={() => navigate('/')} />
            
            {location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/dashboard'&& location.pathname !== '/settings' &&location.pathname !== '/generate' &&(
                <Button text="Login" onClick={() => navigate('/login')}/>
            )}

            {location.pathname === '/dashboard' && (
                <button onClick={() => navigate('/settings')} style={{ 
                        background: 'none', 
                        border: 'none', 
                        padding: 0, 
                        cursor: 'pointer' 
                    }}>
                    <img src={GearSvg} alt="Settings" height={32} width={32}/>
                </button>
            )}
            
        </motion.header>
    );
}

export default Header;
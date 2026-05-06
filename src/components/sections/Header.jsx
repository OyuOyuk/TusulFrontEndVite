import BrandBook from '../../assets/BrandBook.svg'
import Button from '../parts/button';
import './component_sections.css'


function Header(){

    return (
        <header className="Header">
            <img src={BrandBook} alt="Logo" className="HeaderLogo" />
            <Button text="Login" />
        </header>
    );
}
export default Header;
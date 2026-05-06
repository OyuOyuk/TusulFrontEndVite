import BrandBook from '../../assets/BrandBook.svg'
import './component_parts.css'


function Header(){

    return (
        <header className="Header">
            <img src={BrandBook} alt="Logo" className="HeaderLogo" />
        </header>
    );
}
export default Header;
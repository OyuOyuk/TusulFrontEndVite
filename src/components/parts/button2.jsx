import './component_parts.css'

function Button2({text, onClick}){
    return <div>
        <button className="button2" onClick={onClick}>{text}</button>
    </div>
}
export default Button2
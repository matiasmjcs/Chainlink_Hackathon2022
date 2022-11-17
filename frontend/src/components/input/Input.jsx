import './Input.css' 

const Input = ({placeholder, type, name, onChange}) => {
    return (
        <input placeholder={placeholder} type={type} name={name} onChange={onChange}/>
    )
}

export default Input
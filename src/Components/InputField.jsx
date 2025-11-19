import "./InputField.css";


function InputField({ id, type, value, label, name, handleInput })
{
    return (
        <div id="input-row">
            <label 
                htmlFor={id}
                className="label">
                    {label}:
            </label>
            <input
                type={type}
                id={id}
                value={value}
                onChange={handleInput}
                className="input-field dm-sans"
                name={name} required
            />
        </div>
    );
}


export default InputField;
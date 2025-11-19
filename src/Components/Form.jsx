import "./Form.css";
import InputField from "./InputField.jsx";
import { useState } from "react";


function Form(props)
{
    const [formData, setFormData] = useState({});

    function handleSubmit(event)
    {
        event.preventDefault();
        props.userCheck(formData);
    }

    function handleInput(event)
    {
        setFormData(prevValues =>
        {
            return {
                ...prevValues,
                [event.target.name]: event.target.value
            };
        });
    }

    return (
        <section id="form-section">
            <div id="form-container">
                <div id="form-header" className="dm-sans">
                    <h2>{props.text}</h2>
                </div>
                <form
                    id="form"
                    action={props.text === "Login" ? "/login" : "/register"}
                    method="post"
                    className="form"
                    onSubmit={handleSubmit}
                >
                    <InputField
                        label="Username"
                        id="username-input"
                        type="text"
                        name="username"
                        value={formData.username || ""}
                        handleInput={handleInput}
                    />
                    <InputField
                        label="Password"
                        id="password-input"
                        type="password"
                        name="password"
                        value={formData.password || ""}
                        handleInput={handleInput}
                    />
                    {props.text === "Registration" && (
                        <InputField
                            label="Confirm Password"
                            id="confirm-password-input"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword || ""}
                            handleInput={handleInput}
                        />
                    )}
                    <button id="submit-button" type="submit">
                        {props.text === "Login" ? "Login" : "Register"}
                    </button>
                </form>
            </div>
        </section>
    )
}

export default Form;
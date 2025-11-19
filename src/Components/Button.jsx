import "./Button.css";


function Button(props)
{
    function handleClick()
    {
        if (props.url !== undefined)
        {
            props.onClick(props.url);
        }
        else
        {
            props.onClick();
        }
    }

    return (
        <button id={props.id} onClick={handleClick}  className="button sansita-regular">{props.title}</button>
    );
}


export default Button;
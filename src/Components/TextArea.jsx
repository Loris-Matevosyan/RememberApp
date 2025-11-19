import "./TextArea.css";


function TextArea(props)
{
    return (
        <div id="text-area-container">
            <textarea
                id="text-area"
                placeholder="Enter text to remember…"
                value={props.value}
                onChange={props.handleInputContent}
            >
            </textarea>
        </div>
    );
}


export default TextArea;
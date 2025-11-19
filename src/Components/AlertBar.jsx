import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


function AlertBar(props)
{
    return (
        <Snackbar
            open={props.open}
            autoHideDuration={4000}
            onClose={props.handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "right"}}
        >
            <Alert
                onClose={props.handleClose}
                severity={props.severity}
                variant="filled"
                sx={{ width: 'fit-content' }}
            >
                {props.message}
            </Alert>
        </Snackbar>
    );
}

export default AlertBar;
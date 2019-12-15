// Import library
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";

// Setup typings for props for this component
type NoDutyDialogProps = {
    // Control whether the dialog is open or not
    open: boolean;
    // Function to be called when the dialog box is closed
    onClose: Function;
}

// Redner our shift duty calendar
const NoDutyDialog: React.FC<NoDutyDialogProps> = ({ open, onClose }: NoDutyDialogProps) => {
    // Use dark theme such that <KeyboardDatePicker> would be colored correctly
    const defaultMaterialTheme = createMuiTheme({
        palette: {
            type: 'dark'
        },
        overrides: {
            MuiButton: {
                textPrimary: {
                    color: '#FF9F71'
                }
            }
        }
    });
    // Render a dialog for adding a new duty
    return (
        <ThemeProvider theme={defaultMaterialTheme}>
            <Dialog
                open={open}
                onClose={() => onClose()}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Duty Not Found</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Allowance cannot be calculated if no duty was set.
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-description">
                        Please add some duty before proceeding.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => onClose()} color="primary" autoFocus>
                        Okay
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    )
}

export default NoDutyDialog;
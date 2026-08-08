// Import library
import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

// Setup typings for props for this component
type NoDutyDialogProps = {
	// Control whether the dialog is open or not
	open: boolean;
	// Function to be called when the dialog box is closed
	onClose: Function;
}

// Redner our shift duty calendar
const NoDutyDialog: React.FC<NoDutyDialogProps> = ({ open, onClose }: NoDutyDialogProps) => {
	// Render a dialog for adding a new duty
	return (
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
	)
}

export default NoDutyDialog;

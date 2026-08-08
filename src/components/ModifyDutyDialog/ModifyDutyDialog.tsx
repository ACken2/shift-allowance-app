// Import library
import React from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Import CSS module stylesheet
import styles from './ModifyDutyDialog.module.css';

// Typing for DutyConfig
type DutyConfig = typeof import("containers/App/DutyConfig_PY_PHER.json");

// Setup typings for props for this component
type ModifyDutyDialogProps = {
	// Control whether the dialog is open or not
	open: boolean;
	// Initial date selected when the dialog box is opened
	initialDate: Date | null;
	// Initial duty selected when the dialog box is opened
	initialDuty: number;
	// Duty config
	dutyConfig: DutyConfig;
	// Function called when Confirm button is clicked
	onConfirmModification: Function;
	// Function called when Cancel button is clicked
	onCancelModification: Function;
}

// Redner our shift duty calendar
const ModifyDutyDialog: React.FC<ModifyDutyDialogProps> = (
	{ open, initialDate, initialDuty, dutyConfig, onConfirmModification, onCancelModification }: ModifyDutyDialogProps
) => {
	// Using Hook to manage internal state
	// State for keeping track of the duty selected
	const [selectedDuty, setSelectedDuty] = React.useState<number>(initialDuty);
	const handleSelectDuty = (event: SelectChangeEvent<number>) => {
		setSelectedDuty(Number(event.target.value));
	}
	// State for keeping track of the date selected
	const [selectedDate, setSelectedDate] = React.useState<Date | null>(initialDate);
	// State for keeping track of whether the option to set for the entire week is enabled
	const [setForWholeWeek, setSetForWholeWeek] = React.useState<boolean>(false);
	// Render a dialog for adding a new duty
	return (
		<div>
			<Dialog open={open} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">Modify Duty</DialogTitle>
				<DialogContent>
					<DialogContentText>
						To modify the duty on the selected date, please select a duty from the list below and click confirm.
					</DialogContentText>
					<Grid
						container
						spacing={1}
						direction="row"
						alignItems="center"
					>
						<Grid item sm={12} md={6} className={styles.datePicker}>
							<DatePicker
								label="Date Selected"
								format="d MMMM yy, EEE"
								value={selectedDate}
								onChange={(date) => setSelectedDate(date)}
								slotProps={{
									textField: {
										margin: 'normal',
										id: 'date-picker-dialog',
									},
								}}
							/>
						</Grid>
						<Grid item sm={12} md={6} className={styles.setForWholeWeekCheckbox}>
							<FormControlLabel 
								control={<Checkbox checked={setForWholeWeek} onChange={() => setSetForWholeWeek(!setForWholeWeek)} />} 
								label="Set for Entire Week" 
							/>
						</Grid>
					</Grid>
					<div className={styles.inputDivWrapper}>
						<FormControl>
							<InputLabel>Duty</InputLabel>
							<Select
								label="Duty"
								value={selectedDuty}
								onChange={handleSelectDuty}
							>
								{
									dutyConfig.map((duty) => {
										return (
											<MenuItem key={duty.id} value={duty.id}>
												<em>{duty.title}</em>
											</MenuItem>
										)
									})
								}
							</Select>
						</FormControl>
					</div>
				</DialogContent>
				<DialogActions>
					<Button color="secondary" onClick={() => {
						setSetForWholeWeek(false);
						onCancelModification();
					}}>
						Cancel
					</Button>
					<Button color="primary" onClick={() => {
						setSetForWholeWeek(false);
						onConfirmModification(selectedDate, selectedDuty, setForWholeWeek);
					}}>
						Confirm
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}

export default ModifyDutyDialog;

// Import library
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";

// Import CSS module stylesheet
import styles from './ModifyDutyDialog.module.css';

// Custom typings for libraries
type SelectOnChangeEvent = {
    target: {
        value: number;
    }
}
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
const ModifyDutyDialog: React.FC<ModifyDutyDialogProps> = ({ open, initialDate, initialDuty, dutyConfig, onConfirmModification, onCancelModification }: ModifyDutyDialogProps) => {
    // Using Hook to manage internal state
    // State for keeping track of the duty selected
    const [selectedDuty, setSelectedDuty] = React.useState<number | null>(initialDuty);
    const handleSelectDuty = (event: SelectOnChangeEvent) => {
        setSelectedDuty(event.target.value);
    }
    // State for keeping track of the date selected
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(initialDate);
    // Use dark theme such that <KeyboardDatePicker> would be colored correctly
    const defaultMaterialTheme = createMuiTheme({
        palette: {
            type: 'dark'
        },
        overrides: {
            MuiPickersDay: {
                day: {
                    color: '#FFFFFF'
                },
                current: {
                    color: '#FF9F71'
                }
            },
            MuiButton: {
                textPrimary: {
                    color: '#FF9F71'
                }
            },
            MuiFormLabel: {
                root: {
                    '&$focused': {
                        color: '#FF9F71'
                    }
                }
            },
            MuiInput: {
                underline: {
                    '&:after': {
                        borderBottom: '2px solid #FF9F71'
                    }
                }
            }
        }
    });
    // Render a dialog for adding a new duty
    return (
        <ThemeProvider theme={defaultMaterialTheme}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <div>
                    <Dialog open={open} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Modify Duty</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                To modify the duty on the selected date, please select a duty from the list below and click confirm.
                            </DialogContentText>
                            <div className={styles.inputDivWrapper}>
                                <KeyboardDatePicker
                                    margin="normal"
                                    id="date-picker-dialog"
                                    label="Date Selected"
                                    format="d MMMM yy, iii"
                                    value={selectedDate}
                                    onChange={setSelectedDate}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </div>
                            <div className={styles.inputDivWrapper}>
                                <FormControl>
                                    <InputLabel>Duty</InputLabel>
                                    <Select
                                        value={selectedDuty}
                                        onChange={(event: any) => handleSelectDuty(event)}
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
                            <Button color="secondary" onClick={() => onCancelModification()}>
                                Cancel
                            </Button>
                            <Button color="primary" onClick={() => onConfirmModification(selectedDate, selectedDuty)}>
                                Confirm
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </MuiPickersUtilsProvider>
        </ThemeProvider>
    )
}

export default ModifyDutyDialog;
// Import library
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import Button from '@material-ui/core/Button';

// Import logo of our home page
import logo from './calendar_logo.svg';

// Import CSS module stylesheet
import styles from './DateSelect.module.css';

// Setup typings for props for our DateSelect page
type DateSelectProps = {
    onDateConfirmed: Function;
}

// Render our date select page
const DateSelect: React.FC<DateSelectProps> = ({ onDateConfirmed }: DateSelectProps) => {
    // <KeyboardDatePicker> requires date to be managed by class components that included it
    // Thus, we are using React state hooks to add a selectedDate state to this function component
    // selectedDate is the state for this component, while setSelectedDate() can be used to update the state
    // Reference: https://reactjs.org/docs/hooks-state.html
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(
        new Date()
    );
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
                    color: '#FFFFFF'
                }
            }
        }
    });
    // Compute scale ratio for <KeyboardDatePicker> since it can only be scaled that way
    // We also impose a minimum scale of 1
    const scale_ratio = Math.max(
        Math.min( 
            window.screen.width / 360,
            window.screen.height / 640
        ),
        1
    );
    const scale_css = 'scale(' + scale_ratio + ')';
    // Compute the margin bottom css for <KeyboardDatePicker> to correct for the div size
    const margin_bottom_css = ((scale_ratio - 1) * 72) + 'px';
    return (
        <ThemeProvider theme={defaultMaterialTheme}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <div className={styles.dateSelect}>
                    <header className={styles.dateSelectHeader}>
                        <img src={logo} className={styles.dateSelectLogo} alt="logo" />
                        <div className={styles.dateSelectBody}>
                            <p className={styles.dateSelectBodyText}>Pick the date when your shift duty begins</p>
                            <div style={{transform: scale_css, marginBottom: margin_bottom_css}}>
                                <KeyboardDatePicker
                                    margin="normal"
                                    id="date-picker-dialog"
                                    label="Beginning of your shift duty"
                                    format="d MMMM yy, iii"
                                    value={selectedDate}
                                    onChange={setSelectedDate}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </div>
                            <div className={styles.dateSelectBodyButtonDiv}>
                                <Button variant="contained" color="primary" className={styles.dateSelectBodyButton} onClick={() => onDateConfirmed(selectedDate, 0)}>
                                    Confirm
                                </Button>
                                <Button variant="contained" color="secondary" className={styles.dateSelectBodyButton} onClick={() => onDateConfirmed(selectedDate, -1)}>
                                    Skip
                                </Button>
                            </div>
                        </div>
                    </header>
                    <footer className={styles.dateSelectFooter}>
                        <div className="center-div">
                            Icons made by <a href="https://www.flaticon.com/authors/darius-dan" title="Darius Dan">Darius Dan</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
                        </div>
                    </footer>
                </div>
            </MuiPickersUtilsProvider>
        </ThemeProvider>
	);
}

export default DateSelect;
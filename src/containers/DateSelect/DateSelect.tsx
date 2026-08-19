// Import library
import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';

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
	const [selectedDate, setSelectedDate] = React.useState<Date | null>(
		new Date()
	);
	return (
		<div className={styles.dateSelect}>
			<header className={styles.dateSelectHeader}>
				<img src={logo} className={styles.dateSelectLogo} alt="logo" />
				<div className={styles.dateSelectBody}>
					<p className={styles.dateSelectBodyText}>Pick the date when your shift duty begins</p>
					<div className={styles.datePicker}>
						<DatePicker
							label="Beginning of your shift duty"
							format="d MMMM yy, EEE"
							value={selectedDate}
							onChange={(date) => setSelectedDate(date)}
							slotProps={{
								textField: {
									margin: 'normal',
									id: 'date-picker-dialog',
									fullWidth: true,
								},
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
				<div className="icon-footer">
					Icons made by <a href="https://www.flaticon.com/authors/darius-dan" title="Darius Dan">Darius Dan</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
				</div>
			</footer>
		</div>
	);
}

export default DateSelect;

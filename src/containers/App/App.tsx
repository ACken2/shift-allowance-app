// Import library
import React from 'react';
import Button from '@material-ui/core/Button';

// Import CSS module stylesheet
import styles from './App.module.css';

// Import logo of our home page
import logo from './calendar_logo.svg';

// Render our home page
const App: React.FC = () => {
	return (
		<div className={styles.app}>
			<header className={styles.appHeader}>
				<img src={logo} className={styles.appLogo} alt="logo" />
				<div className={styles.appBody}>
					<p className={styles.appBodyTitle}>
						Shift Duty Allowance Calculator
					</p>
					<Button variant="contained" color="primary" className={styles.appBodyButton}>
						Start Calculation
					</Button>
				</div>
			</header>
		</div>
	);
}

export default App;
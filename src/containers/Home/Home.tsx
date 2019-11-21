// Import library
import React from 'react';
import Button from '@material-ui/core/Button';

// Import CSS module stylesheet
import styles from './Home.module.css';

// Import logo of our home page
import logo from './calendar_logo.svg';

// Render our home page
const Home: React.FC = () => {
	return (
		<div className={styles.home}>
			<header className={styles.homeHeader}>
				<img src={logo} className={styles.homeLogo} alt="logo" />
				<div className={styles.homeBody}>
					<p className={styles.homeBodyTitle}>
						Shift Duty Allowance Calculator
					</p>
					<Button variant="contained" color="primary" className={styles.homeBodyButton}>
						Get Started
					</Button>
				</div>
			</header>
		</div>
	);
}

export default Home;
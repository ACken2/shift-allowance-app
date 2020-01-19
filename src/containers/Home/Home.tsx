// Import library
import React from 'react';
import Button from '@material-ui/core/Button';

// Import CSS module stylesheet
import styles from './Home.module.css';

// Import logo of our home page
import logo from './calendar_logo.svg';

// Setup typings for props for the Home page container
type HomeProps = {
	onGettingStarted: Function;
}

// Render our home page
const Home: React.FC<HomeProps> = ({ onGettingStarted }: HomeProps) => {
	return (
		<div className={styles.home}>
			<header className={styles.homeHeader}>
				<img src={logo} className={styles.homeLogo} alt="logo" />
				<div className={styles.homeBody}>
					<p className={styles.homeBodyTitle}>
						Shift Duty Allowance Calculator
					</p>
					<Button variant="contained" color="primary" className={styles.homeBodyButton} onClick={() => onGettingStarted()}>
						Get Started
					</Button>
				</div>
			</header>
			<footer className={styles.homeFooter}>
                <div className="center-div">
					Icons made by <a href="https://www.flaticon.com/authors/itim2101" title="itim2101">itim2101</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
                </div>
            </footer>
		</div>
	);
}

export default Home;
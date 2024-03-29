// Import library
import React from 'react';
import { useHistory } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

// Import CSS module stylesheet
import styles from './NavBar.module.css';

// Setup typings for props for our navigation bar
type NavBarProps = {
    // Route to redirect to when the back button is clicked, null if back button should do nothing
    backRoute: string | undefined;
    // Route to redirect to when the next button is clicked, null if next button should do nothing
    nextRoute: string | undefined;
    // Switch to disable DutyConfig profile change
    disableDutyConfigChange: boolean;
    // Number that indicates the current DutyConfig profile selected
    dutyConfigModeSelected: number;
    // Handler for changing DutyConfig mode
    onDutyConfigModeChange: Function;
}

// Render our navigation bar
const NavBar: React.FC<NavBarProps> = ({ backRoute, nextRoute, disableDutyConfigChange, dutyConfigModeSelected, onDutyConfigModeChange }: NavBarProps) => {
    // Get history object for routing
    const history = useHistory();
    // Render method for the back and next button
    const renderButton = (route: string | undefined, icon: JSX.Element) => {
        if (route) {
            // Render the button with the provided icon
            return (
                <IconButton aria-label='back' className={styles.navBarButton} onClick={() => history.push(route)}>
                    {icon}
                </IconButton>
            );
        }
        else {
            // Render a do-nothing button that is hiddened (same color as background)
            return (
                <IconButton aria-label='back' className={styles.navBarButtonDisabled} disabled={true}>
                    {icon}
                </IconButton>
            );
        }
    }
	return (
		<div className={styles.navBar}>
            {renderButton(backRoute, <ArrowBackIosIcon className={styles.navBarButtonIcon} />)}
            <div className={styles.navBarMode}>
            </div>
            {renderButton(nextRoute, <ArrowForwardIosIcon className={styles.navBarButtonIcon} />)}
		</div>
	);
}

export default NavBar;
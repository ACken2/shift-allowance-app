// Import library
import React from 'react';
import { useHistory } from 'react-router-dom';
import Select from '@material-ui/core/Select';
import { IconButton } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

// Import global constant
import * as AppConstant from '../App/AppConstant';

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
                <Select
                    value={dutyConfigModeSelected}
                    defaultValue={AppConstant.DUTY_PY_PHER}
                    onChange={(event) => onDutyConfigModeChange(event.target.value)}
                    className={styles.navBarSelect}
                    classes={{
                        icon: disableDutyConfigChange ? styles.navBarIconDisabled : styles.navBarSelectIcon,
                        select: styles.navBarSelectText
                    }}
                    disableUnderline={true}
                    disabled={disableDutyConfigChange}
                >
                    <MenuItem value={AppConstant.DUTY_PY_PHER}>Radiographer Mode</MenuItem>
                    <MenuItem value={AppConstant.DUTY_PY_CLERK}>Clerk Mode</MenuItem>
                </Select>
            </div>
            {renderButton(nextRoute, <ArrowForwardIosIcon className={styles.navBarButtonIcon} />)}
		</div>
	);
}

export default NavBar;
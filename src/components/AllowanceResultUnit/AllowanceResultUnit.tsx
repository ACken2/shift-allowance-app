// Import library
import React from 'react';
import moment from 'moment';
import { withStyles, lighten } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import LinearProgress from '@material-ui/core/LinearProgress';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AllowanceResultUnitTextResult from './AllowanceResultUnitTextResult';

// Import material-ui colors
import red from '@material-ui/core/colors/red';
import indigo from '@material-ui/core/colors/indigo';
import green from '@material-ui/core/colors/green';

// Import typings for computation result from Allowance.ts
import { AllowanceDetail } from 'containers/App/AllowanceModule/Allowance';

// Import CSS module stylesheet
import styles from './AllowanceResultUnit.module.css';

// Setup typings for props for the AllowanceResult container
type AllowanceResultUnitProps = {
	// Allowance computation result of the month displayed from Allowance.compute()
	allowance: AllowanceDetail;
	// Allowance computation result of the month displayed break down by day from Allowance.compute()
	allowanceBreakdown: Array<AllowanceDetail>;
	// Number of CO earned in this month
	earnedCO: number;
}

// Render our allowance compute result unit
// By design, each computed month would be rended as 1 single AllowanceResultUnit
const AllowanceResultUnit: React.FC<AllowanceResultUnitProps> = ({ allowance, allowanceBreakdown, earnedCO }: AllowanceResultUnitProps) => {
	// Format our start Date object as YYYY MMMM (e.g. 2019 November) for output as title
	const month = moment(allowance.start).format('YYYY MMMM');
	// Calculate the percentage to show in AllowanceProgress based on allowance.hours
	const progress = Math.min(100, allowance.hours * 100 / 50);
	// Compute color used by the progress bar
	let color;
	if (progress < 50) {
		// In case if progress < 50%, no allowance can be obtained so we use red color
		color = red[500];
	}
	else if (progress < 100) {
		// In case if 50% < progress < 100%, half allowance can be obtained so we use teal color
		color = indigo[500];
	}
	else {
		// Use green if progress > 100%
		color = green[500];
	}
	// Customize LinearProgress with styles we want
	const AllowanceProgress = withStyles({
		root: {
			height: '0.5em',
			borderRadius: '0.5em',
			backgroundColor: lighten(color, 0.75)
		},
		bar: {
			borderRadius: '0.5em',
			backgroundColor: color
		},
	})(LinearProgress);
	// Customize ExpansionPanel with colors
	const ExpansionPanelColored = withStyles({
		root: {
			color: 'white',
			backgroundColor: '#424242'
		}
	})(ExpansionPanel);
	// Customize ListItemText with colors
	const ListItemTextStyled = withStyles({
		primary: {
			fontSize: 'calc(10px + 1vmin)'
		},
		secondary: {
			color: 'white',
			fontSize: 'calc(10px + 0.75vmin)'
		}
	})(ListItemText);
	// Format the progress in terms of text
	const progressText = Math.floor(allowance.hours * 100 / 50) + '% completed';
	// Render our allowance compute result unit
	return (
		<div className={styles.allowanceResultUnitParent}>
			<div className={styles.allowanceResultUnit}>
				<div className={styles.allowanceResultUnitTitle}>
					<p className={styles.allowanceResultUnitTitleText}>{month}</p>
				</div>
				<div className={styles.allowanceResultUnitBody}>
					<div className={styles.allowanceResultUnitBodyTitle}>{'Hours qualified for shift duty allowance: '}</div>
					<div className={styles.allowanceResultUnitBodyHours}>{Math.floor(allowance.hours * 100) / 100}</div>
				</div>
				<div className={styles.allowanceResultUnitBar}>
					<AllowanceProgress
						variant="determinate"
						value={progress}
					/>
					<div className={styles.allowanceResultUnitBarText}>{progressText}</div>
				</div>
				<AllowanceResultUnitTextResult 
					progress={progress}
					earnedCO={earnedCO}
				/>
			</div>
			<ExpansionPanelColored>
				<ExpansionPanelSummary
					expandIcon={<ExpandMoreIcon className={styles.allowanceResultUnitExpandIcon} />}
					aria-controls="panel1a-content"
				>
					<Typography className={styles.allowanceResultUnitExpandText}>Detailed Breakdown</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
					<List dense={true}>
						{
							allowanceBreakdown.map((allowance) => {
								return (
									<ListItem key={allowance.start.toString()}>
										<ListItemTextStyled
											primary={moment(allowance.start).format('MMM DD HH:mm') + ' - ' + moment(allowance.end).format('MMM DD HH:mm') + ' (' + allowance.desc + ')'}
											secondary={Math.floor(allowance.hours * 100) / 100 + ' Hours'}
										/>
									</ListItem>
								)
							})
						}
					</List>
				</ExpansionPanelDetails>
			</ExpansionPanelColored>
		</div>
	);
}

export default AllowanceResultUnit;
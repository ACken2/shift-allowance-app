// Import library
import React from 'react';
import { format } from 'date-fns';
import { styled, lighten } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AllowanceResultUnitTextResult from './AllowanceResultUnitTextResult';

// Import material-ui colors
import { red, indigo, green } from '@mui/material/colors';

// Import typings for computation result from Allowance.ts
import { AllowanceDetail } from 'containers/App/AllowanceModule/Allowance';

// Import CSS module stylesheet
import './AllowanceResultUnit.css';
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
	const month = format(allowance.start, 'yyyy MMMM');
	// Calculate the percentage to show in AllowanceProgress based on allowance.hours
	const progress = Math.min(100, allowance.hours * 100 / 50);
	// Compute color used by the progress bar
	let color: string;
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
	const AllowanceProgress = styled(LinearProgress)({
		height: '0.5em',
		borderRadius: '0.5em',
		backgroundColor: lighten(color, 0.75),
		[`& .${linearProgressClasses.bar}`]: {
			borderRadius: '0.5em',
			backgroundColor: color,
		},
	});
	// Customize Accordion with colors
	const AccordionColored = styled(Accordion)({
		color: 'white',
		backgroundColor: '#424242',
	});
	// Customize ListItemText with colors
	const ListItemTextStyled = styled(ListItemText)({
		'& .MuiListItemText-primary': {
			fontSize: '0.8em',
		},
		'& .MuiListItemText-secondary': {
			color: 'white',
			fontSize: '0.7em',
		},
	});
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
			<AccordionColored>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon className={styles.allowanceResultUnitExpandIcon} />}
					aria-controls="panel1a-content"
				>
					<Typography className={styles.allowanceResultUnitExpandText}>Detailed Breakdown</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<List dense={true}>
						{
							allowanceBreakdown.map((allowanceItem) => {
								return (
									<ListItem key={allowanceItem.start.toString()}>
										<ListItemTextStyled
											primary={format(allowanceItem.start, 'MMM dd HH:mm') + ' - ' + format(allowanceItem.end, 'MMM dd HH:mm') + ' (' + allowanceItem.desc + ')'}
											secondary={Math.floor(allowanceItem.hours * 100) / 100 + ' Hours'}
										/>
									</ListItem>
								)
							})
						}
					</List>
				</AccordionDetails>
			</AccordionColored>
		</div>
	);
}

export default AllowanceResultUnit;

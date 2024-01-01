// Import library
import React from 'react';
import { AllowanceResultUnit } from 'components/AllowanceResultUnit';

// Import typings for computation result from Allowance.ts
import { AllowanceDetail } from 'containers/App/AllowanceModule/Allowance';

// Import CSS module stylesheet
import styles from './AllowanceResult.module.css';

// Setup typings for props for the AllowanceResult container
type AllowanceResultProps = {
	// Allowance computation result by month from Allowance.compute()
	allowance: Array<AllowanceDetail>;
	// Allowance computation result by month, break down by day, from Allowance.compute()
	// It is assumed that the breakdown of allowance[i] in month view will be located at allowanceBreakdown[i],
	// where allowanceBreakdown[i] is an array of AllowanceDetail that contained AllowanceDetail on a day-to-day basis
	allowanceBreakdown: Array<Array<AllowanceDetail>>;
	// Number of CO earned by month
	earnedCOByMonth: Array<number>;
}

// Render our allowance compute result page
const AllowanceResult: React.FC<AllowanceResultProps> = ({ allowance, allowanceBreakdown, earnedCOByMonth }: AllowanceResultProps) => {
	return (
		<div className={styles.allowanceResult}>
			<header className={styles.allowanceResultHeader}>
				{
					allowance.map((a, i) => {
						return (
							<AllowanceResultUnit
								key={JSON.stringify(a)}
								allowance={a}
								allowanceBreakdown={allowanceBreakdown[i]}
								earnedCO={earnedCOByMonth[i]}
							/>
						)
					})
				}
				<div className={styles.allowanceResultEndSpacer}></div>
			</header>
		</div>
	);
}

export default AllowanceResult;
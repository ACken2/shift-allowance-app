// Import library
import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// Import CSS module stylesheet
import styles from './AllowanceResultUnitTextResult.module.css';

// Setup typings for props for the AllowanceResultUnitTextResult component
type AllowanceResultUnitTextResultProps = {
	// Percentage of shift duty allowance hours obtained when compared to the 50 hours target
	progress: number;
	// Number of CO earned in this month
	earnedCO: number;
}

// Render our allowance compute result as text
const AllowanceResultUnitTextResult: React.FC<AllowanceResultUnitTextResultProps> = ({ progress, earnedCO }: AllowanceResultUnitTextResultProps) => {
	/**
	 * Render progress text which should include whether the duties is qualified
	 * for full/half allowance, and the number of hours required to earn further
	 * allowance.
	 * 
	 * @param {number} progress Percentage of shift duty allowance hours obtained when compared to the 50 hours target
	 * 
	 * @return {JSX.Element} JSX.Element to be rendered to display the progress in obtaining the full/half allowance
	 */
	function getProgressText(progressValue: number): React.ReactElement {
		// Render our textual result
		if (progressValue >= 100) {
			// Full allowance qualified
			const textFullAllowance = 'Qualified for FULL shift duty allowance';
			// Render logo with corresponding text
			return (
				<div className={styles.allowanceResultUnitTextResultLogo}>
					<CheckCircleIcon className={styles.allowanceResultUnitTextResultLogoSVG} />
					<div className={styles.allowanceResultUnitTextResultText}>{textFullAllowance}</div>
				</div>
			);
		}
		else if (progressValue >= 50) {
			// Half allowance qualified
			const textHalfAllowance = 'Qualified for HALF shift duty allowance';
			const textHalfAllowanceExtra = (50 - progressValue * 50 / 100).toFixed(2) + ' more hours required for FULL shift duty allowance';
			// Render logo with corresponding text
			return (
				<div>
					<div className={styles.allowanceResultUnitTextResultLogo}>
						<CheckCircleIcon className={styles.allowanceResultUnitTextResultLogoSVG} />
						<div className={styles.allowanceResultUnitTextResultText}>{textHalfAllowance}</div>
					</div>
					<div className={styles.allowanceResultUnitTextResultLogo}>
						<CancelIcon className={styles.allowanceResultUnitTextResultLogoSVG} />
						<div className={styles.allowanceResultUnitTextResultText}>{textHalfAllowanceExtra}</div>
					</div>
				</div>
			);
		}
		else {
			// No allowance qualified
			const textNoAllowance = (25 - progressValue * 50 / 100).toFixed(2) + ' more hours required for HALF shift duty allowance';
			// Render logo with corresponding text
			return (
				<div className={styles.allowanceResultUnitTextResultLogo}>
					<CancelIcon className={styles.allowanceResultUnitTextResultLogoSVG} />
					<div className={styles.allowanceResultUnitTextResultText}>{textNoAllowance}</div>
				</div>
			);
		}
	}
	/**
	 * Render a text that displayed the number of CO earned in the current month.
	 * 
	 * @param {number} coEarned Number of CO earned in this month
	 * 
	 * @return {JSX.Element} JSX.Element to be rendered to display the number of CO earned in the current month
	 */
	function getCOText(coEarned: number): React.ReactElement {
		if (coEarned > 0) {
			// CO text to be rendered
			const COEarnedText = 'Earned ' + coEarned + ' days of CO';
			// Render CO text with logo
			return (
				<div className={styles.allowanceResultUnitTextResultLogo}>
					<CheckCircleIcon className={styles.allowanceResultUnitTextResultLogoSVG} />
					<div className={styles.allowanceResultUnitTextResultText}>{COEarnedText}</div>
				</div>
			)
		}
		else {
			// CO text to be rendered
			const COEarnedText = 'No CO earned'
			// Render CO text with logo
			return (
				<div className={styles.allowanceResultUnitTextResultLogo}>
					<CancelIcon className={styles.allowanceResultUnitTextResultLogoSVG} />
					<div className={styles.allowanceResultUnitTextResultText}>{COEarnedText}</div>
				</div>
			)
		}
	}
	// Render the AllowanceResultUnitTextResult component
	return (
		<div>
			{getProgressText(progress)}
			{getCOText(earnedCO)}
		</div>
	);
}

export default AllowanceResultUnitTextResult;

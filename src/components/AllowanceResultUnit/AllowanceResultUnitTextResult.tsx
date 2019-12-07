// Import library
import React from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

// Import CSS module stylesheet
import styles from './AllowanceResultUnitTextResult.module.css';

// Setup typings for props for the AllowanceResultUnitTextResult component
type AllowanceResultUnitTextResultProps = {
    // Percentage of shift duty allowance hours obtained when compared to the 50 hours target
    progress: number;
}

// Render our allowance compute result as text
const AllowanceResultUnitTextResult: React.FC<AllowanceResultUnitTextResultProps> = ({ progress }: AllowanceResultUnitTextResultProps) => {
    // Define text to render at different progress level
    const textFullAllowance = 'Qualified for FULL shift duty allowance';
    const textHalfAllowance = 'Qualified for HALF shift duty allowance';
    const textHalfAllowanceExtra = (50 - progress * 50 / 100) + ' more hours required for FULL shift duty allowance';
    const textNoAllowance = (25 - progress * 50 / 100) + ' more hours required for HALF shift duty allowance';
    // Render our textual result
    if (progress >= 100) {
        // Render a Check logo with corresponding text
        return (
            <div className={styles.allowanceResultUnitTextResultLogo}>
                <CheckCircleIcon className={styles.allowanceResultUnitTextResultLogoSVG} />
                <div className={styles.allowanceResultUnitTextResultText}>{textFullAllowance}</div>
            </div>
        );
    }
    else if (progress >= 50) {
        // Render a Check logo with corresponding text
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
        // Render a Cross logo with corresponding text
        return (
            <div className={styles.allowanceResultUnitTextResultLogo}>
                <CancelIcon className={styles.allowanceResultUnitTextResultLogoSVG} />
                <div className={styles.allowanceResultUnitTextResultText}>{textNoAllowance}</div>
            </div>
        );
    }
}

export default AllowanceResultUnitTextResult;
import React from 'react';
import styles from './AppShell.module.css';

type AppShellProps = {
    /**
     * Top navigation bar content.
     */
    navBar: React.ReactNode;
    /**
     * Page content rendered in the scrollable main region.
     */
    children: React.ReactNode;
};

/**
 * Shared application shell with a sticky nav and a flex-growing main area.
 */
const AppShell: React.FC<AppShellProps> = ({ navBar, children }: AppShellProps) => {
    return (
        <div className={styles.appShell}>
            <div className={styles.appShellNav}>
                {navBar}
            </div>
            <main className={styles.appShellMain}>
                {children}
            </main>
        </div>
    );
};

export default AppShell;

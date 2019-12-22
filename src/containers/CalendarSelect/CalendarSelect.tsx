// Import library
import React from 'react';
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import Button from '@material-ui/core/Button';
import { ShiftDutyCalendar } from 'components/ShiftDutyCalendar';
import { ModifyDutyDialog } from 'components/ModifyDutyDialog';
import { NoDutyDialog } from 'components/NoDutyDialog';

// Import custom typings for libraries
import CalendarEvent from 'containers/App/CalendarEvent';
import SelectedSlotInfo from 'components/ShiftDutyCalendar/SelectedSlotInfo';

// Import CSS module stylesheet
import styles from './CalendarSelect.module.css';

// Typing for DutyConfig
type DutyConfig = typeof import("containers/App/DutyConfig.json");

// Setup typings for props and state for the CalendarSelect container
type CalendarSelectProps = {
    // Events (duty added) is the state of parent component
    events: Array<CalendarEvent>;
    // Duty config
    dutyConfig: DutyConfig;
    // Function called when event modification occured
    onEventModification: Function;
    // Function called when computation is initiated
    onConfirm: Function;
}
type CalendarSelectState = {
    // State to control whether the modify dialog box is open or not
    modifyDialog: boolean;
    // State to set the initial date for the ModifyDutyDialog
    modifyDialogInitialDate: Date;
    // State to set the initial duty (as duty id) set for the selected date
    modifyDialogInitialDuty: number;
    // State to set the event id that is currently being modified or -1 when in event adding mode
    modifyDialogEventId: number;
    // State to control whether the duty not found dialog box is open or not
    noDutyDialog: boolean;
}

// Render our calendar page for tuning the shift duty date selection
class CalendarSelect extends React.Component<CalendarSelectProps, CalendarSelectState> {

    constructor(props: CalendarSelectProps) {
        super(props);
        this.state = {
            modifyDialog: false,
            modifyDialogInitialDate: new Date(),
            modifyDialogInitialDuty: 0,
            modifyDialogEventId: -1,
            noDutyDialog: false
        };
    }

    render() {
        // Use dark theme
        const defaultMaterialTheme = createMuiTheme({
            palette: {
                type: 'dark'
            }
        });
        return (
            <ThemeProvider theme={defaultMaterialTheme}>
                <div className={styles.calendarSelect}>
                    <header className={styles.calendarSelectHeader}>
                        <p className={styles.calendarSelectTitle}>
                            Fine-tune your duty here
                        </p>
                        <ShiftDutyCalendar 
                            style={styles.calendarSelectCalendar}
                            events={this.props.events}
                            onSelectSlot={(slot: SelectedSlotInfo) => this.handleSelectSlot(slot)}
                            onSelectEvent={(event: CalendarEvent) => this.handleSelectEvent(event)}
                        />
                        <div className={styles.calendarSelectCalendarButtonSpacer}></div>
                        <ModifyDutyDialog 
                            key={this.state.modifyDialogInitialDate.getTime()}
                            open={this.state.modifyDialog}
                            initialDate={this.state.modifyDialogInitialDate}
                            initialDuty={this.state.modifyDialogInitialDuty}
                            dutyConfig={this.props.dutyConfig}
                            onConfirmModification={(dateSelected: Date, duty_id: number) => this.handleDutyModificationConfirm(dateSelected, duty_id)}
                            onCancelModification={() => this.handleDutyModificationCancel()}
                        />
                        <Button variant="contained" color="primary" className={styles.calendarSelectButton} onClick={() => this.handleComputeAllowance()}>
                            How much allowance will I get?
                        </Button>
                        <NoDutyDialog 
                            open={this.state.noDutyDialog}
                            onClose={() => { this.setState({ noDutyDialog: false }) }}
                        />
                    </header>
                </div>
            </ThemeProvider>
        );
    }

    /**
     * Event handler for selecting a slot in the ShiftDutyCalendar.
     * 
     * @param {SelectedSlotInfo} slot Description on the selected slot.
     * 
     * @return {void} 
     */
    handleSelectSlot(slot: SelectedSlotInfo) {
        if ((slot.action === "click" || slot.action === "select") && slot.start.getTime() === slot.end.getTime()) {
            // Only handle click/select event if a single date is selected
            // (i.e. slot selection event triggered with identical start time and end time)
            // Update state to open dialog with,
            //      1. The default date selected is set as the date selected
            //      2. The default duty selected is set as None (id = 0)
            //      3. The event id being modified is set as -1 (as event adding mode)
            this.setState({
                modifyDialog: true,
                modifyDialogInitialDate: slot.start,
                modifyDialogInitialDuty: 0,
                modifyDialogEventId: -1
            });
        }
    }

    /**
     * Event handler for selecting an existing event in the ShiftDutyCalendar.
     * 
     * @param {CalendarEvent} event Description on the selected event.
     * 
     * @return {void} 
     */
    handleSelectEvent(event: CalendarEvent) {
        // Open modify event dialog once an event is clicked
        // Update state to open dialog with,
        //      1. The default date selected is set as the date of the event selected
        //      2. The default duty selected is set as selected event duty id
        //      3. The event id being modified is set as the selected event id
        this.setState({
            modifyDialog: true,
            modifyDialogInitialDate: event.start,
            modifyDialogInitialDuty: event.duty.id,
            modifyDialogEventId: event.id
        });
    }

    /**
     * Event handler for confirming a event modification in ModifyDutyDialog.
     * 
     * @param {Date} dateSelected Date selected in ModifyDutyDialog dialog box.
     * @param {number} duty_id Duty ID selected in ModifyDutyDialog dialog box.
     * 
     * @return {void} 
     */
    handleDutyModificationConfirm(dateSelected: Date, duty_id: number) {
        // Forward duty modification event to <App> parent component
        this.props.onEventModification(dateSelected, duty_id, this.state.modifyDialogEventId);
        // Close the dialog box after modification is done
        this.setState({
            modifyDialog: false
        });
    }

    /**
     * Event handler for canceling a event modification in ModifyDutyDialog.
     * 
     * @return {void} 
     */
    handleDutyModificationCancel() {
        // Simply close the dialog box if modification is cancel
        this.setState({
            modifyDialog: false
        });
    }

    /**
     * Event handler for clicking compute allowance button.
     * 
     * @return {void} 
     */
    handleComputeAllowance() {
        // Check if there is any existing events first before computing the allowance
        if (this.props.events.length > 0) {
            // Events exists and ready for allowance compute
            // Call parent component method for computing allowance
            this.props.onConfirm();
        }
        else {
            // No event exists and allowance should not be computed
            // Instead, we should show a dialog that informed the user that no duty exists
            this.setState({
                noDutyDialog: true
            });
        }
    }

} 

export default CalendarSelect;
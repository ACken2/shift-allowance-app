// Import library
import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import CalendarEvent from './CalendarEvent';
import dutyConfig from './DutyConfig.json';

// Import our page to render
import { Home } from 'containers/Home';
import { DateSelect } from 'containers/DateSelect';
import { CalendarSelect } from 'containers/CalendarSelect';

// Setup typings for props and state for our App
type AppProps = {
    // Empty props
}
type AppState = {
    // Array of added shift duty events
    events: Array<CalendarEvent>
}

// Setup our App
class App extends React.Component<AppProps, AppState> {

    constructor(props: AppProps) {
        super(props);
        this.state = {
            events: []
        };
    }
    
    render() {
        return(
            <Router>
                <Switch>
                    <Route path="/step-1">
                        <DateSelect />
                    </Route>
                    <Route path="/step-2">
                        <CalendarSelect 
                            events={this.state.events}
                            dutyConfig={dutyConfig}
                            onEventModification={(dateSelected: Date, duty_id: number, event_modified: number) => this.handleEventModification(dateSelected, duty_id, event_modified)}
                        />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </Router>
        )
    }

    /**
     * Handler for duty modification event.
     * 
     * This method will automatically handle the duty modification event by
     * merging the changes into the events array in state.
     *
     * @param {Date} dateSelected The date selected by the user in the modification event.
     * @param {number} duty_id The duty ID selected by the user in the modification event.
     * @param {number} event_modified The event ID of the event being modified as in the events
     *      array in state, or -1 if the user intended to add a new duty.
     * 
     * @return {void}
     */
    handleEventModification(dateSelected: Date, duty_id: number, event_modified: number) {
        // Look up the duty corresponding to the duty_id
        const duty = dutyConfig.find(x => x.id === duty_id);
        // Ensure duty !== undefined
        if (typeof duty !== "undefined") {
            // Check if duty.timeslot is null or not
            if (duty.timeslot != null) {
                // Duty selected is not None (no duty)
                // Get the default duty specification to used
                let dutySpec = duty.timeslot;
                // Check if any override is specificed in the config file
                if (duty.override != null) {
                    // Get the day number of the date selected (0 - 6 corresponding to Sunday - Saturday)
                    const dayNumber = dateSelected.getDay();
                    // Check if any override is applicable if some override is specified
                    const override = duty.override.find(x => x.override_for === dayNumber);
                    // Override dutySpec if applicable override is found, or else use the default dutySpec
                    dutySpec = override ? override : dutySpec;
                }
                // Set the start and end time accordingly
                const startTime = new Date(dateSelected.getTime());
                startTime.setDate(startTime.getDate() + dutySpec.startDate);
                startTime.setHours(dutySpec.startHour);
                startTime.setMinutes(dutySpec.startMinute);
                const endTime = new Date(dateSelected.getTime());
                endTime.setDate(endTime.getDate() + dutySpec.endDate);
                endTime.setHours(dutySpec.endHour);
                endTime.setMinutes(dutySpec.endMinute);
                // Create new CalendarEvent for the modification commit
                const commit: CalendarEvent = {
                    id: event_modified,
                    title: duty.title,
                    start: startTime,
                    end: endTime,
                    duty: {
                        id: duty_id
                    }
                }
                // Merge changes to the state events array
                const merged_event: Array<CalendarEvent> = this.mergeEventChange(this.state.events, commit);
                // Update state
                this.setState({
                    events: merged_event
                });
            }
            else {
                // Duty selected is None, either a duty deletion event or a false add event
                // Create new CalendarEvent for the modification commit
                const commit: CalendarEvent = {
                    id: event_modified,
                    title: duty.title,
                    start: new Date(), // Placeholder
                    end: new Date(), // Placeholder
                    duty: {
                        id: duty_id
                    }
                }
                // Merge changes to the state events array
                const merged_event: Array<CalendarEvent> = this.mergeEventChange(this.state.events, commit);
                // Update state
                this.setState({
                    events: merged_event
                });
            }
        }
        // No state update here, since duty_id not found is not supposed to occur
    }

    /**
     * Merge a duty modification event with the events array in state.
     *
     * @param {Array<CalendarEvent>} original The original events array in state.
     * @param {CalendarEvent} commit The duty modification event expressed in the form of a CalendarEvent object where,
     *      commit.id should correspond to the event id being modified or -1 if a new event is to be added;
     *      commit.title should correspond to the event title of the event after modification or being added;
     *      commit.start and commit.end should correspond to the event start and end time of the duty or be considered as a duty deletion event if the start time and end time is identical;
     *      and commit.duty.id should correspond to the duty id of the duty after modification or being added that correspond to the id in DutyConfig.
     * 
     * @return {Array<CalendarEvent>} The merged events state array.
     */
    mergeEventChange(original: Array<CalendarEvent>, commit: CalendarEvent) {
        // Before making any changes, clone the original array first
        const cloned = original.slice();
        // First check if the commit is a change event, or an add event by looking at commit.id
        if (commit.id === -1) {
            // Add event
            // Filter out add event on duty that does not have any duty specification (e.g. None)
            // by checking if start time and end time is the same or not
            if (commit.start.getTime() === commit.end.getTime()) {
                // In that case, just return the original events array
                return cloned;
            }
            else {
                // Add the event into the events array otherwise
                // Find the max existing ID within the events array
                const maxId = Math.max(...cloned.map(o => o.id), 0);
                // Push the new commit directly into the events array and return it
                commit.id = maxId + 1;
                cloned.push(commit);
                return cloned;
            }
        }
        else {
            // Modify event
            // Filter out modify event on duty that does not have any duty specification (e.g. None)
            // by checking if start time and end time is the same or not
            // since it represent event removal
            if (commit.start.getTime() === commit.end.getTime()) {
                // Remove the event in the events array with the same id as the commit to remove it
                // Find the event to be removed first by matching the event.id with commit.id
                const eventToRemove = cloned.find(x => x.id === commit.id);
                // Ensure the event is not undefined
                if (eventToRemove) {
                    // Find the index of the event in the cloned array
                    const eventToRemoveIndex = cloned.indexOf(eventToRemove);
                    // Remove the event
                    cloned.splice(eventToRemoveIndex, 1);
                }
                // Return the modified array
                return cloned;
            }
            else {
                // Merge the commit into the event object if otherwise
                // Find the event to be modified first by matching the event.id with commit.id
                const eventToModify = cloned.find(x => x.id === commit.id);
                // Ensure the event is not undefined
                if (eventToModify) {
                    // Merge the commit by modifying the event object directly
                    eventToModify.title = commit.title;
                    eventToModify.start = commit.start;
                    eventToModify.end = commit.end;
                    eventToModify.duty.id = commit.duty.id;
                }
                // Return the modified array
                return cloned;
            }
        }
    }

}

export default App;
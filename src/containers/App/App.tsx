// Import library
import React from 'react';
import {
	Routes,
	Route,
	useNavigate,
	NavigateFunction,
} from 'react-router-dom';
import { startOfWeek, endOfWeek, addDays, isSameDay } from 'date-fns';
import { Allowance, ComputeResult } from './AllowanceModule/Allowance';

// Import CalendarEvent typing
import CalendarEvent from './CalendarEvent';

// Import HolidayModule
import { HolidayAPI } from './HolidayModule';

// Import constant
import * as Constant from './AppConstant';

// Import config files
import dutyConfigPYPher from './DutyConfig_PY_PHER.json';
import dutyLoop from './DutyLoop.json';

// Import our page to render
import { Home } from 'containers/Home';
import { NavBar } from 'containers/NavBar';
import { DateSelect } from 'containers/DateSelect';
import { CalendarSelect } from 'containers/CalendarSelect';
import { AllowanceResult } from 'containers/AllowanceResult';
import { AppShell } from 'containers/AppShell';

// Setup typings for props and state for our App
type AppProps = {
	navigate: NavigateFunction;
}
type AppState = {
	// Array of added shift duty events
	events: Array<CalendarEvent>
	// Store latest compute result from Allowance class
	lastAllowanceComputed: ComputeResult;
	// Boolean that control whether <Redirect /> to CalendarSelect container is rendered
	redirectCalendarSelect: boolean;
	// Number that indicates the current DutyConfig profile to use
	dutyConfigMode: number;
}

// Setup our App
class App extends React.Component<AppProps, AppState> {

	constructor(props: AppProps) {
		super(props);
		HolidayAPI.initialize(); // Initialize HolidayAPI
		this.state = {
			events: [],
			lastAllowanceComputed: {
				month: [],
				day: [[]],
				earnedCO: []
			},
			redirectCalendarSelect: false,
			dutyConfigMode: Constant.DUTY_PY_PHER
		};
	}

	/**
	 * Build a shared shell with the given navigation props and page content.
	 *
	 * @param navProps Navigation bar route and duty-config props.
	 * @param children Page content for the main region.
	 * @return Shell element wrapping nav and page.
	 */
	renderShell(
		navProps: {
			backRoute: string | undefined;
			nextRoute: string | undefined;
			disableDutyConfigChange: boolean;
		},
		children: React.ReactNode
	) {
		return (
			<AppShell
				navBar={
					<NavBar
						backRoute={navProps.backRoute}
						nextRoute={navProps.nextRoute}
						disableDutyConfigChange={navProps.disableDutyConfigChange}
						dutyConfigModeSelected={this.state.dutyConfigMode}
						onDutyConfigModeChange={(dutyMode: number) => this.handleDutyConfigModeChange(dutyMode)}
					/>
				}
			>
				{children}
			</AppShell>
		);
	}
	
	render() {
		return(
			<Routes>
				<Route path="/date-select" element={
					this.renderShell(
						{
							backRoute: "/",
							nextRoute: this.state.events.length > 0 ? "/calendar-select" : undefined,
							disableDutyConfigChange: false,
						},
						<DateSelect
							onDateConfirmed={(startDate: Date, dutyLoopId: number = 0) => this.handleDateConfirmation(startDate, dutyLoopId)}
						/>
					)
				} />
				<Route path="/calendar-select" element={
					this.renderShell(
						{
							backRoute: "/date-select",
							nextRoute: undefined,
							disableDutyConfigChange: true,
						},
						<CalendarSelect
							events={this.state.events}
							dutyConfig={this.getDutyConfigSelected()}
							onEventModification={
								(dateSelected: Date, duty_id: number, event_modified: number, setForWholeWeek: boolean = false) =>
									this.handleEventModification(dateSelected, duty_id, event_modified, setForWholeWeek)
							}
							onConfirm={() => this.handleComputeAllowance()}
						/>
					)
				} />
				<Route path="/allowance-result" element={
					this.renderShell(
						{
							backRoute: "/calendar-select",
							nextRoute: undefined,
							disableDutyConfigChange: true,
						},
						<AllowanceResult
							allowance={this.state.lastAllowanceComputed.month}
							allowanceBreakdown={this.state.lastAllowanceComputed.day}
							earnedCOByMonth={this.state.lastAllowanceComputed.earnedCO}
						/>
					)
				} />
				<Route path="/" element={
					this.renderShell(
						{
							backRoute: undefined,
							nextRoute: undefined,
							disableDutyConfigChange: false,
						},
						<Home onGettingStarted={() => this.handleGettingStarted()} />
					)
				} />
			</Routes>
		)
	}

	/**
	 * Get the current selected DutyConfig to be used for adding duty/events into the calendar.
	 * 
	 * @return {JSON} Selected DutyConfig
	 */
	getDutyConfigSelected() {
		if (this.state.dutyConfigMode === Constant.DUTY_PY_PHER) {
			return dutyConfigPYPher;
		}
		else {
			return dutyConfigPYPher; // Fallback
		}
	}

	/**
	 * Convert duty modification event into a commit in the form of a CalendarEvent object
	 * that is ready for merging into the main state via mergeEventChange().
	 * 
	 * This function is pure and does not alter the component state.
	 * Functions using this helper function must manually update state in their implementation.
	 *
	 * @param {Date} dateSelected The date selected by the user in the modification event.
	 * @param {number} duty_id The duty ID selected by the user in the modification event.
	 * @param {number} event_modified The event ID of the event being modified as in the events
	 *      array in state, or -1 if the user intended to add a new duty.
	 * 
	 * @return {CalendarEvent} The commit ready for merging.
	 */
	getEventModificationCommit(dateSelected: Date, duty_id: number, event_modified: number) {
		// Look up the duty corresponding to the duty_id
		const duty = this.getDutyConfigSelected().find(x => x.id === duty_id);
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
					let dayNumber = dateSelected.getDay();
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
				startTime.setSeconds(0);
				startTime.setMilliseconds(0);
				const endTime = new Date(dateSelected.getTime());
				endTime.setDate(endTime.getDate() + dutySpec.endDate);
				endTime.setHours(dutySpec.endHour);
				endTime.setMinutes(dutySpec.endMinute);
				endTime.setSeconds(0);
				endTime.setMilliseconds(0);
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
				return commit;
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
				return commit;
			}
		}
		// No state update here, since duty_id not found is not supposed to occur
		return null;
	}

	/**
	 * Merge a duty modification event with the events state array.
	 * 
	 * This function is pure and does not alter the component state.
	 * Functions using this helper function must manually update state in their implementation.
	 *
	 * @param {Array<CalendarEvent>} original The original state events array.
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

	/**
	 * Handle the 'Getting Started' button on Home page.
	 *
	 * Redirects the app to the DateSelect page.
	 *
	 * @return {void}
	 */
	handleGettingStarted() {
		this.props.navigate("/date-select");
	}

	/**
	 * Handler for date confirmation on DateSelect page.
	 * 
	 * This method will automatically regenerate the events array based on the given parameters
	 * and replace the current events state array using initializeCalendar() and redirect to CalendarSelect page.
	 *
	 * @param {Date} startDate The first date for generation.
	 * @param {Array<number>} dutyLoopId The duty loop ID in DutyLoop.json that specified how
	 *      the duty starting from startDate should be generated. More specifically, the loopId key determined
	 *      the loop specification including its duration (i.e. number of days to loop) and ignoreWeekend
	 *      (i.e. whether the generation process should cross-over into weekend and next week automatically)
	 *      setting, and dutyIdLoopUnit key is an array of duty id (as specified in DutyConfig.json) that the
	 *      generation process should loop over (i.e. for a unit of [0, 1], day 0 should have duty id 0, day 1
	 *      should have duty id 1, day 2 should have duty id 0...etc.).
	 * 
	 * @return {void}
	 */
	handleDateConfirmation(startDate: Date, dutyLoopId: number) {
		// Obtain duty specification
		const dutySpec = dutyLoop.duty.find(x => x.id === dutyLoopId);
		// Make sure the duty specificaiton is found
		if (!dutySpec) { 
			// Invalid duty spec is used by the SKIP button in step 1
			// In that case, we just have to redirect to the calendar with a empty event state
			// With dutyIdArray computed, we can initialize the calendar
			this.initializeCalendar(startDate, []);
		}
		else {
			// Get the loop specification associated with dutySpec
			const loopSpec = dutyLoop.loop.find(x => x.id === dutySpec.loopId);
			// Make sure the loop specification is found
			if (!loopSpec) { return }
			// Get the duty id loop unit
			const dutyIdLoopUnit = dutySpec.dutyIdLoopUnit;
			// Get the loop duration
			const loopDuration = loopSpec.duration;
			// Get whether the loop should ignore weekend (i.e. cross-over to weekend and next week automatically)
			const loopIgnoreWeekend = loopSpec.ignoreWeekend;
			// Compute dutyIdArray based on dutyIdLoopUnit, loopDuration and loopIgnoreWeekend
			const dutyIdArray: Array<number> = [];
			// Loop for loopDuration days
			for (let i=0; i<loopDuration; i++) {
				// If loopIgnoreWeekend is false, we have to check if current date is weekend or not
				if (!loopIgnoreWeekend) {
					// Compute current date
					const currentDate = new Date(startDate.getTime());
					currentDate.setDate(startDate.getDay() + i);
					// Check if current date is weekend or not
					if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
						// If true, then break the loop and not continue forward
						break;
					}
				}
				// Append the associated duty id into dutyIdArray
				// The associated duty at day i should be i % dutyIdLoopUnit.length in dutyIdLoopUnit array
				// Example: Given length 4 as loop unit, day 1/5 should have duty id at index 1%4=1 and 5%4=1 respectively
				dutyIdArray.push(dutyIdLoopUnit[i % dutyIdLoopUnit.length]);
			}
			// With dutyIdArray computed, we can initialize the calendar
			this.initializeCalendar(startDate, dutyIdArray);
		}
		// Use redirectCalendarSelect state to redirect to CalendarSelect page
		this.setState({
			redirectCalendarSelect: true
		});
		// Push next page to history object to render calendar for fine-tuning
		this.props.navigate('/calendar-select');
	}

	/**
	 * Initialize the events state array.
	 * 
	 * This method will automatically regenerate the events array based on the given parameters
	 * and replace the current events state array.
	 *
	 * @param {Date} startDate The first date for generation.
	 * @param {Array<number>} dutyIdArray The duty ID that should be assigned to each subsequent day
	 *      after startDate in the regenerated events array. This assumes that id at position i of the array 
	 *      corresponds to the duty that should be assigned to the date on (startDate + i Day).
	 *      For example, if startDate is 2019-09-01 and dutyIdArray is [0, 1], then this method would regenerate
	 *      an event array with 2019-09-01 having a duty with the duty id 0, and 2019-09-02 (+1 day) having a duty 
	 *      with the duty id 1.
	 * 
	 * @return {void}
	 */
	initializeCalendar(startDate: Date, dutyIdArray: Array<number>) {
		// Create a new empty events array
		let events: Array<CalendarEvent> = [];
		// Crearte a new event modification commit for each duty id in dutyIdArray starting from startDate
		const commits = dutyIdArray.map((dutyId, i) => {
			// Compute date for current index (startDate + i days)
			const date = new Date(startDate.getTime());
			date.setDate(startDate.getDate() + i);
			// Return a commit associated with the duty id
			return this.getEventModificationCommit(date, dutyId, -1);
		});
		// Merge the commit one-by-one unless it is null
		commits.forEach((commit) => {
			if (commit) {
				events = this.mergeEventChange(events, commit);
			}
		});
		// Push the initialized events state array into our App state
		this.setState({
			events: events
		});
	}

	/**
	 * Generates an array of working days (Monday to Friday) for the week 
	 * of the provided date. The week starts on Sunday and ends on Saturday.
	 * 
	 * @param {Date} inputDate - The date for which the week is calculated.
	 * @returns {Date[]} An array of dates representing the working days 
	 * (Monday to Friday) within the same week as the input date.
	 */
	getWorkingDaysOfWeek(inputDate: Date): Date[] {
		// Get the start and end of the week (assuming Sunday is the first day of the week)
		const start = startOfWeek(inputDate, { weekStartsOn: 0 }); // weekStartsOn: 0 means Sunday
		const end = endOfWeek(inputDate, { weekStartsOn: 0 }); // End on Saturday
		// Loop counter
		let currentDate = start;
		// Temp array
		const workingDays: Date[] = [];
		// Loop from start of the week (Sunday) to the end (Saturday)
		while (currentDate <= end) {
			// Check if the current date is a working day (not a weekend)
			// Here we define working days as Monday to Friday
			const dayOfWeek = currentDate.getDay();
			if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude Sunday (0) and Saturday (6)
				workingDays.push(currentDate);
			}
			currentDate = addDays(currentDate, 1); // Move to the next day
		}
		return workingDays;
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
	 * @param {boolean} setForWholeWeek If true, the given duty_id will be set for all working days in the dateSelected.
	 * 
	 * @return {void}
	 */
	handleEventModification(dateSelected: Date, duty_id: number, event_modified: number, setForWholeWeek: boolean = false) {
		// Temp array for commit(s)
		const commits: CalendarEvent[] = [];
		// Generate the event modification commit(s)
		if (setForWholeWeek) {
			const dates = this.getWorkingDaysOfWeek(dateSelected);
			dates.forEach((date) => {
				// Temp variable
				let commit: CalendarEvent | null = null;
				// Attempt to look for event_id that are located on the same day
				const eventsOnTheSameDay = this.state.events.filter((e) => isSameDay(e.start, date));
				if (eventsOnTheSameDay.length > 0) {
					// If there are already an event on the same day, we overwrite it
					commit = this.getEventModificationCommit(date, duty_id, eventsOnTheSameDay[0].id);
				}
				else {
					// Otherwise, we add a new event
					commit = this.getEventModificationCommit(date, duty_id, -1);
				}
				if (commit) {
					commits.push(commit);
				}
			});
		}
		else {
			const commit = this.getEventModificationCommit(dateSelected, duty_id, event_modified);
			if (commit) {
				commits.push(commit);
			}
		}
		// Merge changes to the state events array if there are any commit
		if (commits.length > 0) {
			let eventState = this.state.events;
			commits.forEach((commit) => {
				eventState = this.mergeEventChange(eventState, commit);
			});
			this.setState({
				events: eventState
			});
		}
		// No need to update state if there are no commit
	}

	/**
	 * Handler for confirming on CalendarSelect page.
	 * 
	 * This method will called Allowance.compute and push the ComputeResult into lastAllowanceComputed
	 * in state and force an update.
	 * 
	 * @return {void}
	 */
	handleComputeAllowance() {
		// No need to check if any events exists since it is assumed to be checked in CalendarSelect container
		// Compute the allowance and push it to App state
		new Allowance().compute(this.state.events).then((allowance) => {
			this.setState({
				lastAllowanceComputed: allowance
			});
			// Push next page to history object to render AllowanceResult page
			this.props.navigate('/allowance-result');
		});
	}

	/**
	 * Handler for DutyConfig mode changes in NavBar.
	 * 
	 * This method will modify this.state.dutyConfigMode to indicate such changes, while clearing
	 * any added events or computed allowance result if any.
	 * 
	 * @param {number} dutyConfigMode New DutyConfig mode selected which should be defined in AppConstant.ts
	 * 
	 * @return {void}
	 */
	handleDutyConfigModeChange(dutyConfigMode: number) {
		// Push the changes in DutyConfig into the App state
		// We also clear any added event or computed allowance if any to avoid confusion
		this.setState({
			events: [],
			lastAllowanceComputed: {
				month: [],
				day: [[]],
				earnedCO: []
			},
			dutyConfigMode: dutyConfigMode
		});
	}

}

function AppWithNavigate() {
	const navigate = useNavigate();
	return <App navigate={navigate} />;
}

export default AppWithNavigate;

// Import library
import moment from 'moment';

// Import HolidayModule for checking if a date is a public holiday
import { HolidayAPI } from '../HolidayModule';

// Import CalendarEvent typing
import CalendarEvent from '../CalendarEvent';

// Import config files
import allowanceConfig from './AllowanceSpec.json';

// Define the return format for this class
// Return type for each allowance computation result
export type AllowanceDetail = {
    start: Date; // Start time of the calculated period
    end: Date; // End time of the calculated period
    hours: number; // Number of hours qualified for shift duty allowance calculation
    desc: string; // Shift duty title in ComputeResult.day, and empty string in ComputeResult.month
}
// Return type for overall allowance computation that included both by-month and by-day allowance break down, and number of CO earned on each month
export type ComputeResult = {
    month: Array<AllowanceDetail>;
    day: Array<Array<AllowanceDetail>>;
    earnedCO: Array<number>;
}

export class Allowance {

    /**
     * Entry point for Allowance class to compute shift duty allowance from array of
     * CalendarEvent that described the duties of the user according to shift duty allowance
     * specification in AllowanceSpec.json.
     * 
     * This method will not modify the original array and maintain immutability 
     * of the original array passed down.
     * 
     * @param {Array<CalendarEvent>} events Array of CalendarEvents that described the duties of the user
     * 
     * @return {ComputeResult} Shift duty allowance computation result breakdown by month and by day
     */
    compute(events: Array<CalendarEvent>): ComputeResult {
        // Temp variable for storing our by-month and by-day allowance break down
        const allowanceMonth: Array<AllowanceDetail> = [];
        const allowanceDay: Array<Array<AllowanceDetail>> = [];
        // Temp variable for storing the number of CO earned by-month
        const coEarned: Array<number> = [];
        // Split cross-day event into single-day events only for easier processing
        let splittedEvent = this.splitCrossDayEvents(events);
        // Split events by months
        let eventByMonths = this.splitEventByMonths(splittedEvent);
        // Compute allowance month-by-month
        eventByMonths.forEach((eventByMonth) => {
            // Compute allowance by day first
            const allowanceByDay = this.computeAllowanceByDate(eventByMonth);
            // Aggreate allowance by month
            const allowanceByMonth = this.aggreateAllowanceByMonth(allowanceByDay);
            // Compute CO earned in the current month
            const coEarnedCurrentMonth = this.countCOEarnedByMonth(eventByMonth);
            // Push result to our temp array
            allowanceMonth.push(allowanceByMonth);
            allowanceDay.push(allowanceByDay);
            coEarned.push(coEarnedCurrentMonth);
        });
        // Return computation result
        return {
            month: allowanceMonth,
            day: allowanceDay,
            earnedCO: coEarned
        } as ComputeResult;
    }

    /**
     * Split cross-day event (i.e. event object that spans over 24:00 to the next day)
     * in the events array into separate events that does not span across to the next day.
     * 
     * This method will clone the CalendarEvent object in the events array during the process
     * as to not modify the original array and maintain immutability of the original array.
     * 
     * Note: Split event may still technically span across to the next day on 00:00:00. Thus, the
     * weekday (i.e. Sun-Sat) of the event should be determined by getDay() on the start date in computaton.
     * 
     * @param {Array<CalendarEvent>} events Array of CalendarEvents that might contain cross-day events
     * 
     * @return {Array<CalendarEvent>} Array of CalendarEvents that contains no cross-day events
     */
    splitCrossDayEvents(events: Array<CalendarEvent>): Array<CalendarEvent> {
        // Process each event one by one
        // We are using FlatMap since the final array length may be different from the original array after event splitting
        return events.flatMap((event) => {
            // Check if event is cross-day and therefore has to be split
            if (event.start.getDate() === event.end.getDate()) {
                // No need to split the event if the start and end date is the same
                // For immutability reason, we are creating a new CalendarEvent object
                return {
                    id: event.id,
                    title: event.title,
                    start: new Date(event.start.getTime()),
                    end: new Date(event.end.getTime()),
                    duty: { id: event.duty.id }
                } as CalendarEvent;
            }
            else {
                // Cross-day event detected and therefore a split is necessary
                // Temp variable for storing the current date we are processing, which should start at event.start
                let currentDate = new Date(event.start.getTime());
                // Temp variable for storing an array of event
                let splittedEvent: Array<CalendarEvent> = [];
                // Split the event and create new event until currentDate is on the same date as event.end
                while (currentDate.getDate() !== event.end.getDate()) {
                    // New end date object should end on the same day at 24:00:00:00 for cross-day event
                    // Technically, it will already push the date to the next day but it is good enough for day-based (Mon-Sun) calculation
                    let endDate = new Date(currentDate.getTime());
                    endDate.setHours(24);
                    endDate.setMinutes(0);
                    endDate.setSeconds(0);
                    endDate.setMilliseconds(0);
                    // Create a new event and append to our temp array
                    splittedEvent.push({
                        id: event.id,
                        title: event.title,
                        start: new Date(currentDate.getTime()),
                        end: new Date(endDate.getTime()),
                        duty: { id: event.duty.id }
                    } as CalendarEvent);
                    // Set the new currentDate as 00:00:00 at the next day
                    // This should work even if currentDate is previously set to 24:00 since it automatically sets it to 00:00 of the next day
                    currentDate.setHours(24);
                    currentDate.setMinutes(0);
                    currentDate.setSeconds(0);
                    currentDate.setMilliseconds(0);
                }
                // We have to append one more event once currentDate is on the same date as event.end
                splittedEvent.push({
                    id: event.id,
                    title: event.title,
                    start: new Date(currentDate.getTime()),
                    end: new Date(event.end.getTime()),
                    duty: { id: event.duty.id }
                } as CalendarEvent);
                // Return the split event array
                return splittedEvent;
            }
        });
    }

    /**
     * Split an array of events that might contains events across different months into
     * arrays of events by months.
     * 
     * For instance, if the original event array contains both events on Nov and Dec, then
     * it will return 2 arrays (i.e. Array<Array<CalendarEvent>> of length 2), 
     * each containing the event in Nov and Dec respectively.
     * 
     * @param {Array<CalendarEvent>} events Array of CalendarEvents that might contain events across different months
     * 
     * @return {Array<Array<CalendarEvent>>} Arrays of CalendarEvents with each array only containing events in the same months
     */
    splitEventByMonths(events: Array<CalendarEvent>): Array<Array<CalendarEvent>> {
        // To split events consistently, we have to ensure the events array is sorted according to date first
        // This is because the events array passed from App class is NOT guaranteed to be sorted
        events.sort((a: CalendarEvent, b: CalendarEvent) => a.start.getTime() - b.start.getTime());
        // Temp variable for storing current month and current array
        let currentMonth = events[0].start.getMonth();
        let currentArray: Array<CalendarEvent> = [];
        // Variable for storing our final result array
        let arrayOfArray: Array<Array<CalendarEvent>> = [];
        // Split the events by month
        events.forEach((event) => {
            // Check if the current event is still scheduled in the currentMonth
            if (event.start.getMonth() === currentMonth) {
                // Push the event to currentArray if it is still on the same month
                currentArray.push(event);
            }
            else {
                // If not, then we have to push currentArray into arrayOfArray
                arrayOfArray.push(currentArray);
                // Then, reset currentMonth and currentArray to the next month
                currentMonth = event.start.getMonth();
                currentArray = [];
                // Finally, push the current event (which is on the next month) to our reset currentArray
                currentArray.push(event);
            }
        });
        // We also have to push the last currentArray into arrayOfArray before we return
        arrayOfArray.push(currentArray);
        // Return the processed array of array of CalendarEvent
        return arrayOfArray;
    }

    /**
     * Compute allowance on day-to-day basis and return 1 AllowanceDetail object
     * per event in the events array.
     * 
     * This method assumes that no cross-day event is passed in the events array since it 
     * does not implement any checking mechanism on whether this requirement satisified.
     * 
     * @param {Array<CalendarEvent>} events Array of CalendarEvents that contains no cross-day events
     * 
     * @return {Array<AllowanceDetail>} Array of AllowanceDetail, each mapped to its corresponding event in events array, 
     *      that described the number of hours from the event that satisified for calculation in shift duty allowance
     */
    computeAllowanceByDate(events: Array<CalendarEvent>): Array<AllowanceDetail> {
        // Compute allowance obtainable per event, which is assumed to contain no cross-day event
        return events.map((event) => {
            // First, compute the weekday (i.e. 0-6 that correspond to Sun-Sat) of the event
            let weekday = event.start.getDay();
            // We also need to check whether the current day is a public holiday or not
            const holidayCheck = new HolidayAPI().isHoliday(event.start);
            if (holidayCheck.isHoliday) {
                // If the date is a holiday, override weekday to 8 - a special flag for public holiday
                weekday = 8;
            }
            // Find the applicable allowance specification
            // In allowanceConfig, each config has an "applicable" array that listed the weekday that this config could apply
            const allowanceConfigApplicable = allowanceConfig.find(x => x.applicable.includes(weekday));
            // Temp variable for storing the number of hours from the event that satisified for calculation in shift duty allowance
            let allowanceHours = 0;
            // Ensure applicable config is found
            if (allowanceConfigApplicable) {
                // Check if each timeslot in allowance config is applicable to the event
                allowanceConfigApplicable.slots.forEach((config) => {
                    // Get the start and end time of the allowance slot config on the same date as the event as a Date object
                    const allowanceTimeslotStart = new Date(event.start.getTime());
                    allowanceTimeslotStart.setHours(config.startHour);
                    allowanceTimeslotStart.setMinutes(config.startMinute);
                    allowanceTimeslotStart.setSeconds(config.startSecond);
                    const allowanceTimeslotEnd = new Date(event.start.getTime());
                    allowanceTimeslotEnd.setHours(config.endHour);
                    allowanceTimeslotEnd.setMinutes(config.endMinute);
                    allowanceTimeslotEnd.setSeconds(config.endSecond);
                    // Timeslot is applicable if either one of the following satisified,
                    //      1. allowanceTimeslotStart <= event.start <= allowanceTimeslotEnd
                    //      2. allowanceTimeslotStart <= event.end <= allowanceTimeslotEnd
                    // Satisified either one means that the duty is taking place in-between the allowance timeslot
                    if (
                        (allowanceTimeslotStart.getTime() <= event.start.getTime() && event.start.getTime() <= allowanceTimeslotEnd.getTime())
                        || (allowanceTimeslotStart.getTime() <= event.end.getTime() && event.end.getTime() <= allowanceTimeslotEnd.getTime())
                    ) {
                        // Timeslot is applicable
                        // In that case, time applicable for allowance is calculated by max(allowanceTimeslotStart, event.start) -> min(allowanceTimeslotEnd, event.end)
                        const allowanceStartTime = Math.max(allowanceTimeslotStart.getTime(), event.start.getTime());
                        const allowanceEndTime = Math.min(allowanceTimeslotEnd.getTime(), event.end.getTime());
                        // Miliseconds for allowance can be calculated by allowanceEndTime - allowanceStartTime
                        const allowanceMS = allowanceEndTime - allowanceStartTime;
                        // Hours for allowance calculation can be computed by ((allowanceMS / 1000)s / 60)m / 60
                        // Override the variable allowanceHours
                        allowanceHours = ((allowanceMS / 1000) / 60) / 60;
                    }
                });
            }
            // Customize the allowance description by appending Public Holiday if weekday is 0 (Sunday) or 8 (Public Holiday)
            let allowanceDesc: string = (weekday === 0 || weekday === 8) ? event.title + ' - Public Holiday' : event.title;
            // Return AllowanceDetail for the event
            return {
                start: event.start,
                end: event.end,
                hours: allowanceHours,
                desc: allowanceDesc
            };
        });
    }

    /**
     * Aggreate array of AllowanceDetail to compute the total number of hours that satisified 
     * for calculation in shift duty allowance in the month.
     * 
     * This method assumes that only AllowanceDetail within the same month is passed down in
     * parameter since it does not implement any checking mechanism on whether this requirement
     * satisified.
     * 
     * @param {Array<AllowanceDetail>} allowances Array of AllowanceDetail within the same month
     * 
     * @return {AllowanceDetail} Aggreated AllowanceDetail for the month
     */
    aggreateAllowanceByMonth(allowances: Array<AllowanceDetail>): AllowanceDetail {
        // Aggreate each allowance and sums up AllowanceDetail.hours for the month
        const totalAllowanceHour = allowances.reduce((aggreatedAllowanceHours, allowance) => {
            return aggreatedAllowanceHours += allowance.hours;
        }, 0);
        // Return an aggreated AllowanceDetail object
        return {
            start: allowances[0].start,
            end: allowances[allowances.length - 1].end,
            hours: totalAllowanceHour,
            desc: ''
        };
    }

    /**
     * Count the number of CO earned due to duties in the events array.
     * 
     * This method assumes that only events within the same month is passed down in
     * parameter since it does not implement any checking mechanism on whether this requirement
     * satisified.
     * 
     * @param {Array<CalendarEvent>} events Array of CalendarEvent within the same month
     * 
     * @return {number} Number of CO earned for the month
     */
    countCOEarnedByMonth(events: Array<CalendarEvent>): number {
        // Temporary variable for storing the Date that has already been counted
        let countedDate = new Set();
        // Initialize HolidayAPI
        let holidayAPI = new HolidayAPI();
        // Reduce the events array (i.e. loop for each element in array and return a single number)
        return events.reduce((coCounted: number, event: CalendarEvent) => {
            // Format event.start as YYYY-MM-DD
            let startDateStr = moment(event.start).format('YYYY-MM-DD');
            // Check if the date is a Public Holiday and has not been counted (not within countedDate set) yet
            if (holidayAPI.isHoliday(event.start).isHoliday && !countedDate.has(startDateStr)) {
                // Current event is situated on Public Holiday
                // Append the current date to the countedDate set to avoid counting the same date twice
                countedDate.add(startDateStr);
                // Add 1 to coCounted and returns it
                return coCounted + 1;
            }
            else {
                return coCounted;
            }
        }, 0);
    }

}
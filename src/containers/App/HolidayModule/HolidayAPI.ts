// Import dependencies
import ICSProcessor, { ProcessedEvent } from './ICSProcessor';

// Typing for the return type of isHoliday() method
type HolidaySpec = {
    // True if the date is a holiday, false if otherwise
    isHoliday: boolean;
    // Description of the holiday, or null when the given date is not a holiday
    description: string | null;
}

export default class HolidayAPI {

    // Hong Kong holiday iCal URL with CORS proxy
    private static iCalURL = "https://us-central1-always-free-216810.cloudfunctions.net/Hong-Kong-1823-iCal-CORS-proxy";
    // Array of holiday as ProcessedEvent[]
    private static holiday: ProcessedEvent[] | undefined;
    // Array containing the timestamp of each holiday for quick comparision
    private static holidayTimestamp: Array<number> | undefined;
    // Promise that resolve when HolidayAPI has been initialized
    private static initializePromise: Promise<void> | undefined;

    /**
     * Begin the process to initialize the HolidayAPI class.
     * 
     * Subsequent method should await to initializePromise before using holiday or holidayTimestamp.
     */
    public static initialize() {
        // Begin initialization
        if (this.initializePromise === undefined && (this.holiday === undefined || this.holidayTimestamp === undefined)) {
            this.initializePromise = this.initializeInternal();
        }
    }

    /**
     * Actual code that initialize the HolidayAPI class.
     */
    private static async initializeInternal() {
        try {
            // Get the iCal
            const ical = (await (await fetch(this.iCalURL)).text());
            // Process iCal into ParsedICSEvent
            this.holiday = ICSProcessor(ical);
            // Initialize the holidayTimestamp array
            this.holidayTimestamp = this.holiday.map((h) => {
                return new Date(h.date).getTime();
            });
        }
        catch (err) {
            this.holiday = [];
            this.holidayTimestamp = [];
            window.alert(
                'An error occurred while fetching the latest public holiday information, which will affect the accuracy of holiday-related calculations.\r\n' +
                'Please refresh the page and try again.\r\n' +
                'If the problem persists, please contact the developer.'
            );
        }
    }

    /**
     * Check whether the given date is a holiday as defined in
     * the loaded JSON data file.
     * 
     * The given date would be considered a holiday as long as
     * it has the same date as any records in the JSON data file
     * regardless of its hours, minutes, seconds and miliseconds
     * field.
     * 
     * @param {Date} date Date to be tested.
     * 
     * @return {HolidaySpec} HolidaySpec object containing isHoliday and description field.
     */
    public static async isHoliday(date: Date): Promise<HolidaySpec> {
        if (this.holiday === undefined || this.holidayTimestamp === undefined) {
            // If holiday and holidayTimestamp is not yet ready, we call initialize to initialize them
            this.initialize();
            await this.initializePromise;
            // And then return isHoliday
            return this.isHoliday(date);
        }
        else {
            // Clone the date object provided
            const dateToTest = new Date(date.getTime());
            // Set hours, minutes, seconds and miliseconds to 0
            dateToTest.setHours(0);
            dateToTest.setMinutes(0);
            dateToTest.setSeconds(0);
            dateToTest.setMilliseconds(0);
            // If the given date is a holiday, then holidayTimestamp should contain its timestamp
            const indexInArray = this.holidayTimestamp.indexOf(dateToTest.getTime());
            if (indexInArray === -1) {
                // Not a holiday
                return {
                    isHoliday: false,
                    description: null
                }
            }
            else {
                // It is a holiday!
                return {
                    isHoliday: true,
                    description: this.holiday[indexInArray].description
                }
            }
        }
    }

}
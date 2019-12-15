// Import public holiday JSON data file
import holiday from './HKPublicHoliday-2018-2020.json';

// Typing for the return type of isHoliday() method
type HolidaySpec = {
    // True if the date is a holiday, false if otherwise
    isHoliday: boolean;
    // Description of the holiday, or null when the given date is not a holiday
    description: string | null;
}

export default class HolidayAPI {

    // Array containing the timestamp of each holiday for quick comparision
    holidayTimestamp: Array<number> = [];

    /**
     * Initialize the HolidayAPI class.
     */
    constructor() {
        // Initialize the holidayTimestamp array
        this.holidayTimestamp = holiday.map((h) => {
            return new Date(h.date).getTime();
        });
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
    isHoliday(date: Date): HolidaySpec {
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
                description: holiday[indexInArray].description
            }
        }
    }

}
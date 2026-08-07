// Import library
// Use the browser-safe entry (avoids Node fs from ical's main index)
import ical from 'ical/ical.js';

// Typing of cleaned event ready to be used by HolidayAPI
export type ProcessedEvent = {
    date: string,
    description: string;
}

/**
 * Read and parse public holiday ICS file from 1823.gov.hk, summarized it into a
 * ProcessedEvent[] where each holdiay is represented by a ProcessedEvent object that 
 * contains a date and description field, and return it.
 *
 * @param {string} ics Public holiday ICS as text
 * 
 * @return {ProcessedEvent[]} The processed holiday list
 */
export default function ICSProcessor(ics: string): ProcessedEvent[] {
    // Prepare an array that contains our processed event
    const processedEvents: Array<ProcessedEvent> = [];
    // Load and parse the ICS file
    const events = ical.parseICS(ics);
    // Loop through the parsed event, process it, and push into the processedEvents array
    for (const event of Object.values(events)) {
        // Push the parsed event into processedEvents
        if (event.start !== undefined && event.summary !== undefined) {
            processedEvents.push({
                date: event.start.toString(),
                description: event.summary
            });
        }
    }
    // Return processed output
    return processedEvents;
}
// Import library
import * as fs from 'fs';
import * as path from 'path';
import * as ical from 'node-ical';
import * as readlineSync from 'readline-sync';

// Typing of event from ical.sync.parseICS after parsing the ICS file from the government
type ParsedICSEvent = {
    type: string;
    params: Array<any>;
    start: Date;
    end: Date;
    datetype: string;
    transparency: string;
    uid: string;
    summary: string;
}

// Typing of cleaned event ready for output
type ProcessedEvent = {
    date: string,
    description: string;
}

/**
 * Read and parse public holiday ICS file from 1823.gov.hk, summarized it into a
 * lightweight JSON file where each holdiay is represented by a JSON object that 
 * contains a date and description field, and output it to the given output path.
 * 
 * Run "npm run preprocess-ics" script to use this function.
 *
 * @param {string} ics_path Path to the public holiday ICS file from 1823.gov.hk.
 * @param {string} output_path Path to the JSON output file.
 * 
 * @return {void}
 */
function ICSPreprocessor(ics_path: string, output_path: string) {
    // Prepare an array that contains our processed event
    const processedEvents: Array<ProcessedEvent> = [];
    // Load and parse the ICS file
    const ics = fs.readFileSync(ics_path).toString();
    const events = ical.sync.parseICS(ics);
    // Loop through the parsed event, process it, and push into the processedEvents array
    for (const event of Object.values(events)) {
        // Typecast event into ParsedICSEvent type
        const icsEvent: ParsedICSEvent = <ParsedICSEvent> event;
        // Push the parsed event into processedEvents
        processedEvents.push({
            date: icsEvent.start.toString(),
            description: icsEvent.summary
        });
    }
    // Output to output_path as JSON
    const output_str = JSON.stringify(processedEvents);
    fs.writeFileSync(output_path, output_str);
}

/**
 * Resolve the path from user input into absolute path.
 * 
 * If the inputted path is already an absolute path, it would not be modified.
 * 
 * However, if the inputted path is a relative path, it would be resolved relative
 * to the file path of this current file.
 * 
 * @param {string} input_path Path from user input.
 * 
 * @return {string} Resolved absoulte path.
 */
function toAbsolutePath(input_path: string) {
    if (path.isAbsolute(input_path)) {
        // Simply return the input path if the path is already an absolute path
        return input_path;
    }
    else {
        // Resolve the relative path relative to the the path of this file
        // It is assumed that the ICS file would be put under the same directory as this file
        // so user can just input 'XXXX.ics' and use this ICSPreprocessor
        return path.resolve(__dirname, input_path);
    }
}

// Get user input on ICS and output file path
let icsPath = toAbsolutePath(readlineSync.question('Where is the ICS file located? (Base directory: ' + __dirname +  ') '));
let outputPath = toAbsolutePath(readlineSync.question('Where should the output JSON file be located? (Base directory: ' + __dirname +  ') '));
// Run preprocessor
ICSPreprocessor(icsPath, outputPath);
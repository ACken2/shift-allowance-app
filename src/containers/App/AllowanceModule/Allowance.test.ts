// Import module to be tested
import { Allowance } from './Allowance';

// Import CalendarEvent typing
import CalendarEvent from '../CalendarEvent';

it('Calculate total irregular hours with a N-shift that spans across 2 different months', () => {
    // Example from Nathan, known to have 44.55 total irregular hours on 2020 June, and 8.75 total irregular hours on 2020 May
    const duties: Array<{ id: number, title: string, start: string, end: string, duty: { id: number }}> = JSON.parse("[{\"id\":1,\"title\":\"N Shift\",\"start\":\"2020-05-31T14:15:00.000Z\",\"end\":\"2020-06-01T00:30:00.000Z\",\"duty\":{\"id\":3}},{\"id\":2,\"title\":\"P Shift\",\"start\":\"2020-06-02T08:07:00.000Z\",\"end\":\"2020-06-02T14:45:00.000Z\",\"duty\":{\"id\":1}},{\"id\":3,\"title\":\"N Shift\",\"start\":\"2020-06-04T14:15:00.000Z\",\"end\":\"2020-06-05T00:30:00.000Z\",\"duty\":{\"id\":3}},{\"id\":4,\"title\":\"P Shift\",\"start\":\"2020-06-06T08:03:00.000Z\",\"end\":\"2020-06-06T14:45:00.000Z\",\"duty\":{\"id\":1}},{\"id\":5,\"title\":\"A Shift\",\"start\":\"2020-06-07T00:15:00.000Z\",\"end\":\"2020-06-07T08:30:00.000Z\",\"duty\":{\"id\":2}},{\"id\":6,\"title\":\"N Shift\",\"start\":\"2020-06-08T14:15:00.000Z\",\"end\":\"2020-06-09T00:30:00.000Z\",\"duty\":{\"id\":3}},{\"id\":7,\"title\":\"P Shift\",\"start\":\"2020-06-10T08:07:00.000Z\",\"end\":\"2020-06-10T14:45:00.000Z\",\"duty\":{\"id\":1}},{\"id\":8,\"title\":\"N Shift\",\"start\":\"2020-06-12T14:15:00.000Z\",\"end\":\"2020-06-13T00:30:00.000Z\",\"duty\":{\"id\":3}},{\"id\":9,\"title\":\"Stagger P*\",\"start\":\"2020-06-23T05:00:00.000Z\",\"end\":\"2020-06-23T13:48:00.000Z\",\"duty\":{\"id\":5}},{\"id\":10,\"title\":\"A Shift\",\"start\":\"2020-06-24T00:15:00.000Z\",\"end\":\"2020-06-24T08:30:00.000Z\",\"duty\":{\"id\":2}}]");
    // Duties parsed from JSON.parse will have the start and end properties as string,
    // so we have to convert those properties one-by-one to the Date object expected for the CalendarEvent typings
    const parsedEvents: Array<CalendarEvent> = duties.map((duty) => {
        return {
            id: duty.id,
            title: duty.title,
            start: new Date(duty.start),
            end: new Date(duty.end),
            duty: {
                id: duty.duty.id
            }
        }
    });
    // Compute Allowance obtained
    let allowanceObtained = new Allowance().compute(parsedEvents);
    // Check if 2020 May has 8.75 total irregular hours
    expect(allowanceObtained.month[0].start.getMonth()).toEqual(4); // May
    expect(allowanceObtained.month[0].hours).toEqual(8.75);
    // Check if 2020 June has 44.75 total irregular hours
    expect(allowanceObtained.month[1].start.getMonth()).toEqual(5); // June
    expect(allowanceObtained.month[1].hours).toEqual(44.55);
});
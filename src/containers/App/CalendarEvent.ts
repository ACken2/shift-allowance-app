// Typing for event used by react-big-calendar
type CalendarEvent = {
    id: number;
    title: string;
    start: Date;
    end: Date;
    duty: {
        id: number;
    }
}

export default CalendarEvent;
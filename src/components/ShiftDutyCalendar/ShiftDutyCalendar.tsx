// Import library
import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

// Import custom typings for libraries
import CalendarEvent from 'containers/App/CalendarEvent';

// Import CSS stylesheet from react-big-calendar
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Import CSS stylesheet
import './ShiftDutyCalendar.toolbar.css';
import './ShiftDutyCalendar.month-view.css';

// Setup typings for props for this component
type ShiftDutyCalendarProps = {
    style: string;
    events: Array<CalendarEvent>;
    onSelectSlot: Function;
    onSelectEvent: Function;
}

// Redner our shift duty calendar
const ShiftDutyCalendar: React.FC<ShiftDutyCalendarProps> = ({ style, events, onSelectSlot, onSelectEvent }: ShiftDutyCalendarProps) => {
    // Set up localizer for react-big-calendar
    const localizer = momentLocalizer(moment);
    // Set default date (date to display by default) as the first event in events array or current date if there is no event
    const defaultDate = events.length > 0 ? events[0].start : new Date();
    // Render a react-big-calendar
    return (
        <div className={style}>
            <Calendar
                selectable
                localizer={localizer}
                events={events}
                defaultDate={defaultDate}
                longPressThreshold={100}
                onSelectSlot={(selectedSlot: any) => onSelectSlot(selectedSlot)}
                onSelectEvent={(selectedEvent: any) => onSelectEvent(selectedEvent)}
                views={['month']}
            />
        </div>
    )
}

export default ShiftDutyCalendar;
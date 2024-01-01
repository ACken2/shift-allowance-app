// Typing for object returned by react-big-calendar onSelectSlot callback

type SelectedSlotInfoBounds = {
    bottom: number;
    left: number;
    right: number;
    top: number;
    x: number;
    y: number;
}

type SelectedSlotInfoBox = {
    clientX: number;
    clientY: number;
    x: number;
    y: number;
}

type SelectedSlotInfo = {
    // Either "select" (with drag) | "click" | "doubleClick"
    action: string;
    // Describe the click box for "select" action
    bounds: SelectedSlotInfoBounds;
    // Describe the click box for "click" | "doubleClick" action
    box: SelectedSlotInfoBox;
    // Describe the starting date for the selection
    start: Date;
    // Describe the ending date for the selection
    end: Date;
    // Array of each selected date between starting and ending date
    slots: Array<Date>;
}

export default SelectedSlotInfo;
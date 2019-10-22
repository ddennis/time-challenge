import {MINUTES_TO_PIXELS} from "./CONSTANTS";

export const calculateStartPosition = (startTime:Date , minMinutes:number):number => {
	const startHours = Math.round( ((startTime.getHours() * 60) - minMinutes) * MINUTES_TO_PIXELS);
	const startMinutes = startTime.getMinutes() * MINUTES_TO_PIXELS;
	return startHours + startMinutes
};

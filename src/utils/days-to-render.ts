
import {IBookings} from "../types/Bookings";
import {ONE_DAY_IN_MILISECONDS} from "./CONSTANTS";
import {IAvailability} from "../types/Availability";


export interface DaysToRender {
	dayName:string;
	date:number; // the date as an int
	bookings:IBookings[];
	//preferences:IPreferences;
	dayIndex:number;

}




export function findDaysToRender(currentDate:Date, dayNames:Array<string> , bookings:IBookings[], daysBoundaryMax:number , availability:IAvailability[] ):DaysToRender[] {


	const tempDaysArr:Array<Number> = Array(daysBoundaryMax ).fill(0);


	//
	// reset current date, so we can use it to calculate the next coming days
	//
	currentDate.setHours(0);
	currentDate.setMinutes(0);
	currentDate.setSeconds(1);

	const daysToRender:DaysToRender[] = tempDaysArr.map( (item, index) => {


		currentDate.setDate(currentDate.getDate() + (index ? 1 : 0) );
		const day = currentDate.getTime();

		const dayIndex = currentDate.getDay();
		const dayStartTime = availability[dayIndex].startTimeInMinutes;
		const dayEndTime = availability[dayIndex].endTimeInMinutes;

		const endDay = (day + ONE_DAY_IN_MILISECONDS);

		// TODO -  We should handle overlapping booking times - and render them as one

		const bookingsInDay = bookings.filter((book) => {
			return book.startTime.getTime() > day && book.endTime.getTime() < endDay;
		});

		// TODO -  handle end and start time for each day

		return {
			dayName: dayNames[currentDate.getDay()],
			dayIndex: index,
			dayStartTime: dayStartTime,
			dayEndTime: dayEndTime,
			date: currentDate.getDate(),
			bookings: bookingsInDay
		}
	});

	return daysToRender

}


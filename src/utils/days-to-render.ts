
import {IBookings} from "../types/Bookings";
import {ONE_DAY_IN_MILISECONDS} from "./CONSTANTS";
import {IPreferences} from "../model/preferences";


export interface DaysToRender {
	dayName:string;
	date:number; // the date as an int
	bookings:IBookings[];
	//preferences:IPreferences;
	dayIndex:number;

}



export function findDaysToRender(currentDate:Date, dayNames:Array<string> , bookings:IBookings[], preferences:IPreferences ):DaysToRender[] {

	const daysBoundaryMax:number = preferences.fromTodayBoundary;

	const tempDaysArr:Array<Number> = Array(daysBoundaryMax ).fill(0);

	//
	// reset current date, so we can use it to calculate the next coming days
	//
	const sd:number = currentDate.getDate();
	currentDate.setHours(0);
	currentDate.setMinutes(0);
	currentDate.setSeconds(1);

	const daysToRender:DaysToRender[] = tempDaysArr.map( (item, index) => {

		currentDate.setDate(sd +(index));
		const day = currentDate.getTime();
		const endDay = (day + ONE_DAY_IN_MILISECONDS);

		const bookingInDay = bookings.filter((book) => {
			const start = book.startTime.getTime() > day && book.endTime.getTime() < endDay;
			return start
		});

		return {dayName:dayNames[currentDate.getDay()], dayIndex:index,  date:currentDate.getDate() , bookings:bookingInDay }
	});


	return daysToRender


}


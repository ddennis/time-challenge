import React from "react";
import Calendar from "./components/calendar/Calendar";
import {IBookings} from "./types/Bookings";
import {IAvailability} from "./types/Availability";


function generateBookingDateTime({ daysFromNow, hours }: {daysFromNow:number, hours:number}): Date {
	const today = new Date();
	const notToday = new Date().setDate(today.getDate() + daysFromNow); // lol
	return new Date(new Date(notToday).setHours(hours, 0, 0, 0));
}

const App: React.FC = () => {


	// order does not matter
	const bookings:IBookings[] = [
		{
			startTime: generateBookingDateTime({ daysFromNow: 1, hours: 10 }),
			endTime: generateBookingDateTime({ daysFromNow: 1, hours: 12 })
		},
		{
			startTime: generateBookingDateTime({ daysFromNow: 2, hours: 13 }),
			endTime: generateBookingDateTime({ daysFromNow: 2, hours: 15 })
		},
		{
			startTime: generateBookingDateTime({ daysFromNow: 1, hours: 15 }),
			endTime: generateBookingDateTime({ daysFromNow: 1, hours: 17 })
		},
	];


	// We assume this is your avalibility for mon, tue, wen ...
	const availability:IAvailability[] = [
		{
			startTimeInMinutes: 1000,
			endTimeInMinutes: 1200
		},
		{
			startTimeInMinutes: 600,
			endTimeInMinutes: 1200
		},
		{
			startTimeInMinutes: 600,
			endTimeInMinutes: 1200
		},
		{
			startTimeInMinutes: 600,
			endTimeInMinutes: 1200
		},
		{
			startTimeInMinutes: 600,
			endTimeInMinutes: 1200
		},
		{
			startTimeInMinutes: 600,
			endTimeInMinutes: 1200
		},
		{
			startTimeInMinutes: 600,
			endTimeInMinutes: 1200
		}
	];



	return (

			<Calendar
				bookings={bookings}
				availability={availability}
				totalDaysToRender={10}

				// set the width of each day based of either the window width or the amount of days to render
				setDayWidth={(calendarWidth:number, daysToRender:number ):number => {
					if(calendarWidth <= 768  ){
						return Math.round(calendarWidth / 3) // show three days
					}
					return Math.round(calendarWidth / 5) // show five days
				}}



			/>


	);
};

export default App;

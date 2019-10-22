import React from "react";
import Calendar from "./components/Calendar";

import bookings from "./model/bookings";
import preferences from "./model/preferences";


const breakpoints = {
	xs: 0,
	sm: 576,
	md: 768,
	lg: 992,
	xl: 1200
};


const App: React.FC = () => {

	return (

			<Calendar
				bookings={bookings}
				preferences={preferences}

				// set the width of each day based of either the window width or the amount of days to render
				setDayWidth={(calendarWidth:number, daysToRender:number ):number => {
					if(calendarWidth <= breakpoints.md  ){
						return Math.round(calendarWidth / 3) // show three days
					}
					return Math.round(calendarWidth / 5) // show five days
				}}
			/>


	);
};

export default App;

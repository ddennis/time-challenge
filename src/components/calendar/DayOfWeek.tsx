import React from "react";
import {DaysToRender} from "../../utils/days-to-render";
import {useDrag} from "react-use-gesture";
import {HOUR_HEIGHT, MINUTES_TO_PIXELS, styles} from "../../utils/CONSTANTS";
import {IRenderedMinMaxMinutes} from "../../types/IRenderedMinMaxMinutes";
import BookingItem from "./BookingItem";
import {IStore} from "./Store";


interface IDayOfWeek {
	day:DaysToRender;
	dayWidth: number;
	slotsPerHour:Array<any> ;
	minMaxMinutes:IRenderedMinMaxMinutes;
	useStore:Function;
}


interface ISelection {
	id:number;
	startTime:Date;
	endTime:Date;
}



const DayOfWeek: React.FC<IDayOfWeek> = ({dayWidth, slotsPerHour, day, minMaxMinutes, useStore}) => {

	const {addSelection} = useStore((state:IStore ) => {
		return { addSelection:state.addSelection }
	});

	const {bookings}= day;


	// when a use tries to add a selection
	const markBind = useDrag(({last,movement, args}) => {


		if(last ){

			console.log (" DayOfWeek > add = " );
			const wasClick = Math.abs( movement[0] ) + Math.abs( movement[1] ) < 6;
			if(wasClick ){
				const slotIndex:number = args[0];
				const slotItem:number = args[1];
				const minutes = (slotIndex / slotItem * 60) + minMaxMinutes.min;
				const startTime:Date = new Date();

				startTime.setSeconds( 0 );
				startTime.setHours( 0 );
				startTime.setMinutes( minutes );

				const endTime = new Date();
				endTime.setHours( ((slotIndex / 4) * 60) + minMaxMinutes.min );

				// selection active is deactivated set in the store
				addSelection({startTime: startTime, endTime: endTime, day:day , id: "current-selection" })

			}
		}
	});




	return (

		<div className="m-0 position-relative  " style={{width: dayWidth }}>

				{/*We are rendering the hour before avallibility starts - */}
				<BookingItem dayWidth={dayWidth} bookingHeight={HOUR_HEIGHT}></BookingItem>

				{bookings.map((item, index) => {

					const {startTime, endTime , id } = item;

					const startHours = Math.round( ((startTime.getHours() * 60) - minMaxMinutes.min) * MINUTES_TO_PIXELS)
					const startMinutes = startTime.getMinutes() *MINUTES_TO_PIXELS;
					const startPos = startHours + startMinutes;

					const bookingHeight = Math.round(((endTime.getHours()  - startTime.getHours()) * 60) * MINUTES_TO_PIXELS)


					return (
						<BookingItem key={id} dayWidth={dayWidth} startPos={startPos} bookingHeight={bookingHeight}></BookingItem>
					)

				})}

				{
					slotsPerHour.map( (slotItem, slotIndex) => {

						const fullHour:number = slotIndex % 2;

						return (
							<div {...markBind(slotIndex, slotItem)} key={slotIndex} style={{height: HOUR_HEIGHT/slotItem, borderRight:`1px solid ${styles.borderColor}`,   borderBottom: slotIndex === slotsPerHour.length-1 ? `1px solid ${styles.borderColor}` :`0px solid ${styles.borderColor}` , borderTop: `1px solid rgba(217,219,222, ${!fullHour ? 1 :.5})`  }}>

								{/*<div  className="w-100" style={{height:100  }} >

								</div>*/}

							</div>
						)
					} )
				}




		</div>

	);
};

//{/* {...markBind( slotIndex, index )}*/}

export default DayOfWeek;

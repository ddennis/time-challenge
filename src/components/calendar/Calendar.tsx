/**
 * Created by @author @ddennis - ddennis.dk aka fantastisk.dk/works aka meresukker.dk on 16-10-2019.
 */

// libs
import React, {useCallback, useEffect, useRef, useState} from "react";
import { useGesture } from 'react-use-gesture'
import {useSpring, animated} from "react-spring";
import Measure from "react-measure";
import clamp from 'lodash.clamp'

//calendar components
import DayOfWeek from "./DayOfWeek";
import SelectedTimeSlot from "./SelectedTimeSlot";
import TimeIntervals from "./TimeIntervals";
import CalendarView from "./CalendarView";


// utils
import {findAvailbleInterval} from "../../utils/preferences-parser";
import {IBookings} from "../../types/Bookings";
import {IAvailability } from "../../types/Availability";

// types
import {IRenderedMinMaxMinutes} from "../../types/IRenderedMinMaxMinutes";
import {DaysToRender, findDaysToRender} from "../../utils/days-to-render";

// const
import {DAY_NAMES, HOUR_HEIGHT, MINUTES_INTERVAL, styles} from "../../utils/CONSTANTS";

// Store
import useStore, {ISelection, IStore} from './Store'
import Header from "./Header";




interface ICalendar {
	bookings:Array<IBookings>;
	availability:Array<IAvailability>;
	totalDaysToRender:number;

	setDayWidth?:Function;
}


const Calendar: React.FC<ICalendar> = ({bookings, setDayWidth, totalDaysToRender, availability}) => {

	const getDayWidth = setDayWidth ? setDayWidth : () => { return 100};

	console.log (" Calendar > render = " );

	//
	// The width of left side with hourly timestamps
	//
	const intervalContainerWidth  = 50;

	//
	// Header height which contains date and day names
	//
	const dateHeaderHeight = 76;

	//
	// based on availability, get the earlist and latest time which need to be shown
	// For a better overview we show an hour before and after the defined interval
	//
	const minMaxTime = findAvailbleInterval( availability );

	const renderedMinMaxMinutes:IRenderedMinMaxMinutes = {min: minMaxTime.min - 60, max: minMaxTime.max + 60};
	const slotsPerHour = Array((renderedMinMaxMinutes.max - renderedMinMaxMinutes.min )/MINUTES_INTERVAL ).fill(Math.round(60/MINUTES_INTERVAL ));

	// The meat of the scheduling
	const daysToRender:DaysToRender[] =findDaysToRender( new Date(), DAY_NAMES, bookings, totalDaysToRender, availability )

	//
	// Hooks
	const [dayWidth, setInternalDayWidth] = useState( 0 );
	const [boundaries, setBoundaries] = useState([0, 0, 0, 0])
	const [{x, y}, setAni] = useSpring( () => ({x: 0, y: 0, config: {friction: 40, tension: 1200}}) );
	const calendarViewRef = useRef<HTMLInputElement>(null);

	// show some initial animation
	useEffect( () => {
		//setAni( { x: Math.round( 0 ),	y: Math.round( -75 ), config: {friction: 80, tension: 1000}})
	} , []);


	//
	// handle dragging the calenderview
	//
	const bind = useGesture( {

		onDrag: ({args, active, cancel, movement, memo = [x.getValue(), y.getValue()]},  ) => {

			//
			// disable animation if selection is being edited
			//
			if(args[0] && cancel ){
				cancel();
				return memo
			}

			const [top, right, bottom, left] = boundaries;
			const xx = Math.round( clamp( memo[0] + movement[0], -(left), right ) );
			const yy = Math.round( clamp( memo[1] + movement[1], -(top), bottom ) );

			//
			// on Release handle snapping to each day
			//
			if (!active) {
				const snapXpos: number = Math.round( Math.abs( xx ) / dayWidth );
				setAni( {x: -(snapXpos * dayWidth), y: yy, config: {friction: 40, tension: 1000}} )
				return [0, yy]
			}


			// move calendar
			setAni( {x: xx, y: yy} )
			return memo
		},

		// handling vertical scrolling with the mouse on desktop
		onWheel: ({movement, memo = [x.getValue(), y.getValue()]}) => {

			const top:number = boundaries[0];
			const bottom:number = boundaries[2];

			const yy:number = clamp( memo[1] + -(movement[1]), -top, bottom );
			setAni( {x: memo[0], y: Math.round( yy ), config: {friction: 80, tension: 1000}} )
			return memo
		}
	});


	return (

		<Measure
			client
			onResize={contentRect => {
				if (contentRect.client && calendarViewRef.current) {

					//
					// when resize ask for new dayWidth
					//
					const dw = getDayWidth( contentRect.client.width - intervalContainerWidth , daysToRender.length );
					setInternalDayWidth( dw )


					//
					// update drag boundaries
					//
					const top = calendarViewRef.current.clientHeight - (contentRect.client.height - dateHeaderHeight ) + HOUR_HEIGHT;
					const left = (daysToRender.length * dw) - (contentRect.client.width - intervalContainerWidth );
					setBoundaries( [top, 0, 0, left] );
				}
		}}	>



			{({ measureRef }) => (


				<div ref={measureRef}  className="container-fluid h-100 w-100 pl-0 pr-0" >
					<Header dayWidth={dayWidth} daysToRender={daysToRender} x={x} intervalContainerWidth={intervalContainerWidth}></Header>
					<CalendarView bind={bind}
								  calendarViewRef={calendarViewRef}
								  x={x}
								  y={y}
								  dayWidth={dayWidth}
								  daysToRender={daysToRender}
								  intervalContainerWidth={intervalContainerWidth}
								  boundaries={boundaries}
								  slotsPerHour={slotsPerHour}
								  renderedMinMaxMinutes={renderedMinMaxMinutes}
					/>
				</div>


			)}


		</Measure>
	);
};



export default Calendar;

/**
 * Created by @author @ddennis - ddennis.dk aka fantastisk.dk/works aka meresukker.dk on 16-10-2019.
 */

// libs
import React, {useEffect, useRef, useState} from "react";
import { useGesture } from 'react-use-gesture'
import {useSpring, animated} from "react-spring";
import Measure from "react-measure";
import clamp from 'lodash.clamp'


//calendar components
import DayOfWeek from "./calendar/DayOfWeek";
import SelectedTimeSlot from "./calendar/SelectedTimeSlot";
import TimeIntervals from "./calendar/TimeIntervals";
import HeaderDays from "./calendar/HeaderDays";


// utils
import {findAvailbleInterval} from "../utils/preferences-parser";
import {IPreferences} from "../model/preferences";
import {IBookings} from "../model/bookings";

// types
import {IRenderedMinMaxMinutes} from "../types/IRenderedMinMaxMinutes";
import {DaysToRender, findDaysToRender} from "../utils/days-to-render";

// const
import {DAY_NAMES, HOUR_HEIGHT, styles} from "../utils/CONSTANTS";

// Store
import useStore, {ISelection, IStore} from './calendar/Store'


interface ICalendar {
	bookings:Array<IBookings>;
	preferences:IPreferences;
	setDayWidth?:Function;
}


const Calendar: React.FC<ICalendar> = ({bookings, preferences, setDayWidth}) => {

	const getDayWidth = setDayWidth ? setDayWidth : () => { return 100};

	//
	// The width of left side with hourly timestamps
	//
	const intervalContainerWidth  = 50;

	//
	// Header height which contains date and day names
	//
	const dateHeaderHeight = 76;

	//
	// based on preferences, get the earlist and latest time which need to be shown
	// For a better overview we show an hour before and after the defined interval
	//
	const minMaxTime = findAvailbleInterval( preferences );
	const renderedMinMaxMinutes:IRenderedMinMaxMinutes = {min: minMaxTime.min - 60, max: minMaxTime.max + 60};
	const slotsPerHour = Array((renderedMinMaxMinutes.max - renderedMinMaxMinutes.min )/preferences.interval ).fill(Math.round(60/preferences.interval));

	// The meat of the scheduling
	const daysToRender:DaysToRender[] = findDaysToRender(new Date(), DAY_NAMES , bookings, preferences.fromTodayBoundary )

	//
	// Hooks
	const [dayWidth, setInternalDayWidth] = useState( 0 );
	const [boundaries, setBoundaries] = useState([0, 0, 0, 0])
	const [{x, y}, setAni] = useSpring( () => ({x: 0, y: 0, config: {friction: 40, tension: 1200}}) );
	const selection:ISelection[] = useStore(state => state.selection);
	const calendarViewRef = useRef<HTMLInputElement>(null);

	const {selectionActive, toggleSelection}:IStore = useStore<IStore>((state ) => {
		return {selectionActive:state.selectionActive, toggleSelection:state.toggleSelection }
	});


	// show some initial animation
	useEffect( () => {
		//setAni( { x: Math.round( 0 ),	y: Math.round( -75 ), config: {friction: 80, tension: 1000}})
	} , []);

	//
	// handle dragging the calenderview
	//
	const bind = useGesture( {

		onDrag: ({active, cancel, movement, memo = [x.getValue(), y.getValue()]}) => {

			//
			// disable animation if selection is being edited
			//
			if(selectionActive && cancel ){

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

				console.log (" Calendar > not active = " , xx);
				const snapXpos: number = Math.round( Math.abs( xx ) / dayWidth );
				setAni( {x: -(snapXpos * dayWidth), y: yy, config: {friction: 40, tension: 1200}} )
				return [0, yy]
			}

			console.log (" Calendar > move = " );


			// move calendar
			setAni( {x: xx, y: yy} )
			return memo
		},

		// handling vertical scrolling with the mouse on desktop
		onWheel: ({movement, memo = [x.getValue(), y.getValue()]}) => {

			const top:number = boundaries[0];
			const bottom:number = boundaries[2];

			console.log (" Calendar > wheel = " );

			const yy:number = clamp( memo[1] + -(movement[1]), -top, bottom );
			setAni( {x: memo[0], y: Math.round( yy ), config: {friction: 80, tension: 1000}} )
			return memo
		}
	} );


	const deactiveSelection = () => {
		if( toggleSelection && selectionActive){
			toggleSelection(false)
		}
	};


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


				   <div className="row w-100 pl-0 pr-0 mr-0 ml-0 overflow-hidden" style={{}}>


					   {/*-------- The header with dates and day names  ------*/}
					   <div className="col-12 pl-0 pr-0 position-relative simple-shadow" style={{height: dateHeaderHeight, zIndex:200, background:"white"}}>

						   <div className="position-absolute" style={{zIndex: 210, top: 0, left: 0,  width: intervalContainerWidth - 1,  height: dateHeaderHeight, background: "white" }}></div>

						   <animated.div className="d-flex justify-content-between position-relative " style={{zIndex: 200, height: dateHeaderHeight, x}}>
							   <HeaderDays dayWidth={dayWidth} daysToRender={daysToRender} intervalContainerWidth={intervalContainerWidth}></HeaderDays>
						   </animated.div>

					   </div>


					   <div className="col-12  pl-0 pr-0 ">

						   {/* The time slots in the left side*/}
						   <div className="position-relative " style={{zIndex: 100, top: 0, left: 0, width: intervalContainerWidth}}>
							   <animated.div className="d-flex flex-column position-absolute  " style={{ borderRight: `1px solid ${styles.borderColor}`, width: intervalContainerWidth, background: "#f8f9fa", y }}>
								   <TimeIntervals renderedMinMaxMinutes={renderedMinMaxMinutes} intervalContainerWidth={intervalContainerWidth}></TimeIntervals>
							   </animated.div>
						   </div>


						   <animated.div {...bind()} ref={calendarViewRef} className="d-flex noselect " style={{  width: daysToRender.length * dayWidth,zIndex: 1, overscrollBehavior: "none", marginLeft: intervalContainerWidth, x, y }}>

							   {/* Days - in the full height */}
							   {
								   daysToRender.map( (day, index) => {
										   return (
											   <DayOfWeek key={index} day={day} useStore={useStore} minMaxMinutes={renderedMinMaxMinutes}  dayWidth={dayWidth} slotsPerHour={slotsPerHour}></DayOfWeek>
										   )
									   }
								   )
							   }


							   {/*The users selection*/}
							   <div className="position-absolute h-100 w-100 " style={{pointerEvents:selectionActive && selection.length > 0 ? "auto": "none"}} >

								   {selection.map( (item, index) => {
									   const {startTime } = item;

									   return (
										   <SelectedTimeSlot key={index} useStore={useStore} daysToRender={daysToRender} day={item.day} dayWidth={dayWidth} minMaxMinutes={renderedMinMaxMinutes} startTime={startTime} />
									   )
								   })}

								   {/* Background while editing */}
								   <div onClick={deactiveSelection} className="position-absolute h-100 w-100 " style={{zIndex:0, display: selectionActive && selection.length > 0 ? "block" : "none",  opacity:.5, background:"rgba(0,0,0,.1)"}} >

								   </div>

							   </div>
						   </animated.div>

					   </div>
				   </div>
			   </div>
			)}


		</Measure>
	);
};



export default Calendar;

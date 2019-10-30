/**
 * Created by @author @ddennis - ddennis.dk aka fantastisk.dk/works aka meresukker.dk on 30-10-2019.
 */

import React, {useState} from "react";
import Header from "./Header";
import TimeIntervals from "./TimeIntervals";
import {animated, useSpring, useTransition} from "@react-spring/web";
import DayOfWeek from "./DayOfWeek";
import useStore, {ISelection, IStore} from "./Store";
import SelectedTimeSlot from "./SelectedTimeSlot";
import {DaysToRender} from "../../utils/days-to-render";
import {useGesture} from "react-use-gesture";
import {IRenderedMinMaxMinutes} from "../../types/IRenderedMinMaxMinutes";


interface ICalendarView {
	dayWidth:number;
	daysToRender:DaysToRender[];
	intervalContainerWidth:number;
	boundaries:Array<number>;
	x:any;
	y:any;
	calendarViewRef:any;
	renderedMinMaxMinutes:IRenderedMinMaxMinutes;
	bind:any;
	slotsPerHour:any;
}

const CalendarView: React.FC<ICalendarView> = ({ dayWidth , daysToRender, intervalContainerWidth, boundaries, x, y, calendarViewRef, renderedMinMaxMinutes, bind, slotsPerHour}) => {

	const selection:ISelection[] = useStore(state => state.selection);
	const {selectionActive, toggleSelection}:IStore = useStore<IStore>((state ) => {
			return {selectionActive:state.selectionActive, toggleSelection:state.toggleSelection }
		});


	const transitions = useTransition(selectionActive, null, {
		from: {opacity: 0},
		enter: { opacity: .1 },
		leave: [{ opacity: 0 }],
		config: {friction: 40, tension: 800}
	})


	const deactiveSelection = () => {
		if( toggleSelection && selectionActive){
			toggleSelection(false)
		}
	};




	return (

			<div className="row w-100 pl-0 pr-0 mr-0 ml-0 overflow-hidden" style={{}}>
				<div className="col-12 d-flex pl-0 pr-0 ">
					<div className="d-flex">


						<TimeIntervals intervalContainerWidth={intervalContainerWidth} y={y} renderedMinMaxMinutes={renderedMinMaxMinutes} ></TimeIntervals>


						<animated.div {...bind(selectionActive)} ref={calendarViewRef} className="d-flex noselect position-relative " style={{  zIndex: 1, overscrollBehavior: "none",  x, y }}>


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
							<div className="position-absolute h-100 w-100 " style={{zIndex:1, pointerEvents:selectionActive && selection.length > 0 ? "auto": "none"}} >

								{selection.map( (item, index) => {
									const {startTime } = item;

									return (
										<SelectedTimeSlot key={index} useStore={useStore} daysToRender={daysToRender} day={item.day} dayWidth={dayWidth} minMaxMinutes={renderedMinMaxMinutes} startTime={startTime} />
									)
								})}



								{/*Background while editing*/}

								{

									transitions.map(({ item, key, props }) => {


										return item && <animated.div key={key} onClick={deactiveSelection} className="position-absolute h-100 w-100 " style={{zIndex:0, background:"black" , ...props, visibility: props.opacity.interpolate(o => o === 0 ? 'hidden' : 'visible')}} >

													</animated.div>

									}
									)
								}



							</div>
						</animated.div>
					</div>
				</div>
			</div>



	);
};

export default CalendarView

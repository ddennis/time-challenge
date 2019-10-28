import React from "react";
import {HOUR_HEIGHT, styles} from "../../utils/CONSTANTS";
import {IRenderedMinMaxMinutes} from "../../types/IRenderedMinMaxMinutes";
import timeSlots from "time-slots-generator";
import {FullDayTimeSlots} from "../../types/FullDayTimeSlots";
import { animated} from "react-spring";



interface ITimeIntervals {
	renderedMinMaxMinutes:IRenderedMinMaxMinutes;
	intervalContainerWidth:number;
	y:any;
}

const TimeIntervals: React.FC<ITimeIntervals> = ({renderedMinMaxMinutes, intervalContainerWidth, y}) => {

	const blocked = [
		[0, renderedMinMaxMinutes.min - 60 ],
		[renderedMinMaxMinutes.max +60, 1440 ]
	];


	const fullDayTimeSlotsObj =  timeSlots.getTimeSlots(blocked, true);

	const fullDayTimeSlots:FullDayTimeSlots[] = Object.keys(fullDayTimeSlotsObj).map((key) => {
		return {min:Number(key), name:fullDayTimeSlotsObj[key]} ;
	});


	return (

		<animated.div style={{width:intervalContainerWidth, zIndex:100, borderRight: `1px solid ${styles.borderColor}`, background: "#f8f9fa", y }} >

			{
				fullDayTimeSlots.map( (item, index) => {
					return (
						<div key={index} className="d-flex" style={{height:HOUR_HEIGHT}} >
							<p className="pr-2 pl-2 mb-0" style={{marginTop:-8, opacity:index === 0 ? 0 :1 ,  fontSize:11, color:"#888f97", letterSpacing: -.4}}>{item.name}</p>

							{/*little line showing with each time stamp*/}
							<div className="w-100 clock-line" style={{height:HOUR_HEIGHT ,width:3, borderTop: `1px solid ${styles.borderColor}` }} ></div>

						</div>
					)
				})
			}
		</animated.div>
	)

};

export default TimeIntervals

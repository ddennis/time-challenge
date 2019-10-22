import React, {useState} from "react";
import {useDrag} from "react-use-gesture";
import {HOUR_HEIGHT, MINUTES_TO_PIXELS} from "../../utils/CONSTANTS";
import {IStore} from "./Store";
import {DaysToRender} from "../../utils/days-to-render";
import {IRenderedMinMaxMinutes} from "../../types/IRenderedMinMaxMinutes";
import {calculateStartPosition} from "../../utils/calculateStartPosition";


interface SelectedTimeSlot {
	daysToRender:DaysToRender[];
	startTime:Date;
	useStore:Function;
	dayWidth:number;
	day:DaysToRender;
	minMaxMinutes:IRenderedMinMaxMinutes;
}




const SelectedTimeSlot: React.FC<SelectedTimeSlot> = ({startTime, useStore, dayWidth, day, daysToRender, minMaxMinutes}) => {


	const startPos = calculateStartPosition( startTime, minMaxMinutes.min );

	const {selectionActive, toggleSelection} = useStore( (state: IStore) => {
		return {selectionActive: state.selectionActive, toggleSelection: state.toggleSelection}
	} );


	const [itemHeight, setItemHeight] = useState<number>( HOUR_HEIGHT*.5 );
	const [itemPos, setItemPos] = useState ( [day.dayIndex * dayWidth , startPos] );

	const deleteSelection = useStore( (state: IStore) => (state.deleteSelection) );
	const snapYfactor = HOUR_HEIGHT/4;
	const snapXfactor = dayWidth;


	const scaleBindDown = useDrag(({first, active ,movement,  memo = [itemPos[0], itemPos[1]]}) => {
		const yy = Math.round ( memo[1] + movement[1] );
		if(first ){
			setItemHeight(itemHeight)
			return [0, itemHeight]
		}

		if(!active ){
			const snapYpos = Math.round( yy / snapYfactor );
			const snapXpos = Math.round( itemPos[0] / snapXfactor );

			setItemHeight(snapYpos *snapYfactor);
			validateDropPosition(snapXpos, itemPos[1]);

			return memo
		}
		setItemHeight(Math.max(25, yy));
		return memo

	});



	const dragItem = useDrag(({first, active ,movement,cancel,   memo = [itemPos[0], itemPos[1]]}) => {
		const yy = Math.round ( memo[1] + movement[1] );
		const xx = Math.round ( memo[0] + movement[0] );

		if(!selectionActive && cancel ){
			cancel()
			return
		}

		if(first ){
			setItemPos([ itemPos[0], itemPos[1]] )
			return [itemPos[0], itemPos[1]]
		}

		if(!active ){
			const snapXpos = Math.round( xx / snapXfactor );
			const snapYpos = Math.round( yy / snapYfactor );

			setItemPos([snapXpos *snapXfactor, snapYpos *snapYfactor ]);
			validateDropPosition(snapXpos, snapYpos*snapYfactor);
			return memo
		}

		setItemPos([xx, yy]);

		return memo

	});


	const validateDropPosition = (dayIndex:number,snapYpos:number ) => {

		const bookings = daysToRender[dayIndex].bookings || [];

		console.log (" SelectedTimeSlot > snapYpos = " , snapYpos);
		if(snapYpos < 100 ){
			deleteSelection()
			return
		}

		const colision  = bookings.filter((item, index) => {

			const {startTime, endTime } = item;

			const startHours = Math.round( ((startTime.getHours() * 60) - minMaxMinutes.min) * MINUTES_TO_PIXELS)
			const startMinutes = startTime.getMinutes() *MINUTES_TO_PIXELS;
			const startPos = startHours + startMinutes;

			const bookingHeight = Math.round(((endTime.getHours()  - startTime.getHours()) * 60) * MINUTES_TO_PIXELS)

			const bottom = snapYpos + itemHeight;
			const middle = snapYpos + (itemHeight * .5);

			// basic hitdetection
			const topHitTest = (snapYpos + 10) >= startPos && (snapYpos+10) <= startPos + bookingHeight;
			const bottomHitTest = (bottom-10 ) >= startPos && (bottom ) <= startPos + bookingHeight;
			// would handle some case
			const coverHitTest = middle >= startPos && (middle ) <= startPos + bookingHeight;

			return topHitTest || bottomHitTest || coverHitTest;
		});

		if(colision.length !== 0 ){
			deleteSelection()
		}
	};


	const activateSelection = () => {
		if(!selectionActive ){
			toggleSelection(true)
		}
	};

	const deleteItem = () => {
		//selectionActive is updated in the Store on deletecSection
		deleteSelection()
	}


  return (
	  <div className="position-absolute selection-shadow " onClick={activateSelection} style={{zIndex:100, borderRadius:3, width:dayWidth, background:"#50db64",  top:0, left:0, height:itemHeight , transform:`translate3d( ${itemPos[0]}px ,${itemPos[1]}px ,0)`}}>

		  <div className="position-relative">

			  <div {...dragItem() } className="position-absolute w-100 grab" style={{background:"red", opacity:0, top:0, left:0, height:itemHeight-6}}></div>

			  {selectionActive &&
				  <div onClick={deleteItem} className="pointer position-absolute " style={{top:-2, right:5}}>x</div>
			  }

			  <p className="text-truncate d-inline-block" style={{fontSize:14, paddingLeft:6, paddingTop:10}}>Your booking</p>


		  </div>

		  {/* Show dragging handle */}
		  {selectionActive &&
			  <div {...scaleBindDown()} className="n-resize rounded-circle position-absolute " style={{background:"#50db64",bottom:-10, right:20, width:30, height:30}}>
				  <div className="" style={{width:20, height:20, paddingTop:13, paddingLeft:7}}>
						  <div style={{width:15,marginBottom:2, height:1, background:"black"}}></div>
						  <div style={{width:15, height:1, background:"black"}}></div>
				  </div>
			  </div>
		  }


	  </div>
  );
};

export default SelectedTimeSlot

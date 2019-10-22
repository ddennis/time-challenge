import React from "react";
import stripes from "../../assets/svg/stripes.svg";

interface BookingItem {
	dayWidth:number;
	startPos?:number;
	bookingHeight:number;
}


const BookingItem: React.FC<BookingItem> = ({dayWidth , startPos = 0, bookingHeight} ) => {

  return (
	  <div className="position-absolute " style={{top:5, left:5, width:dayWidth-10 ,height:bookingHeight -10, borderRadius:5,   transform:`translate3d(0px,${startPos}px ,0)`}}>
		  <div className="w-100 h-100 rounded" style={{background:"rgba(248,249,250, .6)", backgroundImage:`url(${stripes})   ` }}>
			  {startPos !== 0 && <p className="p-2 " style={{fontSize:12, color:"rgba(0,0,255,0.8)"}}>BLOCKED</p>}
		  </div>
	  </div>
  );
};

export default BookingItem

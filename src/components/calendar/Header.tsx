import React from "react";
import HeaderDays from "./HeaderDays";
import {animated} from "react-spring";
import {DaysToRender} from "../../utils/days-to-render";

interface IHeader {
	x:any;
	dayWidth:number;
	daysToRender:DaysToRender[];
	intervalContainerWidth:number;
}

const Header: React.FC<IHeader> = ({dayWidth, daysToRender, x, intervalContainerWidth}) => {
  return (

	  <div className="row w-100 pl-0 pr-0 mr-0 ml-0 " style={{}}>
		  <div className="simple-shadow d-flex position-relative" style={{zIndex: 10, background: "white"}}>
			  <animated.div className="col-12 pl-0 pr-0 d-flex " style={{x, marginLeft: intervalContainerWidth}}>
				  <HeaderDays dayWidth={dayWidth} daysToRender={daysToRender}></HeaderDays>
			  </animated.div>
		  </div>
	  </div>

  );
};

export default Header

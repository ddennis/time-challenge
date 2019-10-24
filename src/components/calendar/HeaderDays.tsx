import React from "react";
import {styles} from "../../utils/CONSTANTS";
import {DaysToRender} from "../../utils/days-to-render";

interface HeaderDays {
	daysToRender:DaysToRender[];
	intervalContainerWidth:number;
	dayWidth:number;
}


const HeaderDays: React.FC<HeaderDays> = ({daysToRender, intervalContainerWidth, dayWidth}) => {
  return (

	  <div className="d-flex pl-0 pr-0 " >
		  {
			  daysToRender.map( (item, index) => {
					  return (
						  <div key={index} className="m-0 h-100 " style={{ width: dayWidth }}>
							  <div className="d-flex flex-column text-center h-100 w-100 justify-content-between"  >

								  {/*the date*/}
								  <div className="w-100 pt-2 d-flex flex-row justify-content-center" style={{ }}>
									  <div className="rounded-circle " style={{width:40, height:40, background:index === 0 ? styles.blue : "white"  }}>
										  <p className="mb-0 " style={{paddingTop:index === 0 ? 6 : 8 , fontSize:20 ,color:index === 0 ? "white": styles.blue}}>{item.date}</p>
									  </div>
								  </div>

								  {/*day name*/}
								  <div className="w-100" style={{ borderRight: `1px solid ${styles.borderColor}` }}>
									  <p className="" style={{marginBottom:10, color:"#90969c", fontSize:10}}>{item.dayName.toUpperCase()}</p>
								  </div>

							  </div>
						  </div>
					  )
				  }
			  )
		  }
	  </div>
  );
};

export default HeaderDays

import {IAvailability} from "../types/Availability";

export function findAvailbleInterval( availability:IAvailability[] ):{min:number, max:number} {

	return availability.reduce( (a, value) => {
			const min = Math.min(a.min, value.startTimeInMinutes )
			const max = Math.max(a.max, value.endTimeInMinutes )
			return {min: min, max:max }

	},{min:1500, max:-1});

}




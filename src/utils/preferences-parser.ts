import {IPreferences} from "../model/preferences";

export function findAvailbleInterval( preferences:IPreferences ):{min:number, max:number} {

	const daysMap = ["monday", "tuesday", "wednesday", "thursday", "friday"];

	const availableInterval = daysMap.map( (day, index) => {
		//@ts-ignore
		return preferences[day]
	})
		.reduce( (a, value) => {
			const min = Math.min(a.min, value.startTimeInMinutes )
			const max = Math.max(a.max, value.endTimeInMinutes )
			return {min: min, max:max }

	},{min:1500, max:-1});

	return availableInterval;


}




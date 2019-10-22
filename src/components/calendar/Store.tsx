//import React from "react";
import create from "zustand";
import {DaysToRender} from "../../utils/days-to-render";

export interface ISelection {
	id:number;
	startTime:Date;
	endTime:Date;
	day:DaysToRender;
}


export interface IStore {
	selection?:Array<ISelection>;
	addSelection?:Function;
	toggleSelection?:Function;
	selectionActive?:Boolean;
	deleteSelection?:Function;
}


const [useStore] = create( set => ({
	selection: [],
	selectionActive: false,
	toggleSelection: (value: boolean) => {
		return set( state => ({selectionActive: value}) )
	},

	deleteSelection: () => {
		return set( state => ({selection: [], selectionActive:false }) )
	},

	addSelection: (item: ISelection) => {

		return set( state => ({selection: [item], selectionActive:true }) )
	},
}) );

export default useStore

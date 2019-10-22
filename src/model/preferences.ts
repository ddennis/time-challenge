
export interface IPreferences {
  id:string;
  interval: number;
  createTime: Date;
  fromTodayBoundary:number; // you should not be able to pick a time futher a head than x days into the future
  monday: {
    startTimeInMinutes: number,
    endTimeInMinutes: number
  },
  tuesday: {
    startTimeInMinutes: number;
    endTimeInMinutes: number;
  },
  wednesday: {
    startTimeInMinutes:  number;
    endTimeInMinutes:  number;
  },
  thursday: {
    startTimeInMinutes:  number;
    endTimeInMinutes:  number;
  },
  friday: {
    startTimeInMinutes:  number;
    endTimeInMinutes:  number;
  }


}

export default {
  id: "oebjergkjbergkjjb",
  interval: 15,
  createTime: new Date(),
  fromTodayBoundary: 10, // you should not be able to pick a time futher a head than x days into the future
  monday: {
    startTimeInMinutes: 600,
    endTimeInMinutes: 1200
  },
  tuesday: {
    startTimeInMinutes: 600,
    endTimeInMinutes: 960
  },
  wednesday: {
    startTimeInMinutes: 600,
    endTimeInMinutes: 1200
  },
  thursday: {
    startTimeInMinutes: 600,
    endTimeInMinutes: 960
  },
  friday: {
    startTimeInMinutes: 600,
    endTimeInMinutes: 1200
  }
};

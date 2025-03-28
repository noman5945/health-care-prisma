export type ISchedule = {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
};

export type IFilterRequest = {
  startDate?: string | undefined;
  endDate?: string | undefined;
};

export type IScheduleResponse = {
  id: string;
  startDateTime: string;
  endDateTime: string;
  createdAt: string;
  updatedAt: string;
};

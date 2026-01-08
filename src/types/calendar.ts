export const CalendarType = {
  PRESENTATION: 'presentation',
  PRESENTATION_DATE_RESERVATION: 'presentation-date-reservation',
  UNAVAILABILITY: 'unavailability',
} as const;

export type CalendarType = typeof CalendarType[keyof typeof CalendarType];

export type CalendarDate = {
  id: string;
  ownerId: string;
  title: string;
  startDate: string; // ISO
  endDate: string;   // ISO
  type: CalendarType;
};

import api from '../../services/api';
import { type CalendarDate } from '../../types/calendar';

export async function getCalendarByMonth(
  year: number,
  month: number,
): Promise<CalendarDate[]> {
  const { data } = await api.get<CalendarDate[]>(
    `/calendar/month/${year}/${month}`,
  );

  return data;
}

export async function getCalendarByPeriod(
  start: Date,
  end: Date,
): Promise<CalendarDate[]> {
  const { data } = await api.get<CalendarDate[]>(
    `/calendar/period/${start}/${end}`,
  );

  return data;
}

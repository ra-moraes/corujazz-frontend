export interface ReservationForPresentationDetails {
  id: string;
  startDate: string;
  endDate: string;

  showId?: string;
  showName?: string;

  establishmentId?: string;
  establishmentName?: string;

  value?: number;
  observation?: string;
}

export interface CreateReservationForPresentation {
  startDate: string;
  endDate: string;
  showId?: string;
  establishmentId?: string;
  value?: number;
  observations?: string;
}

export interface CreatedReservationForPresentation {
  id: string;
}
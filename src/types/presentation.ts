export interface PresentationDetails {
  id: string;
  startDate: string;
  endDate: string;
  
  presentationStartDate: string;
  presentationEndDate: string;
  soundCheckStartDate: string;
  soundCheckEndDate: string;
  
  duration: number;

  showId: string;
  showName: string;

  establishmentId: string;
  establishmentName: string;
  establishmentContactName: string;
  establishmentContactPhone: string;
  establishmentStreet: string;
  establishmentCity: string;

  value?: number;
  observation?: string;
}

export interface PresentationPayloadDto {
  soundCheckStart: string;
  soundCheckEnd: string;
  presentationStart: string;
  presentationEnd: string;
  duration: number;
  showId: string;
  establishmentId: string;
  value: number;
  observations?: string;
  reservationForPresentationId?: string;
}

export interface CreatedPresentation {
  id: string;
}
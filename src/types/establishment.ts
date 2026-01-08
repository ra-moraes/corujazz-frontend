export interface CreateEstablishmentDto {
  name: string;
  street: string;
  city: string;
  distance: number;
  contactName: string;
  contactPhone: string;
}

export interface EstablishmentCreated {
  id: string;
}

export interface Establishment {
  id: string;
  name: string;
}


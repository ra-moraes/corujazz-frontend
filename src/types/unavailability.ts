export type UnavailabilityCreated = {
  id: string;
  startDate: string; // ISO
  endDate: string;   // ISO
  reason: string;
};

export type UnavailabilityDetails = {
  id: string;
  startDate: string; // ISO
  endDate: string;   // ISO
  reason: string;
  userName: string;
  canDelete: boolean;
};

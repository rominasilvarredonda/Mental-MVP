export type Seminar = {
  id: string;
  title: string;
  schedule: string;
  capacity: number;
};

export type SeminarReservation = {
  seminarId: string;
  reservedAt: string;
};

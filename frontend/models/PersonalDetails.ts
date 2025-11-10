export interface PersonalDetails {
    firstName?: string;
    lastName?: string;
    age: number;
    employmentStatus: 'employed' | 'self_employed' | 'retired' | 'unemployed';
    yearsInCurrentRole?: number;
  }
  
export interface BasicInfoData {
  fullName: string;
  email: string;
  countryCode: string;
  mobileNumber: string;
  dob: string;
  linkedin: string;
  age: string | number;
}

export interface ProfessionalInfoData {
 
  currentRole?: string;
  company?: string;
  experience?: number;
  noticePeriod?: string;
  currentCtc?: string;
  expectedCtc?: string;
  primarySkills?: string[];
  jobType?: string;
  interestedField: string;
  yearsOfExperience: string;
}

export interface CandidateFormData {
  fullName: string;
  email: string;
  mobileNumber: string;
  dob: string;
  linkedin: string;
  age: string | number;
  interestedField: string;
  yearsOfExperience: string;
  skills: string[];
  status?: string;
  availability?: string;
  willingToContact?: string;
  salaryRange?: string;
  cv?: File | null;
}

export interface FormComponentProps {
  formData: CandidateFormData;
  updateFormData: (data: Partial<CandidateFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  basicData?: BasicInfoData;
}
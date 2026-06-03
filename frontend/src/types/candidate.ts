

export interface CandidateFormData {
  skills: string[];
  status?: string;
  availability?: string;
  willingToContact?: string;
  salaryRange?: string;
  cv?: File | null;
}


export interface Candidate {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar_url: string;
    field: string; // This maps to interested_field in DB
    experience: string; // This maps to years_of_experience in DB
    status: 'Actively Looking' | 'Open to Opportunities';
    availability: string;
    salary_min: number;
    salary_max: number;
    salary_range: string;
    joined: string;
    created_at: string;
    updated_at: string;
    skills?: string[];
    willing_to_contact?: boolean;
    cv_url?: string;
}

export interface CreateCandidateDto {
    name: string;
    email: string;
    phone: string;
    field: string;
    experience: string;
    status: 'Actively Looking' | 'Open to Opportunities';
    availability: string;
    salary_min: number;
    salary_max: number;
    salary_range: string;
    skills?: string[];
    willing_to_contact?: boolean;
    cv_url?: string;
}

export interface UpdateCandidateDto extends Partial<CreateCandidateDto> {
    id?: string;
}


export interface FormComponentProps {
    formData: CandidateFormData;
    updateFormData: (data: Partial<CandidateFormData>) => void;
    onNext: () => void;
    onBack: () => void;
    basicData?: any;
}
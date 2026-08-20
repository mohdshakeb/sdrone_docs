export interface SOSFormData {
    description: string;
    photos: File[];
}

export const initialSOSData: SOSFormData = {
    description: '',
    photos: [],
};

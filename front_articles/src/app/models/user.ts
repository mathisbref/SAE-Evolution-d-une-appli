export interface User {
    id: string;
    email: string;
    prenom?: string;
    nom?: string;
    token: string;
    role: string;
}
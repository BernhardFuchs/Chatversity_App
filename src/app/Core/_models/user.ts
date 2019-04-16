import { University } from './university';
import { UserProfile } from './profile';

export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    university: University;
    profile: UserProfile;
    active:boolean;
}

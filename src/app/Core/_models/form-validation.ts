export class CustomFormValidation {
    eduEmailValidation:string = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+.[e]+[d]+[u]+$';
    regularEmailValidation:string = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$';
    passwordValidation:string = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$';
}
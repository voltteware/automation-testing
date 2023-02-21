export class Links {
    //API Authenticate
    static API_LOGIN: string = '/login';
    static API_REGISTER: string ='/api/register'
    static API_USERS: string = '/api/users/';
    static API_USERS_EDIT: string = '/api/users/edit';
    static API_USERS_CHANGE_PASSWORD: string = '/api/users/change-password';
    static API_USERS_RESET_PASSWORD: string = '/api/password-reset/';
    //API Dashboard
    static API_REALM: string = '/api/realm';
    static API_COMPANY: string = '/api/company/';
    static API_SUPPLIERS: string = '/api/vendor';
    static API_CREATE_SUPPLIERS: string = '/api/vendor';

    //API Admin
    static API_ADMIN_DELETE_USER: string = '/api/admin/users/';
    static API_ADMIN_GET_COMPANIES: string = '/api/admin/companies';
    static API_ADMIN_GET_USER: string = '/api/admin/users?';
}

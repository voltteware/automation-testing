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
    static API_UPDATE_COMPANY: string = '/api/company/';
    static API_ITEMS: string = '/api/item';
    static API_BOM: string = '/api/bom';
    static API_CREATE_GRIDVIEW: string = '/api/grid-view';
    static API_GET_GRIDVIEW_SUPPLIER: string = '/api/grid-view/supplier';
    static API_GET_GRIDVIEW_ITEM: string = '/api/grid-view/item';
    static API_GET_GRIDVIEW_DEMAND: string = '/api/grid-view/demand';
    static API_DELETE_GRID_VIEW: string = '/api/grid-view/';
    //API Admin
    static API_ADMIN_DELETE_USER: string = '/api/admin/users/';
    static API_ADMIN_GET_COMPANIES: string = '/api/admin/companies';
    static API_ADMIN_GET_USER: string = '/api/admin/users?';
}

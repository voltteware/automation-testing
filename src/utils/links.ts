export class Links {
    //API Authenticate
    static API_LOGIN: string = '/login';
    static API_REGISTER: string = '/api/register'
    //API User
    static API_USERS: string = '/api/users/';
    static API_USER: string = '/api/user';
    static API_USERS_EDIT: string = '/api/users/edit';
    static API_USERS_CHANGE_PASSWORD: string = '/api/user/password';
    static API_USERS_RESET_PASSWORD: string = '/api/password-reset/';
    //API Dashboard
    static API_REALM: string = '/api/realm';
    static API_CREATE_COMPANY: string = '/api/company';
    static API_GET_COMPANY: string = '/api/company';
    static API_SUPPLIERS: string = '/api/vendor';
    static API_UPDATE_COMPANY: string = '/api/company/';
    static API_ITEMS: string = '/api/item';
    static API_ITEM_COUNT: string = '/api/item/count';
    static API_BOM: string = '/api/bom';
    static API_DEMAND: string = '/api/demand';
    static API_CREATE_GRIDVIEW: string = '/api/grid-view';
    static API_GET_GRIDVIEW_SUPPLIER: string = '/api/grid-view/supplier';
    static API_GET_GRIDVIEW_ITEM: string = '/api/grid-view/item';
    static API_GET_GRIDVIEW_DEMAND: string = '/api/grid-view/demand';
    static API_DELETE_GRID_VIEW: string = '/api/grid-view/';
    static API_GET_GRIDVIEW_SUPPLY: string = '/api/grid-view/supply';
    static API_GET_GRIDVIEW_BOM: string = '/api/grid-view/bom';
    static API_SUPPLY: string = '/api/supply';
    static API_CREATE_SUPPLY: string = '/api/supply/manual/';
    static API_SUBSCRIPTION: string = '/api/billing/subscription/'
    //API Purchasing
    static API_GET_GRIDVIEW_CUSTOM_ITEMS: string = '/api/grid-view/custom-items-in-po';
    static API_GET_GRIDVIEW_SUGGESTED_POS: string = '/api/grid-view/suggested-pos';
    static API_GET_GRIDVIEW_CUSTOM_ALL_AVAILABLE_ITEMS: string = '/api/grid-view/custom-all-available-items';
    static API_GET_COUNT_SUMMARY_BY_VENDOR = '/api/summarybyvendor';
    static API_SUMMARY_VENDOR_ITEMS_IN_PO = '/api/summary/vendor';
    static API_SUMMARY_ITEMS_IN_PURCHASING_CUSTOM = '/api/summary';
    //API RestockAMZ
    static API_GET_RESTOCK_SUGGESTION_BY_VENDOR = '/api/restock-suggestion-by-vendor';
    static API_GET_RESTOCK_SUGGESTION = '/api/restock-suggestion';
    //API Admin
    static API_ADMIN_DELETE_USER: string = '/api/admin/users/';
    static API_ADMIN_GET_COMPANIES: string = '/api/admin/companies';
    static API_ADMIN_DELETE_COMPANY: string = '/api/admin/companies/';
    static API_ADMIN_GET_USER: string = '/api/admin/users?';
    //API General
    static API_RUN_FORECAST: string = "/api/forecast";
    // API Count Summary
    static API_SUMMARY_COUNT: string = "/api/summary/count";
}

//URL for performance
export class Url {
    // static urlDev = 'https://dev-test.forecastrx.com';
    static urlPreprod = 'https://preprod-my.forecastrx.com';
}
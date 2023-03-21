import { check } from 'k6';
import http from 'k6/http';
import { Trend, Rate } from 'k6/metrics';
import { Links, Url } from '../../src/utils/links';

const getCompanyByCompanyKey = new Trend('Get Comany By Company Key');
const getCompanyByCompanyKeyErrorRate = new Rate('Get Comany By Company Key errors');

export default class CompanyRequest {
    params: any;
    cookie: string;
    companyKey: string;
    companyType: string;
    customerId?: string;
    subscriptionId?: any;

    constructor(companyKey: any, companyType: any, cookie: string) {
        this.params = {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Cookie': cookie,
            },
        };
        this.companyKey = companyKey;
        this.companyType = companyType;
        this.cookie = cookie;
    }

    getCompanyByCompanyKey() {
        let getCompanyByCompanyKeyResponse = http.get(`${Url.urlPreprod}${Links.API_UPDATE_COMPANY}${this.companyKey}`, this.params);
        const dataGetCompany = JSON.parse(getCompanyByCompanyKeyResponse.body as any);
        this.customerId = dataGetCompany.customerId;
        this.subscriptionId = dataGetCompany.subscriptionId;
        check(getCompanyByCompanyKeyResponse, {
            'Get Company By Company Key status is 200': (r) => r.status === 200,
        }) || getCompanyByCompanyKeyErrorRate.add(1);
        getCompanyByCompanyKey.add(getCompanyByCompanyKeyResponse.timings.duration);
    }
}
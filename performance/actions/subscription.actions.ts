import { check } from 'k6';
import http from 'k6/http';
import { Trend, Rate } from 'k6/metrics';
import { Links, Url } from '../../src/utils/links';

const getSubscriptionByCompanyKey = new Trend('Get Subscription By Company Key');
const getSubscriptionByCompanyKeyErrorRate = new Rate('Get Subscription By Company Key errors');

export default class SubscriptionRequest {
    params: any;
    cookie: string;
    companyKey: string;
    companyType: string;

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

    getSubscriptionByCompanyKey() {
        let getSubscriptionByCompanyKeyResponse = http.get(`${Url.urlPreprod}${Links.API_SUBSCRIPTION}${this.companyKey}`, this.params);
        check(getSubscriptionByCompanyKeyResponse, {
            'Get Subscription By Company Key status is 200': (r) => r.status === 200,
        }) || getSubscriptionByCompanyKeyErrorRate.add(1);
        getSubscriptionByCompanyKey.add(getSubscriptionByCompanyKeyResponse.timings.duration);
    }
}
import { group, check, sleep } from 'k6';
import { Options } from 'k6/options';
import LoginRequest from "../../performance/actions/login.actions";
import CompanyRequest from "../../performance/actions/company.actions";
import SubscriptionRequest from "../../performance/actions/subscription.actions";

export let options: Options = {
    // stages: [
    //     { duration: '30s', target: 5 }, // simulate ramp-up of traffic from 1 to 5 users over 30 seconds.
    //     { duration: '1m', target: 10 }, // k6 will ram-up to 10 total over the next 1m
    //     { duration: '30s', target: 0 }, // ramp-down to 0 users
    // ],
    // Need to define Test scenarios
    duration: '1s',
    vus: 10,
    thresholds: {
        http_req_duration: ['p(95)<400'],
        http_req_failed: ['rate<0.01'],
        'Get Login': ['p(95)<400'],
        'Post Login': ['p(95)<400'],
        'Get Realm': ['p(95)<400'],
        'Get Company By Company Key': ['p(95)<400'],
        'Get Subscription By Company Key': ['p(95)<400'],
    },
};

export default () => {
    let loginRequest = new LoginRequest();

    group('Users log in', () => {
        loginRequest.logIn();
        sleep(Math.random() * 4);
        loginRequest.getRealm();
    });

    let companyRequest = new CompanyRequest(loginRequest.companyKey,loginRequest.companyType,loginRequest.cookie);
    let subscriptionRequest = new SubscriptionRequest(loginRequest.companyKey,loginRequest.companyType,loginRequest.cookie);

    group('Users access dashboard', () => {
        companyRequest.getCompanyByCompanyKey();
        subscriptionRequest.getSubscriptionByCompanyKey();
    });
};

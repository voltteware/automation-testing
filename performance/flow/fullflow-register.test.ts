import { Options } from 'k6/options';
import { group } from 'k6';
import RegisterRequest from "../actions/register.actions"

export let options: Options = {
    // stages: [
    //     { duration: '30s', target: 5 }, // simulate ramp-up of traffic from 1 to 5 users over 30 seconds.
    //     { duration: '1m', target: 10 }, // k6 will ram-up to 10 total over the next 1m
    //     { duration: '30s', target: 0 }, // ramp-down to 0 users
    // ],
    // Need to define Test scenarios
    duration: '1s',
    vus: 1,
    thresholds: {
        http_req_duration: ['p(95)<400'],
        http_req_failed: ['rate<0.01'],
        'Post Register': ['p(95)<400'],
    },
};

export default function () {
    let registerRequest = new RegisterRequest();
    group('Users register', () => {
        registerRequest.register();
    })
}
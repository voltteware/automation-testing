import { group, check, sleep } from 'k6';
import { Options } from 'k6/options';
import LoginRequest from "../../performance/actions/login.actions";

export let options: Options = {
    // stages: [
    //     { duration: '30s', target: 5 }, // simulate ramp-up of traffic from 1 to 20 users over 10 seconds.
    //     { duration: '1m', target: 10 }, // stay at 100 users for 10 minutes
    //     { duration: '30s', target: 0 }, // ramp-down to 0 users
    // ],
    // Need to define Test scenarios
    duration: '1s',
    vus: 1,
    thresholds: {
        http_req_duration: ['p(95)<400'],
        http_req_failed: ['rate<0.01'],
        'Get Login': ['p(95)<400'],
        'Post Login': ['p(95)<400'],
    },
};


export default () => { 
    let loginRequest = new LoginRequest();
    group('Users log in', () => {
        loginRequest.logIn();
    })
    sleep(Math.random() * 4);
};

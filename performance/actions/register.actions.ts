import { check } from 'k6';
import http from 'k6/http';
import { Trend, Rate } from 'k6/metrics';
import { Url, Links } from "../../src/utils/links";
import { payloadRegister } from '../../src/utils/registerPayload'

const postRegister = new Trend('Post Register');
const postRegisteErrorRate = new Rate('Post Register errors');

export default class RegisterRequest {
    params: any;
    constructor() {
        this.params = {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
            },
        };
    }

    register() {
        const payload : payloadRegister = {
            companyName: "Test_Performance" + Math.floor(Math.random() * 101),
            companyType: "CSV",
            email: "abc" + Math.floor(Math.random() * 101) + "@gmail.com",
            firstName: "Test",
            lastName: "Performance_" + Math.floor(Math.random() * 101),
            password: "Test1111!",
            phone: "02020202020"
        }
        let registerResponse = http.post(`${Url.urlPreprod}${Links.API_REGISTER}`, JSON.stringify(payload), this.params);
        check(registerResponse, {
            'Register is status 201': (r) => r.status === 201,
        }) || postRegisteErrorRate.add(1);
        postRegister.add(registerResponse.timings.duration);
    }
}
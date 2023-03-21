import { check } from "k6";
import http from "k6/http"
import { Trend, Rate } from 'k6/metrics';
import { payloadLogin } from '../../src/utils/loginPayLoad'
import { Links, Url } from '../../src/utils/links';

const getLogin = new Trend('Get Login');
const postLogin = new Trend('Post Login');
const getRealm = new Trend('Get Realm');

const getLoginErrorRate = new Rate('Get Login errors');
const postLoginErrorRate = new Rate('Post Login errors');
const getRealmErrorRate = new Rate('Get Realm errors');

const usersPreprod = JSON.parse(open('./users.json') as any).usersPreprod;

export default class LoginRequest {
    params: any;
    cookie: any;
    companyKey: any;
    companyType: any;

    constructor() {
        this.params = {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
            },
        };
    }

    logIn() {
        const userPreprod = usersPreprod[Math.floor(Math.random() * usersPreprod.length)];

        let getLoginResponse = http.get(`${Url.urlPreprod}${Links.API_LOGIN}`, this.params);
        check(getLoginResponse, {
            'Get Login status is 200': (r) => r.status === 200,
        }) || getLoginErrorRate.add(1);
        getLogin.add(getLoginResponse.timings.duration);

        const payload: payloadLogin ={
            password: userPreprod.password,
            username: userPreprod.username,
        }

        let loginResponsePrepropd = http.post(`${Url.urlPreprod}${Links.API_LOGIN}`, JSON.stringify(payload), this.params);
        this.cookie = loginResponsePrepropd.headers['Set-Cookie'];
        check(loginResponsePrepropd, {
            'Login is status 201': (r) => r.status === 201,
        }) || postLoginErrorRate.add(1);
        postLogin.add(loginResponsePrepropd.timings.duration);

    }

    getRealm() {
        let getRealmResponse = http.get(`${Url.urlPreprod}${Links.API_REALM}`, this.params);
        const tmp = Math.floor(Math.random() * 4);
        const dataGetRealm = JSON.parse(getRealmResponse.body as any);
        this.companyKey = dataGetRealm[tmp].companyKey;
        this.companyType = dataGetRealm[tmp].companyType;
        check(getRealmResponse, {
            'Get Realm status is 200': (r) => r.status === 200,
        }) || getRealmErrorRate.add(1);
        getRealm.add(getRealmResponse.timings.duration);
    }
}
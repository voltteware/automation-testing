import { Then } from '@cucumber/cucumber';
import logger from '../../../../src/Logger/logger';
import reportType from '../../../../src/data/reportType.json'
import _ from "lodash";
import { getRegionByMarketplaceId } from '../../../../src/helpers/amazon-helper';
import SellingPartnerAPI from 'amazon-sp-api';

Then(`{} sends a GET method to get report on Amazon`, async function (actor: string) {
    const clientConfig = {
        region: getRegionByMarketplaceId(this.marketplaceId),
        //All of info below are Fisher Finery company
        refresh_token: "Atzr|IwEBID_BwBV4w9Z5kP3DbCidA-GEa96fOk785pqNtJckf0JubWe-5hK2n_CfrtGUpg5z7sw-vWkuL_dwtVe0NoYugIb65ruGXc8Ohv07Uu4B6gud4l2Kloz08iVb238-iRzN9EF5QCPRlb6ySG5CotqDSPu3_6ZIFsC9gbx7LcpY_wjtIW181FWCCk6vwfQvxp1qo-TORNeZ5UKaXRSz0mIlU9qyb5re5l8xZXDvBMxHFsFmgwGxMZ4s_PbXFakcJo7wroAIa2Z8OWxrZyyoFp9izhty4tLer2wUDN5bEZf6sTqv3r1RLIhH-5a8lUHeZ-QPvDs",
        credentials: {
            SELLING_PARTNER_APP_CLIENT_ID: 'amzn1.application-oa2-client.d2863395cbb3490db7b5c3d980db6951',
            SELLING_PARTNER_APP_CLIENT_SECRET: '71d6e0c4ad5894aeae2d51908a3bbcdc23a5149613dabb99a2d870470c73f0f1',
            AWS_ACCESS_KEY_ID: 'AKIAQ6O4VP2SSKVRWQ5P',
            AWS_SECRET_ACCESS_KEY: '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',
            AWS_SELLING_PARTNER_ROLE: 'arn:aws:iam::065424162469:role/sellingpartnerapi_role'
        },
        endpoints_versions: {
            'reports': '2021-06-30'
        }
    };

    (async () => {
        try {
            let sellingPartner = new SellingPartnerAPI(clientConfig);
            let res = await sellingPartner.callAPI({
                operation: 'reports.createReport',
                body: {
                    reportType: `${reportType.Demand}`,
                    marketplaceIds: [`${this.marketplaceId}`],
                    dataStartTime: `${ this.lastMonthDateFormat}`,
                    dataEndTime: `${this.currentDateFormat}`
                }
            });
            console.log("Response message: " + JSON.stringify(res))
            logger.log('info', "Response message: " + JSON.stringify(res));
            this.attach("Response Create report Demand from Amazon" + JSON.stringify(res, undefined, 4))
        }
        catch (e) {
            logger.log('info', "Error message: " + e);
        };
    });
});

// try {
//     let res = await sellingPartner.callAPI({
//       operation: 'getCompetitivePricing',
//       endpoint: 'productPricing',
//       query: {
//         Asins: ['B00Z7T970I','B01BHHE9VK'],
//         ItemType: 'Asin',
//         MarketplaceId: 'A1PA6795UKMFR9'
//       },
//       options: {
//         version: 'v0',
//         raw_result: true,
//         timeouts:{
//           response:5000,
//           idle:10000,
//           deadline:30000
//         }
//       }
//     });
//   } catch(err) {
//     if (err.code){
//       if (err.code ==='API_RESPONSE_TIMEOUT') console.log('SP-API ERROR: response timeout: ' + err.timeout + 'ms exceeded.',err.message);
//       if (err.code ==='API_IDLE_TIMEOUT') console.log('SP-API ERROR: idle timeout: ' + err.timeout + 'ms exceeded.',err.message);
//       if (err.code ==='API_DEADLINE_TIMEOUT') console.log('SP-API ERROR: deadline timeout: ' + err.timeout + 'ms exceeded.',err.message);
//     }
//   }
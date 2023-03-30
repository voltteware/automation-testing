function getRegionByMarketplaceId(marketplaceId: any): "na"|"eu"|"fe"{
    switch (marketplaceId){
        case 'A2EUQ1WTGCTBG2': // Canada
        case 'ATVPDKIKX0DER' : // US
        case 'A1AM78C64UM0Y8': // Mexico
        case 'A2Q3Y263D00KWC': // Brazil
        case 'NA':
            return 'na';
        case 'A1RKKUPIHCS9HS': // Spain
        case 'A1F83G8C2ARO7P': // UK
        case 'A13V1IB3VIYZZH': // France
        case 'A1805IZSGTT6HS': // Netherlands
        case 'A1PA6795UKMFR9': // Germany
        case 'APJ6JRA9NG5V4' : // Italy
        case 'A2NODRKZP88ZB9': // Sweden
        case 'A1C3SOZRARQ6R3': // Poland
        case 'ARBP9OOSHTCHU' : // Egypt
        case 'A33AVAJ2PDY3EV': // Turkey
        case 'A2VIGQ35RCS4UG': // United Arab Emirates
        case 'A21TJRUUN4KGV' : // India
        case 'EU':
            return 'eu';
        case 'A19VAU5U5O7RUS': // Singapore
        case 'A39IBJ37TRP1C6': // Australia
        case 'A1VC38T7YXB528': // Japan
        case 'AAHKV2X7AFYLW' : // China
            return 'fe';
        default: throw 'Unsupported marketplace Id ' + marketplaceId;
    }
}

export {
    getRegionByMarketplaceId
}
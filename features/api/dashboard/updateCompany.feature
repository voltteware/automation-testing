@test-api @api-dashboard @api-updateCompany
Feature: API_Dashboard PUT /api/company
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111! |
        And User sets GET api endpoint to get company keys
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get company keys

    @TC_UC001
    Scenario Outline: TC_UC001 - Verify user <email> could call this API to update <properties> for any company type
        Given User picks random company in above response
        And User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        And User sets PUT api endpoint to update company keys
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets request body with payload as leadTime: <leadTime> and companyKey, companyType
        When User sends a PUT method to update company of "<email>" by company key
        Then The expected status code should be <expectedStatus>
        And User checks API contract essential types in company object are correct
        And User checks values of <properties> in response of update company are correct
        Examples:
            | properties | email                      | leadTime | companyKey | expectedStatus |
            | leadTime   | testautoforecast@gmail.com | 30       | random     | 200            |

    @TC_UC002
    Scenario Outline: TC_UC002 - Verify user <email> could call this API to update <properties> for any company type
        Given User picks random company in above response
        And User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        And User sets PUT api endpoint to update company keys
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets request body with payload as orderInterval: <orderInterval> and companyKey, companyType
        When User sends a PUT method to update company of "<email>" by company key
        Then The expected status code should be <expectedStatus>
        And User checks API contract essential types in company object are correct
        And User checks values of <properties> in response of update company are correct
        Examples:
            | properties    | email                      | orderInterval | companyKey | expectedStatus |
            | orderInterval | testautoforecast@gmail.com | 30            | random     | 200            |

    @TC_UC003
    Scenario Outline: TC_UC003 - Verify user <email> could call this API to update <properties> for any company type
        Given User picks random company in above response
        And User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        And User sets PUT api endpoint to update company keys
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets request body with payload as serviceLevel: <serviceLevel> and companyKey, companyType
        When User sends a PUT method to update company of "<email>" by company key
        Then The expected status code should be <expectedStatus>
        And User checks API contract essential types in company object are correct
        And User checks values of <properties> in response of update company are correct
        Examples:
            | properties   | email                      | serviceLevel | companyKey | expectedStatus |
            | serviceLevel | testautoforecast@gmail.com | 40           | random     | 200            |

    @TC_UC004
    Scenario Outline: <id> - Verify user <email> could call this API to update <properties> for any company type
        Given User picks random company in above response
        And User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        And User sets PUT api endpoint to update company keys
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets request body with payload as isNotifyingAfterSync: "<isNotifyingAfterSync>" and companyKey, companyType
        When User sends a PUT method to update company of "<email>" by company key
        Then The expected status code should be <expectedStatus>
        And User checks API contract essential types in company object are correct
        And User checks values of <properties> in response of update company are correct
        Examples:
            | id         | properties           | email                      | isNotifyingAfterSync | companyKey | expectedStatus |
            | TC_UC004_1 | isNotifyingAfterSync | testautoforecast@gmail.com | false                | random     | 200            |
            | TC_UC004_2 | isNotifyingAfterSync | testautoforecast@gmail.com | true                 | random     | 200            |

    @TC_UC005
    Scenario Outline: <id> - Verify user <email> could call this API to update <properties> for any company type
        Given User picks random company in above response
        And User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        And User sets PUT api endpoint to update company keys
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets request body with payload as isNotifyingAfterForecast: "<isNotifyingAfterForecast>" and companyKey, companyType
        When User sends a PUT method to update company of "<email>" by company key
        Then The expected status code should be <expectedStatus>
        And User checks API contract essential types in company object are correct
        And User checks values of <properties> in response of update company are correct
        Examples:
            | id         | properties               | email                      | isNotifyingAfterForecast | companyKey | expectedStatus |
            | TC_UC005_1 | isNotifyingAfterForecast | testautoforecast@gmail.com | false                    | random     | 200            |
            | TC_UC005_2 | isNotifyingAfterForecast | testautoforecast@gmail.com | true                     | random     | 200            |

    @TC_UC006
    Scenario Outline: TC_UC006 - Verify user <email> could call this API to update <properties> for any company type
        Given User picks random company in above response
        And User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        And User sets PUT api endpoint to update company keys
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets request body with payload as isLostSaleTracking: "<isLostSaleTracking>" and companyKey, companyType
        When User sends a PUT method to update company of "<email>" by company key
        Then The expected status code should be <expectedStatus>
        And User checks API contract essential types in company object are correct
        And User checks values of <properties> in response of update company are correct
        Examples:
            | id         | properties         | email                      | isLostSaleTracking | companyKey | expectedStatus |
            | TC_UC006_1 | isLostSaleTracking | testautoforecast@gmail.com | false              | random     | 200            |
            | TC_UC006_2 | isLostSaleTracking | testautoforecast@gmail.com | true               | random     | 200            |
    @TC_UC007
    Scenario Outline: TC_UC007 - Verify error when user <email> sends this API <scenario> in the request body 
        Given User picks random company in above response
        And User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        And User sets PUT api endpoint to update company keys
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets request body with payload as isLostSaleTracking: "<isLostSaleTracking>" and without companyKey
        When User sends a PUT method to update company of "<email>" by company key
        Then The expected status code should be <expectedStatus>
        Examples:
            | scenario           | email                      | isLostSaleTracking | companyKey | expectedStatus | expectedStatusText                         |
            | without companyKey | testautoforecast@gmail.com | true               | random     | 400            | Cannot read property 'companyType' of null |

    @TC_UC008
    Scenario Outline: TC_UC008 - Verify error when user <email> sends this API <scenario> in the request body 
        Given User picks random company in above response
        And User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        And User sets PUT api endpoint to update company keys
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets request body with payload as isLostSaleTracking: "<isLostSaleTracking>" and without companyType
        When User sends a PUT method to update company of "<email>" by company key
        Then The expected status code should be <expectedStatus>
        Examples:
            | scenario            | email                      | isLostSaleTracking | companyKey | expectedStatus | expectedStatusText                         |
            | without companyType | testautoforecast@gmail.com | true               | random     | 400            | Cannot read property 'companyType' of null |

    @TC_UC009 @TC_UC010
    Scenario Outline: <scenario> - Verify error when user sends this API with <cookie> cookie
        Given User picks random company in above response
        And User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        And User sets PUT api endpoint to update company keys
        And User sets Cookie in HEADER as <cookie>
        And User sets request body with payload as isLostSaleTracking: "<isLostSaleTracking>" and companyKey, companyType
        When User sends a PUT method to update company of "<email>" by company key
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | scenario | cookie  | email                      | isLostSaleTracking | companyKey | expectedStatus | expectedStatusText |
            | TC_UC009 | invalid | testautoforecast@gmail.com | true               | random     | 401            | Unauthorized       |
            | TC_UC010 |         | testautoforecast@gmail.com | true               | random     | 401            | Unauthorized       |

    @TC_UC011
    Scenario Outline: <id> - Verify user <email> could call this API to update <properties> value for company type <companyType>
        Given User picks company with type ASC in above response
        And User sets PUT api endpoint to update company keys
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets request body with payload as pendingOrderToggle: "<pendingOrderToggle>" and companyKey, companyType
        When User sends a PUT method to update company of "<email>" by company key
        Then The expected status code should be <expectedStatus>
        And User checks API contract essential types in company object are correct
        And User checks values of <properties> in response of update company are correct
        Examples:
            | id         | properties         | email                      | pendingOrderToggle | companyKey  | companyType | expectedStatus |
            | TC_UC011_1 | pendingOrderToggle | testautoforecast@gmail.com | false              | random      | ASC         |  200           |
            | TC_UC011_2 | pendingOrderToggle | testautoforecast@gmail.com | true               | random      | ASC         |  200           |

    @TC_UC012
    Scenario Outline: <id> - Verify user <email> could call this API to update <properties> value for company type <companyType>
        Given User picks company with type ASC in above response
        And User sets PUT api endpoint to update company keys
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets request body with payload as inventorySourcePreference: "<inventorySourcePreference>" and companyKey, companyType
        When User sends a PUT method to update company of "<email>" by company key
        Then The expected status code should be <expectedStatus>
        And User checks API contract essential types in company object are correct
        And User checks values of <properties> in response of update company are correct
        Examples:
            | id         | properties                |  email                     | inventorySourcePreference | companyKey  | companyType | expectedStatus |
            | TC_UC012_1 | inventorySourcePreference | testautoforecast@gmail.com | FBA                       | random      | ASC         |  200           |
            | TC_UC012_2 | inventorySourcePreference | testautoforecast@gmail.com | FBM                       | random      | ASC         |  200           |
            | TC_UC012_3 | inventorySourcePreference | testautoforecast@gmail.com | FBA+FBM                   | random      | ASC         |  200           |

    @TC_UC013
    Scenario Outline: <id> - Verify user <email> could call this API to update <properties> value for company type <companyType>
        Given User picks company with type ASC in above response
        And User sets PUT api endpoint to update company keys
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets request body with payload purchasingSalesVelocitySettingData as percent2Day: <percent2Day> and percent7Day: <percent7Day> and percent30Day: <percent30Day> and percent60Day: <percent60Day> and percent90Day: <percent90Day> and percent180Day: <percent180Day> and percentForecasted: <percentForecasted> and companyKey, companyType
        When User sends a PUT method to update company of "<email>" by company key
        Then The expected status code should be <expectedStatus>
        And User checks API contract essential types in company object are correct
        And User checks values of <properties> in response of update company are correct
        And The expected Total percentage should be <expectedTotalPercentage>
        Examples:
            | id       | properties                         |  email                     | percent2Day | percent7Day | percent30Day | percent60Day | percent90Day | percent180Day | percentForecasted | companyKey  | companyType | expectedStatus | expectedTotalPercentage|
            | TC_UC013 | purchasingSalesVelocitySettingData | testautoforecast@gmail.com | 10          | 20          | 15           | 5            | 0            | 0             | 50                | random      | ASC         |  200           | 100                    |

    #Bug API in case @TC_UC014 => still return status code 200 when total percentage is greater than 100
    @TC_UC014
    Scenario Outline: <id> - Verify error when user <email> updates total percentage in <properties> for company type <companyType> is greater than 100
        Given User picks company with type ASC in above response
        And User sets PUT api endpoint to update company keys
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets request body with payload purchasingSalesVelocitySettingData as percent2Day: <percent2Day> and percent7Day: <percent7Day> and percent30Day: <percent30Day> and percent60Day: <percent60Day> and percent90Day: <percent90Day> and percent180Day: <percent180Day> and percentForecasted: <percentForecasted> and companyKey, companyType
        When User sends a PUT method to update company of "<email>" by company key
        Then The expected status code should be <expectedStatus>
        Examples:
            | id       | properties                         |  email                     | percent2Day | percent7Day | percent30Day | percent60Day | percent90Day | percent180Day | percentForecasted | companyKey  | companyType | expectedStatus |
            | TC_UC014 | purchasingSalesVelocitySettingData | testautoforecast@gmail.com | 10          | 20          | 15           | 5            | 50           | 0             | 50                | random      | ASC         | 400            |
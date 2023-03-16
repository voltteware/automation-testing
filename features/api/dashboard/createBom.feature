@test-api @api-dashboard @api-bom @api-createBom
Feature: API_Dashboard POST /api/bom
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111! |
        And User sets GET api endpoint to get company keys
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get company keys

    @TC_CB001
    Scenario Outline: <TC_ID> - Verify user <email> could call this API to create bom for company has type <companyType> with input all data valid
        Given User picks company with type <companyType> in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets GET api endpoint to get bom keys
        And User sends a GET request to get list boms
        And User sets POST api endpoint to create bom
        And User sets request body with payload as parentName: "<parentName>" and parentKey: "<parentKey>" and childName: "<childName>" and childKey: "<childKey>" and qty: "<qty>"
        When User sends a POST method to create bom
        Then The expected status code should be <expectedStatus>
        And User checks API contract essential types in bom object are correct
        And User checks values in response of create bom are correct

        Examples:
            | TC_ID    | companyType | email                      | limitRow | parentName | parentKey | childName | childKey | qty    | expectedStatus |
            | TC_CB001 | CSV         | testautoforecast@gmail.com | 50       | random     | random    | random    | random   | random | 200            |
            | TC_CB002 | ASC         | testautoforecast@gmail.com | 50       | random     | random    | random    | random   | random | 200            |

    #TC_CB003_1, TC_CB003_2 fail due to bug api
    @TC_CB003
    Scenario Outline: <TC_ID> - Verify error when user sends this API with <cookie> cookie, <companyKeyHeader> companyKey, <companyTypeHeader> companyType value in header
        Given User picks company with type <companyType> in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets GET api endpoint to get bom keys
        And User sends a GET request to get list boms
        And User sets POST api endpoint to create bom
        But User sets <cookie> cookie of <email> and <companyKeyHeader> companyKey and <companyTypeHeader> companyType in the header
        And User sets request body with payload as parentName: "<parentName>" and parentKey: "<parentKey>" and childName: "<childName>" and childKey: "<childKey>" and qty: "<qty>"
        When User sends a POST method to create bom
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | TC_ID      | companyType | email                      | limitRow | cookie  | companyKeyHeader | companyTypeHeader | parentName | parentKey | childName | childKey | qty     | expectedStatus | expectedStatusText    |
            | TC_CB003_1 | CSV         | testautoforecast@gmail.com | 30       | invalid | invalid          | invalid           | random     | random    | random    | random   | random  | 401            | Unauthorized          |
            | TC_CB003_2 | ASC         | testautoforecast@gmail.com | 30       | invalid | valid            | valid             | random     | random    | random    | random   | random  | 401            | Unauthorized          |
            | TC_CB003_3 | CSV         | testautoforecast@gmail.com | 30       | valid   | invalid          | invalid           | random     | random    | random    | random   | random  | 400            | Company not found.    |
            | TC_CB003_4 | ASC         | testautoforecast@gmail.com | 30       | valid   |                  |                   | random     | random    | random    | random   | random  | 500            | Internal Server Error |  

    @TC_CB004
    Scenario Outline: TC_CB004 - Verify error when the item is a parent can't is a child
        Given User picks company with type CSV in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets GET api endpoint to get bom keys
        And User sends a GET request to get list boms
        And User sets POST api endpoint to create bom
        And User sets request body with payload as parentName: "<parentName>" and parentKey: "<parentKey>" and childName: "<childName>" and childKey: "<childKey>" and qty: "<qty>"
        When User sends a POST method to create bom
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | email                      | limitRow | parentName | parentKey | childName | childKey | qty    | expectedStatus | expectedStatusText                        |
            | testautoforecast@gmail.com | 50       | childName  | childKey  | random    | random   | random | 400            | Inserting would create a multi-level Kit. |
    
    @TC_CB005
    Scenario Outline: TC_CB005 - Verify error when the item is a child can't is a parent
        Given User picks company with type ASC in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets GET api endpoint to get bom keys
        And User sends a GET request to get list boms
        And User sets POST api endpoint to create bom
        And User sets request body with payload as parentName: "<parentName>" and parentKey: "<parentKey>" and childName: "<childName>" and childKey: "<childKey>" and qty: "<qty>"
        When User sends a POST method to create bom
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | email                      | limitRow | parentName | parentKey | childName  | childKey  | qty    | expectedStatus | expectedStatusText                        |
            | testautoforecast@gmail.com | 50       | random     | random    | parentName | parentKey | random | 400            | Inserting would create a multi-level Kit. |
    
    @TC_CB006
    Scenario Outline: TC_CB006 - Verify user <userA> could not call this API to create bom of company which does not belongs to her
        Given User picks company with type CSV in above response
        But User sets valid cookie of <userB> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets GET api endpoint to get bom keys
        And User sends a GET request to get list boms
        And User has valid connect.sid of "<userA>" after send a POST request with payload as email: "<userA>" and password: "<password>"
        And User sets POST api endpoint to create bom
        But User sets valid cookie of <userA> and valid companyKey and valid companyType in the header
        And User sets request body with payload as parentName: "<parentName>" and parentKey: "<parentKey>" and childName: "<childName>" and childKey: "<childKey>" and qty: "<qty>"
        When User sends a POST method to create bom
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | userA               | userB                      | password  | limitRow | parentName | parentKey | childName | childKey | qty    | expectedStatus | expectedStatusText |
            | may27user@gmail.com | testautoforecast@gmail.com | Test1111! | 50       | random     | random    | random    | random   | random | 400            | Company not found. |
            
    @TC_CB007
    Scenario Outline: TC_CB007 - Verify error bom already exists
        Given User picks company with type CSV in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets GET api endpoint to get bom keys
        And User sends a GET request to get list boms
        And User sets POST api endpoint to create bom
        And User sets request body with payload as parentName: "<parentName>" and parentKey: "<parentKey>" and childName: "<childName>" and childKey: "<childKey>" and qty: "<qty>"
        When User sends a POST method to create bom
        When User sends a POST method to create bom
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | email                      | limitRow | parentName | parentKey | childName | childKey | qty    | expectedStatus | expectedStatusText     |
            | testautoforecast@gmail.com | 20       | random     | random    | random    | random   | random | 400            | Record already exists. |

    @TC_CB008
    Scenario Outline: TC_CB008 - Verify error when user input is missing one required field
        Given User picks company with type ASC in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets GET api endpoint to get bom keys
        And User sends a GET request to get list boms
        And User sets POST api endpoint to create bom
        And User sets request body with payload as parentName: "<parentName>" and parentKey: "<parentKey>" and childName: "<childName>" and childKey: "<childKey>" and qty: "<qty>"
        When User sends a POST method to create bom
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | email                      | limitRow | parentName | parentKey | childName | childKey | qty    | expectedStatus | expectedStatusText         |
            | testautoforecast@gmail.com | 20       |            |           | random    | random   | random | 400            | Missing required property. |

    #Bug TC_CB009,TC_CB010 return status code 200 when call this API for company has type QBFS and QBO.
    @TC_CB009 @TC_CB010
    Scenario Outline: <TC_ID> - Verify user could not call this API with company has type <companyType>
        Given User picks company with type <companyType> in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets GET api endpoint to get bom keys
        And User sends a GET request to get list boms
        And User sets POST api endpoint to create bom
        And User sets request body with payload as parentName: "<parentName>" and parentKey: "<parentKey>" and childName: "<childName>" and childKey: "<childKey>" and qty: "<qty>"
        When User sends a POST method to create bom
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | TC_ID    | companyType | email                      | limitRow | parentName | parentKey | childName | childKey | qty    | expectedStatus | expectedStatusText |
            | TC_CB009 | QBFS        | testautoforecast@gmail.com | 30       | random     | random    | random    | random   | random | 400            | Bad Request        |
            | TC_CB010 | QBO         | testautoforecast@gmail.com | 30       | random     | random    | random    | random   | random | 400            | Bad Request        |
   
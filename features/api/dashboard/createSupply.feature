@test-api @api-dashboard @api-createSupply
Feature: API_Dashboard POST /api/supply
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111! |
        And User sets GET api endpoint to get company keys
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get company keys

    @TC_CSL001 @TC_CSL002
    Scenario Outline: <scenario> - Verify user <email> could call this API to create supply for company has type <companyType> with input all data valid
        Given User picks company with type <companyType> in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers keys
        And User sends a GET request to get list suppliers
        And user checks Auto supplier exist in the system, if it does not exist will create new supplier
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets POST api endpoint to create supply
        And User sets request body with payload as supplyUuid: "<supplyUuid>" and refNum: "<refNum>" and vendorName: "<vendorName>" and vendorKey: "<vendorKey>" and docDate: "<docDate>" and dueDate: "<dueDate>" and itemName: "<itemName>" and itemKey: "<itemKey>" and orderQty: "<orderQty>" and openQty: "<openQty>" and orderKey: "<orderKey>" and rowKey: "<rowKey>"
        When User sends a POST method to create supply
        Then The expected status code should be <expectedStatus>
        And User checks API contract essential types in supply object are correct
        And User checks values in response of create supply are correct
        Examples:
            | scenario  | companyType | email                      | limitRow | supplyUuid | refNum | vendorName | vendorKey | docDate | dueDate | itemName | itemKey | orderQty | openQty | orderKey | rowKey | expectedStatus |
            | TC_CSL001 | CSV         | testautoforecast@gmail.com | 50       | random     | random | random     | random    | random  | random  | random   | random  | random   | random  | random   | random | 200            |
            | TC_CSL002 | ASC         | testautoforecast@gmail.com | 50       | random     | random | random     | random    | random  | random  | random   | random  | random   | random  | random   | random | 200            |

    #TC_CSL003_1, TC_CSL003_2 fail due to bug api
    @TC_CSL003
    Scenario Outline: <scenario> - Verify error when user sends this API with <cookie> cookie, <companyKeyHeader> companyKey, <companyTypeHeader> companyType value in header
        Given User picks company with type <companyType> in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers keys
        And User sends a GET request to get list suppliers
        And user checks Auto supplier exist in the system, if it does not exist will create new supplier
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets POST api endpoint to create supply
        But User sets <cookie> cookie of <email> and <companyKeyHeader> companyKey and <companyTypeHeader> companyType in the header
        And User sets request body with payload as supplyUuid: "<supplyUuid>" and refNum: "<refNum>" and vendorName: "<vendorName>" and vendorKey: "<vendorKey>" and docDate: "<docDate>" and dueDate: "<dueDate>" and itemName: "<itemName>" and itemKey: "<itemKey>" and orderQty: "<orderQty>" and openQty: "<openQty>" and orderKey: "<orderKey>" and rowKey: "<rowKey>"
        When User sends a POST method to create supply
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | scenario    | companyType | email                      | limitRow | cookie  | companyKeyHeader | companyTypeHeader | supplyUuid | refNum | vendorName | vendorKey | docDate | dueDate | itemName | itemKey | orderQty | openQty | orderKey | rowKey | expectedStatus | expectedStatusText    |
            | TC_CSL003_1 | CSV         | testautoforecast@gmail.com | 50       | invalid | invalid          | invalid           | random     | random | random     | random    | random  | random  | random   | random  | random   | random  | random   | random | 401            | Unauthorized          |
            | TC_CSL003_2 | ASC         | testautoforecast@gmail.com | 50       | invalid | valid            | valid             | random     | random | random     | random    | random  | random  | random   | random  | random   | random  | random   | random | 401            | Unauthorized          |
            | TC_CSL003_3 | CSV         | testautoforecast@gmail.com | 50       | valid   | invalid          | invalid           | random     | random | random     | random    | random  | random  | random   | random  | random   | random  | random   | random | 400            | Company not found.    |
            | TC_CSL003_4 | ASC         | testautoforecast@gmail.com | 50       | valid   |                  |                   | random     | random | random     | random    | random  | random  | random   | random  | random   | random  | random   | random | 500            | Internal Server Error |  

    @TC_CSL004
    Scenario Outline: TC_CSL004 - Verify user <userA> could not call this API to create supply of company which does not belongs to her
        Given User picks company with type ASC in above response
        But User sets valid cookie of <userB> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers keys
        And User sends a GET request to get list suppliers
        And user checks Auto supplier exist in the system, if it does not exist will create new supplier
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User has valid connect.sid of "<userA>" after send a POST request with payload as email: "<userA>" and password: "<password>"
        And User sets POST api endpoint to create supply
        But User sets valid cookie of <userA> and valid companyKey and valid companyType in the header
        And User sets request body with payload as supplyUuid: "<supplyUuid>" and refNum: "<refNum>" and vendorName: "<vendorName>" and vendorKey: "<vendorKey>" and docDate: "<docDate>" and dueDate: "<dueDate>" and itemName: "<itemName>" and itemKey: "<itemKey>" and orderQty: "<orderQty>" and openQty: "<openQty>" and orderKey: "<orderKey>" and rowKey: "<rowKey>"
        When User sends a POST method to create supply
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | userA               | userB                      | password  | limitRow | supplyUuid | refNum | vendorName | vendorKey | docDate | dueDate | itemName | itemKey | orderQty | openQty | orderKey | rowKey | expectedStatus | expectedStatusText    |
            | may27user@gmail.com | testautoforecast@gmail.com | Test1111! | 50       | random     | random | random     | random    | random  | random  | random   | random  | random   | random  | random   | random | 400            | Company not found.    |
            
    @TC_CSL005
    Scenario Outline: TC_CSL005 - Verify error orderKey and rowKey already exists
        Given User picks company with type CSV in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers keys
        And User sends a GET request to get list suppliers
        And user checks Auto supplier exist in the system, if it does not exist will create new supplier
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets POST api endpoint to create supply
        And User sets request body with payload as supplyUuid: "<supplyUuid>" and refNum: "<refNum>" and vendorName: "<vendorName>" and vendorKey: "<vendorKey>" and docDate: "<docDate>" and dueDate: "<dueDate>" and itemName: "<itemName>" and itemKey: "<itemKey>" and orderQty: "<orderQty>" and openQty: "<openQty>" and orderKey: "<orderKey>" and rowKey: "<rowKey>"
        When User sends a POST method to create supply
        When User sends a POST method to create supply
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | email                      | limitRow | supplyUuid | refNum | vendorName | vendorKey | docDate | dueDate | itemName | itemKey | orderQty | openQty | orderKey | rowKey | expectedStatus | expectedStatusText     |
            | testautoforecast@gmail.com | 50       | random     | random | random     | random    | random  | random  | random   | random  | random   | random  | random   | random | 400            | Record already exists. |

    @TC_CSL006
    Scenario Outline: TC_CSL006 - Verify error when user input invalid date in the docDate and dueDate
        Given User picks company with type CSV in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers keys
        And User sends a GET request to get list suppliers
        And user checks Auto supplier exist in the system, if it does not exist will create new supplier
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets POST api endpoint to create supply
        And User sets request body with payload as supplyUuid: "<supplyUuid>" and refNum: "<refNum>" and vendorName: "<vendorName>" and vendorKey: "<vendorKey>" and docDate: "<docDate>" and dueDate: "<dueDate>" and itemName: "<itemName>" and itemKey: "<itemKey>" and orderQty: "<orderQty>" and openQty: "<openQty>" and orderKey: "<orderKey>" and rowKey: "<rowKey>"
        When User sends a POST method to create supply
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | email                      | limitRow | supplyUuid | refNum | vendorName | vendorKey | docDate | dueDate | itemName | itemKey | orderQty | openQty | orderKey | rowKey | expectedStatus | expectedStatusText       |
            | testautoforecast@gmail.com | 50       | random     | random | random     | random    | invalid | invalid | random   | random  | random   | random  | random   | random | 400            | Unable to create record. |

    @TC_CSL007
    Scenario Outline: TC_CSL007 - Verify error when user input is missing one required field
        Given User picks company with type CSV in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers keys
        And User sends a GET request to get list suppliers
        And user checks Auto supplier exist in the system, if it does not exist will create new supplier
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets POST api endpoint to create supply
        And User sets request body with payload as supplyUuid: "<supplyUuid>" and refNum: "<refNum>" and vendorName: "<vendorName>" and vendorKey: "<vendorKey>" and docDate: "<docDate>" and dueDate: "<dueDate>" and itemName: "<itemName>" and itemKey: "<itemKey>" and orderQty: "<orderQty>" and openQty: "<openQty>" and orderKey: "<orderKey>" and rowKey: "<rowKey>"
        When User sends a POST method to create supply
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | email                      | limitRow | supplyUuid | refNum | vendorName | vendorKey | docDate | dueDate | itemName | itemKey | orderQty | openQty | orderKey | rowKey | expectedStatus | expectedStatusText         |
            | testautoforecast@gmail.com | 50       | random     | random | random     | random    | random  | random  |          |         | random   | random  | random   | random | 400            | Missing required property. |

    @TC_CSL008
    Scenario Outline: TC_CSL008 - Verify error when user input invalid date in the vendorname and vendorkey
        Given User picks company with type CSV in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers keys
        And User sends a GET request to get list suppliers
        And user checks Auto supplier exist in the system, if it does not exist will create new supplier
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets POST api endpoint to create supply
        And User sets request body with payload as supplyUuid: "<supplyUuid>" and refNum: "<refNum>" and vendorName: "<vendorName>" and vendorKey: "<vendorKey>" and docDate: "<docDate>" and dueDate: "<dueDate>" and itemName: "<itemName>" and itemKey: "<itemKey>" and orderQty: "<orderQty>" and openQty: "<openQty>" and orderKey: "<orderKey>" and rowKey: "<rowKey>"
        When User sends a POST method to create supply
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | email                      | limitRow | supplyUuid | refNum | vendorName | vendorKey | docDate | dueDate | itemName | itemKey | orderQty | openQty | orderKey | rowKey | expectedStatus | expectedStatusText       |
            | testautoforecast@gmail.com | 50       | random     | random | invalid    | invalid   | random  | random  | random   | random  | random   | random  | random   | random | 400            | Unable to create record. |

    #Bug TC_CSL009,TC_CSL010 return status code 200 when call this API for company has type QBFS and QBO.
    @TC_CSL009 @TC_CSL010
    Scenario Outline: <scenario> - Verify user could not call this API with company has type <companyType>
        Given User picks company with type <companyType> in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers keys
        And User sends a GET request to get list suppliers
        And user checks Auto supplier exist in the system, if it does not exist will create new supplier
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets POST api endpoint to create supply
        And User sets request body with payload as supplyUuid: "<supplyUuid>" and refNum: "<refNum>" and vendorName: "<vendorName>" and vendorKey: "<vendorKey>" and docDate: "<docDate>" and dueDate: "<dueDate>" and itemName: "<itemName>" and itemKey: "<itemKey>" and orderQty: "<orderQty>" and openQty: "<openQty>" and orderKey: "<orderKey>" and rowKey: "<rowKey>"
        When User sends a POST method to create supply
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | scenario  | companyType | email                      | limitRow | supplyUuid | refNum | vendorName | vendorKey | docDate | dueDate | itemName | itemKey | orderQty | openQty | orderKey | rowKey | expectedStatus | expectedStatusText |
            | TC_CSL009 | QBFS        | testautoforecast@gmail.com | 50       | random     | random | random     | random    | random  | random  | random   | random  | random   | random  | random   | random | 400            | Bad Request        |
            | TC_CSL010 | QBO         | testautoforecast@gmail.com | 50       | random     | random | random     | random    | random  | random  | random   | random  | random   | random  | random   | random | 400            | Bad Request        |
   
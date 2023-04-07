@test-api-extra @api-dashboard @api-demand @api-createDemand
Feature: API_Dashboard POST /api/demand
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get company keys
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get company keys

    @TC_CD001 @regression-api
    Scenario Outline: <TC_ID> - Verify user <email> could call this API to create demand for company has type <companyType> with input all data valid
        Given User picks company with type <companyType> in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets POST api endpoint to create demand
        And User sets request body with payload as itemName: "<itemName>" and dateOfSale: "<dateOfSale>" and saleOrderQty: "<saleOrderQty>" and openSaleOrderQty: "<openSaleOrderQty>" and referenceNumber: "<referenceNumber>"
        When User sends a POST method to create demand
        Then The expected status code should be <expectedStatus>
        And User checks API contract essential types in create demand object are correct
        And User checks values in response of create demand are correct

        Examples:
            | TC_ID    | companyType | email                      | limitRow | itemName | dateOfSale | saleOrderQty | openSaleOrderQty | referenceNumber | expectedStatus |
            | TC_CD001 | CSV         | testautoforecast@gmail.com | 50       | random   | random     | random       | random           | random          | 200            |

    #TC_CD002_1, TC_CD002_2 fail due to bug api - Bug 1820
    @TC_CD002 @TC_CD002_1-bug-1820 @TC_CD002_2-bug-1820
    Scenario Outline: <TC_ID> - Verify error when user sends this API with <cookie> cookie, <companyKeyHeader> companyKey, <companyTypeHeader> companyType value in header
        Given User picks company with type <companyType> in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets POST api endpoint to create demand
        But User sets <cookie> cookie of <email> and <companyKeyHeader> companyKey and <companyTypeHeader> companyType in the header
        And User sets request body with payload as itemName: "<itemName>" and dateOfSale: "<dateOfSale>" and saleOrderQty: "<saleOrderQty>" and openSaleOrderQty: "<openSaleOrderQty>" and referenceNumber: "<referenceNumber>"
        When User sends a POST method to create demand
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | TC_ID      | companyType | email                      | limitRow | cookie  | companyKeyHeader | companyTypeHeader | itemName | dateOfSale | saleOrderQty | openSaleOrderQty | referenceNumber | expectedStatus | expectedStatusText    |
            | TC_CD002_1 | CSV         | testautoforecast@gmail.com | 30       | invalid | invalid          | invalid           | random   | random     | random       | random           | random          | 401            | Unauthorized          |
            | TC_CD002_2 | CSV         | testautoforecast@gmail.com | 30       | invalid | valid            | invalid           | random   | random     | random       | random           | random          | 400            | Unauthorized          |
            | TC_CD002_3 | CSV         | testautoforecast@gmail.com | 30       | valid   | invalid          | invalid           | random   | random     | random       | random           | random          | 400            | Company not found.    |
            | TC_CD002_4 | CSV         | testautoforecast@gmail.com | 30       | valid   |                  |                   | random   | random     | random       | random           | random          | 500            | Internal Server Error |

    # TC_CD003 fail due to bug api - Bug 1821
    @TC_CD003 @TC_CD003-bug-1821
    Scenario Outline: TC_CD003 - Verify error when the open sale order qty greater the sale order qty
        Given User picks company with type CSV in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets POST api endpoint to create demand
        And User sets request body with payload as itemName: "<itemName>" and dateOfSale: "<dateOfSale>" and saleOrderQty: "<saleOrderQty>" and openSaleOrderQty: "<openSaleOrderQty>" and referenceNumber: "<referenceNumber>"
        When User sends a POST method to create demand
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | email                      | limitRow | itemName | dateOfSale | saleOrderQty | openSaleOrderQty        | referenceNumber | expectedStatus | expectedStatusText |
            | testautoforecast@gmail.com | 50       | random   | random     | random       | greaterThanSaleOrderQty | random          | 400            | Bad Request        |

    # TC_CD004 fail due to bug api - Bug 1822
    @TC_CD004 @TC_CD004-bug-1822
    Scenario Outline: TC_CD004 - Verify error when the saleOrderQty equal to 0
        Given User picks company with type CSV in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets POST api endpoint to create demand
        And User sets request body with payload as itemName: "<itemName>" and dateOfSale: "<dateOfSale>" and saleOrderQty: "<saleOrderQty>" and openSaleOrderQty: "<openSaleOrderQty>" and referenceNumber: "<referenceNumber>"
        When User sends a POST method to create demand
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | email                      | limitRow | itemName | dateOfSale | saleOrderQty | openSaleOrderQty | referenceNumber | expectedStatus | expectedStatusText |
            | testautoforecast@gmail.com | 50       | random   | random     | 0            | 0                | random          | 400            | Bad Request        |

    # TC_CD005 fail due to bug api - Bug 1823
    @TC_CD005 @TC_CD005-bug-1823
    Scenario Outline: TC_CD005 - Verify error when the "<verifiedFiled>" is float
        Given User picks company with type CSV in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets POST api endpoint to create demand
        And User sets request body with payload as itemName: "<itemName>" and dateOfSale: "<dateOfSale>" and saleOrderQty: "<saleOrderQty>" and openSaleOrderQty: "<openSaleOrderQty>" and referenceNumber: "<referenceNumber>"
        When User sends a POST method to create demand
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | TC_ID      | verifiedFiled    | email                      | limitRow | itemName | dateOfSale | saleOrderQty | openSaleOrderQty | referenceNumber | expectedStatus | expectedStatusText |
            | TC_CD005_1 | saleOrderQty     | testautoforecast@gmail.com | 50       | random   | random     | 4.5          | 1                | random          | 400            | Bad Request        |
            | TC_CD005_2 | openSaleOrderQty | testautoforecast@gmail.com | 50       | random   | random     | 4            | 1.5              | random          | 400            | Bad Request        |

    @TC_CD006
    Scenario Outline: TC_CD006 - Verify error when user input is missing one required field: "<missedField>"
        Given User picks company with type ASC in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets POST api endpoint to create demand
        And User sets request body with payload as itemName: "<itemName>" and dateOfSale: "<dateOfSale>" and saleOrderQty: "<saleOrderQty>" and openSaleOrderQty: "<openSaleOrderQty>" and referenceNumber: "<referenceNumber>"
        When User sends a POST method to create demand
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | TC_ID      | missedField      | email                      | limitRow | itemName | dateOfSale | saleOrderQty | openSaleOrderQty | referenceNumber | expectedStatus | expectedStatusText         |
            | TC_CD006_1 | itemName         | testautoforecast@gmail.com | 20       |          | random     | random       | random           | random          | 400            | Missing required property. |
            | TC_CD006_2 | dateOfSale       | testautoforecast@gmail.com | 20       | random   |            | random       | random           | random          | 400            | Missing required property. |
            | TC_CD006_3 | saleOrderQty     | testautoforecast@gmail.com | 20       | random   | random     |              | random           | random          | 400            | Missing required property. |
            | TC_CD006_4 | openSaleOrderQty | testautoforecast@gmail.com | 20       | random   | random     | random       |                  | random          | 400            | Missing required property. |

    #Bug 1824 - TC_CD007 return status code 200 when call this API for company has type QBFS and ASC.
    @TC_CD007 @TC_CD007-bug-1824
    Scenario Outline: <TC_ID> - Verify user could not call this API with company has type <companyType>
        Given User picks company with type <companyType> in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets POST api endpoint to create demand
        And User sets request body with payload as itemName: "<itemName>" and dateOfSale: "<dateOfSale>" and saleOrderQty: "<saleOrderQty>" and openSaleOrderQty: "<openSaleOrderQty>" and referenceNumber: "<referenceNumber>"
        When User sends a POST method to create demand
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | TC_ID      | companyType | email                      | limitRow | itemName | dateOfSale | saleOrderQty | openSaleOrderQty | referenceNumber | expectedStatus | expectedStatusText |
            | TC_CD007_1 | QBFS        | testautoforecast@gmail.com | 30       | random   | random     | random       | random           | random          | 400            | Bad Request        |
            | TC_CD007_2 | ASC         | testautoforecast@gmail.com | 30       | random   | random     | random       | random           | random          | 400            | Bad Request        |
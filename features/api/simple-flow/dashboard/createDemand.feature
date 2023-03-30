@test-api @api-dashboard @api-demand @api-createDemand
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
        And User sets request body with payload as itemName: "<itemName>" and dateOfSale: "<dateOfSale>" and saleOrderQTy: "<saleOrderQTy>" and openSaleOrderQTy: "<openSaleOrderQTy>" and referenceNumber: "<referenceNumber>"
        When User sends a POST method to create demand
        Then The expected status code should be <expectedStatus>
        And User checks API contract essential types in create demand object are correct
        And User checks values in response of create demand are correct

        Examples:
            | TC_ID    | companyType | email                      | limitRow | itemName | dateOfSale | saleOrderQTy | openSaleOrderQTy | referenceNumber | expectedStatus |
            | TC_CD001 | CSV         | testautoforecast@gmail.com | 50       | random   | random     | random       | random           | random          | 200            |

    #TC_CD003_1, TC_CD003_2 fail due to bug api
    @TC_CD003
    Scenario Outline: <TC_ID> - Verify error when user sends this API with <cookie> cookie, <companyKeyHeader> companyKey, <companyTypeHeader> companyType value in header
        Given User picks company with type <companyType> in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets POST api endpoint to create demand
        But User sets <cookie> cookie of <email> and <companyKeyHeader> companyKey and <companyTypeHeader> companyType in the header
        And User sets request body with payload as itemName: "<itemName>" and dateOfSale: "<dateOfSale>" and saleOrderQTy: "<saleOrderQTy>" and openSaleOrderQTy: "<openSaleOrderQTy>" and referenceNumber: "<referenceNumber>"
        When User sends a POST method to create demand
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | TC_ID      | companyType | email                      | limitRow | cookie  | companyKeyHeader | companyTypeHeader | itemName | dateOfSale | saleOrderQTy | openSaleOrderQTy | referenceNumber | expectedStatus | expectedStatusText |
            | TC_CD003_1 | CSV         | testautoforecast@gmail.com | 30       | invalid | invalid          | invalid           | random   | random     | random       | random           | random          | 401            | Unauthorized       |
            | TC_CD003_3 | CSV         | testautoforecast@gmail.com | 30       | valid   | invalid          | invalid           | random   | random     | random       | random           | random          | 400            | Company not found. |

    @TC_CD004
    Scenario Outline: TC_CD004 - Verify error when the open sale order qty greater the sale order qty
        Given User picks company with type CSV in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets POST api endpoint to create demand
        And User sets request body with payload as itemName: "<itemName>" and dateOfSale: "<dateOfSale>" and saleOrderQTy: "<saleOrderQTy>" and openSaleOrderQTy: "<openSaleOrderQTy>" and referenceNumber: "<referenceNumber>"
        When User sends a POST method to create demand
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | email                      | limitRow | itemName | dateOfSale | saleOrderQTy | openSaleOrderQTy        | referenceNumber | expectedStatus | expectedStatusText |
            | testautoforecast@gmail.com | 50       | random   | random     | random       | greaterThanSaleOrderQty | random          | 400            | todo               |

    @TC_CD008
    Scenario Outline: TC_CD008 - Verify error when user input is missing one required field: "<missedField>"
        Given User picks company with type ASC in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets POST api endpoint to create demand
        And User sets request body with payload as itemName: "<itemName>" and dateOfSale: "<dateOfSale>" and saleOrderQTy: "<saleOrderQTy>" and openSaleOrderQTy: "<openSaleOrderQTy>" and referenceNumber: "<referenceNumber>"
        When User sends a POST method to create demand
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | missedField | email                      | limitRow | itemName | dateOfSale | saleOrderQTy | openSaleOrderQTy | referenceNumber | expectedStatus | expectedStatusText         |
            | itemName    | testautoforecast@gmail.com | 20       |          | random     | random       | random           | random          | 400            | Missing required property. |
            | dateOfSale  | testautoforecast@gmail.com | 20       | random   |            | random       | random           | random          | 400            | Missing required property. |

    #Bug TC_CD009,TC_CB010 return status code 200 when call this API for company has type QBFS and QBO.
    @TC_CD009 @TC_CB010
    Scenario Outline: <TC_ID> - Verify user could not call this API with company has type <companyType>
        Given User picks company with type <companyType> in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets POST api endpoint to create demand
        And User sets request body with payload as itemName: "<itemName>" and dateOfSale: "<dateOfSale>" and saleOrderQTy: "<saleOrderQTy>" and openSaleOrderQTy: "<openSaleOrderQTy>" and referenceNumber: "<referenceNumber>"
        When User sends a POST method to create demand
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | TC_ID    | companyType | email                      | limitRow | parentName | parentKey | childName | childKey | qty    | expectedStatus | expectedStatusText |
            | TC_CD009 | QBFS        | testautoforecast@gmail.com | 30       | random     | random    | random    | random   | random | 400            | Bad Request        |
            | TC_CB010 | ASC         | testautoforecast@gmail.com | 30       | random     | random    | random    | random   | random | 400            | Bad Request        |            
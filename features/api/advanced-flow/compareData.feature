@test-api-extra @regression-api @api-amazon 
Feature: API_Testing Compare data on ForecastRx and Amazon in Demand section
    Background: Send POST /login request to login before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get company keys
        And In Header of the request, she sets param Cookie as valid connect.sid
        And User sends a GET request to get company keys

    Scenario Outline: <TC_ID> - User can compare data on ForecastRx and Amazon in Demand section
        Given User picks company with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        And User sets GET api endpoint to get demands with itemName: <itemName>
        And User sends a GET request to get specific demand of item
        And User sends a POST method to create report on Amazon
        And User sends a GET method to get report by reportID
        And User sends a GET method to get report document by reportDocumentID

        Examples:
            | TC_ID       | companyType | email                      | itemName            |
            | TC_CDD001_1 | ASC         | testautoforecast@gmail.com | WS-01-NG1-081-PNK-L |
            # | TC_CDD001_2 | ASC         | testautoforecast@gmail.com | WC-01-TP1-008-DGY-M |

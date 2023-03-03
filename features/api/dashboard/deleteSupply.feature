# TO DO AFTER COMPLETING CREATE SUPPLY
@test-api @api-dashboard @api-supply @api-deleteSupply
Feature: API_SUPPLY DELETE /api/supply
    Background: Send GET request to get supply of random company
    Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111! |
    And User sets GET api endpoint to get company keys
    And In Header of the request, she sets param Cookie as valid connect.sid
    When User sends a GET request to get company keys
    Then User picks random company in above response
    And User sets GET api endpoint to get information of a company belongs to testautoforecast@gmail.com using company key random
    And User sets GET api endpoint to get supply keys
    When User sends a GET request to get supply information of testautoforecast@gmail.com by company key and company type
    Then user checks Auto supply exist in the system, if it does not exist will create new supply

    @TC_DS001
    Scenario Outline: TC_DS001 - Verify <user> could call this API to delete supply of a company belongs to her
        Given User filters <numberOfSuppliers> suppliers which has the name includes <supplierNameKeyword>
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        When User sends a DELETE method to delete supplier
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks the total suppliers is correct

        Examples:
            | numberOfSuppliers | supplierNameKeyword | expectedStatus | expectedStatusText | email                      |
            | 3                 | Auto                | 200            | OK                 | testautoforecast@gmail.com |

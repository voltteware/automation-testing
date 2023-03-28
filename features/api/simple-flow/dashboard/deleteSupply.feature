
@test-api @api-dashboard @api-supply @api-deleteSupply
Feature: API_SUPPLY DELETE /api/supply
    Background: Send GET request to get supply of random company
    Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
    And User sets GET api endpoint to get company keys
    And In Header of the request, she sets param Cookie as valid connect.sid
    When User sends a GET request to get company keys
    
    @TC_DSL001
    Scenario Outline: <TC_ID> - Verify <user> could call this API to delete supply of a company has type <companyType> belongs to her
        Given User picks company with type <companyType> in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: 5
        And User sends a GET request to get list items
        And User sets GET api endpoint to get supplies with limit row: 5
        And User sends a GET request to get list supplies
        And User checks Auto supply exist in the system, if it does not exist will create new supply
        And User sends a GET request to get total of supplies
        And User filters <numberOfSupplies> supplies which has the refNum includes <supplyRefnumKeyword>
        When User sends a DELETE method to delete supply
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks the total supplies is correct

        Examples:
            | TC_ID     | companyType | numberOfSupplies | supplyRefnumKeyword  | expectedStatus | expectedStatusText | email                      |
            | TC_DSL001 | CSV         | 1                | Auto                 | 200            | OK                 | testautoforecast@gmail.com |
            | TC_DSL002 | ASC         | 1                | Auto                 | 200            | OK                 | testautoforecast@gmail.com |

    #Bug API in case TC_DSL003_1, TC_DSL003_2
    @TC_DSL003 @bug-permission
    Scenario Outline: <TC_ID> - Verify error when user sends this API with <cookie> cookie and <companyKeyHeader> companyKeyHeader and <companyTypeHeader> companyTypeHeader
        Given User picks company with type CSV in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: 5
        And User sends a GET request to get list items
        And User sets GET api endpoint to get supplies with limit row: 5
        And User sends a GET request to get list supplies
        And User checks Auto supply exist in the system, if it does not exist will create new supply
        And User filters <numberOfSupplies> supplies which has the refNum includes <supplyRefnumKeyword>
        But User sets <cookie> cookie of <email> and <companyKeyHeader> companyKey and <companyTypeHeader> companyType in the header
        When User sends a DELETE method to delete supply
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | TC_ID       | email                      | numberOfSupplies  | supplyRefnumKeyword | cookie  | companyKeyHeader | companyTypeHeader | expectedStatus | expectedStatusText    |
            | TC_DSL003_1 | testautoforecast@gmail.com | 1                 | Auto                | invalid | invalid          | invalid           | 401            | Unauthorized          |
            | TC_DSL003_2 | testautoforecast@gmail.com | 1                 | Auto                | invalid | valid            | valid             | 401            | Unauthorized          |
            | TC_DSL003_3 | testautoforecast@gmail.com | 1                 | Auto                | valid   | invalid          | invalid           | 400            | Company not found.    |
            | TC_DSL003_4 | testautoforecast@gmail.com | 1                 | Auto                | valid   |                  |                   | 500            | Internal Server Error |

    @TC_DSL004
    Scenario Outline: TC_DSL004 - Verify <userA> can't call this API to delete supply not belongs to her company
        Given User picks company with type CSV in above response
        But User sets valid cookie of <userB> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: 5
        And User sends a GET request to get list items
        And User sets GET api endpoint to get supplies with limit row: 5
        And User sends a GET request to get list supplies
        And User checks Auto supply exist in the system, if it does not exist will create new supply
        And User filters <numberOfSupplies> supplies which has the refNum includes <supplyRefnumKeyword>
        And User has valid connect.sid of "<userA>" after send a POST request with payload as email: "<userA>" and password: "<password>"
        And User sets valid cookie of "<userA>" and valid companyKey and valid companyType in the header
        When User sends a DELETE method to delete supply
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | numberOfSupplies  | supplyRefnumKeyword | userA               | userB                      | password  | expectedStatus | expectedStatusText |
            | 1                 | Auto                | may27user@gmail.com | testautoforecast@gmail.com | Test1111# | 400            | Company not found. |
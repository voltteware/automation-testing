@test-api @api-dashboard @api-bom @api-deleteBom
Feature: API_Dashboard DELETE /api/bom
    Background: Send GET /realm request to get all company keys of current logged in user before each test
    Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
    And User sets GET api endpoint to get company keys
    And In Header of the request, she sets param Cookie as valid connect.sid
    When User sends a GET request to get company keys
    
    @TC_DB001 @TC_DB002
    Scenario Outline: <TC_ID> - Verify <user> could call this API to delete only child bom of a company has type <companyType> belongs to her
        Given User picks company with type <companyType> in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: 20
        And User sends a GET request to get list items
        And User sets GET api endpoint to get bom keys
        And User sends a GET request to get all boms
        And User checks Auto bom exist in the system, if it does not exist will create new bom
        And User sends a GET request to get total of boms
        And User filters <numberOfBoms> boms which has the parentName includes <bomParentNameKeyword>
        When User sends a DELETE method to delete bom child
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks the total boms is correct

        Examples:
            | TC_ID    | companyType | numberOfBoms | bomParentNameKeyword | expectedStatus | expectedStatusText | email                      |
            | TC_DB001 | CSV         | 2            | Auto                 | 200            | OK                 | testautoforecast@gmail.com |
            | TC_DB002 | ASC         | 2            | Auto                 | 200            | OK                 | testautoforecast@gmail.com |

    #Bug API in case TC_DB003_1, TC_DB003_2
    @TC_DB003 @bug-permission
    Scenario Outline: <TC_ID> - Verify error when user sends this API with <cookie> cookie and <companyKeyHeader> companyKeyHeader and <companyTypeHeader> companyTypeHeader
        Given User picks company with type CSV in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: 10
        And User sends a GET request to get list items
        And User sets GET api endpoint to get bom keys
        And User sends a GET request to get all boms
        And User checks Auto bom exist in the system, if it does not exist will create new bom
        And User sends a GET request to get total of boms
        And User filters <numberOfBoms> boms which has the parentName includes <bomParentNameKeyword>
        But User sets <cookie> cookie of <email> and <companyKeyHeader> companyKey and <companyTypeHeader> companyType in the header
        When User sends a DELETE method to delete bom child
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | TC_ID      | email                      | numberOfBoms  | bomParentNameKeyword | cookie  | companyKeyHeader | companyTypeHeader | expectedStatus | expectedStatusText    |
            | TC_DB003_1 | testautoforecast@gmail.com | 1             | Auto                 | invalid | invalid          | invalid           | 401            | Unauthorized          |
            | TC_DB003_2 | testautoforecast@gmail.com | 1             | Auto                 | invalid | valid            | valid             | 401            | Unauthorized          |
            | TC_DB003_3 | testautoforecast@gmail.com | 1             | Auto                 | valid   | invalid          | invalid           | 400            | Company not found.    |
            | TC_DB003_4 | testautoforecast@gmail.com | 1             | Auto                 | valid   |                  |                   | 500            | Internal Server Error |
    
    @TC_DB004
    Scenario Outline: TC_DB004 - Verify <userA> can't call this API to delete bom not belongs to her company
        Given User picks company with type CSV in above response
        But User sets valid cookie of <userB> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: 10
        And User sends a GET request to get list items
        And User sets GET api endpoint to get bom keys
        And User sends a GET request to get all boms
        And User checks Auto bom exist in the system, if it does not exist will create new bom
        And User sends a GET request to get total of boms
        And User filters <numberOfBoms> boms which has the parentName includes <bomParentNameKeyword>
        And User has valid connect.sid of "<userA>" after send a POST request with payload as email: "<userA>" and password: "<password>"
        And User sets valid cookie of "<userA>" and valid companyKey and valid companyType in the header
        When User sends a DELETE method to delete bom child
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | numberOfBoms | bomParentNameKeyword | userA               | userB                      | password  | expectedStatus | expectedStatusText |
            | 1            | Auto                 | may27user@gmail.com | testautoforecast@gmail.com | Test1111# | 400            | Company not found. |

    # TC_DB005, TC_DB006: Fail due to Bug_ID 1870 - Get status 400 Unable to delete some or all the requested items. 
    @TC_DB005 @TC_DB006 @bug1870 
        Scenario Outline: <TC_ID> - Verify <user> could call this API to delete bom and his child of a company has type <companyType> belongs to her
        Given User picks company with type <companyType> in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: 20
        And User sends a GET request to get list items
        And User sets GET api endpoint to get bom keys
        And User sends a GET request to get all boms
        And User checks Auto bom exist in the system, if it does not exist will create new bom
        And User sends a GET request to get total of boms
        And User filters <numberOfBoms> boms which has the parentName includes <bomParentNameKeyword>
        When User sends a DELETE method to delete bom and his child
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User check that the deleted BOM and its child are not included in the current BOM list

        Examples:
            | TC_ID    | companyType | numberOfBoms | bomParentNameKeyword | expectedStatus | expectedStatusText | email                      |
            | TC_DB005 | CSV         | 1            | Auto                 | 200            | OK                 | testautoforecast@gmail.com |
            | TC_DB006 | ASC         | 1            | Auto                 | 200            | OK                 | testautoforecast@gmail.com |
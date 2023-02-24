@test-api @api-dashboard @api-supplier @api-deleteSupplier
Feature: API_SUPPLIER DELETE /api/vendor
    Background: Send GET request to get suppliers of random company
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111! |
        And User sets GET api endpoint to get company keys
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get company keys
        And User picks random company in above response
        And User sets GET api endpoint to get information of a company belongs to testautoforecast@gmail.com using company key random
        And User sets valid cookie of testautoforecast@gmail.com and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers keys
        And User sends a GET request to get suppliers information of testautoforecast@gmail.com by company key and company type
        And user checks Auto supplier exist in the system, if it does not exist will create new supplier
        And User sends a GET request to get total of suppliers

    @TC_DS001
    Scenario Outline: TC_DS001 - Verify <user> could call this API to delete suppliers of a company belongs to her
        Given User filters <numberOfSuppliers> suppliers which has the name includes <supplierNameKeyword>
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        When User sends a DELETE method to delete supplier
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks the total suppliers is correct

        Examples:
            | numberOfSuppliers | supplierNameKeyword | expectedStatus | expectedStatusText | email                      |
            | 3                 | Auto                | 200            | OK                 | testautoforecast@gmail.com |

    #Bug API in case TC_DS002_1, TC_DS002_2
    @TC_DS002 @bug-permission
    Scenario Outline: TC_DS002 - Verify error when user sends this API with <cookie> cookie and <companyKeyHeader> companyKeyHeader and <companyTypeHeader> companyTypeHeader
        Given User filters <numberOfSuppliers> suppliers which has the name includes <supplierNameKeyword>
        But she sets <cookie> cookie of <email> and <companyKeyHeader> companyKey and <companyTypeHeader> companyType in the header
        When User sends a DELETE method to delete supplier
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | TC_ID      | email                      | numberOfSuppliers | supplierNameKeyword | cookie  | companyKeyHeader | companyTypeHeader | expectedStatus | expectedStatusText    |
            | TC_DS002_1 | testautoforecast@gmail.com | 1                 | Auto                | invalid | invalid          | invalid           | 401            | Unauthorized          |
            | TC_DS002_2 | testautoforecast@gmail.com | 1                 | Auto                | invalid | valid            | valid             | 401            | Unauthorized          |
            | TC_DS002_3 | testautoforecast@gmail.com | 1                 | Auto                | valid   | invalid          | invalid           | 400            | Company not found.    |
            | TC_DS002_4 | testautoforecast@gmail.com | 1                 | Auto                | valid   |                  |                   | 500            | Internal Server Error |

    #Bug API in case DS003
    @TC_DS003 @bug-permission
    Scenario Outline: TC_DS003 - Verify <userA> can't call this API to delete supplier not belongs to her company
        Given User filters <numberOfSuppliers> suppliers which has the name includes <supplierNameKeyword>
        Then User has valid connect.sid of "<userA>" after send a POST request with payload as email: "<userA>" and password: "<password>"
        And User sets valid cookie of "<userA>" and valid companyKey and valid companyType in the header
        When User sends a DELETE method to delete supplier
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | numberOfSuppliers | supplierNameKeyword | user | userA               | password  | expectedStatus | expectedStatusText |
            | 1                 | Auto                | user | may27user@gmail.com | Test1111! | 400            | Company not found. |



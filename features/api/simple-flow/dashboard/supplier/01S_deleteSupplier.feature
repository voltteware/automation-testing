@test-api @api-dashboard @api-supplier @api-deleteSupplier
Feature: API_SUPPLIER DELETE /api/vendor
    Background: Send GET request to get suppliers of random company
        Given user sends a POST login request to get valid cookie with role
            | role  | username                     | password  |
            | admin | testdeletesupplier@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies
        Then User picks random company which has onboarded in above response
        And User sets GET api endpoint to get information of a company belongs to testdeletesupplier@gmail.com using company key random
        And User sets valid cookie of testdeletesupplier@gmail.com and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers keys
        When User sends a GET request to get list suppliers
        Then user checks Auto supplier exist in the system, if it does not exist will create new supplier
        When User sends a GET request to get total of suppliers

    @TC_DV001
    Scenario Outline: TC_DV001 - Verify <user> could call this API to delete suppliers of a company belongs to her
        Given User filters <numberOfSuppliers> suppliers which has the name includes <supplierNameKeyword>
        And User checks there is at least 1 supplier found
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        When User sends a DELETE method to delete supplier
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User filters <numberOfSuppliers> suppliers which has the name includes <supplierNameKeyword>
        # And User checks the total suppliers is correct
        And User search the deleted suppliers and checks that there is no supplier found

        Examples:
            | numberOfSuppliers | supplierNameKeyword | expectedStatus | expectedStatusText | email                        |
            | 3                 | Auto                | 200            | OK                 | testdeletesupplier@gmail.com |

    #Bug API in case TC_DV002_1, TC_DV002_2
    @TC_DV002 @bug-permission @low-bug-skip
    Scenario Outline: <TC_ID> - Verify error when user sends this API with <cookie> cookie and <companyKeyHeader> companyKeyHeader and <companyTypeHeader> companyTypeHeader
        Given User filters <numberOfSuppliers> suppliers which has the name includes <supplierNameKeyword>
        But she sets <cookie> cookie of <email> and <companyKeyHeader> companyKey and <companyTypeHeader> companyType in the header
        When User sends a DELETE method to delete supplier
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | TC_ID      | email                        | numberOfSuppliers | supplierNameKeyword | cookie  | companyKeyHeader | companyTypeHeader | expectedStatus | expectedStatusText    |
            | TC_DV002_1 | testdeletesupplier@gmail.com | 1                 | Auto                | invalid | invalid          | invalid           | 401            | Unauthorized          |
            | TC_DV002_2 | testdeletesupplier@gmail.com | 1                 | Auto                | invalid | valid            | valid             | 401            | Unauthorized          |
            | TC_DV002_3 | testdeletesupplier@gmail.com | 1                 | Auto                | valid   | invalid          | invalid           | 400            | Company not found.    |
            | TC_DV002_4 | testdeletesupplier@gmail.com | 1                 | Auto                | valid   |                  |                   | 500            | Internal Server Error |

    @TC_DV003
    Scenario Outline: TC_DV003 - Verify <userA> can't call this API to delete supplier not belongs to her company
        Given User filters <numberOfSuppliers> suppliers which has the name includes <supplierNameKeyword>
        And User has valid connect.sid of "<userA>" after send a POST request with payload as email: "<userA>" and password: "<password>"
        And User sets valid cookie of "<userA>" and valid companyKey and valid companyType in the header
        When User sends a DELETE method to delete supplier
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | numberOfSuppliers | supplierNameKeyword | user | userA               | password  | expectedStatus | expectedStatusText |
            | 1                 | Auto                | user | may27user@gmail.com | Test1111# | 400            | Company not found. |
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
            | numberOfSuppliers | supplierNameKeyword | expectedStatus | expectedStatusText |
            | 5                 | auto                | 200            | OK                 |

    #Bug API in case DS002
    @TC_DS002 @bug-permission
    Scenario Outline: TC_DS002 - Verify error when user sends this API with <cookie> cookie

        # Given User filters user to get user which he has the email
        Given User filters user to get user which has the email as <emailWantToDelete>
        Then User sets DELETE api endpoint to delete user keys
        But User sets Cookie in HEADER as <cookie>
        When User sends a DELETE method to delete user <emailWantToDelete>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | emailWantToDelete   | cookie  | expectedStatus | expectedStatusText |
            | may27user@gmail.com | empty   | 401            | Unauthorized       |
            | may27user@gmail.com | invalid | 401            | Unauthorized       |

    #Bug API in case DS003
    @TC_DS003 @bug-permission
    Scenario Outline: TC_DS003 - Verify <user> can't call this API to delete user
        # Given User filters user to get user which he has the email
        Given User filters user to get user which has the email as <emailWantToDelete>
        Then User has valid connect.sid of "<userA>" after send a POST request with payload as email: "<userA>" and password: "<password>"
        And User sets DELETE api endpoint to delete user keys
        And In Header of the request, user sets param Cookie as valid connect.sid
        When User sends a DELETE method to delete user <emailWantToDelete>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | emailWantToDelete   | user | userA               | password  | expectedStatus | expectedStatusText |
            | may27user@gmail.com | user | may27user@gmail.com | Test1111! | 401            | Unauthorized       |



@test-api @api-realm @api-dashboard
Feature: API_User GET/realm
    @REALM001
    Scenario Outline: TC_REALM001 - Verify <email> could call this API to get company of him/her
        Given Nancy has valid connect.sid of "<user>" after send a POST request with payload as email: "<email>" and password: "<password>"
        And She sets GET api endpoint to get company keys
        And In Header of the request, she sets param Cookie as valid connect.sid
        When She sends a GET request to get company keys
        Then The expected status code should be <expectedStatus>
        And She picks random company from response of get company keys API
        And She checks API contract types in random company object are correct
        And She checks <email> and other values in response of random company are correct
        Examples:
            | user  | email              | password  | expectedStatus |
            | admin | may27pre@gmail.com | Test1111# | 200            |

    @REALM002
    Scenario Outline: TC_REALM002 - Verify error when user sends this API with <cookie> cookie
        Given Nancy sets GET api endpoint to get company keys
        But she sets Cookie in HEADER as <cookie>
        When She sends a GET request to get company keys
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | cookie  | expectedStatus | expectedStatusText |
            | invalid | 401            | Unauthorized       |

    @REALM003
    Scenario Outline: TC_REALM003 - Verify error when user sends this API without cookie
        Given Nancy sets GET api endpoint to get company keys
        But she doesn't set Cookie, Company Type and Company Key in HEADER
        When She sends a GET request to get company keys
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | expectedStatus | expectedStatusText |
            | 401            | Unauthorized       |
@test-api @api-user @api-realm
Feature: API_User GET/realm

    @REALM001
    Scenario Outline: TC_REALM001 - Verify <email> could call this API to get information of his/her companies
        Given Nancy has valid connect.sid of "<user>" after send a POST request with payload as email: "<email>" and password: "<password>"
        And She sets GET api endpoint to get company keys
        And In Header of the request, she sets param Cookie as valid connect.sid
        When She sends a GET request to get company keys
        Then The expected status code should be <expectedStatus>
        And She picks random company in above response
        And She checks data type of values in random company object are correct
        And She checks <email> and other values in response of random company are correct
        Examples:
            | user  | email              | password  | expectedStatus |
            | admin | may27pre@gmail.com | Test1111! | 200            |

    @REALM002
    Scenario Outline: TC_REALM002 - Verify error when user sends this API with <cookie> cookie
        Given Nancy sets GET api endpoint to get company keys
        But she sets Cookie in HEADER as <cookie>
        When She sends a GET request to get company keys
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | cookie  | expectedStatus | expectedStatusText |
            | empty   | 401            | Unauthorized       |
            | invalid | 401            | Unauthorized       |













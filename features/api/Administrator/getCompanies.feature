@test-api @api-admin @api-getCompanies
Feature: API_Admin GET/Companies

    @COMPANIES001
    Scenario Outline: COMPANIES001 - Verify <email> could call this API to get all companies
        Given User has valid connect.sid of "<user>" after send a POST request with payload as email: "<email>" and password: "<password>"
        And User sets GET api endpoint to get companies keys
        And In Header of the request, user sets param Cookie as valid connect.sid
        When User sends a GET request to get companies keys
        Then The expected status code should be <expectedStatus>
        And User picks random companies in above response
        And User checks data type of values in random companies object are correct
        And User checks <email> and other values in response of random companies are correct
        Examples:
            | user  | email              | password  | expectedStatus |
            | admin | may27pre@gmail.com | Test1111! | 200            |

    # @COMPANIES002 (Bug API)
    # Scenario Outline: COMPANIES002 - Verify <email> can't call this API to get all companies
    #     Given User has valid connect.sid of "<user>" after send a POST request with payload as email: "<email>" and password: "<password>"
    #     And User sets GET api endpoint to get companies keys
    #     And In Header of the request, user sets param Cookie as valid connect.sid
    #     When User sends a GET request to get companies keys
    #     Then The expected status code should be <expectedStatus>
    #     And The status text is "<expectedStatusText>"
    #     Examples:
    #         | user  | email               | password  | expectedStatus | expectedStatusText |
    #         | user  | may27user@gmail.com | Test1111! | 401            | Unauthorized       |

    # @COMPANIES003 (Bug API)
    # Scenario Outline: COMPANIES003 - Verify error when user sends this API with <cookie> cookie
    #     Given User sets GET api endpoint to get companies keys
    #     But User sets Cookie in HEADER as <cookie>
    #     When User sends a GET request to get companies keys
    #     Then The expected status code should be <expectedStatus>
    #     And The status text is "<expectedStatusText>"
    #     Examples:
    #         | cookie  | expectedStatus | expectedStatusText |
    #         | empty   | 401            | Unauthorized       |
    #         | invalid | 401            | Unauthorized       |













@test-api @api-dashboard @api-createGridView
Feature: API_Dashboard POST /api/grid-view
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get company keys
    
    @TC_CGV001 @bug1872
    Scenario Outline: TC_CGV001 - Verify user <email> could call this API to create grid view for <itemType> with sort a column <field>
        Given User picks random company which has onboarded in above response
        And User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        And User sets POST api endpoint to create grid view keys
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets request body with payload as name: "<nameOfGridView>" and itemType: "<itemType>" and dir: "<dir>" and field: "<field>"
        When User sends a POST method to create gridview
        Then The expected status code should be <expectedStatus>
        And User checks API contract essential types in grid view object are correct
        And User checks values in response of create grid view are correct
        And User sets DELETE api endpoint to delete gridview by key
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sends a DELETE method to delete grid view with key <key>
		And The expected status code should be 204
        Examples:
            | email                      | nameOfGridView | itemType | dir | field | companyKey | key    | expectedStatus |
            | testautoforecast@gmail.com | random         | supplier | asc | name  | random     | random | 200            |
    
    @TC_CGV002 @bug1872
    Scenario Outline: TC_CGV002 - Verify user <email> could call this API to create grid view for <itemType> with filter <field>
        Given User picks random company which has onboarded in above response
        And User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        And User sets POST api endpoint to create grid view keys
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets request body with payload as name: "<nameOfGridView>" and itemType: "<itemType>" and field: "<field>" and operator: "<operator>" and logic: "<logic>" and value: <value>
        When User sends a POST method to create gridview
        Then The expected status code should be <expectedStatus>
        And User checks API contract essential types in grid view object are correct
        And User checks values in response of create grid view are correct
        And User sets DELETE api endpoint to delete gridview by key
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sends a DELETE method to delete grid view with key <key>
		And The expected status code should be 204
        Examples:
            | email                      | nameOfGridView | itemType | operator | field        | value  | logic  | companyKey | key    | expectedStatus |
            | testautoforecast@gmail.com | random         | supplier | eq       | serviceLevel | 15     | and    | random     | random | 200            |

    @TC_CGV003
    Scenario Outline: TC_CGV003 - Verify error when user sends this API with <cookie> cookie, <companyKeyHeader> companyKey, <companyTypeHeader> companyType value in header
        Given User picks random company which has onboarded in above response
        And User sets POST api endpoint to create grid view keys
        And User sets <cookie> cookie of <email> and <companyKeyHeader> companyKey and <companyTypeHeader> companyType in the header
        And User sets request body with payload as name: "<nameOfGridView>" and itemType: "<itemType>" and dir: "<dir>" and field: "<field>"
        When User sends a POST method to create gridview
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | email                      | nameOfGridView | itemType | dir | field | cookie  | companyKeyHeader | companyTypeHeader | companyKey | expectedStatus | expectedStatusText    |
            | testautoforecast@gmail.com | random         | supplier | asc | name  | valid   | invalid          | invalid           | random     | 400            | Company not found.    |

    @TC_CGV004
    Scenario Outline: TC_CGV004 - Verify error when user <email> sends this API with view <name> already exists
        Given User picks random company which has onboarded in above response
        And User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        And User sets POST api endpoint to create grid view keys
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets request body with payload as name: "<nameOfGridView>" and itemType: "<itemType>" and dir: "<dir>" and field: "<field>"
        When User sends a POST method to create gridview
        When User sends a POST method to create gridview
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | email                      | nameOfGridView | itemType | dir | field | companyKey | expectedStatus | expectedStatusText                          |
            | testautoforecast@gmail.com | random         | supplier | asc | name  | random     | 400            | Grid view with the same name already exists |
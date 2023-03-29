@test-api-extra @api-dashboard @api-bom @api-edit-some-value-on-grid
Feature: API_Dashboard PUT /api/bom
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get company keys
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get company keys

    # Notes: Only kits of company type CSV and ASC can edit

    # FAILED: TC_UB001_1, TC_UB001_2, TC_UB001_3, TC_UB001_4, TC_UB001_5, TC_UB001_6
    # Error: status code 400 Inserting would create a multi-level Kit. 
    @TC_UB001
    Scenario Outline: <TC_ID> - Verify user <email> could call this API to update "<editColumn>" of a kit for company type (<companyType>)
        Given User picks company with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: 10
        And User sends a GET request to get list items
        And User sets GET api endpoint to get boms with limit row: 100
        And User sends a GET request to get list limited boms
        And User picks a random bom in above list boms
        And User saves the parentKey key and childKey key
        And User sets PUT api endpoint to edit <editColumn> of the above bom for company type <companyType> with new value: <value>
        When User sends a PUT request to edit the bom
        Then The expected status code should be <expectedStatus>
        And The new <editColumn> of bom must be updated successfully

        Examples:
            | TC_ID      | companyType | email                      | limitRow | editColumn | value  | expectedStatus |
            | TC_UB001_1 | ASC         | testautoforecast@gmail.com | 10       | parentName | random | 200            |

    @TC_UB001 @regression-api
    Scenario Outline: <TC_ID> - Verify user <email> could call this API to update "<editColumn>" of a kit for company type (<companyType>)
        Given User picks company with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: 10
        And User sends a GET request to get list items
        And User sets GET api endpoint to get boms with limit row: 100
        And User sends a GET request to get list limited boms
        And User picks a random bom in above list boms
        And User saves the parentKey key and childKey key
        And User sets PUT api endpoint to edit <editColumn> of the above bom for company type <companyType> with new value: <value>
        When User sends a PUT request to edit the bom
        Then The expected status code should be <expectedStatus>
        And The new <editColumn> of bom must be updated successfully

        Examples:
            | TC_ID      | companyType | email                      | limitRow | editColumn    | value  | expectedStatus |
            | TC_UB001_2 | ASC         | testautoforecast@gmail.com | 10       | componentName | random | 200            |
            | TC_UB001_3 | ASC         | testautoforecast@gmail.com | 10       | kitQty        | random | 200            |
            | TC_UB001_4 | CSV         | testautoforecast@gmail.com | 10       | parentName    | random | 200            |
            | TC_UB001_5 | CSV         | testautoforecast@gmail.com | 10       | componentName | random | 200            |
            | TC_UB001_6 | CSV         | testautoforecast@gmail.com | 10       | kitQty        | random | 200            |


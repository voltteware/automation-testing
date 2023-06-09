@test-api @api-dashboard @api-bom @api-edit-some-value-on-grid
Feature: API_Dashboard PUT /api/bom
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username             | password  |
            | admin | testgetbom@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies

    # Notes: Only kits of company type CSV and ASC can edit
    @TC_UB001 @smoke-test-api
    Scenario Outline: <TC_ID> - Verify user <email> could call this API to update "<editColumn>" of a kit for company type (<companyType>)
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets GET api endpoint to get boms with limit row: <limitRow>
        And User sends a GET request to get list limited boms
        And User picks a random bom in above list boms
        And User saves the parentKey key and childKey key
        And User sets PUT api endpoint to edit <editColumn> of the above bom for company type <companyType> with new value: <value>
        When User sends a PUT request to edit the bom
        Then The expected status code should be <expectedStatus>
        And The new <editColumn> of bom must be updated successfully

        Examples:
            | TC_ID      | companyType | email                | limitRow | editColumn | value  | expectedStatus |
            | TC_UB001_1 | ASC         | testgetbom@gmail.com | 100      | parentName | random | 200            |
            | TC_UB001_6 | CSV         | testgetbom@gmail.com | 100      | kitQty     | random | 200            |

    @TC_UB001 @regression-api
    Scenario Outline: <TC_ID> - Verify user <email> could call this API to update "<editColumn>" of a kit for company type (<companyType>)
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets GET api endpoint to get bom keys
        And User sends a GET request to get all boms
        And User picks a random bom in above list boms
        And User saves the parentKey key and childKey key
        And User sets PUT api endpoint to edit <editColumn> of the above bom for company type <companyType> with new value: <value>
        When User sends a PUT request to edit the bom
        Then The expected status code should be <expectedStatus>
        And The new <editColumn> of bom must be updated successfully

        Examples:
            | TC_ID      | companyType | email                | limitRow | editColumn    | value  | expectedStatus |
            | TC_UB001_2 | ASC         | testgetbom@gmail.com | 100      | componentName | random | 200            |
            | TC_UB001_3 | ASC         | testgetbom@gmail.com | 100      | kitQty        | random | 200            |
            | TC_UB001_4 | CSV         | testgetbom@gmail.com | 100      | parentName    | random | 200            |
            | TC_UB001_5 | CSV         | testgetbom@gmail.com | 100      | componentName | random | 200            |
@test-api @api-dashboard @api-demand @api-edit-some-value-on-grid
Feature: API_Dashboard PUT /api/demand/manual
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies

    # Notes: Only demand of company type CSV can edit
    # TODO: Call create demand api before edit demand

    @TC_UD001
    Scenario Outline: <TC_ID> - Verify user <email> could call this API to update "<editColumn>" of a demand for company type (<companyType>)
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets GET api endpoint to get demands with limit row: <limitRow>
        When User sends a GET request to get list demands
        And User picks a random demand in above list demands
        And User saves the demand key and order key
        And User sets PUT api endpoint to edit <editColumn> of the above demand for company type <companyType> with new value: <value>
        When User sends a PUT request to edit the demand
        Then The expected status code should be <expectedStatus>
        And The new <editColumn> of demand must be updated successfully
        And User checks values in response of random demand are correct

        Examples:
            | TC_ID      | companyType | email                      | limitRow | editColumn | value  | expectedStatus |
            | TC_UD001_1 | CSV         | testautoforecast@gmail.com | 10       | itemName   | random | 200            |

    @TC_UD001 @regression-api
    Scenario Outline: <TC_ID> - Verify user <email> could call this API to update "<editColumn>" of a demand for company type (<companyType>)
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets GET api endpoint to get demands with limit row: <limitRow>
        When User sends a GET request to get list demands
        And User picks a random demand in above list demands
        And User saves the demand key and order key
        And User sets PUT api endpoint to edit <editColumn> of the above demand for company type <companyType> with new value: <value>
        When User sends a PUT request to edit the demand
        Then The expected status code should be <expectedStatus>
        And The new <editColumn> of demand must be updated successfully
        And User checks values in response of random demand are correct

        Examples:
            | TC_ID      | companyType | email                      | limitRow | editColumn        | value  | expectedStatus |
            | TC_UD001_2 | CSV         | testautoforecast@gmail.com | 10       | dateOfSale        | random | 200            |
            | TC_UD001_3 | CSV         | testautoforecast@gmail.com | 10       | salesOrderQty     | random | 200            |
            | TC_UD001_4 | CSV         | testautoforecast@gmail.com | 10       | openSalesOrderQty | random | 200            |
            | TC_UD001_5 | CSV         | testautoforecast@gmail.com | 10       | referenceNumber   | random | 200            |
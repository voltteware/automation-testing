@test-api @api-dashboard @api-items @api-purchaseAs @regression-api
Feature: API_Dashboard Set and Check Purchase As PUT /api/item

    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        And User sends a GET request to get companies

    @TC_PA001
    #Calculate failed due to calculation bug => Ticket 1925
    Scenario Outline: <TC_ID> - Verify user <email> could call APIs to assign Purchase As and check formula - bugId: 1925
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get items that have purchase as
        And User sends a GET request to get list items
        And User saves list items that have already set as purchas as of orther items
        And User sets GET api endpoint to get items that have not purchase as
        And User sends a GET request to get list items
        And User picks a random item in above list items
        And User saves the item key
        And User sets PUT api endpoint to edit <editColumn> of the above item for company type <companyType> with new value: <value>
        And User sends a PUT request to edit the item
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And The new <editColumn> of item must be updated successfully
        And User checks API contract essential types in item object are correct
        # This is information of Item which is disappeared in Purchasing
        And User sets api endpoint to get a item in Custom
        And User sends a GET request to get a item in Custom
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User saves needed information to calculate normal item
        And User checks value in Item card
        # This is information of Item which is appeared in Purchasing Custom
        And User sets api endpoint to get a Purchase As item in Custom
        And User sends a GET request to get a Purchase As item in Custom
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User saves needed information to calculate purchase as item
        # Get Company info before run forecast
        And User sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Run Forecast
        And User sets POST api to run forecast
        And User sends a POST request to run forecast
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract of run forecast api
        And User checks that the lastForecastDate field was updated and jobInitiator is null in company detail information after running forecast
        # This is information of Item which is appeared in Purchasing Custom after run forecast
        And User sets api endpoint to get a Purchase As item in Custom
        And User sends a GET request to get a Purchase As item in Custom
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Save value after run forecast
        And User saves needed information to calculate actual purchase as item
        And User calculates Purchase As item
        And User checks value in Item card
        
    Examples: 
        | TC_ID       | companyType | email                      | editColumn | value   | expectedStatus | expectedStatusText |
        | TC_PA001_01 | ASC         | testautoforecast@gmail.com | purchaseAs | dynamic |            200 | OK                 |
        | TC_PA001_02 | CSV         | testautoforecast@gmail.com | purchaseAs | dynamic |            200 | OK                 |
        | TC_PA001_03 | QBFS        | testautoforecast@gmail.com | purchaseAs | random  |            200 | OK                 |

    @TC_PA002a
    Scenario Outline: <TC_ID> - Verify user <email> checks Purchase As validation
        # Item cannot assign Purchase As for itself
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User picks a random item in above list items
        And User saves the item key
        And User sets PUT api endpoint to edit <editColumn> of the above item for company type <companyType> with new value: <value>
        When User sends a PUT request to edit the item
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract essential types in item object are correct

    Examples: 
        | TC_ID        | companyType | email                      | limitRow | editColumn | value  | expectedStatus | expectedStatusText                                    |
        | TC_PA002a_01 | ASC         | testautoforecast@gmail.com |       10 | purchaseAs | itself |            400 | Cannot save Purchase As the same as current Item Name |
        | TC_PA002a_02 | CSV         | testautoforecast@gmail.com |       10 | purchaseAs | itself |            400 | Cannot save Purchase As the same as current Item Name |
        | TC_PA002a_03 | QBFS        | testautoforecast@gmail.com |       10 | purchaseAs | itself |            400 | Cannot save Purchase As the same as current Item Name |

    @TC_PA002b
    Scenario Outline: <TC_ID> - Verify user <email> checks Purchase As validation
        # Item cannot assign Purchase As when it is being set Purchase As
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets GET api endpoint to get items that have purchase as
        And User sends a GET request to get list items
        And User picks a random item in above list items
        And User saves the purchase as item key
        And User sets GET api endpoint to get items that have not purchase as
        And User sends a GET request to get list items
        And User picks a random item in above list items
        And User saves the item key
        And User sets PUT api endpoint to edit <editColumn> of the above item for company type <companyType> with new value: <value>
        When User sends a PUT request to edit the item
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract essential types in item object are correct

    Examples: 
        | TC_ID        | companyType | email                      | limitRow | editColumn | value | expectedStatus | expectedStatusText                                 |
        | TC_PA002b_01 | ASC         | testautoforecast@gmail.com |       10 | purchaseAs | hard  |            400 | Item has already set as Purchase As of other items |
        | TC_PA002b_02 | CSV         | testautoforecast@gmail.com |       10 | purchaseAs | hard  |            400 | Item has already set as Purchase As of other items |
        | TC_PA002b_03 | QBFS        | testautoforecast@gmail.com |       10 | purchaseAs | hard  |            400 | Item has already set as Purchase As of other items |
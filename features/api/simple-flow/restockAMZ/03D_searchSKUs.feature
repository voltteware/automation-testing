@test-api @regression-api @search-skus @api-restockAMZ
Feature: API_Regression User can search SKUs
    Background: Send POST /login request to login before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies

    @TC_ASC_SSKUS001 @smoke-test-api
    Scenario Outline: <TC_ID> - Verify user <email> could call APIs to search SKUs in shipment detail - <shipmentStatus>
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        # Get shipments by status PENDING
        And User sets GET api to get shipments in Manage Shipments by status:
            | shipmentStatus   | limit |
            | <shipmentStatus> | 2     |
        And User sends a GET request to get shipments in Manage Shipments
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks API contract of get list shipments api
        # Pick a shipment
        And User picks a shipment in Manage Shipments
        # Get all items of the shipment
        And User sets GET api endpoint to get items in shipments by restockType: <restockType>
        And User sends a GET request to get items in shipments by restockType: <restockType>
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        # Pick a item of the shipment
        And User picks random item to check api contract
        And User checks API contract of get items in shipment
        # Search the above item
        And User sets GET api to search item in shipment detail with following data:
            | restockType   | searchText            |
            | <restockType> | nameOfAboveRandomItem |
        And User sends a GET request to get items in shipment detail by search function
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks the system display the correct item list in shipment detail by search function
        And User picks random item to check api contract
        And User checks API contract of get items in shipment

        Examples:
            | TC_ID             | companyType | restockType | email                      | expectedStatus | expectedStatusText | shipmentStatus |
            | TC_ASC_SSKUS001_1 | ASC         | SUPPLIER    | testautoforecast@gmail.com | 200            | OK                 | PENDING        |

    @TC_ASC_SSKUS001
    Scenario Outline: <TC_ID> - Verify user <email> could call APIs to search SKUs in shipment detail - <shipmentStatus>
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        # Get shipments by status PENDING
        And User sets GET api to get shipments in Manage Shipments by status:
            | shipmentStatus   | limit |
            | <shipmentStatus> | 2     |
        And User sends a GET request to get shipments in Manage Shipments
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks API contract of get list shipments api
        # Pick a shipment
        And User picks a shipment in Manage Shipments
        # Get all items of the shipment
        And User sets GET api endpoint to get items in shipments by restockType: <restockType>
        And User sends a GET request to get items in shipments by restockType: <restockType>
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        # Pick a item of the shipment
        And User picks random item to check api contract
        And User checks API contract of get items in shipment
        # Search the above item
        And User sets GET api to search item in shipment detail with following data:
            | restockType   | searchText            |
            | <restockType> | nameOfAboveRandomItem |
        And User sends a GET request to get items in shipment detail by search function
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks the system display the correct item list in shipment detail by search function
        And User picks random item to check api contract
        And User checks API contract of get items in shipment

        Examples:
            | TC_ID             | companyType | restockType | email                      | expectedStatus | expectedStatusText | shipmentStatus |
            | TC_ASC_SSKUS001_2 | ASC         | SUPPLIER    | testautoforecast@gmail.com | 200            | OK                 | WORKING        |    
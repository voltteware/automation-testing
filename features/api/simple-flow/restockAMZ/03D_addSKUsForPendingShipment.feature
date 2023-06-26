@test-api @regression-api @add-sku-shipments @api-restockAMZ
Feature: API_Regression User can add SKUs in shipments which have Pending status
    Background: Send POST /login request to login before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies

    @TC_ASC_ASKU001 @smoke-test-api
    Scenario Outline: <TC_ID> - Verify user <email> could call APIs to add new SKUs for PENDING shipment
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api method to get restock suggestion by vendor
        And User sends a GET api method to get restock suggestion by vendor
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Select option All Suppliers because it contains a lot of Items
        And User selects the All Suppliers in Supplier list
        And User checks API contract of get restock suggestion by vendor api
        And User sends a GET api method to count all Items have alerts in All Suppliers
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User sets GET api method to get Items belonged to All Suppliers with direction: <direction>
        And User sends a GET api method to get Items belonged to All Suppliers
        # Item with Auto name cannot create shipment
        And User picks a random item which does not has Auto in the name in Item list
        And User checks API contract of get items in Item list
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User sets GET api endpoint to get Item by Item key
        And User sends a GET request to get Item by Item key
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract of get Item by Item key api
        And User sets GET api endpoint to get suppliers with limit row: <limitRow>
        And User sends a GET request to get list suppliers
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User picks random supplier in above response
        And User sets request body of edit item api with payload
            | editColumn   | companyType   | value   |
            | <editColumn> | <companyType> | <value> |
        And User sends a PUT request to edit the item
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        # Create shipment
        And User sets POST api endpoint to create Shipment
        And User sends a POST request to create Shipment
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract of create shipment api
        And User sets GET api endpoint to get Shipment info
        And User sends a GET request to get Shipment info
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract of get Shipment info api
        And User sets GET api endpoint to get items in shipments by restockType: <restockType>
        And User sends a GET request to get items in shipments by restockType: <restockType>
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User picks random item to check api contract
        And User checks API contract of get items in shipment
        And User sets GET api endpoint to check local qty error
        And User sends a GET request to check local qty error
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User sets GET api endpoint to get supplier address
        And User sends a GET request to get supplier address
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User picks random supplier address in above response
        And User checks API contract of get supplier address api
        And User sets PUT api endpoint to update shipment
        And User sends a PUT request to update shipment with casePackOption: <casePackOption>
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User sets GET api endpoint to find the new created shipment
        And User sends a GET request to find the new created shipment
        And User checks the new created shipment: <shipmentStatus>
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract of get list shipments api
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User picks a random item in above list items
        # Add SKU
        And User sets POST api to add SKU as the following data:
            | sku    | warehouseQty | casePackQty | QtySent |
            | random | 1            | 0           | 1       |
        And User sends a POST request to add SKU
        And The expected status code should be <expectedStatus>
        And User checks API contract of add SKU response are correct
        # Delete shipment
        When User sets DELETE api endpoint to delete shipment
        Then User sends a DELETE request to delete shipment
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User sends a GET request to find the new created shipment
        And User checks the deleted shipments does not exist in the list

        Examples:
            | TC_ID          | companyType | casePackOption | restockType | editColumn   | value                        | email                      | direction | expectedStatus | expectedStatusText | limitRow | shipmentStatus |
            | TC_ASC_ASKU001 | ASC         | No             | SUPPLIER    | supplierName | supplierUpdatedSalesVelocity | testautoforecast@gmail.com | desc      | 200            | OK                 | 10       | PENDING        |
# This scenario run failed, because total cost in shipment detail always displays 0 
@test-api @regression-api @check-shipment-detials @api-restockAMZ @bug2102
Feature: API_Regression User creates shipments and check information in shipment details
    Background: Send POST /login request to login before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies

    @TC_ASC_CSD001 @smoke-test-api @bug2102
    Scenario Outline: <TC_ID> - Verify user <email> could call APIs to check shipments details (Pending)
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api method to get restock suggestion by vendor
        And User sends a GET api method to get restock suggestion by vendor
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        # Select option All Suppliers because it contains a lot of Items
        And User selects the All Suppliers in Supplier list
        And User checks API contract of get restock suggestion by vendor api
        And User sends a GET api method to count all Items have alerts in All Suppliers
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User sets GET api method to get Items belonged to All Suppliers with direction: <direction>
        And User sends a GET api method to get Items belonged to All Suppliers
        # Item with Auto name cannot create shipment
        And User picks a random item which does not has Auto in the name in Item list
        And User checks API contract of get items in Item list
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User sets GET api endpoint to get Item by Item key
        And User sends a GET request to get Item by Item key
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks API contract of get Item by Item key api
        And User sets GET api endpoint to get suppliers with limit row: <limitRow>
        And User sends a GET request to get list suppliers
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User picks random supplier in above response
        And User sets request body of edit item api with payload
            | editColumn   | companyType   | value   |
            | <editColumn> | <companyType> | <value> |
        And User sends a PUT request to edit the item
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User sets POST api endpoint to create Shipment
        And User sends a POST request to create Shipment
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks API contract of create shipment api
        And User sets GET api endpoint to get Shipment info
        And User sends a GET request to get Shipment info
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks API contract of get Shipment info api
        And User sets GET api endpoint to get items in shipments by restockType: <restockType>
        And User sends a GET request to get items in shipments by restockType: <restockType>
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User picks random item to check api contract
        And User checks API contract of get items in shipment
        And User sets GET api endpoint to check local qty error
        And User sends a GET request to check local qty error
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User sets GET api endpoint to get supplier address
        And User sends a GET request to get supplier address
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User picks random supplier address in above response
        And User checks API contract of get supplier address api
        And User sets PUT api endpoint to update shipment
        And User sends a PUT request to update shipment with casePackOption: <casePackOption>
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks API contract of update shipment by shipment key api
        And User sets POST api endpoint to create shipment plan
        And User sends a POST request to create shipment plan
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User sets PUT api endpoint to update shipment
        And User sends a PUT request to update shipment with casePackOption: <casePackOption>
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks API contract of update shipment by shipment key api
        And User sets GET api endpoint to find the new created shipment
        And User sends a GET request to find the new created shipment
        And User checks the new created shipment: <shipmentStatus>
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks API contract of get list shipments api
        And User sets GET api endpoint to get shipment details in Manage Shipments
        When User sends a GET request to get shipment details in Manage Shipments
        Then User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks API contract essential types in shipment details are correct
        And User checks information in Shipment Details: <restockType>
        
        Examples:
            | TC_ID         | companyType | casePackOption | restockType | editColumn   | value                        | email                      | direction | expectedStatus | expectedStatusText | limitRow | shipmentStatus |
            | TC_ASC_CSD001 | ASC         | No             | SUPPLIER    | supplierName | supplierUpdatedSalesVelocity | testautoforecast@gmail.com | desc      | 200            | OK                 | 10       | PENDING        |
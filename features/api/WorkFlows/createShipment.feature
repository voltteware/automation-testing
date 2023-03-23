@test-api @api-work-flow @create-shipment-work-flow

Feature: Workflow - Create Shipment
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username           | password  |
            | admin | may27pre@gmail.com | Test1111! |
        And User sets GET api endpoint to get company keys
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get company keys

    @create-shipment-from-warehouse
    Scenario Outline: Create Shipment From Warehouse
        Given User chooses the company with the name "amz-ca-for-AUTOMATION"
        And User enters shipment order name: "<shipmentName>"
        And User prepares inventory csv file
        And User sets POST api endpoint to upload inventory
        And User sends a POST request to upload inventory
        And User saves the shipment key
        And User sets PUT api endpoint to update shipment
        And User sends a PUT request to update shipment
        And User sets GET api endpoint to get shipment detail
        And User sends a GET request to get shipment detail        

        Examples:
            | shipmentName |
            | random       |
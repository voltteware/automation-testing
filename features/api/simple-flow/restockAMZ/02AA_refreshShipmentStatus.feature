@test-api @regression-api @refresh-shipment-status @api-restockAMZ
Feature: API_Regression User can refresh status for shipments
    Background: Send POST /login request to login before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies

    # Refresh status for specific shipment
    # My scenario: Using account amz-ca-automation to delete one shipment Working (@ITC_shipment_Auto). After that, using account Fishers Finery Amazon to refresh status for this shipment => Then check shipment status of this shipment
    @TC_RSS001 @smoke-test-api
    Scenario Outline: <TC_ID> - User can refresh status for specific shipment
        # Get infor of amz-ca-for-AUTOMATION company
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to find itc auto shipments
        And User sends a GET request to find the new created shipment
        And User picks a just created shipment
        # Get above shipment details
        And User sets GET api endpoint to get shipment details in Manage Shipments
        And User sends a GET request to get shipment details in Manage Shipments
        # Delete above shipment
        And User sets PUT api endpoint to modify shipment details
        And User sends a PUT request to modify: DELETE shipment details
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User picks a company with type <companyType> and name <companyName> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to find the new created shipment
        And User sends a GET request to find the new created shipment
        And User picks a just created shipment
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks API contract of get list shipments api
        And User sets PUT api endpoint to refresh status of specific shipment
        When User sends a PUT request to refresh status of specific shipment
        Then User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks status of this shipment after updated

        Examples:
            | TC_ID     | companyType | email                      | expectedStatus | expectedStatusText | companyName           |
            | TC_RSS001 | ASC         | testautoforecast@gmail.com | 200            | OK                 | Fishers Finery Amazon |

    # Refresh All Shipments Status
    # Please update file csv again before run this scenario if you want to check real time
    @TC_RSS002 @smoke-test-api
    Scenario Outline: <TC_ID> - User can refresh status for all shipments
        Given And User picks a company with type <companyType> and name <companyName> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User sets POST api endpoint to refresh all status shipments
        And Users sends a POST request to refresh all status shipments
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks that the shipmentLastRefresh field was updated and jobInitiator is null in company detail information after running refresh all
        And User sets GET api to get lasted shipments in Manage Shipments
        And User sends a GET request to get shipments in Manage Shipments
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks API contract of get list shipments api
        # Pick a shipment
        And User picks a shipment in Manage Shipments
        When User checks total items in report file EQUALS total with section and item name
            | itemName   | section   | file       |
            | <itemName> | <section> | <fileName> |
        Then User checks value on grid match with value in report file: <section>

        Examples:
            | TC_ID     | companyType | email                      | expectedStatus | expectedStatusText | companyName           | section   | itemName | fileName              |
            | TC_RSS002 | ASC         | testautoforecast@gmail.com | 200            | OK                 | Fishers Finery Amazon | shipments | null     | refreshShipmentStatus |
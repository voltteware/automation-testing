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
    @TC_RSS001_1 @smoke-test-api
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
            | TC_ID       | companyType | email                      | expectedStatus | expectedStatusText | companyName           |
            | TC_RSS001_1 | ASC         | testautoforecast@gmail.com | 200            | OK                 | Fishers Finery Amazon |

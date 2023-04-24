@test-api @api-purchasing @api-purchasing-mySuggested
Feature: API_Purchasing My Suggested
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies

    @TC_PMS001-4 @smoke-test-api
    Scenario Outline: <TC_ID> - Verify Purchasing My Suggested POs and Items in PO on <companyType>
        Given User picks company which has onboarded before with type <companyType> in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        # Get Company info before run forecast
        And user sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        # Run Forecast
        And User sets POST api to run forecast
        And User sends a POST request to run forecast
        And User checks that the lastForecastDate field was updated and jobInitiator is null in company detail information after running forecast

        And User sets GET api endpoint to get count summary by vendor
        When User sends a GET request to get count summary by vendor
        Then The expected status code should be <expectedStatus>
        And User checks API contract get count summary by vendor are correct
        And User sets GET api endpoint to get summary by vendor
        And User sends a GET request to get summary by vendor
        And The expected status code should be <expectedStatus>
        And User checks API contract get summary by vendor are correct
        And User sets GET api endpoint to get Summary Suggested Purchase Orders: Total Price, Total Qty, Unique Items
        And User sends a GET request to get total price, total qty and unique items on Purchasing My Suggest
        And The expected status code should be <expectedStatus>
        And User checks API contract get total price, total qty and unique items on Purchasing My Suggest are correct
        And User checks number Suggested Purchase Orders is correct
        And User checks Total Cost of Suggested Purchase Orders is correct
        And User checks Total Items on Suggested Purchase Orders is correct
        And User checks Total Units on Suggested Purchase Orders is correct

        # Check Items in PO of "Item Without Supplier"
        And User selects suggested PO of Items Without Supplier
        And User sets GET api endpoint to get count items in PO by vendor key null
        And User sends request to get count items on Items in PO by vendor key
        And User checks API contract get count items by vendor key are correct
        And User sets api endpoint to get list items in PO of vendor key
        And User sends a POST request to get list items in PO by vendor key
        And User checks API contract get items in po by vendor key are correct
        And User checks API contract of item object is purchasing is correct

        And User checks total items in PO is matched with total products in suggested PO of Items Without Supplier
        And User checks Total Qty of all Items in PO is matched with Total Qty in suggested PO of Items Without Supplier
        And User checks Total Cost of all Items in PO is matched with Total Cost in suggested PO of Items Without Supplier

        And User checks Forecast Recommended Qty of all items in PO of suggested PO of Items Without Supplier > 0
        And User picks max 10 random items in above list items
        And User checks random items has status is Active
        And User checks supplier name of above random items in Manage Company Items

        # Check Items in PO of a random supplier
        And User selects suggested PO of random supplier
        And User sets GET api endpoint to get count items in PO by vendor key random
        And User sends request to get count items on Items in PO by vendor key
        And User checks API contract get count items by vendor key are correct
        And User sets api endpoint to get list items in PO of vendor key
        And User sends a POST request to get list items in PO by vendor key
        And User checks API contract get items in po by vendor key are correct
        And User checks API contract of item object is purchasing is correct

        And User checks total items in PO is matched with total products in suggested PO of random supplier
        And User checks Total Qty of all Items in PO is matched with Total Qty in suggested PO of random supplier
        And User checks Total Cost of all Items in PO is matched with Total Cost in suggested PO of random supplier

        And User checks Forecast Recommended Qty of all items in PO of suggested PO of random supplier > 0
        And User picks max 10 random items in above list items
        And User checks random items has status is Active
        And User checks supplier name of above random items in Manage Company Items
        Examples:
            | TC_ID     | user  | email                      | password  | companyType | expectedStatus |
            | TC_PMS001 | admin | testautoforecast@gmail.com | Test1111# | CSV         | 200            |
            | TC_PMS002 | admin | testautoforecast@gmail.com | Test1111# | ASC         | 200            |
            | TC_PMS003 | admin | testautoforecast@gmail.com | Test1111# | QBFS        | 200            |
            # | TC_PMS004 | admin | testautoforecast@gmail.com | Test1111# | QBO         | 200            |
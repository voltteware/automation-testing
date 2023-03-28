@test-api @api-purchasing @api-purchasing-my-suggested
Feature: API_Purchasing My Suggested
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get company keys
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get company keys

    @TC_PMS001
    Scenario Outline: TC_PMS001 - Verify the totals on Suggested POs tab
        Given User picks company with type <companyType> in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get count summary by vendor
        When User sends a GET request to get count summary by vendor
        Then The expected status code should be <expectedStatus>
        And User sets GET api endpoint to get summary by vendor
        And User sends a GET request to get summary by vendor
        And The expected status code should be <expectedStatus>
        And User sets GET api endpoint to get Summary Suggested Purchase Orders: Total Price, Total Qty, Unique Items
        And User sends a GET request to get total price, total qty and unique items on Purchasing My Suggest
        And The expected status code should be <expectedStatus>
        And User checks number Suggested Purchase Orders is correct
        And User checks total cost of suggested purchase orders is correct
        And User checks total unique items on suggested purchase orders is correct
        And User checks total units on suggested purchase orders is correct
        And User checks total items in PO is matched with total in suggested PO of Items Without Supplier and Forecast Recommended Qty > 0
        And User checks total items in PO is matched with total in suggested PO of random supplier if any and Forecast Recommended Qty > 0
        Examples:
            | TC_ID     | user  | email                      | password  | companyType | expectedStatus |
            | TC_PMS001 | admin | testautoforecast@gmail.com | Test1111# | CSV         | 200            |
            | TC_PMS002 | admin | testautoforecast@gmail.com | Test1111# | ASC         | 200            |
            | TC_PMS003 | admin | testautoforecast@gmail.com | Test1111# | QBFS        | 200            |
            | TC_PMS004 | admin | testautoforecast@gmail.com | Test1111# | QBO         | 200            |
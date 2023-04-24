@test-api @api-dashboard @api-items @api-hiddenItem
Feature: API_Dashboard Hidden Item PUT /api/item

  Background: Send GET /realm request to get all company keys of current logged in user before each test
    Given user sends a POST login request to get valid cookie with role
      | role  | username                   | password  |
      | admin | testautoforecast@gmail.com | Test1111# |
    And User sets GET api endpoint to get companies information of current user
    And In Header of the request, she sets param Cookie as valid connect.sid
    When User sends a GET request to get companies

  @TC_HI001
  Scenario Outline: <TC_ID> - Verify user <email> could call this API to hidden of a items for company type (<companyType>)
    Given User picks company which has onboarded before with type <companyType> in above response
    And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
    And User set GET api endpoint to get items with name contains "<containText>"
    And User sends a GET request to get list items
    And User picks a random item in above list items
    And User saves the item key
    And User sets PUT api endpoint to edit isHidden of the above item for company type <companyType> with new value: true
    When User sends a PUT request to edit the item
    Then The expected status code should be <expectedStatus>
    And The new isHidden of item must be updated successfully
    And User checks API contract essential types in the response of hidden item are correct
    And User set GET api endpoint to get item that is hidden
    And User sends a GET request to get list items
    And User checks that there are no item in list

    Examples: 
      | TC_ID      | companyType | email                      | containText | expectedStatus |
      | TC_HI001_1 | ASC         | testautoforecast@gmail.com | Auto        |            200 |
      | TC_HI001_2 | CSV         | testautoforecast@gmail.com | Auto        |            200 |
      | TC_HI001_3 | QBFS        | testautoforecast@gmail.com | Auto        |            200 |
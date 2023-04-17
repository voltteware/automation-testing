@test-api @api-admin @api-add-user-to-company
Feature: API_Admin Add user to company api/user

  Background: Send GET request to get companies keys of current logged in user before each test
    Given user sends a POST login request to get valid cookie with role
      | role  | username                   | password  |
      | admin | testautoforecast@gmail.com | Test1111# |
    And User sets GET api endpoint to get 20 companies has just created
    And In Header of the request, user sets param Cookie as valid connect.sid
    When User sends a GET request to get 20 latest companies

  @TC_AUTC001
  Scenario Outline: TC_AUTC001 - Verify admin could call this API to add new user for company
    Given Use picks random companies in above response
    And User saves information of above company
    And User sets POST register service api endpoint
    And User sets request body with payload as firstName: "<firstName>" and lastName: "<lastName>" and companyName: "<companyName>" and companyType: "<companyType>" and phone: "<phone>" and email: "<email>" and password: "<password>"
    And User sends a POST method to register account
    And User saves information of user just created
    And User sets POST api to add user to company
    When User sends a POST request add user to company
    Then The expected status code should be 200
    And User checks API contract essential types in the response of add user to company are correct
    And User sets GET api to get associated users of company
    And User sends a GET request to get associated user of company
    And User verify that the user successfully added

    Examples: 
      | email                            | password  | firstName | lastName | companyName         | companyType | phone      |
      | testautocreate<random>@gmail.com | Test1111# | Test      | Auto     | ITC-Company-Testing | ASC         | 0355025511 |

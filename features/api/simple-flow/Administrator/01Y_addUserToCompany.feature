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
    And User sets POST api to add users that exist in the system to company
    When User sends a POST request add user to company
    Then The expected status code should be 200
    And User checks API contract essential types in the response of add user to company are correct
    And User sets GET api to get associated users of company
    And User sends a GET request to get associated user of company
    And User verify that the user successfully added
    And User sets POST api to remove user from company
    And User sends a POST request to remove user from company
    Examples: 
      | email                            | password  | firstName | lastName | companyName         | companyType | phone      |
      | testautocreate<random>@gmail.com | Test1111# | Test      | Auto     | ITC-Company-Testing | ASC         | 0355025511 |

  @TC_AUTC002
  Scenario Outline: TC_AUTC002 - Verify error when admin call this API to add user that already been added for company
    Given Use picks random companies in above response
    And User saves information of above company
    And User sets POST register service api endpoint
    And User sets request body with payload as firstName: "<firstName>" and lastName: "<lastName>" and companyName: "<companyName>" and companyType: "<companyType>" and phone: "<phone>" and email: "<email>" and password: "<password>"
    And User sends a POST method to register account
    And User saves information of user just created
    And User sets POST api to add users that exist in the system to company
    And User sends a POST request add user to company    
    And User sets POST api to add users that exist in the system to company
    When User sends a POST request add user to company
    Then The expected status code should be <expectedStatus>
    And The error message must be "<expectedErrorMessage>"
    And User checks API contract essential types in the response of add user to company are correct

    Examples: 
      | email                            | password  | firstName | lastName | companyName         | companyType | phone      | expectedStatus | expectedErrorMessage        |
      | testautocreate<random>@gmail.com | Test1111# | Test      | Auto     | ITC-Company-Testing | ASC         | 0355025511 |            200 | User has already been added |

  @TC_AUTC003
  Scenario Outline: TC_AUTC003 - Verify admin could call this API to add a new user that does not exist in system to company
    Given Use picks random companies in above response
    And User saves information of above company
    And User sets POST api to add users that non-existent in the system to company
    When User sends a POST request add user to company
    Then The expected status code should be 200
    And User checks API contract essential types in the response of add user to company are correct
    And User sets GET api to get associated users of company
    And User sends a GET request to get associated user of company
    And User verify that the user successfully added
    And User sets POST api to remove user from company
    And User sends a POST request to remove user from company
    And User sends a DELETE method to delete user <emailWantToDelete>

    Examples: 
      | emailWantToDelete             | companyName         | companyType |
      | nonexistentuserauto@gmail.com | ITC-Company-Testing | ASC         |


@test-api @api-admin @api-change-company-information
Feature: API_Admin PUT api/company/<companyKey>

  Background: Send GET request to get companies keys of current logged in user before each test
    Given user sends a POST login request to get valid cookie with role
      | role  | username                   | password  |
      | admin | testautoforecast@gmail.com | Test1111# |
    And In Header of the request, user sets param Cookie as valid connect.sid

  @TC_CCI001
  Scenario Outline: TC_CCI001 - Verify admin could call this API to change information of a "<companyType>" company
    Given User sets GET api endpoint to get companies with type "<companyType>" and name contains "<containText>"
    And User sends GET request to get companies with type "<companyType>"
    And Use picks a random companies with type "<companyType>" in above response
    And User sets GET api to get information of "<companyType>" company
    And User sends GET request to get information of company
    And User sets PUT api to change information of "<companyType>" company
      | companyName | leadTime | orderInterval | serviceLevel | isNotifyingAfterForecast | isNotifyingAfterSync | isLostSaleTracking | displayRestockAMZ | lastSyncDate |
      | random      | random   | random        | random       | random                   | random               | random             | random            | random       |
    When User sends PUT request to change information of company
    Then The expected status code should be <expectedStatus>
    And Information of company must be change successfully
    And User checks API contract essential types in company object are correct

    Examples: 
      | user  | companyType | containText | expectedStatus |
      | admin | ASC         | Auto        |            200 |

  @TC_CCI002
  Scenario Outline: TC_CCI002 - Verify admin could call this API to change information of a "<companyType>" company
    Given User sets GET api endpoint to get companies with type "<companyType>" and name contains "<containText>"
    And User sends GET request to get companies with type "<companyType>"
    And Use picks a random companies with type "<companyType>" in above response
    And User sets GET api to get information of "<companyType>" company
    And User sends GET request to get information of company
    And User sets PUT api to change information of "<companyType>" company
      | companyName | leadTime | orderInterval | serviceLevel | isNotifyingAfterForecast | isNotifyingAfterSync | isLostSaleTracking |
      | random      | random   | random        | random       | random                   | random               | random             |
    When User sends PUT request to change information of company
    Then The expected status code should be <expectedStatus>
    And Information of company must be change successfully
    And User checks API contract essential types in company object are correct

    Examples: 
      | user  | companyType | containText | expectedStatus |
      | admin | CSV         | Auto        |            200 |

  @TC_CCI003
  Scenario Outline: TC_CCI003 - Verify admin could call this API to change information of a "<companyType>" company
    Given User sets GET api endpoint to get companies with type "<companyType>" and name contains "<containText>"
    And User sends GET request to get companies with type "<companyType>"
    And Use picks a random companies with type "<companyType>" in above response
    And User sets GET api to get information of "<companyType>" company
    And User sends GET request to get information of company
    And User sets PUT api to change information of "<companyType>" company
      | phone  | leadTime | orderInterval | serviceLevel | isNotifyingAfterForecast | isNotifyingAfterSync | isLostSaleTracking |
      | random | random   | random        | random       | random                   | random               | random             |
    When User sends PUT request to change information of company
    Then The expected status code should be <expectedStatus>
    And Information of company must be change successfully
    And User checks API contract essential types in company object are correct

    Examples: 
      | user  | companyType | containText | expectedStatus |
      | admin | QBFS        | Auto        |            200 |

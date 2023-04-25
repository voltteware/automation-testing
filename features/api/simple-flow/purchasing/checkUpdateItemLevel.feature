@test-api @api-regression @api-purchasing @check-update-item-level
Feature: API Purchasing: Check all values of item must be updated in purchasing after updated and run forecast

  Background: Send GET /realm request to get all company keys of current logged in user before each test
    Given user sends a POST login request to get valid cookie with role
      | role  | username                   | password  |
      | admin | testautoforecast@gmail.com | Test1111# |
    And User sets GET api endpoint to get companies information of current user
    And In Header of the request, she sets param Cookie as valid connect.sid
    When User sends a GET request to get companies

  @TC_CUIL001 @bug1915
  Scenario Outline: <TC_ID> - Verify that values of item in "Purchasing > My Suggested" must be updated when update values of item in "Manage Company > Items" and run forecast of <companyType> company
    Given User picks company which has onboarded before with type <companyType> in above response
    And User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
    And User sets valid cookie of <email> and valid companyKey and valid companyType in the header    
    And User sets GET api endpoint to get suppliers with limit row: 10
    And User sends a GET request to get list suppliers

    # Session Suggested POs - Get list suggested POs and pick 1 suggested PO
    And User sets GET api endpoint to get summary by vendor
    And User sends a GET request to get summary by vendor
    And The expected status code should be <expectedStatus>
    And User checks API contract get summary by vendor are correct
    And User selects suggested PO of random supplier

    # Session Items in PO - Get list items in PO and pick 1 item
    And User selects suggested PO of random supplier
    And User sets GET api endpoint to get count items in PO by vendor key random
    And User sends request to get count items on Items in PO by vendor key
    And User checks API contract get count items by vendor key are correct
    And User sets api endpoint to get list items in PO of vendor key
    And User sends a POST request to get list items in PO by vendor key
    And User checks API contract get items in po by vendor key are correct
    And User checks API contract of item object is purchasing is correct

    # Manage Company > Items - Edit some values of a item 
    And User set GET api endpoint to get items with name contains "itemInListItemInPO"
    And User sends a GET request to get list items
    And User picks a random item in above list items
    And User saves the item key
    # TODO: Edit item so that forecastRecommendedQty > 0
    # Currently the forecastRecommendedQty sometime >0 and sometime <0
    # The item with forecastRecommendedQty < 0, not show in Purchasing > Mysuggested => Cannot check
    And User sets api endpoint to edit some values of a item
      | supplierName | supplierPrice | moq    | onHandFbaQty | onHandFbmQty | serviceLevel | warehouseQty | description | leadTime | orderInterval | casePackQty | tags   | onHandQtyMin | wareHouseQtyMin | inventorySourcePreference |
      | random       | random        | random | random       | random       | random       | random       | random      | random   | random        | random      | random | random       | random          | random                    |
    And User sends a PUT request to edit the item
    And The expected status code should be <expectedStatus>    
    And User checks new values of item in "Manage Company > Items" must be display exactly
    And User checks API contract essential types in the response of edit item are correct    

    # Get Company info before run forecast
    And user sets GET api endpoint to get company information by company key
    And User sends a GET request to get company information by company key
    # Run Forecast
    And User sets POST api to run forecast
    And User sends a POST request to run forecast
    And User checks that the lastForecastDate field was updated and jobInitiator is null in company detail information after running forecast

    # Save Forecast Recommended Qty
    And User sets api endpoint to get consolidated of item
    And User sends a GET request to get consolidated of item
    And User saves the forecast recommended qty     

    # Check some value must be updated in item card
    And User sets GET api endpoint to get results of item
    And User sends a GET request to get results of item
    And User checks API contract of get results of item
    And User checks some values in result must be updated after update values of item in "Manage Company > Items" and run forecast   

    # Check some value must be updated in Purchasing > My Suggested  
    And User sets api endpoint to get a item in PO  of vendor key in My Suggested
    And User sends a POST request to get a item in PO by vendor key in My Suggested
    And User verify that values of item in "Purchasing > My Suggested" must be updated after update values of item in "Manage Company > Items" and run forecast


    Examples: 
      | TC_ID           | companyType | companyKey | email                      | expectedStatus |
      | TC_CUIL001_1    | ASC         | random     | testautoforecast@gmail.com |            200 |
      | TC_CUIL001_2    | CSV         | random     | testautoforecast@gmail.com |            200 |
      | TC_CUIL001_3    | QBFS        | random     | testautoforecast@gmail.com |            200 |

  @TC_CUIL002 @bug1915
  Scenario Outline: <TC_ID> - Verify that values of item in "Purchasing > Custom" must be updated when update values of item in "Manage Company > Items" and run forecast of <companyType> company
    Given User picks company which has onboarded before with type <companyType> in above response
    And User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
    And User sets valid cookie of <email> and valid companyKey and valid companyType in the header    
    And User sets GET api endpoint to get suppliers with limit row: 10
    And User sends a GET request to get list suppliers

    # Session Purchasing > Custom - Get list list item in custom and pick 1 item
    And User sets GET api endpoint to get items in Purchasing Custom
    And User sends a GET request to get items in Purchasing Custom
    And The expected status code should be <expectedStatus>
    And User checks API contract of item object is purchasing is correct

    # Manage Company > Items - Edit some values of a item 
    And User set GET api endpoint to get items with name contains "itemInListItemInPO"
    And User sends a GET request to get list items
    And User picks a random item in above list items
    And User saves the item key
    And User sets api endpoint to edit some values of a item
      | supplierName | supplierPrice | moq    | onHandFbaQty | onHandFbmQty | serviceLevel | warehouseQty | description | leadTime | orderInterval | casePackQty | tags   | onHandQtyMin | wareHouseQtyMin | inventorySourcePreference |
      | random       | random        | random | random       | random       | random       | random       | random      | random   | random        | random      | random | random       | random          | random                    |
    And User sends a PUT request to edit the item
    And The expected status code should be <expectedStatus>    
    And User checks new values of item in "Manage Company > Items" must be display exactly
    And User checks API contract essential types in the response of edit item are correct    

    # Get Company info before run forecast
    And user sets GET api endpoint to get company information by company key
    And User sends a GET request to get company information by company key
    # Run Forecast
    And User sets POST api to run forecast
    And User sends a POST request to run forecast
    And User checks that the lastForecastDate field was updated and jobInitiator is null in company detail information after running forecast   

    # Check some value must be updated in item card
    And User sets GET api endpoint to get results of item
    And User sends a GET request to get results of item
    And User checks API contract of get results of item
    And User checks some values in result must be updated after update values of item in "Manage Company > Items" and run forecast
    
    # Check some value must be updated in Purchasing > Custom
    And User sets api endpoint to get a item in Custom
    And User sends a GET request to get a item in Custom
    And User verify that values of item in "Purchasing > Custom" must be updated after update values of item in "Manage Company > Items" and run forecast

    Examples: 
      | TC_ID         | companyType | companyKey | email                      | expectedStatus |
      | TC_CUIL002_1  | ASC         | random     | testautoforecast@gmail.com |            200 |
      | TC_CUIL002_2  | CSV         | random     | testautoforecast@gmail.com |            200 |
      | TC_CUIL002_3  | QBFS        | random     | testautoforecast@gmail.com |            200 |

  @TC_CUIL003 
  Scenario Outline: <TC_ID> - Verify that "Existing PO Qty" in Purchasing > My Suggested/Custom will be updated when update "Open qty" of Supply in "Manage Company > Supply" and run forecast of <companyType> company
    Given User picks company which has onboarded before with type <companyType> in above response
    And User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
    And User sets valid cookie of <email> and valid companyKey and valid companyType in the header   
    And User sets GET api endpoint to get suppliers with limit row: 10
    And User sends a GET request to get list suppliers
    And User sets GET api endpoint to get supplies with limit row: 10
    And User sends a GET request to get list supplies
    And User picks a random supply in above list supplies
    And User saves the supply key and order key

    # Update Open Qty of a supply
    And User sets PUT api endpoint to edit <editColumn> of the above supply for company type <companyType> with new value: <value>
    When User sends a PUT request to edit the supply
    Then The expected status code should be <expectedStatus>
    And The new <editColumn> of supply must be updated successfully
    And User checks API contract essential types in supply object are correct

    # Update purchaseAs = null, isHidden = false of item in edited supply above
    # When purchaseAs = null, isHidden = false then the item is displayed in Purchasing > Custom
    # Update supplierName to item display in Purchasing > My Suggested
    And User set GET api endpoint to get items with name contains "itemInEditedSupplyAbove"
    And User sends a GET request to get list items
    And User picks a random item in above list items
    And User saves the item key    
    And User sets api endpoint to edit some values of a item
      | supplierName | purchaseAs  | isHidden    | 
      | random       | null        | false       | 
    And User sends a PUT request to edit the item
    And The expected status code should be <expectedStatus>  

    # Get Company info before run forecast
    And user sets GET api endpoint to get company information by company key
    And User sends a GET request to get company information by company key
    # Run Forecast
    And User sets POST api to run forecast
    And User sends a POST request to run forecast
    And User checks that the lastForecastDate field was updated and jobInitiator is null in company detail information after running forecast   

    # Check Existing PO Qty of item in Purchasing > Custom
    And User sets api endpoint to get a item in Custom
    And User sends a GET request to get a item in Custom
    And User verify that "Existing PO Qty" of item in "Purchasing > Custom" must be updated after update values of item in "Manage Company > Supply" and run forecast

    # Save Forecast Recommended Qty
    And User sets api endpoint to get consolidated of item
    And User sends a GET request to get consolidated of item
    And User saves the forecast recommended qty  

    # Check Existing PO Qty of item in Purchasing > My Suggested
    And User sets api endpoint to get a item in PO  of vendor key in My Suggested
    And User sends a POST request to get a item in PO by vendor key in My Suggested
    And User verify that "Existing PO Qty" of item in "Purchasing > My Suggested" must be updated after update values of item in "Manage Company > Supply" and run forecast

    Examples: 
      | TC_ID         | companyType | companyKey | email                      | editColumn  |value       | expectedStatus  |
      | TC_CUIL003_1  | ASC         | random     | testautoforecast@gmail.com | openQty     |random      |    200          |
      | TC_CUIL003_2  | CSV         | random     | testautoforecast@gmail.com | openQty     |random      |    200          |

@TC_CUIL004 
  Scenario Outline: <TC_ID> - Verify that "Open Sales Orders" in Purchasing > My Suggested/Custom will be updated when update "Open Sales Order Qty" of Demand in "Manage Company > Demand" and run forecast of <companyType> company
    Given User picks company which has onboarded before with type <companyType> in above response
    And User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
    And User sets valid cookie of <email> and valid companyKey and valid companyType in the header   
    And User sets GET api endpoint to get suppliers with limit row: 10
    And User sends a GET request to get list suppliers

    # Update Open Sales Order Qty Of Demand
    And User sets GET api endpoint to get demands with limit row: 10
    When User sends a GET request to get list demands
    And User picks a random demand in above list demands
    And User saves the demand key and order key
    And User sets PUT api endpoint to edit <editColumn> of the above demand for company type <companyType> with new value: <value>
    When User sends a PUT request to edit the demand
    Then The expected status code should be <expectedStatus>
    And The new <editColumn> of demand must be updated successfully
    And User checks values in response of random demand are correct

    # Update purchaseAs = null, isHidden = false of item in edited supply above
    # When purchaseAs = null, isHidden = false then the item is displayed in Purchasing > Custom
    # Update supplierName to item display in Purchasing > My Suggested
    And User set GET api endpoint to get items with name contains "itemInEditedDemandAbove"
    And User sends a GET request to get list items
    And User picks a random item in above list items
    And User saves the item key    
    And User sets api endpoint to edit some values of a item
      | supplierName | purchaseAs  | isHidden    | 
      | random       | null        | false       | 
    And User sends a PUT request to edit the item
    And The expected status code should be <expectedStatus>  

    # Get Company info before run forecast
    And user sets GET api endpoint to get company information by company key
    And User sends a GET request to get company information by company key
    # Run Forecast
    And User sets POST api to run forecast
    And User sends a POST request to run forecast
    And User checks that the lastForecastDate field was updated and jobInitiator is null in company detail information after running forecast   

    # Check Existing PO Qty of item in Purchasing > Custom
    And User sets api endpoint to get a item in Custom
    And User sends a GET request to get a item in Custom
    And User verify that "Open Sales Orders" of item in "Purchasing > Custom" must be updated after update values of item in "Manage Company > Demand" and run forecast

    # Save Forecast Recommended Qty
    And User sets api endpoint to get consolidated of item
    And User sends a GET request to get consolidated of item
    And User saves the forecast recommended qty  

    # Check Open Sales Orders of item in Purchasing > My Suggested
    And User sets api endpoint to get a item in PO  of vendor key in My Suggested
    And User sends a POST request to get a item in PO by vendor key in My Suggested
    And User verify that "Open Sales Orders" of item in "Purchasing > My Suggested" must be updated after update values of item in "Manage Company > Demand" and run forecast

    Examples: 
      | TC_ID         | companyType | companyKey | email                      | editColumn            |value       | expectedStatus  |
      | TC_CUIL004    | CSV         | random     | testautoforecast@gmail.com | openSalesOrderQty     |random      |    200          |     
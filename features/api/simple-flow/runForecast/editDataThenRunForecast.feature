@test-api @run-forecast
Feature: APIs Advanced Edit Item History, PUT /api/history-override, Purchase As
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies

    #editItemHistory
    @TC_EI001-3 @smoke-test-api @regression-api @api-edit-item-history @api-dashboard @api-dashboard-advanced @api-editItemHistory
    Scenario Outline: <TC_ID> - Verify user can edit items history of company <companyType> and go to Purchasing to view changes after run forecast
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get items with limit row: 10 and filter field: isHidden equals false
        And User sends a GET request to get list items
        And User  picks a random item which does not have Purchase As
        And User saves the item key
        And User sets PUT api endpoint to update history override
        And User sends a PUT request to update history override
        And User checks API contract of update history override api
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User sets PUT api endpoint to edit <editColumn> of the above item for company type <companyType> with new value: <value>
        And User sends a PUT request to edit the item
        And The expected status code should be <expectedStatus>
        And User sets GET api endpoint to get history override of item
        And User sends a GET request to get history override of item
        And User checks API contract of get history override of item api
        And User checks value after editing history override of item
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Get Company info before run forecast
        And User sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User sets POST api to run forecast
        And User sends a POST request to run forecast
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks that the lastForecastDate field was updated and jobInitiator is null in company detail information after running forecast
        And User sets GET api endpoint to get results of item
        When User sends a GET request to get results of item
        Then User checks API contract of get results of item
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks override history values in Purchasing
        Examples:
            | TC_ID     | user  | email                      | password  | companyType | expectedStatus | expectedStatusText | editColumn         | value |
            | TC_EIH001 | admin | testautoforecast@gmail.com | Test1111# | CSV         | 200            | OK                 | useHistoryOverride | true  |
            | TC_EIH002 | admin | testautoforecast@gmail.com | Test1111# | ASC         | 200            | OK                 | useHistoryOverride | true  |
            | TC_EIH003 | admin | testautoforecast@gmail.com | Test1111# | QBFS        | 200            | OK                 | useHistoryOverride | true  |

    @TC_EIH004-7 @smoke-test-api
    Scenario Outline: <TC_ID> - Verify items showed on Edit Item History of company <companyType> should be active items
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And user sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        #Run Forecast
        And User sets POST api to run forecast
        And User sends a POST request to run forecast
        And User checks that the lastForecastDate field was updated and jobInitiator is null in company detail information after running forecast
        And User sets GET api endpoint to get count item in Edit Item History
        When User sends a GET request to get count items
        Then The expected status code should be <expectedStatus>
        And User checks API contract get count items are correct
        # TODO: check total numbers on UI matched with UI
        And User sets GET api endpoint to get default 30 items in "Edit Item History"
        And User sends GET request to get items in "Edit Item History"
        And The expected status code should be <expectedStatus>
        And User checks API contract essential types in item object are correct
        And User picks max 10 random items in the above list items
        And User checks random items has status is Active
        # Find a hidden item and search on Item History. Expect return empty result
        And User sets GET api endpoint to get items with limit row: 10 and filter field: isHidden equals true
        And User sends a GET request to get list items
        And User picks a random item in above list items
        And User sets GET api endpoint to filter item by name or asin contains nameOfRandomItem
        And User sends a GET request to get list items
        And User checks the response of get item list returns empty array

        Examples:
            | TC_ID     | user  | email                      | password  | companyType | expectedStatus |
            | TC_EIH004 | admin | testautoforecast@gmail.com | Test1111# | CSV         | 200            |
            | TC_EIH005 | admin | testautoforecast@gmail.com | Test1111# | ASC         | 200            |
            | TC_EIH006 | admin | testautoforecast@gmail.com | Test1111# | QBFS        | 200            |
    # | TC_EIH007 | admin | testautoforecast@gmail.com | Test1111# | QBO         | 200            |

    # overrideValue
    @TC_OV001 @smoke-test-api @regression-api @api-overrideValue @api-dashboard
    Scenario Outline: <TC_ID> - Verify user <email> override history value of company <companyType> and go to Purchasing to check data
        Given User picks company which has onboarded before with type <companyType> in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User picks a random item which does not have Purchase As
        And User saves the item key
        And User sets PUT api endpoint to update history override
        And User sends a PUT request to update history override
        And User checks API contract of update history override api
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User sets PUT api endpoint to edit <editColumn> of the above item for company type <companyType> with new value: <value>
        And User sends a PUT request to edit the item
        And The expected status code should be <expectedStatus>
        And User sets GET api endpoint to get history override of item
        And User sends a GET request to get history override of item
        And User checks API contract of get history override of item api
        And User checks value after editing history override of item
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Get Company info before run forecast
        And User sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User sets POST api to run forecast
        And User sends a POST request to run forecast
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks that the lastForecastDate field was updated and jobInitiator is null in company detail information after running forecast
        And User sets GET api endpoint to get results of item
        When User sends a GET request to get results of item
        Then User checks API contract of get results of item
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks override history values in Purchasing

        Examples:
            | TC_ID      | companyType | email                      | limitRow | expectedStatus | expectedStatusText | editColumn         | value |
            | TC_OV001_1 | CSV         | testautoforecast@gmail.com | 20       | 200            | OK                 | useHistoryOverride | true  |
            | TC_OV001_2 | ASC         | testautoforecast@gmail.com | 20       | 200            | OK                 | useHistoryOverride | true  |
            | TC_OV001_3 | QBFS        | testautoforecast@gmail.com | 20       | 200            | OK                 | useHistoryOverride | true  |

    # purchaseAs
    @TC_PA001 @api-dashboard @api-items @api-purchaseAs @regression-api
    Scenario Outline: <TC_ID> - Verify user <email> could call APIs to assign Purchase As and check formula of company <companyType>
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get items that have purchase as
        And User sends a GET request to get list items
        And User saves list items that have already set as purchas as of orther items
        And User sets GET api endpoint to get items that have not purchase as
        And User sends a GET request to get list items
        And User picks a random item in above list items
        And User saves the item key
        And User sets PUT api endpoint to edit <editColumn> of the above item for company type <companyType> with new value: <value>
        And User sends a PUT request to edit the item
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And The new <editColumn> of item must be updated successfully
        And User checks API contract essential types in item object are correct
        # This is information of Item which is disappeared in Purchasing
        And User sets api endpoint to get a item in Custom
        And User sends a GET request to get a item in Custom
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User saves needed information to calculate normal item
        And User checks value in Item card
        # This is information of Item which is appeared in Purchasing Custom
        And User sets api endpoint to get a Purchase As item in Custom
        And User sends a GET request to get a Purchase As item in Custom
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User saves needed information to calculate purchase as item
        # Get Company info before run forecast
        And User sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Run Forecast
        And User sets POST api to run forecast
        And User sends a POST request to run forecast
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract of run forecast api
        And User checks that the lastForecastDate field was updated and jobInitiator is null in company detail information after running forecast
        # This is information of Item which is appeared in Purchasing Custom after run forecast
        And User sets api endpoint to get a Purchase As item in Custom
        And User sends a GET request to get a Purchase As item in Custom
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Save value after run forecast
        And User saves needed information to calculate actual purchase as item
        And User calculates Purchase As item
        And User checks value in Item card

        Examples:
            | TC_ID       | companyType | email                      | editColumn | value   | expectedStatus | expectedStatusText |
            | TC_PA001_01 | ASC         | testautoforecast@gmail.com | purchaseAs | dynamic | 200            | OK                 |
            | TC_PA001_02 | CSV         | testautoforecast@gmail.com | purchaseAs | dynamic | 200            | OK                 |
            | TC_PA001_03 | QBFS        | testautoforecast@gmail.com | purchaseAs | random  | 200            | OK                 |

    @TC_PA002a @api-dashboard @api-items @api-purchaseAs @regression-api
    Scenario Outline: <TC_ID> - Verify user <email> checks Purchase As validation item cannot assign Purchase As for itself of company <companyType>
        # Item cannot assign Purchase As for itself
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User picks a random item in above list items
        And User saves the item key
        And User sets PUT api endpoint to edit <editColumn> of the above item for company type <companyType> with new value: <value>
        When User sends a PUT request to edit the item
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract essential types in item object are correct

        Examples:
            | TC_ID        | companyType | email                      | limitRow | editColumn | value  | expectedStatus | expectedStatusText                                    |
            | TC_PA002a_01 | ASC         | testautoforecast@gmail.com | 10       | purchaseAs | itself | 400            | Cannot save Purchase As the same as current Item Name |
            | TC_PA002a_02 | CSV         | testautoforecast@gmail.com | 10       | purchaseAs | itself | 400            | Cannot save Purchase As the same as current Item Name |
            | TC_PA002a_03 | QBFS        | testautoforecast@gmail.com | 10       | purchaseAs | itself | 400            | Cannot save Purchase As the same as current Item Name |

    @TC_PA002b @api-dashboard @api-items @api-purchaseAs @regression-api
    Scenario Outline: <TC_ID> - Verify user <email> checks Purchase As validation item cannot assign Purchase As when it is being set Purchase As of company <companyType>
        # Item cannot assign Purchase As when it is being set Purchase As
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets GET api endpoint to get items that have purchase as
        And User sends a GET request to get list items
        And User picks a random item in above list items
        And User saves the purchase as item key
        And User sets GET api endpoint to get items that have not purchase as
        And User sends a GET request to get list items
        And User picks a random item in above list items
        And User saves the item key
        And User sets PUT api endpoint to edit <editColumn> of the above item for company type <companyType> with new value: <value>
        When User sends a PUT request to edit the item
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract essential types in item object are correct

        Examples:
            | TC_ID        | companyType | email                      | limitRow | editColumn | value | expectedStatus | expectedStatusText                                 |
            | TC_PA002b_01 | ASC         | testautoforecast@gmail.com | 10       | purchaseAs | hard  | 400            | Item has already set as Purchase As of other items |
            | TC_PA002b_02 | CSV         | testautoforecast@gmail.com | 10       | purchaseAs | hard  | 400            | Item has already set as Purchase As of other items |
            | TC_PA002b_03 | QBFS        | testautoforecast@gmail.com | 10       | purchaseAs | hard  | 400            | Item has already set as Purchase As of other items |

    #checkUpdateItemLevel
    @TC_CUIL001 @api-regression @api-purchasing @check-update-item-level
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
            | TC_ID        | companyType | companyKey | email                      | expectedStatus |
            | TC_CUIL001_1 | ASC         | random     | testautoforecast@gmail.com | 200            |
            | TC_CUIL001_2 | CSV         | random     | testautoforecast@gmail.com | 200            |
            | TC_CUIL001_3 | QBFS        | random     | testautoforecast@gmail.com | 200            |

    @TC_CUIL002 @api-regression @api-purchasing @check-update-item-level
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
            | TC_ID        | companyType | companyKey | email                      | expectedStatus |
            | TC_CUIL002_1 | ASC         | random     | testautoforecast@gmail.com | 200            |
            | TC_CUIL002_2 | CSV         | random     | testautoforecast@gmail.com | 200            |
            | TC_CUIL002_3 | QBFS        | random     | testautoforecast@gmail.com | 200            |

    @TC_CUIL003 @api-regression @api-purchasing @check-update-item-level
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
            | supplierName | purchaseAs | isHidden |
            | random       | null       | false    |
        And User sends a PUT request to edit the item
        And The expected status code should be <expectedStatus>

        # Get Company info before run forecast
        And user sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        # Run Forecast
        And User sets POST api to run forecast
        And User sends a POST request to run forecast
        And User checks that the lastForecastDate field was updated and jobInitiator is null in company detail information after running forecast

        # Calculate Open Qty
        And User sets GET api endpoint to get supplies by item name "itemAbove"
        And User sends a GET request to get list supplies
        And User saves the Open qty of supply

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
            | TC_ID        | companyType | companyKey | email                      | editColumn | value  | expectedStatus |
            | TC_CUIL003_1 | ASC         | random     | testautoforecast@gmail.com | openQty    | random | 200            |
            | TC_CUIL003_2 | CSV         | random     | testautoforecast@gmail.com | openQty    | random | 200            |

    @TC_CUIL004 @api-regression @api-purchasing @check-update-item-level
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
            | supplierName | purchaseAs | isHidden |
            | random       | null       | false    |
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
            | TC_ID      | companyType | companyKey | email                      | editColumn        | value  | expectedStatus |
            | TC_CUIL004 | CSV         | random     | testautoforecast@gmail.com | openSalesOrderQty | random | 200            |

    # Backfill value feature
    @TC_BFV001 @smoke-test-api @regression-api @api-backfill-value
    Scenario Outline: <TC_ID> - Verify the override history values display exactly in Purchasing after editing it and turning ON backfill feature for <companyType> company
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User picks a random item which does not have Purchase As
        And User saves the item key
        # Turn ON Override history
        And User sets PUT api endpoint to edit useHistoryOverride of the above item for company type <companyType> with new value: <value>
        And User sends a PUT request to edit the item
        And The expected status code should be <expectedStatus>
        # Delete all history-override values of item
        And User sets DELETE api to delete history override
        And User sends a DELETE request to delete history override
        # You must have at least one full year worth of data for this item in order to use Backfill feature
        And User sets PUT api endpoint to update history override for full year of <rowNum> top row in data table
        And User sends a PUT request to update history override for full year of <rowNum> top row in data table
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract of update history override api

        # Turn ON Backfill feature
        And User sets PUT api endpoint to edit <editColumn> of the above item for company type <companyType> with new value: <value>
        And User sends a PUT request to edit the item
        And The new <editColumn> of item must be updated successfully

        # Get history override
        And User sets GET api endpoint to get history override of item
        And User sends a GET request to get history override of item
        And User checks API contract of get history override of item api
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks value after editing history override values of item must be displayed exactly
        And User calculates the order qty of other years after turning on backfill feature and saves those values

        # Get Company info before run forecast
        And User sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Run forecast
        And User sets POST api to run forecast
        And User sends a POST request to run forecast
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks that the lastForecastDate field was updated and jobInitiator is null in company detail information after running forecast

        # Get item result to check history override values
        And User sets GET api endpoint to get results of item
        When User sends a GET request to get results of item
        Then User checks API contract of get results of item
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks override history values must be displayed exactly in Purchasing
        Examples:
            | TC_ID       | companyType | email                      | limitRow | rowNum | expectedStatus | expectedStatusText | editColumn  | value |
            | TC_BFV001_1 | CSV         | testautoforecast@gmail.com | 20       | 1      | 200            | OK                 | useBackfill | true  |
            | TC_BFV001_2 | ASC         | testautoforecast@gmail.com | 20       | 1      | 200            | OK                 | useBackfill | true  |
            | TC_BFV001_3 | QBFS        | testautoforecast@gmail.com | 20       | 1      | 200            | OK                 | useBackfill | true  |

    @TC_BFV002 @smoke-test-api @regression-api @api-backfill-value
    Scenario Outline: <TC_ID> - Verify the the system can backfill for 37 months (12 months of 1st year, 12 months of 2nd year, 12 months of 3rd year and the last month of 4th year) with the 1st year has full values for <companyType> company
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User picks a random item which does not have Purchase As
        And User saves the item key
        # Turn ON Override history
        And User sets PUT api endpoint to edit useHistoryOverride of the above item for company type <companyType> with new value: <value>
        And User sends a PUT request to edit the item
        And The expected status code should be <expectedStatus>
        # Delete all history-override values of item
        And User sets DELETE api to delete history override
        And User sends a DELETE request to delete history override
        # Edit history override values
        And User sets PUT api to update history override with the following data:
            | firstMonth | secondMonth | thirdMonth | fourthMonth | fifthMonth | sixthMonth | seventhMonth | eighthMonth | ninthMonth | tenthMonth | eleventhMonth | twelfthMonth |
            | 4          | 9           | 14         | 2           | 16         | 8          | 23           | 1           | 5          | 10         | 21            | 12           |
            |            |             |            |             |            |            |              |             |            |            |               |              |
            |            |             |            |             |            |            |              |             |            |            |               |              |
            |            |             |            |             |            |            |              |             |            |            |               |              |
        And User sends a PUT request to update history override values
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract of update history override api
        # Turn ON Backfill feature
        And User sets PUT api endpoint to edit <editColumn> of the above item for company type <companyType> with new value: <value>
        And User sends a PUT request to edit the item
        And The new <editColumn> of item must be updated successfully
        # Get history override
        And User sets GET api endpoint to get history override of item
        And User sends a GET request to get history override of item
        And User checks API contract of get history override of item api
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Get Company info before run forecast
        And User sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Run forecast
        And User sets POST api to run forecast
        And User sends a POST request to run forecast
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks that the lastForecastDate field was updated and jobInitiator is null in company detail information after running forecast
        # Get item result to check history override values
        And User sets GET api endpoint to get results of item
        When User sends a GET request to get results of item
        Then User checks API contract of get results of item
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks override history values must be displayed exactly in Purchasing as the following data:
            | firstMonth | secondMonth | thirthMonth | fourthMonth | fifthMonth | sixthMonth | seventhMonth | eighthMonth | ninthMonth | tenthMonth | eleventhMonth | twelfthMonth |
            | 4          | 9           | 14          | 2           | 16         | 8          | 23           | 1           | 5          | 10         | 21            | 12           |
            | 4          | 9           | 14          | 2           | 16         | 8          | 23           | 1           | 5          | 10         | 21            | 12           |
            | 4          | 9           | 14          | 2           | 16         | 8          | 23           | 1           | 5          | 10         | 21            | 12           |
            |            |             |             |             |            |            |              |             |            |            |               | 12           |
        Examples:
            | TC_ID       | companyType | email                      | limitRow | expectedStatus | expectedStatusText | editColumn  | value |
            | TC_BFV002_1 | CSV         | testautoforecast@gmail.com | 20       | 200            | OK                 | useBackfill | true  |
            | TC_BFV002_2 | ASC         | testautoforecast@gmail.com | 20       | 200            | OK                 | useBackfill | true  |
            | TC_BFV002_3 | QBFS        | testautoforecast@gmail.com | 20       | 200            | OK                 | useBackfill | true  |

    @TC_BFV003 @smoke-test-api @regression-api @api-backfill-value @bug-1954
    Scenario Outline: <TC_ID> - Verify that the system can backfill for 37 months( 12 months of 1st year, 12 months of 2nd year, 12 months of 3rd year, the last month of 4th year) with the 1st year has full values and the 2nd year has some values for <companyType> company
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User picks a random item which does not have Purchase As
        And User saves the item key
        # Turn ON Override history
        And User sets PUT api endpoint to edit useHistoryOverride of the above item for company type <companyType> with new value: <value>
        And User sends a PUT request to edit the item
        And The expected status code should be <expectedStatus>
        # Delete all history-override values of item
        And User sets DELETE api to delete history override
        And User sends a DELETE request to delete history override
        # Edit history override values
        And User sets PUT api to update history override with the following data:
            | firstMonth | secondMonth | thirdMonth | fourthMonth | fifthMonth | sixthMonth | seventhMonth | eighthMonth | ninthMonth | tenthMonth | eleventhMonth | twelfthMonth |
            | 4          | 9           | 14         | 2           | 16         | 8          | 23           | 1           | 5          | 10         | 21            | 12           |
            |            |             | 23         |             |            | 19         |              | 15          |            |            |               |              |
            |            |             |            |             |            |            |              |             |            |            |               |              |
            |            |             |            |             |            |            |              |             |            |            |               |              |
        And User sends a PUT request to update history override values
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract of update history override api
        # Turn ON Backfill feature
        And User sets PUT api endpoint to edit <editColumn> of the above item for company type <companyType> with new value: <value>
        And User sends a PUT request to edit the item
        And The new <editColumn> of item must be updated successfully
        # Get history override
        And User sets GET api endpoint to get history override of item
        And User sends a GET request to get history override of item
        And User checks API contract of get history override of item api
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Get Company info before run forecast
        And User sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Run forecast
        And User sets POST api to run forecast
        And User sends a POST request to run forecast
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks that the lastForecastDate field was updated and jobInitiator is null in company detail information after running forecast
        # Get item result to check history override values
        And User sets GET api endpoint to get results of item
        When User sends a GET request to get results of item
        Then User checks API contract of get results of item
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Rule: Just fill in the months have no data
        # Example for this case:
        # 1st year: same user edit
        # 2nd year: empty month will be filled same data of 1st year, months with data (thirthMonth, sixthMonth, eighthMonth) are not filled.
        # 3rd year: same user edit
        And User checks override history values must be displayed exactly in Purchasing as the following data:
            | firstMonth | secondMonth | thirthMonth | fourthMonth | fifthMonth | sixthMonth | seventhMonth | eighthMonth | ninthMonth | tenthMonth | eleventhMonth | twelfthMonth |
            | 4          | 9           | 14          | 2           | 16         | 8          | 23           | 1           | 5          | 10         | 21            | 12           |
            | 4          | 9           | 23          | 2           | 16         | 19         | 23           | 15          | 5          | 10         | 21            | 12           |
            | 4          | 9           | 14          | 2           | 16         | 8          | 23           | 1           | 5          | 10         | 21            | 12           |
            |            |             |             |             |            |            |              |             |            |            |               | 12           |
        Examples:
            | TC_ID       | companyType | email                      | limitRow | expectedStatus | expectedStatusText | editColumn  | value |
            | TC_BFV003_1 | CSV         | testautoforecast@gmail.com | 20       | 200            | OK                 | useBackfill | true  |
            | TC_BFV003_2 | ASC         | testautoforecast@gmail.com | 20       | 200            | OK                 | useBackfill | true  |
            | TC_BFV003_3 | QBFS        | testautoforecast@gmail.com | 20       | 200            | OK                 | useBackfill | true  |

    @TC_BFV004 @smoke-test-api @regression-api @api-backfill-value @bug-1954
    Scenario Outline: <TC_ID> - Verify that the system can backfill for 37 months( 12 months of 1st year, 12 months of 2nd year, 12 months of 3rd year, the last month of 4th year) with the 1st year has full values and the 3rd year has some values for <companyType> company
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User picks a random item which does not have Purchase As
        And User saves the item key
        # Turn ON Override history
        And User sets PUT api endpoint to edit useHistoryOverride of the above item for company type <companyType> with new value: <value>
        And User sends a PUT request to edit the item
        And The expected status code should be <expectedStatus>
        # Delete all history-override values of item
        And User sets DELETE api to delete history override
        And User sends a DELETE request to delete history override
        # Edit history override values
        And User sets PUT api to update history override with the following data:
            | firstMonth | secondMonth | thirdMonth | fourthMonth | fifthMonth | sixthMonth | seventhMonth | eighthMonth | ninthMonth | tenthMonth | eleventhMonth | twelfthMonth |
            | 4          | 9           | 14         | 2           | 16         | 8          | 23           | 1           | 5          | 10         | 21            | 12           |
            |            |             |            |             |            |            |              |             |            |            |               |              |
            |            |             | 23         |             |            | 19         |              | 15          |            |            |               |              |
            |            |             |            |             |            |            |              |             |            |            |               |              |
        And User sends a PUT request to update history override values
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract of update history override api
        # Turn ON Backfill feature
        And User sets PUT api endpoint to edit <editColumn> of the above item for company type <companyType> with new value: <value>
        And User sends a PUT request to edit the item
        And The new <editColumn> of item must be updated successfully
        # Get history override
        And User sets GET api endpoint to get history override of item
        And User sends a GET request to get history override of item
        And User checks API contract of get history override of item api
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Get Company info before run forecast
        And User sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Run forecast
        And User sets POST api to run forecast
        And User sends a POST request to run forecast
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks that the lastForecastDate field was updated and jobInitiator is null in company detail information after running forecast
        # Get item result to check history override values
        And User sets GET api endpoint to get results of item
        When User sends a GET request to get results of item
        Then User checks API contract of get results of item
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Rule: Just fill in the months have no data
        # Example for this case:
        # 1st year: same user edit
        # 2nd year: same user edit
        # 3rd year: empty month will be filled same data of 1st year, months with data (thirthMonth, sixthMonth, eighthMonth) are not filled.
        And User checks override history values must be displayed exactly in Purchasing as the following data:
            | firstMonth | secondMonth | thirthMonth | fourthMonth | fifthMonth | sixthMonth | seventhMonth | eighthMonth | ninthMonth | tenthMonth | eleventhMonth | twelfthMonth |
            | 4          | 9           | 14          | 2           | 16         | 8          | 23           | 1           | 5          | 10         | 21            | 12           |
            | 4          | 9           | 14          | 2           | 16         | 8          | 23           | 1           | 5          | 10         | 21            | 12           |
            | 4          | 9           | 23          | 2           | 16         | 19         | 23           | 15          | 5          | 10         | 21            | 12           |
            |            |             |             |             |            |            |              |             |            |            |               | 12           |
        Examples:
            | TC_ID       | companyType | email                      | limitRow | expectedStatus | expectedStatusText | editColumn  | value |
            | TC_BFV004_1 | CSV         | testautoforecast@gmail.com | 20       | 200            | OK                 | useBackfill | true  |
            | TC_BFV004_2 | ASC         | testautoforecast@gmail.com | 20       | 200            | OK                 | useBackfill | true  |
            | TC_BFV004_3 | QBFS        | testautoforecast@gmail.com | 20       | 200            | OK                 | useBackfill | true  |

    @TC_BFV005 @smoke-test-api @regression-api @api-backfill-value
    Scenario Outline: <TC_ID> - Verify that the system will fill "0" for orther months. if the 1st year has no value and the 2nd year has full values for <companyType>
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User picks a random item which does not have Purchase As
        And User saves the item key
        # Turn ON Override history
        And User sets PUT api endpoint to edit useHistoryOverride of the above item for company type <companyType> with new value: <value>
        And User sends a PUT request to edit the item
        And The expected status code should be <expectedStatus>
        # Delete all history-override values of item
        And User sets DELETE api to delete history override
        And User sends a DELETE request to delete history override
        # Edit history override values
        And User sets PUT api to update history override with the following data:
            | firstMonth | secondMonth | thirdMonth | fourthMonth | fifthMonth | sixthMonth | seventhMonth | eighthMonth | ninthMonth | tenthMonth | eleventhMonth | twelfthMonth |
            |            |             |            |             |            |            |              |             |            |            |               |              |
            | 4          | 9           | 14         | 2           | 16         | 8          | 23           | 1           | 5          | 10         | 21            | 12           |
            |            |             |            |             |            |            |              |             |            |            |               |              |
            |            |             |            |             |            |            |              |             |            |            |               |              |
        And User sends a PUT request to update history override values
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract of update history override api
        # Turn ON Backfill feature
        And User sets PUT api endpoint to edit <editColumn> of the above item for company type <companyType> with new value: <value>
        And User sends a PUT request to edit the item
        And The new <editColumn> of item must be updated successfully
        # Get history override
        And User sets GET api endpoint to get history override of item
        And User sends a GET request to get history override of item
        And User checks API contract of get history override of item api
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Get Company info before run forecast
        And User sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Run forecast
        And User sets POST api to run forecast
        And User sends a POST request to run forecast
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks that the lastForecastDate field was updated and jobInitiator is null in company detail information after running forecast
        # Get item result to check history override values
        And User sets GET api endpoint to get results of item
        When User sends a GET request to get results of item
        Then User checks API contract of get results of item
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks override history values must be displayed exactly in Purchasing as the following data:
            | firstMonth | secondMonth | thirthMonth | fourthMonth | fifthMonth | sixthMonth | seventhMonth | eighthMonth | ninthMonth | tenthMonth | eleventhMonth | twelfthMonth |
            | 0          | 0           | 0           | 0           | 0          | 0          | 0            | 0           | 0          | 0          | 0             | 0            |
            | 4          | 9           | 14          | 2           | 16         | 8          | 23           | 1           | 5          | 10         | 21            | 12           |
            |            |             |             |             |            |            |              |             |            |            |               |              |
            |            |             |             |             |            |            |              |             |            |            |               |              |
        Examples:
            | TC_ID       | companyType | email                      | limitRow | expectedStatus | expectedStatusText | editColumn  | value |
            | TC_BFV005_1 | CSV         | testautoforecast@gmail.com | 20       | 200            | OK                 | useBackfill | true  |
            | TC_BFV005_2 | ASC         | testautoforecast@gmail.com | 20       | 200            | OK                 | useBackfill | true  |
            | TC_BFV005_3 | QBFS        | testautoforecast@gmail.com | 20       | 200            | OK                 | useBackfill | true  |

    @TC_BFV006 @smoke-test-api @regression-api @api-backfill-value
    Scenario Outline: <TC_ID> - Verify that the system will fill "0" for orther months. if the 1st year, 2nd year has no value and the 3rd year has full values for <companyType>
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User picks a random item which does not have Purchase As
        And User saves the item key
        # Turn ON Override history
        And User sets PUT api endpoint to edit useHistoryOverride of the above item for company type <companyType> with new value: <value>
        And User sends a PUT request to edit the item
        And The expected status code should be <expectedStatus>
        # Delete all history-override values of item
        And User sets DELETE api to delete history override
        And User sends a DELETE request to delete history override
        # Edit history override values
        And User sets PUT api to update history override with the following data:
            | firstMonth | secondMonth | thirdMonth | fourthMonth | fifthMonth | sixthMonth | seventhMonth | eighthMonth | ninthMonth | tenthMonth | eleventhMonth | twelfthMonth |
            |            |             |            |             |            |            |              |             |            |            |               |              |
            |            |             |            |             |            |            |              |             |            |            |               |              |
            | 4          | 9           | 14         | 2           | 16         | 8          | 23           | 1           | 5          | 10         | 21            | 12           |
            |            |             |            |             |            |            |              |             |            |            |               |              |
        And User sends a PUT request to update history override values
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract of update history override api
        # Turn ON Backfill feature
        And User sets PUT api endpoint to edit <editColumn> of the above item for company type <companyType> with new value: <value>
        And User sends a PUT request to edit the item
        And The new <editColumn> of item must be updated successfully
        # Get history override
        And User sets GET api endpoint to get history override of item
        And User sends a GET request to get history override of item
        And User checks API contract of get history override of item api
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Get Company info before run forecast
        And User sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Run forecast
        And User sets POST api to run forecast
        And User sends a POST request to run forecast
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks that the lastForecastDate field was updated and jobInitiator is null in company detail information after running forecast
        # Get item result to check history override values
        And User sets GET api endpoint to get results of item
        When User sends a GET request to get results of item
        Then User checks API contract of get results of item
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks override history values must be displayed exactly in Purchasing as the following data:
            | firstMonth | secondMonth | thirthMonth | fourthMonth | fifthMonth | sixthMonth | seventhMonth | eighthMonth | ninthMonth | tenthMonth | eleventhMonth | twelfthMonth |
            | 0          | 0           | 0           | 0           | 0          | 0          | 0            | 0           | 0          | 0          | 0             | 0            |
            | 0          | 0           | 0           | 0           | 0          | 0          | 0            | 0           | 0          | 0          | 0             | 0            |
            | 4          | 9           | 14          | 2           | 16         | 8          | 23           | 1           | 5          | 10         | 21            | 12           |
            |            |             |             |             |            |            |              |             |            |            |               |              |
        Examples:
            | TC_ID       | companyType | email                      | limitRow | expectedStatus | expectedStatusText | editColumn  | value |
            | TC_BFV006_1 | CSV         | testautoforecast@gmail.com | 20       | 200            | OK                 | useBackfill | true  |
            | TC_BFV006_2 | ASC         | testautoforecast@gmail.com | 20       | 200            | OK                 | useBackfill | true  |
            | TC_BFV006_3 | QBFS        | testautoforecast@gmail.com | 20       | 200            | OK                 | useBackfill | true  |
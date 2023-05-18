@test-api @run-forecast 
Feature: APIs: GET /api/item?summary=true&companyKey=<companyKey>&companyType=<companyType>, Purchasing, Restock Calculation
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies

    #getItemSummary
    @TC_GIS001 @api-dashboard @api-item @api-get-item-summary
    Scenario Outline: TC_GIS001 - Verify user <email> could call this API to get item summary by using company key and company type
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header

        # Get Company info before run forecast
        And user sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        # Run Forecast
        And User sets POST api to run forecast
        And User sends a POST request to run forecast
        And User checks that the lastForecastDate field was updated and jobInitiator is null in company detail information after running forecast

        And User sets GET api endpoint to get item summary
        When User sends a GET request to get item summary
        Then The expected status code should be <expectedStatus>
        And User checks API contract in item summary object are correct
        And User sends GET api request to get all items
        And User checks number Items Out of Stock in response of item summary is correct
        And User checks number Items Out of Stock - Warehouse in response of item summary is correct
        And User checks number New Items last 30 days in response of item summary is correct
        And User checks number Items without Vendors Assigned in response of item summary is correct

        Examples:
            | user  | email                      | password  | companyType | expectedStatus | companyKey |
            | admin | testautoforecast@gmail.com | Test1111# | CSV         | 200            | random     |
            | admin | testautoforecast@gmail.com | Test1111# | ASC         | 200            | random     |
            | admin | testautoforecast@gmail.com | Test1111# | QBFS        | 200            | random     |

    #Bug TC_GIS002 and TC_GIS002, return status code 200 when cookie invalid.
    @TC_GIS002 @bug-permission @low-bug-skip @api-dashboard @api-item @api-get-item-summary
    Scenario Outline: <scenario> - Verify error when user sends this API with <cookie> cookie, <companyKeyHeader> companyKey, <companyTypeHeader> companyType value in header
        Given User picks random company which has onboarded in above response  
        But User sets <cookie> cookie of <email> and <companyKeyHeader> companyKey and <companyTypeHeader> companyType in the header
        And User sets GET api endpoint to get item summary
        When User sends a GET request to get item summary
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | scenario    | email                      | companyKey | cookie  | companyKeyHeader | companyTypeHeader | expectedStatus | expectedStatusText    |
            | TC_GIS002_1 | testautoforecast@gmail.com | random     | invalid | invalid          | invalid           | 401            | Unauthorized          |
            | TC_GIS002_2 | testautoforecast@gmail.com | random     | invalid | valid            | valid             | 401            | Unauthorized          |
            | TC_GIS002_3 | testautoforecast@gmail.com | random     | valid   | invalid          | invalid           | 400            | Company not found.    |
            | TC_GIS002_4 | testautoforecast@gmail.com | random     | valid   |                  |                   | 500            | Internal Server Error |

    @TC_GIS003 @api-dashboard @api-item @api-get-item-summary
    Scenario Outline: TC_GIS003 - Verify user <userA> could not call this API to get item summary of company which does not belongs to her
        Given User picks random company which has onboarded in above response
        And User has valid connect.sid of "<userA>" after send a POST request with payload as email: "<userA>" and password: "<password>"
        But User sets valid cookie of <userA> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item summary
        When User sends a GET request to get item summary
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | userA               | userB                      | password  | companyKey | expectedStatus | expectedStatusText |
            | may27user@gmail.com | testautoforecast@gmail.com | Test1111# | random     | 400            | Company not found. |

    #restockCalculation
    @TC_ASC_RC001 @smoke-test-api @regression-api @restock-calculation
    Scenario Outline: <TC_ID> - Verify user <email> could call APIs to compare and check the formulas
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        # # Get Company info before run forecast
        # And user sets GET api endpoint to get company information by company key
        # And User sends a GET request to get company information by company key
        # # Run Forecast
        # And User sets POST api to run forecast
        # And User sends a POST request to run forecast
        # And The expected status code should be <expectedStatus>
        # And The status text is "<expectedStatusText>"
        # And User checks that the lastForecastDate field was updated and jobInitiator is null in company detail information after running forecast
        And User sets GET api method to get restock suggestion by vendor
        And User sends a GET api method to get restock suggestion by vendor
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Select option All Suppliers because it contains a lot of Items
        And User selects the All Suppliers in Supplier list
        And User checks API contract of get restock suggestion by vendor api
        And User sends a GET api method to count all Items have alerts in All Suppliers
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User saves needed alert items information
        And User compares and checks the total of Items which have alerts
        # Get Desc items to have data of Recommendation
        And User sets GET api method to get Items belonged to All Suppliers with direction: <direction>
        And User sends a GET api method to get Items belonged to All Suppliers
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User picks random item in Item list
        And User checks API contract of get items in Item list
        And User saves needed values for calculations
        And User checks value Sum on grid
        And User checks value Total Inbound on grid
        And User checks value Estimated Margin on grid
        And User checks value Suggestions on grid
        And User sets GET api method to get restock calculation of specific Item
        And User sends a GET api method to get restock calculation of specific Item
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User sets GET api method to get restock calculation of specific Item
        And User sends a GET api method to get restock calculation of specific Item
        And User checks API contract of get restock calculation api
        And User sets GET api endpoint to get item by filtered
        And User sends a GET request to get item by by filtered
        And User saves values in Restock model for calculations
        And User checks value Daily Sales Rate in Restock Model
        And User checks value Adj Daily Sales Rate in Restock Model
        And User checks value Average Daily Sales Rate in Restock Model
        And User checks value Required Inventory in Restock Model
        And User checks value Inventory Available in Restock Model
        And User checks value Recommendations in Restock Model

        Examples:
            | TC_ID          | companyType | email                      | direction | expectedStatus | expectedStatusText |
            | TC_ASC_RC001_1 | ASC         | testautoforecast@gmail.com | asc       | 200            | OK                 |
            | TC_ASC_RC001_2 | ASC         | testautoforecast@gmail.com | desc      | 200            | OK                 |    
    
    #viewPurchasingMySuggested
    @TC_PMS001-4 @smoke-test-api @api-purchasing @api-purchasing-mySuggested
    Scenario Outline: <TC_ID> - Verify Purchasing My Suggested POs and Items in PO on <companyType>
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        # # Get Company info before run forecast
        # And user sets GET api endpoint to get company information by company key
        # And User sends a GET request to get company information by company key
        # # Run Forecast
        # And User sets POST api to run forecast
        # And User sends a POST request to run forecast
        # And User checks that the lastForecastDate field was updated and jobInitiator is null in company detail information after running forecast

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
        And User picks max 10 random items in the above list items
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
        And User picks max 10 random items in the above list items
        And User checks random items has status is Active
        And User checks supplier name of above random items in Manage Company Items

        Examples:
            | TC_ID     | user  | email                      | password  | companyType | expectedStatus |
            | TC_PMS001 | admin | testautoforecast@gmail.com | Test1111# | CSV         | 200            |
            | TC_PMS002 | admin | testautoforecast@gmail.com | Test1111# | ASC         | 200            |
            | TC_PMS003 | admin | testautoforecast@gmail.com | Test1111# | QBFS        | 200            |
            # | TC_PMS004 | admin | testautoforecast@gmail.com | Test1111# | QBO         | 200            |

    # viewPurchasingCustom 
    @TC_PC001-4 @smoke-test-api @api-purchasing @api-purchasing-custom
    Scenario Outline: <TC_ID> - Verify items on Purchasing Custom of company <companyType>
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        # # Get Company info before run forecast
        # And user sets GET api endpoint to get company information by company key
        # And User sends a GET request to get company information by company key
        # # Run Forecast
        # And User sets POST api to run forecast
        # And User sends a POST request to run forecast
        # And User checks that the lastForecastDate field was updated and jobInitiator is null in company detail information after running forecast
        And User sets GET api endpoint to get count items in Purchasing Custom
        When User sends a GET request to get count items in Purchasing Custom
        Then The expected status code should be <expectedStatus>
        And User checks API contract get count items in purchasing custom are correct
        And User sets GET api endpoint to count items that is active and have lotMultipleItemKey is NULL
        And User sends a GET request to get count items active and have lotMultipleItemKey is NULL
        And User checks total items in Custom EQUALS total items active and have lotMultipleItemKey is NULL
        And User sets GET api endpoint to get items in Purchasing Custom
        And User sends a GET request to get items in Purchasing Custom
        And The expected status code should be <expectedStatus>
        And User checks API contract of item object is purchasing is correct
        And User picks max 10 random items in the above list items
        And User checks random items has status is Active

        Examples:
            | TC_ID    | user  | email                      | password  | companyType | expectedStatus |
            | TC_PC001 | admin | testautoforecast@gmail.com | Test1111# | CSV         | 200            |
            | TC_PC002 | admin | testautoforecast@gmail.com | Test1111# | ASC         | 200            |
            | TC_PC003 | admin | testautoforecast@gmail.com | Test1111# | QBFS        | 200            |
            # | TC_PC004 | admin | testautoforecast@gmail.com | Test1111# | QBO         | 200            |
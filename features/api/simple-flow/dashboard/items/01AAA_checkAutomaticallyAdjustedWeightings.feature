@test-api @api-dashboard @api-items @check-settings
Feature: API_Item User checks Automatically Adjusted Weightings setting for RestockAMZ and Purchasing

    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies

    # We use company "Fishers Finery Amazon" to check Automatically Adjusted Weightings setting
    @TCAAWS001 @purchasing
    Scenario Outline: <TC_ID> - Verify the Automatically Adjusted Weightings setting will be applied in Purchasing and RestockAMZ
        Given User picks a company with type <companyType> and name <companyName> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        # Set Automatically Adjusted Weightings in Purchasing and RestockAMZ
        And User checks Purchasing settings is Automatically Adjusted or not
        And User finds the list items contain value: <valueContain>
        And User picks a random item in above list items
        And User saves the item key
        And User checks API contract essential types in item object are correct
        # Get setting from RestockAMZ of Item
        And User sets GET api endpoint to get restock suggestion restockAMZ of an above item
        And User sends GET request to get restock suggestion restockAMZ of an above item
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        # Get setting from Purchasing of Item
        And User sets GET api endpoint to get restock suggestion purchasing of an above item
        And User sends GET request to get restock suggestion purchasing of an above item
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User saves needed value to check Automatically Adjusted Weightings setting
        And User checks Automatically Adjusted setting has been applied in Purchasing and RestockAMZ

        Examples:
            | TC_ID     | companyType | companyName           | email                      | expectedStatus | expectedStatusText | valueContain |
            | TCAAWS001 | ASC         | Fishers Finery Amazon | testautoforecast@gmail.com | 200            | OK                 | HB-          |

    @TC_AAWSL001 @purchasing
    Scenario Outline: <TC_ID> - Verify the Automatically Adjusted Weightings setting will be applied in Purchasing and RestockAMZ based on the setting of Company Detail
        Given User picks a company with type <companyType> and name <companyName> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User sets GET api endpoint to get suppliers with limit row: 10
        And User sends a GET request to get list suppliers
        # Set Automatically Adjusted Weightings in Company detail
        And User checks Purchasing settings is Automatically Adjusted or not
        And User finds the list items contain value: <valueContain>
        And User picks a random item in above list items
        And User saves the item key
        And User checks API contract essential types in item object are correct
        # Set supplier of item = null => The setting of item based on the setting of company detail
        And User sets api endpoint to edit some values of a item
            | supplierName |
            | null         |
        And User sends a PUT request to edit the item
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        # Get setting from RestockAMZ of Item
        And User sets GET api endpoint to get restock suggestion restockAMZ of an above item
        And User sends GET request to get restock suggestion restockAMZ of an above item
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        # Get setting from Purchasing of Item
        And User sets GET api endpoint to get restock suggestion purchasing of an above item
        And User sends GET request to get restock suggestion purchasing of an above item
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User saves needed value to check Automatically Adjusted Weightings setting
        And User checks Automatically Adjusted setting has been applied in Purchasing and RestockAMZ
        Examples:
            | TC_ID       | companyType | companyName           | email                      | expectedStatus | expectedStatusText | valueContain |
            | TC_AAWSL001 | ASC         | Fishers Finery Amazon | testautoforecast@gmail.com | 200            | OK                 | HB-          |

    @TC_AAWSL002 @purchasing
    Scenario Outline: <TC_ID> - Verify the Automatically Adjusted Weightings setting will be applied in Purchasing and RestockAMZ based on the setting of Supplier
        Given User picks a company with type <companyType> and name <companyName> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        # Set Sale velocity settings = "Average" in Company Detail
        And User sets PUT api endpoint to update "Purchasing Daily Sales Rate Rules > Average" in the "Manage Company > Company Details" of a bove company with the total percentage is 100%
        And User sends PUT request to update "Purchasing Daily Sales Rate Rules > Average"
        And User finds the list items contain value: <valueContain>
        And User picks a random item in above list items
        And User saves the item key
        And User checks API contract essential types in item object are correct
        # Set Sale velocity settings = "Automatically Adjusted Weightings" of supllier
        And User sets GET api endpoint to get suppliers with limit row: 10
        And User sends a GET request to get list suppliers
        And User picks random supplier in above response
        And User saves the supplier key
        And User sets PUT api endpoint to update sale velocity settings with type "Automatically Adjusted Weightings" of supplier
        When User sends PUT request to update sale velocity settings with type "Automatically Adjusted Weightings" of above supplier with the total percentage is 100%
        # Set supplier for item => The setting of item based on the setting of supplier
        And User sets api endpoint to edit some values of a item
            | supplierName                 |
            | supplierUpdatedSalesVelocity |
        And User sends a PUT request to edit the item
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        # Get setting from RestockAMZ of Item
        And User sets GET api endpoint to get restock suggestion restockAMZ of an above item
        And User sends GET request to get restock suggestion restockAMZ of an above item
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        # Get setting from Purchasing of Item
        And User sets GET api endpoint to get restock suggestion purchasing of an above item
        And User sends GET request to get restock suggestion purchasing of an above item
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User saves needed value to check Automatically Adjusted Weightings setting
        And User checks Automatically Adjusted setting has been applied in Purchasing and RestockAMZ
        Examples:
            | TC_ID       | companyType | companyName           | email                      | expectedStatus | expectedStatusText | valueContain                                             |
            | TC_AAWSL002 | ASC         | Fishers Finery Amazon | testautoforecast@gmail.com | 200            | OK                 | Edited Vendor Purchasing Daily Sales Rate Settings -Auto |

    @TC_AAWSL003 @purchasing
    Scenario Outline: <TC_ID> - Verify the Automatically Adjusted Weightings setting will be applied in Purchasing and RestockAMZ based on itself
        Given User picks a company with type <companyType> and name <companyName> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        # Set Sale velocity settings = "Average" in Company Detail
        And User sets PUT api endpoint to update "Purchasing Daily Sales Rate Rules > Average" in the "Manage Company > Company Details" of a bove company with the total percentage is 100%
        And User sends PUT request to update "Purchasing Daily Sales Rate Rules > Average"
        And User finds the list items contain value: <valueContain>
        And User picks a random item in above list items
        And User saves the item key
        And User checks API contract essential types in item object are correct
        # Set Purchasing Sale velocity settings = "Automatically Adjusted Weightings" of item, => The setting of item based on itself
        And User sets PUT api endpoint to update item sales velocity setting with type "Automatically Adjusted Weightings"
        When User sends PUT request to update item purchasing sales velocity setting type "Automatically Adjusted Weightings" with the total percentage is 100%
        # Set RestockAMZ Sale velocity settings = "Automatically Adjusted Weightings" of item, => The setting of item based on itself
        When User sends PUT request to update item restockAMZ sales velocity setting type "Automatically Adjusted Weightings" with the total percentage is 100%        
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        # Get setting from RestockAMZ of Item
        And User sets GET api endpoint to get restock suggestion restockAMZ of an above item
        And User sends GET request to get restock suggestion restockAMZ of an above item
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        # Get setting from Purchasing of Item
        And User sets GET api endpoint to get restock suggestion purchasing of an above item
        And User sends GET request to get restock suggestion purchasing of an above item
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User saves needed value to check Automatically Adjusted Weightings setting
        And User checks Automatically Adjusted setting has been applied in Purchasing and RestockAMZ
        Examples:
            | TC_ID       | companyType | companyName           | email                      | expectedStatus | expectedStatusText | valueContain                                           |
            | TC_AAWSL003 | ASC         | Fishers Finery Amazon | testautoforecast@gmail.com | 200            | OK                 | Edited Item Purchasing Daily Sales Rate Settings -Auto |

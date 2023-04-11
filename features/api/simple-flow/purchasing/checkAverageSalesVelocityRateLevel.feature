@test-api @api-regression @api-dashboard @api-company @api-edit-purchasing-daily-sale-rate-rules-average @check-average-sales-velocity-rate-level
Feature: API Purchasing Setting for Daily Sale Rate
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies

    @TC_CSVRL001
    Scenario Outline: <TC_ID> - Verify that when setting "Purchasing Daily Sales Rate Rules > Average" in the "Manage Company > Company Details" then applying this setting for all items in the Purchasing > Custom
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sends a GET request to get company information of <email> by company key
        And User sets PUT api endpoint to update "Purchasing Daily Sales Rate Rules > Average" in the "Manage Company > Company Details" of a bove company with the total percentage is 100%
        When User sends PUT request to update "Purchasing Daily Sales Rate Rules > Average"
        Then The expected status code should be <expectedStatus>
        And User sets GET api endpoint to get items in Purchasing Custom to check purchasing daily sales rate
        And User sends a GET request to get items in Purchasing Custom to check purchasing daily sales rate
        And User selects random items in Purchasing Custom
        And User sets GET api endpoint to get restock suggestion purchasing
        And User sends GET request to get restock suggestion purchasing of above items
        And User checks purchasing daily sales rate of item using default setting on company detail

        Examples:
            | TC_ID         | companyType | companyKey | email                      | expectedStatus |
            | TC_CSVRL001_1 | ASC         | random     | testautoforecast@gmail.com | 200            |

    @TC_CSVRL001
    Scenario Outline: <TC_ID> - Verify that when setting "Purchasing Daily Sales Rate Rules > Average" in the "Manage Company > Company Details" then applying this setting for all items in the Purchasing > My Suggested
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sends a GET request to get company information of <email> by company key
        And User sets PUT api endpoint to update "Purchasing Daily Sales Rate Rules > Average" in the "Manage Company > Company Details" of a bove company with the total percentage is 100%
        When User sends PUT request to update "Purchasing Daily Sales Rate Rules > Average"
        Then The expected status code should be <expectedStatus>
        And User sets GET api endpoint to get count items in PO by vendor key <vendorKey>
        And User sends a GET request to get count items in PO by vendor by vendor key
        And User sets api endpoint to get list items in PO of vendor key
        And User sends a POST request to get list items in PO by vendor by vendor key
        And User selects random items in Purchasing My Suggested
        And User sets GET api endpoint to get restock suggestion purchasing
        And User sends GET request to get restock suggestion purchasing of above items
        And User checks purchasing daily sales rate of item using default setting on company detail

        Examples:
            | TC_ID         | companyType | companyKey | email                      | vendorKey | expectedStatus |
            | TC_CSVRL001_2 | ASC         | random     | testautoforecast@gmail.com | null      | 200            |

    @TC_CSVRL002
    Scenario Outline: <TC_ID> - Verify if an item has been assigned for a Supplier (Manage Company > Suppliers) then this item in "Purchasing > Custom" will be applied to the setting the same as that supplier
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers with limit row: <limitRow>
        And User sends a GET request to get list suppliers
        And User picks random supplier in above response
        And User saves the supplier key
        And User sets PUT api endpoint to update sale velocity settings with type "Average" of supplier
        When User sends PUT request to update sale velocity settings with type "Average" of above supplier with the total percentage is 100%
        Then The expected status code should be <expectedStatus>
        And User sets GET api endpoint to get a item in "Manage Company > Item" to assign supplier
        And User sends GET request to get a item in "Manage Company > Item" to assign supplier
        And User sets PUT api endpoint to edit supplierName of the above item for company type <companyType> with new value: <value>
        And User sends a PUT request to edit the item
        And User sets GET api endpoint to get restock suggestion purchasing of an above item
        And User sends GET request to get restock suggestion purchasing of an above item
        And User checks average daily sales rate number of item in "Purchasing > Custom" must be the same settings of its supplier
        And User sets PUT api endpoint to edit supplierName of the above item for company type <companyType> with new value: null
        And User sends a PUT request to edit the item

        Examples:
            | TC_ID         | companyType | email                      | limitRow | value                        | expectedStatus |
            | TC_CSVRL002_1 | ASC         | testautoforecast@gmail.com | 10       | supplierUpdatedSalesVelocity | 200            |

    @TC_CSVRL002
    Scenario Outline: <TC_ID> - Verify if an item has been assigned for a Supplier (Manage Company > Suppliers) then this item in "Purchasing > My Suggested" will be applied to the setting the same as that supplier
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers with limit row: <limitRow>
        And User sends a GET request to get list suppliers
        And User picks random supplier in above response
        And User saves the supplier key
        And User sets PUT api endpoint to update sale velocity settings with type "Average" of supplier
        When User sends PUT request to update sale velocity settings with type "Average" of above supplier with the total percentage is 100%
        Then The expected status code should be <expectedStatus>
        And User sets GET api endpoint to get list items in "Purchasing > My Suggested"
        And User sends GET request to get list items in "Purchasing > My Suggested"
        And User save a random item in above list suggested items to assign supplier
        And User sets PUT api endpoint to edit supplierName of the above item for company type <companyType> with new value: <value>
        And User sends a PUT request to edit the item
        And User sets GET api endpoint to get restock suggestion purchasing of an above item
        And User sends GET request to get restock suggestion purchasing of an above item
        And User checks average daily sales rate number of item in "Purchasing > My Suggested" must be the same settings of its supplier
        And User sets PUT api endpoint to edit supplierName of the above item for company type <companyType> with new value: null
        And User sends a PUT request to edit the item

        Examples:
            | TC_ID         | companyType | email                      | limitRow | value                        | expectedStatus |
            | TC_CSVRL002_2 | ASC         | testautoforecast@gmail.com | 10       | supplierUpdatedSalesVelocity | 200            |

    @TC_CSVRL003
    Scenario Outline: <TC_ID> - Verify If an item has been edited settings directly in that item (Manage Company > Items) then this item will be applied to this setting in the Purchasing > Custom
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get items in "Manage Company > Item"
        And User sends GET request to get items in "Manage Company > Item"
        And User picks random a item from above list items
        And User sets PUT api endpoint to update item sales velocity setting with type "Average"
        When User sends PUT request to update item sales velocity setting type "Average" with the total percentage is 100%
        Then The expected status code should be <expectedStatus>
        And User sets GET api endpoint to get item in Purchasing Custom to check purchasing daily sales rate
        And User sends a GET request to get item in Purchasing Custom to check purchasing daily sales rate
        And User sets GET api endpoint to get restock suggestion purchasing of an above item
        And User sends GET request to get restock suggestion purchasing of an above item
        And User checks average daily sales rate number of item in "Purchasing > Custom" as updated above

        Examples:
            | TC_ID         | companyType | email                      | limitRow | expectedStatus |
            | TC_CSVRL003_1 | ASC         | testautoforecast@gmail.com | 10       | 200            |

    @TC_CSVRL003
    Scenario Outline: <TC_ID> - Verify If an item has been edited settings directly in that item (Manage Company > Items) then this item will be applied to this setting in the Purchasing > My Suggested
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get list items in "Purchasing > My Suggested"
        And User sends GET request to get list items in "Purchasing > My Suggested"
        And User save a random item in above list suggested items
        And User sets PUT api endpoint to update item sales velocity setting with type "Average"
        When User sends PUT request to update item sales velocity setting type "Average" with the total percentage is 100%
        Then The expected status code should be <expectedStatus>
        And User sets GET api endpoint to get restock suggestion purchasing of an above item
        And User sends GET request to get restock suggestion purchasing of an above item
        And User checks average daily sales rate number of item in "Purchasing > My Suggested" as updated above

        Examples:
            | TC_ID         | companyType | email                      | expectedStatus |
            | TC_CSVRL003_2 | ASC         | testautoforecast@gmail.com | 200            |

    # We use company "amz-mx-13213515" for check Default PurchasingSaleVelocity
    @TC_CSVRL004
    Scenario Outline: <TC_ID> - Verify the percent default of "Average" is the same as (percent-default.png) for all company type
        Given User picks a company with type <companyType> and name <companyName> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get list items in "Purchasing > Custom" to check default purchasing daily sales rate
        And User sends a GET request to get list items in items in "Purchasing > Custom" to check default purchasing daily sales rate
        And User sets GET api endpoint to get percent default of "Average"
        When User sends GET request to get percent default of "Average"
        Then User checks the percent default of "Average" is the same as setting in company default
        And User sets GET api endpoint to get list items in "Purchasing > My Suggested" to check default purchasing daily sales rate
        And User sends a GET request to get list items in items in "Purchasing > My Suggested" to check default purchasing daily sales rate
        And User sets GET api endpoint to get percent default of "Average"
        And User sends GET request to get percent default of "Average"
        And User checks the percent default of "Average" is the same as setting in company default

        Examples:
            | TC_ID       | companyType | companyName     | email                      | expectedStatus |
            | TC_CSVRL004 | ASC         | amz-mx-13213515 | testautoforecast@gmail.com | 200            |
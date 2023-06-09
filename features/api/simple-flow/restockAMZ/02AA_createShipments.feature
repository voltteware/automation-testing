@test-api @regression-api @create-shipments @api-restockAMZ
Feature: API_Regression User can create shipments from Warehouse/Supplier
    Background: Send POST /login request to login before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies

    # Create shipments from Supplier
    @TC_ASC_CS001 @smoke-test-api @retry
    Scenario Outline: <TC_ID> - Verify user <email> could call APIs to create shipments from Supplier without Case packs
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
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
        And User sets GET api method to get Items belonged to All Suppliers with field: <field> direction: <direction> contain value: <valueContain>
        And User sends a GET api method to get Items belonged to All Suppliers
        # Item with Auto name cannot create shipment
        And User picks a random item which does not has Auto in the name in Item list
        And User checks API contract of get items in Item list
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User sets GET api endpoint to get Item by Item key
        And User sends a GET request to get Item by Item key
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract of get Item by Item key api
        And User sets GET api endpoint to get suppliers with limit row: <limitRow>
        And User sends a GET request to get list suppliers
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User picks random supplier in above response
        And User sets request body of edit item api with payload
            | editColumn   | companyType   | value   |
            | <editColumn> | <companyType> | <value> |
        And User sends a PUT request to edit the item
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User sets POST api endpoint to create Shipment
        And User sends a POST request to create Shipment
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract of create shipment api
        And User sets GET api endpoint to get Shipment info
        And User sends a GET request to get Shipment info
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract of get Shipment info api
        And User sets GET api endpoint to get items in shipments by restockType: <restockType>
        And User sends a GET request to get items in shipments by restockType: <restockType>
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User picks random item to check api contract
        And User checks API contract of get items in shipment
        And User sets GET api endpoint to check local qty error
        And User sends a GET request to check local qty error
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User sets GET api endpoint to get supplier address
        And User sends a GET request to get supplier address
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User picks random supplier address in above response
        And User checks API contract of get supplier address api
        And User sets PUT api endpoint to update shipment
        And User sends a PUT request to update shipment with casePackOption: <casePackOption>
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract of update shipment by shipment key api
        And User sets POST api endpoint to create shipment plan
        And User sends a POST request to create shipment plan
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User sets GET api endpoint to count items in Shipment Review with restockType: <restockType>
        And User sends a GET request to count items in Shipment Review
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User sets POST api endpoint to create shipment on Amazon
        And User sends a POST request to create shipment on Amazon
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User sets GET api endpoint to get items in shipments by restockType: <restockType>
        And User sends a GET request to get items in shipments by restockType: <restockType>
        And User checks and waits for Items can be updated in Shipment Review by restockType: <restockType>
        And User sets POST api endpoint to complete shipment
        And User sends a POST request to complete shipment
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Please ignore the message, I will find the root cause later
        # Call API to get list shipment to check the new created shipment
        When User sets GET api endpoint to find the new created shipment
        Then User sends a GET request to find the new created shipment
        And User checks the new created shipment: <shipmentStatus>
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract of get list shipments api

        Examples:
            | TC_ID        | companyType | casePackOption | restockType | editColumn   | value                        | email                      | direction | expectedStatus | expectedStatusText | limitRow | shipmentStatus | field                  | valueContain |
            | TC_ASC_CS001 | ASC         | No             | SUPPLIER    | supplierName | supplierUpdatedSalesVelocity | testautoforecast@gmail.com | desc      | 200            | OK                 | 10       | WORKING        | recommendedSupplierQty | HB           |

    @TC_ASC_CS002 @smoke-test-api
    Scenario Outline: <TC_ID> - Verify user <email> could call APIs to create shipments from Supplier having Case packs
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
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
        And User sets GET api method to get Items belonged to All Suppliers with field: <field> direction: <direction> contain value: <valueContain>
        And User sends a GET api method to get Items belonged to All Suppliers
        # Item with Auto name cannot create shipment
        And User picks a random item which does not has Auto in the name in Item list
        And User checks API contract of get items in Item list
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User sets GET api endpoint to get Item by Item key
        And User sends a GET request to get Item by Item key
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract of get Item by Item key api
        And User sets GET api endpoint to get suppliers with limit row: <limitRow>
        And User sends a GET request to get list suppliers
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User picks random supplier in above response
        And User sets request body of edit item api with payload
            | editColumn   | companyType   | value   |
            | <editColumn> | <companyType> | <value> |
        And User sends a PUT request to edit the item
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User sets POST api endpoint to create Shipment
        And User sends a POST request to create Shipment
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract of create shipment api
        And User sets GET api endpoint to get Shipment info
        And User sends a GET request to get Shipment info
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract of get Shipment info api
        And User sets GET api endpoint to get items in shipments by restockType: <restockType>
        And User sends a GET request to get items in shipments by restockType: <restockType>
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User picks random item to check api contract
        And User checks API contract of get items in shipment
        And User sets GET api endpoint to get supplier address
        And User sends a GET request to get supplier address
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User picks random supplier address in above response
        And User checks API contract of get supplier address api
        And User sets PUT api endpoint to update shipment
        And User sends a PUT request to update shipment with casePackOption: <casePackOption>
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract of update shipment by shipment key api
        And User sets PUT api endpoint to update shipment Item key
        And User sends a PUT request to update shipment Item key casePackOption: <casePackOption>
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract of update item shipment key
        And User sets GET api endpoint to check local qty error
        And User sends a GET request to check local qty error
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User sets GET api endpoint to export file
        And User sends a GET request to export file
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User sets GET api endpoint to get Shipment info
        And User sends a GET request to get Shipment info
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        When User sets DELETE api endpoint to delete shipment
        Then User sends a DELETE request to delete shipment
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User sets GET api endpoint to find the new created shipment
        And User sends a GET request to find the new created shipment
        And User checks the deleted shipments does not exist in the list

        Examples:
            | TC_ID        | companyType | casePackOption | restockType | editColumn   | value                        | email                      | direction | expectedStatus | expectedStatusText | limitRow | field                  | valueContain |
            | TC_ASC_CS002 | ASC         | Yes            | SUPPLIER    | supplierName | supplierUpdatedSalesVelocity | testautoforecast@gmail.com | asc       | 200            | OK                 | 10       | recommendedSupplierQty | HB           |

    # Create shipments from Warehouse
    @TC_ASC_CS003 @smoke-test-api @retry
    Scenario Outline: <TC_ID> - Verify user <email> could call APIs to create shipments from Warehouse without having Case pack
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        # Prepares shipment inventory csv file
        And User prepares the <fileName> file contains the list shipmentItem as following data:
            | SKU                 | Product Name | Warehouse Quantity |
            | HB-02-PC1-825-WHT-Q |              | 5                  |
        And User sets GET api to get signed request
        And User sends a GET request to get signed request
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User sets PUT api to upload file <fileName> to the Amazon S3
        And User sends a PUT request to upload file to the Amazon S3
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        # Create shipment from warehouse and upload warehouse inventory file
        And User sets POST api to create shipment from Warehouse with name:
            | shipmentName           |
            | ITC_shipment_auto_name |
        And User sends a POST request to create Shipment
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks API contract of create shipment api
        And User sets GET api endpoint to get Shipment info
        And User sends a GET request to get Shipment info
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks API contract of get Shipment info api
        # Get items in shipment
        And User sets GET api endpoint to get items in shipments by restockType: <restockType>
        And User sends a GET request to get items in shipments by restockType: <restockType>
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User picks random item to check api contract
        And User checks API contract of get items in shipment
        # Check upload inventory successfully
        And User checks items in the shipment must be the same as in csv file
        And User sets PUT api endpoint to update shipment Item key
        And User sends a PUT request to update shipment Item key casePackOption: <casePackOption>
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User sets GET api endpoint to check local qty error
        And User sends a GET request to check local qty error
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User sets GET api endpoint to get supplier address
        And User sends a GET request to get supplier address
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User picks random supplier address in above response
        And User checks API contract of get supplier address api
        And User sets PUT api endpoint to update shipment
        And User sends a PUT request to update shipment with casePackOption: <casePackOption>
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks API contract of update shipment by shipment key api
        And User sets POST api endpoint to create shipment plan
        And User sends a POST request to create shipment plan
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User sets GET api endpoint to count items in Shipment Review with restockType: <restockType>
        And User sends a GET request to count items in Shipment Review
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User sets POST api endpoint to create shipment on Amazon
        And User sends a POST request to create shipment on Amazon
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User sets GET api endpoint to get items in shipments by restockType: <restockType>
        And User sends a GET request to get items in shipments by restockType: <restockType>
        And User checks and waits for Items can be updated in Shipment Review by restockType: <restockType>
        And User sets POST api endpoint to complete shipment
        And User sends a POST request to complete shipment
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        # Please ignore the message, I will find the root cause later
        # Call API to get list shipment to check the new created shipment
        When User sets GET api endpoint to find the new created shipment
        Then User sends a GET request to find the new created shipment
        And User checks the new created shipment: <shipmentStatus>
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks API contract of get list shipments api

        Examples:
            | TC_ID        | companyType | restockType | fileName                         | expectedStatus | expectedStatusText | casePackOption | shipmentStatus |
            | TC_ASC_CS003 | ASC         | WAREHOUSE   | warehouse-inventory-template.csv | 200            | OK                 | No             | WORKING        |

    @TC_ASC_CS004 @smoke-test-api @retry
    Scenario Outline: <TC_ID> - Verify user <email> could call APIs to create shipments from Warehouse with having Case pack
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        # Prepares shipment inventory csv file
        And User prepares the <fileName> file contains the list shipmentItem as following data:
            | SKU                 | Product Name | Warehouse Quantity |
            | HB-02-PC1-825-WHT-Q |              | 5                  |
        And User sets GET api to get signed request
        And User sends a GET request to get signed request
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User sets PUT api to upload file <fileName> to the Amazon S3
        And User sends a PUT request to upload file to the Amazon S3
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        # Create shipment from warehouse and upload warehouse inventory file
        And User sets POST api to create shipment from Warehouse with name:
            | shipmentName           |
            | ITC_shipment_auto_name |
        And User sends a POST request to create Shipment
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks API contract of create shipment api
        And User sets GET api endpoint to get Shipment info
        And User sends a GET request to get Shipment info
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks API contract of get Shipment info api
        # Get items in shipment
        And User sets GET api endpoint to get items in shipments by restockType: <restockType>
        And User sends a GET request to get items in shipments by restockType: <restockType>
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User picks random item to check api contract
        And User checks API contract of get items in shipment
        # Check upload inventory successfully
        And User checks items in the shipment must be the same as in csv file
        And User checks API contract of create shipment api
        And User sets GET api endpoint to get supplier address
        And User sends a GET request to get supplier address
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User picks random supplier address in above response
        And User checks API contract of get supplier address api
        And User sets PUT api endpoint to update shipment
        And User sends a PUT request to update shipment with casePackOption: <casePackOption>
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks API contract of update shipment by shipment key api
        And User sets PUT api endpoint to update shipment Item key
        And User sends a PUT request to update shipment Item key casePackOption: <casePackOption>
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks API contract of update item shipment key
        And User sets GET api endpoint to check local qty error
        And User sends a GET request to check local qty error
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User sets GET api endpoint to export file
        And User sends a GET request to export file
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User sets GET api endpoint to get Shipment info
        And User sends a GET request to get Shipment info
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        When User sets DELETE api endpoint to delete shipment
        Then User sends a DELETE request to delete shipment
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User sets GET api endpoint to find the new created shipment
        And User sends a GET request to find the new created shipment
        And User checks the deleted shipments does not exist in the list

        Examples:
            | TC_ID        | companyType | restockType | fileName                         | expectedStatus | expectedStatusText | casePackOption |
            | TC_ASC_CS004 | ASC         | WAREHOUSE   | warehouse-inventory-template.csv | 200            | OK                 | Yes            |
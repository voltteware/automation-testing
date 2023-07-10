@test-api @smoke-test-api @regression-api @api-dashboard @upload-file @asc
Feature: API_Regression User uploads file for all sections in ASC companies
    Background: Send POST /login request to login before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies

    # Supplier section
    # Create new Suppliers
    # Please remove supplier with name including "from upload auto" to reduce time running
    @ascCompanies-supplier
    Scenario Outline: <TC_ID> - Add new suppliers via upload csv file
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User prepares the <fileName> file contains the list supplier as following data:
            | Supplier Name | Lead Time | Order Interval |
            | random        | random    | random         |
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
        And User sets POST api to sync file <fileName> from Amazon S3 with option isCreateNew: <option>
        And User sends a POST request to sync file from Amazon S3
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        When User filters one column and sorts one column
            | columnFilter   | valueColumnFilter   | sortColumn   | directionSort   |
            | <columnFilter> | <valueColumnFilter> | <sortColumn> | <directionSort> |
        Then User checks items in the supplier must be the same as in csv file

        Examples:
            | TC_ID          | companyType | email                      | fileName                             | option | expectedStatus | expectedStatusText | columnFilter | valueColumnFilter | sortColumn | directionSort |
            | TC_UFFASC001_1 | ASC         | testautoforecast@gmail.com | supplierTemplateCreateASCCompany.csv | true   | 200            | OK                 | name         | from upload auto  | name       | asc           |

    # Supplier section
    # Update Supplier via Upload file
    @ascCompanies-supplier
    Scenario Outline: <TC_ID> - Update Supplier via upload csv file
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User filters one column and sorts one column
            | columnFilter   | valueColumnFilter   | sortColumn   | directionSort   |
            | <columnFilter> | <valueColumnFilter> | <sortColumn> | <directionSort> |
        And User picks random supplier in above response
        And User prepares the <fileName> file contains the list supplier as following data:
            | Supplier Name | Lead Time | Order Interval |
            | hard          | random    | random         |
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
        And User sets POST api to sync file <fileName> from Amazon S3 with option isCreateNew: <option>
        And User sends a POST request to sync file from Amazon S3
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        When User filters one column and sorts one column
            | columnFilter   | valueColumnFilter   | sortColumn   | directionSort   |
            | <columnFilter> | <valueColumnFilter> | <sortColumn> | <directionSort> |
        Then User checks items in the supplier must be the same as in csv file

        Examples:
            | TC_ID          | companyType | email                      | fileName                             | option | expectedStatus | expectedStatusText | columnFilter | valueColumnFilter | sortColumn | directionSort |
            | TC_UFFASC001_2 | ASC         | testautoforecast@gmail.com | supplierTemplateUpdateASCCompany.csv | false  | 200            | OK                 | name         | from upload auto  | name       | asc           |

    # Items section
    # Create new items
    # Please remove items with name including "from upload auto" to reduce time running
    @ascCompanies-items
    Scenario Outline: <TC_ID> - Add new items via upload csv file
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers with limit row: 10
        And User sends a GET request to get list suppliers
        And User picks random supplier in above response
        And User prepares the <fileName> file contains the list itemASC as following data:
            | Item Name | ASIN   | FNSKU  | Supplier Name | Supplier Price | MOQ    | Service Level | On Hand FBA Qty | Warehouse Qty | On Hand FBM Qty |
            | random    | random | random | random        | random         | random | random        | random          | random        | random          |
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
        And User sets POST api to sync file <fileName> from Amazon S3 with option isCreateNew: <option>
        And User sends a POST request to sync file from Amazon S3
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        When User finds the list items contain value: <valueContain>
        Then User checks items in the item must be the same as in csv file

        Examples:
            | TC_ID          | companyType | email                      | fileName                         | option | expectedStatus | expectedStatusText | valueContain     |
            | TC_UFFASC002_1 | ASC         | testautoforecast@gmail.com | itemTemplateCreateASCCompany.csv | true   | 200            | OK                 | from upload auto |

    # Items section
    # Update Items via Upload file
    @ascCompanies-items
    Scenario Outline: <TC_ID> - Update Items via upload csv file
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers with limit row: 10
        And User sends a GET request to get list suppliers
        And User picks random supplier in above response
        And User finds the list items contain value: <valueContain>
        And User picks a random item in above list items
        And User prepares the <fileName> file contains the list itemASC as following data:
            | Item Name | ASIN   | FNSKU  | Supplier Name | Supplier Price | MOQ    | Service Level | On Hand FBA Qty | Warehouse Qty | On Hand FBM Qty |
            | hard      | random | random | random        | random         | random | random        | random          | random        | random          |
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
        And User sets POST api to sync file <fileName> from Amazon S3 with option isCreateNew: <option>
        And User sends a POST request to sync file from Amazon S3
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        When User finds the list items contain value: <valueContain>
        Then User checks items in the item must be the same as in csv file

        Examples:
            | TC_ID          | companyType | email                      | fileName                         | option | expectedStatus | expectedStatusText | valueContain     |
            | TC_UFFASC002_2 | ASC         | testautoforecast@gmail.com | itemTemplateUpdateASCCompany.csv | false  | 200            | OK                 | from upload auto |

    # Supply section
    # Create new supply
    # Please remove supply with items name including "from upload auto" to reduce time running
    @ascCompanies-supply
    Scenario Outline: <TC_ID> - Add new supply via upload csv file
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers with limit row: 10
        And User sends a GET request to get list suppliers
        And User picks random supplier in above response
        And User finds the list items contain value: <valueContain>
        And User picks a random item in above list items
        And User prepares the <fileName> file contains the list supply as following data:
            | PO Num | Supplier Name | Receive Date | PO Date | Item Name | Order Qty | Open Qty |
            | random | random        | random       | random  | random    | random    | random   |
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
        And User sets POST api to sync file <fileName> from Amazon S3 with option isCreateNew: <option>
        And User sends a POST request to sync file from Amazon S3
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User sets GET api endpoint to get supplies by item name <valueContain>
        When User sends a GET request to get list supplies
        Then User checks items in the supply must be the same as in csv file

        Examples:
            | TC_ID          | companyType | email                      | fileName                           | option | expectedStatus | expectedStatusText | valueContain     |
            | TC_UFFASC003_1 | ASC         | testautoforecast@gmail.com | supplyTemplateCreateASCCompany.csv | true   | 200            | OK                 | from upload auto |

    # Supply section
    # Update Supply via Upload file
    @ascCompanies-supply
    Scenario Outline: <TC_ID> - Update supply via upload csv file
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers with limit row: 10
        And User sends a GET request to get list suppliers
        And User picks random supplier in above response
        And User sets GET api endpoint to get supplies by item name <valueContain>
        And User sends a GET request to get list supplies
        And User picks a random supply in above list supplies
        And User prepares the <fileName> file contains the list supply as following data:
            | PO Num | Supplier Name | Receive Date | PO Date | Item Name | Order Qty | Open Qty |
            | random | random        | random       | random  | random    | random    | random   |
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
        And User sets POST api to sync file <fileName> from Amazon S3 with option isCreateNew: <option>
        And User sends a POST request to sync file from Amazon S3
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User sets GET api endpoint to get supplies by item name <valueContain>
        When User sends a GET request to get list supplies
        Then User checks items in the supply must be the same as in csv file

        Examples:
            | TC_ID          | companyType | email                      | fileName                           | option | expectedStatus | expectedStatusText | valueContain     |
            | TC_UFFASC003_2 | ASC         | testautoforecast@gmail.com | supplyTemplateUpdateASCCompany.csv | false  | 200            | OK                 | from upload auto |

    # Kits section
    # Create new kits
    # Please remove items with name including "from upload auto" to reduce time running
    @ascCompanies-kit
    Scenario Outline: <TC_ID> - Add new kits via upload csv file
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User finds the list items contain value: <valueContain>
        And User picks a random item in above list items
        And User prepares the <fileName> file contains the list bom as following data:
            | Parent Name | Component Name | Kit Qty |
            | hard        | random         | random  |
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
        And User sets POST api to sync file <fileName> from Amazon S3 with option isCreateNew: <option>
        And User sends a POST request to sync file from Amazon S3
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        When User finds the list bom contain value: <valueContain>
        Then User checks items in the bom must be the same as in csv file

        Examples:
            | TC_ID          | companyType | email                      | fileName                        | option | expectedStatus | expectedStatusText | valueContain     |
            | TC_UFFASC004_1 | ASC         | testautoforecast@gmail.com | bomTemplateCreateASCCompany.csv | true   | 200            | OK                 | from upload auto |

    # Kits section
    # Update new kits
    @ascCompanies-kit
    Scenario Outline: <TC_ID> - Update kits via upload csv file
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User finds the list bom contain value: <valueContain>
        And User picks a random bom in above list boms
        And User prepares the <fileName> file contains the list bom as following data:
            | Parent Name | Component Name | Kit Qty |
            | hard        | hard           | random  |
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
        And User sets POST api to sync file <fileName> from Amazon S3 with option isCreateNew: <option>
        And User sends a POST request to sync file from Amazon S3
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        When User finds the list bom contain value: <valueContain>
        Then User checks items in the bom must be the same as in csv file

        Examples:
            | TC_ID          | companyType | email                      | fileName                        | option | expectedStatus | expectedStatusText | valueContain     |
            | TC_UFFASC004_2 | ASC         | testautoforecast@gmail.com | bomTemplateUpdateASCCompany.csv | false  | 200            | OK                 | from upload auto |

    # Restock from Warehouse
    # Create shipments via upload file
    @ascCompanies-uploadInventory
    Scenario Outline: <TC_ID> - Create shipments via upload file
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

        Examples:
            | TC_ID        | companyType | fileName                              | expectedStatus | expectedStatusText |
            | TC_UFFASC005 | ASC         | inventoryTemplateUpdateASCCompany.csv | 200            | OK                 |
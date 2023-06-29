@test-api @smoke-test-api @regression-api @api-dashboard @upload-file @csv
Feature: API_Regression User uploads file for all sections in CSV companies
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
    @csvCompanies-supplier
    Scenario Outline: Add new suppliers via upload csv file
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
            | TC_ID          | companyType | email                      | fileName                       | option | expectedStatus | expectedStatusText | columnFilter | valueColumnFilter | sortColumn | directionSort |
            | TC_UFFCSV001_1 | CSV         | testautoforecast@gmail.com | supplierTemplateCSVCompany.csv | true   | 200            | OK                 | name         | from upload auto  | name       | asc           |

    # Supplier section
    # Update Supplier via Upload file
    @csvCompanies-supplier
    Scenario Outline: Update Supplier via upload csv file
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
            | TC_ID          | companyType | email                      | fileName                       | option | expectedStatus | expectedStatusText | columnFilter | valueColumnFilter | sortColumn | directionSort |
            | TC_UFFCSV001_2 | CSV         | testautoforecast@gmail.com | supplierTemplateCSVCompany.csv | false  | 200            | OK                 | name         | from upload auto  | name       | asc           |

    # Items section
    # Create new items
    # Please remove items with name including "from upload auto" to reduce time running
    @csvCompanies-items
    Scenario Outline: Add new items via upload csv file
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers with limit row: 10
        And User sends a GET request to get list suppliers
        And User picks random supplier in above response
        And User prepares the <fileName> file contains the list item as following data:
            | Item Name | Supplier Name | Supplier Price | MOQ    | Service Level | On Hand Qty | Warehouse Qty |
            | random    | random        | random         | random | random        | random      | random        |
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
            | TC_ID          | companyType | email                      | fileName                   | option | expectedStatus | expectedStatusText | valueContain     |
            | TC_UFFCSV002_1 | CSV         | testautoforecast@gmail.com | itemTemplateCSVCompany.csv | true   | 200            | OK                 | from upload auto |

    # Items section
    # Update Items via Upload file
    @csvCompanies-items
    Scenario Outline: Update Items via upload csv file
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers with limit row: 10
        And User sends a GET request to get list suppliers
        And User picks random supplier in above response
        And User finds the list items contain value: <valueContain>
        And User picks a random item in above list items
        And User prepares the <fileName> file contains the list item as following data:
            | Item Name | Supplier Name | Supplier Price | MOQ    | Service Level | On Hand Qty | Warehouse Qty |
            | hard      | random        | random         | random | random        | random      | random        |
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
            | TC_ID          | companyType | email                      | fileName                   | option | expectedStatus | expectedStatusText | valueContain     |
            | TC_UFFCSV002_2 | CSV         | testautoforecast@gmail.com | itemTemplateCSVCompany.csv | false  | 200            | OK                 | from upload auto |

    # Demand section
    # Create new demand
    # Please remove demad with items name including "from upload auto" to reduce time running
    @csvCompanies-demand
    Scenario Outline: Add new demand via upload csv file
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User finds the list items contain value: <valueContain>
        And User picks a random item in above list items
        And User prepares the <fileName> file contains the list demand as following data:
            | Item Name | Date of Sale | Sales Order Qty | Open Sales Order Qty | Ref Num |
            | random    | random       | random          | random               | random  |
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
        When User finds the list demand contain value: <valueContain>
        Then User checks items in the demand must be the same as in csv file

        Examples:
            | TC_ID          | companyType | email                      | fileName                     | option | expectedStatus | expectedStatusText | valueContain     |
            | TC_UFFCSV003_1 | CSV         | testautoforecast@gmail.com | demandTemplateCSVCompany.csv | true   | 200            | OK                 | from upload auto |

    # Demand section
    # Update Demand via Upload file
    @csvCompanies-demand
    Scenario Outline: Update demand via upload csv file
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User finds the list demand contain value: <valueContain>
        And User picks a random demand in above list demands
        And User prepares the <fileName> file contains the list demand as following data:
            | Item Name | Date of Sale | Sales Order Qty | Open Sales Order Qty | Ref Num | Doc Type | Order Key | Row Key |
            | random    | random       | random          | random               | random  | random   | random    | random  |
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
        When User finds the list demand contain value: <valueContain>
        Then User checks items in the demand must be the same as in csv file

        Examples:
            | TC_ID          | companyType | email                      | fileName                     | option | expectedStatus | expectedStatusText | valueContain     |
            | TC_UFFCSV003_2 | CSV         | testautoforecast@gmail.com | demandTemplateCSVCompany.csv | false  | 200            | OK                 | from upload auto |

    # Supply section
    # Create new supply
    # Please remove supply with items name including "from upload auto" to reduce time running
    @csvCompanies-supply
    Scenario Outline: Add new supply via upload csv file
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
            | TC_ID          | companyType | email                      | fileName                     | option | expectedStatus | expectedStatusText | valueContain     |
            | TC_UFFCSV004_1 | CSV         | testautoforecast@gmail.com | supplyTemplateCSVCompany.csv | true   | 200            | OK                 | from upload auto |

    # Supply section
    # Update Supply via Upload file
    @csvCompanies-supply
    Scenario Outline: Update Supply via upload csv file
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
            | TC_ID          | companyType | email                      | fileName                     | option | expectedStatus | expectedStatusText | valueContain     |
            | TC_UFFCSV004_2 | CSV         | testautoforecast@gmail.com | supplyTemplateCSVCompany.csv | false  | 200            | OK                 | from upload auto |

    # Kits section
    # Create new kits
    # Please remove items with name including "from upload auto" to reduce time running
    @csvCompanies-kit
    Scenario Outline: Add new kits via upload csv file
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
            | TC_ID          | companyType | email                      | fileName                  | option | expectedStatus | expectedStatusText | valueContain     |
            | TC_UFFCSV005_1 | CSV         | testautoforecast@gmail.com | bomTemplateCSVCompany.csv | true   | 200            | OK                 | from upload auto |

    # Kits section
    # Update new kits
    @csvCompanies-kit
    Scenario Outline: Update kits via upload csv file
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
            | TC_ID          | companyType | email                      | fileName                  | option | expectedStatus | expectedStatusText | valueContain     |
            | TC_UFFCSV005_2 | CSV         | testautoforecast@gmail.com | bomTemplateCSVCompany.csv | false  | 200            | OK                 | from upload auto |
@test-api @smoke-test-api @regression-api @api-dashboard @upload-file @qbfs
Feature: API_Regression User uploads file for all sections in QBFS companies
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
    @qbfsCompanies-supplier
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
            | TC_ID           | companyType | email                      | fileName                        | option | expectedStatus | expectedStatusText | columnFilter | valueColumnFilter | sortColumn | directionSort |
            | TC_UFFQBFS001_1 | QBFS        | testautoforecast@gmail.com | supplierTemplateQBFSCompany.csv | true   | 200            | OK                 | name         | from upload auto  | name       | asc           |

    # Supplier section
    # Update Supplier via Upload file
    @qbfsCompanies-supplier
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
            | TC_ID           | companyType | email                      | fileName                        | option | expectedStatus | expectedStatusText | columnFilter | valueColumnFilter | sortColumn | directionSort |
            | TC_UFFQBFS001_2 | QBFS        | testautoforecast@gmail.com | supplierTemplateQBFSCompany.csv | false  | 200            | OK                 | name         | from upload auto  | name       | asc           |

    # Items section
    # Create new items
    # Please remove items with name including "from upload auto" to reduce time running
    @qbfsCompanies-items
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
            | TC_ID           | companyType | email                      | fileName                    | option | expectedStatus | expectedStatusText | valueContain     |
            | TC_UFFQBFS002_1 | QBFS        | testautoforecast@gmail.com | itemTemplateQBFSCompany.csv | true   | 200            | OK                 | from upload auto |

    # Items section
    # Update Items via Upload file
    @qbfsCompanies-items
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
            | TC_ID           | companyType | email                      | fileName                    | option | expectedStatus | expectedStatusText | valueContain     |
            | TC_UFFQBFS002_2 | QBFS        | testautoforecast@gmail.com | itemTemplateQBFSCompany.csv | false  | 200            | OK                 | from upload auto |
@test-api @api-dashboard @api-supplier @api-edit-some-value-on-grid
Feature: API_Dashboard PUT /api/vendor
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                     | password  |
            | admin | testcreatesupplier@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies

    @TC_UV001 @smoke-test-api @regression-api
    Scenario Outline: <TC_ID> - Verify user <email> could call this API to update "<editColumn>" of a supplier for company type (<companyType>)
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers with limit row: <limitRow>
        And User sends a GET request to get list suppliers
        And User picks random supplier in above response
        And User saves the supplier key
        And User sets PUT api endpoint to edit <editColumn> of the above supplier for company type <companyType> with new value: <value>
        When User sends a PUT request to edit the supplier
        Then The expected status code should be <expectedStatus>
        And The new <editColumn> of supplier must be updated successfully
        And User checks API contract essential types in supplier object are correct

        Examples:
            | TC_ID       | companyType | email                        | limitRow | editColumn   | value  | expectedStatus |
            | TC_UV001_1  | ASC         | testcreatesupplier@gmail.com | 10       | supplierName | random | 200            |
            | TC_UV001_12 | CSV         | testcreatesupplier@gmail.com | 10       | leadTime     | random | 200            |
            | TC_UV001_20 | QBFS        | testcreatesupplier@gmail.com | 10       | serviceLevel | random | 200            |

    @TC_UV002 @regression-api @retry
    Scenario Outline: <TC_ID> - Verify user <email> could call this API to update "<editColumn>" of a supplier for company type (<companyType>)
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers with limit row: <limitRow>
        And User sends a GET request to get list suppliers
        And User picks random supplier in above response
        And User saves the supplier key
        And User sets PUT api endpoint to edit <editColumn> of the above supplier for company type <companyType> with new value: <value>
        When User sends a PUT request to edit the supplier
        Then The expected status code should be <expectedStatus>
        And The new <editColumn> of supplier must be updated successfully
        And User checks API contract essential types in supplier object are correct

        Examples:
            | TC_ID       | companyType | email                        | limitRow | editColumn            | value  | expectedStatus |
            | TC_UV001_2  | ASC         | testcreatesupplier@gmail.com | 10       | leadTime              | random | 200            |
            | TC_UV001_3  | ASC         | testcreatesupplier@gmail.com | 10       | serviceLevel          | random | 200            |
            | TC_UV001_4  | ASC         | testcreatesupplier@gmail.com | 10       | orderInterval         | random | 200            |
            | TC_UV001_5  | ASC         | testcreatesupplier@gmail.com | 10       | description           | random | 200            |
            | TC_UV001_6  | ASC         | testcreatesupplier@gmail.com | 10       | targetOrderValue      | random | 200            |
            | TC_UV001_7  | ASC         | testcreatesupplier@gmail.com | 10       | freeFreightMinimum    | random | 200            |
            | TC_UV001_8  | ASC         | testcreatesupplier@gmail.com | 10       | fabReplenishmentModel | random | 200            |
            | TC_UV001_9  | ASC         | testcreatesupplier@gmail.com | 10       | email                 | random | 200            |
            | TC_UV001_10 | ASC         | testcreatesupplier@gmail.com | 10       | moq                   | random | 200            |
            | TC_UV001_11 | CSV         | testcreatesupplier@gmail.com | 10       | supplierName          | random | 200            |
            | TC_UV001_13 | CSV         | testcreatesupplier@gmail.com | 10       | serviceLevel          | random | 200            |
            | TC_UV001_14 | CSV         | testcreatesupplier@gmail.com | 10       | orderInterval         | random | 200            |
            | TC_UV001_15 | CSV         | testcreatesupplier@gmail.com | 10       | description           | random | 200            |
            | TC_UV001_16 | CSV         | testcreatesupplier@gmail.com | 10       | email                 | random | 200            |
            | TC_UV001_17 | CSV         | testcreatesupplier@gmail.com | 10       | moq                   | random | 200            |
            | TC_UV001_18 | QBFS        | testcreatesupplier@gmail.com | 10       | supplierName          | random | 200            |
            | TC_UV001_19 | QBFS        | testcreatesupplier@gmail.com | 10       | leadTime              | random | 200            |
            | TC_UV001_21 | QBFS        | testcreatesupplier@gmail.com | 10       | orderInterval         | random | 200            |
            | TC_UV001_22 | QBFS        | testcreatesupplier@gmail.com | 10       | description           | random | 200            |
            | TC_UV001_23 | QBFS        | testcreatesupplier@gmail.com | 10       | email                 | random | 200            |
            | TC_UV001_24 | QBFS        | testcreatesupplier@gmail.com | 10       | moq                   | random | 200            |
            # | TC_UV001_25 | QBO         | testcreatesupplier@gmail.com | 10       | supplierName          | random | 200            |
            # | TC_UV001_26 | QBO         | testcreatesupplier@gmail.com | 10       | leadTime              | random | 200            |
            # | TC_UV001_27 | QBO         | testcreatesupplier@gmail.com | 10       | serviceLevel          | random | 200            |
            # | TC_UV001_28 | QBO         | testcreatesupplier@gmail.com | 10       | orderInterval         | random | 200            |
            # | TC_UV001_29 | QBO         | testcreatesupplier@gmail.com | 10       | description           | random | 200            |
            # | TC_UV001_30 | QBO         | testcreatesupplier@gmail.com | 10       | email                 | random | 200            |
            # | TC_UV001_31 | QBO         | testcreatesupplier@gmail.com | 10       | moq                   | random | 200            |

    @TC_UV003 @regression-api
    Scenario Outline: <TC_ID> - Verify error when user <email> call this API to update Supplier Name of a supplier that is already exist for company type (<companyType>)
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers with limit row: <limitRow>
        And User sends a GET request to get list suppliers
        And User picks random supplier in above response
        And User saves the supplier key
        And User sets PUT api endpoint to edit <editColumn> of the above supplier for company type <companyType> with new value: <value>
        When User sends a PUT request to edit the supplier
        When User sends a PUT request to edit the supplier
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | TC_ID      | companyType | email                        | limitRow | editColumn   | value               | expectedStatus | expectedStatusText     |
            | TC_UV002_1 | ASC         | testcreatesupplier@gmail.com | 10       | supplierName | Exist Supplier Name | 400            | Vendor already exists. |
            | TC_UV002_2 | CSV         | testcreatesupplier@gmail.com | 10       | supplierName | Exist Supplier Name | 400            | Vendor already exists. |
            | TC_UV002_3 | QBFS        | testcreatesupplier@gmail.com | 10       | supplierName | Exist Supplier Name | 400            | Vendor already exists. |
            # | TC_UV002_4 | QBO         | testcreatesupplier@gmail.com | 10       | supplierName | Exist Supplier Name | 400            | Vendor already exists. |
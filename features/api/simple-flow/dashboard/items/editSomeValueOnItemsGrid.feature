@test-api @api-dashboard @api-imtems @api-edit-some-value-on-grid
Feature: API_Dashboard PUT /api/item

    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies

    @TC_UI001 @smoke-test-api
    Scenario Outline: <TC_ID> - Verify user <email> could call this API to update "<editColumn>" of a items for company type (<companyType>)
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers with limit row: <limitRow>
        And User sends a GET request to get list suppliers
        And User sets POST api endpoint to create item
        And User sets request body with payload as name: "New Item Auto" and asin: "random" and fnsku: "random"
        When User sends a POST method to create item
        And User saves the item key
        And User sets PUT api endpoint to edit <editColumn> of the above item for company type <companyType> with new value: <value>
        When User sends a PUT request to edit the item
        Then The expected status code should be <expectedStatus>
        And The new <editColumn> of item must be updated successfully

        Examples:
            | TC_ID       | companyType | email                      | limitRow | editColumn    | value  | expectedStatus |
            | TC_UI001_1  | ASC         | testautoforecast@gmail.com | 20       | itemName      | random | 200            |
            | TC_UI001_29 | CSV         | testautoforecast@gmail.com | 10       | description   | random | 200            |
            | TC_UI001_46 | QBFS        | testautoforecast@gmail.com | 10       | supplierPrice | random | 200            |

    @TC_UI002 @regression-api
    Scenario Outline: <TC_ID> - Verify user <email> could call this API to update "<editColumn>" of a items for company type (<companyType>)
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers with limit row: <limitRow>
        And User sends a GET request to get list suppliers
        And User sets POST api endpoint to create item
        And User sets request body with payload as name: "New Item Auto" and asin: "random" and fnsku: "random"
        When User sends a POST method to create item
        And User saves the item key
        And User sets PUT api endpoint to edit <editColumn> of the above item for company type <companyType> with new value: <value>
        When User sends a PUT request to edit the item
        Then The expected status code should be <expectedStatus>
        And The new <editColumn> of item must be updated successfully

        Examples:
            | TC_ID       | companyType | email                      | limitRow | editColumn                | value  | expectedStatus |
            | TC_UI001_2  | ASC         | testautoforecast@gmail.com | 10       | asin                      | random | 200            |
            | TC_UI001_3  | ASC         | testautoforecast@gmail.com | 10       | fnsku                     | random | 200            |
            | TC_UI001_4  | ASC         | testautoforecast@gmail.com | 10       | description               | random | 200            |
            | TC_UI001_5  | ASC         | testautoforecast@gmail.com | 10       | supplierName              | random | 200            |
            | TC_UI001_6  | ASC         | testautoforecast@gmail.com | 10       | supplierPrice             | random | 200            |
            | TC_UI001_7  | ASC         | testautoforecast@gmail.com | 10       | moq                       | random | 200            |
            | TC_UI001_8  | ASC         | testautoforecast@gmail.com | 10       | leadTime                  | random | 200            |
            | TC_UI001_9  | ASC         | testautoforecast@gmail.com | 10       | orderInterval             | random | 200            |
            | TC_UI001_10 | ASC         | testautoforecast@gmail.com | 10       | serviceLevel              | random | 200            |
            | TC_UI001_11 | ASC         | testautoforecast@gmail.com | 10       | onHanFBAQty               | random | 200            |
            | TC_UI001_12 | ASC         | testautoforecast@gmail.com | 10       | onHandQtyMin              | random | 200            |
            | TC_UI001_13 | ASC         | testautoforecast@gmail.com | 10       | warehouseQty              | random | 200            |
            | TC_UI001_14 | ASC         | testautoforecast@gmail.com | 10       | warehouseQtyMin           | random | 200            |
            | TC_UI001_15 | ASC         | testautoforecast@gmail.com | 10       | onHandFBMQty              | random | 200            |
            | TC_UI001_16 | ASC         | testautoforecast@gmail.com | 10       | skuNotes                  | random | 200            |
            | TC_UI001_17 | ASC         | testautoforecast@gmail.com | 10       | prepNotes                 | random | 200            |
            | TC_UI001_18 | ASC         | testautoforecast@gmail.com | 10       | supplierRebate            | random | 200            |
            | TC_UI001_19 | ASC         | testautoforecast@gmail.com | 10       | inboundShippingCost       | random | 200            |
            | TC_UI001_20 | ASC         | testautoforecast@gmail.com | 10       | reshippingCost            | random | 200            |
            | TC_UI001_21 | ASC         | testautoforecast@gmail.com | 10       | repackagingMaterialCost   | random | 200            |
            | TC_UI001_22 | ASC         | testautoforecast@gmail.com | 10       | repackingLaborCost        | random | 200            |
            | TC_UI001_23 | ASC         | testautoforecast@gmail.com | 10       | isHidden                  | random | 200            |
            | TC_UI001_24 | ASC         | testautoforecast@gmail.com | 10       | useHistoryOverride        | random | 200            |
            | TC_UI001_25 | ASC         | testautoforecast@gmail.com | 10       | casePackQty               | random | 200            |
            | TC_UI001_26 | ASC         | testautoforecast@gmail.com | 10       | inventorySourcePreference | random | 200            |
            | TC_UI001_27 | ASC         | testautoforecast@gmail.com | 10       | purchaseAs                | random | 200            |
            | TC_UI001_28 | CSV         | testautoforecast@gmail.com | 10       | itemName                  | random | 200            |
            | TC_UI001_30 | CSV         | testautoforecast@gmail.com | 10       | supplierName              | random | 200            |
            | TC_UI001_31 | CSV         | testautoforecast@gmail.com | 10       | supplierPrice             | random | 200            |
            | TC_UI001_32 | CSV         | testautoforecast@gmail.com | 10       | moq                       | random | 200            |
            | TC_UI001_33 | CSV         | testautoforecast@gmail.com | 10       | leadTime                  | random | 200            |
            | TC_UI001_34 | CSV         | testautoforecast@gmail.com | 10       | orderInterval             | random | 200            |
            | TC_UI001_35 | CSV         | testautoforecast@gmail.com | 10       | serviceLevel              | random | 200            |
            | TC_UI001_36 | CSV         | testautoforecast@gmail.com | 10       | onHanQty                  | random | 200            |
            | TC_UI001_37 | CSV         | testautoforecast@gmail.com | 10       | onHandQtyMin              | random | 200            |
            | TC_UI001_38 | CSV         | testautoforecast@gmail.com | 10       | warehouseQty              | random | 200            |
            | TC_UI001_39 | CSV         | testautoforecast@gmail.com | 10       | warehouseQtyMin           | random | 200            |
            | TC_UI001_40 | CSV         | testautoforecast@gmail.com | 10       | isHidden                  | random | 200            |
            | TC_UI001_41 | CSV         | testautoforecast@gmail.com | 10       | useHistoryOverride        | random | 200            |
            | TC_UI001_42 | CSV         | testautoforecast@gmail.com | 10       | casePackQty               | random | 200            |
            | TC_UI001_43 | CSV         | testautoforecast@gmail.com | 10       | purchaseAs                | random | 200            |
            | TC_UI001_44 | QBFS        | testautoforecast@gmail.com | 10       | description               | random | 200            |
            | TC_UI001_45 | QBFS        | testautoforecast@gmail.com | 10       | supplierName              | random | 200            |
            | TC_UI001_47 | QBFS        | testautoforecast@gmail.com | 10       | moq                       | random | 200            |
            | TC_UI001_48 | QBFS        | testautoforecast@gmail.com | 10       | leadTime                  | random | 200            |
            | TC_UI001_49 | QBFS        | testautoforecast@gmail.com | 10       | orderInterval             | random | 200            |
            | TC_UI001_50 | QBFS        | testautoforecast@gmail.com | 10       | serviceLevel              | random | 200            |
            | TC_UI001_51 | QBFS        | testautoforecast@gmail.com | 10       | onHanQty                  | random | 200            |
            | TC_UI001_52 | QBFS        | testautoforecast@gmail.com | 10       | onHandQtyMin              | random | 200            |
            | TC_UI001_53 | QBFS        | testautoforecast@gmail.com | 10       | warehouseQty              | random | 200            |
            | TC_UI001_54 | QBFS        | testautoforecast@gmail.com | 10       | warehouseQtyMin           | random | 200            |
            | TC_UI001_55 | QBFS        | testautoforecast@gmail.com | 10       | isHidden                  | random | 200            |
            | TC_UI001_56 | QBFS        | testautoforecast@gmail.com | 10       | useHistoryOverride        | random | 200            |
            | TC_UI001_57 | QBFS        | testautoforecast@gmail.com | 10       | casePackQty               | random | 200            |
            | TC_UI001_58 | QBFS        | testautoforecast@gmail.com | 10       | purchaseAs                | random | 200            |

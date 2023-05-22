@test-api @api-dashboard @api-items @api-edit-some-value-on-grid @api-edit-item-value-on-grid
Feature: API_Dashboard PUT /api/item

  Background: Send GET /realm request to get all company keys of current logged in user before each test
    Given user sends a POST login request to get valid cookie with role
      | role  | username                 | password  |
      | admin | testcreateitem@gmail.com | Test1111# |
    And User sets GET api endpoint to get companies information of current user
    And In Header of the request, she sets param Cookie as valid connect.sid
    When User sends a GET request to get companies

  @TC_UI001 @smoke-test-api @retry
  Scenario Outline: <TC_ID> - Verify user <email> could call this API to update "<editColumn>" of a items for company type (<companyType>)
    Given User picks company which has onboarded before with type <companyType> in above response
    And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
    And User sets GET api endpoint to get suppliers with limit row: <limitRow>
    And User sends a GET request to get list suppliers
    And User sets GET api endpoint to get item with limit row: <limitRow>
    And User sends a GET request to get list items
    And User picks a random item in above list items
    And User saves the item key
    And User sets PUT api endpoint to edit <editColumn> of the above item for company type <companyType> with new value: <value>
    When User sends a PUT request to edit the item
    Then The expected status code should be <expectedStatus>
    And The new <editColumn> of item must be updated successfully

    Examples:
      | TC_ID       | companyType | email                    | limitRow | editColumn    | value  | expectedStatus |
      | TC_UI001_1  | ASC         | testcreateitem@gmail.com | 20       | itemName      | random | 200            |
      | TC_UI001_29 | CSV         | testcreateitem@gmail.com | 10       | description   | random | 200            |
      | TC_UI001_46 | QBFS        | testcreateitem@gmail.com | 10       | supplierPrice | random | 200            |

  @TC_UI002 @regression-api @retry
  Scenario Outline: <TC_ID> - Verify user <email> could call this API to update "<editColumn>" of a items for company type (<companyType>)
    Given User picks company which has onboarded before with type <companyType> in above response
    And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
    And User sets GET api endpoint to get suppliers with limit row: <limitRow>
    And User sends a GET request to get list suppliers
    And User sets GET api endpoint to get item with limit row: <limitRow>
    And User sends a GET request to get list items
    And User picks a random item in above list items
    And User saves the item key
    And User sets PUT api endpoint to edit <editColumn> of the above item for company type <companyType> with new value: <value>
    When User sends a PUT request to edit the item
    Then The expected status code should be <expectedStatus>
    And The new <editColumn> of item must be updated successfully

    Examples:
      | TC_ID       | companyType | email                    | limitRow | editColumn                | value  | expectedStatus |
      | TC_UI001_2  | ASC         | testcreateitem@gmail.com | 10       | asin                      | random | 200            |
      | TC_UI001_3  | ASC         | testcreateitem@gmail.com | 10       | fnsku                     | random | 200            |
      | TC_UI001_4  | ASC         | testcreateitem@gmail.com | 10       | description               | random | 200            |
      | TC_UI001_5  | ASC         | testcreateitem@gmail.com | 10       | supplierName              | random | 200            |
      | TC_UI001_6  | ASC         | testcreateitem@gmail.com | 10       | supplierPrice             | random | 200            |
      | TC_UI001_7  | ASC         | testcreateitem@gmail.com | 10       | moq                       | random | 200            |
      | TC_UI001_8  | ASC         | testcreateitem@gmail.com | 10       | leadTime                  | random | 200            |
      | TC_UI001_9  | ASC         | testcreateitem@gmail.com | 10       | orderInterval             | random | 200            |
      | TC_UI001_10 | ASC         | testcreateitem@gmail.com | 10       | serviceLevel              | random | 200            |
      | TC_UI001_11 | ASC         | testcreateitem@gmail.com | 10       | onHanFBAQty               | random | 200            |
      | TC_UI001_12 | ASC         | testcreateitem@gmail.com | 10       | onHandQtyMin              | random | 200            |
      | TC_UI001_13 | ASC         | testcreateitem@gmail.com | 10       | warehouseQty              | random | 200            |
      | TC_UI001_14 | ASC         | testcreateitem@gmail.com | 10       | warehouseQtyMin           | random | 200            |
      | TC_UI001_15 | ASC         | testcreateitem@gmail.com | 10       | onHandFBMQty              | random | 200            |
      | TC_UI001_16 | ASC         | testcreateitem@gmail.com | 10       | skuNotes                  | random | 200            |
      | TC_UI001_17 | ASC         | testcreateitem@gmail.com | 10       | prepNotes                 | random | 200            |
      | TC_UI001_18 | ASC         | testcreateitem@gmail.com | 10       | supplierRebate            | random | 200            |
      | TC_UI001_19 | ASC         | testcreateitem@gmail.com | 10       | inboundShippingCost       | random | 200            |
      | TC_UI001_20 | ASC         | testcreateitem@gmail.com | 10       | reshippingCost            | random | 200            |
      | TC_UI001_21 | ASC         | testcreateitem@gmail.com | 10       | repackagingMaterialCost   | random | 200            |
      | TC_UI001_22 | ASC         | testcreateitem@gmail.com | 10       | repackingLaborCost        | random | 200            |
      | TC_UI001_23 | ASC         | testcreateitem@gmail.com | 10       | isHidden                  | random | 200            |
      | TC_UI001_24 | ASC         | testcreateitem@gmail.com | 10       | useHistoryOverride        | random | 200            |
      | TC_UI001_25 | ASC         | testcreateitem@gmail.com | 10       | casePackQty               | random | 200            |
      | TC_UI001_26 | ASC         | testcreateitem@gmail.com | 10       | inventorySourcePreference | random | 200            |
      | TC_UI001_28 | CSV         | testcreateitem@gmail.com | 10       | itemName                  | random | 200            |
      | TC_UI001_30 | CSV         | testcreateitem@gmail.com | 10       | supplierName              | random | 200            |
      | TC_UI001_31 | CSV         | testcreateitem@gmail.com | 10       | supplierPrice             | random | 200            |
      | TC_UI001_32 | CSV         | testcreateitem@gmail.com | 10       | moq                       | random | 200            |
      | TC_UI001_33 | CSV         | testcreateitem@gmail.com | 10       | leadTime                  | random | 200            |
      | TC_UI001_34 | CSV         | testcreateitem@gmail.com | 10       | orderInterval             | random | 200            |
      | TC_UI001_35 | CSV         | testcreateitem@gmail.com | 10       | serviceLevel              | random | 200            |
      | TC_UI001_36 | CSV         | testcreateitem@gmail.com | 10       | onHanQty                  | random | 200            |
      | TC_UI001_37 | CSV         | testcreateitem@gmail.com | 10       | onHandQtyMin              | random | 200            |
      | TC_UI001_38 | CSV         | testcreateitem@gmail.com | 10       | warehouseQty              | random | 200            |
      | TC_UI001_39 | CSV         | testcreateitem@gmail.com | 10       | warehouseQtyMin           | random | 200            |
      | TC_UI001_40 | CSV         | testcreateitem@gmail.com | 10       | isHidden                  | random | 200            |
      | TC_UI001_41 | CSV         | testcreateitem@gmail.com | 10       | useHistoryOverride        | random | 200            |
      | TC_UI001_42 | CSV         | testcreateitem@gmail.com | 10       | casePackQty               | random | 200            |
      | TC_UI001_44 | QBFS        | testcreateitem@gmail.com | 10       | description               | random | 200            |
      | TC_UI001_45 | QBFS        | testcreateitem@gmail.com | 10       | supplierName              | random | 200            |
      | TC_UI001_47 | QBFS        | testcreateitem@gmail.com | 10       | moq                       | random | 200            |
      | TC_UI001_48 | QBFS        | testcreateitem@gmail.com | 10       | leadTime                  | random | 200            |
      | TC_UI001_49 | QBFS        | testcreateitem@gmail.com | 10       | orderInterval             | random | 200            |
      | TC_UI001_50 | QBFS        | testcreateitem@gmail.com | 10       | serviceLevel              | random | 200            |
      | TC_UI001_51 | QBFS        | testcreateitem@gmail.com | 10       | onHanQty                  | random | 200            |
      | TC_UI001_52 | QBFS        | testcreateitem@gmail.com | 10       | onHandQtyMin              | random | 200            |
      | TC_UI001_53 | QBFS        | testcreateitem@gmail.com | 10       | warehouseQty              | random | 200            |
      | TC_UI001_54 | QBFS        | testcreateitem@gmail.com | 10       | warehouseQtyMin           | random | 200            |
      | TC_UI001_55 | QBFS        | testcreateitem@gmail.com | 10       | isHidden                  | random | 200            |
      | TC_UI001_56 | QBFS        | testcreateitem@gmail.com | 10       | useHistoryOverride        | random | 200            |
      | TC_UI001_57 | QBFS        | testcreateitem@gmail.com | 10       | casePackQty               | random | 200            |

  @TC_UI002 @regression-api @retry
  Scenario Outline: <TC_ID> - Verify user <email> could call this API to update "<editColumn>" of a items for company type (<companyType>)
    Given User picks company which has onboarded before with type <companyType> in above response
    And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
    And User sets GET api endpoint to get suppliers with limit row: <limitRow>
    And User sends a GET request to get list suppliers
    And User sets POST api endpoint to create item
    And User sets request body with payload as name: "New Item Auto" and asin: "random" and fnsku: "random"
    And User sends a POST method to create item
    And User saves the item key
    And User sets PUT api endpoint to edit <editColumn> of the above item for company type <companyType> with new value: <value>
    When User sends a PUT request to edit the item
    Then The expected status code should be <expectedStatus>
    And The new <editColumn> of item must be updated successfully
    # And User sets PUT api endpoint to edit isHidden of the above item for company type <companyType> with new value: true
    # When User sends a PUT request to edit the item

    Examples:
      | TC_ID       | companyType | email                    | limitRow | editColumn | value  | expectedStatus |
      | TC_UI001_27 | ASC         | testcreateitem@gmail.com | 10       | purchaseAs | random | 200            |

  @TC_UI002 @regression-api @retry
  Scenario Outline: <TC_ID> - Verify user <email> could call this API to update "<editColumn>" of a items for company type (<companyType>)
    Given User picks company which has onboarded before with type <companyType> in above response
    And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
    And User sets GET api endpoint to get suppliers with limit row: <limitRow>
    And User sends a GET request to get list suppliers
    And User sets POST api endpoint to create item
    And User sets request body with payload as name: "New Item Auto" and asin: "" and fnsku: ""
    And User sends a POST method to create item
    And User saves the item key
    And User sets PUT api endpoint to edit <editColumn> of the above item for company type <companyType> with new value: <value>
    When User sends a PUT request to edit the item
    Then The expected status code should be <expectedStatus>
    And The new <editColumn> of item must be updated successfully
    # And User sets PUT api endpoint to edit isHidden of the above item for company type <companyType> with new value: true
    # When User sends a PUT request to edit the item

    Examples:
      | TC_ID       | companyType | email                    | limitRow | editColumn | value  | expectedStatus |
      | TC_UI001_43 | CSV         | testcreateitem@gmail.com | 10       | purchaseAs | random | 200            |

  @TC_UI002 @regression-api @retry
  Scenario Outline: <TC_ID> - Verify user <email> could call this API to update "<editColumn>" of a items for company type (<companyType>)
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
    When User sends a PUT request to edit the item
    Then The expected status code should be <expectedStatus>
    And The new <editColumn> of item must be updated successfully
    And User sets PUT api endpoint to edit <editColumn> of the above item for company type <companyType> with new value: null
    And User sends a PUT request to edit the item

    Examples:
      | TC_ID       | companyType | email                    | editColumn | value  | expectedStatus |
      | TC_UI001_58 | QBFS        | testcreateitem@gmail.com | purchaseAs | random | 200            |

  # Do not Order
  @TC_DNO001 @regression-api @do-not-order
  Scenario Outline: <TC_ID> - Verify user <email> could call this API to update "<editColumn>" of a items for company type (<companyType>)
    Given User picks company which has onboarded before with type <companyType> in above response
    And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
    And User sets GET api endpoint to get items with limit row: 10 and filter field: doNotOrder equals false
    And User sends a GET request to get list items
    And User checks status code and status text of api
      | expectedStatus   | expectedStatusText   |
      | <expectedStatus> | <expectedStatusText> |
    And User picks a random item in above list items
    And User saves the item key
    And User sets request body of edit item api with payload
      | editColumn   | companyType   | value   |
      | <editColumn> | <companyType> | <value> |
    And User sends a PUT request to edit the item
    And User checks status code and status text of api
      | expectedStatus   | expectedStatusText   |
      | <expectedStatus> | <expectedStatusText> |
    And User sets api endpoint to get a item in Custom
    And User sends a GET request to get a item in Custom
    And User checks status code and status text of api
      | expectedStatus   | expectedStatusText   |
      | <expectedStatus> | <expectedStatusText> |
    # If doNotOrder is true => Item will disappear in Purchasing
    And User checks doNotOrder function: true
    # If doNotOrder is false => Item will appear in Purchasing
    And User sets request body of edit item api with payload
      | editColumn   | companyType   | value   |
      | <editColumn> | <companyType> | <value> |
    And User sends a PUT request to edit the item
    And User checks status code and status text of api
      | expectedStatus   | expectedStatusText   |
      | <expectedStatus> | <expectedStatusText> |
    And User sets api endpoint to get a item in Custom
    And User sends a GET request to get a item in Custom
    And User checks status code and status text of api
      | expectedStatus   | expectedStatusText   |
      | <expectedStatus> | <expectedStatusText> |
    And User checks doNotOrder function: false

    Examples:
      | TC_ID       | companyType | email                    | limitRow | editColumn | value  | expectedStatus | expectedStatusText |
      | TC_DNO001_1 | ASC         | testcreateitem@gmail.com | 20       | doNotOrder | random | 200            | OK                 |
      | TC_DNO001_2 | CSV         | testcreateitem@gmail.com | 10       | doNotOrder | random | 200            | OK                 |
      | TC_DNO001_3 | QBFS        | testcreateitem@gmail.com | 10       | doNotOrder | random | 200            | OK                 |

  # Do not Restock
  @TC_DNR001 @regression-api @do-not-restock
  Scenario Outline: <TC_ID> - Verify user <email> could call this API to update "<editColumn>" of a items for company type (<companyType>)
    Given User picks company which has onboarded before with type <companyType> in above response
    And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
    And User sets GET api endpoint to get items with limit row: 10 and filter field: doNotRestock equals false
    And User sends a GET request to get list items
    And User checks status code and status text of api
      | expectedStatus   | expectedStatusText   |
      | <expectedStatus> | <expectedStatusText> |
    And User picks a random item in above list items
    And User saves the item key
    And User sets request body of edit item api with payload
      | editColumn   | companyType   | value   |
      | <editColumn> | <companyType> | <value> |
    And User sends a PUT request to edit the item
    And User checks status code and status text of api
      | expectedStatus   | expectedStatusText   |
      | <expectedStatus> | <expectedStatusText> |
    And User sends GET api endpoint to get items in RestockAMZ without filtered options
    # If doNotRestock is true => Item will disappear in RestockAMZ
    And User checks doNotRestock function: true
    # If doNotRestock is false => Item will appear in RestockAMZ
    And User sets request body of edit item api with payload
      | editColumn   | companyType   | value   |
      | <editColumn> | <companyType> | <value> |
    And User sends a PUT request to edit the item
    And User checks status code and status text of api
      | expectedStatus   | expectedStatusText   |
      | <expectedStatus> | <expectedStatusText> |
    And User sends GET api endpoint to get items in RestockAMZ without filtered options
    And User checks status code and status text of api
      | expectedStatus   | expectedStatusText   |
      | <expectedStatus> | <expectedStatusText> |
    And User checks doNotRestock function: false

    Examples:
      | TC_ID       | companyType | email                    | limitRow | editColumn   | value  | expectedStatus | expectedStatusText |
      | TC_DNR001_1 | ASC         | testcreateitem@gmail.com | 20       | doNotRestock | random | 200            | OK                 |
      | TC_DNR001_2 | CSV         | testcreateitem@gmail.com | 10       | doNotRestock | random | 200            | OK                 |
      | TC_DNR001_3 | QBFS        | testcreateitem@gmail.com | 10       | doNotRestock | random | 200            | OK                 |

  # If doNotOrder and doNotRestock are true => isHidden is true
  # Failed because have not handled API yet (just handled on UI)
  @TC_DNOR001 @regression-api @do-not-order @do-not-restock @ticket1960
  Scenario Outline: <TC_ID> - Verify user <email> could call this API to update "<editColumn>" of a items for company type (<companyType>)
    Given User picks company which has onboarded before with type <companyType> in above response
    And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
    And User sets GET api endpoint to get items with filtered
      | limitRow   | field1   | value1   | field2   | value2   |
      | <limitRow> | <field1> | <value1> | <field2> | <value2> |
    And User sends a GET request to get list items
    And User checks status code and status text of api
      | expectedStatus   | expectedStatusText   |
      | <expectedStatus> | <expectedStatusText> |
    And User picks a random item in above list items
    And User saves the item key
    # doNotRestock
    And User sets request body of edit item api with payload
      | editColumn   | companyType   | value   |
      | <editColumn> | <companyType> | <value> |
    And User sends a PUT request to edit the item
    And User checks status code and status text of api
      | expectedStatus   | expectedStatusText   |
      | <expectedStatus> | <expectedStatusText> |
    And User sends GET api endpoint to get items in RestockAMZ without filtered options
    And User checks doNotRestock function: true
    # doNotOrder
    And User sets request body of edit item api with payload
      | editColumn | companyType   | value   |
      | doNotOrder | <companyType> | <value> |
    And User sends a PUT request to edit the item
    And User checks status code and status text of api
      | expectedStatus   | expectedStatusText   |
      | <expectedStatus> | <expectedStatusText> |
    And User sets api endpoint to get a item in Custom
    And User sends a GET request to get a item in Custom
    And User checks status code and status text of api
      | expectedStatus   | expectedStatusText   |
      | <expectedStatus> | <expectedStatusText> |
    And User checks doNotOrder function: true
    And User sets GET api endpoint to get Item by Item key
    And User sends a GET request to get Item by Item key
    And User checks status code and status text of api
      | expectedStatus   | expectedStatusText   |
      | <expectedStatus> | <expectedStatusText> |
    And User checks API contract of get Item by Item key api
    And User checks isHidden is true or false
    # When change isHidden from true to false => doNotOrder and doNotRestock are false
    And User sets request body of edit item api with payload
      | editColumn | companyType   | value   |
      | isHidden   | <companyType> | <value> |
    And User sends a PUT request to edit the item
    And User checks status code and status text of api
      | expectedStatus   | expectedStatusText   |
      | <expectedStatus> | <expectedStatusText> |
    And User sets api endpoint to get a item in Custom
    And User sends a GET request to get a item in Custom
    And User checks status code and status text of api
      | expectedStatus   | expectedStatusText   |
      | <expectedStatus> | <expectedStatusText> |
    And User checks doNotOrder function: false
    And User sends GET api endpoint to get items in RestockAMZ without filtered options
    And User checks status code and status text of api
      | expectedStatus   | expectedStatusText   |
      | <expectedStatus> | <expectedStatusText> |
    And User checks doNotRestock function: false

    Examples:
      | TC_ID        | companyType | email                    | limitRow | editColumn   | value  | expectedStatus | expectedStatusText | field1       | value1 | field2     | value2 |
      | TC_DNOR001_1 | ASC         | testcreateitem@gmail.com | 10       | doNotRestock | random | 200            | OK                 | doNotRestock | false  | doNotOrder | false  |
      | TC_DNOR001_2 | CSV         | testcreateitem@gmail.com | 10       | doNotRestock | random | 200            | OK                 | doNotRestock | false  | doNotOrder | false  |
      | TC_DNOR001_3 | QBFS        | testcreateitem@gmail.com | 10       | doNotRestock | random | 200            | OK                 | doNotRestock | false  | doNotOrder | false  |
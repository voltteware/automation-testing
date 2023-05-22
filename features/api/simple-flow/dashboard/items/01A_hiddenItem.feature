@test-api @api-dashboard @api-items @api-hiddenItem
Feature: API_Dashboard Hidden Item PUT /api/item

  Background: Send GET /realm request to get all company keys of current logged in user before each test
    Given user sends a POST login request to get valid cookie with role
      | role  | username                 | password  |
      | admin | testhiddenitem@gmail.com | Test1111# |
    And User sets GET api endpoint to get companies information of current user
    And In Header of the request, she sets param Cookie as valid connect.sid
    When User sends a GET request to get companies

  @TC_HI001
  Scenario Outline: <TC_ID> - Verify user <email> could call this API to hidden of a items for company type (<companyType>)
    Given User picks company which has onboarded before with type <companyType> in above response
    And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
    And User sets GET api endpoint to get suppliers with limit row: <limitRow>
    And User sends a GET request to get list suppliers
    And user checks Auto supplier exist in the system, if it does not exist will create new supplier
    And User sets GET api endpoint to get item with limit row: <limitRow>
    And User sends a GET request to get list items
    And User sets POST api endpoint to create item
    And User sets request body with payload as name: "<itemName>" and description: "<description>" and vendorName: "<vendorName>" and vendorPrice: "<vendorPrice>" and moq: "<moq>" and leadTime: "<leadTime>" and orderInterval: "<orderInterval>" and serviceLevel: "<serviceLevel>" and onHand: "<onHand>" and onHandMin: "<onHandMin>" and onHandThirdParty: "<onHandThirdParty>" and onHandThirdPartyMin: "<onHandThirdPartyMin>" and lotMultipleQty: "<lotMultipleQty>" and lotMultipleItemName: "<lotMultipleItemName>" and asin: "<asin>" and fnsku: "<fnsku>" and skuNotes: "<skuNotes>" and prepNotes: "<prepNotes>" and supplierRebate: "<supplierRebate>" and inboundShippingCost: "<inboundShippingCost>" and reshippingCost: "<reshippingCost>" and repackagingMaterialCost: "<repackagingMaterialCost>" and repackingLaborCost: "<repackingLaborCost>" and rank: "<rank>" and inventorySourcePreference: "<inventorySourcePreference>" and average7DayPrice: "<average7DayPrice>" and isFbm: "<isFbm>" and key: "" and vendorKey: "<vendorKey>" and lotMultipleItemKey: "<lotMultipleItemKey>"
    And User sends a POST method to create item
    And User set GET api endpoint to get items with name contains "<containText>"
    And User sends a GET request to get list items
    And User picks a random item in above list items
    And User saves the item key
    And User sets PUT api endpoint to edit isHidden of the above item for company type <companyType> with new value: true
    When User sends a PUT request to edit the item
    Then The expected status code should be <expectedStatus>
    And The new isHidden of item must be updated successfully
    And User checks API contract essential types in the response of hidden item are correct
    And User set GET api endpoint to get item that is hidden
    And User sends a GET request to get list items
    And User checks that there are no item in list

    Examples:
      | TC_ID      | companyType | email                    | containText | expectedStatus | limitRow | itemName      | description     | vendorName | vendorPrice | moq    | leadTime | orderInterval | serviceLevel | onHand | onHandMin | onHandThirdParty | onHandThirdPartyMin | lotMultipleQty | lotMultipleItemName | asin   | fnsku  | skuNotes | prepNotes | supplierRebate | inboundShippingCost | reshippingCost | repackagingMaterialCost | repackingLaborCost | rank   | inventorySourcePreference | average7DayPrice | isFbm  | vendorKey | lotMultipleItemKey |
      | TC_HI001_1 | ASC         | testhiddenitem@gmail.com | Auto        | 200            | 10       | New Item Auto | New description | random     | random      | random | random   | random        | random       | random | random    | random           | random              | random         | random              | random | random | random   | random    | random         | random              | random         | random                  | random             | random | FBA + FBM                 | random           | random | random    | random             |
      | TC_HI001_2 | CSV         | testhiddenitem@gmail.com | Auto        | 200            | 10       | New Item Auto | New description | random     | random      | random | random   | random        | random       | random | random    | random           | random              | random         | random              | random | random | random   | random    | random         | random              | random         | random                  | random             | random | FBA + FBM                 | random           | random | random    | random             |
      | TC_HI001_3 | QBFS        | testhiddenitem@gmail.com | Auto        | 200            | 10       | New Item Auto | New description | random     | random      | random | random   | random        | random       | random | random    | random           | random              | random         | random              | random | random | random   | random    | random         | random              | random         | random                  | random             | random | FBA + FBM                 | random           | random | random    | random             |
@test-api @api-dashboard @api-exportItem
Feature: API_Dashboard PUT /api/sync/item/download?<fields>
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                      | password  |
            | admin | testautoforecast@gmail.com    | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies
        Then User picks random company which has onboarded in above response
        And User sets GET api endpoint to get information of a company belongs to themself using company key random
        And User sets valid cookie of themself and valid companyKey and valid companyType in the header
    
    @TC_EI001 @smoke-test-api @regression-api 
    Scenario Outline: <TC_ID> - Verify user <email> could call API export item
        # Create new item with contain text "Auto"
        Given User sets POST api endpoint to create item
        And User sets request body with payload as name: "<itemName>" and description: "<description>" and vendorName: "" and vendorPrice: "<vendorPrice>" and moq: "<moq>" and leadTime: "<leadTime>" and orderInterval: "<orderInterval>" and serviceLevel: "<serviceLevel>" and onHand: "<onHand>" and onHandMin: "<onHandMin>" and onHandThirdParty: "<onHandThirdParty>" and onHandThirdPartyMin: "<onHandThirdPartyMin>" and lotMultipleQty: "<lotMultipleQty>" and lotMultipleItemName: "" and asin: "" and fnsku: "" and skuNotes: "" and prepNotes: "" and supplierRebate: "" and inboundShippingCost: "" and reshippingCost: "" and repackagingMaterialCost: "" and repackingLaborCost: "" and rank: "" and inventorySourcePreference: "" and average7DayPrice: "" and isFbm: "" and key: "" and vendorKey: "" and lotMultipleItemKey: ""
        When User sends a POST method to create item
        # Export Items
        And User sets POST api endpoint to export Item
        And User sets payload as name: "<removedItemKeys>"
        When User sends POST api endpoint to export Item
        # Count item that is Hidden
        And User set GET api endpoint to count item that is hidden
        And User sends GET api endpoint to count item that is hidden
        # Count item that is Active
        And User sends GET api request to get all items
        # Check total items in export file = total item that is hidden + item that is active
        Then User checks total items in export file EQUALS total items
        # Pick random item to check value in export file and in grid
        And User set GET api endpoint to get items with name contains "<containText>"
        And User sends a GET request to get list items
        And User picks a random item in above list items
        And User checks values of item that just picked the same as export file
        # Pick random item to check value in export file and in grid
        And User set GET api endpoint to get items with name contains "<containText>"
        And User sends a GET request to get list items
        And User picks a random item in above list items
        And User checks values of item that just picked the same as export file
        # Pick random item to check value in export file and in grid
        And User set GET api endpoint to get items with name contains "<containText>"
        And User sends a GET request to get list items
        And User picks a random item in above list items
        And User checks values of item that just picked the same as export file
        # Hide item after created
        And User sets PUT api endpoint to edit isHidden of the above item for company type <companyType> with new value: true
        When User sends a PUT request to edit the item
        Examples:
            | TC_ID      | companyType | email                      | expectedStatus | expectedStatusText | containText| removedItemKeys | itemName      | description     | vendorPrice | moq    | leadTime | orderInterval | serviceLevel | onHand | onHandMin | onHandThirdParty | onHandThirdPartyMin | lotMultipleQty |
            | TC_EI001_1 | CSV         | testautoforecast@gmail.com | 200            | OK                 | Auto       |                 | New Item Auto | New description | random      | random | random   | random        | random       | random | random    | random           | random              | random         | 
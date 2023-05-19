@test-api @api-dashboard @item-history-length
Feature: API_Dashboard Cannot update item history length
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                     | password  |
            | admin | testuserforecastrx@gmail.com | Test1111# |

    @TC_IHL001_CSV @smoke-test-api @bug1969
    Scenario Outline: <TC_ID> - Verify user <email> cannot update item history length in Items section when company <companyType> is Onboarding
        Given In Header of the request, User sets param Cookie as valid connect.sid
        And User sets request body of create company api with payload
            | companyName   | companyKey | companyType   | serviceLevel   | leadTime   | orderInterval   | initialSyncDate | marketplaceId |
            | <companyName> | null       | <companyType> | <serviceLevel> | <leadTime> | <orderInterval> | null            | null          |
        And User sets POST api endpoint to create company
        And User sends a POST method to create company
        And User sets PUT api endpoint to update company keys
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets request body with payload as leadTime: <leadTime> and companyKey, companyType
        And User sends a PUT method to update company of "<email>" by company key
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks API contract essential types in company object are correct
        And User checks values of <properties> in response of update company are correct
        And User sets POST api endpoint to create suppliers
        And User sets request body of create suppliers api with payload
            | name           | description   | emailSupplier   | moq   | leadTime   | orderInterval   | serviceLevel   | targetOrderValue | freeFreightMinimum | restockModel |
            | <supplierName> | <description> | <emailSupplier> | <moq> | <leadTime> | <orderInterval> | <serviceLevel> | null             | null               | null         |
        And User sends a POST method to create supplier
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks API contract essential types in supplier object are correct
        And User sets GET api endpoint to get suppliers with limit row: <limitRow>
        And User sends a GET request to get list suppliers
        And User picks random supplier in above response
        And User saves the supplier key
        And User sets POST api endpoint to create item
        And User sets request body of create item api with payload
            | name       | description   | vendorName   | vendorPrice   | moq   | leadTime   | orderInterval   | serviceLevel   | onHand   | onHandMin   | onHandThirdParty   | onHandThirdPartyMin   | lotMultipleQty | lotMultipleItemName | asin | fnsku | skuNotes | prepNotes | supplierRebate | inboundShippingCost | reshippingCost | repackagingMaterialCost | repackingLaborCost | rank | inventorySourcePreference | average7DayPrice | isFbm | key  | vendorKey   | lotMultipleItemKey |
            | <itemName> | <description> | <vendorName> | <vendorPrice> | <moq> | <leadTime> | <orderInterval> | <serviceLevel> | <onHand> | <onHandMin> | <onHandThirdParty> | <onHandThirdPartyMin> | null           | null                | null | null  | null     | null      | null           | null                | null           | null                    | null               | null | null                      | null             | null  | null | <vendorKey> | null               |
        And User sends a POST method to create item
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        # Have checked itemHistoryLengthInDay and itemHistoryLength require in Zod
        And User checks API contract essential types in item object are correct
        And User checks values in response of create item are correct
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User picks a random item in above list items
        And User saves the item key
        And User sets request body of edit item api with payload
            | editColumn   | companyType   | value   |
            | <editColumn> | <companyType> | <value> |
        When User sends a PUT request to edit the item
        Then User checks status code and status text of api
            | expectedStatus | expectedStatusText |
            | 400            | Bad Request        |
        And Check that the company just created exists in the current companies list of his
        And User sets DELETE api endpoint to delete company
        And User sends a DELETE method to <deleteType> delete the created company

        Examples:
            | TC_ID         | properties | email                        | companyName | companyType | value  | serviceLevel | leadTime | orderInterval | expectedStatus | expectedStatusText | supplierName      | description     | emailSupplier      | moq    | itemName      | description     | vendorName | vendorPrice | onHand | onHandMin | onHandThirdParty | onHandThirdPartyMin | lotMultipleQty | lotMultipleItemName | vendorKey | limitRow | itemKey | deleteType | editColumn        |
            | TC_IHL001_CSV | leadTime   | testuserforecastrx@gmail.com | random      | CSV         | random | random       | random   | random        | 200            | OK                 | New Supplier Auto | New description | newemail@gmail.com | random | New Item Auto | New description | random     | random      | random | random    | random           | random              | random         | random              | random    | 20       | random  | hard       | itemHistoryLength |

    @TC_IHL002_ASC @smoke-test-api @bug1969
    Scenario Outline: <TC_ID> - Verify user <email> cannnot update item history length in in Items section when company is Onboarding
        Given In Header of the request, user sets param Cookie as valid connect.sid
        And User sends a GET request to get all company
        And User selects onboarding company with type <companyType>
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets PUT api endpoint to update company keys
        And User sets request body with payload as leadTime: <leadTime> and companyKey, companyType
        And User sends a PUT method to update company of "<email>" by company key
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks API contract essential types in company object are correct
        And User checks values of <properties> in response of update company are correct
        And User sets POST api endpoint to create suppliers
        And User sets request body of create suppliers api with payload
            | name           | description   | emailSupplier   | moq   | leadTime   | orderInterval   | serviceLevel   | targetOrderValue | freeFreightMinimum | restockModel |
            | <supplierName> | <description> | <emailSupplier> | <moq> | <leadTime> | <orderInterval> | <serviceLevel> | null             | null               | null         |
        And User sends a POST method to create supplier
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks API contract essential types in supplier object are correct
        And User sets GET api endpoint to get suppliers with limit row: <limitRow>
        And User sends a GET request to get list suppliers
        And User picks random supplier in above response
        And User saves the supplier key
        And User sets POST api endpoint to create item
        And User sets request body of create item api with payload
            | name       | description   | vendorName   | vendorPrice   | moq   | leadTime   | orderInterval   | serviceLevel   | onHand   | onHandMin   | onHandThirdParty   | onHandThirdPartyMin   | lotMultipleQty   | lotMultipleItemName | asin   | fnsku   | skuNotes   | prepNotes   | supplierRebate   | inboundShippingCost   | reshippingCost   | repackagingMaterialCost   | repackingLaborCost   | rank   | inventorySourcePreference   | average7DayPrice   | isFbm   | key  | vendorKey   | lotMultipleItemKey |
            | <itemName> | <description> | <vendorName> | <vendorPrice> | <moq> | <leadTime> | <orderInterval> | <serviceLevel> | <onHand> | <onHandMin> | <onHandThirdParty> | <onHandThirdPartyMin> | <lotMultipleQty> | null                | <asin> | <fnsku> | <skuNotes> | <prepNotes> | <supplierRebate> | <inboundShippingCost> | <reshippingCost> | <repackagingMaterialCost> | <repackingLaborCost> | <rank> | <inventorySourcePreference> | <average7DayPrice> | <isFbm> | null | <vendorKey> | null               |
        And User sends a POST method to create item
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks API contract essential types in item object are correct
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User picks a random item in above list items
        And User saves the item key
        And User sets request body of edit item api with payload
            | editColumn   | companyType   | value   |
            | <editColumn> | <companyType> | <value> |
        When User sends a PUT request to edit the item
        Then User checks status code and status text of api
            | expectedStatus | expectedStatusText |
            | 400            | Bad Request        |

        Examples:
            | TC_ID         | properties | companyType | value  | email                        | supplierName      | description     | emailSupplier      | moq    | itemName      | description     | leadTime | orderInterval | serviceLevel | limitRow | itemName      | vendorName | vendorPrice | onHand | onHandMin | onHandThirdParty | onHandThirdPartyMin | lotMultipleQty | asin   | fnsku  | skuNotes | prepNotes | supplierRebate | inboundShippingCost | reshippingCost | repackagingMaterialCost | repackingLaborCost | rank   | inventorySourcePreference | average7DayPrice | isFbm  | vendorKey | expectedStatus | expectedStatusText |
            | TC_IHL002_ASC | leadTime   | ASC         | random | testuserforecastrx@gmail.com | New Supplier Auto | New description | newemail@gmail.com | random | New Item Auto | New description | random   | random        | random       | 40       | New Item Auto | random     | random      | random | random    | random           | random              | random         | random | random | random   | random    | random         | random              | random         | random                  | random             | random | FBA + FBM                 | random           | random | random    | 200            | OK                 |
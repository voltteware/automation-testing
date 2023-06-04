@test-api @regression-api @api-address-book @api-restockAMZ
Feature: API_Regression Address Book
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies

    @TC_AB001
    Scenario Outline: TC_AB001 - Verify user <email> could call APIs to add new address book with all data valid then update and delete
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers with limit row: <limitRow>
        And User sends a GET request to get list suppliers
        And User picks random supplier in above response
        # Add new address book
        And User sets POST api to add new address book with following information:
            | country | supplierName | streetLine1 | streetLine2 | city   | state  | zipCode | phoneNumber |
            | random  | random       | random      | random      | random | random | random  | random      |
        And User sends a POST request to add new address book
        Then The expected status code should be <expectedStatus>
        And User checks API contract of add new address book response
        # Check new address book create successfully
        And User checks values in response of add new address book are correct
        And User sets GET api to get list address books by full name
        And User sends a GET request to get list address books
        And User checks just added address book must be found and display the correct information
        # Update address book
        And User sets PUT api to update address book with following information:
            | country | supplierName | streetLine1 | streetLine2 | city   | state  | zipCode | phoneNumber |
            | random  | random       | random      | random      | random | random | random  | random      |
        And User sends a PUT request to update address book
        And The expected status code should be <expectedStatus>
        And User checks API contract of update address book response
        And User checks values in response of update address book are correct
        # Delete just created address book
        And User sets DELETE api to delete address book
        And User send a DELETE method to delete address book
        And The expected status code should be <expectedStatus>

        Examples:
            | user  | email                      | password  | companyKey | companyType | expectedStatus | limitRow |
            | admin | testautoforecast@gmail.com | Test1111# | random     | ASC         | 200            | 10       |

    @TC_AB002
    Scenario Outline: TC_AB002 - Verify user <email> could call APIs to add new address book with only input required field then update and delete
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers with limit row: <limitRow>
        And User sends a GET request to get list suppliers
        And User picks random supplier in above response
        # Add new address book
        And User sets POST api to add new address book with following information:
            | country | supplierName | streetLine1 | streetLine2 | city   | state  | zipCode | phoneNumber |
            | random  | random       | random      |             | random | random | random  |             |
        And User sends a POST request to add new address book
        Then The expected status code should be <expectedStatus>
        And User checks API contract of add new address book response
        # Check new address book create successfully
        And User checks values in response of add new address book are correct
        And User sets GET api to get list address books by full name
        And User sends a GET request to get list address books
        And User checks just added address book must be found and display the correct information
        # Update address book
        And User sets PUT api to update address book with following information:
            | country | supplierName | streetLine1 | streetLine2 | city   | state  | zipCode | phoneNumber |
            | random  | random       | random      | random      | random | random | random  | random      |
        And User sends a PUT request to update address book
        And The expected status code should be <expectedStatus>
        And User checks API contract of update address book response
        And User checks values in response of update address book are correct
        # Delete just created address book
        And User sets DELETE api to delete address book
        And User send a DELETE method to delete address book
        And The expected status code should be <expectedStatus>

        Examples:
            | user  | email                      | password  | companyKey | companyType | expectedStatus | limitRow |
            | admin | testautoforecast@gmail.com | Test1111# | random     | ASC         | 200            | 10       |
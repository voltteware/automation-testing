@test-api @regression-api @compare-data @api-amazon @api-dashboard
Feature: API_Testing Compare data on ForecastRx and Amazon in Demand section
    Background: Send POST /login request to login before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies

    #Pre-condition: Company needs to sync on UI firstly to reduce the time run Automation.
    # We use company "Fishers Finery Amazon" to check data sync because Fishers Finery is the NA marketplace => contains all data sales in report (sales-chanel: Amazon.com.mx; Amazon.ca; Amazon.com; Non-Amazon)
    Scenario Outline: <TC_ID> - User can compare data on ForecastRx and Amazon in Demand section
        Given User picks a company with type <companyType> and name <companyName> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        And User sets GET api endpoint to get demands with itemName and dateStart
            | itemName   | dateStart   |
            | <itemName> | <dateStart> |
        And User sends a GET request to get specific demand of item
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        # These steps below create report on Amazon (example)
        # And User sends a POST method to create report on Amazon
        # And User sends a GET method to get report by reportID
        # And User sends a GET method to get report document by reportDocumentID
        And User checks total items in report file EQUALS total with section and item name
            | itemName   | section   | file       |
            | <itemName> | <section> | <fileName> |
        When User picks random demand in above response
        Then User checks value on grid match with value in report file: <section>

        Examples:
            | TC_ID       | companyType | email                      | itemName     | expectedStatus | expectedStatusText | dateStart  | companyName           | section | fileName   |
            | TC_CDD001_1 | ASC         | testautoforecast@gmail.com | AB0101-BLK-U | 200            | OK                 | 2023-05-01 | Fishers Finery Amazon | demand  | demand_May |
            | TC_CDD001_2 | ASC         | testautoforecast@gmail.com | AB0101-NWH-U | 200            | OK                 | 2023-05-01 | Fishers Finery Amazon | demand  | demand_May |
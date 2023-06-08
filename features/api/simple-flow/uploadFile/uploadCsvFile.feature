@test-api @upload-file
Feature: API_Regression User Upload file
    Background: Send POST /login request to login before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies

    @runthis
    Scenario Outline: Add new supplier via upload csv file
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User prepares the <fileName> file contains the list supplier as following data:
            | Supplier Name | Lead Time | Order Interval |
            | random        | random    | random         |
            | random        | random    | random         |
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

        Examples:
            | TC_ID             | companyType | email                      | fileName                        | option | expectedStatus | expectedStatusText |
            | TC_ASC_SSKUS001_2 | CSV         | testautoforecast@gmail.com | supplier-template-test-auto.csv | true   | 200            | OK                 |
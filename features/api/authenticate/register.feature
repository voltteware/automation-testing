@test-api @api-register
Feature: API /register

	@TC_R001 @api-register-with-valid-payload
	Scenario Outline: <id> - Verify POST /api/register with <scenario>
		Given User sets POST register service api endpoint
		And User sets request body with payload as firstName: "<firstName>" and lastName: "<lastName>" and companyName: "<companyName>" and companyType: "<companyType>" and phone: "<phone>" and email: "<email>" and password: "<password>"
		When User sends a POST method to register account
		Then The expected status code should be <expectedStatus>
		And Response of Login and Register API must match with API contract
		And UserId <email> in the response of API is correct
		Given user sends a POST login request to get valid cookie with role
			| role  | username           | password  |
			| admin | may27pre@gmail.com | Test1111! |
		And User sends a DELETE method to delete user <email>
		Then The expected status code should be 200
		Examples:
			| id   | scenario                                                              | email              | password  | firstName | lastName | companyName         | companyType | phone      | expectedStatus |
			| A001 | valid email/password/firstName/lastName/companyName/companyType/phone | testauto@gmail.com | Test1111! | Test      | Auto     | ITC-Company-Testing | ASC         | 0355025511 | 201            |

	@api-register-with-invalid-payload
	Scenario Outline: <id> - Verify POST /api/register with <scenario>
		Given User sets POST register service api endpoint
		And User sets request body with payload as firstName: "<firstName>" and lastName: "<lastName>" and companyName: "<companyName>" and companyType: "<companyType>" and phone: "<phone>" and email: "<email>" and password: "<password>"
		When User sends a POST method to register account
		Then The expected status code should be <expectedStatus>
		And The status text is "<expectedStatusText>"

		Examples:
			| id   | scenario                                                                           | email                   | password  | firstName | lastName | companyName         | companyType | phone      | expectedStatus | expectedStatusText                            |
			| A002 | exist email and valid /password/firstName/lastName/companyName/companyType/phone   | testautoexist@gmail.com | Test1111! | Test      | Auto     | ITC-Company-Testing | ASC         | 0355025511 | 400            | Username already exists                       |
			| A003 | invalid passowrd and valid /email/firstName/lastName/companyName/companyType/phone | testauto1@gmail.com     | Test1111  | Test      | Auto     | ITC-Company-Testing | ASC         | 0355025511 | 400            | Password does not meet strength requirements. |
			| A004 | empty passowrd and valid /email/firstName/lastName/companyName/companyType/phone   | testauto1@gmail.com     |           | Test      | Auto     | ITC-Company-Testing | ASC         | 0355025511 | 400            | Password does not meet strength requirements. |
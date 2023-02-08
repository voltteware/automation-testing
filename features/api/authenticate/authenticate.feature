@test-api @api-login
Feature: API /login

	@api-login-with-valid-payload
	Scenario Outline: <id> - Verify POST /login with <scenario>
		Given Nancy sets POST login service api endpoint
		And She sets request body with payload as email: "<email>" and passowrd: "<password>"
		When She sends a POST method to authenticate account
		Then The expected status code should be <expectedStatus>
		And Response of Login API includes enough properties or keys
		And UserId <email> in the response of API Login is correct
		And Check that API Login returns cookie value

		Examples:
			| id   | scenario             | email              | password  | expectedStatus |
			| A001 | valid email/password | may27pre@gmail.com | Test1111! | 201            |

	@api-login-with-invalid-payload
	Scenario Outline: <id> - Verify POST /login with with <scenario>
		Given Nancy sets POST login service api endpoint
		And She sets request body with payload as email: "<email>" and passowrd: "<password>"
		When She sends a POST method to authenticate account
		Then The expected status code should be <expectedStatus>
		And The status text is "<expectedStatusText>"
		
		Examples:
			| id   | scenario                              | email              | password  | expectedStatus | expectedStatusText           |
			| A002 | correct email/incorrect password      | may27pre@gmail.com | wedDW23!@ | 400            | Invalid username or password |
			| A003 | incorrect email/correct password      | maypre@gmail.com   | Test1111! | 400            | Invalid username or password |
			| A004 | empty email and empty password        |                    |           | 400            | Invalid username or password |
			| A005 | empty email/correct password          |                    | Test1111! | 400            | Invalid username or password |
			| A006 | invalid format email/correct password | email.example.com  | Test1111! | 400            | Invalid username or password |




@test-api @api-resetPassword @api-authenticate
Feature: API /resetPassword

	@api-resetPassword
	Scenario Outline: <id> - Verify send GET /resetPassword with <scenario>
		Given User sets GET reset password service api endpoint
		When User sends a GET request to reset password keys with email <email>
		Then User checks values in response body return are correct: <email>
		And The expected status code should be <expectedStatus>
		And The status text is "<expectedStatusText>"
		Examples:
			| id       | scenario      | email                       | expectedStatus | expectedStatusText |
			| TC_RP001 | email existed | testresetpassword@gmail.com | 201            | Created            |

	@api-resetPassword
	Scenario Outline: <id> - Verify send GET /resetPassword with <scenario>
		Given User sets GET reset password service api endpoint
		When User sends a GET request to reset password keys with email <email>
		Then The expected status code should be <expectedStatus>
		And The status text is "<expectedStatusText>"
		Examples:
			| id       | scenario        | email                              | expectedStatus | expectedStatusText |
			| TC_RP002 | email not exist | testresetpasswordinvalid@gmail.com | 400            | User not found     |
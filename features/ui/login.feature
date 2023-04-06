@test-ui @login
Feature: Login to the ForecastRx
	Background:
		Given user sends a POST login request to get valid cookie with role
            | role  | username                     | password  |
            | admin | may27pre@gmail.com           | Test1111# |
			
	@LI001
	Scenario Outline: LI001 - Verify login successfully with <scenario>
		Given User is on Login page
		When User enters the username "<email>" and the password "<password>"
		And User clicks SignIn button
		Then Verify the username is displayed 
		Examples:
			| scenario                 | email              | password  |
			| valid email and password | may27pre@gmail.com | Test1111# |

	@LI002-LI003
	Scenario Outline: <id> - Verify login unsuccessfully with <scenario>
		Given User is on Login page
		When User enters the username "<email>" and the password "<password>"
		And User clicks SignIn button
		Then Verify alert "<alertMessage>" is displayed
		Examples:
			| id    | scenario                             | email                 | password   | alertMessage                                 |
			| LI002 | valid email and incorrect password   | may27pre@gmail.com    | Test11111! | User credentials could not be authenticated. |
			| LI003 | incorrect email and correct password | may27pre123@gmail.com | Test1111#  | User credentials could not be authenticated. |

	@LI004
	Scenario Outline: <id> - Verify that the system will show an error message when user <scenario>
		Given User is on Login page
		When User enters the username "<email>" and the password "<password>"
		# And User clicks SignIn button
		Then Verify errors "<errorEmail>" "<errorPassword>" are displayed
		Examples:
			| id    | scenario                                                                  | email              | password  | errorEmail                   | errorPassword      |
			| LI004 | Sign in with correct Email and empty password                             | may27pre@gmail.com |           |                              | Password required. |
			| LI004 | Sign in with empty Email and correct password                             |                    | Test1111# | Email address required.      |                    |
			| LI004 | click on email and password empty and click out but do not input anything |                    |           | Email address required.      | Password required. |
			| LI004 | enter email with incorrect format                                         | @example.com       |           | Enter a valid email address. | Password required. |
			| LI004 | enter email with incorrect format                                         | email.example.com  |           | Enter a valid email address. | Password required. |
	# | LI008 | enter email with incorrect format                 | #@%^%#$@#$@#.com              |           | Enter a valid email address. | Password required. |
	# | LI008 | enter email with incorrect format                 | Joe Smith <email@example.com> |           | Enter a valid email address. | Password required. |
	# | LI008 | enter email with incorrect format                 | email@example@example.com     |           | Enter a valid email address. | Password required. |
	# | LI008 | enter email with incorrect format                 | email@example.com (Joe Smith) |           | Enter a valid email address. | Password required. |
	# | LI008 | enter email with incorrect format                 | aegqvflhe@-yomail.info        |           | Enter a valid email address. | Password required. |

	@LI005
	Scenario Outline: <id> - Verify that the system will show an error message when user <scenario>
		Given User is on Login page
		And User clicks SignIn button
		Then Verify errors "<errorEmail>" "<errorPassword>" are displayed
		Examples:
			| id    | scenario                                            | email | password | errorEmail              | errorPassword      |
			| LI005 | clicks Sign In without inputting email and password |       |          | Email address required. | Password required. |

# @LI006 This case still has bug now.
# Scenario Outline: <id> - Verify that the system will show an error message when user <scenario>
# 	Given User is on Login page
# 	When User enters the username "<email>" and the password "<password>"
# 	And User clicks SignIn button
# 	Then Verify errors "<errorEmail>" "<errorPassword>" are displayed
# 	Examples:
# 		| id    | scenario                              | email | password | errorEmail | errorPassword      |
# 		| LI005 | enters email but leave password empty |       |          |            | Password required. |


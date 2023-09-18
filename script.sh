curl --location --request POST 'https://dev-4lr6wilgiki55b88.us.auth0.com/oauth/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'client_id=<your client id>' \
--data-urlencode 'username=<your username>' \
--data-urlencode 'password=<your password>' \
--data-urlencode 'grant_type=password' \
--data-urlencode 'scope=openid'

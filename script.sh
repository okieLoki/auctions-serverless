curl --location --request POST 'https://dev-4lr6wilgiki55b88.us.auth0.com/oauth/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'client_id= <>' \
--data-urlencode 'username= <>' \
--data 'audience= <>' \
--data-urlencode 'password= <>' \
--data-urlencode 'grant_type=password' \
--data-urlencode 'scope=openid'

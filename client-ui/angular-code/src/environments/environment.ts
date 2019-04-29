// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  cognitoParams: {
    cognitoLoginUrl:'https://scratch-cheet-sheet.auth.us-east-1.amazoncognito.com/login',
    cognitoLogoutUrl:'https://scratch-cheet-sheet.auth.us-east-1.amazoncognito.com/logout',
    cognitoClientId: '13r6k9a94vo40pqa83cdmhomjm',
    cognitoResponseType: 'token',
    cognitoScope: 'openid+profile+aws.cognito.signin.user.admin',
    cognitoRedirectUri: 'http://localhost:4200'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
`
https://scratch-cheet-sheet.auth.us-east-1.amazoncognito.com/login?
response_type=token&
client_id=13r6k9a94vo40pqa83cdmhomjm&
redirect_uri=http://localhost:4200/login/&scope=openid+profile+aws.cognito.signin.user.admin
`

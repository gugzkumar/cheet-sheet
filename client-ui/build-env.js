/**
 * This file helps us dynamically buld our environment variables in to
 * Angular environment.ts files.
 */
const fs = require('fs');

function getEnvFileContents (isProduction) {
  return `// This file was autogenerated by build-env.js
export const environment = {
  production: ${isProduction},
  apiUrl: '${process.env['API_URL']}',
  cognitoParams: {
    cognitoLoginUrl:'${process.env['COGNITO_AUTH_URL']}/login',
    cognitoLogoutUrl:'${process.env['COGNITO_AUTH_URL']}/logout',
    cognitoClientId: '${process.env['COGNITO_CLIENT_ID']}',
    cognitoResponseType: 'token',
    cognitoScope: 'openid+profile+aws.cognito.signin.user.admin',
    cognitoRedirectUri: '${process.env['CLIENT_UI_URL']}'
  }
};`
}

// Build environment.ts
fs.writeFile('./src/environments/environment.ts', getEnvFileContents(false), (err) => {
  if (err) throw err;
  console.log('environment.ts file successfully created');
});

// Build environment.ts
fs.writeFile('./src/environments/environment.prod.ts', getEnvFileContents(true), (err) => {
  if (err) throw err;
  console.log('environment.prod.ts file successfully created');
});

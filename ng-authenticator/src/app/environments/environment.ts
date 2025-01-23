// export const environment = {
//     production: false,
//     cognito: {
//       userPoolId: 'ca-central-1_gKTOJNH7T',
//       clientId: '1klhl2gg79t2p8b0i2uee2lvs2'
//     }
//   };
// export const environment = {
//   production: false,
//   cognito: {
//     userPoolId: 'ca-central-1_gKTOJNH7T',
//     clientId: '1klhl2gg79t2p8b0i2uee2lvs2',
//     domain: 'https://ca-central-1gktojnh7t.auth.ca-central-1.amazoncognito.com',
//     redirectSignIn: 'http://localhost:4200/home',
//     redirectSignOut: 'http://localhost:4200/login'
//   }
// };
export const environment = {
  production: false,
  cognito: {
    userPoolId: 'ca-central-1_gKTOJNH7T',
    clientId: '1klhl2gg79t2p8b0i2uee2lvs2',
    // userPoolId: 'ca-central-1_B1BU201tE',
    // clientId: '1klhl2gg79t2p8b0i2uee2lvs2',
    domain: 'ca-central-1gktojnh7t.auth.ca-central-1.amazoncognito.com', // Remove https:// from beginning
    redirectSignIn: 'http://localhost:4200/home',
    redirectSignOut: 'http://localhost:4200/login',
    googleClientId: '824786634927-rdli0bpl7pnu7cuisvl25r7607if5j3e.apps.googleusercontent.com'
  }
};
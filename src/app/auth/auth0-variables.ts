/*
 To prevent committing of secrets to the git repo
 we will tell get to "ignore" changes in this file
 by running'git update-index --assume-unchanged <file>'.
 We can undo this by running 'git update-index --no-assume-unchanged <file>'.
*/

interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: 'YOUR_CLIENT_ID',
  domain: 'YOUR_DOMAIN',
  callbackURL: 'http://localhost:4200/callback'
};
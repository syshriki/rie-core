import nock from 'nock';
import config from 'config';
import jwksPublic from './jwksPublic.json' with {"type": "json"};

export async function nockJwks() {
  const jwksUri = config.get<string>('auth.jwksUri');
  const url = new URL(jwksUri);
    
  nock(url.origin)
    .get(url.pathname)
    .reply(200, {
      keys: [jwksPublic]
    })
    .persist();
}

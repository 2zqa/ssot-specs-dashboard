export interface OidcConfig {
  authority: string;
  clientId: string;
  redirectUri: string;
  scope: string;
}

export interface WellKnownOpenIdConfiguration {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  revocation_endpoint: string;
  introspection_endpoint: string;
  userinfo_endpoint: string;
  jwks_uri: string;
  scopes_supported: Array<string>;
  response_types_supported: Array<string>;
  response_modes_supported: Array<string>;
  grant_types_supported: Array<string>;
  token_endpoint_auth_methods_supported: Array<string>;
  subject_types_supported: Array<string>;
  id_token_signing_alg_values_supported: Array<string>;
  claim_types_supported: Array<string>;
  claims_supported: Array<string>;
  code_challenge_methods_supported: Array<string>;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
  id_token: string;
}

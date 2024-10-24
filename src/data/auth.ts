/**
 * This file contains functions surrounding authentication with OpenID Connect.
 *
 * @see https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowSteps
 * @module
 */
import { computed, signal } from '@preact/signals';

import { type ResponseObject, request } from '@/libs';
import type { OidcConfig, TokenResponse, WellKnownOpenIdConfiguration } from '@/types/oidc';

const idTokenFieldName = 'id_token';
const refreshTokenFieldName = 'refresh_token';

let openIdConfigCache: ResponseObject<WellKnownOpenIdConfiguration>;
const doesIdTokenExist = signal(!!localStorage.getItem(idTokenFieldName));
export const isLoggedIn = computed(
  () => doesIdTokenExist.value || import.meta.env.MF_SSOT_SERVER_GITLAB_AUTH_ENABLED !== 'true'
);

const oidcConfig: OidcConfig = {
  authority: import.meta.env.MF_SSOT_SERVER_OIDC_AUTHORITY,
  clientId: import.meta.env.MF_SSOT_SERVER_OIDC_CLIENT_ID,
  redirectUri: import.meta.env.MF_SSOT_SERVER_OIDC_REDIRECT_URI,
  scope: 'openid',
};

/**
 * Redirects the user to the OIDC provider (the "authority") to authenticate.
 * The user will be redirected back to the callback page after authenticating.
 *
 * @see {@link handleCallback} for handling the callback.
 * @see https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowSteps Step 1 and 2
 */
export function authenticate() {
  const authParams = new URLSearchParams({
    client_id: oidcConfig.clientId,
    redirect_uri: oidcConfig.redirectUri,
    response_type: 'code',
    state: createAndStoreState(),
    scope: oidcConfig.scope,
  });

  getAuthorizeUrl().then((url) => {
    window.location.href = `${url}/?${authParams}`;
  });
}

/**
 * handleCallback stores the token used for authentication. Should be called upon loading the callback page that is provided in {@link OidcConfig.redirectUri}
 *
 * @param code The code used to retrieve the token from the OIDC provider.
 * @param state The string to verify the authenticity of the callback.
 * @see https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowSteps Step 6 and 7
 */
export async function handleCallback(code: string, state: string) {
  const isValid = isStateValid(state);
  localStorage.removeItem('state');
  if (!isValid) {
    return;
  }

  await getTokenFromAuthority(code).then((res) => {
    setTokens(res.data.id_token, res.data.refresh_token);
  });
}

/**
 * Generates a random token and stores it in localStorage.
 * This token is used for authentication with the OIDC provider and is used to prevent CSRF attacks.
 *
 * @see {@link isStateValid}
 * @see {@link authenticate}
 * @returns The generated token.
 */
function createAndStoreState() {
  // Generate a random token
  const randomBytes = new Uint8Array(32);
  window.crypto.getRandomValues(randomBytes);
  // Convert the numbers to a hex string, adding a zero if the number is only one digit
  const token = Array.from(randomBytes, (byte) => byte.toString(16).padStart(2, '0')).join('');

  // Store the token in localStorage
  localStorage.setItem('state', token);
  return token;
}

/**
 * Retrieves the authentication token from the OIDC provider.
 *
 * @param code the code required to get the authentication token
 * @returns the token response object
 */
async function getTokenFromAuthority(code: string) {
  const tokenUrl = await getTokenUrl();

  const params = new URLSearchParams({
    client_id: oidcConfig.clientId,
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: oidcConfig.redirectUri,
  });

  const req = request({
    url: `${tokenUrl}/?${params}`,
    method: 'POST',
    shouldParseJson: true,
  }) as Promise<ResponseObject<TokenResponse>>;

  return await req;
}

export async function refreshToken() {
  const tokenUrl = await getTokenUrl();

  const params = new URLSearchParams({
    client_id: oidcConfig.clientId,
    grant_type: 'refresh_token',
    refresh_token: getRefreshToken() ?? '',
  });

  const req = request({
    url: `${tokenUrl}/?${params}`,
    method: 'POST',
    shouldParseJson: true,
  }) as Promise<ResponseObject<TokenResponse>>;

  const response = await req;
  setTokens(response.data.id_token, response.data.refresh_token);
}

/**
 * Verifies whether the state is equal to the saved one.
 *
 * @param state the state to verify
 * @returns whether the state is valid
 */
function isStateValid(state?: string): boolean {
  if (!state) {
    return false;
  }
  const storedState = localStorage.getItem('state');
  return storedState === state;
}

async function getOpenIdConfigurationFromAuthority(authority: string) {
  if (openIdConfigCache) {
    return openIdConfigCache;
  }

  const req = request({
    url: `${authority}/.well-known/openid-configuration`,
    method: 'GET',
    shouldParseJson: true,
  }) as Promise<ResponseObject<WellKnownOpenIdConfiguration>>;

  openIdConfigCache = await req;
  return openIdConfigCache;
}

/**
 * The token URL is the endpoint where an end-user can be redirected to authenticate.
 *
 * @returns the token endpoint url
 */
async function getAuthorizeUrl() {
  return await getOpenIdConfigurationFromAuthority(oidcConfig.authority).then((res) => res.data.authorization_endpoint);
}

/**
 * The token URL is the endpoint where authentication tokens can be retrieved.
 *
 * @returns the token endpoint url
 */
async function getTokenUrl() {
  return await getOpenIdConfigurationFromAuthority(oidcConfig.authority).then((res) => res.data.token_endpoint);
}

/**
 * Stores the authentication tokens in localStorage.
 *
 * @param idToken the token used for authentication
 * @param refreshToken the token needed to refresh the authentication token
 */
function setTokens(idToken: string, refreshToken: string) {
  localStorage.setItem(idTokenFieldName, idToken);
  localStorage.setItem(refreshTokenFieldName, refreshToken);
  doesIdTokenExist.value = true;
}

/**
 * Retrieves the authentication token from localStorage. Needed for API requests.
 *
 * @returns the authentication token
 */
export function getIdToken() {
  if (import.meta.env.MF_SSOT_SERVER_GITLAB_AUTH_ENABLED === 'true') {
    return localStorage.getItem(idTokenFieldName);
  } else {
    // The openapi mock server requires authentication to be present, but doesn't validate it
    return 'mocked_token';
  }
}

/**
 * Retrieves the refresh token from localStorage. Needed for refreshing the authentication token when it expires.
 *
 * The refresh token can be sent to the token endpoint to retrieve a new authentication token.
 *
 * @see {@link refreshToken}
 *
 * @returns the refresh token
 */
function getRefreshToken() {
  return localStorage.getItem(refreshTokenFieldName);
}

export function isAuthenticated() {
  if (import.meta.env.MF_SSOT_SERVER_GITLAB_AUTH_ENABLED === 'true') {
    return !!localStorage.getItem(idTokenFieldName);
  } else {
    return true;
  }
}

export function logout() {
  localStorage.removeItem(idTokenFieldName);
  localStorage.removeItem(refreshTokenFieldName);
  doesIdTokenExist.value = false;
}

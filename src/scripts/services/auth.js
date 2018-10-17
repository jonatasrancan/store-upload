import auth0 from "auth0-js";
import autoBind from "react-autobind";
import AUTH_CONFIG from "../../config/auth0-variables";
import UserActions from "../actions/user-actions";
import ErrorsActions from "../components/errors/errors-actions";

const tenantNameSpace = "https://myauth0.com/tenant";

export default class Auth {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: AUTH_CONFIG.domain,
      clientID: AUTH_CONFIG.clientId,
      redirectUri: window.location.protocol + "//" + window.location.host,
      audience: AUTH_CONFIG.audience,
      responseType: "token id_token",
      scope: "openid profile"
    });
    autoBind(this);
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        window.location.reload();
      } else if (err) {
        this.logout();
        ErrorsActions.error(err);
      } else {
        this.login();
      }
    });
  }

  login() {
    this.auth0.authorize();
  }

  setSession(authResult) {
    if (authResult && authResult.accessToken && authResult.idToken) {
      const expiresAt = JSON.stringify(
        authResult.expiresIn * 1000 + new Date().getTime()
      );
      if (window.localStorage) {
        localStorage.setItem("access_token", authResult.accessToken);
        localStorage.setItem("id_token", authResult.idToken);
        localStorage.setItem("expires_at", expiresAt);
        localStorage.setItem(
          "tenant",
          authResult.idTokenPayload[tenantNameSpace]
        );
      }
      UserActions.loggedIn(
        authResult.accessToken,
        authResult.idToken,
        authResult.idTokenPayload[tenantNameSpace]
      );
    }
  }

  logout() {
    if (window.localStorage) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("id_token");
      localStorage.removeItem("expires_at");
      localStorage.removeItem("tenant");
    }
    this.auth0.logout();
    // UserActions.loggedOut();
  }

  get isAuthenticated() {
    if (window.localStorage) {
      const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
      return new Date().getTime() < expiresAt;
    }
    return false;
  }

  getAccessToken() {
    if (window.localStorage) {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        ErrorsActions.error("No access token found");
      }
      return accessToken;
    }
    return undefined;
  }

  getTenantName() {
    if (window.localStorage) {
      const tenantName = localStorage.getItem("tenant");
      if (!tenantName) {
        ErrorsActions.error("No tenant found");
      }
      return tenantName;
    }
    return undefined;
  }
}

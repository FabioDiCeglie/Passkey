# Tired of Passwords? Check Out My Passkey (WebAuthn) Demo! 🚀

This project demonstrates a basic implementation of passwordless authentication using Passkeys (WebAuthn) with a React frontend and a Hono backend running on Cloudflare Workers.

## Features

*   User registration with Passkeys
*   User login with Passkeys
*   Secure session management
*   Uses Cloudflare Workers KV for user data storage

## Technology Stack

*   **Frontend:** React, TypeScript, Vite, React Router, Tailwind CSS
*   **Backend:** Hono (running on Cloudflare Workers), TypeScript
*   **Authentication:** `@simplewebauthn/browser`, `@simplewebauthn/server`
*   **Database:** Cloudflare KV Store

## Project Structure

*   `/client`: Contains the React frontend application.
*   `/server-worker`: Contains the Hono backend application for Cloudflare Workers.

## Setup and Installation

### Prerequisites

*   Node.js and npm (or yarn)
*   Cloudflare account and `wrangler` CLI installed (`npm install -g wrangler`)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone git@github.com:FabioDiCeglie/Passkey.git
    ```

2.  **Install Client Dependencies:**
    ```bash
    cd client
    pnpm install
    ```

3.  **Install Server Dependencies:**
    ```bash
    cd server-worker
    pnpm install
    ```

### Configuration

1.  **Cloudflare KV Namespace:**
    *   Create a KV namespace in your Cloudflare dashboard.
    *   Add the namespace binding to your `server-worker/wrangler.jsonc` file:
        ```json
        {
          "kv_namespaces": [
            {
              "binding": "users",
              "id": "YOUR_KV_NAMESPACE_ID"
            }
          ]
        }
        ```
    *   Replace `YOUR_KV_NAMESPACE_ID` with your actual KV namespace ID. You can find this ID in your Cloudflare dashboard after creating the namespace.

2.  **Session Secret (`SESSION_ENCRYPTION_KEY`):**
    *   This Worker uses an encrypted session cookie. You need to provide a secret encryption key. **Do not commit this key directly to `wrangler.jsonc`.
        ```
    *   **Local Development:** Create a file named `.dev.vars` in the `server-worker/` directory (add this file to your `.gitignore`!) and define the secret there:
        ```ini
        # server-worker/.dev.vars
        SESSION_ENCRYPTION_KEY="your-secure-random-32-byte-hex-string" # <-- CHANGE THIS! e.g., generate with `openssl rand -hex 32`
        ```
        Replace `"your-secure-random-32-byte-hex-string"` with a secure, randomly generated 32-byte hex string. This file is used automatically when you run `wrangler dev`.
    *   **Deployment:** Before deploying, you must set this secret in your Cloudflare environment using the following method:
        *   **Wrangler CLI:** Run the following command in your terminal within the `server-worker` directory, replacing `<your-secret-key>` with your actual key:
            ```bash
            npx wrangler secret put SESSION_ENCRYPTION_KEY
            # It will prompt you to enter the secret value securely.
            ```
            Refer to the [Cloudflare Secrets documentation](https://developers.cloudflare.com/workers/configuration/secrets/) for more details.

3.  **Client API Endpoint:**
    *   The client application needs to know the URL of your backend worker.
    *   Navigate to the `client` directory.
    *   Copy the example environment file:
        ```bash
        cp .env.example .env
        ```
    *   Edit the `.env` file and set the `VITE_API_URL` variable to the URL where your server worker is running.
        *   For local development using `wrangler dev`, this is typically `http://localhost:8787`.
        *   For a deployed worker, use its Cloudflare URL (e.g., `https://your-worker-name.your-subdomain.workers.dev`).

### Running the Project

1.  **Run the Server Worker (Development):**
    *   Navigate to the server directory: `cd server-worker`
    *   Start the development server: `pnpm run dev`
    *   Note the local URL wrangler provides (e.g., `http://localhost:8787`).

2.  **Run the Client (Development):**
    *   Navigate to the client directory: `cd client`
    *   Ensure the API endpoint in `client/lib/api.ts` (or wherever your API calls are defined) points to the worker's URL (e.g., `http://localhost:8787`). You might need to adjust this based on your setup.
    *   Start the development server: `pnpm run dev`
    *   Open your browser to the URL provided by Vite (e.g., `http://localhost:5173`).

## Passkey Authentication Flow

### Registration

This diagram shows the successful sequence of events when a new user registers with a Passkey.

```mermaid
sequenceDiagram
    participant User
    participant Client (Browser)
    participant Server (Worker)
    participant Authenticator (OS/Hardware)

    User->>Client (Browser): Enters username, clicks Register
    Client (Browser)->>Server (Worker): POST /register (username)
    Server (Worker)->>Server (Worker): Check if user exists in KV (Assume user does not exist)
    Server (Worker)->>Server (Worker): Generate Registration Options (incl. challenge) using @simplewebauthn/server
    Server (Worker)->>Server (Worker): Store challenge & user template in Session
    Server (Worker)-->>Client (Browser): Send Registration Options
    Client (Browser)->>Authenticator (OS/Hardware): Call navigator.credentials.create() via startRegistration(options)
    Authenticator (OS/Hardware)->>User: Prompt for Passkey creation (Biometrics, PIN, etc.)
    User->>Authenticator (OS/Hardware): Approves creation
    Authenticator (OS/Hardware)-->>Client (Browser): Returns new Credential (publicKeyCredential)
    Client (Browser)->>Server (Worker): POST /register/complete (credential)
    Server (Worker)->>Server (Worker): Retrieve challenge & user template from Session
    Server (Worker)->>Server (Worker): Verify Credential using @simplewebauthn/server (verifyRegistrationResponse)
    Server (Worker)->>Server (Worker): Store new User + Passkey data in KV Store
    Server (Worker)->>Server (Worker): Set currentUser in Session (Log in)
    Server (Worker)-->>Client (Browser): { verified: true }
    Client (Browser)->>User: Navigate to Home Page (Logged In)
```

### Login

This diagram shows the successful sequence of events when an existing user logs in with their Passkey.

```mermaid
sequenceDiagram
    participant User
    participant Client (Browser)
    participant Server (Worker)
    participant Authenticator (OS/Hardware)

    User->>Client (Browser): Enters username, clicks Login
    Client (Browser)->>Server (Worker): POST /login (username)
    Server (Worker)->>Server (Worker): Fetch User (+ Passkey IDs) from KV Store (Assume user found)
    Server (Worker)->>Server (Worker): Generate Authentication Options (incl. challenge) using @simplewebauthn/server
    Server (Worker)->>Server (Worker): Store challenge & user data in Session
    Server (Worker)-->>Client (Browser): Send Authentication Options
    Client (Browser)->>Authenticator (OS/Hardware): Call navigator.credentials.get() via startAuthentication(options)
    Authenticator (OS/Hardware)->>User: Prompt for Passkey usage (Biometrics, PIN, etc.)
    User->>Authenticator (OS/Hardware): Approves usage
    Authenticator (OS/Hardware)-->>Client (Browser): Returns Credential Assertion (signed challenge)
    Client (Browser)->>Server (Worker): POST /login/complete (assertion)
    Server (Worker)->>Server (Worker): Retrieve challenge & user data from Session
    Server (Worker)->>Server (Worker): Find the specific Passkey used from User data in KV
    Server (Worker)->>Server (Worker): Verify Assertion using @simplewebauthn/server (verifyAuthenticationResponse)
    Server (Worker)->>Server (Worker): Update Passkey counter in KV Store
    Server (Worker)->>Server (Worker): Set currentUser in Session (Log in)
    Server (Worker)-->>Client (Browser): { verified: true }
    Client (Browser)->>User: Navigate to Home Page (Logged In)
```

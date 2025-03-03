# Google OAuth Authentication with Express & JWT (No Database)

This is a **Node.js Express** application that allows users to **sign in with Google** using **OAuth 2.0**. The authentication is handled with **Passport.js**, and user sessions are maintained using **JWT (JSON Web Token)** stored in HTTP-only cookies. This approach ensures that the user stays logged in even after a server restart, without requiring a database.

## Features
- **Google OAuth Authentication** (via Passport.js)
- **JWT-based authentication** (no database required)
- **Session persistence via HTTP-only cookies** (even after server restart)
- **Profile page for authenticated users**
- **Logout functionality**
- **Public and private routes**

## Installation
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/suman-malik-repo/sign-in-with-google.git
cd google-oauth-express
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Set Up Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new OAuth 2.0 credential
3. Set the **Redirect URI** to:
   ```
   http://localhost:3000/auth/google/callback
   ```
4. Copy the **Client ID** and **Client Secret**

### 4️⃣ Create a `.env` File
Create a `.env` file in the root directory and add:
```env
PORT=3000
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
JWT_SECRET=mysecurejwtsecret
COOKIE_SECRET=mycookiekey
```

## Running the Project
Start the server:
```sh
node server.js
```

Visit **http://localhost:3000/** in your browser.

## Project Structure
```
/google-oauth-express
├── public/             # Static files (CSS, JS, images, etc.)
├── views/              # EJS templates
│   ├── index.ejs       # Homepage
│   ├── profile.ejs     # Profile page
├── .env                # Environment variables
├── server.js           # Main server file
├── package.json        # Project metadata & dependencies
└── README.md           # Project documentation
```

## API Routes
| Route                | Method | Description |
|----------------------|--------|-------------|
| `/`                  | GET    | Home page |
| `/profile`           | GET    | Protected profile page (requires authentication) |
| `/auth/google`       | GET    | Redirects to Google OAuth login |
| `/auth/google/callback` | GET | Handles Google OAuth callback & sets JWT cookie |
| `/logout`            | GET    | Logs out user & clears authentication cookie |
| `/public`            | GET    | Public route accessible by anyone |

## Authentication Flow
1. User clicks "Sign in with Google"
2. Redirects to Google OAuth for authentication
3. On success, Google sends user data back to the server
4. Server generates a **JWT token** and stores it in an **HTTP-only signed cookie**
5. User remains logged in even after a server restart (until the cookie expires)
6. On logout, the server clears the authentication cookie

## Security Considerations
- **HTTP-only cookies** prevent client-side JavaScript access
- **Signed cookies** ensure integrity
- **JWT expiration** prevents long-term token misuse
- **Use `secure: true` in production** to enforce HTTPS-only cookies

## License
This project is open-source and available under the [MIT License](LICENSE).


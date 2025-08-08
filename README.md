# Firebase App Hosting Distribution

This folder contains all files needed for Firebase App Hosting deployment.

## Files included:
- Built client files (dist/public/) - served as static files
- Built server files (dist/) - run as Firebase Functions
- Configuration files (package.json, firebase.json, etc.)
- Shared schema files

## Deployment Steps:

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

## Project Structure:
- `dist/public/` - Static client files (HTML, CSS, JS)
- `dist/index-prod.js` - Server application
- `firebase.json` - Firebase configuration
- `index.js` - Firebase Functions entry point
- `package.json` - Dependencies for server

## Configuration:
- Firebase project: kicked-in-the-disc
- Hosting serves static files from dist/public/
- All API requests are routed to the Express server function

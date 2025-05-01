# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# Contact List App

A professional mobile application for managing contacts, built with React Native and Expo.

## Features

- **Contact Management**: Add, view, edit, and delete contacts
- **Data Validation**: Validation for phone numbers and email formats
- **Local Storage**: Persistent storage using AsyncStorage
- **Search Functionality**: Search contacts by name, phone, or email
- **Sorting**: Sort contacts alphabetically by name
- **Favorites**: Mark contacts as favorites for quick access
- **Responsive Design**: Works on both iOS and Android devices

## Tech Stack

- **React Native**: Core framework for building the mobile application
- **Expo**: Development platform for React Native
- **React Navigation**: Navigation between screens
- **React Native Paper**: UI components for a clean and modern interface
- **React Hook Form**: Form handling with validation
- **AsyncStorage**: Local data persistence
- **Yup**: Schema validation
- **TypeScript**: Type safety and better developer experience

## Installation

1. Clone the repository:

```
git clone https://github.com/yourusername/contact-list-app.git
cd contact-list-app
```

2. Install dependencies:

```
yarn install
```

3. Start the development server:

```
yarn start
```

4. Use the Expo Go app on your device to scan the QR code or open the app in an emulator.

## Project Structure

```
/
├── app/                   # Main application screens
│   ├── _layout.tsx        # Root layout with navigation setup
│   ├── index.tsx          # Home screen with contact list
│   └── contact/           # Contact-related screens
│       ├── new.tsx        # Add new contact screen
│       └── [id].tsx       # Contact details/edit screen
├── components/            # Reusable components
│   └── ContactListItem.tsx # Individual contact list item
├── context/               # Application state management
│   └── ContactContext.tsx # Context for contact operations
├── utils/                 # Utility functions
│   └── validation.ts      # Form validation logic
└── assets/                # Static assets
```

## Usage

1. **View Contacts**: All contacts are displayed on the home screen
2. **Add Contact**: Tap the + button to add a new contact
3. **View/Edit Contact**: Tap on a contact to view details and edit
4. **Delete Contact**: Swipe left on a contact to delete
5. **Mark as Favorite**: Tap the star icon to mark a contact as favorite
6. **Search**: Use the search bar to find contacts
7. **Filter**: Toggle between showing all contacts or favorites only

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
# Zeller React Native Code Challenge

## 1. Objective
Build a **React Native application** that displays, filters, and manages a list of users.
The app should integrate with the provided **GraphQL API** and persist data in a **local database** for offline usage.

We will evaluate your submission based on:
- **Code structure and maintainability**
- **TypeScript usage**
- **Testing approach and coverage**

---

## 2. Requirements

### **Data Integration**
- Fetch user data using the `listZellerCustomers` GraphQL query.
	*(Schema and connection details are provided in `aws-exports.js` and `schema.gql`.)*
- Store the fetched data in a local database such as **SQLite**, **WatermelonDB**, **Realm**, or similar.
- Display the list of users from the **local database**, not directly from the network.

### **User Management**
- Add new users and save them to the local database. *(No API mutation is required.)*
- Update and delete users from the local database.
- **Add validation to the form**:
	- Name should not be empty.
	- Name cannot contain special characters (only alphabets and spaces allowed).
	- Name must not exceed **50 characters**.
	- Email (if included) must be in valid format.

### **Filtering & Searching**
- Filter users by **user type** (`Admin`, `Manager`).
- Implement a text search to filter users by **name**.

### **UI & Interaction**
- Implement **pull-to-refresh** on the user list.
- Use **Pager View** (or equivalent) so that the user can swipe between **Admin** and **Manager** lists.
- Add **smooth animation for tab changes** (All ↔ Admin ↔ Manager) when swiping between views.
- A reference file `tab-animation.mp4` is included in the repository.
- Ensure the app runs on **iOS** and **Android**.

### **Code Quality & Testing**
- Write **unit and/or integration tests** for critical parts of the application.
- Follow **clean, readable, and consistent** coding practices.

---

## 3. Design References

**List Screen**

![Zeller Customers List](zeller-customers-design.png)

**Create User Form**

![Add User Screen](zeller-add-user.png)

**📹 Tab Animation**

![Tab Animation](tab-animation.gif)

---

## 4. Notes
- You may use any state management solution (e.g., Redux, Zustand, Jotai, or Context API).
- Keep the codebase modular and well-documented so it’s easy to review.
- Aim for a production-quality implementation, even though this is a challenge.
- Feel free to enhance the **user experience** with **smooth interactions** or **transitions** where appropriate.
- 💡 Consider using `react-native-pager-view` with animations to implement the Admin ↔ Manager swipe.

---

## 5. Submission Guidelines

1. Ensure your project includes:
	 - A clear **README** with setup and run instructions.
	 - Any necessary environment, keystore files or example configs (e.g., `.env.example`, `debug.keystore`).
	 - **Tests** and instructions on how to run them.
2. Make sure your code runs without errors on a clean install using:
	 ```bash
	 yarn install
	 yarn ios   # or yarn android
	 ```
3. Once complete, **share the repository link** (or a zipped copy of your repo) with us.
4. Do **not** include any dependencies or files that are not required for this project.

---

## Project Setup & Running
This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

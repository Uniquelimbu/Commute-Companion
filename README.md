# Commute Companion

## Overview

**Commute Companion** is an innovative app built for transit users to enhance their commuting experience by providing real-time bus information, interactive features, and a discussion panel for each bus stop. The app features functionalities such as rating bus stops, adding feedback, and viewing relevant comments from other users. It also includes a map with interactive bus stop markers, providing commuters with vital information on bus accessibility, shelter availability, and more.

This project was developed as part of **BramHack** with the goal of improving the overall transit experience.

## Features

- **Interactive Map**: Displays bus stops on a Mapbox map with clustering functionality for better visibility of nearby stops.
- **Bus Stop Details**: Displays essential information about each bus stop, including accessibility features, shelter availability, and user ratings.
- **Rating System**: Users can rate bus stops based on their experiences, including their accessibility and shelter.
- **Feedback and Comments**: Allows users to submit and view feedback for each bus stop. Comments can be posted and reviewed.

## Technologies Used

- **React.js**: Frontend framework for building the UI.
- **Mapbox GL JS**: Library for displaying interactive maps.
- **Firebase**: Backend service for real-time data storage, user authentication, and handling feedback/comments.
- **GTFS**: Used to fetch and parse bus stop data for transit routes.
- **Firebase Firestore**: Database used to store comments and feedback for each bus stop.

## Screenshots

### Display of BusStips in Clusters
![image](https://github.com/user-attachments/assets/461de376-6afd-40bb-acc7-edb3978fdc9f)

### Display of Interactive Bus Stops on the Map
![image](https://github.com/user-attachments/assets/cef78999-d1d7-483e-a10a-547ba4db5ede)

### Display fo Review System
![image](https://github.com/user-attachments/assets/9cb261dd-a7b4-47f6-8d66-b28631337ff7)


## Installation and Setup

To run the **Commute Companion** app locally, follow these steps:

### Prerequisites

- **Node.js** (v14 or later)
- **npm** (comes with Node.js)

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Uniquelimbu/commute-companion.git
   cd commute-companion

2. **Install Dependencies**

Install all the necessary dependencies with npm:

npm install

npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome

3. Set up Firebase
To use Firebase for user authentication and storing comments/feedback, follow these steps:

Go to Firebase Console.
Create a new project or use an existing one.
Set up Firebase Authentication and Firestore for your project.
Download the Firebase configuration file and add it to src/firebaseConfig.js (refer to your Firebase setup guide for this step).

4. Add Mapbox Access Token
Go to Mapbox and sign up for an API key (access token).

Add your Mapbox access token to a .env file in the root directory of your project:

env
Copy code
REACT_APP_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token

5. Start the Development Server
Now that everything is set up, start the React development server:

npm start
The app should now be running at http://localhost:3000.

## Functionality Walkthrough

1. **Interactive Map**
   - The map component uses **Mapbox GL JS** to show bus stops and clusters them for better performance. When a user clicks on a bus stop marker, the app shows detailed information about that stop, including accessibility features and real-time rating data.

2. **Rating and Feedback System**
   - Users can submit a rating (from 1 to 5 stars) for each bus stop. They can also write feedback about their experience with the stop, including features like wheelchair accessibility and shelter availability. This system allows the community to share their experiences and help others make better decisions about their commute.

3. **User Login**
   - **Google Authentication** is integrated into the app to allow users to log in using their Google accounts. This feature helps store and manage user-specific data like their feedback and ratings for bus stops.

## Contributions
If you'd like to contribute to this project, please fork the repository, create a new branch, and submit a pull request.

To contribute:
Fork the repository
Create a feature branch: git checkout -b feature-name
Commit your changes: git commit -am 'Add new feature'
Push to the branch: git push origin feature-name
Create a new Pull Request

## License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

## Acknowledgments

- **Mapbox** for their interactive map services and reliable geolocation APIs.
- **Firebase** for providing seamless authentication and real-time database services to store and retrieve user data.
- **Brampton Transit** for providing real-time data on bus positions, which forms a key part of the app.
- **Hackathon Team** for their collaborative efforts during the project development.

## Future Plans

- **Add more transit data**: Incorporate more cities and transit agencies to expand the app's coverage.
- **Discussion Panel**: Automatically open a discussion panel for each bus stop where users can view and add comments. This will help increase user engagement.
- **Enhance User Interaction**: Introduce features like saving favorite bus stops, tracking historical data, and providing more personalized notifications.
- **Mobile App Version**: Consider building a mobile version using **React Native** for iOS/Android users to make the app accessible on mobile devices, providing users with a more native experience.
- **Push Notifications**: Add push notifications for real-time bus tracking and updates.
- **User Profile**: Allow users to create profiles and track their ratings and comments across various bus stops.




Commute Companion
Overview
Commute Companion is an innovative app built for transit users to enhance their commuting experience by providing real-time bus information, interactive features, and a discussion panel for each bus stop. The app features functionalities such as rating bus stops, adding feedback, and viewing relevant comments from other users. It also includes a map with interactive bus stop markers, providing commuters with vital information on bus accessibility, shelter availability, and more.

This project was developed as part of BramHack with the goal of improving the overall transit experience.

Features
Interactive Map: Displays bus stops on a Mapbox map with clustering functionality for better visibility of nearby stops.
Bus Stop Details: Displays essential information about each bus stop, including accessibility features, shelter availability, and user ratings.
Rating System: Users can rate bus stops based on their experiences, including their accessibility and shelter.
Feedback and Comments: Allows users to submit and view feedback for each bus stop. Comments can be posted and reviewed.
Discussion Panel: Automatically opens a discussion panel for each bus stop where users can view and add comments.
Real-Time Data: Fetches and displays real-time bus positions (vehicle data) for the Brampton Transit system.

Technologies Used
React.js: Frontend framework for building the UI.
Mapbox GL JS: Library for displaying interactive maps.
Firebase: Backend service for real-time data storage, user authentication, and handling feedback/comments.
GTFS: Used to fetch and parse bus stop data for transit routes.
Firebase Firestore: Database used to store comments and feedback for each bus stop.

Screenshots


Example:


Description: Display of interactive bus stops on the map.

Installation and Setup
To run the Commute Companion app locally, follow these steps:

Prerequisites
Node.js (v14 or later)
npm (comes with Node.js)
1. Clone the Repository
bash
Copy code
git clone https://github.com/yourusername/commute-companion.git
cd commute-companion
2. Install Dependencies
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

Functionality Walkthrough
1. Interactive Map
The map component uses Mapbox GL JS to show bus stops and clusters them for better performance. When a user clicks on a bus stop marker, the app shows detailed information about that stop, including accessibility features and real-time rating data.

2. Rating and Feedback System
Users can submit a rating (from 1 to 5 stars) for each bus stop. They can also write feedback about their experience with the stop, including features like wheelchair accessibility and shelter availability.

3. Discussion Panel
For each bus stop, a discussion panel automatically opens on the left side of the screen. Users can view comments left by others and add their own comments about that bus stop.

Contributions
If you'd like to contribute to this project, please fork the repository, create a new branch, and submit a pull request.

To contribute:
Fork the repository
Create a feature branch: git checkout -b feature-name
Commit your changes: git commit -am 'Add new feature'
Push to the branch: git push origin feature-name
Create a new Pull Request

License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgments
Mapbox for their interactive map services.
Firebase for providing authentication and database services.
Brampton Transit for providing real-time data on bus positions.
Hackathon Team for collaborative efforts during the project development.

Future Plans
Add more transit data: Incorporate more cities and transit agencies.
Enhance User Interaction: Introduce features like saving favorite bus stops, tracking historical data, and more.
Mobile App Version: Consider building a mobile version using React Native for iOS/Android users.# Commute-Companion
 




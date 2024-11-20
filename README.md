# Shimmering Connections

Shimmering Connections is a modern dating app designed to create meaningful connections and foster relationships. With a sleek user interface and powerful features, Shimmering Connections offers users a safe, interactive, and engaging way to meet new people.

## Table of Contents
- [Features](#features)
- [Screenshots](#screenshots)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)

## Features
- **User Profiles**: Users can create detailed profiles with images, bios, and interests to showcase their personality.
- **Matching Algorithm**: Advanced matching system to pair users based on their preferences and shared interests.
- **Chat and Messaging**: Real-time messaging powered by Socket.IO for seamless communication.
- **Likes and Boosts**: Users can see who liked them and boost their visibility.
- **Image Carousel**: An interactive slider for viewing profile pictures.
- **Filters and Preferences**: Users can filter matches based on criteria like distance, age, and common interests.
- **Safe and Secure**: Data security and user safety are a top priority.

## Screenshots
> *Include screenshots here if possible, showing different parts of the app, such as user profile, chat room, and matching screen.*

## Technologies Used
### Frontend
- **React Native**: Framework for building native mobile apps using React.
- **Expo**: For easier development and testing.
- **React Navigation**: To navigate between screens.
- **Socket.IO Client**: For real-time chat functionality.
- **Axios**: For API requests and data fetching.

### Backend
- **Node.js**: JavaScript runtime for building the server.
- **Express.js**: Web framework for building API endpoints.
- **Socket.IO**: For real-time, bidirectional communication between client and server.
- **MongoDB**: Database for storing user information and chat messages.
- **Mongoose**: For MongoDB object modeling.

### Other Libraries
- **JWT**: For secure user authentication and token management.
- **Lottie**: For animations and improved user experience.
- **Async Storage**: To manage local storage in React Native.

## Installation
### Prerequisites
- Node.js
- MongoDB
- Expo CLI

### Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/shimmering-connections.git
   cd shimmering-connections

2. **Install dependencies for both client and server**
   ```
   cd client
   npm install
   cd ../server
   npm install
2. **Install dependencies for both client and server**
   ```
   cd client
   npm install
   cd server
   npm install
3. **Set up environment variables Create a .env file in the server directory and add your MongoDB connection string and any other necessary configurations.**
   ```
   DB_URL=YOUR_LINK
   PORT=8000
4. **Start the server**
   ```
   cd server
   npm start
5. **Run the app**
   ```
   cd client
   npm start
### Usage
- Sign up or log in to access the app.
- Create a profile by adding your details and uploading profile pictures.
- Browse through potential matches, like or pass, and see who has liked you.
- Chat in real-time with your matches using the chat feature.
- Boost your profile visibility to get more attention.


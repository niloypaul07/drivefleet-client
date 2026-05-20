# DriveFleet Car Rental Platform

Welcome to the DriveFleet Car Rental Platform! This is a modern, full-stack single-page application built with Next.js, HeroUI, Tailwind CSS, Node.js, Express, and MongoDB.

## Live Website
https://drivefleet-client-theta.vercel.app/

## Key Features
- **Premium User Interface**: Built with HeroUI and Tailwind CSS v4, offering a rich, responsive, and dynamic dark-mode aesthetic with smooth glassmorphism effects.
- **Secure Authentication**: Implemented custom Better Auth with JWT HTTPOnly cookies for robust security, including Google Login and rigorous password validation.
- **Seamless Booking System**: Users can explore cars, filter by type, search by name, and easily book vehicles with instant database updates.
- **Comprehensive Dashboard**: Logged-in users have full CRUD capabilities to add, edit, and manage their own fleet of rental cars seamlessly.
- **Robust State & API Management**: Completely isolated frontend and backend repositories with clean Next.js App Router navigation and Express.js RESTful APIs.

## Tech Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS, HeroUI, Axios, React Hot Toast
- **Backend**: Node.js, Express.js, MongoDB, Better Auth (JWT Cookies)
- **Deployment**: Ready for Vercel (Client) and Render/Heroku (Server)

## Getting Started

### Client
1. `cd drivefleet-client`
2. `npm install`
3. `npm run dev`

### Server
1. `cd drivefleet-server`
2. `npm install`
3. Set your `.env` file with `MONGODB_URI` and `PORT`.
4. `npm run start` or `npx nodemon index.js`

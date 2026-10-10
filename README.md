# ✨Fun Shark Facts✨

A React Native / Expo app that lets users explore different shark species, learn interesting facts, and add shark facts of their own.

**[View the live demo](https://fun-shark-facts.vercel.app/)**


## Features

- Browse different shark species
- View 3 categories of facts: Basic, Interesting, and Insane 
- User registration and login
- Supabase authentication
- Bookmark favorite sharks
- Add custom sharks

## Technologies

- React Native
- Expo
- TypeScript
- Supabase

## Authentication

User authentication is handled through Supabase, including user registration, login, storage, and account management.

## How to Run Locally

### Prerequisites

- [Node.js](https://nodejs.org/)
- npm
- A [Supabase](https://supabase.com/) project

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ryan-rustemeyer/Fun-Shark-Facts.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Fun-Shark-Facts
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the project root and configure your Supabase credentials:

   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key
   ```

   Replace the placeholders with the appropriate credentials from your own Supabase project. Never commit your `.env` file or expose secret service-role keys.

5. Start the development server:

   ```bash
   npx expo start
   ```

6. To run the web version, press `w` in the Expo terminal, or run:

   ```bash
   npx expo start --web
   ```

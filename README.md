# SertPrep - SAT Practice Test Application

A complete SAT practice test application built with HTML, CSS, and JavaScript with Supabase integration for authentication and question storage.

## Features

- User registration and login with Supabase authentication
- 60-question SAT practice test (30 Math, 30 English) with timer (50 minutes)
- Progress tracking
- Question navigation
- Results calculation with score review
- Draggable scientific calculator that can be moved and minimized
- Responsive design for all devices
- Questions stored in Supabase database (1200 Math, 1200 English)

## Setup Instructions

1. **Create a Supabase Account:**
   - Go to [supabase.com](https://supabase.com/) and create a free account
   - Create a new project

2. **Configure Database:**
   - In your Supabase project, go to SQL Editor
   - Run the SQL commands from `supabase/init_supabase.sql` to create tables
   - This creates two tables: `sat_math_questions` and `sat_english_questions`

3. **Configure Authentication:**
   - In your Supabase project, go to Authentication > Settings
   - Enable Email signup confirmation (optional for testing)
   - Note your Project URL and anon key from Project Settings > API

4. **Update Configuration:**
   - Open `script.js` in a text editor
   - Replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY` with your actual Supabase credentials

5. **Populate Database with Questions:**
   - For a full implementation with 1200 questions of each type, you would need to:
   - Use the Supabase SQL editor to insert questions manually, or
   - Create a Node.js script using the Supabase JS library to seed the database
   - See `supabase/seed_data.js` for reference on how to structure the data

6. **Run the Application:**
   - Open `index.html` in your web browser
   - Register a new account or login with existing credentials
   - Start practicing with the SAT test

## How to Use

1. **Registration/Login:**
   - Create an account or login with existing credentials

2. **Taking the Test:**
   - Click "Start SAT Practice Test" on the dashboard
   - Answer questions by clicking on the options
   - Navigate between questions using Previous/Next buttons
   - Use the calculator by clicking the Calculator button
   - Submit test when finished or when timer runs out

3. **Viewing Results:**
   - After submitting, view your score and review answers
   - See which questions you got right/wrong

4. **Using the Calculator:**
   - The calculator appears as a draggable card when you click the Calculator button
   - Move it by dragging the header
   - Minimize it with the minus button
   - Close it with the X button

## File Structure

- `index.html` - Main HTML structure
- `styles.css` - Styling and layout
- `script.js` - Application logic and Supabase integration
- `supabase/` - Database schemas and seeding scripts
  - `init_supabase.sql` - SQL commands to create tables
  - `seed_data.js` - Reference script for populating database
- `README.md` - This file

## Customization

To add more questions or modify existing ones:
1. Use the Supabase SQL editor to insert new questions into the appropriate tables
2. Each question should have:
   - `question`: The question text
   - `options`: Array of answer choices (4 options)
   - `correct_answer`: Index of the correct answer (0-3)
   - `difficulty`: easy, medium, or hard
   - `topic`: Subject area

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge).

## Troubleshooting

- If authentication isn't working, check your Supabase credentials
- Ensure you're using a modern browser
- Check the browser console for any error messages
- Make sure the database tables are created and populated

## License

This project is open source and available under the MIT License.
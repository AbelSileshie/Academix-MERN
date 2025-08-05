### Detailed Backend Implementation Plan for Academix

This plan provides a comprehensive, step-by-step guide for the backend development of Academix, focusing on a MERN stack with a strong emphasis on security, performance, and modularity. The plan is designed to be followed sequentially, with each sprint building upon the previous one.

---

### Sprint 1: Project Setup & Authentication

**Objective:** Establish the project's foundation, including the server, database connection, and a robust authentication system using JWT and Google OAuth.

#### **Backend Checklist**

1.  **Project & Server Setup:**

    - [ ] Initialize the Node.js project: `npm init -y`.
    - [ ] Install core dependencies: `express`, `mongoose`, `dotenv`, `cors`, `helmet`, `morgan`.
    - [ ] Set up the basic server file (`server.js` or `index.js`).
    - [ ] Configure a MongoDB connection using Mongoose.
    - [ ] Implement a modular file structure: `routes/`, `controllers/`, `models/`, `middleware/`, `config/`.
    - [ ] Configure `dotenv` to manage environment variables (`MONGO_URI`, `JWT_SECRET`, etc.).

2.  **User Model (`models/User.js`):**

    - [ ] Define the **Mongoose schema for the `User`**. This single schema will handle all user types (students, admins) using a `role` field.
    - [ ] Include fields for local authentication: `firstName`, `lastName`, `email` (unique), `password` (hashed).
    - [ ] Add fields for **Google OAuth**: `googleId` (unique), `photo`.
    - [ ] Include a `role` field with an enum `['student', 'admin']` and a default value of `'student'`.
    - [ ] Implement a pre-save Mongoose middleware hook to **hash the password** using `bcrypt` before saving.
    - [ ] Create a schema method `matchPassword` to compare the provided password with the hashed password.

3.  **Local JWT Authentication:**

    - [ ] Install dependencies: `passport`, `passport-jwt`, `passport-local`, `jsonwebtoken`, `bcryptjs`.
    - [ ] Create a Passport configuration file (`config/passport.js`).
    - [ ] Define the JWT strategy to extract the token from the `Authorization` header (`Bearer`).
    - [ ] Implement a **JWT payload strategy** to find the user by ID and attach it to `req.user`.
    - [ ] Create routes in `routes/auth.js` for `/auth/register` and `/auth/login`.
    - [ ] Implement controllers in `controllers/authController.js` for user registration (hashing the password) and login (matching the password and generating a JWT).

4.  **Google OAuth 2.0:**
    - [ ] Install `passport-google-oauth20`.
    - [ ] Configure the Google Strategy in your Passport file, using `clientID` and `clientSecret` from environment variables.
    - [ ] Define the Google authentication flow:
      - `GET /auth/google`: Initiates the Google OAuth process.
      - `GET /auth/google/callback`: The callback URL that handles the response from Google.
    - [ ] In the Google Strategy callback, check if the user exists in your database using their `googleId`. If not, create a new user document.
    - [ ] Upon successful authentication, **generate a JWT** and send it back to the client.

---

### Sprint 2: Academic Features & Data Modeling

**Objective:** Build the core backend logic for courses, departments, and class management.

#### **Backend Checklist**

1.  **Models & Schemas:**

    - [ ] Create the **`Department` schema** (`models/Department.js`) with `name` and `overview`.
    - [ ] Create the **`Course` schema** (`models/Course.js`) with `name`, `department` (referencing `Department`), `year`, `semester`, `creditHours`, and `overview`.
    - [ ] Create the **`Class` schema** (`models/Class.js`) with `sectionName`, `students` (array of `User` references), and `representative` (referencing a `User`).

2.  **API Routes & Controllers:**

    - [ ] Create a protected route for an **admin to manage departments** (`/api/departments`).
    - [ ] Implement CRUD operations for departments: `POST`, `GET`, `PUT`, `DELETE`.
    - [ ] Create a route for **public access to the course catalog** (`/api/courses`).
    - [ ] Implement a **protected route** for an admin to manage courses (`/api/courses`).
    - [ ] Implement a **protected route for students to enroll in a course** (`POST /api/courses/:id/enroll`), adding their user ID to the `students` array in the `Class` schema.

3.  **Middleware for Role-Based Access Control (RBAC):**
    - [ ] Create a middleware function (`middleware/auth.js`) that checks if the authenticated user has a specific role (e.g., `'admin'`).
    - [ ] Apply this middleware to all admin-specific routes to ensure only authorized users can access them.

---

### Sprint 3: Community & Content Security

**Objective:** Build the post and comment system, including a Gemini-powered content analyzer and an optimized fetching strategy.

#### **Backend Checklist**

1.  **Gemini Content Analyzer Integration:**

    - [ ] Install the Google Generative AI SDK: `npm install @google/genai`.
    - [ ] Set up your Gemini API key in the `.env` file.
    - [ ] Create a reusable function (`utils/geminiAnalyzer.js`) that takes a text input and sends it to the Gemini API with a prompt to check for inappropriate, unsafe, or non-academic content.
    - [ ] The function should return a boolean (`isSafe`) and a report if the content is flagged.

2.  **Post & Comment Models:**

    - [ ] Create the **`Post` schema** (`models/Post.js`) with `author` (User reference), `content`, and a reference to `course`.
    - [ ] **Do not embed comments and likes directly.** Instead, create separate schemas:
      - **`Comment` schema:** `author` (User reference), `post` (Post reference), `content`.
      - **`Like` schema:** `user` (User reference), `post` (Post reference).
    - This approach, known as **document referencing**, is better for scalable social features as it avoids a "growing document" problem and allows for more efficient fetching and management of large numbers of comments and likes.

3.  **API Routes & Controllers:**

    - [ ] Create a `POST /api/posts` route. In the controller, **use the Gemini analyzer middleware** to check the post content before saving it to the database. If the content is flagged, send an error response.
    - [ ] Implement a `GET /api/posts` route that returns all posts.
    - [ ] Implement `GET /api/posts/:id` to fetch a single post.
    - [ ] Implement a `POST /api/posts/:id/comment` route to create a new comment.
    - [ ] Implement a `POST /api/posts/:id/like` route to create a new like. The controller should check if the user has already liked the post to prevent duplicates.
    - [ ] Implement a `DELETE /api/posts/:id/like` route to remove a like.

4.  **Optimized Post Fetching:**
    - [ ] Instead of fetching all comments and likes in the post object, use a more efficient approach.
    - [ ] The `GET /api/posts/:id` route should return the post data and a separate field for the **count of comments and likes**.
    - [ ] Implement separate, paginated API routes for fetching comments and likes:
      - `GET /api/posts/:id/comments?page=1&limit=10`
      - `GET /api/posts/:id/likes?page=1&limit=10`
    - This prevents a single API call from fetching a massive amount of data, keeping the response fast and manageable.

---

### Sprint 4: Dashboard, Extracurriculars & File Upload

**Objective:** Create personalized data fetching for the student dashboard and implement file upload functionality for course materials.

#### **Backend Checklist**

1.  **Models & Schemas:**

    - [ ] Create the **`Club` schema** (`models/Club.js`) with `name`, `founder`, and `members`.
    - [ ] Create the **`Event` schema** (`models/Event.js`) with `building`, `club`, `startTime`, and `description`.

2.  **API Routes:**

    - [ ] Implement a **protected `/api/dashboard` route** that fetches all information relevant to the logged-in student, including their enrolled courses, recent posts, and club memberships. This endpoint should be a single, optimized query to minimize database load.
    - [ ] Implement public API routes for fetching clubs and events (`/api/clubs`, `/api/events`).
    - [ ] Implement protected routes for managing clubs (e.g., joining/leaving a club).

3.  **File Uploads:**
    - [ ] Install `multer`, a middleware for handling `multipart/form-data`.
    - [ ] Configure `multer` to handle file uploads, specifying the destination folder for storing files on the server.
    - [ ] Create a protected `POST /api/materials/upload` route that uses `multer` to save the file.
    - [ ] The controller should save a reference to the file (e.g., its path or URL) in the relevant document (e.g., a `Post` or `Course` document).

---

### Sprint 5: Admin Features & Bug Squashing

**Objective:** Implement all admin-specific backend logic and perform a final round of testing and bug fixes.

#### **Backend Checklist**

1.  **Admin API Routes:**

    - [ ] Create a dedicated router for admin routes (`routes/admin.js`).
    - [ ] Implement `GET /admin/users` to view all users.
    - [ ] Implement `PUT /admin/users/:id/role` to change a user's role.
    - [ ] Implement `DELETE /admin/posts/:id` for content moderation.
    - [ ] Create `PUT` and `DELETE` routes for admin management of courses and departments.

2.  **Testing & Bug Fixing:**
    - [ ] Use an API testing tool like Postman to manually test every single endpoint.
    - [ ] Verify that all authentication and authorization checks are working correctly.
    - [ ] Check for edge cases, such as trying to enroll in an already-enrolled course or liking a post twice.
    - [ ] Ensure all API responses are clear, consistent, and have appropriate status codes.
    - [ ] Conduct a final code review to check for best practices, security vulnerabilities, and code clarity.

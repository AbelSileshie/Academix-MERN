Academix Implementation Plan

1.  Project Kick-off (Week 1)

    Setup:

        Create a Git repository and establish version control best practices.

        Configure project management tools (e.g., Trello, Jira) and define workflows.

        Set up a MERN stack development environment with a consistent folder structure.

    Core Team:

        Assign roles and responsibilities to developers, designers, and testers.

    Architecture:

        Finalize the backend API design using Express.js.

        Design the MongoDB schemas and establish relationships.

2.  Sprint 1: User Management and Authentication (Week 2)

    Backend:

        Implement user registration, login, and password reset routes using Express.js and Passport.js.

        Design and create MongoDB schemas for Student and Admin.

        Secure API endpoints using JWT authentication.

    Frontend:

        Develop the user registration and login pages using React.js and Tailwind CSS.

        Create a basic User profile page to display user information.

3.  Sprint 2: Core Academic Features (Week 3)

    Backend:

        Create MongoDB schemas for Department, Course, and Class.

        Implement API endpoints for Browse the course catalog and department overviews.

        Implement API endpoints for students to enroll in courses.

    Frontend:

        Develop the course catalog page to display available courses.

        Create a department overview page.

        Implement the UI for course enrollment.

4.  Sprint 3: Community and Collaboration (Week 4)

    Backend:

        Create the Post schema and implement CRUD (Create, Read, Update, Delete) API endpoints.

        Implement logic for a commenting and liking system within the Post schema.

        Create API endpoints for uploading and retrieving course materials and old exams.

    Frontend:

        Develop the community forum/posting board UI.

        Implement the ability for users to create, view, comment on, and like posts.

        Develop a file upload component for course materials.

5.  Sprint 4: Dashboard and Extracurriculars (Week 5)

    Backend:

        Implement API endpoints to fetch personalized data for the student dashboard (enrolled courses, deadlines, etc.).

        Create schemas for Club and Event.

        Implement API endpoints for managing clubs and events.

    Frontend:

        Develop the student dashboard UI to display personalized information.

        Create a dedicated section for clubs and events.

6.  Sprint 5: Admin Features and Quality Assurance (Week 6)

    Backend:

        Implement API endpoints for admin-level functionality (managing users, courses, etc.).

        Integrate content moderation features.

    Frontend:

        Develop the admin dashboard UI.

        Implement final UI refinements and ensure responsive design across all devices.

    Testing:

        Conduct comprehensive unit, integration, and end-to-end testing.

        Fix any bugs identified during testing.

7.  Deployment and Launch (Week 7)

    Pre-Deployment:

        Prepare the production environment (e.g., configure a cloud hosting provider like AWS or DigitalOcean).

        Set up a continuous integration/continuous deployment (CI/CD) pipeline.

    Deployment:

        Deploy the MERN stack application to the production server.

    Launch:

        Announce the launch to the university community.

        Gather initial user feedback and plan for future iterations.

Changelog (changelog.md)

Academix Project Changelog

Release 0.1.0 - Initial MERN Stack Implementation

    Date: April 17, 2025

    Summary: This release marks the successful completion of the initial development phase, transitioning the project from a Django-based plan to a MERN stack architecture. The core functionalities for user management, course Browse, and community posting have been implemented.

Added:

    MERN Stack Integration: The entire backend is now built with Node.js and Express.js, with MongoDB as the database.

    User Authentication: Implemented user registration, login, and secure session management using JWT.

    Course Catalog: Users can now view a list of all available courses and their details.

    Community Forum: A basic posting system has been added, allowing users to create posts and interact with comments and likes.

    Student Dashboard: A preliminary dashboard is in place, displaying enrolled courses for a logged-in student.

    Responsive Design: The frontend is now responsive across all major devices thanks to Tailwind CSS.

Changed:

    Backend Framework: Switched from Django to Node.js/Express.js.

    Database: Migrated the data model from a PostgreSQL-like schema to MongoDB's document-based structure.

    Authentication: Switched from Django's built-in system to JWT and Passport.js.

    Styling: Replaced custom CSS with Tailwind CSS for a more efficient styling workflow.

Known Issues:

    Advanced search functionality is not yet fully implemented.

    The AI-powered chat and filtering features are not included in this release.

    The admin dashboard is still under development.

    Error handling for some API endpoints could be improved.

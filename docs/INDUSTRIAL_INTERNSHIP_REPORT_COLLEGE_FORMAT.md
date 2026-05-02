# Industrial Internship Report

## Cover Page Content

**INDUSTRIAL INTERNSHIP REPORT**

Submitted to  
**Faculty of Science and Technology**  
**Jagran Lakecity University, Bhopal**

In partial fulfillment of the requirement for the award of the degree of  
**Bachelor of Computer Applications**  
**Specialization: Data Science**

**Internship / Project Title:** RedBus Clone Using MEAN Stack  
**Name:** Lakshda Sharma  
**University Roll No.:** 2023BCAH024  
**Semester:** 6th Semester  
**Session:** 2025-2026  
**Organization / Training Company:** [Replace with company name if required]  
**Industry Mentor:** [Replace with mentor name]  
**Faculty Guide:** [Replace with faculty guide name]

---

## Certificate

This is to certify that the Industrial Internship Report entitled **"RedBus Clone Using MEAN Stack"** submitted by **Lakshda Sharma**, University Roll Number **2023BCAH024**, in partial fulfillment of the requirement for the award of the degree of **Bachelor of Computer Applications**, is a record of work carried out during the internship / training period under proper guidance and supervision.

The work embodied in this report is original and has been completed to the satisfaction of the undersigned. The student has demonstrated sincere effort, regular involvement, and satisfactory understanding during the training period.

**Industry Mentor Signature:** ____________________  
**Name:** ____________________  
**Designation:** ____________________  
**Organization:** ____________________

**Faculty Guide Signature:** ____________________  
**Name:** ____________________  
**Department:** ____________________

**Date:** ____________________

Note: Attach the original company-issued internship certificate in the final printed file if your college specifically asks for it in place of this page.

---

## Declaration

I hereby declare that this Industrial Internship Report is an authentic record of my own work carried out during the internship / training period as part of the academic requirements of the Bachelor of Computer Applications program. The project work titled **"RedBus Clone Using MEAN Stack"** has been developed and documented by me on the basis of the tasks, learning, implementation work, and observations completed during the training duration.

I further declare that the report has not been submitted earlier, either in full or in part, to any other university or institution for the award of any degree, diploma, or certificate. The facts and data mentioned in this report are true to the best of my knowledge, and all external references have been duly acknowledged wherever required.

**Student Signature:** ____________________  
**Name:** Lakshda Sharma  
**University Roll No.:** 2023BCAH024  
**Date:** ____________________

---

## Acknowledgement

I express my sincere gratitude to my faculty guide, industry mentor, and all those who supported me during the completion of my industrial internship and project work. Their guidance, encouragement, and timely suggestions helped me understand the practical application of software development concepts in a real implementation environment.

I am especially thankful to the organization where I completed my internship for providing me the opportunity to work on a meaningful web application project. Through this work, I was able to strengthen my knowledge of frontend development, backend APIs, database integration, authentication, payment gateway implementation, notifications, and full stack architecture using the MEAN stack.

I am also grateful to the Faculty of Science and Technology, Jagran Lakecity University, Bhopal, for including industrial internship as a part of the curriculum. This practical exposure has helped me connect theoretical concepts with real project execution. Finally, I thank my family and friends for their support and motivation throughout the internship period.

---

## Executive Summary

This internship report presents the work carried out on the project **"RedBus Clone Using MEAN Stack"**, a web-based bus booking platform inspired by the workflow of online travel-ticketing systems. The project was designed and developed as a practical full stack implementation using **Angular 17**, **Node.js**, **Express.js**, and **MongoDB**.

The application supports core operations of a modern bus booking system such as route search, bus listing, seat selection, passenger details handling, online payment, booking management, and user notifications. Along with these foundational features, the project also includes several advanced modules such as Google-based login, JWT authentication, user profile management, review system, community post system, route planner, browser push notification support, real-time notifications through Socket.IO, and multilingual support for English and Hindi.

This report is prepared in the format of an industrial internship submission and focuses not only on the final outcome of the project, but also on the learning process, weekly activities, tools used, project methodology, and skills acquired during the internship period.

---

## Table of Contents

1. Introduction  
1.1 Introduction of the Organization / Training Environment  
1.2 Nature and Objective of the Organization / Project Environment  
1.3 Work Domain and Learning Context  
1.4 Internship Objectives  
1.5 Scope of Work  
2. Training Details  
2.1 Training Duration and Department / Domain Worked In  
2.2 Roles and Responsibilities  
2.3 Skills Acquired During Training  
3. Training Work / Weekly Activity  
3.1 Weekly Activity Report  
3.2 Tools and Technologies Used  
3.3 Development Practices Followed  
4. Project Work / Module Work / Case Study  
4.1 Project Title  
4.2 Aim and Objectives of the Project  
4.3 Problem Statement  
4.4 Existing System and Need for the Proposed System  
4.5 Methodology  
4.6 System Architecture  
4.7 Database Design  
4.8 Frontend Module Description  
4.9 Backend Module Description  
4.10 Authentication and Security  
4.11 Payment Gateway Integration  
4.12 Notification and Real-Time Communication  
4.13 Community and Review Module  
4.14 Route Planner and Localization  
4.15 Tools Used  
4.16 Result / Outcome  
4.17 Screenshots to be Attached  
5. Conclusions  
5.1 Overall Experience  
5.2 Key Takeaways  
5.3 Importance of Industrial Training in Career Development

---

## 1. Introduction

Industrial internship is an important part of professional education because it gives students practical exposure to real-world tools, workflows, communication practices, and project execution methods. It helps bridge the gap between classroom learning and software industry requirements. During this internship period, I worked on a full stack web application project titled **"RedBus Clone Using MEAN Stack"**, which allowed me to apply technical concepts in a structured and outcome-driven manner.

The project selected for this internship is inspired by modern bus ticket booking platforms. It simulates an online system in which users can search routes, select available buses, choose seats, fill in booking details, complete payment, and manage their trips. In addition, the project includes advanced functionality such as community engagement, multilingual support, notifications, route planning, and review management, making it much more than a simple booking application.

This report documents the training experience, project understanding, technologies used, learning achieved, tasks performed, implementation methodology, and final outcomes.

### 1.1 Introduction of the Organization / Training Environment

This internship was completed in a software development learning environment focused on practical implementation of web technologies and project-based learning. The training environment emphasized real application development, code structuring, debugging, integration of APIs, and exposure to production-like workflows. The primary focus was on understanding how a multi-module web application is built from frontend to backend and how business requirements are converted into technical features.

The internship setting was centered around modern software engineering practices such as modular development, feature implementation, API-based communication, responsive UI design, authentication, and integration of external services like payment gateways and notifications. The environment encouraged hands-on work rather than only theoretical study.

If your college requires the exact internship company name, replace this section with the official company introduction and profile.

### 1.2 Nature and Objective of the Organization / Project Environment

The nature of the internship work was technical and development-oriented. The objective of the environment was to train students in practical software development by assigning them a real project use case. Instead of limiting the training to demonstrations, the internship involved working on a project that resembles a real-world transportation and booking platform.

The objective of the project environment was:

- To understand full stack web development
- To learn component-based frontend development in Angular
- To build backend APIs using Express and Node.js
- To manage data persistence using MongoDB and Mongoose
- To handle user authentication securely
- To understand payment integration flow
- To implement user-centric features such as reviews, notifications, and preferences

### 1.3 Work Domain and Learning Context

The primary work domain during the internship was **full stack web development** with focus on the **MEAN stack**. The project involved frontend development, backend route design, database schema understanding, and integration work between multiple modules.

The learning context covered:

- Single-page application development
- REST API communication
- MongoDB data modeling
- Authentication and authorization
- Payment processing logic
- Browser notification handling
- Real-time event communication using sockets
- Project structuring and maintainability

### 1.4 Internship Objectives

The major objectives of the internship were:

- To understand the lifecycle of a full stack software project
- To improve practical coding skills in Angular, Node.js, Express.js, and MongoDB
- To gain exposure to API development and integration
- To implement a real project with multiple business modules
- To strengthen debugging and problem-solving ability
- To understand how software requirements are transformed into user-facing features
- To prepare for industry-level development work through hands-on implementation

### 1.5 Scope of Work

The scope of the internship work included development and documentation of a bus booking application with multiple integrated modules. The implementation scope included:

- Search and route discovery
- Bus result listing
- Seat selection
- Passenger details and booking creation
- Payment gateway support
- Authentication and profile management
- Reviews and community interaction
- Notification settings and push behavior
- Route planning support
- English and Hindi interface support

The scope did not fully include enterprise deployment, refund automation, operator dashboard, or large-scale analytics. However, the existing implementation is strong enough to demonstrate full stack capability in an academic internship setting.

---

## 2. Training Details

### 2.1 Training Duration and Department / Domain Worked In

The internship / training was completed during the academic session **2025-2026**. The working domain was **Software Development / Web Application Development**, with specialization in **Full Stack JavaScript Development**.

The main technologies explored in this period were:

- Angular 17
- TypeScript
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Socket.IO
- Stripe
- Razorpay

### 2.2 Roles and Responsibilities

During the internship, my responsibilities included:

- Understanding the project structure and application flow
- Working with frontend components and Angular services
- Understanding API communication between frontend and backend
- Studying route, booking, payment, and notification logic
- Managing project modules in a structured way
- Testing implemented features and validating user flows
- Preparing documentation based on the actual project

### 2.3 Skills Acquired During Training

The internship helped me develop both technical and practical skills.

**Technical skills acquired:**

- Angular component-based development
- API consumption using Angular HttpClient
- Backend routing using Express.js
- MongoDB schema understanding with Mongoose
- JWT-based authentication flow
- Real-time communication using Socket.IO
- Payment integration logic using Stripe and Razorpay
- Browser notification and service worker basics

**Practical skills acquired:**

- Understanding modular project structure
- Reading and maintaining an existing codebase
- Debugging integration issues
- Converting requirements into documented technical output
- Presenting software work in a formal report format

---

## 3. Training Work / Weekly Activity

### 3.1 Weekly Activity Report

The internship work was carried out in stages. A summarized weekly activity flow is presented below. You can directly convert this into a table in Word if required by your college format.

**Week 1: Project Orientation and Requirement Understanding**

- Understood the problem domain of online bus booking systems
- Studied the project folder structure for frontend and backend
- Identified key modules such as route search, booking, payment, and profile
- Reviewed the technology stack used in the project

**Week 2: Frontend Structure and Navigation Study**

- Studied Angular routing configuration
- Explored pages such as landing page, select-bus page, payment page, and profile page
- Understood component hierarchy and interaction flow
- Observed the use of services for API communication

**Week 3: Backend API and Database Understanding**

- Studied backend server initialization and route registration
- Understood route files for customer, booking, route, bus, payment, post, review, and notification handling
- Learned how MongoDB models are mapped using Mongoose
- Examined API response structures and backend logic flow

**Week 4: Authentication and Security Workflow**

- Understood Google credential verification flow
- Studied JWT generation and secure API access
- Learned how auth guard and auth interceptor work in Angular
- Observed ownership validation and protected routes in backend middleware

**Week 5: Booking and Payment Flow Study**

- Analyzed seat booking and seat availability logic
- Understood creation of booking records
- Explored Stripe checkout session flow
- Explored Razorpay order creation and payment verification
- Learned about payment attempt tracking before final booking confirmation

**Week 6: Notifications, Reviews, and Community Features**

- Studied notification service logic and Socket.IO integration
- Understood push notification subscription and browser permission flow
- Explored review submission, helpful votes, and report-based hiding logic
- Understood post creation, comments, likes, and moderation flow

**Week 7: Route Planner and Localization**

- Studied route planner page and compare options logic
- Understood route comparison based on time, distance, and traffic
- Observed saved route plan handling
- Studied translation files and English-Hindi UI support

**Week 8: Testing, Validation, and Documentation**

- Reviewed application behavior across key user flows
- Noted practical limitations and future enhancement areas
- Structured the complete project documentation
- Prepared formal report content aligned with university format

### 3.2 Tools and Technologies Used

The following tools and technologies were used or studied during the internship:

**Programming and scripting**

- TypeScript
- JavaScript
- HTML
- CSS

**Frontend**

- Angular 17
- Angular Material
- RxJS
- Tailwind CSS / custom styling

**Backend**

- Node.js
- Express.js

**Database**

- MongoDB
- Mongoose

**Authentication and integration**

- Google Auth Library
- JWT
- Socket.IO
- Web Push
- Stripe
- Razorpay

**Development support**

- npm
- Angular CLI
- Nodemon
- Visual Studio Code
- Browser developer tools

### 3.3 Development Practices Followed

During the training work, the following software development practices were observed:

- Modular organization of frontend and backend code
- Separation of routes, models, services, and UI components
- API-driven communication between client and server
- Secure use of authentication tokens for protected routes
- Reusable service methods in Angular
- Feature-specific code separation such as reviews, notifications, and community
- Incremental understanding and testing of modules

---

## 4. Project Work / Module Work / Case Study

### 4.1 Project Title

**RedBus Clone Using MEAN Stack**

### 4.2 Aim and Objectives of the Project

The aim of the project is to develop a modern web-based bus booking platform that replicates the major functionalities of an online bus reservation system. The project is intended to provide users with an integrated and convenient environment to search buses, select seats, book tickets, make payments, and manage trip-related activities digitally.

The objectives of the project are:

- To create a responsive and user-friendly bus booking application
- To implement route search and bus listing functionality
- To provide seat selection and booking confirmation features
- To integrate secure Google login and JWT-based user authentication
- To enable payment using Stripe and Razorpay
- To maintain user profile and booking history
- To support notifications, reviews, and community features
- To demonstrate practical full stack development using the MEAN stack

### 4.3 Problem Statement

Traditional booking methods are often manual, time-consuming, and inconvenient for users. Even many digital systems focus only on ticket booking and do not provide an integrated experience with personalized communication, feedback systems, route planning, and user preference management.

The problem addressed in this project is the creation of a single platform where a user can:

- Search routes efficiently
- Compare available buses
- View seats and select them interactively
- Complete secure payment
- Receive updates and reminders
- Review trips and interact through community content

Thus, the project solves the need for a feature-rich, user-oriented, and technically modular online booking platform.

### 4.4 Existing System and Need for the Proposed System

The existing bus booking process in many cases is fragmented. Users may need to rely on separate systems for route inquiry, seat booking, payment, and trip-related communication. This can create inconvenience, low transparency, and weak user engagement.

The proposed system improves upon this by providing:

- A single web interface for the entire booking process
- Secure login and persistent user context
- Integrated payment gateway support
- Notification-based communication
- Community and review features
- Route planning and language support

The need for the proposed system lies in improving convenience, usability, transparency, and learning value through a realistic full stack implementation.

### 4.5 Methodology

The project follows a structured implementation methodology. The development can be understood in the following stages:

**Requirement analysis:**  
The first step was to understand what an online bus booking platform should provide. This included route search, seat selection, booking, payment, trip history, and communication features.

**System planning:**  
The project was divided into frontend modules, backend APIs, database models, and integration services. This helped in keeping the code organized and easier to understand.

**Frontend development:**  
Angular components and pages were created or studied for the main user flows such as searching buses, selecting seats, making payments, and viewing profiles.

**Backend development:**  
Express routes and Mongoose models were used to implement logic related to users, bookings, payments, notifications, posts, and reviews.

**Integration:**  
Frontend services were connected to backend APIs. JWT-based authentication, payment workflows, route fetching, and notification handling were integrated.

**Testing and refinement:**  
The application was tested module by module, and observations were documented for final reporting.

### 4.6 System Architecture

The project follows a client-server architecture.

**Frontend layer:**  
The Angular frontend handles the presentation layer, routing, user interactions, forms, and service calls.

**Backend layer:**  
The Node.js and Express backend exposes REST APIs, validates requests, processes business logic, and coordinates with third-party integrations.

**Database layer:**  
MongoDB stores customer records, bookings, buses, routes, notifications, reviews, posts, and payment attempts.

**Real-time and integration layer:**  
Socket.IO supports real-time notification delivery. Stripe and Razorpay handle payment processing. Google authentication supports user login. Web push supports browser notifications.

**Simple architecture flow:**  
User -> Angular UI -> Angular Service -> Express API -> MongoDB / Third Party Service -> Response -> UI Update

### 4.7 Database Design

The database structure is one of the key parts of the project because it manages persistent application data.

**Customer collection**

- Stores name, email, profile picture, verification status, language preference, push subscription, and notification preferences

**Booking collection**

- Stores bus ID, customer ID, selected seats, fare, contact information, passenger details, route details, status, and payment references

**Bus collection**

- Stores bus metadata such as operator name, total seats, timing, route relation, and type

**Route collection**

- Stores departure location, arrival location, and duration details

**Notification collection**

- Stores title, message, user ID, notification type, channel status, read state, and metadata

**Post collection**

- Stores community post content, author details, likes, comments, and moderation flags

**Review collection**

- Stores booking-linked ratings, review text, helpful vote data, and report status

**PaymentAttempt collection**

- Stores provider-wise payment status before the booking is finalized

### 4.8 Frontend Module Description

The Angular frontend includes multiple modules and pages that work together to complete the user journey.

**Landing page:**  
Displays the entry interface of the application with route search and promotional sections.

**Select bus page:**  
Displays the list of matching buses with details like departure time, arrival time, ratings, fare, and seat availability.

**Seat layout module:**  
Allows visual seat selection and booking summary generation.

**Passenger details page:**  
Handles passenger-related input and booking information flow.

**Payment page:**  
Allows payment method selection, fare review, gateway initiation, and payment confirmation workflow.

**Booking success page:**  
Displays confirmation after successful booking and provides a ticket-related success view.

**Profile and my trips page:**  
Allows users to view their booking history and profile-linked actions.

**Community page:**  
Displays travel posts where users can share experiences, comments, and engagement.

**Notifications page:**  
Displays categorized notifications and supports read/unread status control.

**Notification settings page:**  
Allows users to manage language and communication preferences.

**Route planner page:**  
Allows route comparison based on traffic, time, and distance with saved routes and utility tools.

### 4.9 Backend Module Description

The backend supports the application through a structured set of APIs.

**Server initialization:**  
The backend initializes Express, CORS, MongoDB connection, Socket.IO, and scheduled notification jobs.

**Customer routes:**  
Handle login, profile retrieval, language updates, push subscription, and notification preferences.

**Booking routes:**  
Handle booking creation, seat booking operations, and user booking retrieval.

**Route routes:**  
Search matching routes and buses and also provide demo route fallback for selected city combinations.

**Bus routes:**  
Support bus-related operations and schedule change updates.

**Payment routes:**  
Implement Stripe and Razorpay checkout workflows, validation, and booking confirmation after payment success.

**Post routes:**  
Support community content creation, likes, comments, reports, and list fetching.

**Review routes:**  
Manage review creation, editing, reporting, and helpful vote operations.

**Notification routes:**  
Store and return notifications, mark them as read, broadcast promotional alerts, and expose the push public key.

### 4.10 Authentication and Security

Security is a crucial part of the project because features such as bookings, reviews, and payments require user verification.

The project uses **Google-based login** and **JWT authentication**. After the Google credential is verified on the server, a JWT token is generated and returned to the frontend. Angular then attaches this token to secured API requests using an HTTP interceptor.

The frontend also uses an auth guard to restrict access to certain pages such as the profile page. On the backend, protected routes validate the token before allowing access. Some features such as post creation and review submission are restricted to verified users, which improves authenticity and trust.

### 4.11 Payment Gateway Integration

The payment system is implemented using both **Stripe** and **Razorpay**.

**Stripe workflow:**

- User selects a booking and starts Stripe payment
- Backend creates a checkout session
- Stripe handles secure hosted payment
- Success callback is confirmed by the backend
- Booking is created only after successful payment verification

**Razorpay workflow:**

- User starts Razorpay order creation
- Backend generates a Razorpay order
- Frontend opens checkout
- Backend verifies the returned payment signature
- Booking is finalized after verification

The project also uses a **PaymentAttempt** model to avoid duplicate booking records and to track pending or successful transactions more cleanly.

### 4.12 Notification and Real-Time Communication

The project includes a multi-channel notification system.

**In-app notifications:**  
Booking, schedule change, and promotion alerts are stored in MongoDB and shown inside the application.

**Socket.IO notifications:**  
Users can receive near-real-time notifications through user-specific socket rooms.

**Browser push notifications:**  
The frontend requests browser permission and supports service worker-based notification delivery when the backend is configured with VAPID keys.

**Preference-based notifications:**  
Users can enable or disable email, push, and promotional channels according to their needs.

### 4.13 Community and Review Module

The project includes user engagement features that make the platform richer and more practical.

**Community module:**  
Verified users can create posts. Other users can read posts, like them, comment on them, and report inappropriate content.

**Review module:**  
Users can submit journey reviews with ratings and feedback. Reviews support helpful votes, report logic, and moderation-based hiding.

These modules simulate the trust-building and interaction features commonly seen in modern travel applications.

### 4.14 Route Planner and Localization

The route planner module helps users compare possible routes using map-based logic and traffic-aware calculations. It supports:

- Source and destination input
- Waypoints
- Comparison by time, distance, and traffic
- Saved route plans
- Periodic route refresh

The project also supports **English and Hindi** translation through a translation file and language service. This makes the interface more user-friendly and demonstrates awareness of localization.

### 4.15 Tools Used

The major tools used in the project are:

- Angular CLI
- Visual Studio Code
- Node.js runtime
- npm package manager
- MongoDB
- Browser developer tools
- Socket.IO
- Stripe
- Razorpay
- Google Identity / credential verification support

### 4.16 Result / Outcome

The final outcome of the project is a working full stack bus booking web application that demonstrates end-to-end user flow from route search to booking confirmation.

The project successfully shows:

- Search and selection of buses
- Seat booking flow
- User authentication
- Payment integration
- Booking storage and retrieval
- Notification generation
- Review and community interaction
- Route planning and translation support

Overall, the project meets its educational and functional objectives and serves as a strong internship-level implementation of a practical software system.

### 4.17 Screenshots to be Attached

For the final Word / printed report, the following screenshots should be added under this section:

1. Home page
2. Search form and route selection
3. Bus result listing
4. Seat layout page
5. Passenger details page
6. Payment page
7. Booking success page
8. Profile page
9. My trips page
10. Community page
11. Notifications page
12. Notification settings page
13. Route planner page
14. MongoDB collections
15. Backend folder structure
16. Frontend folder structure
17. API responses or Postman testing screens

Each screenshot should have a short caption and explanation in the final submission.

---

## 5. Conclusions

### 5.1 Overall Experience

The industrial internship experience was highly valuable because it allowed me to work on a realistic software project rather than only studying theory. Through the RedBus Clone project, I learned how different modules of a full stack web application are connected and how user-facing features depend on backend logic, database design, and third-party service integration.

The internship improved my confidence in understanding and explaining a complete application architecture. It also taught me how a project is structured in a modular way and how multiple technologies work together to achieve a common business goal.

### 5.2 Key Takeaways

The key takeaways from this internship are:

- Full stack development requires understanding both frontend and backend logic
- Good project structure improves maintainability and scalability
- Authentication and payment workflows must be handled carefully and securely
- User experience improves greatly when features like notifications, profile management, and localization are added
- Real-world applications involve multiple connected modules, not isolated code files
- Documentation is as important as implementation because it reflects technical understanding

### 5.3 Importance of Industrial Training in Career Development

Industrial training plays a major role in career development because it introduces students to practical implementation, software tools, structured workflows, and outcome-based learning. It helps students develop technical maturity, industry awareness, communication ability, and confidence in handling real software problems.

For me, this internship was not only about building a project but also about understanding how a complete software system is planned, developed, integrated, and presented professionally. It has strengthened my preparation for future academic projects, technical interviews, internships, and professional software roles.

---

## Appendix A: Suggested Formatting Notes for Final Submission

To match the college `.docx` format more closely in Word:

- Keep each major section on a new page
- Use bold centered headings for main sections
- Use justified body text
- Use 1.5 line spacing if required by the college
- Insert the original college cover page styling manually in Word
- Replace placeholders such as company name, guide name, and dates before final submission
- Attach actual screenshots inside Section 4.17
- If your college wants a company certificate page, replace the sample certificate page accordingly

---

## Appendix B: Project-Specific Technical Summary

This internship report is based on an actual codebase that includes:

- Angular frontend with routed pages
- Express backend with API routes
- MongoDB models for customer, booking, route, bus, post, review, notification, and payment attempts
- Google credential verification for login
- JWT-based protected APIs
- Stripe and Razorpay payment flows
- Socket.IO-based live notification support
- Browser push notification setup
- Community and review modules
- Route planner and bilingual translation support

This makes the project suitable for a detailed industrial internship submission because it demonstrates both technical depth and practical application value.

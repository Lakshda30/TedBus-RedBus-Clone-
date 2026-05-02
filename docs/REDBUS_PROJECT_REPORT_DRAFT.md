# RedBus Clone Project Report

## Title Page

**Project Title:** RedBus Clone Using MEAN Stack  
**Project Type:** Major / Minor Academic Project Report  
**Technology Stack:** MongoDB, Express.js, Angular, Node.js  
**Frontend Framework:** Angular 17  
**Backend Framework:** Express.js  
**Database:** MongoDB with Mongoose  
**Prepared For:** [College / University Name]  
**Prepared By:** [Your Name]  
**Enrollment Number:** [Your Enrollment Number]  
**Branch / Department:** [Your Branch]  
**Session:** [Academic Session]  
**Guide / Mentor:** [Guide Name]

---

## Certificate

This is to certify that the project report entitled **"RedBus Clone Using MEAN Stack"** is a bonafide work carried out by **[Your Name]** under the guidance of **[Guide Name]** in partial fulfillment of the requirements for the award of the degree/diploma in **[Course Name]**.

The work presented in this report is original and has been completed during the academic session **[Year-Year]**.

**Guide Signature:** ____________________  
**Head of Department:** ____________________  
**Date:** ____________________

---

## Declaration

I hereby declare that the project report titled **"RedBus Clone Using MEAN Stack"** submitted by me is an original work carried out by me under the supervision of my faculty guide. The information presented in this report is true to the best of my knowledge. Any references used in the report have been properly acknowledged.

**Student Signature:** ____________________  
**Name:** [Your Name]  
**Date:** ____________________

---

## Acknowledgement

I would like to express my sincere gratitude to my project guide, teachers, and institution for their continuous support and valuable suggestions during the development of this project. Their guidance helped me understand the practical implementation of full stack web application development using the MEAN stack.

I also thank my friends and classmates for their encouragement and constructive feedback throughout the project lifecycle. Finally, I am grateful to my family for their constant motivation and support.

---

## Abstract

The online bus ticket booking industry has transformed the way travelers search, compare, and reserve transport services. Inspired by modern digital booking platforms, this project, **RedBus Clone Using MEAN Stack**, aims to build a feature-rich web application that simulates the core behavior of a real-world bus reservation system. The system allows users to search routes, explore available buses, select seats, add passenger details, complete payments, manage bookings, and receive booking-related updates through in-app and browser notifications.

The project has been implemented using the **MEAN stack**, where **MongoDB** is used as the database, **Express.js** and **Node.js** are used for building REST APIs and server-side logic, and **Angular 17** is used to create a dynamic, interactive, and modular user interface. The application architecture follows a clear separation between frontend presentation, business logic, and persistent storage. The backend communicates with MongoDB using **Mongoose**, while the frontend integrates with the backend APIs using Angular services and HTTP interceptors.

In addition to basic booking functionality, this project also includes several advanced modules such as **Google-based login**, **JWT authentication**, **seat availability tracking**, **online payment support through Stripe and Razorpay**, **community posts**, **user reviews**, **notification settings**, **browser push notifications**, **Socket.IO-based real-time updates**, **route planning support**, and **multi-language support in English and Hindi**. These features make the application more practical and closer to an industry-oriented travel booking platform.

The project demonstrates how a scalable web application can be designed using modern JavaScript technologies. It highlights real-world concerns such as modular coding, API design, authentication, payment flow, localization, notification handling, and user engagement. This report presents the objectives, requirement analysis, architecture, implementation methodology, module descriptions, testing strategy, limitations, and future scope of the developed system.

**Keywords:** Bus Booking System, MEAN Stack, Angular, Node.js, Express.js, MongoDB, JWT, Stripe, Razorpay, Notifications, Route Planner

---

## Table of Contents

1. Introduction  
2. Problem Statement  
3. Objectives of the Project  
4. Scope of the Project  
5. Existing System and Proposed System  
6. Feasibility Study  
7. Requirement Analysis  
8. Technology Stack  
9. System Design  
10. Database Design  
11. Frontend Module Description  
12. Backend Module Description  
13. Authentication and Security  
14. Payment Integration  
15. Notification and Real-Time Communication  
16. Community and Review System  
17. Route Planner and Localization  
18. Working Methodology  
19. Testing and Validation  
20. Challenges Faced  
21. Limitations  
22. Future Enhancements  
23. Conclusion  
24. References  
25. Appendix

---

## 1. Introduction

Digital transportation services have become an essential part of everyday travel planning. Users expect quick route discovery, transparent fare details, simple payment options, and reliable notifications. Traditional ticket reservation methods are time-consuming, less transparent, and heavily dependent on manual intervention. This creates the need for a centralized, user-friendly, online bus booking platform.

The **RedBus Clone** project is designed as a practical implementation of such a platform. It provides a complete web-based environment where users can explore routes, compare buses, choose seats, make bookings, and track their journey-related activities. The project is inspired by the workflow of a commercial bus ticketing portal but is implemented as an academic and technical exercise to understand full stack system development.

This project is not limited to static page development. It includes several operational modules that make it a full stack application, such as authentication, booking persistence, payment processing, push notifications, route selection, profile handling, trip management, and user-generated community content. The project therefore acts as a strong example of integrating multiple technologies into a single cohesive system.

The application is developed using Angular on the frontend and Express with Node.js on the backend. MongoDB stores users, bookings, posts, notifications, routes, buses, payment attempts, and reviews. Socket.IO is used to support live notification delivery. The system also includes a fallback demo data approach for route search so that the application remains usable even when database route entries are limited.

The purpose of this report is to explain how the system was conceptualized, designed, implemented, and evaluated.

---

## 2. Problem Statement

Many travelers face difficulties in finding a convenient and reliable online platform for bus booking that combines route discovery, seat selection, payment, and user communication in one place. Traditional systems often lack transparency, real-time status, personalization, and integrated user support.

The problem addressed by this project is the design and implementation of a web-based bus booking platform that:

- Allows users to search bus routes efficiently
- Displays available buses and seat availability
- Supports secure user login and booking workflows
- Enables digital payment using online gateways
- Stores bookings and trip history persistently
- Provides notifications and reminders
- Supports modern engagement features like reviews and community interaction

The challenge is to build such a system using a modern and scalable full stack architecture.

---

## 3. Objectives of the Project

The major objectives of the project are:

- To design and develop an online bus booking web application using the MEAN stack
- To provide route search and bus listing functionality for users
- To implement a seat layout and ticket booking workflow
- To integrate secure login using Google credential verification and JWT
- To provide online payment options using Stripe and Razorpay
- To store booking records and user data in MongoDB
- To enable profile management and trip history viewing
- To add review and community features for user engagement
- To support notifications, schedule updates, and promotional alerts
- To include multilingual support for better accessibility
- To study the practical use of modular architecture in full stack development

---

## 4. Scope of the Project

The scope of this project covers the development of a browser-based bus booking system with modern user-facing and administrative utility features. The primary users of the system are travelers who want to search and book bus tickets online. The project also contains supporting mechanisms that mimic platform management tasks such as route planning, notification broadcasting, and schedule change updates.

The system allows a user to:

- Search buses by departure city, arrival city, and date
- View route and bus details
- Select seats and enter passenger data
- Complete payments using supported gateways
- View personal bookings in the profile section
- Cancel bookings in supported flows
- Submit and manage reviews for completed trips
- Engage with a travel community by posting stories and comments
- Receive notifications related to booking and promotions
- Manage language and notification preferences

From an implementation viewpoint, the project scope includes frontend UI development, backend API design, MongoDB integration, authentication flow, payment integration, and notification services. It does not yet fully include large-scale deployment optimization, role-based admin dashboards, refund automation, or complex analytics.

---

## 5. Existing System and Proposed System

### 5.1 Existing System

In many traditional booking models, users must rely on offline counters, phone-based reservations, or fragmented online portals. These systems may suffer from limited seat visibility, delayed confirmation, inconvenient payment handling, weak personalization, no community feedback, and poor tracking of booking history.

### 5.2 Proposed System

The proposed system is a modern MEAN stack web application that centralizes all major bus booking activities. It offers responsive Angular-based frontend, REST API-driven backend, secure JWT session handling, MongoDB persistence, payment gateway integration, notification delivery, community and review-based trust features, and localization support.

---

## 6. Feasibility Study

### 6.1 Technical Feasibility

The project is technically feasible because the selected technologies are mature, popular, open source, and well-suited for full stack JavaScript development. Angular provides component-driven frontend development, while Express and Node.js offer lightweight API creation. MongoDB supports flexible schema evolution, which is useful during academic project development.

### 6.2 Economic Feasibility

The project is economically feasible because the tools used are either free or available under open-source licenses. Development can be performed using a standard laptop environment with Node.js, npm, Angular CLI, and a local MongoDB instance.

### 6.3 Operational Feasibility

The system is simple enough for end users to operate without training. Navigation is based on common travel app patterns such as search, select, pay, and view bookings. The use of familiar design elements supports operational feasibility.

### 6.4 Schedule Feasibility

The project is feasible within an academic timeline because it can be developed incrementally through modules such as authentication, booking, payment, and notification services.

---

## 7. Requirement Analysis

### 7.1 Functional Requirements

- User should be able to search buses by route and date
- User should be able to view bus details and seat availability
- User should be able to select seats and proceed with booking
- User should be able to log in using Google-based flow
- System should generate JWT token after successful login
- User should be able to complete payment through Stripe or Razorpay
- System should store booking information in the database
- User should be able to view profile and trip history
- User should be able to cancel a booking
- Verified users should be able to create community posts
- Users should be able to like, comment on, and report posts
- Verified users should be able to add reviews for completed journeys
- Users should be able to update notification preferences and language
- System should send booking confirmation and promotional notifications
- System should support route planning and route comparison

### 7.2 Non-Functional Requirements

- The system should be responsive and easy to use
- APIs should return structured JSON responses
- The application should be modular and maintainable
- Authentication tokens should be attached to secured API calls
- The system should provide acceptable performance for small-scale use
- User data should be stored persistently and safely
- The project should be extensible for future features

---

## 8. Technology Stack

### 8.1 Frontend Technologies

- **Angular 17**
- **Angular Material**
- **TypeScript**
- **RxJS**
- **Tailwind CSS / Custom CSS**
- **jsPDF**
- **Socket.IO Client**

### 8.2 Backend Technologies

- **Node.js**
- **Express.js**
- **Mongoose**
- **JWT**
- **Google Auth Library**
- **Socket.IO**
- **Web Push**
- **Stripe**
- **Razorpay**
- **Nodemailer**

### 8.3 Database

- **MongoDB** for customer, booking, route, bus, review, post, payment attempt, and notification data

---

## 9. System Design

The system follows a client-server architecture.

### 9.1 High-Level Architecture

1. User interacts with Angular frontend.
2. Angular services call backend APIs over HTTP.
3. Express server receives and processes requests.
4. Mongoose communicates with MongoDB collections.
5. For live updates, the backend uses Socket.IO to emit notifications.
6. Browser push and in-app notifications are used for communication.

### 9.2 Major Layers

- Presentation Layer: Angular components, routes, services, forms
- Business Logic Layer: Express routes, controllers, middleware, services
- Data Layer: MongoDB models and collections
- Integration Layer: Payment gateways, Google login, Maps, push services

### 9.3 Angular Routing Overview

The frontend application includes route mappings for landing page, bus selection page, payment page, profile page, seat layout page, booking success page, passenger details page, community page, notifications page, notification settings page, and route planner page. Protected routes such as the profile page are guarded using an Angular auth guard.

---

## 10. Database Design

The backend contains several data models that together support the full workflow.

### 10.1 Customer Model

Stores name, email, Google ID, profile picture, verification status, preferred language, notification preferences, and push subscription.

### 10.2 Booking Model

Stores bus ID, seats, date, customer ID, passenger details, contact details, fare, boarding and dropping details, duration, payment status, payment provider, and booking status.

### 10.3 Bus Model

Stores operator name, bus type, total seats, timing details, route reference, and basic bus metadata.

### 10.4 Route Model

Stores departure location, arrival location, sub-locations, and journey duration.

### 10.5 Notification Model

Stores user ID, type of notification, title, message, delivery channel status, read/unread state, and metadata.

### 10.6 PaymentAttempt Model

Stores user ID, email, amount, booking payload snapshot, payment provider, Stripe session or Razorpay order/payment references, status, and linked booking ID.

### 10.7 Post Model

Stores user ID, user name, topic, title, content, image URL, likes, comments, report count, and hidden status.

### 10.8 Review Model

Stores booking ID, user ID, rating, review text, helpful votes, report count, edit window, and hidden status.

---

## 11. Frontend Module Description

The frontend is developed as a modular Angular application with route-driven navigation and service-based backend integration.

### 11.1 Landing Page

The landing page acts as the homepage of the project. It presents the search interface for route discovery, offer banners, FAQ content, and branding elements.

### 11.2 Bus Selection Page

The select-bus module displays buses available for a selected route and date. It contains bus result cards, sorting controls, and seat access actions. The system fetches route and bus details from the backend and also supports fallback demo data for selected city pairs.

### 11.3 Seat Layout Module

The seat layout module allows users to choose seats visually. It gives a booking summary, selected seat count, and booking confirmation controls. It also displays review-related content.

### 11.4 Passenger Details Module

This module collects or displays key passenger and booking communication details. It contributes to the completion of the reservation flow.

### 11.5 Payment Page

The payment page allows the user to choose payment method, apply offer code, view fare breakup, start Stripe checkout, start Razorpay payment flow, and handle success or failure messages.

### 11.6 Profile Page

The profile page is protected through Angular routing guard and is visible only for authenticated users. It helps users manage booking history and profile-related data.

### 11.7 Community Page

The community module enables users to share travel-related content. Users can create posts, comment on others' posts, like posts, and report inappropriate content.

### 11.8 Notifications Page

This module displays booking, cancellation, schedule change, and promotion-related notifications. Users can mark individual notifications or all notifications as read.

### 11.9 Notification Settings Module

This component provides controls for email notifications, push notifications, promotional alerts, and preferred language. It also requests browser notification permission and manages push subscription behavior.

### 11.10 Route Planner Module

This is one of the unique features of the project. It compares route options based on time, distance, and traffic, supports waypoints, saved route plans, traffic refresh, and utility forms for schedule update and promotional notification flows.

### 11.11 Localization Support

The frontend includes translation files and a translate pipe to support both English and Hindi labels across major UI screens.

---

## 12. Backend Module Description

The backend is built using Express.js and organized into route files, models, middleware, and services.

### 12.1 Server Initialization

The backend server loads environment variables, configures CORS, parses JSON requests, creates an HTTP server, attaches Socket.IO, connects to MongoDB, registers API route groups, and starts periodic notification retry and reminder jobs.

### 12.2 Route APIs

Backend route groups include:

- `/api/routes`
- `/api/bookings`
- `/api/customer`
- `/api/bus`
- `/api/payments`
- `/api/posts`
- `/api/reviews`
- `/api/notifications`

### 12.3 Customer Routes

Customer routes manage login through Google credential verification, JWT generation, customer data retrieval, notification preference updates, language updates, and push subscription updates.

### 12.4 Booking Routes

Booking routes are responsible for creating booking records, returning user bookings, seat booking operations, seat occupancy listing, and notification triggering on successful booking.

### 12.5 Route Routes

Route routes locate the requested route and its buses. If database data is unavailable for certain city pairs, the system returns demo routes and demo buses for demonstration purposes.

### 12.6 Bus Routes

Bus routes support bus retrieval and schedule update logic. Schedule changes can also notify affected users through the notification service.

### 12.7 Payment Routes

Payment routes implement payment gateway configuration status, Stripe checkout session creation, Stripe payment confirmation, Razorpay order creation, and Razorpay signature verification.

### 12.8 Post Routes

Post routes allow verified users to add a post, fetch posts, fetch user-specific posts, like a post, comment on a post, and report a post.

### 12.9 Review Routes

Review routes allow review submission for verified completed journeys, review editing within an allowed time window, reporting of reviews, helpful vote tracking, and review retrieval by route and booking.

### 12.10 Notification Routes

Notification routes support notification creation, user notification listing, browser push public key retrieval, marking notifications as read, marking all notifications as read, promotion broadcasting, and failed notification retry.

---

## 13. Authentication and Security

Authentication is an important part of the system because payment, booking history, and protected user actions depend on verified identity.

### 13.1 Login Workflow

The project uses a Google-based login approach. The backend verifies the Google credential token using the Google Auth Library. Once the token is validated, user data is extracted, a customer record is created or updated, a JWT is generated, and the token is returned to the frontend.

### 13.2 JWT Usage

The JWT token includes user ID and email. The token is later attached by Angular through an HTTP interceptor when secured API routes are called.

### 13.3 Route Protection

The frontend uses an auth guard to restrict profile access to logged-in users. The backend uses middleware to validate tokens before allowing protected actions such as payment creation, post creation, and review submission.

### 13.4 Verification-Based Restrictions

The project restricts certain actions to verified users only, such as creating community posts and submitting trip reviews. This improves the trustworthiness of user-generated content.

### 13.5 Security Considerations

- JWT is used for session-based access control
- Google token verification reduces fake login risk
- Payment confirmation happens on the server side
- Razorpay signature verification ensures payment integrity
- User-specific actions check ownership conditions

---

## 14. Payment Integration

The payment module is one of the most important technical sections of the project.

### 14.1 Stripe Integration

For Stripe, the frontend sends booking payload to the backend, the backend validates booking data and creates a payment attempt, then creates a Stripe checkout session. On success, the frontend sends the session ID for confirmation, and the backend verifies payment status and converts the attempt into a confirmed booking.

### 14.2 Razorpay Integration

For Razorpay, the frontend requests order creation, the backend creates a Razorpay order and stores a payment attempt, the frontend opens checkout, and after payment the backend verifies the signature. If valid, the booking is finalized and a notification is sent.

### 14.3 Payment Attempt Tracking

The system uses a dedicated payment attempt model so that booking data is preserved before confirmation, duplicate bookings can be prevented, failed and pending payments can be tracked, and provider-specific references are stored cleanly.

### 14.4 Benefits of Dual Gateway Design

- Improves flexibility
- Demonstrates practical integration skills
- Supports international and domestic style payment flows
- Reduces dependence on one provider

---

## 15. Notification and Real-Time Communication

Notification support is a major enhancement in this project.

### 15.1 Types of Notifications

The system supports booking confirmation, booking cancellation, schedule changes, promotional offers, and general alerts.

### 15.2 Delivery Channels

Notifications can be delivered through in-app notification storage and display, browser push notifications, real-time Socket.IO events, and email support structure.

### 15.3 Socket.IO Integration

When a user connects, the frontend joins a room using the user ID. The backend can then emit notifications to that specific user room. This enables near-real-time delivery without full page refresh.

### 15.4 Push Notifications

The frontend registers a service worker and requests notification permission from the browser. If the user enables push notifications and the backend is configured with VAPID keys, the system can deliver browser notifications.

### 15.5 Notification Preferences

Users can control email notification status, push notification status, promotional opt-in state, and preferred language.

---

## 16. Community and Review System

This project goes beyond transactional booking and includes social and trust-based modules.

### 16.1 Community Posts

Verified users can publish travel-related posts. Other users can view posts, like posts, comment on posts, and report inappropriate posts. The backend automatically hides posts if they exceed a report threshold.

### 16.2 Review System

Users can review completed journeys by giving ratings and textual feedback. The review system supports verified-user review submission, one review per journey, edit window management, helpful vote tracking, report count, and hidden review logic after repeated reports.

### 16.3 Importance of These Features

- Improves user trust
- Helps other users make decisions
- Creates engagement beyond booking
- Simulates real-world platform behavior

---

## 17. Route Planner and Localization

### 17.1 Route Planner

The route planner module allows a user to enter source, destination, and optional waypoints, then compare route alternatives based on time, distance, and traffic. It also supports saved route plans, auto refresh of traffic data, visual map rendering, congestion classification, and route recommendation logic.

### 17.2 Localization

The project includes translation support for English and Hindi. A language service and translation pipe are used to render UI labels dynamically.

---

## 18. Working Methodology

The project was developed in a modular and iterative manner.

### 18.1 Requirement Collection

Initially, the major goals of a bus booking platform were identified: search, select, pay, manage booking, and notify user.

### 18.2 Planning

The project was divided into modules such as UI and routing, authentication, booking APIs, payment flow, notification system, and community and reviews.

### 18.3 Development

Frontend and backend were developed in parallel. Angular components handled UI behavior, while Express routes exposed functionality required by the frontend.

### 18.4 Integration

After individual modules were ready, HTTP service integration, auth token flow, payment gateway flow, notification channel flow, and MongoDB model integration were completed.

### 18.5 Testing

Major workflows were manually verified and Angular test files are also present as part of the generated project structure.

---

## 19. Testing and Validation

Testing is necessary to confirm that all core modules perform as expected.

### 19.1 Testing Approaches Used

- Manual functional testing
- API-level verification
- Form behavior testing
- Route navigation testing
- Payment flow validation
- Notification trigger testing

### 19.2 Sample Test Cases

**Test Case 1: Login**

- Input: Valid Google credential
- Expected Result: Customer record is created or updated and JWT is returned

**Test Case 2: Search Route**

- Input: Departure city, arrival city, date
- Expected Result: Matching buses or demo route data is returned

**Test Case 3: Seat Booking**

- Input: Bus ID and seat list
- Expected Result: Seats are marked booked and reflected in booking flow

**Test Case 4: Stripe Payment**

- Input: Valid booking payload
- Expected Result: Checkout session is created and booking is confirmed after payment

**Test Case 5: Razorpay Payment**

- Input: Valid order flow and payment signature
- Expected Result: Signature is verified and booking is saved

**Test Case 6: Create Post**

- Input: Verified user and valid post content
- Expected Result: Post is saved and visible in community section

**Test Case 7: Submit Review**

- Input: Verified completed booking and rating
- Expected Result: Review is saved against the journey

**Test Case 8: Notification Preferences**

- Input: Toggle email/push/promotions and select language
- Expected Result: Preferences are updated in customer record

### 19.3 Expected Outcome

The overall validation confirms that the project successfully performs the main functions of a bus booking platform.

---

## 20. Challenges Faced

During development, several practical challenges were encountered:

- Managing communication between multiple Angular components
- Preserving booking state through different pages
- Integrating secure Google credential verification
- Handling payment gateway logic on the server side
- Avoiding duplicate bookings after payment confirmation
- Designing notification preferences and multi-channel delivery
- Structuring route search when full production data is not available
- Coordinating real-time notifications with stored notification history
- Supporting multiple languages across UI labels

These challenges helped strengthen understanding of real-world software integration.

---

## 21. Limitations

Although the project is feature-rich, it still has some limitations:

- No full production deployment configuration is included
- Google Maps integration requires a valid API key
- Payment gateways require valid secret keys to operate
- Some admin-style actions are embedded in utility screens rather than a separate admin dashboard
- Demo route fallback is used for limited city combinations
- Advanced refund and coupon systems are not fully implemented
- Test coverage can be expanded further
- Role-based access control can be made more granular

---

## 22. Future Enhancements

The project can be extended in several ways:

- Add a dedicated admin dashboard for route, bus, and booking management
- Add email OTP or phone verification
- Add refund automation and cancellation policies
- Add live bus tracking with actual GPS integration
- Add downloadable ticket PDF generation with QR code
- Add analytics dashboard for booking insights
- Add coupon engine and loyalty points
- Add wallet and saved payment methods
- Add role-based permissions for admin, operator, and customer
- Add cloud deployment with CI/CD pipeline
- Improve automated test coverage using unit and integration tests
- Add native mobile app version in future

---

## 23. Conclusion

The **RedBus Clone Using MEAN Stack** project successfully demonstrates the design and implementation of a modern online bus booking platform using a full stack JavaScript architecture. The application is not limited to basic reservation tasks; rather, it includes a wide set of practical features such as route search, seat booking, payment gateway integration, user profile management, real-time and push notifications, reviews, community interaction, route planning, and localization.

From an academic perspective, the project provides a strong understanding of frontend-backend integration, REST API design, NoSQL data modeling, secure authentication, payment handling, and modular application structure. From a practical perspective, it reflects many of the requirements expected in real travel-tech systems.

The project proves that the MEAN stack can be effectively used to build scalable, interactive, and maintainable web applications. It also opens opportunities for future enhancements such as deployment, analytics, live tracking, and deeper administrative control. Overall, the project fulfills its objectives and serves as a strong demonstration of modern full stack development skills.

---

## 24. References

1. Angular Official Documentation  
2. Node.js Official Documentation  
3. Express.js Documentation  
4. MongoDB Documentation  
5. Mongoose Documentation  
6. Stripe API Documentation  
7. Razorpay Developer Documentation  
8. Socket.IO Documentation  
9. Google Identity Services Documentation  
10. MDN Web Docs for Service Workers and Notifications

---

## 25. Appendix

### Appendix A: Important Frontend Routes

- `/`
- `/select-bus`
- `/payment`
- `/profile`
- `/seat-layout/:busId`
- `/booking-success`
- `/passenger-details`
- `/community`
- `/notifications`
- `/settings/notifications`
- `/route-planner`

### Appendix B: Important Backend API Groups

- `/api/routes`
- `/api/bookings`
- `/api/customer`
- `/api/bus`
- `/api/payments`
- `/api/posts`
- `/api/reviews`
- `/api/notifications`

### Appendix C: Key Features Summary

- Bus route search
- Bus listing
- Seat layout
- Passenger details
- Booking flow
- Stripe payment
- Razorpay payment
- Google login
- JWT auth
- User profile and trip history
- Community posts
- Review system
- Notification settings
- Browser push notifications
- Socket.IO real-time notifications
- Route planner
- English and Hindi translation support

### Appendix D: Suggested Screenshot Pages for Final 40-Page Report

To comfortably extend this draft into a 40-page final academic report in MS Word, insert screenshots for:

- Home page
- Search page
- Bus results page
- Seat selection page
- Passenger details page
- Payment page
- Payment success page
- Profile page
- My trips page
- Community page
- Notifications page
- Notification settings page
- Route planner page
- MongoDB collections
- Backend folder structure
- Frontend folder structure
- API testing screenshots from Postman

### Appendix E: Suggested Chapter Expansion Strategy

If your college strictly requires 40 pages, use this structure:

- 3 to 4 pages for preliminary sections
- 2 pages for abstract and introduction
- 3 pages for problem, objectives, and scope
- 4 pages for literature / existing vs proposed system
- 5 pages for requirement analysis and technology stack
- 5 pages for system architecture and database design
- 8 pages for frontend and backend module explanation
- 3 pages for security, payment, and notifications
- 3 pages for testing and screenshots
- 2 pages for challenges, limitations, future scope, and conclusion

This draft already gives the full written base. By adding diagrams, screenshots, tables, and formatting, it can be expanded into a complete 40-page submission.

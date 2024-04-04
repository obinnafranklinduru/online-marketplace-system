# Online Marketplace Backend System

The Online Marketplace Backend System is designed to power a dynamic online marketplace similar to e-Bay, enabling seamless buying and selling experiences for users. With robust features and secure transaction handling, the APIs facilitate the listing, searching, and purchasing of both new and used products within specified price ranges.

## Installation

1. **Clone the repository**: `git clone https://github.com/obinnafranklinduru/online-marketplace-system`
2. **Change directory to weblify**: `cd online-marketplace-system`
3. To **Install dependencies**, change the directory to any of the services (e.g., user-service, product-service) and run the following command:`npm install`

## Features

- **Users Authentication with JSON Web Token (JWT)**: Implements secure authentication using JWT for user sessions.
- **Seller can list and sell products online**: Enables sellers to create listings for products they want to sell on the platform.
- **Buyer can purchase products online**: Allows buyers to search for products and make purchases securely.
- **Consumer-to-Consumer Transactions**: Facilitates transactions directly between consumers, ensuring a seamless buying and selling process.
- **Commission on Transactions**: Charges a commission percentage on the final transaction amount to support platform maintenance.
- **Notification System for Buyer-Seller Collaboration**: Provides a communication channel for buyers and sellers to interact and collaborate during transactions.

## Technologies Used

- **Node.js**: JavaScript runtime for building scalable server-side applications.
- **AWS Services**: Utilized for cloud infrastructure and services such as storage and computing.
- **MongoDB**: NoSQL database for storing flexible and scalable data.
- **PostgreSQL**: Relational database for structured data storage.
- **Docker**: Containerization platform for packaging and deploying applications.
- **Serverless Framework**: Facilitates building and deploying serverless applications.
- **JSON Web Tokens (JWT) and other npm packages**: Used for secure authentication and other functionalities.

## System Design

Visit [Online Marketplace Backend System Design](https://whimsical.com/online-marketplace-backend-system-DN3Zx7CVwf3wsJMykHhQRf) for an overview of the system architecture.

## Testing the API / API Documentation

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/26953456-4355446d-7fc7-4dac-93a8-6e1bb988f1fb?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D26953456-4355446d-7fc7-4dac-93a8-6e1bb988f1fb%26entityType%3Dcollection%26workspaceId%3D10d8b463-5508-49dc-a8fe-22656823b466)

## Error Handling

The API handles errors by returning appropriate HTTP status codes and error messages in JSON format. Common error scenarios include invalid requests, unauthorized access, and internal server errors.

## License

This project is licensed under the [MIT License](https://github.com/obinnafranklinduru/online-marketplace-system/blob/master/LICENSE).

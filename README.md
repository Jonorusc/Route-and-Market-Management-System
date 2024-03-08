# Route and Market Management System

## Project Description

This project is a route and market management system with distinct areas for administrators and promoters. The application enables the creation, editing, and visualization of markets, routes, products, and promoters, with specific functionalities for each user type.

## System Requirements

### Administrator Area

#### Markets: (/) - home

- Search for markets.
- Add a market with a modal form.
- View on the map with Pins representing registered markets.
- Details of the market when clicking on the Pin.
- Add the market to a new route when clicking on "Add to Route."
- Edit market data when clicking on "Edit."

#### Routes: (/rotas) 

- Horizontal list of promoters.
- View routes of a promoter by clicking on their name.
- Details of the markets in the route when clicking the down arrow.

`Promoters have got a different view of the 'route' route`

#### Products: (/produtos)

- Search for products.
- Add a product with a modal form.
- Edit a product by clicking on the pencil icon.

#### Promoters: (/promotores)

- Search for promoters.
- Add a promoter with a modal form.
- Edit a promoter by clicking on the pencil icon.
- Default password for promoters created via API: "123456."

## Installation Instructions

This guide will provide the necessary steps to set up and run the application in your local development environment.

### Prerequisites

Make sure you have the following tools installed on your system:

- [Node.js](https://nodejs.org) - We use Node.js to run the JavaScript code of the application.
- [npm](https://www.npmjs.com/) - JavaScript package manager (usually installed with Node.js).
- [yarn](https://classic.yarnpkg.com/lang/en/docs/install/) - JavaScript package manager.

### Installation Steps

1. **Clone the repository:**

   ```sh
   git clone https://github.com/Jonorusc/code-challenges.git
   cd vue
   cd convicti-companies
   ```

2. **Install dependencies:**

   ```sh
   yarn
   ## OR
   yarn install
   ```

3. **Set up environment variables:**
   Rename the .env.example file to .env and configure the necessary environment variables such as API keys, database settings, etc.

4. **Start the application:**
   ```sh
   yarn dev
   ```
   After loading, the page will automatically open in your default web browser.

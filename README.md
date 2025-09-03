# Conference Room Booking System

A modern, responsive web application for managing conference room bookings in an organization. This application allows users to view room availability, book meeting rooms, and manage their bookings.

## Features

- **Room Management**: View and select from available conference rooms
- **Booking Management**: Create, view, edit, and delete room bookings
- **Calendar Views**: Day, week, and month views for easy scheduling
- **Real-time Updates**: See current and upcoming meetings in real-time
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Accessibility**: High contrast mode, large text mode, and screen reader support

## Technology Stack

- **Frontend**: React, Tailwind CSS, Vite
- **State Management**: React Context API
- **Routing**: React Router
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Testing**: Vitest, React Testing Library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-organization/conference-room-app.git
   cd conference-room-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
conference-room-app/
├── docs/                  # API documentation
├── public/                # Static assets
├── src/
│   ├── components/        # React components
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── models/            # Data models and validation
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main application component
│   ├── index.css          # Global styles
│   └── main.jsx           # Application entry point
├── .gitignore
├── index.html
├── package.json
├── README.md
├── vite.config.js
└── tailwind.config.js
```

## API Documentation

The application uses a RESTful API for data management. The API documentation is available in the following formats:

- [API Documentation (Markdown)](./docs/api.md)
- [API Documentation (Swagger)](./docs/swagger.json)

## Features in Detail

### Room Management

- View all available conference rooms
- Filter rooms by capacity, features, and location
- View room details including equipment and features

### Booking Management

- Create new bookings with title, time, date, and attendees
- Edit existing bookings
- Delete bookings
- View booking details

### Calendar Views

- Day view: Detailed view of bookings for a single day
- Week view: Overview of bookings for a week
- Month view: Calendar view of bookings for a month

### User Authentication

- User registration and login
- User profile management
- Role-based access control (admin, manager, user)

### Accessibility

- High contrast mode for users with visual impairments
- Large text mode for improved readability
- Keyboard navigation support
- Screen reader compatibility

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Lucide Icons](https://lucide.dev/)
- [date-fns](https://date-fns.org/)


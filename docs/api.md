# Conference Room Booking API Documentation

This document provides comprehensive documentation for the Conference Room Booking API. The API allows clients to manage conference rooms, bookings, and user accounts.

## Base URL

```
https://api.conferenceroom.app/v1
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header for protected endpoints:

```
Authorization: Bearer <token>
```

### Authentication Endpoints

#### POST /auth/login

Authenticate a user and get a JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "department": "Engineering",
    "position": "Software Engineer"
  }
}
```

**Status Codes:**
- 200: Success
- 401: Invalid credentials

#### POST /auth/register

Register a new user.

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Smith",
  "department": "Marketing",
  "position": "Marketing Manager"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "email": "newuser@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "user",
    "department": "Marketing",
    "position": "Marketing Manager"
  }
}
```

**Status Codes:**
- 201: Created
- 400: Invalid request
- 409: Email already exists

#### POST /auth/logout

Invalidate the current JWT token.

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized

#### POST /auth/refresh-token

Refresh an expired JWT token.

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized

#### POST /auth/forgot-password

Request a password reset link.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Password reset link sent to your email"
}
```

**Status Codes:**
- 200: Success
- 404: Email not found

#### POST /auth/reset-password

Reset a password using a reset token.

**Request:**
```json
{
  "token": "reset-token",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Password reset successfully"
}
```

**Status Codes:**
- 200: Success
- 400: Invalid token
- 401: Unauthorized

#### POST /auth/change-password

Change the current user's password.

**Request:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Password changed successfully"
}
```

**Status Codes:**
- 200: Success
- 400: Invalid request
- 401: Unauthorized

#### POST /auth/verify-email

Verify a user's email address.

**Request:**
```json
{
  "token": "verification-token"
}
```

**Response:**
```json
{
  "message": "Email verified successfully"
}
```

**Status Codes:**
- 200: Success
- 400: Invalid token
- 401: Unauthorized

## Rooms

### Room Endpoints

#### GET /rooms

Get a list of all rooms.

**Query Parameters:**
- `capacity` (optional): Minimum capacity
- `features` (optional): Comma-separated list of features
- `floor` (optional): Floor number
- `building` (optional): Building name

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Conference Room Alpha",
      "capacity": 12,
      "location": "Main Building, Floor 3",
      "floor": 3,
      "building": "Main Building",
      "features": ["Projector", "Whiteboard", "Video Conference"],
      "equipment": ["TV", "Phone", "HDMI Cable"],
      "isActive": true
    },
    {
      "id": 2,
      "name": "Meeting Room Beta",
      "capacity": 8,
      "location": "Main Building, Floor 2",
      "floor": 2,
      "building": "Main Building",
      "features": ["Whiteboard", "Video Conference"],
      "equipment": ["TV", "Phone"],
      "isActive": true
    }
  ]
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized

#### GET /rooms/{id}

Get details for a specific room.

**Response:**
```json
{
  "data": {
    "id": 1,
    "name": "Conference Room Alpha",
    "capacity": 12,
    "location": "Main Building, Floor 3",
    "floor": 3,
    "building": "Main Building",
    "features": ["Projector", "Whiteboard", "Video Conference"],
    "equipment": ["TV", "Phone", "HDMI Cable"],
    "isActive": true,
    "description": "Large conference room with video conferencing capabilities"
  }
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Room not found

#### POST /rooms

Create a new room (admin only).

**Request:**
```json
{
  "name": "New Conference Room",
  "capacity": 15,
  "location": "Main Building, Floor 4",
  "floor": 4,
  "building": "Main Building",
  "features": ["Projector", "Whiteboard"],
  "equipment": ["TV", "Phone"],
  "description": "New conference room with projector"
}
```

**Response:**
```json
{
  "data": {
    "id": 3,
    "name": "New Conference Room",
    "capacity": 15,
    "location": "Main Building, Floor 4",
    "floor": 4,
    "building": "Main Building",
    "features": ["Projector", "Whiteboard"],
    "equipment": ["TV", "Phone"],
    "isActive": true,
    "description": "New conference room with projector"
  }
}
```

**Status Codes:**
- 201: Created
- 400: Invalid request
- 401: Unauthorized
- 403: Forbidden (not an admin)

#### PUT /rooms/{id}

Update a room (admin only).

**Request:**
```json
{
  "name": "Updated Conference Room",
  "capacity": 20,
  "features": ["Projector", "Whiteboard", "Video Conference", "Catering"]
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "name": "Updated Conference Room",
    "capacity": 20,
    "location": "Main Building, Floor 3",
    "floor": 3,
    "building": "Main Building",
    "features": ["Projector", "Whiteboard", "Video Conference", "Catering"],
    "equipment": ["TV", "Phone", "HDMI Cable"],
    "isActive": true
  }
}
```

**Status Codes:**
- 200: Success
- 400: Invalid request
- 401: Unauthorized
- 403: Forbidden (not an admin)
- 404: Room not found

#### DELETE /rooms/{id}

Delete a room (admin only).

**Response:**
```json
{
  "message": "Room deleted successfully"
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 403: Forbidden (not an admin)
- 404: Room not found

#### GET /rooms/{id}/availability

Check room availability for a specific time period.

**Query Parameters:**
- `date` (required): Date (YYYY-MM-DD)
- `startTime` (required): Start time (HH:MM)
- `endTime` (required): End time (HH:MM)

**Response:**
```json
{
  "data": {
    "isAvailable": true,
    "conflicts": []
  }
}
```

**Status Codes:**
- 200: Success
- 400: Invalid request
- 401: Unauthorized
- 404: Room not found

#### GET /rooms/available

Find available rooms for a specific time period.

**Query Parameters:**
- `date` (required): Date (YYYY-MM-DD)
- `startTime` (required): Start time (HH:MM)
- `endTime` (required): End time (HH:MM)
- `capacity` (optional): Minimum capacity
- `features` (optional): Comma-separated list of features

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Conference Room Alpha",
      "capacity": 12,
      "location": "Main Building, Floor 3",
      "floor": 3,
      "building": "Main Building",
      "features": ["Projector", "Whiteboard", "Video Conference"],
      "equipment": ["TV", "Phone", "HDMI Cable"],
      "isActive": true
    }
  ]
}
```

**Status Codes:**
- 200: Success
- 400: Invalid request
- 401: Unauthorized

#### GET /rooms/{id}/equipment

Get equipment for a specific room.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "TV",
      "description": "65-inch 4K TV"
    },
    {
      "id": 2,
      "name": "Phone",
      "description": "Conference phone with microphone"
    },
    {
      "id": 3,
      "name": "HDMI Cable",
      "description": "HDMI cable for connecting laptops"
    }
  ]
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Room not found

#### GET /rooms/{id}/statistics

Get usage statistics for a specific room (admin only).

**Query Parameters:**
- `startDate` (required): Start date (YYYY-MM-DD)
- `endDate` (required): End date (YYYY-MM-DD)

**Response:**
```json
{
  "data": {
    "totalBookings": 10,
    "totalHours": 15,
    "averageBookingDuration": 90,
    "utilization": 0.75,
    "popularTimes": [
      {
        "hour": 9,
        "count": 5
      },
      {
        "hour": 14,
        "count": 3
      }
    ]
  }
}
```

**Status Codes:**
- 200: Success
- 400: Invalid request
- 401: Unauthorized
- 403: Forbidden (not an admin)
- 404: Room not found

## Bookings

### Booking Endpoints

#### GET /bookings

Get a list of all bookings.

**Query Parameters:**
- `date` (optional): Date (YYYY-MM-DD)
- `roomId` (optional): Room ID
- `userId` (optional): User ID (admin only)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Weekly Team Standup",
      "startTime": "09:00",
      "endTime": "09:30",
      "date": "2023-09-15",
      "organizer": "Sarah Johnson",
      "attendees": 8,
      "roomId": 1,
      "userId": 1,
      "description": "Weekly team standup meeting"
    },
    {
      "id": 2,
      "title": "Product Strategy Review",
      "startTime": "11:00",
      "endTime": "12:00",
      "date": "2023-09-15",
      "organizer": "Mike Chen",
      "attendees": 12,
      "roomId": 1,
      "userId": 2,
      "description": "Quarterly product strategy review"
    }
  ]
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized

#### GET /bookings/{id}

Get details for a specific booking.

**Response:**
```json
{
  "data": {
    "id": 1,
    "title": "Weekly Team Standup",
    "startTime": "09:00",
    "endTime": "09:30",
    "date": "2023-09-15",
    "organizer": "Sarah Johnson",
    "attendees": 8,
    "roomId": 1,
    "userId": 1,
    "description": "Weekly team standup meeting",
    "isRecurring": false,
    "recurrencePattern": null,
    "room": {
      "id": 1,
      "name": "Conference Room Alpha",
      "location": "Main Building, Floor 3"
    }
  }
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Booking not found

#### POST /bookings

Create a new booking.

**Request:**
```json
{
  "title": "New Meeting",
  "startTime": "14:00",
  "endTime": "15:00",
  "date": "2023-09-16",
  "organizer": "John Doe",
  "attendees": 5,
  "roomId": 1,
  "description": "New project kickoff meeting"
}
```

**Response:**
```json
{
  "data": {
    "id": 3,
    "title": "New Meeting",
    "startTime": "14:00",
    "endTime": "15:00",
    "date": "2023-09-16",
    "organizer": "John Doe",
    "attendees": 5,
    "roomId": 1,
    "userId": 1,
    "description": "New project kickoff meeting",
    "isRecurring": false,
    "recurrencePattern": null
  }
}
```

**Status Codes:**
- 201: Created
- 400: Invalid request
- 401: Unauthorized
- 409: Conflict (room already booked)

#### PUT /bookings/{id}

Update a booking.

**Request:**
```json
{
  "title": "Updated Meeting",
  "startTime": "15:00",
  "endTime": "16:00",
  "attendees": 8
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "title": "Updated Meeting",
    "startTime": "15:00",
    "endTime": "16:00",
    "date": "2023-09-15",
    "organizer": "Sarah Johnson",
    "attendees": 8,
    "roomId": 1,
    "userId": 1,
    "description": "Weekly team standup meeting",
    "isRecurring": false,
    "recurrencePattern": null
  }
}
```

**Status Codes:**
- 200: Success
- 400: Invalid request
- 401: Unauthorized
- 403: Forbidden (not the booking owner)
- 404: Booking not found
- 409: Conflict (room already booked)

#### DELETE /bookings/{id}

Delete a booking.

**Response:**
```json
{
  "message": "Booking deleted successfully"
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 403: Forbidden (not the booking owner)
- 404: Booking not found

#### POST /bookings/check-conflicts

Check if a booking conflicts with existing bookings.

**Request:**
```json
{
  "roomId": 1,
  "date": "2023-09-15",
  "startTime": "10:00",
  "endTime": "11:00"
}
```

**Response:**
```json
{
  "data": {
    "hasConflicts": false,
    "conflicts": []
  }
}
```

**Status Codes:**
- 200: Success
- 400: Invalid request
- 401: Unauthorized

#### POST /bookings/recurring

Create a recurring booking.

**Request:**
```json
{
  "booking": {
    "title": "Weekly Team Meeting",
    "startTime": "10:00",
    "endTime": "11:00",
    "date": "2023-09-18",
    "organizer": "John Doe",
    "attendees": 8,
    "roomId": 1,
    "description": "Weekly team sync meeting"
  },
  "recurrence": {
    "frequency": "weekly",
    "interval": 1,
    "daysOfWeek": [1],
    "endDate": "2023-12-31"
  }
}
```

**Response:**
```json
{
  "data": {
    "seriesId": "abc123",
    "bookings": [
      {
        "id": 4,
        "title": "Weekly Team Meeting",
        "startTime": "10:00",
        "endTime": "11:00",
        "date": "2023-09-18",
        "organizer": "John Doe",
        "attendees": 8,
        "roomId": 1,
        "userId": 1,
        "description": "Weekly team sync meeting",
        "isRecurring": true,
        "recurrencePattern": {
          "frequency": "weekly",
          "interval": 1,
          "daysOfWeek": [1],
          "endDate": "2023-12-31"
        }
      },
      {
        "id": 5,
        "title": "Weekly Team Meeting",
        "startTime": "10:00",
        "endTime": "11:00",
        "date": "2023-09-25",
        "organizer": "John Doe",
        "attendees": 8,
        "roomId": 1,
        "userId": 1,
        "description": "Weekly team sync meeting",
        "isRecurring": true,
        "recurrencePattern": {
          "frequency": "weekly",
          "interval": 1,
          "daysOfWeek": [1],
          "endDate": "2023-12-31"
        }
      }
    ]
  }
}
```

**Status Codes:**
- 201: Created
- 400: Invalid request
- 401: Unauthorized
- 409: Conflict (room already booked)

## Users

### User Endpoints

#### GET /users

Get a list of all users (admin only).

**Query Parameters:**
- `role` (optional): Filter by role
- `department` (optional): Filter by department
- `searchTerm` (optional): Search by name or email

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "department": "Engineering",
      "position": "Software Engineer"
    },
    {
      "id": 2,
      "email": "admin@example.com",
      "firstName": "Jane",
      "lastName": "Smith",
      "role": "admin",
      "department": "Management",
      "position": "CTO"
    }
  ]
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 403: Forbidden (not an admin)

#### GET /users/{id}

Get details for a specific user (admin or self).

**Response:**
```json
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "department": "Engineering",
    "position": "Software Engineer",
    "createdAt": "2023-01-15T12:00:00Z",
    "updatedAt": "2023-09-10T15:30:00Z"
  }
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 403: Forbidden (not an admin or self)
- 404: User not found

#### PUT /users/{id}

Update a user (admin or self).

**Request:**
```json
{
  "firstName": "Johnny",
  "lastName": "Doe",
  "department": "Product",
  "position": "Product Manager"
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "Johnny",
    "lastName": "Doe",
    "role": "user",
    "department": "Product",
    "position": "Product Manager"
  }
}
```

**Status Codes:**
- 200: Success
- 400: Invalid request
- 401: Unauthorized
- 403: Forbidden (not an admin or self)
- 404: User not found

#### DELETE /users/{id}

Delete a user (admin only).

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 403: Forbidden (not an admin)
- 404: User not found

#### GET /users/{id}/bookings

Get bookings for a specific user (admin or self).

**Query Parameters:**
- `date` (optional): Filter by date (YYYY-MM-DD)
- `startDate` (optional): Filter by start date (YYYY-MM-DD)
- `endDate` (optional): Filter by end date (YYYY-MM-DD)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Weekly Team Standup",
      "startTime": "09:00",
      "endTime": "09:30",
      "date": "2023-09-15",
      "organizer": "Sarah Johnson",
      "attendees": 8,
      "roomId": 1,
      "userId": 1,
      "description": "Weekly team standup meeting",
      "room": {
        "id": 1,
        "name": "Conference Room Alpha",
        "location": "Main Building, Floor 3"
      }
    }
  ]
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 403: Forbidden (not an admin or self)
- 404: User not found

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "status": 400,
    "details": ["Additional error details"]
  }
}
```

### Common Error Codes

- `INVALID_REQUEST`: Invalid request parameters
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource conflict
- `VALIDATION_ERROR`: Validation error
- `INTERNAL_ERROR`: Internal server error

## Rate Limiting

The API implements rate limiting to prevent abuse. Rate limits are applied per API key or IP address.

**Headers:**
- `X-RateLimit-Limit`: Maximum number of requests allowed in the current period
- `X-RateLimit-Remaining`: Number of requests remaining in the current period
- `X-RateLimit-Reset`: Time when the rate limit will reset (Unix timestamp)

When the rate limit is exceeded, the API returns a 429 Too Many Requests response:

```json
{
  "error": {
    "message": "Rate limit exceeded",
    "code": "RATE_LIMIT_EXCEEDED",
    "status": 429,
    "details": ["Try again in 60 seconds"]
  }
}
```

## Pagination

List endpoints support pagination using the following query parameters:

- `page`: Page number (default: 1)
- `limit`: Number of items per page (default: 10, max: 100)

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

## Filtering and Sorting

List endpoints support filtering and sorting using the following query parameters:

- `sort`: Field to sort by (e.g., `name`, `date`)
- `order`: Sort order (`asc` or `desc`, default: `asc`)
- Various filter parameters specific to each endpoint

## Versioning

The API is versioned using the URL path (e.g., `/v1/rooms`). When a new version is released, the previous version will be maintained for a period of time to allow for migration.

## Webhooks

The API supports webhooks for real-time notifications of events. Webhooks can be configured in the dashboard.

**Events:**
- `booking.created`: A new booking is created
- `booking.updated`: A booking is updated
- `booking.deleted`: A booking is deleted
- `room.created`: A new room is created
- `room.updated`: A room is updated
- `room.deleted`: A room is deleted

**Webhook Payload:**
```json
{
  "event": "booking.created",
  "timestamp": "2023-09-15T12:00:00Z",
  "data": {
    "id": 1,
    "title": "Weekly Team Standup",
    "startTime": "09:00",
    "endTime": "09:30",
    "date": "2023-09-15",
    "organizer": "Sarah Johnson",
    "attendees": 8,
    "roomId": 1,
    "userId": 1
  }
}
```


import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '../Header';

// Mock the current time
const mockDate = new Date('2023-09-15T12:00:00Z');

describe('Header Component', () => {
  it('renders the room name correctly', () => {
    const selectedRoom = {
      name: 'Conference Room Alpha',
      capacity: 12,
      location: 'Main Building, Floor 3'
    };
    
    render(
      <Header
        currentTime={mockDate}
        selectedRoom={selectedRoom}
        viewMode="room"
        setViewMode={vi.fn()}
      />
    );
    
    expect(screen.getByText('Conference Room Alpha')).toBeInTheDocument();
    expect(screen.getByText(/Executive Meeting Space/)).toBeInTheDocument();
    expect(screen.getByText(/Capacity: 12/)).toBeInTheDocument();
  });
  
  it('displays the current time correctly', () => {
    render(
      <Header
        currentTime={mockDate}
        selectedRoom={null}
        viewMode="room"
        setViewMode={vi.fn()}
      />
    );
    
    // Check if the time is displayed (format may vary based on locale)
    expect(screen.getByText(/12:00:00/)).toBeInTheDocument();
    
    // Check if the date is displayed
    expect(screen.getByText(/September 15, 2023/)).toBeInTheDocument();
  });
  
  it('renders without selected room', () => {
    render(
      <Header
        currentTime={mockDate}
        selectedRoom={null}
        viewMode="room"
        setViewMode={vi.fn()}
      />
    );
    
    // Should render a default title
    expect(screen.getByText('Conference Room Booking')).toBeInTheDocument();
  });
});


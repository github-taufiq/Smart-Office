# Smart Office Management System

A comprehensive Smart Office Assistant App for managing attendance, parking, and conference room bookings in an IT office environment. This system provides an integrated solution for modern workplace management with real-time tracking and automated processes.

## 🏢 Overview

The Smart Office Management System is designed to streamline office operations through three core modules:
- **Attendance Management** - Track employee check-ins, check-outs, and work hours
- **Parking Management** - Intelligent parking slot reservation and occupancy system
- **Conference Room Booking** - Meeting room scheduling and availability management

## 🚗 Parking Management Features

### Core Functionality
- **Real-time Slot Monitoring**: View live status of all parking slots (Available, Occupied, Reserved, Out of Order)
- **Smart Reservation System**: Reserve parking slots in advance with automatic timeout
- **User Tracking**: Track which user reserved or occupied each slot
- **Automated Release**: Reservations automatically expire after 1 hour if not occupied
- **IoT Integration Ready**: Support for automatic occupancy detection via IoT sensors

### Parking Slot States
1. **AVAILABLE** 🟢 - Slot is free and can be reserved or occupied
2. **RESERVED** 🔵 - Slot is reserved by a user (1-hour timeout)
3. **OCCUPIED** 🟡 - Slot is currently occupied by a vehicle
4. **OUT_OF_ORDER** ⚫ - Slot is temporarily unavailable

### User Workflow

#### Reserving a Slot
1. User views available parking slots
2. Clicks on an available slot
3. Enters their name to reserve
4. Slot status changes to "RESERVED" with 1-hour expiration
5. User has 1 hour to occupy the slot

#### Occupying a Reserved Slot
1. User arrives at the parking location
2. Clicks on their reserved slot (shows "Check In")
3. Enters license plate number
4. Slot status changes to "OCCUPIED"
5. Reservation timer is cleared

#### Direct Occupancy (Walk-in)
1. User can directly occupy an available slot without prior reservation
2. Enters name and license plate
3. Slot immediately becomes "OCCUPIED"

#### Automatic Cleanup
- Reserved slots automatically become available after 1 hour if not occupied
- Background service runs every 5 minutes to clean up expired reservations
- Users receive notifications about upcoming reservation expiry

### Technical Features
- **Real-time Updates**: Live status updates across all connected devices
- **Conflict Prevention**: Prevents double-booking and slot conflicts
- **User Authentication**: Track reservations and occupancy by user identity
- **License Plate Tracking**: Associate vehicles with parking slots
- **Audit Trail**: Complete history of slot usage and user activities

### API Endpoints
```
GET    /api/parking/slots              - Get all parking slots
POST   /api/parking/slots/{id}/reserve - Reserve a slot
POST   /api/parking/slots/{id}/occupy-reserved - Occupy reserved slot
POST   /api/parking/slots/{id}/occupy-direct - Direct occupancy
POST   /api/parking/slots/{id}/release - Release occupied slot
GET    /api/parking/slots/user/{name}  - Get user's slots
GET    /api/parking/stats/available-count - Get available slot count
```

## 👥 Attendance Management Features

### Core Functionality
- **Employee Check-in/Check-out**: Digital attendance tracking
- **Work Hours Calculation**: Automatic calculation of daily work hours
- **Attendance Reports**: Generate daily, weekly, and monthly reports
- **Late Arrival Tracking**: Monitor and report late arrivals
- **Integration Ready**: Support for biometric and card-based systems

### Features
- Real-time attendance dashboard
- Employee attendance history
- Overtime tracking
- Leave management integration
- Attendance analytics and insights

## 🏛️ Conference Room Management Features

### Core Functionality
- **Room Availability**: Real-time room availability status
- **Meeting Scheduling**: Book rooms for specific time slots
- **Conflict Resolution**: Prevent double-booking of rooms
- **Resource Management**: Track room capacity and equipment
- **Meeting Notifications**: Automated reminders and notifications

### Features
- Interactive room booking calendar
- Room capacity and equipment details
- Recurring meeting support
- Meeting room analytics
- Integration with calendar systems

## 🔧 Admin Dashboard

### User & Role Management
- **User Registration**: Add new users with appropriate roles
- **Role Assignment**: Assign parking privileges based on user type
- **Permission Management**: Modify user access levels
- **Bulk Operations**: Import/export user data with roles
- **User Activity Monitoring**: Track user login patterns and feature usage

### Parking Administration
- **Slot Management**: Add, edit, or remove parking slots
- **Slot Configuration**: Set slot types (Car, Motorcycle, Disabled, Electric Vehicle)
- **Maintenance Mode**: Mark slots as out of order
- **Usage Analytics**: View parking utilization reports by user role
- **Override Controls**: Admin can override any reservation or occupancy
- **Role-based Reports**: Generate reports filtered by user roles
- **Parking Area Management**: Create and manage different parking zones

### Conference Room Administration
- **Room Management**: Add, edit, or remove conference rooms
- **Room Configuration**: Set room capacity, equipment, and amenities
- **Equipment Management**: Track projectors, whiteboards, video conferencing setup
- **Maintenance Scheduling**: Schedule room maintenance and cleaning
- **Booking Policies**: Set booking rules, time limits, and restrictions
- **Room Analytics**: View room utilization and booking patterns
- **Recurring Booking Management**: Handle series bookings and exceptions
- **Room Access Control**: Manage who can book specific rooms

### System Administration
- **Permission Templates**: Create role-based permission templates
- **System Configuration**: Configure timeouts, notifications, role restrictions
- **Reports & Analytics**: Generate comprehensive usage reports with role breakdown
- **Audit Logs**: View system activity with user role information
- **Backup & Maintenance**: System backup and maintenance tools
- **Integration Settings**: Configure external calendar and notification systems
- **Holiday Management**: Set office holidays and special schedules

### Dashboard Features
- **Real-time Monitoring**: Live view of parking and room occupancy
- **Alert Management**: System alerts for maintenance, conflicts, and issues
- **Quick Actions**: Fast access to common administrative tasks
- **Usage Statistics**: Key metrics and KPIs at a glance
- **Notification Center**: Manage system-wide announcements and alerts

# Technical details and architecture:

### Backend (Spring Boot)
```
parking-backend/
├── src/main/java/com/smartoff/
│   ├── model/
│   │   └── ParkingSlot.java    # Slot entity
│   ├── controller/
│   │   └── ParkingController.java # REST endpoints
│   ├── service/
│   │   ├── ParkingService.java    # Business logic
│   │   └── ReservationCleanupService.java # Automated cleanup
│   └── repository/
│       └── ParkingSlotRepository.java # Data access
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Java 11+ and Maven
- MySQL/PostgreSQL database
- Git

### Installation

#### Backend Setup
```bash
cd parking-backend
mvn clean install
mvn spring-boot:run
```

#### Frontend Setup
```bash
cd parking-frontend
npm install
npm start
```

#### Database Setup
```sql
-- Create database
CREATE DATABASE smart_office;

-- Run migrations (handled by Spring Boot)
-- Tables: parking_slots, users, attendance, conference_rooms
```

### Configuration
```properties
# application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/smart_office
spring.datasource.username=your_username
spring.datasource.password=your_password

# Parking configuration
parking.reservation.timeout.minutes=60
parking.cleanup.interval.minutes=5
```

## 📊 Usage Analytics

### Parking Metrics
- **Utilization Rate**: Percentage of slots occupied over time
- **Peak Hours**: Busiest parking times
- **User Patterns**: Frequent users and usage patterns
- **Reservation vs Walk-in**: Ratio of reserved vs direct occupancy

### System Metrics
- **Response Times**: API performance monitoring
- **User Activity**: Login patterns and feature usage
- **Error Rates**: System reliability metrics

## 🔮 Future Enhancements and Road map

### Planned Features
- **Mobile App**: Porting App to Native iOS/Android applications
- **IoT Integration**: Automatic slot detection via sensors
- **Visitor Management**: Guest parking and access control
- **AI Analytics**: Predictive parking availability and alerting discrepency
- **Integration APIs**: Connect with existing office systems

### IoT Integration
- **Sensor Integration**: sensors for automatic detection and reading vehicle number.
- **Real-time Updates**: Instant slot status updates
- **Predictive Analytics**: ML-based availability prediction
- **Smart Notifications**: Proactive user notifications

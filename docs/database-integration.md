# PSU Rizal Academic Collaboration Platform - Database Integration Guide

## Overview

This document details the database integration strategy for the PSU Rizal Academic Collaboration Platform, covering both Supabase cloud integration and NocoDB self-hosted options. It outlines the current implementation, planned integrations, and best practices for maintaining a robust and scalable data layer.

## Database Integration Strategy

### Dual Database Approach
The platform supports both Supabase (cloud Postgres) and NocoDB (self-hosted) integration to provide flexibility for different deployment scenarios:

- **Supabase**: Cloud-based PostgreSQL with authentication, storage, and real-time capabilities
- **NocoDB**: Self-hosted no-code database interface that provides a low-code admin CMS experience

This dual approach allows institutions to choose the solution that best fits their infrastructure, compliance, and scalability requirements.

## Current Database Implementation

### Supabase Integration

#### Client-Side Configuration (`lib/supabase/client.ts`)
- Uses public environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- Provides browser-based access to Supabase features
- Supports authentication and real-time subscriptions

#### Server-Side Configuration (`lib/supabase/server.ts`)
- Uses service role key for authenticated server operations
- Provides admin-level access for server-side operations
- Supports secure data operations without client exposure

#### Database Connection (`lib/db/connection.ts`)
- Uses direct PostgreSQL connection via Drizzle ORM
- Supports optional SSL certificate (prod-ca-2021.crt) for secure connections
- Provides server-side database access with SSL enforcement

#### Environment Variables Used
- Browser-only: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Server-only: `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`, `DATABASE_URL`, `DIRECT_URL`, `SUPABASE_SSL_CERT_PATH`

### SSL Configuration
- File: `prod-ca-2021.crt` at repository root
- Set `sslmode=require` in `DATABASE_URL` and set `SUPABASE_SSL_CERT_PATH`
- Server DB client reads the CA and enables strict SSL

### Local Development Stack
- Compose file: `scripts/docker-compose.local.yml`
- Commands (package.json):
  - `pnpm run db:up` → start local Postgres + NocoDB
  - `pnpm run db:down` → stop stack
  - `pnpm run db:logs` → follow logs
  - `pnpm run init-db` → placeholder for schema migrations

## Planned Database Integrations

### 1. Supabase Integration Completion

#### Authentication Setup
- Implement full Supabase authentication flows
- Integrate user roles (admin, faculty, student) with Supabase auth
- Create profile management system connected to auth users
- Implement OAuth providers and social login options

#### Real-time Features
- Enable real-time meeting data synchronization
- Implement collaborative document editing capabilities
- Add live notifications and messaging systems
- Create real-time dashboard updates

#### Storage Implementation
- User profile image storage
- Meeting recording storage
- Document and file sharing capabilities
- Media content management

#### Edge Functions
- Serverless functions for complex operations
- Data processing and analytics
- Integration with external APIs
- Custom business logic implementation

### 2. NocoDB Integration Planning

#### Admin CMS Functionality
- Thin internal API bridge to avoid coupling UI directly to NocoDB
- Admin interface for content management
- User management and role assignment
- Meeting and schedule management

#### Data Synchronization
- Plan for synchronization between Supabase and NocoDB if both are used
- Define clear data ownership and update protocols
- Ensure consistency across both systems
- Handle offline scenarios and conflict resolution

## Database Schema Design

### Core Entities

#### Users Table
- userId (Primary Key, UUID)
- email (Unique, String)
- password_hash (String)
- user_type (Enum: 'admin', 'faculty', 'student')
- first_name (String)
- last_name (String)
- created_at (Timestamp)
- updated_at (Timestamp)
- is_active (Boolean)

#### Meetings Table
- meeting_id (Primary Key, UUID)
- title (String)
- description (Text)
- host_id (Foreign Key, UUID)
- start_time (Timestamp)
- end_time (Timestamp)
- meeting_url (String)
- created_at (Timestamp)
- updated_at (Timestamp)
- is_active (Boolean)

#### Meeting Participants Table
- participant_id (Primary Key, UUID)
- meeting_id (Foreign Key, UUID)
- user_id (Foreign Key, UUID)
- joined_at (Timestamp)
- left_at (Timestamp)
- is_host (Boolean)
- role (Enum: 'host', 'participant', 'guest')

#### Notifications Table
- notification_id (Primary Key, UUID)
- user_id (Foreign Key, UUID)
- title (String)
- message (Text)
- type (Enum: 'meeting', 'system', 'academic')
- is_read (Boolean)
- created_at (Timestamp)

## ORM and Query Patterns

### Drizzle ORM Usage
```typescript
// Example query pattern
import { eq } from 'drizzle-orm'
import { users } from './schema'

const getUser = async (userId: string) => {
  const db = await getDatabaseConnection()
  return db.select().from(users).where(eq(users.id, userId)).get()
}
```

### TypeScript Type Safety
- All database operations use TypeScript interfaces
- Schema definitions with proper typing
- Validation at compile time
- Error handling with specific types

### Connection Management
- Connection pooling for performance
- Proper disconnection handling
- Error recovery strategies
- SSL certificate validation

## Security Considerations

### Data Protection
- All sensitive data encrypted at rest and in transit
- JWT tokens with proper expiration and refresh
- Role-based access control at database level
- Input sanitization and validation

### Access Control
- Row-level security where appropriate
- Column-level permissions
- Audit logging for sensitive operations
- IP-based access restrictions

### Authentication Integration
- JWT verification in middleware
- Session management
- Token rotation and invalidation
- Secure password handling with bcrypt

## Performance Optimization

### Database Queries
- Proper indexing strategies
- Query optimization techniques
- Connection pooling
- Caching strategies for frequently accessed data

### Data Relationships
- Efficient join strategies
- Normalized schema design
- Proper foreign key constraints
- Eager vs. lazy loading considerations

### Monitoring and Maintenance
- Query performance monitoring
- Database connection monitoring
- Regular maintenance tasks
- Backup and recovery procedures

## Migration Strategy

### Schema Management
- Drizzle Kit for schema generation
- Version-controlled migration files
- Automated deployment pipelines
- Rollback capabilities

### Data Migration
- Support for zero-downtime deployments
- Data transformation during migrations
- Consistency checks across environments
- Backup preservation during updates

## Testing Strategy

### Database Testing
- Unit tests for individual queries
- Integration tests for complex operations
- Mock database for testing environments
- Performance testing for critical paths

### Security Testing
- Injection attack prevention
- Authorization validation
- Data integrity checks
- Access control verification

## Deployment Considerations

### Environment-Specific Configurations
- Production: Full security and SSL requirements
- Staging: Similar to production with test data
- Development: Local or testing database
- Continuous Integration: In-memory databases for speed

### Scaling Patterns
- Read replica configuration
- Connection optimization
- Caching layer integration
- Load balancing strategies

## Error Handling

### Database Errors
- Connection failure handling
- Query timeout management
- Constraint violation responses
- Service unavailability patterns

### Recovery Procedures
- Automatic retry mechanisms
- Circuit breaker patterns
- Graceful degradation options
- Fallback system implementations

## Monitoring and Observability

### Database Metrics
- Query performance tracking
- Connection pool utilization
- Error rate monitoring
- Slow query identification

### Logging
- Structured log formats
- Sensitive data filtering
- Audit trail maintenance
- Performance correlation

## Compliance and Privacy

### Data Protection
- GDPR compliance features
- Data retention policies
- User consent mechanisms
- Right to be forgotten implementation

### Academic Privacy
- FERPA compliance considerations
- Student data protection
- Faculty information security
- Research data handling

## Future Enhancements

### Advanced Features
- Full-text search capabilities
- Complex analytics queries
- Machine learning model integration
- Real-time data streaming

### Scalability Improvements
- Horizontal scaling strategies
- Database sharding options
- Multi-region deployment
- Read-write separation

### Integration Expansions
- Third-party academic systems
- Learning management integrations
- Research collaboration tools
- Administrative system connections

This comprehensive database integration guide provides the foundation for implementing robust, secure, and scalable data management in the PSU Rizal Academic Collaboration Platform. It covers both immediate implementation needs and long-term expansion strategies while maintaining focus on academic privacy and compliance requirements.
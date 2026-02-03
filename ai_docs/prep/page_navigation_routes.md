## Page Navigation Routes

### App Structure & Routing

#### Public Routes (Unauthenticated)
- `/` - Landing page with features, pricing, and CTA
- `/login` - Sign in page with Supabase Auth (Google, GitHub, email)
- `/signup` - Sign up page with account creation
- `/pricing` - Pricing plans and billing information
- `/terms` - Terms of service
- `/privacy` - Privacy policy
- `/cookies` - Cookie policy

#### Protected Routes (Authenticated Users)

##### Main Application
- `/inbox` - **Primary inbox view** (default after login)
  - Unified message list from all connected platforms
  - Real-time updates via Supabase WebSockets
  - Message filtering and search
  - Draft status indicators

- `/inbox/[messageId]` - **Message detail view**
  - Individual message with full context
  - AI-generated draft response
  - Cursor-like editing interface
  - Send/edit controls

##### Platform Management
- `/platforms` - **Connected platforms overview**
  - Gmail connection status
  - YouTube channel connections
  - Platform-specific settings
  - OAuth connection management

- `/platforms/gmail` - **Gmail integration settings**
  - Account connection/disconnection
  - Label and folder preferences
  - Polling frequency settings

- `/platforms/youtube` - **YouTube integration settings**
  - Channel management
  - Comment monitoring preferences
  - Response automation rules

##### Agent Configuration
- `/agent` - **Agent settings and training**
  - Communication style preferences
  - Response templates and rules
  - Memory management
  - Model selection (OpenRouter)

- `/agent/memories` - **Agent memory management**
  - Add/edit agent memories
  - Knowledge base entries
  - Context preferences

- `/agent/rules` - **Response rules and guidelines**
  - Platform-specific rules
  - Urgency handling preferences
  - Auto-categorization settings

##### User Account
- `/profile` - **User profile management**
  - Account information
  - Notification preferences
  - Connected accounts

- `/profile/billing` - **Billing and subscription**
  - Current plan details
  - Usage statistics
  - Payment method management
  - Billing history

- `/profile/security` - **Security settings**
  - Password management
  - Two-factor authentication
  - Connected OAuth apps
  - API access tokens

##### Analytics & History
- `/history` - **Message and response history**
  - Past conversations
  - Response analytics
  - Performance metrics

- `/analytics` - **Usage analytics**
  - Response time metrics
  - Platform usage statistics
  - Agent performance insights

#### API Routes (Next.js API)

##### Authentication
- `/api/auth/[...nextauth]` - NextAuth.js handlers
- `/api/auth/callback/[provider]` - OAuth callbacks

##### Platform Integration
- `/api/platforms/gmail/connect` - Gmail OAuth flow
- `/api/platforms/gmail/webhook` - Gmail push notifications
- `/api/platforms/youtube/connect` - YouTube OAuth flow
- `/api/platforms/youtube/webhook` - YouTube notifications

##### Agent Communication
- `/api/agent/process` - Trigger agent processing
- `/api/agent/chat` - Chat interface with agent
- `/api/agent/settings` - Agent configuration management

##### Real-time
- `/api/realtime/messages` - WebSocket endpoint for real-time updates
- `/api/realtime/status` - Agent processing status updates

#### Mobile-Responsive Design

All routes are designed with mobile-first responsive design:
- **Desktop**: Full feature set with sidebar navigation
- **Tablet**: Collapsible navigation with main content focus
- **Mobile**: Bottom tab navigation with optimized touch interfaces

#### Navigation Components

##### Main Navigation (Authenticated)
```
Header: [Logo] [Search] [Notifications] [Profile Avatar]
Sidebar: 
  - 📥 Inbox (with unread count)
  - 🔗 Platforms
  - 🤖 Agent Settings
  - 📊 Analytics
  - ⚙️ Profile
```

##### Mobile Navigation
```
Bottom Tabs:
  - 📥 Inbox
  - 🔗 Platforms  
  - 🤖 Agent
  - 👤 Profile
```

#### Route Protection & Middleware

- **Public routes**: Accessible without authentication
- **Protected routes**: Require Supabase authentication
- **Admin routes**: Reserved for future admin functionality
- **API protection**: Rate limiting and authentication checks
- **Platform routes**: Additional checks for connected accounts

#### URL Structure Examples

```
/ (landing)
/login
/inbox
/inbox/msg_123abc
/platforms
/platforms/gmail
/agent
/agent/memories
/profile
/profile/billing
/history
/analytics
```

#### Future Route Considerations

- `/team` - Team management (for future team features)
- `/integrations` - Additional platform integrations
- `/automation` - Advanced automation rules
- `/reports` - Detailed reporting and exports
- `/admin` - Administrative interface (if needed)

This routing structure supports the core user journey from onboarding through competitor analysis research while providing clear paths for configuration and optimization.

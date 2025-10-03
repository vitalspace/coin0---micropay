# Messaging System Implementation Plan

## Overview
Implement a messaging system that allows communication between campaign creators and buyers after transactions are completed.

## Current System Analysis
- **Memo System**: Exists for transaction-related messages (donation/purchase memos)
- **Storage**: MongoDB with Mongoose
- **Frontend**: Svelte with TypeScript
- **Backend**: Elysia.js with TypeScript

## Required Changes

### Backend Changes

#### 1. Database Model (`backend/src/models/campaigns.model.ts`)
- Add `Message` interface and schema for conversations
- Fields: sender_address, receiver_address, campaign_id, message, isRead, createdAt

#### 2. Types (`backend/src/types/types.d.ts`)
- Add `IMessageData` interface

#### 3. Routes (`backend/src/routes/campaigns.routes.ts`)
- Add message routes: create, get conversation, get user messages, mark as read

#### 4. Controllers (`backend/src/controllers/campaigns.controller.ts`)
- Add message controller functions: createMessage, getConversation, getUserMessages, markMessageAsRead

### Frontend Changes

#### 5. Types (`frontend/src/types/types.d.ts`)
- Add Message interface

#### 6. API Services (`frontend/src/services/api.services.ts`)
- Add message API functions

#### 7. Dashboard (`frontend/src/pages/Dashboard.svelte`)
- Add Messages tab to navigation
- Import and display Messages component

#### 8. Messages Component (`frontend/src/components/dashboard/Messages/Messages.svelte`)
- Display list of conversations
- Show message threads
- Allow sending new messages

#### 9. Campaign Page (`frontend/src/pages/Campaign.svelte`)
- Add "Contact Creator" button after successful transactions
- Show button for business/product purchases

#### 10. Message Modal (`frontend/src/components/ui/MessageModal.svelte`)
- Modal for composing and sending messages
- Pre-populate with campaign context

## Implementation Steps

1. **Backend Model & Types**
   - Create Message schema
   - Update types

2. **Backend API**
   - Add message routes
   - Implement controllers

3. **Frontend Types & Services**
   - Update types
   - Add API calls

4. **Dashboard Messages Tab**
   - Add tab navigation
   - Create Messages component

5. **Campaign Contact Button**
   - Add button after transactions
   - Create message modal

6. **Testing**
   - Test message creation
   - Test conversation display
   - Test contact button functionality

## Database Schema for Messages

```typescript
interface IMessage extends Document {
  sender_address: string;
  receiver_address: string;
  campaign_id?: number; // Optional, for campaign-related messages
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## API Endpoints Needed

- `POST /api/v1/messages` - Create message
- `GET /api/v1/messages/conversation/:userAddress` - Get conversation with user
- `GET /api/v1/messages/user` - Get all user conversations
- `PUT /api/v1/messages/:id/read` - Mark message as read

## UI Components Needed

- Messages.svelte - Main messages dashboard
- MessageModal.svelte - Compose message modal
- MessageThread.svelte - Individual conversation view
- MessageItem.svelte - Individual message display
# MicroPay

MicroPay is a decentralized crowdfunding and micropayment platform built on blockchain technology. It enables users to create and support campaigns for donations, businesses, and products on the Aptos blockchain, with additional swap functionality on Ethereum for secure, transparent transactions. Featuring AI-powered tools for campaign optimization and a comprehensive messaging system for user interactions.

## Features

- **Campaign Management**: Create and manage different types of campaigns (donations, business, product) with memos and notes
- **AI-Powered Campaign Enhancement**: Improve campaign titles and descriptions using AI assistance for better engagement
- **User Profiles**: Personalized profiles with avatars, bios, and analytics
- **Dashboard**: Comprehensive dashboard for campaign creators with analytics, donor lists, and withdrawal options
- **Wallet Integration**: Connect Aptos wallets for seamless blockchain interactions
- **3D Visualizations**: Interactive 3D wallet models and charts using Threlte
- **Real-time Analytics**: Income charts, donor rankings, and campaign performance metrics with AI-driven insights
- **Messaging System**: In-app messaging for users to communicate about campaigns and collaborations
- **Withdrawal Management**: Easy and secure withdrawal of campaign funds for creators
- **Swap Functionality**: Integrated token swapping capabilities between Aptos and Ethereum/BSC
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## Tech Stack

### Backend
- **Framework**: Elysia
- **Runtime**: Bun
- **Database**: MongoDB with Mongoose
- **Blockchain**: Aptos SDK (primary for campaigns), Ethers.js for Ethereum swap integration
- **Testing**: Bun test framework

### Frontend
- **Framework**: Svelte 5
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **3D Graphics**: Threlte (Three.js wrapper), Theatre.js for animations
- **Charts**: Chart.js
- **Routing**: Svelte5-router
- **HTTP Client**: Axios
- **Validation**: Zod

### Smart Contracts
- **Aptos**: Move language contracts for campaigns and swaps
- **Ethereum**: Solidity contracts for swaps (swap functionality only)

## Project Structure

```
micropay/
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript type definitions
│   │   └── db/              # Database connection
│   └── package.json
├── frontend/                # Frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API and contract services
│   │   ├── stores/          # Svelte stores
│   │   ├── types/           # TypeScript types
│   │   └── hooks/           # Custom hooks
│   └── package.json
├── contracts/               # Smart contracts
│   ├── aptos/               # Aptos Move contracts
│   │   ├── campaign/        # Campaign-related contracts
│   │   └── swap/            # Swap contracts
│   ├── solidity/            # Ethereum Solidity contracts
│   └── *.move               # Additional Move contracts
└── README.md
```

## Installation

### Prerequisites
- Bun
- MongoDB
- Aptos CLI (for contract deployment)
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd micropay
   ```

2. **Backend Setup**
   ```bash
   cd backend
   bun install
   cp .env.example .env
   # Edit .env with your configuration
   bun run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   bun install
   bun run dev
   ```

4. **Smart Contracts**
   - For Aptos contracts: Navigate to `contracts/aptos/campaign` and follow the Move.toml instructions
   - For Solidity contracts: Use Hardhat or Truffle for deployment

## Environment Variables

### Backend (.env)
```
PORT=4000
ALLOW_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/micropay
APTOS_NODE_URL=https://fullnode.testnet.aptoslabs.com
```

### Frontend
No additional environment variables required for development.

## Usage

1. **Start the backend server**: `cd backend && bun run dev`
2. **Start the frontend**: `cd frontend && bun run dev`
3. **Open your browser**: Navigate to `http://localhost:5173`
4. **Connect wallet**: Use the wallet integration to connect your Aptos wallet
5. **Create campaigns**: Access the dashboard to create and manage campaigns with AI-powered enhancements
6. **Support campaigns**: Browse and donate to campaigns on the platform
7. **Manage funds**: Use the dashboard to withdraw campaign funds securely
8. **Communicate**: Send messages to other users about campaigns and collaborations
9. **Swap tokens**: Use the integrated swap functionality for cross-chain token exchanges

## API Endpoints

### User Management
- `GET /api/v1/users/:address` - Get user profile
- `POST /api/v1/users` - Create/update user profile

### Campaign Management
- `GET /api/v1/campaigns` - Get all campaigns
- `POST /api/v1/campaigns` - Create new campaign
- `GET /api/v1/campaigns/:id` - Get campaign details
- `GET /api/v1/user/campaigns` - Get user's campaigns
- `GET /api/v1/campaign-contract` - Get campaign by contract ID
- `GET /api/v1/campaign/:id/memos` - Get campaign memos
- `POST /api/v1/create-memo` - Create campaign memo
- `POST /api/v1/improve-campaign` - AI-powered campaign improvement

### Messaging
- `POST /api/v1/messages` - Send message
- `GET /api/v1/messages/user` - Get user messages
- `GET /api/v1/messages/conversation/:user1/:user2` - Get conversation between users

## Testing

### Backend
```bash
cd backend
bun run test
bun run test:watch  # For watch mode
```

### Frontend
```bash
cd frontend
bun run check  # Type checking
```

## Deployment

### Backend
The backend can be deployed to any Node.js hosting service like Vercel, Railway, or Heroku.

### Frontend
Build the frontend for production:
```bash
cd frontend
bun run build
bun run preview  # Preview production build
```

Deploy the `dist` folder to services like Vercel, Netlify, or Cloudflare Pages.

### Smart Contracts
- **Aptos**: Deploy using Aptos CLI or through the Aptos Explorer
- **Ethereum**: Deploy using Hardhat, Truffle, or Remix

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Elysia](https://elysiajs.com/) and [Svelte](https://svelte.dev/)
- Blockchain integration powered by [Aptos](https://aptoslabs.com/) and [Ethereum](https://ethereum.org/)
- 3D graphics with [Threlte](https://threlte.xyz/)
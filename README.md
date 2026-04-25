# Enigma Pay

> **Automate Payroll for Your Web3 Team**

Send salaries in seconds, manage teams globally, and track payments transparently on-chain with our multi-send salary smart contract.

![Version](https://img.shields.io/badge/version-v0.4.2-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Solidity](https://img.shields.io/badge/solidity-^0.8.19-blue)
![React](https://img.shields.io/badge/react-19.0.0-cyan)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Smart Contract](#smart-contract)
- [Frontend Application](#frontend-application)
- [Installation](#installation)
- [Usage](#usage)
- [Security Features](#security-features)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Enigma Pay is a decentralized payroll management system designed for Web3 organizations, DAOs, and distributed teams. Built on Ethereum-compatible blockchains, it enables organizations to automate salary distributions, manage employee records on-chain, and execute batch payments with unprecedented efficiency and transparency.

### Key Value Propositions

- **Speed**: Process payroll for hundreds of employees in a single transaction
- **Transparency**: All payments are recorded on-chain with immutable audit trails
- **Global**: No geographic restrictions or banking intermediaries
- **Automation**: Schedule recurring payroll with configurable approval workflows
- **Multi-Token**: Support for native ETH and ERC-20 tokens (USDC, DAI, etc.)

---

## Features

### 🚀 Core Functionality

#### Smart Contract Features
- **Employee Registry**: On-chain storage of employee data with O(1) lookup efficiency
- **Batch Salary Execution**: Gas-optimized multi-send functionality using `call` pattern
- **Access Control**: Owner-only operations with role-based permissions
- **Emergency Withdrawal**: Safety mechanism for contract balance recovery
- **Event Logging**: Comprehensive event emission for off-chain tracking

#### Frontend Features
- **Dashboard**: Real-time analytics on treasury balance, payroll velocity, and active recipients
- **Employee Management**: Add, update, and deactivate team members with wallet integration
- **Batch Payroll**: Selective recipient matrix with dynamic gas estimation
- **Automation Engine**: Schedule-based payroll with weekly/monthly frequency options
- **Multi-Sig Approval**: Configurable consensus requirements for payment execution
- **Transaction History**: Immutable logs with network and status tracking
- **Sandbox Mode**: Testnet support for risk-free experimentation

### 🎨 User Interface Highlights

- **Premium Design System**: Glass-morphism effects, mesh gradients, and smooth animations
- **Responsive Layout**: Mobile-first design with adaptive navigation
- **Dark/Light Theme**: User-selectable themes with persistent preferences
- **Real-time Notifications**: Toast-based feedback for all user actions
- **Interactive Charts**: Recharts-powered visualizations for payroll analytics

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Enigma Pay System                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐         ┌─────────────────────────────┐  │
│  │   React Frontend │◄───────►│    Smart Contract Layer     │  │
│  │                  │         │                             │  │
│  │  - Dashboard     │         │  PayrollManager.sol         │  │
│  │  - Employees     │         │                             │  │
│  │  - BatchPay      │         │  - addEmployee()            │  │
│  │  - Automation    │         │  - removeEmployee()         │  │
│  │  - History       │         │  - executeBatchSalary()     │  │
│  │  - Settings      │         │  - emergencyWithdraw()      │  │
│  └──────────────────┘         └─────────────────────────────┘  │
│           │                              │                      │
│           ▼                              ▼                      │
│  ┌──────────────────┐         ┌─────────────────────────────┐  │
│  │   State Providers│         │      Blockchain Network     │  │
│  │                  │         │                             │  │
│  │  - Web3Provider  │         │  - Ethereum Mainnet         │  │
│  │  - UserProvider  │         │  - Sepolia Testnet          │  │
│  │  - OrgProvider   │         │  - Other EVM Chains         │  │
│  │  - ApprovalProvider│       │                             │  │
│  │  - AutomationProv│         │                             │  │
│  └──────────────────┘         └─────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend Framework** | React 19.0.0 + TypeScript |
| **Build Tool** | Vite 6.2.0 |
| **Styling** | TailwindCSS 4.1.14 |
| **Animations** | Motion (Framer Motion fork) |
| **Charts** | Recharts 3.8.1 |
| **Icons** | Lucide React |
| **Notifications** | Sonner |
| **Smart Contract** | Solidity 0.8.19 |
| **Blockchain** | Ethereum/EVM-compatible |

---

## Smart Contract

### Contract Address

| Network | Address |
|---------|---------|
| Ethereum Mainnet | _Deploy on deployment_ |
| Sepolia Testnet | _Deploy on deployment_ |

### Contract Structure

```solidity
contract PayrollManager {
    // State Variables
    address public owner;
    mapping(address => Employee) public employees;
    address[] public employeeRegistry;
    
    // Structs
    struct Employee {
        address wallet;
        uint256 salary;
        bool isActive;
        string name;
    }
    
    // Events
    event EmployeeAdded(address indexed wallet, string name, uint256 salary);
    event EmployeeRemoved(address indexed wallet);
    event SalaryPaid(address indexed recipient, uint256 amount);
    event BatchExecuted(uint256 totalAmount, uint256 count);
    
    // Functions
    function addEmployee(address _wallet, string memory _name, uint256 _salary) external onlyOwner;
    function removeEmployee(address _wallet) external onlyOwner;
    function executeBatchSalary() external payable onlyOwner;
    function emergencyWithdraw() external onlyOwner;
}
```

### Function Reference

#### `addEmployee(address _wallet, string memory _name, uint256 _salary)`
Adds or updates an employee in the registry.

**Parameters:**
- `_wallet`: Employee's receiving wallet address
- `_name`: Employee's display name
- `_salary`: Salary amount in wei (native token base units)

**Requirements:**
- Caller must be contract owner
- Wallet cannot be zero address
- Salary must be greater than zero

**Emits:** `EmployeeAdded`

---

#### `removeEmployee(address _wallet)`
Deactivates an employee from payroll (soft delete).

**Parameters:**
- `_wallet`: Employee's wallet address to remove

**Requirements:**
- Caller must be contract owner
- Employee must exist and be active

**Emits:** `EmployeeRemoved`

---

#### `executeBatchSalary() external payable`
Distributes salaries to all active employees in a single transaction.

**Requirements:**
- Caller must be contract owner
- `msg.value` must cover total salary requirements

**Gas Optimization:**
- Uses `call` instead of `transfer` to avoid 2300 gas limit
- Implements Checks-Effects-Interactions pattern
- Single iteration for validation, separate for distribution

**Emits:** `SalaryPaid` (per recipient), `BatchExecuted`

---

#### `emergencyWithdraw()`
Allows owner to withdraw any surplus funds from the contract.

**Requirements:**
- Caller must be contract owner

**Security Note:** Use only in emergency situations or for contract cleanup.

---

## Frontend Application

### Project Structure

```
/workspace
├── contracts/
│   └── PayrollManager.sol      # Main smart contract
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx       # Analytics overview
│   │   ├── Employees.tsx       # Employee management
│   │   ├── BatchPay.tsx        # Payroll execution
│   │   ├── Automation.tsx      # Scheduled payroll
│   │   ├── History.tsx         # Transaction logs
│   │   ├── Settings.tsx        # Configuration
│   │   ├── LandingPage.tsx     # Marketing page
│   │   ├── Login.tsx           # Wallet connection
│   │   ├── Sidebar.tsx         # Navigation
│   │   ├── TopBar.tsx          # Header component
│   │   ├── BottomNav.tsx       # Mobile navigation
│   │   ├── ui/                 # Reusable UI components
│   │   └── *Provider.tsx       # Context providers
│   ├── lib/
│   │   └── utils.ts            # Utility functions
│   ├── types.ts                # TypeScript definitions
│   ├── constants.ts            # Mock data & config
│   ├── App.tsx                 # Root component
│   └── main.tsx                # Entry point
├── index.html
├── package.json
└── vite.config.ts
```

### Context Providers

The application uses a layered context architecture:

1. **ThemeProvider**: Manages dark/light mode preferences
2. **Web3Provider**: Handles wallet connection and chain state
3. **UserProvider**: Manages user roles and permissions
4. **OrgProvider**: Organization configuration and tax estimation
5. **ApprovalProvider**: Multi-sig approval workflow
6. **AutomationProvider**: Scheduled payroll configuration
7. **NotificationProvider**: Global notification system

### Permission System

| Permission | Description | Required For |
|------------|-------------|--------------|
| `manage_recipients` | Add/edit employees | Employee management |
| `execute_payroll` | Run batch payments | Payroll execution |
| `edit_automation` | Modify schedules | Automation settings |

---

## Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask or compatible Web3 wallet
- Solidity compiler (for contract development)

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd enigma-pay
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   Create a `.env` file in the root directory:
   ```env
   VITE_CONTRACT_ADDRESS=your_contract_address
   VITE_RPC_URL=https://mainnet.infura.io/v3/your_key
   VITE_CHAIN_ID=1
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build |
| `npm run lint` | TypeScript type checking |
| `npm run clean` | Remove build artifacts |

---

## Usage

### Getting Started

1. **Launch the Application**
   - Navigate to the deployed URL or run locally
   - Click "Launch App" or "Try Sandbox" for testnet mode

2. **Connect Wallet**
   - Click "Connect Wallet" in the top-right corner
   - Approve the connection in your Web3 wallet
   - Ensure you're on a supported network

3. **Add Employees**
   - Navigate to "Employees" section
   - Click "Add Member"
   - Enter wallet address, name, and salary
   - Submit transaction to register on-chain

4. **Execute Payroll**
   - Go to "Run Payroll" section
   - Select recipients from the matrix
   - Review total amount and gas estimate
   - Confirm transaction with sufficient ETH

5. **Configure Automation**
   - Access "Automation" tab
   - Set frequency (weekly/monthly)
   - Choose execution day/date
   - Enable autonomous engine

### Sandbox Mode

For testing without real funds:
- Toggle "Sandbox Mode" on login
- Uses testnet tokens with no real value
- Ideal for development and demonstration

---

## Security Features

### Smart Contract Security

1. **Reentrancy Protection**: Uses Checks-Effects-Interactions pattern
2. **Access Control**: `onlyOwner` modifier on sensitive functions
3. **Zero Address Validation**: Prevents invalid employee registrations
4. **Safe Transfer Pattern**: Uses `call` with success checking
5. **Emergency Exit**: Owner can withdraw funds if needed

### Frontend Security

1. **Permission-Based UI**: Role-gated feature access
2. **Input Validation**: Client-side sanitization before submission
3. **Network Detection**: Warns users on testnet networks
4. **Transaction Confirmation**: Multi-step confirmation flows

### Best Practices Implemented

- ✅ No use of `transfer()` (avoids 2300 gas limit issues)
- ✅ Event emission for all state changes
- ✅ Integer overflow protection (Solidity 0.8+)
- ✅ Clear error messages with custom errors
- ✅ Comprehensive input validation

---

## API Reference

### Smart Contract Events

```typescript
interface EmployeeAddedEvent {
  wallet: string;      // indexed
  name: string;
  salary: bigint;
}

interface SalaryPaidEvent {
  recipient: string;   // indexed
  amount: bigint;
}

interface BatchExecutedEvent {
  totalAmount: bigint;
  count: bigint;
}
```

### Frontend Hooks

```typescript
// Web3 Integration
const { currentChain, selectedToken, gasPrice } = useWeb3();

// User Management
const { hasPermission, currentUser, team } = useUser();

// Approval Workflow
const { pendingApprovals, requestApproval, approveRun, executeRun } = useApprovals();

// Automation
const { config, toggleAutomation, setFrequency, simulateTrigger } = useAutomation();
```

---

## Contributing

We welcome contributions from the community! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Standards

- Follow existing code style (Prettier configured)
- Write meaningful commit messages
- Include tests for new features
- Update documentation as needed

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support & Contact

- **Documentation**: [Link to docs]
- **Discord**: [Join our community]
- **Twitter**: [@EnigmaPay]
- **Email**: support@enigmapay.io

---

## Acknowledgments

- Built with ❤️ for the Web3 community
- Inspired by the need for decentralized payroll solutions
- Thanks to all contributors and early adopters

---

*Enigma Pay v0.4.2 - Protocol Active*
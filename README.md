# LockIn - Fitness Staking App

A mobile fitness application that combines workout tracking with Solana blockchain staking, allowing users to earn $LOCKIN tokens by participating in fitness competitions and challenges.

## 💪 App Concept

LockIn revolutionizes fitness motivation by introducing a "stake-to-compete" model where users can:
- Stake $LOCKIN tokens to join fitness competitions
- Earn rewards by completing workout challenges
- Compete in community fitness leagues
- Track and verify workouts using mobile sensors and blockchain timestamps
- Participate in team-based fitness challenges

## 🖥️ Project Overview

### Vision Statement
To create a seamless, engaging fitness ecosystem where users are financially incentivized to stay active and collaborate through blockchain technology.

### Mission
To merge fitness and Web3, fostering healthier lifestyles through gamified challenges and tokenized rewards.

---

## 🚀 Technology Stack

### Frontend
- **[Expo Router](https://docs.expo.dev/router/introduction/):** Navigation management
- **[NativeWind](https://www.nativewind.dev/v4/overview/):** Tailwind-style styling
- **React Native & TypeScript:** Core UI development and type-safe coding practices
- **Device Sensors:** Accelerometer, GPS, and heart rate monitoring for fitness verification

### Backend
- **Node.js with Express:** Backend APIs for challenge management and activity logging
- **MongoDB/Firestore:** Scalable database for user data and challenge history
- **Solana Web3.js:** Blockchain integration for transactions, staking, and token rewards
- **AWS or Google Cloud:** Hosting and scalable infrastructure for backend services

### Blockchain
- **$LOCKIN Token:** SPL token for staking and rewards
- **Solana Program:** Staking pool and competition contract logic

---

## 🛠️ Setup & Installation

### Prerequisites
1. Install [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/).
2. Set up a Solana devnet wallet using [Phantom](https://phantom.app/).

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/jongan69/SolanaDemoMobileApp.git
   ```
2. Install dependencies:
   ```sh
   yarn install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`:
     ```sh
     cp .env.example .env
     ```
   - Update the Solana RPC URL, $LOCKIN token address, and staking pool address.

4. Start the development server:
   ```sh
   npx expo start
   ```

5. Run the blockchain program locally (optional):
   ```sh
   solana-test-validator
   ```

---

## 🗺️ Project Features & Development Roadmap

### 📅 Sprint Breakdown

#### Sprint 1 (Weeks 1-2): Foundation ✅
- Basic app structure with Expo, NativeWind, and navigation setup
- Wallet integration for Solana accounts
- UI design system and folder structuring

#### Sprint 2 (Weeks 3-4): Core Integration 🟡
- Fitness tracking basics: workout logging and motion detection
- Solana network integration: staking, balance display, and basic transactions

#### Sprint 3 (Weeks 5-6): Advanced Features 🔴
- $LOCKIN token staking mechanism
- Competition framework: challenges, leaderboards, and reward logic
- Anti-cheat verification system using sensor data

#### Sprint 4 (Weeks 7-8): Final Polish 🔴
- UI/UX refinements, bug fixes, and accessibility improvements
- Comprehensive security measures and blockchain audits
- App store preparation for iOS and Android

---

## 🏋️ Core Features

1. **Fitness Tracking**
   - Accurate workout logging using device sensors
   - Verification system for motion and location data
   - Personal fitness profile and goal tracking

2. **Blockchain Integration**
   - $LOCKIN token staking and rewards
   - Secure wallet integration with biometric authentication
   - Real-time balance updates and transaction history

3. **Social & Competitive Features**
   - Community fitness challenges and team competitions
   - Leaderboards with real-time updates
   - Achievement badges and milestones

4. **Anti-Cheat Mechanisms**
   - Workout validation using sensor data
   - GPS route tracking and motion analysis
   - Blockchain timestamping for verified activity records

---

## 🔒 Security Considerations

- **Data Encryption:** All sensitive user data is encrypted in transit and at rest.
- **Secure Wallet Management:** Private keys stored securely with biometric authentication.
- **Anti-Cheat System:** Activity patterns analyzed for anomalies to prevent falsified challenges.
- **Transaction Integrity:** Blockchain ensures tamper-proof reward distribution and staking logic.

---

## 📅 Timeline & Milestones

| **Milestone**                 | **Target Completion** | **Status**   |
|-------------------------------|-----------------------|--------------|
| Basic Wallet Integration      | Week 2               | ✅ Complete  |
| Fitness Tracking Fundamentals | Week 4               | 🟡 In Progress |
| Staking Mechanism             | Week 6               | 🔴 Not Started |
| Competition System            | Week 6               | 🔴 Not Started |
| Final Testing & Polish        | Week 8               | 🔴 Not Started |

---

## 📱 Supported Platforms

- **iOS:** Compatible with iOS 13.0+ devices
- **Android:** Compatible with Android 8.0+ devices

---

## 🧪 Testing

### Testing Strategy
- **Unit Tests:** Core functionalities like transaction handling and activity logging.
- **Integration Tests:** Wallet, staking, and fitness tracking workflows.
- **E2E Tests:** Entire user journey from app setup to competition rewards.

### Testing Tools
- Jest (Unit/Integration Testing)
- Detox (E2E Testing for React Native)
- Mocha (Blockchain Contract Testing)

---

## 🤝 Contributing

Contributions are welcome! Follow the steps below:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add some NewFeature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Team

- **Project Manager:** [Insert Name]
- **Lead Developer:** Jonathan Gan
- **Blockchain Developer:** [Insert Name]
- **UI/UX Designer:** [Insert Name]
- **Fitness Consultant:** [Insert Name]

---

## 📞 Contact

For questions or support, please open an issue or contact the project team via email: [your-email@example.com].
```

### Key Enhancements:
1. **Detailed Setup Instructions:** Includes prerequisite installations and environment variable setup.
2. **Expanded Security Section:** Added blockchain-specific considerations.
3. **Feature Roadmap:** Linked core features to timeline milestones.
4. **Testing Details:** Introduced testing strategy and tools.
5. **Team and Contact Info:** Defined team roles and added a contact section.# lockfitApp

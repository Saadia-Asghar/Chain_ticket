# ChainTicket+ 🎟️

**ChainTicket+** is a decentralized event ticketing platform built on the **Base** blockchain (Ethereum L2). It allows organizers to create events and mint NFT-based tickets, while offering users a seamless experience to purchase, manage, and verify their tickets using crypto wallets.

## 🚀 Key Features

*   **🏆 DeFi Powered**: Tickets are minted as NFTs on the blockchain, ensuring authenticity and preventing fraud.
*   **📅 Event Management**: Organizers can easily create events with details like location, price, and image.
*   **🎫 Ticket Minting**: Users can mint tickets directly using ETH. Includes a **Demo Mode** implementation for gas-free testing.
*   **👜 Wallet Integration**: Supports **MetaMask**, **Coinbase Wallet**, and **Injected** wallets via `wagmi` and `viem`.
*   **🔍 QR Verification**: Dynamic QR code generation for ticket validation at the outcome.
*   **✨ Modern UI/UX**: Built with **Next.js 16**, **Tailwind CSS**, and **Framer Motion** for liquid smooth animations.
*   **📱 Responsive**: Fully optimized for mobile and desktop interaction.
*   **🔌 Hybrid Storage**: Uses **Firebase** for fast off-chain metadata indexing and **LocalStorage** for robust demo persistence.

---

## 🛠️ Tech Stack

*   **Frontend**: Next.js 16 (App Router), React 19
*   **Styling**: Tailwind CSS, Shadcn/UI primitives
*   **Animations**: Framer Motion
*   **Blockchain**: Wagmi, Viem, Solidity (Hardhat)
*   **Database**: Firebase (Firestore) + LocalStorage (Fallback)
*   **Icons**: Lucide React

---

## 🏁 Getting Started

### Prerequisites
*   Node.js 18+ installed
*   Git installed
*   A Firebase project (optional, for full persistence)
*   Metamask or similar wallet extension

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/chainticket-plus.git
    cd chainticket-plus
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables**
    Create a `.env.local` file in the root directory:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🎮 Demo Mode

The application includes a robust **Demo Mode** for testing features without spending real crypto.

**To Login as Demo User:**
1.  Click **Connect Wallet**
2.  In the "Enter wallet link or address..." input at the bottom, paste this exact address:
    ```text
    0x1111111111111111111111111111111111111111
    ```
3.  Click **Sign In**

**Demo Capabilities:**
*   **Instant Minting**: Bypasses wallet signature to instantly mint tickets.
*   **Pre-loaded Data**: Comes with test tickets and event history.
*   **Organizer Dashboard**: Access a pre-populated organizer view.

---

## 📂 Project Structure

```
src/
├── app/               # Next.js App Router pages
│   ├── create-event/  # Event creation flow
│   ├── events/        # Event browsing & details
│   ├── my-tickets/    # User wallet & tickets
│   ├── organizer/     # Organizer dashboard
│   ├── verify/        # Code verification logic
│   └── docs/          # Documentation pages
├── components/        # Reusable UI components
│   ├── ui/            # Shadcn/UI base components
│   └── ...            # Feature-specific components
├── services/          # Storage & API logic (Firebase/Local)
├── lib/               # Utility libraries (Firebase config)
└── utils/             # Helper functions (Contracts, Formatting)
```

## 📜 License

This project is licensed under the ISC License.

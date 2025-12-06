// Deployment trigger file
// Last updated: 2025-12-06T16:47:14+05:00
// 
// This file is used to trigger deployments on Vercel
// 
// Changes made:
// - Fixed MetaMask SDK SSR error by deferring wagmi config initialization to client-side
// - Moved createConfig inside Providers component with useMemo
// - Added typeof window check to prevent SSR initialization
// - All wallet connectors now only initialize in the browser
//
// Expected result: Build should complete successfully without TypeError

export const DEPLOYMENT_VERSION = "1.0.1";
export const LAST_FIX = "MetaMask SDK SSR Error - Fixed";

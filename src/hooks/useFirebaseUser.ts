import { useEffect } from 'react';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useMockAccount } from './useMockAccount';

export function useFirebaseUser() {
    const { address, isConnected } = useMockAccount();

    useEffect(() => {
        const syncUser = async () => {
            if (isConnected && address) {
                try {
                    const userRef = doc(db, 'users', address);
                    const userSnap = await getDoc(userRef);

                    if (!userSnap.exists()) {
                        // Create new user
                        await setDoc(userRef, {
                            address: address,
                            createdAt: serverTimestamp(),
                            lastLogin: serverTimestamp(),
                            role: 'user', // Default role
                            tickets: [] // Initialize empty tickets array
                        });
                        console.log("User created in Firebase:", address);
                    } else {
                        // Update last login
                        await setDoc(userRef, {
                            lastLogin: serverTimestamp()
                        }, { merge: true });
                        console.log("User synced to Firebase:", address);
                    }
                } catch (error) {
                    console.error("Error syncing user to Firebase:", error);
                }
            }
        };

        syncUser();
    }, [address, isConnected]);
}

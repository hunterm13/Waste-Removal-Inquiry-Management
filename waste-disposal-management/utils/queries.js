import { doc, getDoc } from 'firebase/firestore';
import { db } from '../src/app/firebaseConfig';

export const getUserFirstName = async (userId) => {
    try {
        const userRef = doc(db, 'Users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            const firstName = userData.firstName;
            return firstName;
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Error retrieving user:', error);
        throw error;
    }
};

import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

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

export const getReportsByUserId = async (userId) => {
    try {
        const reportsRef = collection(db, 'reports');
        const reportsQuery = query(reportsRef, where('userID', '==', userId));
        const querySnapshot = await getDocs(reportsQuery);

        const reports = [];
        querySnapshot.forEach((doc) => {
            reports.push(doc.data());
        });

        return reports;
    } catch (error) {
        console.error('Error retrieving reports:', error);
        throw error;
    }
};

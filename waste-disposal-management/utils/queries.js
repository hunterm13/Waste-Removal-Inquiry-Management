import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { collection, query, where, getDocs, addDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { deleteDoc } from 'firebase/firestore';

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
            const reportData = doc.data();
            const reportWithId = { id: doc.id, ...reportData };
            reports.push(reportWithId);
        });

        return reports;
    } catch (error) {
        console.error('Error retrieving reports:', error);
        throw error;
    }
};

export const fetchUsers = async () => {
    try {
        const usersRef = collection(db, 'Users');
        const usersSnapshot = await getDocs(usersRef);

        const users = [];
        usersSnapshot.forEach((doc) => {
            users.push(doc.data());
        });

        return users;
    } catch (error) {
        console.error('Error retrieving users:', error);
        throw error;
    }
}

export const getAdminStatus = async (userId) => {
    try {
        const userRef = doc(db, 'Users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            const isAdmin = userData.admin;
            console.log('isAdmin:', isAdmin)
            return isAdmin;
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Error retrieving user:', error);
        throw error;
    }
}

export const newReport = async (reportData, newReportType) => {
    console.log('reportData:', reportData);
    console.log('reportType:', newReportType);
    if(newReportType === 'insideSale') {
        try {
            const newReportRef = collection(db, 'reports');
            if (
                !reportData.service ||
                !reportData.workFlow ||
                !reportData.city ||
                !reportData.region ||
                !reportData.siteName ||
                !reportData.siteAddress ||
                !reportData.contactEmail ||
                !reportData.leadChannel ||
                !reportData.leadTag ||
                !reportData.siteNumber ||
                !reportData.howHear
            ) {
                throw new Error('Required fields are missing');
            }
            if (reportData.howHeard === 'Other' && !reportData.otherHowHear) {
                throw new Error('How they heard about us is missing');
            }
            if (reportData.service === 'Roll Off' && !reportData.binSize) {
                throw new Error('Bin size is missing');
            }
            if (reportData.siteNumber) {
                reportData.siteNumber = reportData.siteNumber
                    .split(',')
                    .map((number) => number.trim());
            }
    
            reportData.dateReported = serverTimestamp();

            await addDoc(newReportRef, reportData);
        } catch (error) {
            throw error;
        }
    } else if (newReportType === 'Swap' || newReportType === 'Removal' || newReportType === 'Other'){
        try {
            const newReportRef = collection(db, 'reports');
            if (!reportData.notes) {
                throw new Error('Required fields are missing');
            }    
            if (reportData.siteNumber) {
                reportData.siteNumber = reportData.siteNumber
                    .split(',')
                    .map((number) => number.trim());
            }

            const newReportData = {
                notes: reportData.notes,
                userID: reportData.userID,
                siteNumber: reportData.siteNumber,
                dateReported: serverTimestamp(),
                reportType: newReportType,
            };

            await addDoc(newReportRef, newReportData);

        } catch (error) {
            throw error;
        }
    } else if (newReportType === 'Front Load') {
        try {
            const newReportRef = collection(db, 'reports');
            if (!reportData.notes) {
                throw new Error('Required fields are missing');
            }

            const newReportData = {
                notes: reportData.notes,
                userID: reportData.userID,
                dateReported: serverTimestamp(),
                reportType: newReportType,
            };
            await addDoc(newReportRef, newReportData);

        } catch (error) {
            throw error;
        }
    } else {
        throw new Error('Invalid report type');
    }
};

export const getDailyConversions = async (userID) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reportsRef = collection(db, 'reports');
  const q = query(
    reportsRef,
    where('dateReported', '>=', today),
    where('leadTag', 'in', ['Follow Up', 'Booked']),
    where('userID', '==', userID)
  );

  const querySnapshot = await getDocs(q);
  const dailyConversions = querySnapshot.size;

  return dailyConversions;
};

export const getReportById = async (reportId) => {
    const reportRef = doc(db, 'reports', reportId);
    const reportSnapshot = await getDoc(reportRef);

    if (reportSnapshot.exists()) {
        const reportData = reportSnapshot.data();
        return reportData;
    } else {
        return null;
    }
};

export const deleteReportById = async (reportId) => {
    try {
        const reportRef = doc(db, 'reports', reportId);
        await deleteDoc(reportRef);
    } catch (error) {
        throw error;
    }
};

export const updateReportById = async (reportId, reportData) => {
    if (!reportData.reportType){

    } else if (reportData.reportType === 'Front Load') {
        try {
            const reportRef = doc(db, 'reports', reportId);
            const updatedData = {
              ...reportData,
              dateUpdated: serverTimestamp()
            };
            if (!reportData.notes) {
                throw new Error('Notes are missing');
            }
            await setDoc(reportRef, updatedData, { merge: true });
          } catch (error) {
            throw error;
          }
    } else {
        try {
            const reportRef = doc(db, 'reports', reportId);
            const updatedData = {
              ...reportData,
              dateUpdated: serverTimestamp()
            };
            if (!reportData.notes) {
                throw new Error('Notes are missing');
            } else if (!reportData.siteNumber) {
                throw new Error('Site phone number is missing');
            }
            await setDoc(reportRef, updatedData, { merge: true });
          } catch (error) {
            throw error;
          }
    }
};

export const getUserKpi = async (userID) => {
    const reportsRef = collection(db, 'reports');
    const q = query(
        reportsRef,
        where('userID', '==', userID)
    );

    const querySnapshot = await getDocs(q);
    const totalInquiries = querySnapshot.size;
    const totalConversions = querySnapshot.size - querySnapshot.docs.filter(doc => doc.data().leadTag === 'Follow Up' || !doc.data().leadTag).length;

    return { totalInquiries, totalConversions };
} 

export const getAllUserID = async () => {
    try {
        const usersRef = collection(db, 'Users');
        const usersSnapshot = await getDocs(usersRef);

        const users = [];
        usersSnapshot.forEach((doc) => {
            users.push(doc.id);
        });

        return users;
    } catch (error) {
        console.error('Error retrieving users:', error);
        throw error;
    }
}

export const getUserLastName = async (userId) => {
    try {
        const userRef = doc(db, 'Users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            const lastName = userData.lastName;
            return lastName;
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Error retrieving user:', error);
        throw error;
    }
}
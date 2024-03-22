import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebaseConfig";
import { collection, query, where, getDocs, addDoc, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";
import { deleteDoc } from "firebase/firestore";
import { sendPasswordResetEmail, createUserWithEmailAndPassword } from "firebase/auth";

export const getUserFirstName = async (userId) => {
    try {
        const userRef = doc(db, "Users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            const firstName = userData.firstName;
            return firstName;
        } else {
            throw new Error("User not found");
        }
    } catch (error) {
        console.error("Error retrieving user:", error);
        throw error;
    }
};

export const getReportsByUserId = async (userId) => {
    try {
        const reportsRef = collection(db, "reports");
        const reportsQuery = query(reportsRef, where("userID", "==", userId));
        const querySnapshot = await getDocs(reportsQuery);

        const reports = [];
        querySnapshot.forEach((doc) => {
            const reportData = doc.data();
            const reportWithId = { id: doc.id, ...reportData };
            reports.push(reportWithId);
        });

        return reports;
    } catch (error) {
        console.error("Error retrieving reports:", error);
        throw error;
    }
};

export const fetchUsers = async () => {
    try {
        const usersRef = collection(db, "Users");
        const usersSnapshot = await getDocs(usersRef);

        const users = [];
        usersSnapshot.forEach((doc) => {
            const userData = doc.data();
            const userWithId = { id: doc.id, ...userData };
            users.push(userWithId);
        });

        return users;
    } catch (error) {
        console.error("Error retrieving users:", error);
        throw error;
    }
};

export const getAdminStatus = async (userId) => {
    try {
        const userRef = doc(db, "Users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            const isAdmin = userData.admin;
            return isAdmin;
        } else {
            throw new Error("User not found");
        }
    } catch (error) {
        console.error("Error retrieving user:", error);
        throw error;
    }
};

export const newReport = async (reportData, newReportType) => {
    let firstName = await getUserFirstName(reportData.userID);
    let lastName = await getUserLastName(reportData.userID);
    reportData.userName = `${firstName} ${lastName}`;
    if(newReportType === "insideSale") {
        try {
            const newReportRef = collection(db, "reports");
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
                throw new Error("Required fields are missing");
            }
            if (reportData.howHeard === "Other" && !reportData.otherHowHear) {
                throw new Error("How they heard about us is missing");
            }
            if (reportData.service === "Roll Off" && !reportData.binSize) {
                throw new Error("Bin size is missing");
            }
            if (reportData.siteNumber && reportData.siteNumber.toLowerCase().trim() !== "na") {
                reportData.siteNumber = reportData.siteNumber.replace(/\s/g, "");
            }
    
            reportData.dateReported = serverTimestamp();

            await addDoc(newReportRef, reportData);
        } catch (error) {
            throw error;
        }
    } else if (newReportType === "Swap" || newReportType === "Removal" || newReportType === "Other"){
        try {
            const newReportRef = collection(db, "reports");
            if (!reportData.notes) {
                throw new Error("Required fields are missing");
            }    
            if (reportData.siteNumber && reportData.siteNumber.toLowerCase().trim() !== "na") {
                reportData.siteNumber = reportData.siteNumber.replace(/\s/g, "");
            }

            const newReportData = {
                service: reportData.reportType,
                notes: reportData.notes,
                userID: reportData.userID,
                siteNumber: reportData.siteNumber,
                dateReported: serverTimestamp(),
                reportType: newReportType,
                userName: reportData.userName
            };

            await addDoc(newReportRef, newReportData);

        } catch (error) {
            throw error;
        }
    } else if (newReportType === "Front Load") {
        try {
            const newReportRef = collection(db, "reports");
            if (!reportData.notes) {
                throw new Error("Required fields are missing");
            }

            const newReportData = {
                service: reportData.reportType,
                notes: reportData.notes,
                userID: reportData.userID,
                dateReported: serverTimestamp(),
                reportType: newReportType,
                userName: reportData.userName
            };
            await addDoc(newReportRef, newReportData);

        } catch (error) {
            throw error;
        }
    } else {
        throw new Error("Invalid report type");
    }
};

export const getDailyConversions = async (userID) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reportsRef = collection(db, "reports");
  const q = query(
    reportsRef,
    where("dateReported", ">=", today),
    where("leadTag", "in", ["Follow Up", "Booked"]),
    where("userID", "==", userID)
  );

  const querySnapshot = await getDocs(q);
  const dailyConversions = querySnapshot.size;

  return dailyConversions;
};

export const getReportById = async (reportId) => {
    const reportRef = doc(db, "reports", reportId);
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
        const reportRef = doc(db, "reports", reportId);
        await deleteDoc(reportRef);
    } catch (error) {
        throw error;
    }
};

export const updateReportById = async (reportId, reportData) => {
    if (!reportData.reportType){
        try {
            const reportRef = doc(db, "reports", reportId);
            const updatedData = {
              ...reportData,
              dateUpdated: serverTimestamp()
            };
            if (reportData.howHeard === "Other" && !reportData.otherHowHear) {
                throw new Error("How they heard about us is missing");
            } else if (reportData.service === "Roll Off" && !reportData.binSize) {
                throw new Error("Bin size is missing");
            } else if (!reportData.service || !reportData.workFlow || !reportData.city || !reportData.region || !reportData.siteName || !reportData.siteAddress || !reportData.contactEmail || !reportData.leadChannel || !reportData.leadTag || !reportData.siteNumber || !reportData.howHear) {
                throw new Error("Required fields are missing");
            } else if (!reportData.siteNumber) {
                throw new Error("Phone number is missing");
            } else
            if (reportData.siteNumber && reportData.siteNumber.toLowerCase().trim() !== "na") {
                reportData.siteNumber = reportData.siteNumber.replace(/\s/g, "");
            }
            await setDoc(reportRef, updatedData, { merge: true });
        } catch (error) {
            throw error;
        }
    } else if (reportData.reportType === "Front Load") {
        try {
            const reportRef = doc(db, "reports", reportId);
            const updatedData = {
              ...reportData,
              dateUpdated: serverTimestamp()
            };
            if (!reportData.notes) {
                throw new Error("Notes are missing");
            }
            await setDoc(reportRef, updatedData, { merge: true });
          } catch (error) {
            throw error;
          }
    } else {
        try {
            const reportRef = doc(db, "reports", reportId);
            const updatedData = {
              ...reportData,
              dateUpdated: serverTimestamp()
            };
            if (!reportData.notes) {
                throw new Error("Notes are missing");
            } else if (!reportData.siteNumber) {
                throw new Error("Site phone number is missing");
            }
            if (reportData.siteNumber && reportData.siteNumber.toLowerCase().trim() !== "na") {
                reportData.siteNumber = reportData.siteNumber.replace(/\s/g, "");
            }
            await setDoc(reportRef, updatedData, { merge: true });
          } catch (error) {
            throw error;
          }
    }
};

export const getUserKpi = async (userID, startDate, endDate) => {
    const reportsRef = collection(db, "reports");
    let q = query(
        reportsRef,
        where("userID", "==", userID)
    );

    if (startDate && endDate) {
        const startTimestamp = new Date(startDate);
        startTimestamp.setHours(0, 0, 0, 0);
        const endTimestamp = new Date(endDate);
        endTimestamp.setHours(23, 59, 59, 999);

        q = query(
            reportsRef,
            where("userID", "==", userID),
            where("dateReported", ">=", startTimestamp),
            where("dateReported", "<=", endTimestamp)
        );
    } else if (startDate) {
        const startTimestamp = new Date(startDate);
        startTimestamp.setHours(0, 0, 0, 0);

        q = query(
            reportsRef,
            where("userID", "==", userID),
            where("dateReported", ">=", startTimestamp)
        );
    } else if (endDate) {
        const endTimestamp = new Date(endDate);
        endTimestamp.setHours(23, 59, 59, 999);

        q = query(
            reportsRef,
            where("userID", "==", userID),
            where("dateReported", "<=", endTimestamp)
        );
    }

    const querySnapshot = await getDocs(q);
    const totalInquiries = querySnapshot.size;
    const totalConversions = querySnapshot.size - querySnapshot.docs.filter(doc => doc.data().leadTag === "Lost" || !doc.data().leadTag).length;

    return { totalInquiries, totalConversions };
};

export const getAllUserID = async () => {
    try {
        const usersRef = collection(db, "Users");
        const usersSnapshot = await getDocs(usersRef);
        const users = [];
        usersSnapshot.forEach((doc) => {
            users.push(doc.id);
        });

        return users;
    } catch (error) {
        console.error("Error retrieving users:", error);
        throw error;
    }
};

export const getUserLastName = async (userId) => {
    try {
        const userRef = doc(db, "Users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            const lastName = userData.lastName;
            return lastName;
        } else {
            throw new Error("User not found");
        }
    } catch (error) {
        console.error("Error retrieving user:", error);
        throw error;
    }
};

export const createNewUser = async (userData, password) => {
    if(!userData.email || !userData.firstName || !userData.lastName || !password) {
        throw new Error("Required fields are missing");
    }
    userData.firstName = userData.firstName.trim().charAt(0).toUpperCase() + userData.firstName.trim().slice(1).toLowerCase();
    userData.lastName = userData.lastName.trim().charAt(0).toUpperCase() + userData.lastName.trim().slice(1).toLowerCase();

    try {
        await createUserWithEmailAndPassword(auth, userData.email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                const userRef = collection(db, "Users");
                await setDoc(doc(userRef, user.uid), { ...userData });
            });
    } catch (error) {
        if (error.code === "auth/email-already-in-use") {
            throw new Error("Email is already in use");
        } else {
            throw error;
        }
    }
};

export const disableUser = async (userId) => {
    try {
        const userRef = doc(db, "Users", userId);
        await setDoc(userRef, { active: false }, { merge: true });
    } catch (error) {
        throw error;
    }
};

export const deleteUserByID = async (userId) => {
    try {
        const userRef = doc(db, "Users", userId);
        await deleteDoc(userRef);
    } catch (error) {
        throw error;
    }
};

export const getActiveStatus = async (userId) => {
    try {
        const userRef = doc(db, "Users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            const isActive = userData.active;
            return isActive;
        } else {
            throw new Error("User not found");
        }
    } catch (error) {
        console.error("Error retrieving user:", error);
        throw error;
    }
};

export const getUserDetails = async (userId) => {
    try {
        const userRef = doc(db, "Users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            return userData;
        } else {
            throw new Error("User not found");
        }
    } catch (error) {
        console.error("Error retrieving user:", error);
        throw error;
    }
};

export const enableUserByID = async (userId) => {
    try {
        const userRef = doc(db, "Users", userId);
        await setDoc(userRef, { active: true }, { merge: true });
    } catch (error) {
        throw error;
    }
};

export const disableUserByID = async (userId) => {
    try {
        const userRef = doc(db, "Users", userId);
        await setDoc(userRef, { active: false }, { merge: true });
    } catch (error) {
        throw error;
    }
};

export const getAllReports = async () => {
    try {
        const reportsRef = collection(db, "reports");
        const reportsSnapshot = await getDocs(reportsRef);

        const reports = [];
        reportsSnapshot.forEach((doc) => {
            const reportData = doc.data();
            const reportWithId = { id: doc.id, ...reportData };
            reports.push(reportWithId);
        });
        return reports;
    } catch (error) {
        console.error("Error retrieving reports:", error);
        throw error;
    }
};

//use this only if there are issues with usernames not being added to reports
export const updateReportsWithUserName = async () => {
  try {
    const reports = await getAllReports();

    for (const report of reports) {
      if (!report.userName) {
        const firstName = await getUserFirstName(report.userID);
        const lastName = await getUserLastName(report.userID);
        const userName = `${firstName} ${lastName}`;

        const reportRef = doc(db, "reports", report.id);
        await setDoc(reportRef, { userName }, { merge: true });
      }
    }
    console.log("Reports updated with userName");
  } catch (error) {
    console.error("Error updating reports with userName:", error);
    throw error;
  }
};

export const updateReportsWithService = async () => {
    try {
        const reports = await getAllReports();

        for (const report of reports) {
            if (!report.service) {
                const reportRef = doc(db, "reports", report.id);
                await setDoc(reportRef, { service: report.reportType }, { merge: true });
            }
        }
        console.log("Reports updated with service");
    } catch (error) {
        console.error("Error updating reports with service:", error);
        throw error;
    }
};

//fixes issue with howHear field in reports
export const fixHowHeard = async () => {
    try {
        const reports = await getAllReports();

        reports.forEach(async (report) => {
            const reportRef = doc(db, "reports", report.id);

            if (report.howHear === "kijiiji") {
                await setDoc(reportRef, { howHear: "Kijiji" }, { merge: true });
            } else if (report.howHear === "google") {
                await setDoc(reportRef, { howHear: "Google" }, { merge: true });
            } else if (report.howHear === "other") {
                await setDoc(reportRef, { howHear: "Other" }, { merge: true });
            } else if (report.howHear === "facebook") {
                await setDoc(reportRef, { howHear: "Facebook" }, { merge: true });
            } else if (report.howHear === "word-of-mouth") {
                await setDoc(reportRef, { howHear: "Word of Mouth" }, { merge: true });
            }
        });
    } catch (error) {
        console.error("Error fixing report howHear:", error);
        throw error;
    }
};

export const fixPhoneNumbers = async () => {
    try {
        const reports = await getAllReports();

        reports.forEach(async (report) => {
            const reportRef = doc(db, "reports", report.id);

            if (Array.isArray(report.siteNumber)) {
                const newPhoneNumber = report.siteNumber[0].replace(/\s/g, "");
                await setDoc(reportRef, { siteNumber: newPhoneNumber }, { merge: true });
            }
        });
    } catch (error) {
        console.error("Error fixing phone numbers:", error);
        throw error;
    }
};

export const listAllSiteNumbers = async () => {
    try {
        const reports = await getAllReports();
        const siteNumbers = reports.map(report => report.siteNumber);
        return siteNumbers;
    } catch (error) {
        console.error("Error listing all site numbers:", error);
        throw error;
    }
};

export const fixLeadChannels = async () => {
    try {
        const reports = await getAllReports();

        reports.forEach(async (report) => {
            const reportRef = doc(db, "reports", report.id);

            if (report.leadChannel === "Email") {
                await setDoc(reportRef, { leadChannel: "CMS" }, { merge: true });
            }
        });
    } catch (error) {
        console.error("Error fixing lead channel:", error);
        throw error;
    }
};

const checkDate = async (reportType, reportDate) => {
    try {
        const reportsRef = collection(db, reportType);
        const q = query(reportsRef, where("data.date", "==", reportDate));
        const querySnapshot = await getDocs(q);
        const exists = !querySnapshot.empty;
        return exists;
    } catch (error) {
        console.error("Error checking date: ", error);
        throw error;
    }
}

// used for adding cms, telus, podium, or tower report data
export const addNewReportData = async (reportType, reportData) => {
    try{
        if(reportData.length === 0) {
            throw new Error("No data to upload");
        }
        if(reportType != "tower") {
            checkDate(reportType, reportData.date);
        }
        switch(reportType) {
            case "cms":
                const cmsRef = doc(collection(db, "cms"));
                await setDoc(cmsRef, { data: reportData });
                break;
            case "telus":
                const telusRef = doc(collection(db, "telus"));
                await setDoc(telusRef, { data: reportData });
                break;
            case "podium":
                const podiumRef = doc(collection(db, "podium"));
                await setDoc(podiumRef, { data: reportData });
                break;
            case "tower":
                const towerRef = collection(db, "tower");
                delete reportData.date;
                let promises = [];
                for (const key in reportData) {
                    promises.push(
                        (async () => {
                            const towerQuery = query(
                                towerRef,
                                where("data.orderDate", "==", reportData[key].orderDate),
                                where("data.name", "==", reportData[key].name),
                                where("data.workFlow", "==", reportData[key].workFlow),
                                where("data.siteName", "==", reportData[key].siteName)
                            );

                            const towerSnapshot = await getDocs(towerQuery);

                            if (!towerSnapshot.empty) {
                                const towerData = towerSnapshot.docs[0].data();
                                if (!towerData.data.cancelled && reportData[key].cancelled) {
                                    console.log("Cancelled order found");
                                    await setDoc(towerSnapshot.docs[0].ref, { data: { ...towerData.data, cancelled: true } }, { merge: true });
                                }
                            } else {
                                // Check for duplicates before adding a new document
                                const duplicateQuery = query(towerRef, where("data", "==", reportData[key]));
                                const duplicateSnapshot = await getDocs(duplicateQuery);
                                if (duplicateSnapshot.empty) {
                                    if (["DELIVERRO", "DELPT", "DELFENCING", "SERVICEJR"].includes(reportData[key].workFlow)) {
                                        await addDoc(towerRef, { data: reportData[key] });
                                    }
                                }
                            }
                        })()
                    );
                }

                await Promise.all(promises);
                break;
            default:
                throw new Error("Invalid report type");
        }
    } catch (error) {
        throw error;
    }
};

const getCollectionData = async (collectionName, startDate, endDate) => {
    const ref = collection(db, collectionName); // Use collectionGroup instead of collection
    const queryRef = query(ref, where("data.date", ">=", startDate), where("data.date", "<=", endDate));
    const snapshot = await getDocs(queryRef);
    const data = [];
    snapshot.forEach((doc) => {
        data.push(doc.data());
    });
    return data;
}

const getTowerData = async (startDate, endDate) => {
    // Convert "mm-dd-yyyy" to Excel's date format
    const excelStartDate = (new Date(startDate).getTime() / (24 * 60 * 60 * 1000)) + 25569;
    const excelEndDate = (new Date(endDate).getTime() / (24 * 60 * 60 * 1000)) + 25569 + (1 - 1 / (24 * 60 * 60));

    const ref = collection(db, "tower");
    const queryRef = query(ref, where("data.orderDate", ">=", excelStartDate), where("data.orderDate", "<=", excelEndDate));
    const snapshot = await getDocs(queryRef);
    const data = [];
    snapshot.forEach((doc) => {
        data.push(doc.data());
    });
    return data;
}



export const getConversionData = async (startDate, endDate) => {
    try {
        const conversionData = {
            telusData: await getCollectionData("telus", startDate, endDate),
            podiumData: await getCollectionData("podium", startDate, endDate),            
            cmsData: await getCollectionData("cms", startDate, endDate),
            towerData: await getTowerData(startDate, endDate)
        };
        console.log(conversionData);
        return conversionData;
    } catch (error) {
        console.error("Error retrieving conversion data:", error);
        throw error;
    }
}

export const getReportsByDate = async (startDate, endDate) => {
    try {
        const reportsRef = collection(db, "reports");
        const startTimestamp = Timestamp.fromDate(new Date(startDate));
        const endTimestamp = Timestamp.fromDate(new Date(endDate));

        const q = query(reportsRef, where("dateReported", ">=", startTimestamp), where("dateReported", "<=", endTimestamp));
        const querySnapshot = await getDocs(q);

        const reports = [];
        querySnapshot.forEach((doc) => {
            const reportData = doc.data();
            const reportWithId = { id: doc.id, ...reportData };
            reports.push(reportWithId);
        });

        return reports;
    } catch (error) {
        console.error("Error retrieving reports:", error);
        throw error;
    }
};
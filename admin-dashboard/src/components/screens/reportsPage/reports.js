import React, { useState, useEffect } from 'react';
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "../../../FirebaseConfig";
import Header from '../../header/header';
import styles from './styles';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [hoveredLink, setHoveredLink] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
    
        const reportsCollection = collection(db, 'reports');
        const reportsSnapshot = await getDocs(reportsCollection);

        const reportsData = await Promise.all(
          reportsSnapshot.docs.map(async (docSnapshot) => {
            const report = {
              id: docSnapshot.id,
              ...docSnapshot.data(),
            };

  
            if (report.reportedAccount) {
              try {
           
                const reportedAccountUserDoc = await getDoc(doc(db, 'users', report.reportedAccount));
                if (reportedAccountUserDoc.exists()) {
                  report.reportedAccountName = reportedAccountUserDoc.data().firstName;
                } else {
       
                  const reportedAccountShelterDoc = await getDoc(doc(db, 'shelters', report.reportedAccount));
                  if (reportedAccountShelterDoc.exists()) {
                    report.reportedAccountName = reportedAccountShelterDoc.data().shelterName;
                  } else {
                    report.reportedAccountName = 'Unknown Account';
                  }
                }
              } catch (error) {
                console.error('Error fetching reportedAccount:', error);
                report.reportedAccountName = 'Unknown Account';
              }
            } else {
              report.reportedAccountName = 'N/A';
            }

            if (report.reportedBy) {
              try {
               
                const reportedByUserDoc = await getDoc(doc(db, 'users', report.reportedBy));
                if (reportedByUserDoc.exists()) {
                  report.reportedByName = reportedByUserDoc.data().firstName;
                } else {
                  
                  const reportedByShelterDoc = await getDoc(doc(db, 'shelters', report.reportedBy));
                  if (reportedByShelterDoc.exists()) {
                    report.reportedByName = reportedByShelterDoc.data().shelterName;
                  } else {
                    report.reportedByName = 'Unknown Reporter';
                  }
                }
              } catch (error) {
                console.error('Error fetching reportedBy:', error);
                report.reportedByName = 'Unknown Reporter';
              }
            } else {
              report.reportedByName = 'N/A';
            }

            return report;
          })
        );

        setReports(reportsData);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <h1 style={styles.header}>Reports</h1>
        <ul style={styles.list}>
          {reports.length > 0 ? (
            reports.map((report) => (
              <li key={report.id} style={styles.listItem}>
                <h3 style={styles.subject}>Subject: {report.subject || 'N/A'}</h3>
                <p style={styles.infoText}>Reason: {report.reason || 'N/A'}</p>
                <p style={styles.infoText}>Reported Account: {report.reportedAccountName || 'N/A'}</p>
                <p style={styles.infoText}>Reported By: {report.reportedByName || 'N/A'}</p>
                <p style={styles.infoText}>Status: {report.status || 'N/A'}</p>
                <p style={styles.infoText}>
                  Screenshot: 
                  <a
                    href={report.screenshot || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      ...styles.link,
                      ...(hoveredLink === report.id ? styles.linkHover : {}),
                    }}
                    onMouseEnter={() => setHoveredLink(report.id)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    View Screenshot
                  </a>
                </p>
              </li>
            ))
          ) : (
            <p style={styles.infoText}>No reports available</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Reports;

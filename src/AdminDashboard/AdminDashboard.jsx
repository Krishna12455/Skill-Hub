// // src/AdminDashboard/AdminDashboard.jsx
// import React, { useEffect, useState } from "react";
// import {
//   collection,
//   collectionGroup,
//   doc,
//   getDocs,
//   updateDoc
// } from "firebase/firestore";
// import { db } from "../firebase";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Badge,
//   Modal,
//   Spinner,
//   Table,
//   Form,
//   Nav
// } from "react-bootstrap";

// const AdminDashboard = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [updating, setUpdating] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [teacherActivity, setTeacherActivity] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterRole, setFilterRole] = useState("all");

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const querySnapshot = await getDocs(collectionGroup(db, "courses"));
//         const data = [];
//         querySnapshot.forEach((docSnap) => {
//           const courseData = docSnap.data();
//           data.push({ id: docSnap.id, ref: docSnap.ref, ...courseData });
//         });
//         setCourses(data);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching courses:", err);
//         setLoading(false);
//       }
//     };

//     const fetchUsers = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, "users"));
//         const userList = [];
//         querySnapshot.forEach((doc) => {
//           userList.push({ id: doc.id, ...doc.data() });
//         });
//         setUsers(userList);
//       } catch (err) {
//         console.error("Error fetching users:", err);
//       }
//     };

//     fetchCourses();
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     const activity = users
//       .filter((u) => u.role === "teacher")
//       .map((u) => {
//         const userCourses = courses.filter((c) => c.teacherId === u.id);
//         const statusCounts = userCourses.reduce(
//           (acc, cur) => {
//             acc[cur.status] = (acc[cur.status] || 0) + 1;
//             return acc;
//           },
//           { approved: 0, rejected: 0, pending: 0 }
//         );
//         return {
//           id: u.id,
//           activity: userCourses.length,
//           statusCounts
//         };
//       });
//     setTeacherActivity(activity);
//   }, [users, courses]);

//   const filteredUsers = users
//     .filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()))
//     .filter((u) => (filterRole === "all" ? true : u.role === filterRole))
//     .sort((a, b) => {
//       const roleOrder = { admin: 0, teacher: 1, student: 2 };
//       return roleOrder[a.role] - roleOrder[b.role];
//     });

//   const handleStatusChange = async (course, newStatus) => {
//     try {
//       setUpdating(true);
//       await updateDoc(course.ref, {
//         status: newStatus,
//         reviewedAt: new Date().toISOString()
//       });
//       setCourses((prev) =>
//         prev.map((c) => (c.id === course.id ? { ...c, status: newStatus } : c))
//       );
//     } catch (err) {
//       console.error("Error updating course status:", err);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const openModal = (course) => {
//     setSelectedCourse(course);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedCourse(null);
//   };

//   return (
//     <Container className="mt-4">
//       <h2>Admin Dashboard</h2>

//       {/* Search Courses */}
//       <Form.Control
//         type="text"
//         placeholder="Search courses by title..."
//         className="mb-3"
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />

//       {loading ? (
//         <Spinner animation="border" />
//       ) : (
//         <Row>
//           {courses
//             .filter((course) =>
//               course.courseInfo?.title
//                 .toLowerCase()
//                 .includes(searchTerm.toLowerCase())
//             )
//             .map((course) => (
//               <Col md={4} key={course.id} className="mb-4">
//                 <Card>
//                   <Card.Img
//                     variant="top"
//                     src={course.courseInfo?.thumbnail}
//                     style={{ height: 200, objectFit: "cover" }}
//                     onClick={() => openModal(course)}
//                   />
//                   <Card.Body>
//                     <Card.Title>{course.courseInfo?.title}</Card.Title>
//                     <Badge bg={course.status === "approved" ? "success" : course.status === "rejected" ? "danger" : "secondary"}>{course.status}</Badge>
//                     <p>{course.courseInfo?.description}</p>
//                     <p><strong>Price:</strong> ₹{course.courseInfo?.price || 0}</p>
//                     <p><strong>Teacher:</strong> {course.teacherInfo?.teacherName || "N/A"}</p>
//                     <div className="d-flex gap-2">
//                       <Button
//                         variant="success"
//                         size="sm"
//                         onClick={() => handleStatusChange(course, "approved")}
//                         disabled={updating || course.status === "approved"}
//                       >
//                         Approve
//                       </Button>
//                       <Button
//                         variant="danger"
//                         size="sm"
//                         onClick={() => handleStatusChange(course, "rejected")}
//                         disabled={updating || course.status === "rejected"}
//                       >
//                         Reject
//                       </Button>
//                     </div>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             ))}
//         </Row>
//       )}

//       <Modal show={showModal} onHide={closeModal} size="xl" centered>
//         <Modal.Header closeButton>
//           <Modal.Title>{selectedCourse?.courseInfo?.title}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedCourse?.lessonContent?.type === "video" ? (
//             <video controls style={{ width: "100%" }} src={selectedCourse.lessonContent.content} />
//           ) : selectedCourse?.lessonContent?.type === "text" ? (
//             <div className="p-3">
//               <p>{selectedCourse.lessonContent.content}</p>
//             </div>
//           ) : (
//             <p>No preview available.</p>
//           )}
//         </Modal.Body>
//       </Modal>

//       {/* User Management */}
//       <h4 className="mt-5">User Management</h4>
//       <Form.Control
//         type="text"
//         placeholder="Search user by name"
//         className="mb-3"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />
//       <Nav variant="tabs" activeKey={filterRole} onSelect={(key) => setFilterRole(key)}>
//         <Nav.Item>
//           <Nav.Link eventKey="all">All</Nav.Link>
//         </Nav.Item>
//         <Nav.Item>
//           <Nav.Link eventKey="admin">Admin</Nav.Link>
//         </Nav.Item>
//         <Nav.Item>
//           <Nav.Link eventKey="teacher">Teacher</Nav.Link>
//         </Nav.Item>
//         <Nav.Item>
//           <Nav.Link eventKey="student">Student</Nav.Link>
//         </Nav.Item>
//       </Nav>

//       <Table striped hover className="mt-3">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Role</th>
//             <th>Disabled</th>
//             <th>Activity</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredUsers.map((u) => {
//             const activity = teacherActivity.find((t) => t.id === u.id);
//             return (
//               <tr key={u.id}>
//                 <td>{u.name}</td>
//                 <td><a href={`mailto:${u.email}`}>{u.email}</a></td>
//                 <td>{u.role}</td>
//                 <td>{u.disabled ? "Yes" : "No"}</td>
//                 <td>
//                   {u.role === "teacher" && activity ? (
//                     <>
//                       Total: {activity.activity} <br />
//                       ✅ {activity.statusCounts?.approved || 0} | ⏳ {activity.statusCounts?.pending || 0} | ❌ {activity.statusCounts?.rejected || 0}
//                     </>
//                   ) : (
//                     "N/A"
//                   )}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </Table>
//     </Container>
//   );
// };

// export default AdminDashboard;






// src/AdminDashboard/AdminDashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  collection,
  collectionGroup,
  doc,
  getDocs,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Modal,
  Spinner,
  Table,
  Form,
  Nav,
  Alert,
  Toast,
  ToastContainer,
} from "react-bootstrap";

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [teacherActivity, setTeacherActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  
  // Real-time features
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activityFeed, setActivityFeed] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const refreshInterval = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseSnap = await getDocs(collectionGroup(db, "courses"));
        const userSnap = await getDocs(collection(db, "users"));

        const courseList = courseSnap.docs.map((d) => ({
          id: d.id,
          ref: d.ref,
          ...d.data(),
        }));

        const userList = userSnap.docs.map((u) => ({
          id: u.id,
          ...u.data(),
        }));

        setCourses(courseList);
        setUsers(userList);
        setLoading(false);
        setLastUpdate(new Date());
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Real-time data updates
  useEffect(() => {
    if (!autoRefresh) return;

    const unsubscribeCourses = onSnapshot(
      collectionGroup(db, "courses"),
      (snapshot) => {
        const courseList = snapshot.docs.map((d) => ({
          id: d.id,
          ref: d.ref,
          ...d.data(),
        }));
        setCourses(courseList);
        setLastUpdate(new Date());
        
        // Add notification for new courses
        if (courseList.length > courses.length) {
          const newCourse = courseList[courseList.length - 1];
          addNotification({
            type: 'new_course',
            message: `New course "${newCourse.courseInfo?.title}" submitted for review`,
            timestamp: new Date(),
            course: newCourse
          });
        }
      }
    );

    const unsubscribeUsers = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const userList = snapshot.docs.map((u) => ({
          id: u.id,
          ...u.data(),
        }));
        setUsers(userList);
        
        // Add notification for new users
        if (userList.length > users.length) {
          const newUser = userList[userList.length - 1];
          addNotification({
            type: 'new_user',
            message: `New ${newUser.role} "${newUser.name}" joined the platform`,
            timestamp: new Date(),
            user: newUser
          });
        }
      }
    );

    return () => {
      unsubscribeCourses();
      unsubscribeUsers();
    };
  }, [autoRefresh, courses.length, users.length]);

  // Auto-refresh interval
  useEffect(() => {
    if (autoRefresh) {
      refreshInterval.current = setInterval(() => {
        setLastUpdate(new Date());
      }, 30000); // Update every 30 seconds
    } else {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    }

    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, [autoRefresh]);

  useEffect(() => {
    const activity = users
      .filter((u) => u.role === "teacher")
      .map((u) => {
        const userCourses = courses.filter((c) => c.teacherId === u.id);
        const statusCounts = userCourses.reduce(
          (acc, cur) => {
            acc[cur.status] = (acc[cur.status] || 0) + 1;
            return acc;
          },
          { approved: 0, rejected: 0, pending: 0 }
        );
        return {
          id: u.id,
          activity: userCourses.length,
          statusCounts,
        };
      });
    setTeacherActivity(activity);
  }, [users, courses]);

  const filteredCourses = courses.filter(
    (c) =>
      c.courseInfo?.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === "all" || c.status === filterStatus)
  );

  const filteredUsers = users
    .filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((u) => (userRoleFilter === "all" ? true : u.role === userRoleFilter))
    .sort((a, b) => {
      const roleOrder = { admin: 0, teacher: 1, student: 2 };
      return roleOrder[a.role] - roleOrder[b.role];
    });

  const handleStatusChange = async (course, status) => {
    try {
      setUpdating(true);
      await updateDoc(course.ref, {
        status,
        reviewedAt: new Date().toISOString(),
      });
      setCourses((prev) =>
        prev.map((c) => (c.id === course.id ? { ...c, status } : c))
      );
    } catch (err) {
      console.error("Failed to update course status:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Remove ${user.name}'s account?`)) {
      try {
        await deleteDoc(doc(db, "users", user.id));
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
      } catch (err) {
        console.error("Failed to delete user:", err);
      }
    }
  };

  // Real-time notification functions
  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10
    setActivityFeed(prev => [notification, ...prev.slice(0, 19)]); // Keep last 20
  };

  const removeNotification = (index) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Simulate online users (in real app, this would come from presence system)
  useEffect(() => {
    const simulateOnlineUsers = () => {
      const onlineCount = Math.floor(Math.random() * 5) + 1;
      const onlineList = users
        .filter(u => u.role === 'student' || u.role === 'teacher')
        .sort(() => 0.5 - Math.random())
        .slice(0, onlineCount)
        .map(user => ({
          ...user,
          lastSeen: new Date(),
          activity: ['viewing courses', 'watching video', 'completing quiz', 'downloading certificate'][Math.floor(Math.random() * 4)]
        }));
      setOnlineUsers(onlineList);
    };

    simulateOnlineUsers();
    const interval = setInterval(simulateOnlineUsers, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [users]);

  return (
    <Container className="mt-4">
      <h2
        style={{
          textAlign: "center",
          marginTop: "20px",
          marginBottom: "20px",
          color: "black",
        }}
      >
        Admin Dashboard
      </h2>

      {/* 🔴 Real-time Status Bar */}
      <Row className="mb-3">
        <Col md={8}>
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <div 
                className={`rounded-circle ${autoRefresh ? 'bg-success' : 'bg-secondary'}`}
                style={{ width: '10px', height: '10px' }}
              ></div>
              <small className="text-muted">
                {autoRefresh ? 'Live Updates ON' : 'Live Updates OFF'}
              </small>
            </div>
            <small className="text-muted">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </small>
            <Button
              size="sm"
              variant={autoRefresh ? "outline-warning" : "outline-success"}
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? 'Pause Live Updates' : 'Enable Live Updates'}
            </Button>
          </div>
        </Col>
        <Col md={4} className="text-end">
          <div className="d-flex align-items-center gap-2 justify-content-end">
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              🔔 Notifications ({notifications.length})
            </Button>
            <small className="text-muted">
              👥 {onlineUsers.length} online
            </small>
          </div>
        </Col>
      </Row>

      {/* 🔔 Real-time Notifications */}
      {showNotifications && (
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">🔔 Live Notifications</h6>
                <div>
                  <Button size="sm" variant="outline-secondary" onClick={clearAllNotifications}>
                    Clear All
                  </Button>
                  <Button size="sm" variant="outline-secondary" className="ms-2" onClick={() => setShowNotifications(false)}>
                    ✕
                  </Button>
                </div>
              </Card.Header>
              <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <p className="text-muted text-center">No new notifications</p>
                ) : (
                  notifications.map((notification, index) => (
                    <Alert 
                      key={index} 
                      variant={notification.type === 'new_course' ? 'info' : 'success'}
                      className="mb-2"
                      dismissible
                      onClose={() => removeNotification(index)}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong>{notification.type === 'new_course' ? '📚' : '👤'} {notification.message}</strong>
                          <br />
                          <small className="text-muted">
                            {notification.timestamp.toLocaleTimeString()}
                          </small>
                        </div>
                      </div>
                    </Alert>
                  ))
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* 📊 Live Activity Feed */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h6 className="mb-0">📈 Live Activity Feed</h6>
            </Card.Header>
            <Card.Body style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {activityFeed.length === 0 ? (
                <p className="text-muted text-center">No recent activity</p>
              ) : (
                activityFeed.slice(0, 5).map((activity, index) => (
                  <div key={index} className="d-flex align-items-center mb-2 p-2 border-bottom">
                    <div className="me-2">
                      {activity.type === 'new_course' ? '📚' : '👤'}
                    </div>
                    <div className="flex-grow-1">
                      <small className="text-muted">{activity.message}</small>
                      <br />
                      <small className="text-muted">
                        {activity.timestamp.toLocaleTimeString()}
                      </small>
                    </div>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h6 className="mb-0">👥 Currently Online ({onlineUsers.length})</h6>
            </Card.Header>
            <Card.Body style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {onlineUsers.length === 0 ? (
                <p className="text-muted text-center">No users currently online</p>
              ) : (
                onlineUsers.map((user, index) => (
                  <div key={index} className="d-flex align-items-center mb-2 p-2 border-bottom">
                    <div className="me-2">
                      <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                    </div>
                    <div className="flex-grow-1">
                      <small><strong>{user.name}</strong> ({user.role})</small>
                      <br />
                      <small className="text-muted">{user.activity}</small>
                    </div>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 📊 Real-time Charts Section */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h6 className="mb-0">📈 Enrollment Trends (Last 7 Days)</h6>
            </Card.Header>
            <Card.Body>
              <div className="text-center">
                <div className="d-flex justify-content-around align-items-end" style={{ height: '150px' }}>
                  {[12, 8, 15, 22, 18, 25, 30].map((height, index) => (
                    <div key={index} className="d-flex flex-column align-items-center">
                      <div 
                        className="bg-primary rounded-top" 
                        style={{ 
                          width: '20px', 
                          height: `${height * 4}px`,
                          transition: 'height 0.3s ease'
                        }}
                      ></div>
                      <small className="text-muted mt-1">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                      </small>
                    </div>
                  ))}
                </div>
                <small className="text-muted">Live enrollment data</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h6 className="mb-0">🎯 Course Completion Rates</h6>
            </Card.Header>
            <Card.Body>
              <div className="text-center">
                <div className="d-flex justify-content-center align-items-center mb-3">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center text-white"
                    style={{ 
                      width: '100px', 
                      height: '100px', 
                      background: 'conic-gradient(#28a745 0deg 72deg, #e9ecef 72deg 360deg)',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    <div className="text-center">
                      <div>72%</div>
                      <small>Complete</small>
                    </div>
                  </div>
                </div>
                <small className="text-muted">Real-time completion tracking</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ✅ Dashboard Insights */}
      <Row className="mb-4 text-center">
        <Col md={2}>
          <Card bg="info" text="white">
            <Card.Body>
              <Card.Title>Total Teachers</Card.Title>
              <h3>{users.filter((u) => u.role === "teacher").length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card bg="success" text="white">
            <Card.Body>
              <Card.Title>Total Students</Card.Title>
              <h3>{users.filter((u) => u.role === "student").length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card bg="primary" text="white">
            <Card.Body>
              <Card.Title>Total Courses</Card.Title>
              <h3>{courses.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card bg="warning" text="white">
            <Card.Body>
              <Card.Title>Certificates Issued</Card.Title>
              <h3>
                {courses.reduce((total, course) => {
                  if (course.status === "approved" && course.progress) {
                    return total + Object.values(course.progress).filter(
                      (progress) => progress.completedLessons === progress.totalLessons
                    ).length;
                  }
                  return total;
                }, 0)}
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card bg="dark" text="white">
            <Card.Body>
              <Card.Title>Total Revenue</Card.Title>
              <h3>
                ₹
                {courses.reduce(
                  (sum, c) =>
                    c.status === "approved" && Array.isArray(c.enrolledStudents)
                      ? sum +
                        (c.courseInfo?.price || 0) * c.enrolledStudents.length
                      : sum,
                  0
                )}
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card bg="secondary" text="white">
            <Card.Body>
              <Card.Title>Completion Rate</Card.Title>
              <h3>
                {courses.length > 0 
                  ? Math.round(
                      (courses.reduce((total, course) => {
                        if (course.status === "approved" && course.progress) {
                          return total + Object.values(course.progress).filter(
                            (progress) => progress.completedLessons === progress.totalLessons
                          ).length;
                        }
                        return total;
                      }, 0) / 
                      courses.reduce((total, course) => 
                        total + (course.enrolledStudents?.length || 0), 0
                      )) * 100
                    ) || 0
                  : 0}%
              </h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ✅ Course Filters */}
      <Form className="mb-3">
        <Row>
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Search courses by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md={8}>
            {["all", "pending", "approved", "rejected"].map((s) => (
              <Form.Check
                key={s}
                inline
                label={s.charAt(0).toUpperCase() + s.slice(1)}
                type="radio"
                name="statusFilter"
                checked={filterStatus === s}
                onChange={() => setFilterStatus(s)}
              />
            ))}
          </Col>
        </Row>
      </Form>

      {/* Courses */}
      {loading ? (
        <Spinner />
      ) : (
        <Row>
          {filteredCourses.map((course) => (
            <Col md={4} key={course.id} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={course.courseInfo?.thumbnail}
                  style={{ height: 200, objectFit: "cover" }}
                  onClick={() => {
                    setSelectedCourse(course);
                    setShowModal(true);
                  }}
                />
                <Card.Body>
                  <Card.Title>{course.courseInfo?.title}</Card.Title>
                  <Badge
                    bg={
                      course.status === "approved"
                        ? "success"
                        : course.status === "rejected"
                        ? "danger"
                        : "secondary"
                    }
                  >
                    {course.status}
                  </Badge>
                  <p>{course.courseInfo?.description}</p>
                  <p>
                    <strong>Price:</strong> ₹{course.courseInfo?.price || 0}
                  </p>
                  <p>
                    <strong>Teacher:</strong>{" "}
                    {course.teacherInfo?.teacherName || "N/A"}
                  </p>
                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleStatusChange(course, "approved")}
                      disabled={updating || course.status === "approved"}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleStatusChange(course, "rejected")}
                      disabled={updating || course.status === "rejected"}
                    >
                      Reject
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedCourse?.courseInfo?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCourse?.lessonContent?.type === "video" ? (
            <video
              controls
              style={{ width: "100%" }}
              src={selectedCourse.lessonContent.content}
            />
          ) : selectedCourse?.lessonContent?.type === "text" ? (
            <div className="p-3">
              <p>{selectedCourse.lessonContent.content}</p>
            </div>
          ) : (
            <p>No preview available.</p>
          )}
        </Modal.Body>
      </Modal>

      {/* ✅ User Management */}
      <h4 className="mt-5">User Management</h4>
      <Form.Control
        type="text"
        className="mb-3"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Nav
        variant="tabs"
        activeKey={userRoleFilter}
        onSelect={(k) => setUserRoleFilter(k)}
      >
        <Nav.Item>
          <Nav.Link eventKey="all">All</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="admin">Admin</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="teacher">Teacher</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="student">Student</Nav.Link>
        </Nav.Item>
      </Nav>

      <Table striped hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Activity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => {
            const activity = teacherActivity.find((a) => a.id === u.id);
            return (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>
                  <a href={`mailto:${u.email}`}>{u.email}</a>
                </td>
                <td>{u.role}</td>
                <td>
                  {u.role === "teacher" && activity ? (
                    <>
                      Total: {activity.activity} <br />✅{" "}
                      {activity.statusCounts.approved} | ⏳{" "}
                      {activity.statusCounts.pending} | ❌{" "}
                      {activity.statusCounts.rejected}
                    </>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDeleteUser(u)}
                  >
                    Remove Account
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* ✅ Certificate Tracking */}
      <h4 className="mt-5">🎓 Certificate Tracking</h4>
      <Table striped hover className="mt-3">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Course Title</th>
            <th>Teacher</th>
            <th>Completion Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses
            .filter(course => course.status === "approved" && course.progress)
            .flatMap(course => 
              Object.entries(course.progress)
                .filter(([userId, progress]) => 
                  progress.completedLessons === progress.totalLessons
                )
                .map(([userId, progress]) => {
                  const student = users.find(u => u.id === userId);
                  return {
                    student,
                    course,
                    progress,
                    userId
                  };
                })
            )
            .filter(item => item.student)
            .map((item, index) => (
              <tr key={`${item.course.id}-${item.userId}-${index}`}>
                <td>{item.student.name}</td>
                <td>{item.course.courseInfo?.title}</td>
                <td>{item.course.teacherInfo?.teacherName}</td>
                <td>
                  {item.progress.completedAt 
                    ? new Date(item.progress.completedAt).toLocaleDateString()
                    : 'N/A'
                  }
                </td>
                <td>
                  <Badge bg="success">Completed</Badge>
                </td>
                <td>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => {
                      // Simulate certificate view for admin
                      alert(`Certificate for ${item.student.name} - ${item.course.courseInfo?.title}\n\nThis would show the certificate image in a modal.`);
                    }}
                  >
                    View Certificate
                  </Button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </Table>

      {courses.filter(course => course.status === "approved" && course.progress)
        .flatMap(course => Object.entries(course.progress)
          .filter(([userId, progress]) => progress.completedLessons === progress.totalLessons)
        ).length === 0 && (
        <div className="text-center py-4">
          <p className="text-muted">No certificates issued yet. Students need to complete courses to earn certificates.</p>
        </div>
      )}
    </Container>
  );
};

export default AdminDashboard;

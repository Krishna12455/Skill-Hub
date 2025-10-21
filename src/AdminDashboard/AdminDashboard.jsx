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
import React, { useEffect, useState } from "react";
import {
  collection,
  collectionGroup,
  doc,
  getDocs,
  deleteDoc,
  updateDoc,
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
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

      {/* ✅ Dashboard Insights */}
      <Row className="mb-4 text-center">
        <Col md={3}>
          <Card bg="info" text="white">
            <Card.Body>
              <Card.Title>Total Teachers</Card.Title>
              <h3>{users.filter((u) => u.role === "teacher").length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="success" text="white">
            <Card.Body>
              <Card.Title>Total Students</Card.Title>
              <h3>{users.filter((u) => u.role === "student").length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="primary" text="white">
            <Card.Body>
              <Card.Title>Total Courses</Card.Title>
              <h3>{courses.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
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
    </Container>
  );
};

export default AdminDashboard;

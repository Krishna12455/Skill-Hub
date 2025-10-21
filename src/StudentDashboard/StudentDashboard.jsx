
// // src/StudentDashboard/StudentDashboard.jsx
// import React, { useEffect, useState } from "react";
// import {
//   collectionGroup,
//   getDocs,
//   updateDoc,
//   doc,
//   setDoc
// } from "firebase/firestore";
// import { db } from "../firebase";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Form,
//   Modal,
//   Spinner,
//   Alert,
//   Badge,
//   ProgressBar,
//   Pagination
// } from "react-bootstrap";

// const StudentDashboard = () => {
//   const [courses, setCourses] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filterCategory, setFilterCategory] = useState("All");
//   const [loading, setLoading] = useState(true);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [showDetail, setShowDetail] = useState(false);
//   const [notify, setNotify] = useState("");
//   const [bookmarks, setBookmarks] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6;

//   const user = JSON.parse(localStorage.getItem("user"));

//   useEffect(() => {
//     async function fetchCourses() {
//       setLoading(true);
//       const snap = await getDocs(collectionGroup(db, "courses"));
//       const approved = snap.docs
//         .map(d => ({ id: d.id, ref: d.ref, ...d.data() }))
//         .filter(c => c.status === "approved");
//       setCourses(approved);
//       setLoading(false);
//     }
//     fetchCourses();
//   }, []);

//   const toggleBookmark = (courseId) => {
//     setBookmarks(prev =>
//       prev.includes(courseId)
//         ? prev.filter(id => id !== courseId)
//         : [...prev, courseId]
//     );
//   };

//   const filtered = courses.filter(c =>
//     (filterCategory === "All" || c?.courseInfo?.category === filterCategory) &&
//     (
//       c?.courseInfo?.title?.toLowerCase().includes(search.toLowerCase()) ||
//       c?.teacherInfo?.teacherName?.toLowerCase().includes(search.toLowerCase())
//     )
//   );

//   const paginated = filtered.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const hasEnrolled = (course) => {
//     return course?.enrolledStudents?.includes(user?.uid);
//   };

//   const getProgress = (course) => {
//     const progressData = course?.progress?.[user?.uid];
//     if (!progressData) return 0;
//     return Math.round((progressData.completedLessons / progressData.totalLessons) * 100);
//   };

//   const handleReview = async (course, rating, reviewText) => {
//     const reviewRef = doc(course.ref, "reviews", user.uid);
//     await setDoc(reviewRef, {
//       rating,
//       review: reviewText,
//       reviewedAt: new Date().toISOString()
//     });
//     setNotify("Thanks for your review!");
//   };

//   const handlePayment = async course => {
//     const order = await fetch("/api/createOrder", {
//       method: "POST",
//       body: JSON.stringify({ amount: course?.courseInfo?.price * 100 }),
//       headers: { 'Content-Type': 'application/json' }
//     }).then(res => res.json());

//     const options = {
//       key: "YOUR_RAZORPAY_KEY",
//       amount: order.amount,
//       currency: order.currency,
//       order_id: order.id,
//       name: "Skill Hub",
//       description: `Enroll for ${course?.courseInfo?.title}`,
//       handler: async () => {
//         await updateDoc(course.ref, {
//           enrolledStudents: [...(course.enrolledStudents || []), user.uid]
//         });
//         setNotify(`Enrolled in ${course.courseInfo.title}`);
//       },
//       prefill: { email: user?.email, name: user?.name },
//       theme: { color: "#007bff" }
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   };

//   return (
//     <Container className="py-4">
//       <h2 className="text-center mb-4">Student Dashboard</h2>

//       <Row className="mb-4">
//         <Col md={6}>
//           <Form.Control
//             placeholder="Search by title or teacher"
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//           />
//         </Col>
//         <Col md={4}>
//           <Form.Select
//             value={filterCategory}
//             onChange={e => setFilterCategory(e.target.value)}
//           >
//             <option>All Categories</option>
//             {[...new Set(courses.map(c => c.courseInfo?.category))].map((cat, i) => (
//               <option key={i}>{cat}</option>
//             ))}
//           </Form.Select>
//         </Col>
//       </Row>

//       {loading ? (
//         <div className="text-center py-4"><Spinner /></div>
//       ) : filtered.length === 0 ? (
//         <Alert>No courses found.</Alert>
//       ) : (
//         <Row className="g-4">
//           {paginated.map(c => (
//             <Col md={6} lg={4} key={c.id} className="d-flex">
//               <Card className="flex-fill d-flex flex-column">
//                 <Card.Img height={160} style={{ objectFit: 'cover' }} src={c.courseInfo?.thumbnail} />
//                 <Card.Body className="d-flex flex-column">
//                   <div className="d-flex justify-content-between">
//                     <Card.Title>{c.courseInfo?.title}</Card.Title>
//                     <Button variant="link" size="sm" onClick={() => toggleBookmark(c.id)}>
//                       {bookmarks.includes(c.id) ? "❤️" : "🤍"}
//                     </Button>
//                   </div>
//                   <Card.Text className="flex-grow-1">
//                     <small>{c.courseInfo?.description}</small>
//                   </Card.Text>
//                   <p><strong>By:</strong> {c.teacherInfo?.teacherName}</p>
//                   <p><strong>Category:</strong> {c.courseInfo?.category}</p>
//                   <p><strong>Level:</strong> {c.courseInfo?.level}</p>
//                   <p><strong>Price:</strong> ₹{c.courseInfo?.price}</p>
//                   {hasEnrolled(c) && (
//                     <ProgressBar now={getProgress(c)} label={`${getProgress(c)}%`} className="my-2" />
//                   )}
//                   <div className="d-flex flex-wrap gap-2 mt-auto">
//                     <Button variant="info" onClick={() => {
//                       setSelectedCourse(c);
//                       setShowDetail(true);
//                     }}>
//                       View Details
//                     </Button>
//                     {!hasEnrolled(c) ? (
//                       <Button variant="primary" onClick={() => handlePayment(c)}>
//                         Enroll & Pay ₹{c.courseInfo.price}
//                       </Button>
//                     ) : (
//                       <Button variant="success" disabled>
//                         Enrolled
//                       </Button>
//                     )}
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       )}

//       <div className="d-flex justify-content-center mt-4">
//         <Pagination>
//           {[...Array(Math.ceil(filtered.length / itemsPerPage)).keys()].map(n => (
//             <Pagination.Item
//               key={n + 1}
//               active={n + 1 === currentPage}
//               onClick={() => setCurrentPage(n + 1)}
//             >
//               {n + 1}
//             </Pagination.Item>
//           ))}
//         </Pagination>
//       </div>

//       {notify && (
//         <Alert variant="success" onClose={() => setNotify("")} dismissible>
//           {notify}
//         </Alert>
//       )}

//       <Modal show={showDetail} onHide={() => setShowDetail(false)} size="lg" centered>
//         <Modal.Header closeButton>
//           <Modal.Title>{selectedCourse?.courseInfo?.title}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedCourse?.lessonContent?.type === "video" && hasEnrolled(selectedCourse) ? (
//             <video width="100%" controls src={selectedCourse.lessonContent.content} />
//           ) : selectedCourse?.lessonContent?.type === "video" ? (
//             <Alert variant="warning">Please enroll to view the video.</Alert>
//           ) : (
//             <p>{selectedCourse?.lessonContent?.content}</p>
//           )}
//           <p><strong>Description:</strong> {selectedCourse?.courseInfo?.description}</p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowDetail(false)}>Close</Button>
//           {hasEnrolled(selectedCourse) && getProgress(selectedCourse) === 100 && (
//             <Button
//               className="ms-auto"
//               variant="outline-success"
//               href={`https://example.com/certificates/${selectedCourse?.id}_${user?.uid}.pdf`}
//               target="_blank"
//             >
//               Download Certificate
//             </Button>
//           )}
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default StudentDashboard;



// // src/StudentDashboard/StudentDashboard.jsx
// import React, { useEffect, useState } from "react";
// import {
//   collectionGroup,
//   getDocs,
//   updateDoc,
//   doc,
//   setDoc
// } from "firebase/firestore";
// import { db } from "../firebase";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Form,
//   Modal,
//   Spinner,
//   Alert,
//   Badge,
//   ProgressBar,
//   Pagination
// } from "react-bootstrap";

// const StudentDashboard = () => {
//   const [courses, setCourses] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filterCategory, setFilterCategory] = useState("All");
//   const [loading, setLoading] = useState(true);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [showDetail, setShowDetail] = useState(false);
//   const [notify, setNotify] = useState("");
//   const [bookmarks, setBookmarks] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6;

//   const user = JSON.parse(localStorage.getItem("user"));

//   useEffect(() => {
//     async function fetchCourses() {
//       setLoading(true);
//       const snap = await getDocs(collectionGroup(db, "courses"));
//       const approved = snap.docs
//         .map(d => ({ id: d.id, ref: d.ref, ...d.data() }))
//         .filter(c => c.status === "approved");
//       setCourses(approved);
//       setLoading(false);
//     }
//     fetchCourses();
//   }, []);

//   const toggleBookmark = (courseId) => {
//     setBookmarks(prev =>
//       prev.includes(courseId)
//         ? prev.filter(id => id !== courseId)
//         : [...prev, courseId]
//     );
//   };

//   const filtered = courses.filter(c =>
//     (filterCategory === "All" || c?.courseInfo?.category === filterCategory) &&
//     (
//       c?.courseInfo?.title?.toLowerCase().includes(search.toLowerCase()) ||
//       c?.teacherInfo?.teacherName?.toLowerCase().includes(search.toLowerCase())
//     )
//   );

//   const paginated = filtered.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const hasEnrolled = (course) => {
//     return course?.enrolledStudents?.includes(user?.uid);
//   };

//   const getProgress = (course) => {
//     const progressData = course?.progress?.[user?.uid];
//     if (!progressData) return 0;
//     return Math.round((progressData.completedLessons / progressData.totalLessons) * 100);
//   };

//   const handlePayment = async course => {
//     const order = await fetch("/api/createOrder", {
//       method: "POST",
//       body: JSON.stringify({ amount: course?.courseInfo?.price * 100 }),
//       headers: { 'Content-Type': 'application/json' }
//     }).then(res => res.json());

//     const options = {
//       key: "YOUR_RAZORPAY_KEY",
//       amount: order.amount,
//       currency: order.currency,
//       order_id: order.id,
//       name: "Skill Hub",
//       description: `Enroll for ${course?.courseInfo?.title}`,
//       handler: async () => {
//         await updateDoc(course.ref, {
//           enrolledStudents: [...(course.enrolledStudents || []), user.uid]
//         });
//         setNotify(`Enrolled in ${course.courseInfo.title}`);
//       },
//       prefill: { email: user?.email, name: user?.name },
//       theme: { color: "#007bff" }
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   };

//   return (
//     <Container className="py-4">
//       <h2 className="text-center mb-4">Student Dashboard</h2>

//       <Row className="mb-4">
//         <Col md={6}>
//           <Form.Control
//             placeholder="Search by title or teacher"
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//           />
//         </Col>
//         <Col md={4}>
//           <Form.Select
//             value={filterCategory}
//             onChange={e => setFilterCategory(e.target.value)}
//           >
//             <option>All Categories</option>
//             {[...new Set(courses.map(c => c.courseInfo?.category))].map((cat, i) => (
//               <option key={i}>{cat}</option>
//             ))}
//           </Form.Select>
//         </Col>
//       </Row>

//       {loading ? (
//         <div className="text-center py-4"><Spinner /></div>
//       ) : filtered.length === 0 ? (
//         <Alert>No courses found.</Alert>
//       ) : (
//         <Row className="g-4">
//           {paginated.map(c => (
//             <Col md={6} lg={4} key={c.id} className="d-flex">
//               <Card className="flex-fill d-flex flex-column">
//                 <Card.Img
//                   height={160}
//                   style={{ objectFit: 'cover', cursor: "pointer" }}
//                   src={c.courseInfo?.thumbnail}
//                   onClick={() => {
//                     setSelectedCourse(c);
//                     setShowDetail(true);
//                   }}
//                 />
//                 <Card.Body className="d-flex flex-column">
//                   <div className="d-flex justify-content-between">
//                     <Card.Title>{c.courseInfo?.title}</Card.Title>
//                     <Button variant="link" size="sm" onClick={() => toggleBookmark(c.id)}>
//                       {bookmarks.includes(c.id) ? "❤️" : "💕"}
//                     </Button>
//                   </div>
//                   <Card.Text className="flex-grow-1">
//                     <small>{c.courseInfo?.description}</small>
//                   </Card.Text>
//                   <p><strong>By:</strong> {c.teacherInfo?.teacherName}</p>
//                   <p><strong>Category:</strong> {c.courseInfo?.category}</p>
//                   <p><strong>Level:</strong> {c.courseInfo?.level}</p>
//                   <p><strong>Price:</strong> ₹{c.courseInfo?.price}</p>
//                   {hasEnrolled(c) && (
//                     <ProgressBar now={getProgress(c)} label={`${getProgress(c)}%`} className="my-2" />
//                   )}
//                   <div className="d-flex flex-wrap gap-2 mt-auto">
//                     <Button variant="info" onClick={() => {
//                       setSelectedCourse(c);
//                       setShowDetail(true);
//                     }}>
//                       View Details
//                     </Button>
//                     {!hasEnrolled(c) ? (
//                       <Button variant="primary" onClick={() => handlePayment(c)}>
//                         Enroll & Pay ₹{c.courseInfo.price}
//                       </Button>
//                     ) : (
//                       <Button variant="success" disabled>
//                         Enrolled
//                       </Button>
//                     )}
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       )}

//       <div className="d-flex justify-content-center mt-4">
//         <Pagination>
//           {[...Array(Math.ceil(filtered.length / itemsPerPage)).keys()].map(n => (
//             <Pagination.Item
//               key={n + 1}
//               active={n + 1 === currentPage}
//               onClick={() => setCurrentPage(n + 1)}
//             >
//               {n + 1}
//             </Pagination.Item>
//           ))}
//         </Pagination>
//       </div>

//       {notify && (
//         <Alert variant="success" onClose={() => setNotify("")} dismissible>
//           {notify}
//         </Alert>
//       )}

//       <Modal show={showDetail} onHide={() => setShowDetail(false)} size="lg" centered>
//         <Modal.Header closeButton>
//           <Modal.Title>{selectedCourse?.courseInfo?.title}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedCourse?.lessonContent?.type === "video" && hasEnrolled(selectedCourse) ? (
//             <video width="100%" controls src={selectedCourse.lessonContent.content} />
//           ) : selectedCourse?.lessonContent?.type === "video" ? (
//             <Alert variant="warning">Please enroll to view the video.</Alert>
//           ) : (
//             <p>{selectedCourse?.lessonContent?.content}</p>
//           )}
//           <p><strong>Description:</strong> {selectedCourse?.courseInfo?.description}</p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowDetail(false)}>Close</Button>
//           {hasEnrolled(selectedCourse) && getProgress(selectedCourse) === 100 && (
//             <Button
//               className="ms-auto"
//               variant="outline-success"
//               href={`https://example.com/certificates/${selectedCourse?.id}_${user?.uid}.pdf`}
//               target="_blank"
//             >
//               Download Certificate
//             </Button>
//           )}
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default StudentDashboard;




// // Fixes to be made:
// // 1. Update progress tracking after video completes
// // 2. Certificate should be shown based on real progress completion
// // 3. Razorpay integration should work correctly with complete flow

// // Here's the updated version:
// // ✅ Includes video completion tracking
// // ✅ Includes dynamic progress update
// // ✅ Razorpay payment integration fixed

// import React, { useEffect, useState, useRef } from "react";
// import {
//   collectionGroup,
//   getDocs,
//   updateDoc,
//   doc,
//   setDoc
// } from "firebase/firestore";
// import { db } from "../firebase";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Form,
//   Modal,
//   Spinner,
//   Alert,
//   Badge,
//   ProgressBar,
//   Pagination
// } from "react-bootstrap";

// const StudentDashboard = () => {
//   const [courses, setCourses] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filterCategory, setFilterCategory] = useState("All");
//   const [loading, setLoading] = useState(true);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [showDetail, setShowDetail] = useState(false);
//   const [notify, setNotify] = useState("");
//   const [bookmarks, setBookmarks] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const videoRef = useRef(null);
//   const itemsPerPage = 6;

//   const user = JSON.parse(localStorage.getItem("user"));

//   useEffect(() => {
//     async function fetchCourses() {
//       setLoading(true);
//       const snap = await getDocs(collectionGroup(db, "courses"));
//       const approved = snap.docs
//         .map(d => ({ id: d.id, ref: d.ref, ...d.data() }))
//         .filter(c => c.status === "approved");
//       setCourses(approved);
//       setLoading(false);
//     }
//     fetchCourses();
//   }, []);

//   const toggleBookmark = courseId => {
//     setBookmarks(prev =>
//       prev.includes(courseId)
//         ? prev.filter(id => id !== courseId)
//         : [...prev, courseId]
//     );
//   };

//   const filtered = courses.filter(c =>
//     (filterCategory === "All" || c?.courseInfo?.category === filterCategory) &&
//     (c?.courseInfo?.title?.toLowerCase().includes(search.toLowerCase()) ||
//       c?.teacherInfo?.teacherName?.toLowerCase().includes(search.toLowerCase()))
//   );

//   const paginated = filtered.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const hasEnrolled = course => course?.enrolledStudents?.includes(user?.uid);

//   const getProgress = course => {
//     const progressData = course?.progress?.[user?.uid];
//     if (!progressData) return 0;
//     return Math.round(
//       (progressData.completedLessons / progressData.totalLessons) * 100
//     );
//   };

//   const handleVideoEnd = async () => {
//     const c = selectedCourse;
//     const existingProgress = c.progress?.[user.uid] || {
//       completedLessons: 0,
//       totalLessons: 1
//     };

//     const updatedProgress = {
//       ...c.progress,
//       [user.uid]: {
//         completedLessons: existingProgress.totalLessons,
//         totalLessons: existingProgress.totalLessons
//       }
//     };

//     await updateDoc(c.ref, { progress: updatedProgress });
//     setNotify("Progress updated. You can now download the certificate if 100% complete.");
//     setCourses(prev =>
//       prev.map(course =>
//         course.id === c.id ? { ...course, progress: updatedProgress } : course
//       )
//     );
//   };

//   const handlePayment = async course => {
//     const order = await fetch("/api/createOrder", {
//       method: "POST",
//       body: JSON.stringify({ amount: course?.courseInfo?.price * 100 }),
//       headers: { "Content-Type": "application/json" }
//     }).then(res => res.json());

//     const options = {
//       key: "YOUR_RAZORPAY_KEY",
//       amount: order.amount,
//       currency: order.currency,
//       order_id: order.id,
//       name: "Skill Hub",
//       description: `Enroll for ${course?.courseInfo?.title}`,
//       handler: async () => {
//         await updateDoc(course.ref, {
//           enrolledStudents: [...(course.enrolledStudents || []), user.uid],
//           progress: {
//             ...(course.progress || {}),
//             [user.uid]: { completedLessons: 0, totalLessons: 1 }
//           }
//         });
//         setNotify(`Enrolled in ${course.courseInfo.title}`);
//         setCourses(prev =>
//           prev.map(c =>
//             c.id === course.id
//               ? {
//                   ...c,
//                   enrolledStudents: [...(c.enrolledStudents || []), user.uid]
//                 }
//               : c
//           )
//         );
//       },
//       prefill: { email: user?.email, name: user?.name },
//       theme: { color: "#007bff" }
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   };

//   return (
//     <Container className="py-4">
//       <h2 className="text-center mb-4">Student Dashboard</h2>

//       <Row className="mb-4">
//         <Col md={6}>
//           <Form.Control
//             placeholder="Search by title or teacher"
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//           />
//         </Col>
//         <Col md={4}>
//           <Form.Select
//             value={filterCategory}
//             onChange={e => setFilterCategory(e.target.value)}
//           >
//             <option>All Categories</option>
//             {[...new Set(courses.map(c => c.courseInfo?.category))].map((cat, i) => (
//               <option key={i}>{cat}</option>
//             ))}
//           </Form.Select>
//         </Col>
//       </Row>

//       {loading ? (
//         <div className="text-center py-4">
//           <Spinner />
//         </div>
//       ) : filtered.length === 0 ? (
//         <Alert>No courses found.</Alert>
//       ) : (
//         <Row className="g-4">
//           {paginated.map(c => (
//             <Col md={6} lg={4} key={c.id} className="d-flex">
//               <Card className="flex-fill d-flex flex-column">
//                 <Card.Img
//                   height={160}
//                   style={{ objectFit: "cover", cursor: "pointer" }}
//                   src={c.courseInfo?.thumbnail}
//                   onClick={() => {
//                     setSelectedCourse(c);
//                     setShowDetail(true);
//                   }}
//                 />
//                 <Card.Body className="d-flex flex-column">
//                   <div className="d-flex justify-content-between">
//                     <Card.Title>{c.courseInfo?.title}</Card.Title>
//                     <Button
//                       variant="link"
//                       size="sm"
//                       onClick={() => toggleBookmark(c.id)}
//                     >
//                       {bookmarks.includes(c.id) ? "❤️" : "💕"}
//                     </Button>
//                   </div>
//                   <Card.Text className="flex-grow-1">
//                     <small>{c.courseInfo?.description}</small>
//                   </Card.Text>
//                   <p>
//                     <strong>By:</strong> {c.teacherInfo?.teacherName}
//                   </p>
//                   <p>
//                     <strong>Category:</strong> {c.courseInfo?.category}
//                   </p>
//                   <p>
//                     <strong>Level:</strong> {c.courseInfo?.level}
//                   </p>
//                   <p>
//                     <strong>Price:</strong> ₹{c.courseInfo?.price}
//                   </p>
//                   {hasEnrolled(c) && (
//                     <ProgressBar
//                       now={getProgress(c)}
//                       label={`${getProgress(c)}%`}
//                       className="my-2"
//                     />
//                   )}
//                   <div className="d-flex flex-wrap gap-2 mt-auto">
//                     <Button
//                       variant="info"
//                       onClick={() => {
//                         setSelectedCourse(c);
//                         setShowDetail(true);
//                       }}
//                     >
//                       View Details
//                     </Button>
//                     {!hasEnrolled(c) ? (
//                       <Button
//                         variant="primary"
//                         onClick={() => handlePayment(c)}
//                       >
//                         Enroll & Pay ₹{c.courseInfo.price}
//                       </Button>
//                     ) : (
//                       <Button variant="success" disabled>
//                         Enrolled
//                       </Button>
//                     )}
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       )}

//       <div className="d-flex justify-content-center mt-4">
//         <Pagination>
//           {[...Array(Math.ceil(filtered.length / itemsPerPage)).keys()].map(n => (
//             <Pagination.Item
//               key={n + 1}
//               active={n + 1 === currentPage}
//               onClick={() => setCurrentPage(n + 1)}
//             >
//               {n + 1}
//             </Pagination.Item>
//           ))}
//         </Pagination>
//       </div>

//       {notify && (
//         <Alert
//           variant="success"
//           onClose={() => setNotify("")}
//           dismissible
//         >
//           {notify}
//         </Alert>
//       )}

//       <Modal show={showDetail} onHide={() => setShowDetail(false)} size="lg" centered>
//         <Modal.Header closeButton>
//           <Modal.Title>{selectedCourse?.courseInfo?.title}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedCourse?.lessonContent?.type === "video" && hasEnrolled(selectedCourse) ? (
//             <video
//               ref={videoRef}
//               width="100%"
//               controls
//               src={selectedCourse.lessonContent.content}
//               onEnded={handleVideoEnd}
//             />
//           ) : selectedCourse?.lessonContent?.type === "video" ? (
//             <Alert variant="warning">Please enroll to view the video.</Alert>
//           ) : (
//             <p>{selectedCourse?.lessonContent?.content}</p>
//           )}
//           <p>
//             <strong>Description:</strong> {selectedCourse?.courseInfo?.description}
//           </p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowDetail(false)}>
//             Close
//           </Button>
//           {hasEnrolled(selectedCourse) && getProgress(selectedCourse) === 100 && (
//             <Button
//               className="ms-auto"
//               variant="outline-success"
//               href={`https://example.com/certificates/${selectedCourse?.id}_${user?.uid}.pdf`}
//               target="_blank"
//             >
//               Download Certificate
//             </Button>
//           )}
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default StudentDashboard;




// StudentDashboard.jsx - Fully Fixed and Updated

import React, { useEffect, useState, useRef } from "react";
import {
  collectionGroup,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  Spinner,
  Alert,
  ProgressBar,
  Pagination,
} from "react-bootstrap";

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [notify, setNotify] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const videoRef = useRef(null);
  const itemsPerPage = 6;

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      const snap = await getDocs(collectionGroup(db, "courses"));
      const approved = snap.docs
        .map((d) => ({ id: d.id, ref: d.ref, ...d.data() }))
        .filter((c) => c.status === "approved");
      setCourses(approved);
      setLoading(false);
    }
    fetchCourses();
  }, []);

  const toggleBookmark = (courseId) => {
    setBookmarks((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const filtered = courses.filter(
    (c) =>
      (filterCategory === "All" || c?.courseInfo?.category === filterCategory) &&
      (c?.courseInfo?.title?.toLowerCase().includes(search.toLowerCase()) ||
        c?.teacherInfo?.teacherName?.toLowerCase().includes(search.toLowerCase()))
  );

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const hasEnrolled = (course) => course?.enrolledStudents?.includes(user?.uid);

  const getProgress = (course) => {
    const progressData = course?.progress?.[user?.uid];
    if (!progressData) return 0;
    return Math.round(
      (progressData.completedLessons / progressData.totalLessons) * 100
    );
  };

  const handleVideoEnd = async () => {
    const c = selectedCourse;
    const existingProgress = c.progress?.[user.uid] || {
      completedLessons: 0,
      totalLessons: 1,
    };

    const updatedProgress = {
      ...c.progress,
      [user.uid]: {
        completedLessons: existingProgress.totalLessons,
        totalLessons: existingProgress.totalLessons,
      },
    };

    await updateDoc(c.ref, { progress: updatedProgress });
    setNotify("Progress updated. You can now download the certificate if 100% complete.");
    setCourses((prev) =>
      prev.map((course) =>
        course.id === c.id ? { ...course, progress: updatedProgress } : course
      )
    );
  };

  const handlePayment = async (course) => {
    console.log("💳 Payment clicked for course:", course?.courseInfo?.title);
    console.log("💳 Course data:", course);
    console.log("💳 User data:", user);
    
    try {
      // For testing - simulate successful payment
      const confirmPayment = window.confirm(
        `Enroll in "${course?.courseInfo?.title}" for ₹${course?.courseInfo?.price}?\n\nThis is a test payment - no real money will be charged.`
      );

      if (confirmPayment) {
        // Simulate payment processing
        setNotify("Processing payment...");
        
        // Update course enrollment
        await updateDoc(course.ref, {
          enrolledStudents: [...(course.enrolledStudents || []), user.uid],
          progress: {
            ...(course.progress || {}),
            [user.uid]: { completedLessons: 0, totalLessons: 1 },
          },
        });
        
        setNotify(`✅ Successfully enrolled in ${course.courseInfo.title}!`);
        setCourses((prev) =>
          prev.map((c) =>
            c.id === course.id
              ? {
                  ...c,
                  enrolledStudents: [...(c.enrolledStudents || []), user.uid],
                }
              : c
          )
        );
      }
    } catch (err) {
      console.error("Payment failed", err);
      setNotify("❌ Payment failed. Please try again.");
    }
  };

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Student Dashboard</h2>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            placeholder="Search by title or teacher"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option>All Categories</option>
            {[...new Set(courses.map((c) => c.courseInfo?.category))].map((cat, i) => (
              <option key={i}>{cat}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-4">
          <Spinner />
        </div>
      ) : filtered.length === 0 ? (
        <Alert>No courses found.</Alert>
      ) : (
        <Row className="g-4">
          {paginated.map((c) => (
            <Col md={6} lg={4} key={c.id} className="d-flex">
              <Card className="flex-fill d-flex flex-column">
                <Card.Img
                  height={160}
                  style={{ objectFit: "cover", cursor: "pointer" }}
                  src={c.courseInfo?.thumbnail}
                  onClick={() => {
                    setSelectedCourse(c);
                    setShowDetail(true);
                  }}
                />
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between">
                    <Card.Title>{c.courseInfo?.title}</Card.Title>
                    <Button variant="link" size="sm" onClick={() => toggleBookmark(c.id)}>
                      {bookmarks.includes(c.id) ? "❤️" : "💕"}
                    </Button>
                  </div>
                  <Card.Text className="flex-grow-1">
                    <small>{c.courseInfo?.description}</small>
                  </Card.Text>
                  <p><strong>By:</strong> {c.teacherInfo?.teacherName}</p>
                  <p><strong>Category:</strong> {c.courseInfo?.category}</p>
                  <p><strong>Level:</strong> {c.courseInfo?.level}</p>
                  <p><strong>Price:</strong> ₹{c.courseInfo?.price}</p>
                  {hasEnrolled(c) && (
                    <ProgressBar
                      now={getProgress(c)}
                      label={`${getProgress(c)}%`}
                      className="my-2"
                    />
                  )}
                  <div className="d-flex flex-wrap gap-2 mt-auto">
                    <Button
                      variant="info"
                      onClick={() => {
                        setSelectedCourse(c);
                        setShowDetail(true);
                      }}
                    >
                      View Details
                    </Button>
                    {!hasEnrolled(c) ? (
                      <Button variant="primary" onClick={() => handlePayment(c)}>
                        Enroll & Pay ₹{c.courseInfo.price}
                      </Button>
                    ) : (
                      <Button variant="success" disabled>
                        Enrolled
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          {[...Array(Math.ceil(filtered.length / itemsPerPage)).keys()].map((n) => (
            <Pagination.Item
              key={n + 1}
              active={n + 1 === currentPage}
              onClick={() => setCurrentPage(n + 1)}
            >
              {n + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>

      {notify && (
        <Alert variant="success" onClose={() => setNotify("")} dismissible>
          {notify}
        </Alert>
      )}

      <Modal show={showDetail} onHide={() => setShowDetail(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedCourse?.courseInfo?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCourse?.lessonContent?.type === "video" && hasEnrolled(selectedCourse) ? (
            <video
              ref={videoRef}
              width="100%"
              controls
              src={selectedCourse.lessonContent.content}
              onEnded={handleVideoEnd}
            />
          ) : selectedCourse?.lessonContent?.type === "video" ? (
            <Alert variant="warning">Please enroll to view the video.</Alert>
          ) : (
            <p>{selectedCourse?.lessonContent?.content}</p>
          )}
          <p>
            <strong>Description:</strong> {selectedCourse?.courseInfo?.description}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetail(false)}>
            Close
          </Button>
          {hasEnrolled(selectedCourse) && getProgress(selectedCourse) === 100 && (
            <Button
              className="ms-auto"
              variant="outline-success"
              href={`https://example.com/certificates/${selectedCourse?.id}_${user?.uid}.pdf`}
              target="_blank"
            >
              Download Certificate
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default StudentDashboard;



import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";              // ✅ same here
import { Card, Container, Row, Col, Badge, Button, Alert, Spinner, Modal, Form } from "react-bootstrap";
import "./Seepostedvideo.css";


const Seepostedvideo = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  
  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Debug effect to track course changes
  useEffect(() => {
    console.log("📊 Teacher courses state changed:", {
      coursesLength: courses.length,
      loading,
      error,
      courses: courses.map(c => ({ id: c.id, title: c.courseInfo?.title, status: c.status }))
    });
  }, [courses, loading, error]);

  // Memoize sorted courses to prevent unnecessary re-renders
  const sortedCourses = useMemo(() => {
    console.log("🔄 Sorting teacher courses...", courses.length);
    return [...courses].sort((a, b) => 
      new Date(b.courseInfo.createdAt) - new Date(a.courseInfo.createdAt)
    );
  }, [courses]);

  // Get user data and fetch courses on component mount
  useEffect(() => {
    const fetchUserAndCourses = async () => {
      try {
        console.log("🔍 Teacher: Starting to fetch courses...");
        
        // Get user from localStorage
        const userData = JSON.parse(localStorage.getItem("user"));
        if (!userData) {
          setError("User not found. Please login again.");
          setLoading(false);
          return;
        }
        console.log("👤 Teacher user data:", userData);
        setUser(userData);

        // Fetch courses from user's collection
        console.log("📚 Teacher: Fetching courses from collection...");
        const coursesCollectionRef = collection(db, "users", userData.uid, "courses");
        const coursesSnapshot = await getDocs(coursesCollectionRef);
        
        console.log("📖 Teacher: Courses found:", coursesSnapshot.docs.length);
        console.log("📖 Teacher: Query snapshot:", coursesSnapshot);
        
        const coursesData = [];
        coursesSnapshot.forEach((doc) => {
          const courseData = doc.data();
          console.log("📝 Teacher course data:", { 
            id: doc.id, 
            title: courseData.courseInfo?.title,
            hasCourseInfo: !!courseData.courseInfo,
            hasLessonContent: !!courseData.lessonContent,
            status: courseData.status,
            fullData: courseData
          });
          coursesData.push({
            id: doc.id,
            ...courseData
          });
        });

        console.log("📊 Teacher: Total courses collected:", coursesData.length);
        console.log("📋 Teacher: All courses:", coursesData);

        setCourses(coursesData);
        setLoading(false);
        console.log("✅ Teacher: Course fetching completed!");
      } catch (error) {
        console.error("❌ Teacher: Error fetching courses:", error);
        console.error("❌ Teacher: Error details:", {
          code: error.code,
          message: error.message,
          stack: error.stack
        });
        setError("Error fetching courses: " + error.message);
        setLoading(false);
      }
    };

    fetchUserAndCourses();
  }, []);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'secondary';
      default:
        return 'info';
    }
  };

  const getLevelBadgeVariant = (level) => {
    switch (level) {
      case 'Beginner':
        return 'success';
      case 'Intermediate':
        return 'warning';
      case 'Advanced':
        return 'danger';
      default:
        return 'info';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const handleVideoClick = (course) => {
    if (course.lessonContent && course.lessonContent.type === 'video' && course.lessonContent.content) {
      setSelectedVideo({
        title: course.lessonContent.title,
        url: course.lessonContent.content,
        courseTitle: course.courseInfo.title
      });
      setShowVideoModal(true);
    }
  };

  const handleCloseVideoModal = () => {
    setShowVideoModal(false);
    setSelectedVideo(null);
  };

  // Handle View button click
  const handleViewClick = (course) => {
    if (course.lessonContent && course.lessonContent.type === 'text' && course.lessonContent.content) {
      // For text content, show in a modal
      setSelectedVideo({
        title: course.lessonContent.title,
        content: course.lessonContent.content,
        courseTitle: course.courseInfo.title,
        type: 'text'
      });
      setShowVideoModal(true);
    } else if (course.lessonContent && course.lessonContent.type === 'video' && course.lessonContent.content) {
      // For video content, play video
      handleVideoClick(course);
    }
  };

  // Handle Edit button click
  const handleEditClick = (course) => {
    setEditingCourse(course);
    setEditFormData({
      title: course.courseInfo.title,
      category: course.courseInfo.category,
      level: course.courseInfo.level,
      description: course.courseInfo.description,
      objectives: course.courseInfo.objectives || '',
      price: course.courseInfo.price || 0,
      lessonTitle: course.lessonContent?.title || '',
      lessonType: course.lessonContent?.type || '',
      lessonContent: course.lessonContent?.content || '',
      duration: course.lessonContent?.duration || '',
      status: course.status
    });
    setShowEditModal(true);
  };

  // Handle Edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);

    try {
      const courseRef = doc(db, "users", user.uid, "courses", editingCourse.id);
      
      const updatedCourseData = {
        courseInfo: {
          ...editingCourse.courseInfo,
          title: editFormData.title,
          category: editFormData.category,
          level: editFormData.level,
          description: editFormData.description,
          objectives: editFormData.objectives,
          price: parseFloat(editFormData.price) || 0,
          updatedAt: new Date().toISOString()
        },
        lessonContent: {
          ...editingCourse.lessonContent,
          title: editFormData.lessonTitle,
          type: editFormData.lessonType,
          content: editFormData.lessonContent,
          duration: editFormData.duration ? parseInt(editFormData.duration) : null
        },
        status: editFormData.status
      };

      await updateDoc(courseRef, updatedCourseData);

      // Update local state
      setCourses(courses.map(course => 
        course.id === editingCourse.id 
          ? { ...course, ...updatedCourseData }
          : course
      ));

      setShowEditModal(false);
      setEditingCourse(null);
      setEditFormData({});
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Error updating course: " + error.message);
    } finally {
      setEditLoading(false);
    }
  };

  // Handle Delete button click
  const handleDeleteClick = (course) => {
    setDeletingCourse(course);
    setShowDeleteModal(true);
  };

  // Handle Delete confirmation
  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);

    try {
      const courseRef = doc(db, "users", user.uid, "courses", deletingCourse.id);
      await deleteDoc(courseRef);

      // Remove from local state
      setCourses(courses.filter(course => course.id !== deletingCourse.id));

      setShowDeleteModal(false);
      setDeletingCourse(null);
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Error deleting course: " + error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const getDefaultThumbnail = (category) => {
    // Return a default thumbnail based on category
    const categoryThumbnails = {
      'Web Development': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop',
      'Mobile App Development': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop',
      'Programming Languages': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop',
      'Data Science': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
      'Machine Learning & AI': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
      'Cloud Computing': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop',
      'Cybersecurity': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop',
      'UI/UX Design': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
      'Graphic Design': 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=250&fit=crop',
      'Digital Marketing': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop'
    };
    
    return categoryThumbnails[category] || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop';
  };

  return (
    <Container fluid className="mt-4">
      {console.log("🔄 Seepostedvideo render:", {
        loading,
        error,
        coursesLength: sortedCourses.length,
        user: user?.name,
        shouldShowCards: !loading && !error && sortedCourses.length > 0
      })}
      
      {/* Debug Info */}
      {/* <div style={{ 
        background: '#f0f0f0', 
        padding: '10px', 
        margin: '10px 0', 
        border: '2px solid red',
        fontSize: '12px'
      }}>
        <strong>DEBUG INFO:</strong><br/>
        Loading: {loading.toString()}<br/>
        Error: {error || 'none'}<br/>
        Courses Length: {sortedCourses.length}<br/>
        Should Show Cards: {(!loading && !error && sortedCourses.length > 0).toString()}
      </div> */}

      {/* Page Header */}
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1>My Posted Courses</h1>
          <div className="teacher-info">
            Welcome back, {user?.name}!
          </div>
        </div>
        <Button 
          variant="outline-primary" 
          onClick={() => window.location.reload()}
          disabled={loading}
        >
          <i className="fas fa-sync-alt me-1"></i>
          Refresh
        </Button>
      </div>

      {/* Course Count */}
      {!loading && !error && sortedCourses.length > 0 && (
        <Row className="mb-4">
          <Col>
            <div className="course-count">
              Total Courses: {sortedCourses.length}
            </div>
          </Col>
        </Row>
      )}

      {loading && (
        <div className="loading-container">
          <div className="text-center">
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="mt-3">Loading your courses...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="error-container">
          <Alert variant="danger">
            <Alert.Heading>Error Loading Courses</Alert.Heading>
            <p>{error}</p>
          </Alert>
        </div>
      )}

      {!loading && !error && sortedCourses.length === 0 && (
        <div className="empty-state">
          <Alert variant="info">
            <Alert.Heading>No Courses Posted Yet</Alert.Heading>
            <p>
              You haven't posted any courses yet. Start by creating your first course!
            </p>
            <div className="mt-3">
              <Button 
                variant="primary" 
                onClick={() => window.location.href = '/teacherDashboard/postvideo'}
              >
                <i className="fas fa-plus me-1"></i>
                Create Your First Course
              </Button>
            </div>
          </Alert>
        </div>
      )}

     

      {/* Main Course Cards */}
      {!loading && !error && sortedCourses.length > 0 && (
        <Row>
          {console.log("🎯 Rendering course cards. Count:", sortedCourses.length)}
          {sortedCourses.map((course, index) => {
            // Safety check for course data
            if (!course || !course.courseInfo) {
              console.log("⚠️ Teacher: Skipping invalid course:", course);
              return null;
            }
            
            console.log(`🎯 Rendering course ${index + 1}:`, course.courseInfo.title);
            
            return (
              <Col key={course.id} lg={4} md={6} className="mb-4">
                <Card 
                  className="h-100"
                  style={{
                    border: "2px solid black",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  <Card.Img
                    variant="top"
                      src={course.courseInfo.thumbnail || getDefaultThumbnail(course.courseInfo.category)}
                      alt={course.courseInfo.title}
                    style={{ height: 200, objectFit: "cover", cursor: "pointer" }}
                    onClick={() => handleViewClick(course)}
                      onError={(e) => {
                        e.target.src = getDefaultThumbnail(course.courseInfo.category);
                      }}
                    />
                  <Card.Body>
                    <Card.Title>{course.courseInfo.title}</Card.Title>
                    <Card.Text>{course.courseInfo.description}</Card.Text>
                    
                    {!course.lessonContent && (
                      <div className="mb-3">
                        <small className="text-danger">No lesson content available.</small>
                      </div>
                    )}

                    <div className="d-flex gap-2 mb-2">
                      <Badge bg={getLevelBadgeVariant(course.courseInfo.level)}>
                        {course.courseInfo.level}
                      </Badge>
                      <Badge bg="secondary">{course.courseInfo.category}</Badge>
                    </div>

                    {/* Price Display */}
                    <div className="mb-2">
                      <Badge bg="success">
                        <strong>Price:</strong> {formatPrice(course.courseInfo.price || 0)}
                        </Badge>
                    </div>

                    {/* Lesson Content Info */}
                    {course.lessonContent && (
                      <div className="mb-3 p-2 bg-light rounded">
                        <small className="text-muted">
                          <strong>Lesson:</strong> {course.lessonContent.title}
                        </small>
                        <br />
                        <small className="text-muted">
                          <strong>Type:</strong> {course.lessonContent.type}
                          {course.lessonContent.duration && (
                            <span className="ms-2">
                              <strong>Duration:</strong> {course.lessonContent.duration} min
                            </span>
                          )}
                        </small>
                      </div>
                    )}

                    {/* Learning Objectives */}
                    {course.courseInfo.objectives && (
                      <div className="mb-3 p-2 bg-light rounded">
                        <small className="text-muted">
                          <strong>Learning Objectives:</strong>
                        </small>
                        <div className="mt-1">
                          <small className="text-muted">
                            {Array.isArray(course.courseInfo.objectives) 
                              ? course.courseInfo.objectives.slice(0, 2).map((objective, idx) => (
                                  <div key={idx}>• {objective}</div>
                                ))
                              : `• ${course.courseInfo.objectives}`
                            }
                            {Array.isArray(course.courseInfo.objectives) && course.courseInfo.objectives.length > 2 && (
                              <div>• +{course.courseInfo.objectives.length - 2} more</div>
                            )}
                          </small>
                        </div>
                      </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        <small className="text-muted">
                          By {course.teacherInfo?.teacherName || user?.name}
                        </small>
                      </div>
                      <div className="d-flex gap-1">
                      <Button 
                          variant="primary"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                          handleViewClick(course);
                        }}
                          disabled={!(course.lessonContent && course.lessonContent.content)}
                      >
                          <i className="fas fa-eye me-1"></i> View
                      </Button>
                      <Button 
                          variant="warning"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                          handleEditClick(course);
                        }}
                      >
                          <i className="fas fa-edit me-1"></i> Edit
                      </Button>
                      <Button 
                          variant="danger"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                          handleDeleteClick(course);
                        }}
                      >
                          <i className="fas fa-trash me-1"></i> Delete
                      </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Video/Content Modal */}
      <Modal 
        show={showVideoModal} 
        onHide={handleCloseVideoModal}
        size="xl"
        centered
        className="video-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="d-flex align-items-center">
              <i className="fas fa-play-circle me-2 text-primary"></i>
              {selectedVideo?.title}
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {selectedVideo && selectedVideo.type === "text" ? (
            <div className="content-container p-4">
              <div className="content-text">{selectedVideo.content}</div>
            </div>
          ) : (
            <div className="video-container">
              <video
                controls
                width="100%"
                height="auto"
                className="video-player"
                autoPlay
                preload="metadata"
                onLoadedMetadata={() => {
                  console.log("🎥 Video loaded successfully:", selectedVideo?.url);
                }}
                onError={(e) => {
                  console.error("❌ Video playback error:", e);
                  alert("Error playing video. Please check the video URL.");
                }}
              >
                <source src={selectedVideo?.url} type="video/mp4" />
                <source src={selectedVideo?.url} type="video/webm" />
                <source src={selectedVideo?.url} type="video/ogg" />
                Your browser does not support the video tag.
              </video>
              {selectedVideo?.courseTitle && (
                <div className="video-info p-3 bg-light">
                  <h6>
                    <i className="fas fa-graduation-cap me-2"></i>Course: {selectedVideo.courseTitle}
                  </h6>
                  {selectedVideo?.description && (
                    <p className="mb-0 text-muted">{selectedVideo.description}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-between align-items-center w-100">
            <small className="text-muted">
              <i className="fas fa-info-circle me-1"></i>
              Course: {selectedVideo?.courseTitle}
            </small>
            <Button variant="secondary" onClick={handleCloseVideoModal}>
              <i className="fas fa-times me-1"></i>
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Course</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={editFormData.title || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        title: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={editFormData.category || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        category: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile App Development">
                      Mobile App Development
                    </option>
                    <option value="Programming Languages">
                      Programming Languages
                    </option>
                    <option value="Data Science">Data Science</option>
                    <option value="Machine Learning & AI">
                      Machine Learning & AI
                    </option>
                    <option value="Cloud Computing">Cloud Computing</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Level</Form.Label>
                  <Form.Select
                    value={editFormData.level || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        level: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Price (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="0.01"
                    value={editFormData.price || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        price: e.target.value,
                      })
                    }
                    placeholder="Enter course price"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={editFormData.status || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        status: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Lesson Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={editFormData.lessonTitle || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        lessonTitle: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Lesson Type</Form.Label>
                  <Form.Select
                    value={editFormData.lessonType || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        lessonType: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Type</option>
                    <option value="video">Video</option>
                    <option value="pdf">PDF</option>
                    <option value="text">Text</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Lesson Content (Upload Video or PDF)</Form.Label>
                  <Form.Control
                    type="file"
                    accept={editFormData.lessonType === 'video' ? 'video/*' : editFormData.lessonType === 'pdf' ? 'application/pdf' : '*'}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        // For now, just store the file object in state. You may want to upload to cloud storage in production.
                        setEditFormData({
                          ...editFormData,
                          lessonContent: file,
                        });
                      }
                    }}
                  />
                  {editingCourse?.lessonContent?.content && (
                    <div className="mt-2">
                      <small>Current: {editingCourse.lessonContent.type === 'video' ? 'Video' : editingCourse.lessonContent.type === 'pdf' ? 'PDF' : 'Text'} is already uploaded.</small>
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={editLoading}>
              {editLoading ? "Updating..." : "Update Course"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Modal */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete the course "
            <strong>{deletingCourse?.courseInfo?.title}</strong>"?
          </p>
          <p className="text-danger">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteConfirm}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Delete Course"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Seepostedvideo; 





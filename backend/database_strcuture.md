// Student Schema
const studentSchema = {
firstName: String,
lastName: String,
email: String,
phoneNumber: String,
academicYear: Number,
department: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Department'
},
section: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Class'
}
};

// Admin Schema
const adminSchema = {
firstName: String,
lastName: String,
email: String,
phoneNumber: String,
department: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Department'
}
};

// Department Schema
const departmentSchema = {
name: String,
overview: String,
head: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Admin'
}
};

// Course Schema
const courseSchema = {
name: String,
department: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Department'
},
year: Number,
semester: Number,
creditHours: Number,
lectureHours: Number,
overview: String,
// Embed lecturers or reference them in a separate collection if needed
lecturers: [{
type: mongoose.Schema.Types.ObjectId,
ref: 'User'
}]
};

// Club Schema
const clubSchema = {
name: String,
overview: String,
founder: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Student'
},
members: [{
type: mongoose.Schema.Types.ObjectId,
ref: 'Student'
}]
};

// Post Schema
const postSchema = {
author: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Student'
},
club: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Club'
},
class: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Class'
},
course: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Course'
},
content: String,
createdAt: {
type: Date,
default: Date.now
},
// Embed comments and likes for efficiency
comments: [{
user: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Student'
},
content: String,
createdAt: {
type: Date,
default: Date.now
}
}],
likes: [{
type: mongoose.Schema.Types.ObjectId,
ref: 'Student'
}]
};

// Building Schema
const buildingSchema = {
name: String,
blockNumber: String,
type: String,
description: String
};

// Class (Section) Schema
const classSchema = {
name: String,
representative: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Student'
},
students: [{
type: mongoose.Schema.Types.ObjectId,
ref: 'Student'
}]
};

// Report Schema
const reportSchema = {
post: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Post'
},
user: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Student'
},
reason: String // Add a reason for the report
};

// Event Schema
const eventSchema = {
building: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Building'
},
club: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Club'
},
startTime: Date,
endTime: Date,
description: String
};

// Note: A 'Request' table is a bit ambiguous in the original schema.
// A more robust design would be to embed requests or model them more specifically,
// e.g., 'ClubRequest', 'CourseEnrollmentRequest', etc.
// For now, it could be a simple collection with references.
const requestSchema = {
student: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Student'
},
description: String,
post: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Post'
},
status: {
type: String,
enum: ['pending', 'approved', 'rejected'],
default: 'pending'
}
};

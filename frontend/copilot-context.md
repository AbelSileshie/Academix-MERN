# Copilot Backend Context: Academix (MERN)

This file defines the complete context for scaffolding the **MERN-stack backend** of the Academix platform using Copilot. Save as `/backend/copilot-context.md`.

---

## 1. Project Structure & Files

```
/backend

├── package.json                 # NPM scripts & dependencies
├── tsconfig.json                # TypeScript config
├── .env.example                 # Environment variables template
│
├── src
│   ├── server.ts                # Entry point: Express app + middleware + routes
│   ├── config
│   │   ├── index.ts             # Load .env and export config
│   │   └── db.ts                # Mongoose connection
│   │
│   ├── models                   # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Profile.ts
│   │   ├── Department.ts
│   │   ├── Course.ts
│   │   ├── Building.ts
│   │   ├── Student.ts
│   │   ├── Admin.ts
│   │   ├── Request.ts
│   │   ├── Report.ts
│   │   ├── Notification.ts
│   │   ├── Post.ts
│   │   ├── Comment.ts
│   │   ├── Like.ts
│   │   ├── Club.ts
│   │   ├── Section.ts
│   │   └── Event.ts
│   │
│   ├── controllers             # Express route handlers
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── postController.ts
│   │   ├── threadController.ts
│   │   ├── requestController.ts
│   │   └── aiController.ts
│   │
│   ├── services                # Business logic & integrations
│   │   ├── authService.ts       # JWT gen & validation
│   │   ├── aiService.ts         # OpenAI GPT-4 stubs
│   │   └── emailService.ts      # Notifications
│   │
│   ├── routes                  # Express routers
│   │   ├── authRoutes.ts
│   │   ├── userRoutes.ts
│   │   ├── postRoutes.ts
│   │   ├── threadRoutes.ts
│   │   ├── requestRoutes.ts
│   │   └── aiRoutes.ts
│   │
│   ├── middleware              # Custom middleware
│   │   ├── auth.ts              # JWT guard
│   │   ├── validate.ts          # Joi/Zod validation
│   │   └── errorHandler.ts      # Centralized errors
│   │
│   ├── utils                   # Utilities (logger, etc.)
│   └── types                   # TypeScript interfaces
│
├── .gitignore
└── README.md
```

---

## 2. Environment Variables (`.env.example`)

```env
# MongoDB
MONGO_URI=mongodb://mongo:27017/academix
# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
# OpenAI
OPENAI_API_KEY=your_openai_key
# Redis (optional caching/queues)
REDIS_URL=redis://redis:6379
```

---

## 3. API Endpoints & Routes

All routes under `/api` prefix in `server.ts`.

### Auth & User

| Method | Path                 | Controller                     |
| ------ | -------------------- | ------------------------------ |
| POST   | `/api/auth/register` | `authController.register`      |
| POST   | `/api/auth/login`    | `authController.login`         |
| GET    | `/api/users/me`      | `userController.getProfile`    |
| PUT    | `/api/users/me`      | `userController.updateProfile` |

### Posts & Courses

| Method | Path             | Controller              |
| ------ | ---------------- | ----------------------- |
| GET    | `/api/posts`     | `postController.list`   |
| POST   | `/api/posts`     | `postController.create` |
| GET    | `/api/posts/:id` | `postController.get`    |
| PUT    | `/api/posts/:id` | `postController.update` |
| DELETE | `/api/posts/:id` | `postController.delete` |

### Community Threads

| Method | Path                                       | Controller                      |
| ------ | ------------------------------------------ | ------------------------------- |
| GET    | `/api/threads`                             | `threadController.listThreads`  |
| POST   | `/api/threads`                             | `threadController.createThread` |
| GET    | `/api/threads/:threadId/comments`          | `threadController.listComments` |
| POST   | `/api/threads/:threadId/comments`          | `threadController.addComment`   |
| POST   | `/api/threads/:threadId/comments/:id/vote` | `threadController.voteComment`  |
| POST   | `/api/threads/:threadId/comments/:id/flag` | `threadController.flagComment`  |

### Resource Requests

| Method | Path                        | Controller                  |
| ------ | --------------------------- | --------------------------- |
| POST   | `/api/requests`             | `requestController.create`  |
| GET    | `/api/requests`             | `requestController.list`    |
| PUT    | `/api/requests/:id/fulfill` | `requestController.fulfill` |

### AI Services

| Method | Path                                      | Controller               |
| ------ | ----------------------------------------- | ------------------------ |
| POST   | `/api/ai/summarize`                       | `aiController.summarize` |
| GET    | `/api/ai/recommendations?userId={userId}` | `aiController.recommend` |

---

## 4. Mongoose Models (in `src/models`)

Below are the full Mongoose schema files reflecting your Django models, including pre-save embedding hooks. Place each under `src/models/`.

---

### `User.ts`

```ts
import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  username: string;
  email: string;
  passwordHash: string;
  role: "student" | "instructor" | "admin";
  gender?: string;
  phoneNumber: string;
  telegram?: string;
  linkedin?: string;
  instagram?: string;
  studentRef?: Schema.Types.ObjectId;
  adminRef?: Schema.Types.ObjectId;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
    gender: { type: String },
    phoneNumber: { type: String, required: true },
    telegram: { type: String },
    linkedin: { type: String },
    instagram: { type: String },
    studentRef: { type: Schema.Types.ObjectId, ref: "Student" },
    adminRef: { type: Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("passwordHash")) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  }
  next();
});

export const User = model<IUser>("User", UserSchema);
```

---

### `Profile.ts`

```ts
import { Schema, model } from "mongoose";

export interface IProfile {
  userRef: Schema.Types.ObjectId;
  bio?: string;
  avatar?: string;
}

const ProfileSchema = new Schema<IProfile>(
  {
    userRef: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bio: { type: String },
    avatar: { type: String },
  },
  { timestamps: true }
);

export const Profile = model<IProfile>("Profile", ProfileSchema);
```

---

### `Department.ts`

```ts
import { Schema, model } from "mongoose";
import { embedText } from "../services/aiService";

export interface IDepartment {
  headRef?: Schema.Types.ObjectId;
  name: string;
  overview: string;
  embedding?: number[];
}

const DepartmentSchema = new Schema<IDepartment>(
  {
    headRef: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    overview: { type: String, required: true },
    embedding: { type: [Number] },
  },
  { timestamps: true }
);

DepartmentSchema.pre("save", async function () {
  this.embedding = await embedText(
    `Department name: ${this.name}, overview: ${this.overview}`
  );
});

export const Department = model<IDepartment>("Department", DepartmentSchema);
```

---

### `Course.ts`

```ts
import { Schema, model } from "mongoose";
import { embedText } from "../services/aiService";

export interface ICourse {
  name: string;
  departmentRefs: Schema.Types.ObjectId[];
  academicYear?: number;
  semester: number;
  creditHour: number;
  lectureHour: number;
  overview: string;
  embedding?: number[];
}

const CourseSchema = new Schema<ICourse>(
  {
    name: { type: String, required: true },
    departmentRefs: { type: [Schema.Types.ObjectId], ref: "Department" },
    academicYear: { type: Number },
    semester: { type: Number, required: true },
    creditHour: { type: Number, required: true },
    lectureHour: { type: Number, required: true },
    overview: { type: String, required: true },
    embedding: { type: [Number] },
  },
  { timestamps: true }
);

CourseSchema.pre("save", async function () {
  this.embedding = await embedText(
    `Course name: ${this.name}, overview: ${this.overview}`
  );
});

export const Course = model<ICourse>("Course", CourseSchema);
```

---

### `Building.ts`

```ts
import { Schema, model } from "mongoose";
import { embedText } from "../services/aiService";

export interface IBuilding {
  name: string;
  blockNumber: number;
  type: string;
  description: string;
  embedding?: number[];
}

const BuildingSchema = new Schema<IBuilding>(
  {
    name: { type: String, required: true },
    blockNumber: { type: Number, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    embedding: { type: [Number] },
  },
  { timestamps: true }
);

BuildingSchema.pre("save", async function () {
  this.embedding = await embedText(
    `Building name: ${this.name}, Description: ${this.description}, block number: ${this.blockNumber}, type: ${this.type}`
  );
});

export const Building = model<IBuilding>("Building", BuildingSchema);
```

---

### `Student.ts` & `Admin.ts`

```ts
import { Schema, model } from "mongoose";

export interface IStudent {
  studentId: string;
  academicYear?: number;
  isRep: boolean;
  sectionRef?: Schema.Types.ObjectId;
  departmentRef?: Schema.Types.ObjectId;
  groups: Schema.Types.ObjectId[];
  permissions: Schema.Types.ObjectId[];
}

const StudentSchema = new Schema<IStudent>(
  {
    studentId: { type: String, required: true },
    academicYear: { type: Number },
    isRep: { type: Boolean, default: false },
    sectionRef: { type: Schema.Types.ObjectId, ref: "Section" },
    departmentRef: { type: Schema.Types.ObjectId, ref: "Department" },
    groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
    permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }],
  },
  { timestamps: true }
);

export const Student = model<IStudent>("Student", StudentSchema);

export interface IAdmin {
  departmentRef: Schema.Types.ObjectId;
  groups: Schema.Types.ObjectId[];
  permissions: Schema.Types.ObjectId[];
}

const AdminSchema = new Schema<IAdmin>(
  {
    departmentRef: { type: Schema.Types.ObjectId, ref: "Department" },
    groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
    permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }],
  },
  { timestamps: true }
);

export const Admin = model<IAdmin>("Admin", AdminSchema);
```

---

### `Request.ts`, `Report.ts`, `Notification.ts`

```ts
import { Schema, model } from "mongoose";

const RequestSchema = new Schema(
  {
    description: { type: String, required: true },
    studentRef: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postData: { type: Schema.Types.Mixed },
    clubData: { type: Schema.Types.Mixed },
    eventData: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);
export const Request = model("Request", RequestSchema);

const ReportSchema = new Schema(
  {
    status: { type: Number },
    userRef: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postRef: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  },
  { timestamps: true }
);
export const Report = model("Report", ReportSchema);

const NotificationSchema = new Schema(
  {
    toUserRef: { type: Schema.Types.ObjectId, ref: "User" },
    status: { type: Number },
    content: { type: String },
  },
  { timestamps: true }
);
export const Notification = model("Notification", NotificationSchema);
```

---

### `Post.ts`, `Comment.ts`, `Like.ts`

```ts
import { Schema, model } from "mongoose";
import { embedText } from "../services/aiService";

const PostSchema = new Schema(
  {
    authorRef: { type: Schema.Types.ObjectId, ref: "User" },
    clubRef: { type: Schema.Types.ObjectId, ref: "Club" },
    sectionRef: { type: Schema.Types.ObjectId, ref: "Section" },
    courseRef: { type: Schema.Types.ObjectId, ref: "Course" },
    content: { type: String, default: "" },
    filePath: { type: String },
    embedding: { type: [Number] },
  },
  { timestamps: true }
);

PostSchema.pre("save", async function () {
  this.embedding = await embedText(
    `Post Author: ${this.authorRef}, content: ${this.content}`
  );
});
export const Post = model("Post", PostSchema);

const CommentSchema = new Schema(
  {
    content: { type: String, required: true },
    userRef: { type: Schema.Types.ObjectId, ref: "User" },
    postRef: { type: Schema.Types.ObjectId, ref: "Post" },
    embedding: { type: [Number] },
  },
  { timestamps: true }
);

CommentSchema.pre("save", async function () {
  this.embedding = await embedText(
    `User comment content: ${this.content}, made by: ${this.userRef}`
  );
});
export const Comment = model("Comment", CommentSchema);

const LikeSchema = new Schema(
  {
    userRef: { type: Schema.Types.ObjectId, ref: "User" },
    postRef: { type: Schema.Types.ObjectId, ref: "Post" },
  },
  { timestamps: true }
);

export const Like = model("Like", LikeSchema);
```

---

### `Club.ts`, `Section.ts`, `Event.ts`

```ts
import { Schema, model } from "mongoose";
import { embedText } from "../services/aiService";

const ClubSchema = new Schema(
  {
    name: { type: String, required: true },
    overview: { type: String, required: true },
    founderRef: { type: Schema.Types.ObjectId, ref: "User" },
    memberRefs: [{ type: Schema.Types.ObjectId, ref: "User" }],
    embedding: { type: [Number] },
  },
  { timestamps: true }
);

ClubSchema.pre("save", async function () {
  this.embedding = await embedText(
    `Club named: ${this.name}, overview: ${this.overview}`
  );
});

export const Club = model("Club", ClubSchema);

const SectionSchema = new Schema(
  {
    name: { type: String, required: true },
    repRef: { type: Schema.Types.ObjectId, ref: "User" },
    year: { type: Number },
    departmentRef: { type: Schema.Types.ObjectId, ref: "Department" },
  },
  { timestamps: true }
);

export const Section = model("Section", SectionSchema);

const EventSchema = new Schema(
  {
    buildingRef: { type: Schema.Types.ObjectId, ref: "Building" },
    clubRef: { type: Schema.Types.ObjectId, ref: "Club" },
    startTime: { type: Date },
    endTime: { type: Date },
    description: { type: String },
    embedding: { type: [Number] },
  },
  { timestamps: true }
);

EventSchema.pre("save", async function () {
  this.embedding = await embedText(
    `Event starting at: ${this.startTime}, description: ${this.description}`
  );
});

export const Event = model("Event", EventSchema);
```

---

## 5. Development & Scripts (in `package.json`)

. Development & Scripts (in `package.json`)

```json
{
  "scripts": {
    "start": "ts-node src/server.ts",
    "dev": "nodemon --watch src --exec ts-node src/server.ts",
    "build": "tsc",
    "lint": "eslint . --ext .ts",
    "test": "jest"
  }
}
```

---

> **Instructions to Copilot:**
>
> 1. Use this context to scaffold the full backend file structure, including **all** model files under `src/models/`.
> 2. Generate Mongoose schemas, controllers, services, routes, middleware, and config files exactly as outlined.
> 3. Stub AI integration in `aiService.ts` with `import OpenAI from 'openai'` and `embedText` function.
> 4. Implement JWT authentication middleware and request validation.
> 5. (Docker support removed as per user request.)
> 6. Ensure TypeScript typings, code comments, and modular architecture.

backend/
├── config/
│ ├── db.js
│ ├── passport.js
│ └── google-oauth.js
├── controllers/
│ ├── authController.js
│ ├── userController.js
│ ├── departmentController.js
│ ├── courseController.js
│ ├── classController.js
│ ├── postController.js
│ ├── commentController.js
│ ├── likeController.js
│ ├── clubController.js
│ ├── eventController.js
│ └── adminController.js
├── middleware/
│ ├── authMiddleware.js
│ ├── roleMiddleware.js
│ ├── geminiAnalyzer.js
│ └── uploadMiddleware.js
├── models/
│ ├── User.js
│ ├── Department.js
│ ├── Course.js
│ ├── Class.js
│ ├── Post.js
│ ├── Comment.js
│ ├── Like.js
│ ├── Club.js
│ └── Event.js
├── routes/
│ ├── authRoutes.js
│ ├── userRoutes.js
│ ├── departmentRoutes.js
│ ├── courseRoutes.js
│ ├── classRoutes.js
│ ├── postRoutes.js
│ ├── clubRoutes.js
│ ├── eventRoutes.js
│ ├── adminRoutes.js
│ └── index.js (main router)
├── uploads/
│ └── (for uploaded files like course materials, exam papers)
├── utils/
│ ├── jwt.js
│ ├── errorHandler.js
│ └── logger.js
├── tests/
│ ├── auth.test.js
│ ├── posts.test.js
│ └── (other feature tests)
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js

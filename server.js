import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';

import Job from './models/jobModel.js';
import Project from './models/projectModel.js';

// Resolve directory paths in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Dev logging middleware
if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  app.use(morgan('dev'));
}

// CORS Config - allow frontend credentials
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parser & Cookie parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/interview', interviewRoutes);

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'SkillBridge AI API is running...' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Pre-seed Database with Jobs & Projects
const seedDatabase = async () => {
  try {
    const jobCount = await Job.countDocuments();
    if (jobCount === 0) {
      await Job.create([
        {
          title: 'NEURAL_ARCHITECT',
          company: 'CYBERDYNAMICS_INC',
          location: 'REMOTE_OS',
          description: 'Build neural models and high-performance React user interfaces for digital intelligence.',
          skillsRequired: ['React', 'Rust', 'Python', 'TensorFlow', 'Docker', 'Kubernetes'],
          salary: '$140,000 - $185,000'
        },
        {
          title: 'SYSTEM_REDACTOR',
          company: 'OBLIVION_NETWORKS',
          location: 'HYBRID_LINK',
          description: 'Architect frontend platforms and microservice integrations using TypeScript, NextJS, and Postgres.',
          skillsRequired: ['TypeScript', 'Next.js', 'PostgreSQL', 'GraphQL', 'AWS'],
          salary: '$120,000 - $150,000'
        },
        {
          title: 'SENIOR_NODE_ENGINEER',
          company: 'DATA_STREAM_CORP',
          location: 'NEO_TC_01',
          description: 'Scale high-density backend systems, caching layers, and real-time network transaction buffers.',
          skillsRequired: ['Node.js', 'Express', 'MongoDB', 'Redis', 'TypeScript', 'Docker'],
          salary: '$135,000 - $170,000'
        }
      ]);
      console.log('Database pre-seeded with sample tech jobs.');
    }

    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.create([
        {
          title: 'Neural Dashboard Refactor',
          description: 'Refactor high-frequency streaming UI elements using React Memoization and Virtualization concepts.',
          difficulty: 'Advanced',
          skills: ['React', 'TypeScript'],
          githubUrl: 'https://github.com/skillbridge-ai/neural-dashboard'
        },
        {
          title: 'Rust Buffer Manager',
          description: 'Write a zero-copy memory sharding and cache synchronization pipeline in Rust for high-throughput messaging.',
          difficulty: 'Advanced',
          skills: ['Rust', 'Docker'],
          githubUrl: 'https://github.com/skillbridge-ai/rust-buffer-manager'
        },
        {
          title: 'Express Cluster Scaler',
          description: 'Implement distributed shard management and Redis lock layers inside an Express/MongoDB stack.',
          difficulty: 'Intermediate',
          skills: ['Node.js', 'Express', 'MongoDB', 'Redis'],
          githubUrl: 'https://github.com/skillbridge-ai/express-cluster-scaler'
        }
      ]);
      console.log('Database pre-seeded with recommended training projects.');
    }
  } catch (error) {
    console.error('Seeding database failed:', error.message);
  }
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  seedDatabase();
});

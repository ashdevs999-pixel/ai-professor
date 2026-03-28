-- Improve course descriptions for better conversion
-- Run in Supabase SQL Editor

-- Update Introduction to Machine Learning
UPDATE courses 
SET description = 'Master the fundamentals of machine learning from scratch. Learn supervised and unsupervised learning, model evaluation, feature engineering, and build real ML projects with Python. Perfect for beginners with basic programming knowledge.',
updated_at = NOW()
WHERE title = 'Introduction to Machine Learning';

-- Update Deep Learning
UPDATE courses 
SET description = 'Go beyond basics into neural networks and deep learning. Build CNNs, RNNs, and transformers from scratch. Learn PyTorch, computer vision, NLP, and deploy production-ready models. Intermediate level with hands-on projects.',
updated_at = NOW()
WHERE title = 'Deep Learning';

-- Update Natural Language Processing
UPDATE courses 
SET description = 'Master NLP and large language models. Learn text processing, embeddings, sentiment analysis, and build LLM-powered applications. Covers transformers, fine-tuning, RAG, and prompt engineering. Practical, project-based learning.',
updated_at = NOW()
WHERE title = 'Natural Language Processing';

-- Add Sample Data for Testing
-- Run in Supabase SQL Editor

-- Add sample courses
INSERT INTO courses (id, title, description, topic, difficulty, duration_weeks, is_published, created_at, updated_at) VALUES
  (gen_random_uuid(), 'Introduction to Machine Learning', 'Learn the fundamentals of machine learning, including supervised and unsupervised learning, neural networks, and practical applications.', 'Machine Learning', 'beginner', 8, true, NOW(), NOW()),
  (gen_random_uuid(), 'Deep Learning with PyTorch', 'Master deep learning techniques using PyTorch. Build neural networks, CNNs, RNNs, and transformers from scratch.', 'Deep Learning', 'intermediate', 12, true, NOW(), NOW()),
  (gen_random_uuid(), 'Natural Language Processing', 'Explore NLP techniques including tokenization, embeddings, transformers, and large language models.', 'NLP', 'intermediate', 10, true, NOW(), NOW()),
  (gen_random_uuid(), 'Computer Vision Essentials', 'Learn image processing, object detection, segmentation, and generative models for visual AI.', 'Computer Vision', 'intermediate', 10, true, NOW(), NOW()),
  (gen_random_uuid(), 'AI Ethics and Responsible AI', 'Understand the ethical implications of AI, bias mitigation, and best practices for responsible AI development.', 'AI Ethics', 'beginner', 4, true, NOW(), NOW()),
  (gen_random_uuid(), 'Generative AI and LLMs', 'Deep dive into generative AI, GPT models, diffusion models, and prompt engineering techniques.', 'Generative AI', 'advanced', 8, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Add sample news items
INSERT INTO news_items (id, title, summary, source_url, source_name, category, published_at, scraped_at, created_at) VALUES
  (gen_random_uuid(), 'OpenAI Announces GPT-5 with Revolutionary Capabilities', 'OpenAI has unveiled GPT-5, featuring improved reasoning, longer context windows, and multimodal understanding.', 'https://openai.com/blog/gpt-5', 'OpenAI Blog', 'announcements', NOW() - INTERVAL '2 hours', NOW(), NOW()),
  (gen_random_uuid(), 'Anthropic Claude 4 Sets New Benchmarks in AI Safety', 'Anthropic releases Claude 4 with enhanced constitutional AI and improved safety measures.', 'https://anthropic.com/news/claude-4', 'Anthropic News', 'announcements', NOW() - INTERVAL '5 hours', NOW(), NOW()),
  (gen_random_uuid(), 'Google DeepMind Achieves Breakthrough in Protein Folding', 'New AlphaFold model can predict protein structures with 99% accuracy in seconds.', 'https://deepmind.google/blog/alphafold', 'Google AI Blog', 'research', NOW() - INTERVAL '8 hours', NOW(), NOW()),
  (gen_random_uuid(), 'Meta Open Sources Llama 4 Model Weights', 'Meta releases Llama 4, a 400B parameter model, fully open source for commercial use.', 'https://ai.meta.com/blog/llama-4', 'Meta AI', 'announcements', NOW() - INTERVAL '12 hours', NOW(), NOW()),
  (gen_random_uuid(), 'Microsoft Integrates Copilot Across All Products', 'Microsoft announces deep AI integration in Office, Windows, and Azure services.', 'https://blogs.microsoft.com/ai/copilot', 'Microsoft AI Blog', 'announcements', NOW() - INTERVAL '1 day', NOW(), NOW()),
  (gen_random_uuid(), 'New Research Shows AI Can Detect Cancer Earlier Than Doctors', 'Stanford study demonstrates AI system detecting early-stage cancers with 95% accuracy.', 'https://arxiv.org/ai-cancer', 'arXiv cs.AI', 'research', NOW() - INTERVAL '1 day', NOW(), NOW()),
  (gen_random_uuid(), 'Hugging Face Releases New Open Source Vision Model', 'The model outperforms GPT-4V on multiple benchmarks while being fully open source.', 'https://huggingface.co/blog/vision', 'Hugging Face Blog', 'launches', NOW() - INTERVAL '2 days', NOW(), NOW()),
  (gen_random_uuid(), 'AI Startup Raises $500M to Build AGI', 'New company founded by ex-OpenAI researchers aims to achieve artificial general intelligence.', 'https://techcrunch.com/ai-funding', 'TechCrunch AI', 'news', NOW() - INTERVAL '2 days', NOW(), NOW()),
  (gen_random_uuid(), 'European Union Finalizes AI Regulations', 'New EU AI Act sets strict guidelines for high-risk AI applications and transparency requirements.', 'https://theverge.com/eu-ai-act', 'The Verge AI', 'news', NOW() - INTERVAL '3 days', NOW(), NOW()),
  (gen_random_uuid(), 'Open Source AI Beats Commercial Models in Benchmark', 'Community-driven model achieves state-of-the-art results on MMLU and HellaSwag benchmarks.', 'https://paperswithcode.com/sota', 'Papers With Code', 'research', NOW() - INTERVAL '3 days', NOW(), NOW())
ON CONFLICT (source_url) DO NOTHING;

SELECT 'Sample data added successfully!' as status;

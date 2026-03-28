-- Fix doubled URLs in news_audio table
UPDATE news_audio 
SET file_path = REPLACE(file_path, 'https://dgbkasfjrsjzdqttkfac.supabase.co/storage/v1/object/public/news-audio/', '')
WHERE file_path LIKE '%https://dgbkasfjrsjzdqttkfac.supabase.co/storage/v1/object/public/news-audio/%';

-- Delete records with completely broken paths
DELETE FROM news_audio 
WHERE file_path LIKE '%https://%https://%';

SELECT 'Fixed!', COUNT(*) as total FROM news_audio;

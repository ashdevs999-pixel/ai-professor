-- Add existing courses to learning paths

-- Get path IDs
DO $$
DECLARE
    fundamentals_path UUID;
    engineer_path UUID;
    researcher_path UUID;
    ml_course UUID;
    dl_course UUID;
    nlp_course UUID;
BEGIN
    -- Get path IDs
    SELECT id INTO fundamentals_path FROM learning_paths WHERE slug = 'ai-fundamentals';
    SELECT id INTO engineer_path FROM learning_paths WHERE slug = 'ai-engineer';
    SELECT id INTO researcher_path FROM learning_paths WHERE slug = 'ai-researcher';
    
    -- Get course IDs
    SELECT id INTO ml_course FROM courses WHERE title = 'Introduction to Machine Learning';
    SELECT id INTO dl_course FROM courses WHERE title = 'Deep Learning';
    SELECT id INTO nlp_course FROM courses WHERE title = 'Natural Language Processing';
    
    -- AI Fundamentals Path (beginner)
    IF fundamentals_path IS NOT NULL AND ml_course IS NOT NULL THEN
        INSERT INTO path_courses (path_id, course_id, order_index, is_required)
        VALUES (fundamentals_path, ml_course, 1, true)
        ON CONFLICT (path_id, course_id) DO NOTHING;
    END IF;
    
    -- AI Engineer Path (intermediate)
    IF engineer_path IS NOT NULL THEN
        IF ml_course IS NOT NULL THEN
            INSERT INTO path_courses (path_id, course_id, order_index, is_required)
            VALUES (engineer_path, ml_course, 1, true)
            ON CONFLICT (path_id, course_id) DO NOTHING;
        END IF;
        
        IF dl_course IS NOT NULL THEN
            INSERT INTO path_courses (path_id, course_id, order_index, is_required)
            VALUES (engineer_path, dl_course, 2, true)
            ON CONFLICT (path_id, course_id) DO NOTHING;
        END IF;
    END IF;
    
    -- AI Researcher Path (advanced)
    IF researcher_path IS NOT NULL THEN
        IF ml_course IS NOT NULL THEN
            INSERT INTO path_courses (path_id, course_id, order_index, is_required)
            VALUES (researcher_path, ml_course, 1, true)
            ON CONFLICT (path_id, course_id) DO NOTHING;
        END IF;
        
        IF dl_course IS NOT NULL THEN
            INSERT INTO path_courses (path_id, course_id, order_index, is_required)
            VALUES (researcher_path, dl_course, 2, true)
            ON CONFLICT (path_id, course_id) DO NOTHING;
        END IF;
        
        IF nlp_course IS NOT NULL THEN
            INSERT INTO path_courses (path_id, course_id, order_index, is_required)
            VALUES (researcher_path, nlp_course, 3, true)
            ON CONFLICT (path_id, course_id) DO NOTHING;
        END IF;
    END IF;
    
    RAISE NOTICE 'Courses added to learning paths!';
END $$;

SELECT 'Done!' as status;

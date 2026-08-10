-- ===========================================================================
-- Vastra Alankara AI - Relational Database Schema Definitions (Supabase / PostgreSQL)
-- ===========================================================================

-- 1. PRODUCT CATALOGUE TABLE (Garments)
-- Stores the clothes available for Virtual Try-On
CREATE TABLE IF NOT EXISTS garments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,           -- e.g. 'Sarees', 'Shirts', 'Dresses', 'Jeans', 'Jackets'
    gender VARCHAR(50) DEFAULT 'Women',             -- 'Men' or 'Women'
    image_url TEXT NOT NULL,                  -- Local or cloud link to the garment image
    price INTEGER DEFAULT 3999,               -- Price in Rs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CUSTOMER TRY-ON FEEDBACK TABLE
-- Tracks virtual try-on session outcomes, CSAT scores, and completion metrics
CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,  -- Prevents duplicate ratings for a single generation session
    gender VARCHAR(50) NOT NULL,             -- Contextual gender of the visitor
    selected_garment VARCHAR(255) NOT NULL,   -- Name of the garment tested
    feedback_emoji VARCHAR(10),               -- Emoji value (😍, 😄, 🙂, 😐, 😞 or NULL if skipped)
    feedback_score INTEGER,                   -- Score mapped to emoji (5, 4, 3, 2, 1 or NULL if skipped)
    feedback_status VARCHAR(50) NOT NULL,     -- 'submitted' or 'skipped'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TECHNICAL SUPPORT TICKETS TABLE
-- Stores tickets filed from the Admin/Tech Support interface
CREATE TABLE IF NOT EXISTS support_tickets (
    id VARCHAR(50) PRIMARY KEY,                -- e.g. 'VAS-1234'
    subject VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,           -- e.g. 'Hardware', 'Catalogue'
    priority VARCHAR(50) NOT NULL,            -- 'Low', 'Medium', 'High'
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Open',        -- 'Open', 'Resolved'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index structures to optimize analytics queries
CREATE INDEX IF NOT EXISTS idx_feedback_garment ON feedback(selected_garment);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(feedback_status);
CREATE INDEX IF NOT EXISTS idx_garments_gender ON garments(gender);

-- 4. ADMIN USERS TABLE
-- Stores credentials of administrators
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

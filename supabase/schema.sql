-- users metadata is stored in auth.user_metadata by Supabase Auth

-- posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  title text NOT NULL,
  content text NOT NULL,
  tags text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_deleted boolean DEFAULT false
);

-- comments
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  author uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- favorites
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, post_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);

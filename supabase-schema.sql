-- SMILE Zone Assessment App — Full Schema
-- Run this in the Supabase SQL Editor before first use.

-- ── Questions ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS questions (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  age_group      TEXT        NOT NULL CHECK (age_group IN ('13u', '14-17', '18plus')),
  category       TEXT        NOT NULL CHECK (category IN ('mental_mindset', 'baseball_iq')),
  question_type  TEXT        NOT NULL CHECK (question_type IN ('multiple_choice', 'multi_select', 'fill_blank', 'written')),
  question_text  TEXT        NOT NULL,
  options        JSONB,
  correct_answer JSONB,
  difficulty     TEXT        NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  sub_category   TEXT        NOT NULL,
  content_hash   TEXT        NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_questions_content_hash
  ON questions (content_hash);

CREATE INDEX IF NOT EXISTS idx_questions_lookup
  ON questions (age_group, sub_category);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- ── Assessments ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS assessments (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  player_first_name    TEXT        NOT NULL,
  player_email         TEXT        NOT NULL,
  age_group            TEXT        NOT NULL CHECK (age_group IN ('13u', '14-17', '18plus')),
  session_id           TEXT        NOT NULL,
  questions_json       JSONB       NOT NULL,
  answers_json         JSONB       NOT NULL,
  mental_mindset_score INTEGER     NOT NULL,
  baseball_iq_score    INTEGER     NOT NULL,
  sub_scores           JSONB,
  archetype            TEXT,
  report_html          TEXT,
  email_sent           BOOLEAN     DEFAULT FALSE,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessments_email
  ON assessments (player_email, created_at);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- ── Rate Limits ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS rate_limits (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash    TEXT        NOT NULL,
  action     TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup
  ON rate_limits (ip_hash, action, created_at);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

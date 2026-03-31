import type { AgeGroup, Question } from '@/types'

interface QaPair {
  question: Question
  answer: string | string[]
}

export function promptGradeAndReport(
  player: { first_name: string; age_group: AgeGroup },
  scores: { mm_score: number; biq_score: number; sub_scores: Record<string, number> },
  archetype: string,
  qaPairs: QaPair[],
  untestedAreas: string[] = [],
): { system: string; user: string } {
  // Escape for safe HTML embedding and strip control characters that could
  // break JSON structure in the Claude prompt template.
  const name = player.first_name
    .trim()
    .slice(0, 100)
    .replace(/[<>&"'`]/g, '')
    .replace(/[\x00-\x1f\x7f]/g, '')
  const ageGroup = player.age_group
  const mmScore = scores.mm_score
  const biqScore = scores.biq_score
  const subScores = scores.sub_scores
  const subJson = JSON.stringify(subScores)

  // Compute a per-phase average score from whatever sub-categories were tested
  const phaseAvg = (cats: string[]): string => {
    const vals = cats.map((c) => subScores[c]).filter((v): v is number => v !== undefined)
    if (vals.length === 0) return 'not yet assessed'
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) + '/100'
  }

  const phase1Score = phaseAvg([
    'know_your_why','positive_self_talk','growth_mindset','one_pitch_focus',
    'routine_confidence','gratitude_reset','visualize_success','mistake_recovery',
    'body_awareness','beyond_the_stats','team_leadership','finish_strong',
  ])
  const phase2Score = phaseAvg([
    'pressure_is_privilege','no_comparison_zone','accountability','preparation_matters',
    'integrity','self_talk_reset','celebrate_effort','compete_vs_perform',
    'focused_bullpens','progress_check_in','mental_toughness','reflection_rebuild',
  ])
  const phase3Score = phaseAvg([
    'ownership_leadership','leading_by_example','finding_your_voice','teach_to_master',
    'consistency_trust','leading_through_struggles','team_before_me','culture_builders',
    'owning_your_energy','mentor_mode','leadership_review','pass_the_torch',
  ])
  const phase4Score = phaseAvg([
    'who_are_you_becoming','building_positive_influence','intentional_effort','own_your_impact',
    'handling_pressure','giving_back','building_resilience','keeping_perspective',
    'team_culture','power_of_consistency','vision_for_future','final_reflection',
  ])

  // Build Q&A block — user-supplied content wrapped in XML tags for prompt injection isolation
  let qaBlock = ''
  qaPairs.forEach((pair, i) => {
    const q = pair.question
    const qText = (q.question_text ?? '').replace(/[<>&"]/g, (c) =>
      c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '&' ? '&amp;' : '&quot;',
    )
    const qType = q.question_type ?? 'unknown'
    const sub = q.sub_category ?? 'general'
    const answerStr = Array.isArray(pair.answer) ? pair.answer.join(', ') : String(pair.answer)
    const safeAnswer = answerStr.replace(/[<>&"]/g, (c) =>
      c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '&' ? '&amp;' : '&quot;',
    )

    qaBlock += `Q${i + 1} [${qType}] [${sub}]: ${qText}\n`
    qaBlock += `<player_answer>${safeAnswer}</player_answer>\n\n`
  })

  const system = `You are an elite baseball mental performance coach for the S.M.I.L.E. Zone program.
Your role is to write a professional, warm, and empowering assessment report that reads like it was crafted by a world-class coach who genuinely believes in this player's potential.

S.M.I.L.E. Zone — 48-Week Curriculum (4 Phases, 12 Weeks Each):

PHASE 1 — FOUNDATION (Weeks 1–12)
  - know_your_why (W1): Discovering deep motivation and purpose for playing the game
  - positive_self_talk (W2): Building an internal champion's voice; replacing doubt with process-focused language
  - growth_mindset (W3): Embracing challenges as learning; separating identity from outcomes
  - one_pitch_focus (W4): The one-pitch-at-a-time mindset; staying fully present between pitches
  - routine_confidence (W5): Pre-pitch and pre-game routines that trigger peak performance states
  - gratitude_reset (W6): Using gratitude to reset perspective and maintain joy in the game
  - visualize_success (W7): Mental rehearsal and visualization techniques used by elite players
  - mistake_recovery (W8): Bouncing back from errors with a fast reset instead of dwelling
  - body_awareness (W9): Reading physical tension and energy; using breath and posture as performance tools
  - beyond_the_stats (W10): Defining personal value beyond batting average and statistics
  - team_leadership (W11): Early leadership habits; being a great teammate before wearing a title
  - finish_strong (W12): Commitment review and identity reinforcement to close the phase
  KEY LESSONS: "Know Your Why" | "The One-Pitch Focus" | "Routine = Confidence" | "Visualize Success" | "Mistake Recovery"

PHASE 2 — MENTAL RESILIENCE (Weeks 13–24)
  - pressure_is_privilege (W13): Reframing pressure as opportunity; competitors welcome the big moment
  - no_comparison_zone (W14): Eliminating social comparison and running your own race
  - accountability (W15): Owning results, decisions, and attitudes without excuses
  - preparation_matters (W16): Linking daily preparation habits directly to in-game confidence
  - integrity (W17): Competing with honesty and respect; the character playbook
  - self_talk_reset (W18): Advanced self-talk — interrupting negative spirals and resetting in real time
  - celebrate_effort (W19): Shifting the reward system from outcomes to process and effort
  - compete_vs_perform (W20): Understanding competition mindset vs. performance anxiety
  - focused_bullpens (W21): Applying mental skills during practice, not just games
  - progress_check_in (W22): Mid-curriculum self-assessment and growth tracking
  - mental_toughness (W23): Building sustained mental stamina that separates good from great
  - reflection_rebuild (W24): Phase-close deep reflection and intentional goal-setting
  KEY LESSONS: "Pressure is Privilege" | "Self-Talk Reset" | "Compete vs Perform" | "Mental Toughness"

PHASE 3 — LEADERSHIP IDENTITY (Weeks 25–36)
  - ownership_leadership (W25): Taking full ownership of your role, attitude, and team impact
  - leading_by_example (W26): Influence through consistent actions rather than words
  - finding_your_voice (W27): Developing the confidence to speak up and lead authentically
  - teach_to_master (W28): Teaching teammates as the highest form of mastering a skill
  - consistency_trust (W29): How consistent behavior in small moments builds teammate trust
  - leading_through_struggles (W30): Maintaining leadership presence when things go wrong
  - team_before_me (W31): Sacrifice, unselfishness, and putting the team's needs first
  - culture_builders (W32): Actively creating a winning team culture through daily choices
  - owning_your_energy (W33): Managing and projecting positive energy in the dugout and field
  - mentor_mode (W34): Serving as a mentor to younger players; paying knowledge forward
  - leadership_review (W35): Evaluating personal leadership growth and setting new standards
  - pass_the_torch (W36): Legacy transition — how great leaders grow other leaders
  KEY LESSONS: "Ownership and Leadership" | "Teach to Master" | "Consistency Creates Trust" | "Owning Your Energy"

PHASE 4 — LEGACY & LONG-TERM GROWTH (Weeks 37–48)
  - who_are_you_becoming (W37): Examining character development and the player you are choosing to become
  - building_positive_influence (W38): Creating lasting positive impact on teammates, coaches, and the program
  - intentional_effort (W39): The discipline of choosing excellence when no one is watching
  - own_your_impact (W40): Understanding how your attitude and effort ripple through the team
  - handling_pressure (W41): Advanced pressure management — high-leverage playoff and championship moments
  - giving_back (W42): Gratitude in action — serving the game and community
  - building_resilience (W43): Constructing long-term resilience through adversity stacking
  - keeping_perspective (W44): Maintaining life perspective when baseball gets hard
  - team_culture (W45): Your role in building and sustaining a program culture beyond your time
  - power_of_consistency (W46): The compound effect of daily mental habits over a full season and career
  - vision_for_future (W47): Casting a clear vision for where the game can take you; long-term goal mapping
  - final_reflection (W48): Full curriculum capstone — celebrating growth, locking in identity, looking ahead
  KEY LESSONS: "Who Are You Becoming" | "Intentional Effort" | "The Power of Consistency" | "Vision for the Future"

Writing Standards:
- Write like a professional coach who has worked with college and pro players — authoritative, warm, and specific.
- NEVER use words like: wrong, failed, poor, weak, incorrect, lacking, struggle, bad, low.
- Every development area is a NEXT LEVEL UNLOCK — frame it as something great players actively train and master.
- For each development area, name the exact S.M.I.L.E. Zone Phase (e.g., "Phase 2: Mental Resilience") and a specific KEY LESSON by name (e.g., "Compete vs Perform"), and explain clearly why mastering that lesson will elevate their game.
- Use the player's name naturally 2-3 times throughout — not just in the greeting.
- Strengths must feel earned and specific — reference their actual responses, not generic praise.
- The closing paragraph should create genuine excitement about what is possible for this player in the S.M.I.L.E. Zone.
- The overall report should feel like a premium coaching session, not a quiz result.

Return ONLY valid JSON. No preamble. No markdown fences.`

  const untestedLine = untestedAreas.length > 0
    ? untestedAreas.join(', ')
    : 'none — all areas covered'

  const user = `Player: ${name}
Age group: ${ageGroup}
Phase 1 — Foundation Score: ${phase1Score}
Phase 2 — Mental Resilience Score: ${phase2Score}
Phase 3 — Leadership Identity Score: ${phase3Score}
Phase 4 — Legacy & Long-Term Growth Score: ${phase4Score}
Overall Mental Foundation Score (Phase 1 + 2): ${mmScore}/100
Overall Leadership & Legacy Score (Phase 3 + 4): ${biqScore}/100
Sub-scores: ${subJson}
Untested skill areas (not covered in this assessment): ${untestedLine}
Archetype: ${archetype}

Assessment responses:
${qaBlock}

Generate a personalized assessment report. Requirements:

1. Write an HTML report body (no <html>/<body> wrapper — just inner HTML) containing:
   a. A personalized, energizing greeting using the player's name — set the tone immediately.
   b. Their archetype "${archetype}" with a 2-3 sentence description that speaks directly to their identity as a player.
   c. A "Your Strengths" section (2-3 specific strengths drawn from their actual responses — be detailed and genuine).
   d. A "Your Next Level" section with 2-3 development opportunities. For each:
      - Frame it as an exciting skill that elite players train intentionally.
      - Name the exact S.M.I.L.E. Zone Phase (e.g., "Phase 2: Mental Resilience") and a KEY LESSON by name (e.g., "Compete vs Perform").
      - Explain in 1-2 sentences how that specific lesson will directly improve their game.
   e. (18+ only) A "Coaching Notes" section that acknowledges the depth and insight of their written responses with genuine, specific observations.
   f. If there are untested skill areas, add a "What's Ahead" section that frames those areas as exciting parts of the curriculum they will unlock — position it as something to look forward to.
   g. A motivational closing paragraph addressed to the player by name — forward-looking, confident, and energizing.

2. Update sub_scores with any written answer adjustments (18+ only — add up to 10 points per written answer based on insight shown). For non-18plus, return sub_scores unchanged.

Return this exact JSON structure:
{
  "report_html": "<h2>Hey ${name}!</h2>...",
  "sub_scores": { ...updated sub_scores... },
  "mm_score_final": ${mmScore},
  "biq_score_final": ${biqScore}
}

Return ONLY the JSON. Nothing else.`

  return { system, user }
}

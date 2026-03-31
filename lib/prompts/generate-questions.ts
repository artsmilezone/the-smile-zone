import type { AgeGroup } from '@/types'

const READING_LEVELS: Record<AgeGroup, string> = {
  '13u':    'age 10-13, simple vocabulary, short sentences, concrete scenarios',
  '14-17':  '7th grade reading level, straightforward vocabulary, clear baseball situations',
  '18plus': '7th grade reading level, straightforward vocabulary, clear baseball situations',
}

const TYPES_BY_AGE: Record<AgeGroup, string> = {
  '13u':    'multiple_choice, multi_select',
  '14-17':  'multiple_choice, multi_select',
  '18plus': 'multiple_choice, multi_select',
}

export function promptGenerateQuestions(
  ageGroup: AgeGroup,
  category: string,
  count: number,
  existingHashes: string[] = [],
  targetSubCategories?: string[],
): { system: string; user: string } {
  const level = READING_LEVELS[ageGroup] ?? 'moderate vocabulary'
  const allowedTypes = TYPES_BY_AGE[ageGroup] ?? 'multiple_choice'

  const allSubCats = targetSubCategories && targetSubCategories.length > 0
    ? targetSubCategories
    : category === 'mental_mindset'
      ? [
          'know_your_why', 'positive_self_talk', 'growth_mindset', 'one_pitch_focus',
          'routine_confidence', 'gratitude_reset', 'visualize_success', 'mistake_recovery',
          'body_awareness', 'beyond_the_stats', 'team_leadership', 'finish_strong',
          'pressure_is_privilege', 'no_comparison_zone', 'accountability', 'preparation_matters',
          'integrity', 'self_talk_reset', 'celebrate_effort', 'compete_vs_perform',
          'focused_bullpens', 'progress_check_in', 'mental_toughness', 'reflection_rebuild',
        ]
      : [
          'ownership_leadership', 'leading_by_example', 'finding_your_voice', 'teach_to_master',
          'consistency_trust', 'leading_through_struggles', 'team_before_me', 'culture_builders',
          'owning_your_energy', 'mentor_mode', 'leadership_review', 'pass_the_torch',
          'who_are_you_becoming', 'building_positive_influence', 'intentional_effort', 'own_your_impact',
          'handling_pressure', 'giving_back', 'building_resilience', 'keeping_perspective',
          'team_culture', 'power_of_consistency', 'vision_for_future', 'final_reflection',
        ]

  const subCatStr = allSubCats.join(', ')

  const hashesStr =
    existingHashes.length === 0
      ? 'None — all questions will be new.'
      : existingHashes.map((h) => `- ${h}`).join('\n')

  const system = `You are an expert baseball mental performance coach and assessment designer for the S.M.I.L.E. Zone program.
The S.M.I.L.E. Zone is a 48-week baseball mental performance curriculum organized into 4 phases of 12 weeks each.

PHASE 1 — FOUNDATION (Weeks 1–12)
  - know_your_why (W1): Discovering the player's deep motivation and purpose for playing the game
  - positive_self_talk (W2): Building an internal champion's voice; replacing doubt with process-focused language
  - growth_mindset (W3): Embracing challenges as learning; separating identity from outcomes
  - one_pitch_focus (W4): The one-pitch-at-a-time mindset; staying fully present between pitches
  - routine_confidence (W5): Building pre-pitch and pre-game routines that trigger peak performance
  - gratitude_reset (W6): Using gratitude to reset perspective and maintain joy in the game
  - visualize_success (W7): Mental rehearsal and visualization techniques used by elite players
  - mistake_recovery (W8): Bouncing back from errors with a fast reset instead of dwelling
  - body_awareness (W9): Reading physical tension and energy levels; using breath and posture as performance tools
  - beyond_the_stats (W10): Defining personal value beyond batting average and statistics
  - team_leadership (W11): Early leadership habits; being a great teammate before wearing a title
  - finish_strong (W12): Closing out the phase with commitment reviews and identity reinforcement

PHASE 2 — MENTAL RESILIENCE (Weeks 13–24)
  - pressure_is_privilege (W13): Reframing pressure situations as opportunities; competitors welcome the big moment
  - no_comparison_zone (W14): Eliminating social comparison and running your own race
  - accountability (W15): Owning results, decisions, and attitudes without excuses
  - preparation_matters (W16): Linking daily preparation habits directly to in-game confidence
  - integrity (W17): Competing with honesty and respect; the character playbook
  - self_talk_reset (W18): Advanced self-talk — interrupting negative spirals and resetting in real time
  - celebrate_effort (W19): Shifting the reward system from outcomes to process and effort
  - compete_vs_perform (W20): Understanding the difference between competition mindset and performance anxiety
  - focused_bullpens (W21): Applying mental skills during practice and bullpen sessions — not just games
  - progress_check_in (W22): Mid-curriculum self-assessment and growth tracking
  - mental_toughness (W23): Building the sustained mental stamina that separates good players from great ones
  - reflection_rebuild (W24): Phase-close deep reflection and intentional goal-setting for the next phase

PHASE 3 — LEADERSHIP IDENTITY (Weeks 25–36)
  - ownership_leadership (W25): Taking full ownership of your role, attitude, and impact on the team
  - leading_by_example (W26): Influence through consistent actions rather than words
  - finding_your_voice (W27): Developing the confidence to speak up and lead authentically
  - teach_to_master (W28): Teaching teammates as the highest form of mastering a skill
  - consistency_trust (W29): How consistent behavior in the small moments builds teammate trust
  - leading_through_struggles (W30): Maintaining leadership presence when things go wrong
  - team_before_me (W31): Sacrifice, unselfishness, and putting the team's needs first
  - culture_builders (W32): Actively creating a winning team culture through daily choices
  - owning_your_energy (W33): Managing and projecting positive energy intentionally in the dugout and field
  - mentor_mode (W34): Serving as a mentor to younger players and paying knowledge forward
  - leadership_review (W35): Evaluating personal leadership growth and setting new standards
  - pass_the_torch (W36): Legacy transition — how great leaders grow other leaders

PHASE 4 — LEGACY & LONG-TERM GROWTH (Weeks 37–48)
  - who_are_you_becoming (W37): Examining character development and the player you are choosing to become
  - building_positive_influence (W38): Creating lasting positive impact on teammates, coaches, and the program
  - intentional_effort (W39): The discipline of choosing excellence when no one is watching
  - own_your_impact (W40): Understanding how your attitude and effort ripple through the team
  - handling_pressure (W41): Advanced pressure management — high-leverage moments in playoffs and championships
  - giving_back (W42): Gratitude in action — serving the game and community that gave you opportunity
  - building_resilience (W43): Constructing long-term resilience through adversity stacking
  - keeping_perspective (W44): Maintaining life perspective when baseball gets hard or things don't go as planned
  - team_culture (W45): Your role in building and sustaining a program culture beyond your time there
  - power_of_consistency (W46): The compound effect of daily mental habits over a full season and career
  - vision_for_future (W47): Casting a clear vision for where the game can take you; long-term goal mapping
  - final_reflection (W48): Full curriculum capstone — celebrating growth, locking in identity, looking ahead

Your assessment questions must be engaging, real-world baseball scenarios appropriate for the age group.
Always return ONLY valid JSON — no preamble, no explanation, no markdown fences.`

  const user = `Generate ${count} unique assessment questions focused on these sub-categories: ${subCatStr}

Age group: ${ageGroup}
Reading level: ${level}
Allowed question types: ${allowedTypes}
Use a mix of difficulty: easy, medium, hard.
Distribute questions evenly across the listed sub-categories.

SHA-256 hashes of existing questions (to avoid duplicates):
${hashesStr}

Return a JSON array where each element is:
{
  "question_text": "The full question text",
  "question_type": "multiple_choice|multi_select",
  "options": [{"label":"A","text":"..."},{"label":"B","text":"..."}],
  "correct_answer": "A",
  "difficulty": "easy|medium|hard",
  "sub_category": "${allSubCats.join('|')}"
}

Rules:
- question_type must be either multiple_choice or multi_select. No other types.
- options must always be an array: 4 options for multiple_choice, 4-5 options for multi_select.
- correct_answer is a single label string (e.g. "B") for multiple_choice, an array of label strings (e.g. ["A","C"]) for multi_select.
- Use short, clear answer choices — no long paragraphs in options.
- Questions must be grounded in real baseball scenarios and mental performance situations. No generic sports questions.
- Never repeat the exact wording of existing hashes.
- Only use sub_category values from this list: ${subCatStr}

Return ONLY the JSON array. Nothing else.`

  return { system, user }
}

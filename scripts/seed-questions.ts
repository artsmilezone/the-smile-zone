/**
 * Seeds the Supabase questions table with 30 starter questions:
 * 5 mental_mindset + 5 baseball_iq for each of the 3 age groups.
 *
 * Run: npx tsx scripts/seed-questions.ts
 */
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  { auth: { persistSession: false } },
)

function hash(text: string): string {
  return createHash('sha256').update(text.toLowerCase().trim()).digest('hex')
}

const questions = [

  // ─────────────────────────────────────────────────────────────────
  // 13u — MENTAL MINDSET
  // ─────────────────────────────────────────────────────────────────
  {
    age_group: '13u', category: 'mental_mindset', difficulty: 'easy',
    question_type: 'multiple_choice', sub_category: 'one_pitch_focus',
    question_text: 'You just struck out with runners on base. As you walk back to the dugout, what\'s the best thing to focus on?',
    options: [
      { label: 'A', text: 'Replay the strikeout in your head so you don\'t repeat it' },
      { label: 'B', text: 'Next pitch — fresh start, forget it happened' },
      { label: 'C', text: 'Tell your teammates what you did wrong' },
      { label: 'D', text: 'Think about how everyone is watching you' },
    ],
    correct_answer: 'B',
  },
  {
    age_group: '13u', category: 'mental_mindset', difficulty: 'easy',
    question_type: 'multiple_choice', sub_category: 'pressure_handling',
    question_text: 'You feel nervous and your heart is racing right before a big at-bat. What\'s the smartest thing to do?',
    options: [
      { label: 'A', text: 'Skip your normal routine to try something new' },
      { label: 'B', text: 'Take slow deep breaths and focus on the ball' },
      { label: 'C', text: 'Think about everything that could go wrong' },
      { label: 'D', text: 'Tell yourself you\'re not nervous' },
    ],
    correct_answer: 'B',
  },
  {
    age_group: '13u', category: 'mental_mindset', difficulty: 'medium',
    question_type: 'multi_select', sub_category: 'resilience',
    question_text: 'After making an error in the field, which of these will help you bounce back fastest? Select all that apply.',
    options: [
      { label: 'A', text: 'Say "next play" to yourself and move on' },
      { label: 'B', text: 'Replay the error over and over in your mind' },
      { label: 'C', text: 'Keep your body language confident — head up, shoulders back' },
      { label: 'D', text: 'Stay alert and ready for the very next play' },
    ],
    correct_answer: ['A', 'C', 'D'],
  },
  {
    age_group: '13u', category: 'mental_mindset', difficulty: 'easy',
    question_type: 'multiple_choice', sub_category: 'self_talk',
    question_text: 'Which is the best example of positive self-talk right before a big at-bat?',
    options: [
      { label: 'A', text: '"I always mess up when it matters"' },
      { label: 'B', text: '"I hope I don\'t strike out"' },
      { label: 'C', text: '"I\'ve practiced this — I\'m ready to compete"' },
      { label: 'D', text: '"This pitcher is way too good for me"' },
    ],
    correct_answer: 'C',
  },
  {
    age_group: '13u', category: 'mental_mindset', difficulty: 'medium',
    question_type: 'multiple_choice', sub_category: 'confidence',
    question_text: 'Which pre-game habit BEST helps build a player\'s confidence?',
    options: [
      { label: 'A', text: 'Worrying about the opposing pitcher\'s best pitch' },
      { label: 'B', text: 'Visualizing yourself making solid contact and great plays' },
      { label: 'C', text: 'Thinking about games you\'ve lost before' },
      { label: 'D', text: 'Checking your phone right before the game starts' },
    ],
    correct_answer: 'B',
  },

  // ─────────────────────────────────────────────────────────────────
  // 13u — BASEBALL IQ
  // ─────────────────────────────────────────────────────────────────
  {
    age_group: '13u', category: 'baseball_iq', difficulty: 'easy',
    question_type: 'multiple_choice', sub_category: 'situational_awareness',
    question_text: 'Before every pitch, what should an outfielder be thinking about?',
    options: [
      { label: 'A', text: 'How many people are in the stands' },
      { label: 'B', text: 'What they\'ll eat after the game' },
      { label: 'C', text: 'Where to throw the ball if it\'s hit to them' },
      { label: 'D', text: 'What the score was in the first inning' },
    ],
    correct_answer: 'C',
  },
  {
    age_group: '13u', category: 'baseball_iq', difficulty: 'easy',
    question_type: 'multiple_choice', sub_category: 'base_running',
    question_text: 'You\'re on first base with two outs. The batter hits the ball on the ground. When should you start running to second?',
    options: [
      { label: 'A', text: 'Wait to see if the fielder catches it cleanly' },
      { label: 'B', text: 'Run as soon as the ball is hit' },
      { label: 'C', text: 'Only run if your third-base coach waves you on' },
      { label: 'D', text: 'Run after the fielder picks up the ball' },
    ],
    correct_answer: 'B',
  },
  {
    age_group: '13u', category: 'baseball_iq', difficulty: 'medium',
    question_type: 'multiple_choice', sub_category: 'pitch_recognition',
    question_text: 'A curveball is different from a fastball because it ___.',
    options: [
      { label: 'A', text: 'Is always thrown slower and outside the strike zone' },
      { label: 'B', text: 'Drops downward as it reaches the plate due to its spin' },
      { label: 'C', text: 'Travels in a perfectly straight line' },
      { label: 'D', text: 'Is always thrown harder than a fastball' },
    ],
    correct_answer: 'B',
  },
  {
    age_group: '13u', category: 'baseball_iq', difficulty: 'medium',
    question_type: 'multi_select', sub_category: 'defensive_positioning',
    question_text: 'With a runner on first base and less than 2 outs, which of these are smart plays for the second baseman? Select all that apply.',
    options: [
      { label: 'A', text: 'Be ready to cover second base on a steal attempt' },
      { label: 'B', text: 'Move back to the outfield grass to cover more ground' },
      { label: 'C', text: 'Be prepared to start a double play on a ground ball' },
      { label: 'D', text: 'Know where the runner is leading off first' },
    ],
    correct_answer: ['A', 'C', 'D'],
  },
  {
    age_group: '13u', category: 'baseball_iq', difficulty: 'easy',
    question_type: 'multiple_choice', sub_category: 'game_strategy',
    question_text: 'Your team is losing by 1 run in the last inning. There are 2 outs and the bases are loaded. The count goes to 3 strikes on the batter. What happens?',
    options: [
      { label: 'A', text: 'The runners all advance one base' },
      { label: 'B', text: 'The inning ends and your team loses' },
      { label: 'C', text: 'The batter gets another chance to bat' },
      { label: 'D', text: 'A run scores automatically because of the full count' },
    ],
    correct_answer: 'B',
  },

  // ─────────────────────────────────────────────────────────────────
  // 14-17 — MENTAL MINDSET
  // ─────────────────────────────────────────────────────────────────
  {
    age_group: '14-17', category: 'mental_mindset', difficulty: 'medium',
    question_type: 'multiple_choice', sub_category: 'one_pitch_focus',
    question_text: 'You gave up a 3-run home run as a pitcher. The next batter steps in. What is the ideal mental approach?',
    options: [
      { label: 'A', text: 'Avoid throwing that pitch for the rest of the game' },
      { label: 'B', text: 'Reset completely — this pitch is a brand new at-bat' },
      { label: 'C', text: 'Show frustration on the mound so your team sees you care' },
      { label: 'D', text: 'Walk the next batter intentionally to buy time to calm down' },
    ],
    correct_answer: 'B',
  },
  {
    age_group: '14-17', category: 'mental_mindset', difficulty: 'medium',
    question_type: 'fill_blank', sub_category: 'pressure_handling',
    question_text: 'A player who uses a consistent physical and mental routine before every at-bat — regardless of game situation — is using a ___ routine to manage pressure.',
    options: null,
    correct_answer: 'pre-pitch',
  },
  {
    age_group: '14-17', category: 'mental_mindset', difficulty: 'medium',
    question_type: 'multiple_choice', sub_category: 'resilience',
    question_text: 'You\'ve gone 0-for-4 today and it\'s your last at-bat of the game. Which mindset best shows resilience?',
    options: [
      { label: 'A', text: '"I\'m in a slump — this will probably continue"' },
      { label: 'B', text: '"Just get it over with, today isn\'t my day"' },
      { label: 'C', text: '"This at-bat is independent of the others — I\'m ready to compete right now"' },
      { label: 'D', text: '"I should have taken the day off"' },
    ],
    correct_answer: 'C',
  },
  {
    age_group: '14-17', category: 'mental_mindset', difficulty: 'medium',
    question_type: 'multi_select', sub_category: 'self_talk',
    question_text: 'Which of the following are examples of productive self-talk after striking out? Select all that apply.',
    options: [
      { label: 'A', text: '"My timing was off — I\'ll stay back better next time"' },
      { label: 'B', text: '"I\'m a terrible hitter"' },
      { label: 'C', text: '"Next at-bat I\'ll look for the breaking ball earlier in the count"' },
      { label: 'D', text: '"I stay composed and ready no matter what happens"' },
    ],
    correct_answer: ['A', 'C', 'D'],
  },
  {
    age_group: '14-17', category: 'mental_mindset', difficulty: 'hard',
    question_type: 'multiple_choice', sub_category: 'confidence',
    question_text: 'Research in sport psychology shows that the most effective way to build lasting confidence in baseball is through ___.',
    options: [
      { label: 'A', text: 'Telling yourself you\'re the best player on the field' },
      { label: 'B', text: 'Comparing your batting average favorably against teammates' },
      { label: 'C', text: 'Consistent preparation and deliberately reviewing your successful performances' },
      { label: 'D', text: 'Only competing against weaker opponents to build a win streak' },
    ],
    correct_answer: 'C',
  },

  // ─────────────────────────────────────────────────────────────────
  // 14-17 — BASEBALL IQ
  // ─────────────────────────────────────────────────────────────────
  {
    age_group: '14-17', category: 'baseball_iq', difficulty: 'medium',
    question_type: 'multiple_choice', sub_category: 'situational_awareness',
    question_text: 'Runners on first and third, 1 out. A ground ball is hit to the shortstop. What\'s the BEST play?',
    options: [
      { label: 'A', text: 'Throw to first for the easy out' },
      { label: 'B', text: 'Throw home to try to get the runner scoring from third' },
      { label: 'C', text: 'Step on second and throw to first for a double play if the timing is there' },
      { label: 'D', text: 'Hold the ball and bluff all runners back to their base' },
    ],
    correct_answer: 'C',
  },
  {
    age_group: '14-17', category: 'baseball_iq', difficulty: 'medium',
    question_type: 'multiple_choice', sub_category: 'base_running',
    question_text: 'You\'re on second base, no outs. A ground ball is hit to the right side (toward first or second base). What should you do?',
    options: [
      { label: 'A', text: 'Wait at second until you see where the ball goes' },
      { label: 'B', text: 'Advance aggressively to third on contact — the fielder\'s back is toward you' },
      { label: 'C', text: 'Always run home regardless of where the ball is hit' },
      { label: 'D', text: 'Hold and wait for your third-base coach to wave you' },
    ],
    correct_answer: 'B',
  },
  {
    age_group: '14-17', category: 'baseball_iq', difficulty: 'medium',
    question_type: 'fill_blank', sub_category: 'pitch_recognition',
    question_text: 'A pitch that has heavy downward movement and is designed to induce ground balls is called a ___.',
    options: null,
    correct_answer: 'sinker',
  },
  {
    age_group: '14-17', category: 'baseball_iq', difficulty: 'hard',
    question_type: 'multiple_choice', sub_category: 'defensive_positioning',
    question_text: 'With a left-handed pull hitter at the plate, no outs, and a runner on second base, where should the third baseman position himself?',
    options: [
      { label: 'A', text: 'Shifted toward the second base bag' },
      { label: 'B', text: 'Closer to the line and shaded toward home to guard against a hard pull shot' },
      { label: 'C', text: 'Playing deep in the outfield grass to cut off doubles' },
      { label: 'D', text: 'Standard depth directly on the third base bag' },
    ],
    correct_answer: 'B',
  },
  {
    age_group: '14-17', category: 'baseball_iq', difficulty: 'hard',
    question_type: 'multi_select', sub_category: 'game_strategy',
    question_text: 'Tie game, bottom of the 9th, no outs, runner on first base. Which offensive strategies make sense here? Select all that apply.',
    options: [
      { label: 'A', text: 'Sacrifice bunt to move the runner into scoring position at second' },
      { label: 'B', text: 'Hit-and-run to avoid a ground ball double play' },
      { label: 'C', text: 'Swing for a home run on every pitch no matter the count' },
      { label: 'D', text: 'Attempt a steal of second to put the winning run in scoring position' },
    ],
    correct_answer: ['A', 'B', 'D'],
  },

  // ─────────────────────────────────────────────────────────────────
  // 18plus — MENTAL MINDSET
  // ─────────────────────────────────────────────────────────────────
  {
    age_group: '18plus', category: 'mental_mindset', difficulty: 'hard',
    question_type: 'multiple_choice', sub_category: 'one_pitch_focus',
    question_text: 'You just threw a wild pitch that allowed the go-ahead run to score. Two outs remain. What does elite one-pitch focus look like in this moment?',
    options: [
      { label: 'A', text: 'Analyze your mechanics while the next batter walks up to the plate' },
      { label: 'B', text: 'Completely release the last pitch mentally and compete fully on the very next one' },
      { label: 'C', text: 'Tip your cap to the dugout to acknowledge the mistake' },
      { label: 'D', text: 'Signal to the dugout that you may need to be replaced' },
    ],
    correct_answer: 'B',
  },
  {
    age_group: '18plus', category: 'mental_mindset', difficulty: 'hard',
    question_type: 'fill_blank', sub_category: 'pressure_handling',
    question_text: 'The mental performance technique of slowing your exhale to twice the length of your inhale activates the parasympathetic nervous system and is commonly called ___ breathing.',
    options: null,
    correct_answer: 'box',
  },
  {
    age_group: '18plus', category: 'mental_mindset', difficulty: 'hard',
    question_type: 'written', sub_category: 'resilience',
    question_text: 'Describe a significant failure or setback you experienced in baseball or sports. What did you learn from it, and how did that experience specifically shape your mental approach to competition?',
    options: null,
    correct_answer: null,
  },
  {
    age_group: '18plus', category: 'mental_mindset', difficulty: 'hard',
    question_type: 'multiple_choice', sub_category: 'self_talk',
    question_text: 'According to cognitive behavioral principles applied to sport psychology, the most effective way to counter a recurring negative self-talk pattern ("I always choke in high-leverage situations") is to ___.',
    options: [
      { label: 'A', text: 'Suppress the thought and distract yourself with an unrelated focus' },
      { label: 'B', text: 'Identify the cognitive distortion and replace it with a specific, process-focused cue' },
      { label: 'C', text: 'Agree with the thought temporarily to stay humble and avoid overconfidence' },
      { label: 'D', text: 'Tell teammates about the pattern to get external reassurance before games' },
    ],
    correct_answer: 'B',
  },
  {
    age_group: '18plus', category: 'mental_mindset', difficulty: 'hard',
    question_type: 'multi_select', sub_category: 'confidence',
    question_text: 'Which practices are consistently linked to sustained athletic confidence in high-performance players? Select all that apply.',
    options: [
      { label: 'A', text: 'Process-focused deliberate practice with clearly defined skill targets' },
      { label: 'B', text: 'Outcome-dependent self-worth (only feeling confident when stats are strong)' },
      { label: 'C', text: 'Pre-performance routines that reliably anchor a focused, ready mental state' },
      { label: 'D', text: 'Reviewing video of your best performances before competition' },
    ],
    correct_answer: ['A', 'C', 'D'],
  },

  // ─────────────────────────────────────────────────────────────────
  // 18plus — BASEBALL IQ
  // ─────────────────────────────────────────────────────────────────
  {
    age_group: '18plus', category: 'baseball_iq', difficulty: 'hard',
    question_type: 'multiple_choice', sub_category: 'situational_awareness',
    question_text: '7th inning, tie game, runners on 1st and 2nd, nobody out. The opposing manager brings in a left-handed specialist to face your left-handed cleanup hitter. You\'re the next batter (right-handed). What\'s the strategic implication?',
    options: [
      { label: 'A', text: 'Nothing changes — stay focused only on your own at-bat' },
      { label: 'B', text: 'You\'ll likely face the lefty too, so prepare for inside movement' },
      { label: 'C', text: 'The original pitcher may return to face you if the lefty is brought in for one batter only' },
      { label: 'D', text: 'Your at-bat is irrelevant in a tie game — the pressure is on the cleanup hitter' },
    ],
    correct_answer: 'C',
  },
  {
    age_group: '18plus', category: 'baseball_iq', difficulty: 'hard',
    question_type: 'fill_blank', sub_category: 'base_running',
    question_text: 'When a right-handed pitcher\'s heel plants toward first base during his delivery, a baserunner is legally permitted to break for second because the pitcher has committed a ___.',
    options: null,
    correct_answer: 'balk',
  },
  {
    age_group: '18plus', category: 'baseball_iq', difficulty: 'hard',
    question_type: 'multiple_choice', sub_category: 'pitch_recognition',
    question_text: 'A pitcher with elite command throws a 2-2 curveball starting at eye level that finishes at the bottom of the strike zone. As a disciplined hitter, what is the optimal approach?',
    options: [
      { label: 'A', text: 'Always lay off — any pitch starting that high is outside the zone' },
      { label: 'B', text: 'Always swing — this pitcher repeatedly throws that pitch for strikes' },
      { label: 'C', text: 'Track the spin out of the hand early; only commit to pitches finishing at the knees or above' },
      { label: 'D', text: 'Swing at anything in your pre-identified hot zone, ignoring pitch movement' },
    ],
    correct_answer: 'C',
  },
  {
    age_group: '18plus', category: 'baseball_iq', difficulty: 'hard',
    question_type: 'written', sub_category: 'defensive_positioning',
    question_text: 'You\'re an outfielder in the 8th inning with your team up by 1 run. Runner on second base, 2 outs, and the opposing cleanup hitter is at bat. Explain how you would adjust your positioning and decision-making to best prevent the tying run from scoring.',
    options: null,
    correct_answer: null,
  },
  {
    age_group: '18plus', category: 'baseball_iq', difficulty: 'hard',
    question_type: 'multi_select', sub_category: 'game_strategy',
    question_text: 'Bottom of the 9th, down by 1 run, bases loaded, 2 outs, full count. Which approaches are strategically sound for the batter? Select all that apply.',
    options: [
      { label: 'A', text: 'Look for a pitch to drive — passive approach benefits the pitcher' },
      { label: 'B', text: 'Protect the plate — a walk ties the game and keeps the inning alive' },
      { label: 'C', text: 'Attempt to steal signs to know the next pitch in advance' },
      { label: 'D', text: 'Identify a specific zone or pitch type you can handle and commit to it' },
    ],
    correct_answer: ['A', 'B', 'D'],
  },
]

async function seed() {
  console.log(`Seeding ${questions.length} questions…\n`)

  let inserted = 0
  let skipped = 0

  for (const q of questions) {
    const contentHash = hash(q.question_text)

    // Check for duplicate
    const { data: existing } = await supabase
      .from('questions')
      .select('id')
      .eq('content_hash', contentHash)
      .maybeSingle()

    if (existing) {
      console.log(`  SKIP  [${q.age_group}/${q.category}] "${q.question_text.slice(0, 50)}…"`)
      skipped++
      continue
    }

    const { error } = await supabase.from('questions').insert({
      age_group:      q.age_group,
      category:       q.category,
      question_type:  q.question_type,
      question_text:  q.question_text,
      options:        q.options ?? null,
      correct_answer: q.correct_answer ?? null,
      difficulty:     q.difficulty,
      sub_category:   q.sub_category,
      content_hash:   contentHash,
    })

    if (error) {
      console.error(`  ERROR [${q.age_group}/${q.category}] ${error.message}`)
    } else {
      console.log(`  OK    [${q.age_group}/${q.category}] "${q.question_text.slice(0, 60)}…"`)
      inserted++
    }
  }

  console.log(`\nDone. Inserted: ${inserted}  Skipped (already exists): ${skipped}`)
}

seed().catch(console.error)

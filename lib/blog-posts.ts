export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  author: string
  authorRole: string
  authorColor: string
  authorInitials: string
  date: string
  category: 'Mental Mindset' | 'Leadership' | 'Resilience' | 'Foundation' | 'Curated'
  type: 'original' | 'link'
  externalUrl?: string
  externalSource?: string
  content?: string // HTML — original posts only
  readTime: string
  featured?: boolean
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'one-pitch-focus',
    title: 'The One-Pitch Focus: Why Presence Is Your Most Powerful Tool',
    excerpt:
      'Every mistake carries weight — but only if you let it. The players who consistently perform under pressure have mastered one skill above all others: staying present in this single pitch.',
    author: 'Jay Jackson',
    authorRole: 'Founder & Lead Coach',
    authorColor: '#3B9FE0',
    authorInitials: 'JJ',
    date: '2026-03-20',
    category: 'Mental Mindset',
    type: 'original',
    readTime: '5 min read',
    featured: true,
    content: `
<p>There's a moment every ballplayer knows. You've just made an error — or struck out with the bases loaded — and before you can blink, you have to walk back to your position or into the box again. The crowd is watching. Your teammates are watching. Your coaches are watching.</p>

<p>What happens in the next 30 seconds determines everything about how you perform for the rest of that game.</p>

<h2>The Weight You Carry vs. The Weight You Drop</h2>

<p>Most young players do one of two things after a mistake: they carry it forward (replaying the error in their head on repeat) or they overcorrect by forcing themselves to "forget it" — which actually keeps them locked in the past.</p>

<p>Neither works. And both share the same root cause: they're not living in <em>this</em> pitch.</p>

<p>The one-pitch focus isn't a motivational concept. It's a trainable skill. Elite players in the major leagues don't stop feeling frustration — they've built a system for processing and releasing it within seconds, so they arrive at the next pitch clean.</p>

<h2>The Three-Step Reset</h2>

<p>Here's the framework we teach in Phase 1 of the S.M.I.L.E. Zone curriculum:</p>

<ol>
  <li><strong>Acknowledge it.</strong> One breath. Name what happened internally — "That was a bad read" or "I rushed my throw." Don't suppress it. Acknowledge it and exhale it.</li>
  <li><strong>Reset your body.</strong> Adjust your cap, take a breath, step off the rubber. Coaches call these "anchor behaviors" — physical cues that signal to your nervous system: that moment is over.</li>
  <li><strong>Lock into the next task.</strong> One specific focus point. Not "don't mess up" — that keeps you in avoidance mode. Instead: "See the ball, trust your hands." Or "Slow, controlled breath on the approach."</li>
</ol>

<h2>Why This Is a Foundation Skill</h2>

<p>In the S.M.I.L.E. Zone program, we put One-Pitch Focus in Week 4 of Phase 1 — Foundation — because everything else builds on it. You can't develop positive self-talk, visualization, or pressure management without first owning the present moment.</p>

<p>I've played 17 years of professional baseball across MLB, Japan, and Mexico. The players who lasted weren't always the most talented. They were the ones who could fail — publicly, sometimes spectacularly — and come back to the very next pitch without carrying the ghost of the last one.</p>

<p>That's not natural for most people. It's a practice. And it starts today, not when the pressure is highest.</p>

<h2>Your Challenge This Week</h2>

<p>After your next practice, pick one moment where you made a mistake. Walk through the three-step reset above — even if it's after the fact. Get the feel for it when the stakes are low. Build the habit in training so it shows up automatically in games.</p>

<p>One pitch. One focus. That's the whole game.</p>
    `,
  },
  {
    slug: 'know-your-why',
    title: 'Know Your Why: The Foundation Every Player Needs Before Spring Training',
    excerpt:
      'Before you can build toughness, leadership, or consistency — you need to know why you play. Not the answer your coach wants. The real one.',
    author: 'Jay Jackson',
    authorRole: 'Founder & Lead Coach',
    authorColor: '#3B9FE0',
    authorInitials: 'JJ',
    date: '2026-03-10',
    category: 'Foundation',
    type: 'original',
    readTime: '4 min read',
    content: `
<p>Every spring I ask the same question to every player who walks into our program: <em>Why do you play?</em></p>

<p>And every spring I get versions of the same four answers: "I love the game." "I want to play college ball." "My dad played." "I want to go pro."</p>

<p>None of those are wrong. But none of them are deep enough to sustain you through the hard parts. And there are always hard parts.</p>

<h2>Motivation vs. Purpose</h2>

<p>Motivation is external. It spikes when things are going well and disappears the moment they're not. Purpose is internal — it's the thing that gets you to the field at 6 AM in November when nobody is watching and nothing is at stake.</p>

<p>Knowing your Why is about finding your purpose, not your motivation.</p>

<p>I've coached players who said they played "to make their parents proud." That works — until their parents aren't in the stands. I've coached players who played "to get a scholarship." That works — until the scholarship offer comes and suddenly there's nothing left to chase.</p>

<p>The Why that endures is usually quieter and more personal. It's about who you want to become, not what you want to achieve.</p>

<h2>How to Find It</h2>

<p>In Week 1 of Phase 1, we use a simple but powerful exercise. Answer these three questions honestly — in writing, not in your head:</p>

<ol>
  <li>What would you still love about baseball if no one was ever watching?</li>
  <li>What kind of teammate, player, and person do you want to be remembered as?</li>
  <li>When the game gets hardest — what makes you keep going?</li>
</ol>

<p>The intersection of those three answers is your Why. It's bigger than stats, bigger than college placement, bigger than any single season.</p>

<h2>Why It Matters for the Rest of Your Development</h2>

<p>Every other mental skill we build in the S.M.I.L.E. Zone — resilience, one-pitch focus, mistake recovery, leadership — is easier to develop when rooted in a clear Why. Because when you know why you're here, adversity stops feeling like an obstacle and starts feeling like part of the process.</p>

<p>You're not just playing baseball. You're becoming someone. Make sure you know who that is.</p>
    `,
  },
  {
    slug: 'embrace-the-grind',
    title: 'Embrace the Grind: What International Baseball Taught Me About Resilience',
    excerpt:
      'Playing professionally in multiple countries taught me one thing above all else: resilience is not something you have. It is something you build — deliberately, every single day.',
    author: 'Edgar Olmos',
    authorRole: 'Coach',
    authorColor: '#f59e0b',
    authorInitials: 'EO',
    date: '2026-03-05',
    category: 'Resilience',
    type: 'original',
    readTime: '5 min read',
    content: `
<p>When I left the United States to play professional baseball internationally, I thought I understood hard. I had been through injuries, roster cuts, and long bus rides through the minor leagues. I thought I knew what the grind looked like.</p>

<p>I didn't know anything yet.</p>

<h2>Adapting Without Losing Yourself</h2>

<p>Playing abroad means relearning almost everything — the language, the customs, the food, the pace of life, the style of play. Everything you were comfortable with disappears. And you still have to perform at an elite level while all of that is happening.</p>

<p>What I discovered is that resilience is not the absence of struggle. It's the decision — made over and over again — to adapt without losing your identity.</p>

<p>Some players I saw get sent abroad mentally checked out. They treated it as a punishment. They couldn't adapt, not because they lacked physical talent, but because they were rigid inside. Their sense of self was tied too tightly to a specific circumstance — a specific team, a specific league, a specific identity as an "American player."</p>

<p>The players who thrived were the ones who stayed curious, stayed humble, and kept showing up with the same preparation habits regardless of environment.</p>

<h2>The Three Rules of Resilient Preparation</h2>

<p>Here's what I brought back home and now teach our players:</p>

<ol>
  <li><strong>Control your controllables, release the rest.</strong> You cannot control the manager's decision, the scout's evaluation, or the weather. You can control your preparation, your attitude, and how you treat your teammates. Lock into those and release everything else.</li>
  <li><strong>Make your habits environment-proof.</strong> Your warmup routine, your mental reset process, your preparation ritual — these need to work whether you're in a packed stadium or a half-empty field in a foreign country. Build habits that travel.</li>
  <li><strong>Reframe adversity as data.</strong> Every difficult experience is information. "That didn't work" is more useful than "I failed." Treat setbacks as feedback loops, not verdicts.</li>
</ol>

<h2>The Long Game</h2>

<p>In Phase 2 of the S.M.I.L.E. Zone — Mental Resilience — we spend 12 weeks building exactly this: the mental stamina to stay steady when circumstances change. Because they always change.</p>

<p>The players who last in this game are not the ones who never face adversity. They're the ones who have built a relationship with it — who know how to use it instead of being broken by it.</p>

<p>The grind is not the obstacle. The grind is the curriculum.</p>
    `,
  },
  {
    slug: 'leading-from-the-bench',
    title: 'Leading From the Bench: How Great Players Lead Before They Have a Title',
    excerpt:
      'You do not need a "C" on your jersey to be a leader. The players who build genuine influence lead long before the coaches hand them the captaincy.',
    author: 'Trayvon Robinson',
    authorRole: 'Coach',
    authorColor: '#8B5CF6',
    authorInitials: 'TR',
    date: '2026-02-24',
    category: 'Leadership',
    type: 'original',
    readTime: '4 min read',
    content: `
<p>I want to tell you about the most influential player I ever saw in a clubhouse. He wasn't the starter. He wasn't the loudest voice. He barely said ten words in team meetings. But every player on that roster — including the veterans — watched how he operated and tried to match it.</p>

<p>He led by example. Consistently. Without needing anyone to acknowledge it.</p>

<h2>What Real Leadership Looks Like at 16</h2>

<p>In the S.M.I.L.E. Zone, we start building leadership identity in Phase 3 — but the habits we're building toward start as early as Phase 1, Week 11: "Team Leadership."</p>

<p>Because here's the truth: young players who wait until they're given a leadership title to start acting like leaders usually find the title never comes. Or worse, it comes and they aren't ready for it.</p>

<p>Real leadership — the kind that earns genuine respect — shows up in small moments nobody claps for:</p>

<ul>
  <li>Showing up early when you don't have to</li>
  <li>Encouraging the kid who just made the error instead of looking away</li>
  <li>Staying focused in the dugout when your team is down six runs in the seventh</li>
  <li>Preparing just as seriously for the third game of a meaningless road trip as you do for playoffs</li>
</ul>

<h2>The Influence Equation</h2>

<p>Influence = consistency × time. That's it. There are no shortcuts.</p>

<p>Players who try to lead through words without backing it up with action create friction. Players who quietly back up every word with consistent action build trust — and trust is what gives you actual influence in a dugout.</p>

<p>In Phase 3, we teach players to lead through their energy, their preparation, and their willingness to put the team before personal statistics. Not because coaches tell them to. Because they've decided that's who they want to be.</p>

<h2>Start Now</h2>

<p>You don't need permission to be a great teammate. You don't need a title to bring your best energy every day. You don't need to be a starter to set the standard in your program.</p>

<p>The best time to build leadership habits is before anyone is asking you to lead.</p>
    `,
  },
  {
    slug: 'external-mental-skills-research',
    title: 'The Science Behind Mental Skills Training in Baseball',
    excerpt:
      'Research from the Journal of Sport and Exercise Psychology confirms what elite coaches have known for decades: mental skills training produces measurable improvement in performance consistency.',
    author: 'Curated by SMILE Zone',
    authorRole: 'Staff',
    authorColor: '#3B9FE0',
    authorInitials: 'SZ',
    date: '2026-02-18',
    category: 'Curated',
    type: 'link',
    externalUrl: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6245765/',
    externalSource: 'PubMed / NCBI',
    readTime: '8 min read',
  },
  {
    slug: 'external-growth-mindset-athletes',
    title: "Dweck's Growth Mindset Applied to High-Level Athletes",
    excerpt:
      'A deep dive into how Carol Dweck\'s fixed vs. growth mindset research specifically applies to athlete development — and why "talent" framing is actively harmful for young players.',
    author: 'Curated by SMILE Zone',
    authorRole: 'Staff',
    authorColor: '#3B9FE0',
    authorInitials: 'SZ',
    date: '2026-02-10',
    category: 'Curated',
    type: 'link',
    externalUrl: 'https://fs.blog/carol-dweck-mindset/',
    externalSource: 'Farnam Street',
    readTime: '6 min read',
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}

export function getFeaturedPost(): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.featured)
}

export function getPostsByCategory(category: string): BlogPost[] {
  if (category === 'All') return BLOG_POSTS
  return BLOG_POSTS.filter((p) => p.category === category)
}

export const CATEGORIES = ['All', 'Mental Mindset', 'Foundation', 'Resilience', 'Leadership', 'Curated'] as const

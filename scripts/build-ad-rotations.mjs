import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Run with `node scripts/build-ad-rotations.mjs` (requires ffmpeg).
const secondsPerAd = 5;
const directory = fileURLToPath(new URL('../public/images/ads/', import.meta.url));
const slots = [
  ['hot-gpus', 'we-buy', 'skill-md-issue'],
  ['grok-is-this-true', 'wedding-vows', 'girlfriend-deprecated'],
  ['gptbot-robots', 'thinking-nothing', 'hallucinating-since-2022'],
  ['think-different', 'markdown-moat', 'ai-for-ai'],
  ['smile-training-data', 'secured-by-vibes', 'agent-wants-to'],
  ['artificial-super-intelligence', 'absolutely-right', 'free-prompt-injections'],
  ['one-more-prompt', 'insert-200', 'vibe-now-pay-later'],
  ['phd-level-strawberry', 'muse-open-weights', 'hello-claude'],
  ['not-a-wrapper', 'ignore-previous-instructions', 'organic-em-dashes'],
  ['anthropic-risk-factors', 'gpus-for-rent', 'state-of-the-art'],
];
const filter = [
  '[0:v]setpts=PTS-STARTPTS[a]',
  '[1:v]setpts=PTS-STARTPTS[b]',
  '[2:v]setpts=PTS-STARTPTS[c]',
  '[a][b][c]concat=n=3:v=1:a=0,split[frames][colors]',
  '[colors]palettegen=stats_mode=full[palette]',
  '[frames][palette]paletteuse=dither=none:diff_mode=rectangle[out]',
].join(';');

for (const slot of slots) {
  execFileSync('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y',
    ...slot.flatMap(name => ['-t', String(secondsPerAd), '-i', `${directory}${name}.gif`]),
    '-filter_complex', filter, '-map', '[out]', '-loop', '0',
    `${directory}rotation-${slot[0]}.gif`,
  ], { stdio: 'inherit' });
}

console.log(`Built ${slots.length} rotating banners: all 30 ads, ${secondsPerAd} seconds each.`);

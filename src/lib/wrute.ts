import forme from '@/assets/wrute-hero.jpg';
import morrow from '@/assets/wrute-morrow.jpg';
import offbeat from '@/assets/wrute-offbeat.jpg';

export const projects = [
 { slug: 'forme', name: 'Forme', category: 'Branding & packaging', filter: 'Packaging', image: forme, line: 'A brighter kind of everyday.', description: 'A bold identity for everyday skincare. Electric blue, sunlit yellow, and confident typography bring a fresh point of view to the shelf.', deliverables: ['Brand direction', 'Logo & visual identity', 'Packaging system', 'Art direction'] },
 { slug: 'morrow', name: 'Morrow', category: 'Identity & website direction', filter: 'Identity', image: morrow, line: 'Rooted in a better tomorrow.', description: 'An understated visual world for botanical skincare. A considered wordmark, natural tones, and a calm digital direction let the ingredients do the talking.', deliverables: ['Brand identity', 'Packaging design', 'Website direction', 'Digital design system'] },
 { slug: 'offbeat', name: 'Offbeat', category: 'Branding & packaging', filter: 'Branding', image: offbeat, line: 'Good coffee. Bolder days.', description: 'An independent coffee concept with a personality you can’t miss. Expressive type and an unexpected palette turn everyday rituals into something memorable.', deliverables: ['Brand positioning', 'Logo & identity', 'Packaging', 'Print collateral'] },
];
export const services = [
 { name: 'Branding', note: 'A clear idea. A distinctive voice.', description: 'We find what makes your brand different, then turn it into a direction worth following.', items: 'Strategy · Positioning · Naming · Brand voice' },
 { name: 'Logo & identity', note: 'Made to be recognised.', description: 'A memorable mark and a complete visual language that feel unmistakably yours.', items: 'Logo design · Typography · Colour · Brand guidelines' },
 { name: 'Websites', note: 'Good looks. Great experiences.', description: 'Thoughtful websites that bring your story to life and make every interaction feel effortless.', items: 'UX & UI · Web design · Development · Digital systems' },
 { name: 'Packaging', note: 'Hard to pass by. Easy to love.', description: 'Tactile, expressive packaging that gives your product a presence beyond the shelf.', items: 'Packaging systems · Labels · Print design · Art direction' },
];
export function pageHead(title: string, description: string) { return { meta: [{ title: `${title} — Wrute` }, { name: 'description', content: description }, { property: 'og:title', content: `${title} — Wrute` }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }; }

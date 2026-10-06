import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageIntro } from '@/components/wrute/site';
import { pageHead } from '@/lib/wrute';
import photo from '@/assets/wrute-offbeat.jpg';
export const Route = createFileRoute('/studio')({ head: () => pageHead('The studio', 'Meet Wrute. An independent design studio connecting curiosity, clear thinking and distinctive craft.'), component: Studio });
function Studio() { return <main className="page-width pb-24"><PageIntro label="Hello, we’re Wrute" title="Curious minds. Considered design." copy="We’re an independent studio for brands that want to be themselves. Only a little louder." /><img src={photo} alt="Offbeat concept, an expressive example of Wrute’s brand direction" width={1408} height={1104} className="studio-photo" /><div className="studio-story"><h2>Clarity first.<br />Character always.</h2><div><p>Good design starts with a good conversation. We get close to your ideas, challenge the obvious, and make room for something unexpected.</p><p>From a single mark to an entire brand world, we believe the best work feels thoughtful, useful, and full of personality.</p><Button asChild variant="editorialOutline" className="contact-link"><Link to="/contact">Make something with us <ArrowUpRight /></Link></Button></div></div></main>; }

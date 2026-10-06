import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageIntro, ProjectGrid } from '@/components/wrute/site';
import { pageHead } from '@/lib/wrute';
export const Route = createFileRoute('/work/')({ head: () => pageHead('Selected work', 'Explore Wrute’s concept projects in branding, visual identity, websites and packaging.'), component: Work });
function Work() { const [filter, setFilter] = useState('All'); return <main className="page-width pb-24"><PageIntro label="Selected work / Concept collection" title="Different by design." copy="A few worlds we’ve imagined. Each with its own point of view." /><div className="filter-bar" aria-label="Filter projects">{['All', 'Branding', 'Identity', 'Packaging'].map(item => <Button key={item} variant={filter === item ? 'editorial' : 'ghost'} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</Button>)}</div><ProjectGrid filter={filter} /></main>; }

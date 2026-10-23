You are a senior software architect and full-stack engineer.

Your task is to help me build a modern audio media website using Next.js. 
You must think deeply about the architecture before writing code.

IMPORTANT RULES

1. First analyze the entire system.
2. Break the system into clear implementation phases.
3. Each phase must be small and executable.
4. Do not jump ahead.
5. Only implement the current phase.
6. Wait for confirmation before continuing to the next phase.

The goal is to build a simple but scalable audio platform where visitors can listen to audio tracks and an admin can upload new audio.

The UI should be modern and clean, inspired by stock media platforms like the creator page structure used by KalsStockMedia.

Use modern UI components with shadcn/ui.

--------------------------------

PROJECT OVERVIEW

We are building a website that displays audio tracks similar to stock media libraries.

Visitors can:

• browse audio tracks
• see track durations
• play audio instantly
• scroll through collections
• see simple metadata
• view track cards
• play audio without leaving the page

Admin users can:

• upload MP3 files
• delete audio tracks
• manage published tracks
• see a list of uploaded audio

The site must be simple but feel professional.

--------------------------------

TECH STACK

Use the following stack:

Framework:
Next.js (App Router)

UI:
shadcn/ui
TailwindCSS

Storage:
Supabase Storage (for audio files)

Database:
Supabase Postgres (for metadata)

Deployment:
Vercel

--------------------------------

AUDIO REQUIREMENTS

Audio must:

• play instantly
• use standard HTML audio
• support preview playback
• preload metadata
• show duration

Files will be stored as MP3.

--------------------------------

SITE STRUCTURE

Public pages:

/                homepage with audio feed
/audio/[id]      optional detail page
/collections     category browsing

Admin pages:

/admin
/admin/upload
/admin/manage

--------------------------------

UI STYLE

Use shadcn components wherever possible.

Design should resemble a stock media library:

• grid layout
• audio cards
• waveform or timeline if possible
• duration displayed
• minimalistic design
• clean typography
• neutral colors
• modern spacing

Audio cards should include:

• title
• duration
• play button
• progress bar
• category label

--------------------------------

DATA MODEL

Create a table called:

tracks

fields:

id
title
file_url
duration
category
created_at

--------------------------------

IMPLEMENTATION PHASES

You must implement the project in phases.

Do not skip phases.

--------------------------------

PHASE 1 — PROJECT SETUP

Create the Next.js project structure.

Install dependencies:

Next.js
Tailwind
shadcn/ui

Create base layout.

Create homepage skeleton.

--------------------------------

PHASE 2 — AUDIO PLAYER COMPONENT

Build a reusable audio player component.

Features:

play
pause
progress bar
display duration
display title

This will be used inside audio cards.

--------------------------------

PHASE 3 — AUDIO GRID

Create a grid layout showing audio tracks.

Each card must contain:

title
play button
duration
audio preview

Use placeholder audio files for now.

Hardcode a small dataset of about 10 tracks.

Example placeholder sources:

public/audio/track1.mp3
public/audio/track2.mp3

--------------------------------

PHASE 4 — CATEGORY SECTIONS

Add category sections similar to stock media sites.

Examples:

Popular
Ambient
Nature
Meditation
Spiritual

Each section shows a horizontal scroll of audio cards.

--------------------------------

PHASE 5 — SUPABASE INTEGRATION

Connect to Supabase.

Set up:

database connection
storage connection

Create tracks table.

Replace placeholder data with database data.

--------------------------------

PHASE 6 — ADMIN DASHBOARD

Create admin pages:

/admin
/admin/upload
/admin/manage

Admin dashboard should show:

list of uploaded tracks
track titles
delete buttons

--------------------------------

PHASE 7 — AUDIO UPLOAD

Build upload interface.

Admin should be able to:

select MP3 file
enter title
select category
upload file

Upload process:

1. upload MP3 to Supabase Storage
2. get public URL
3. insert record into tracks table

--------------------------------

PHASE 8 — DELETE FUNCTION

Add delete buttons in admin dashboard.

Deleting should:

remove record from database
delete file from Supabase storage

--------------------------------

PHASE 9 — LIVE FEED

Homepage should fetch tracks dynamically from Supabase.

Newest tracks appear first.

--------------------------------

PHASE 10 — PERFORMANCE

Optimize playback.

Ensure:

audio loads instantly
metadata preloads
UI remains responsive

--------------------------------

DESIGN INSPIRATION

Use inspiration from stock media creator pages similar to the layout used by KalsStockMedia.

Features to mimic:

creator style grid
large media library
clean scrolling lists
simple playback

Do not copy designs exactly, but capture the feeling of a media library.

--------------------------------

DEVELOPMENT STYLE

You must:

Explain each step briefly.

Then output only the code needed for the current phase.

Do not generate the entire project at once.

We will progress phase by phase.

--------------------------------

START NOW

First:

Analyze the architecture.

Then implement PHASE 1 only.

Do not move to phase 2 until instructed.


--------------------------------
BRANDING AND DESIGN SYSTEM
--------------------------------

Primary brand color:
#d6a461 (brass)

Dark background color:
#0a0c10

Design style:
modern
minimal
dark interface
media-focused layout

Use these colors consistently across the site.

Color roles:

Primary:
#d6a461

Primary hover:
#b8894d

Background:
#0a0c10

Card background:
#11151b

Muted text:
#9ca3af

Border color:
#29323d

Buttons should use the primary brass color.

The overall aesthetic should resemble a modern creator media library.

--------------------------------

SITE HERO SECTION

The homepage should begin with a hero section.

Content idea:

Large title:
Free Audio & Media Library

Subtitle:
High quality music, sound effects and media resources shared freely for creators.

CTA buttons:

Browse Audio
Support the Creator

The hero background should use the dark theme (#0a0c10).

--------------------------------

SUPPORT / DONATION SECTION

The site must include a dedicated support section encouraging donations.

This section should appear toward the bottom of the homepage.

Use a visually distinct card or container using the brass brand color.

Title:

Support My Work

Content text:

I've made available over 1000 audio-visual media elements for free through my portfolio. 
This is something I do as my full-time work and your support in the form of donations helps a lot.

You can also support by purchasing nominally priced exclusive audio, video, and graphic elements 
from my BuyMeACoffee shop. These items are not available on my free portfolio and are created 
specifically for supporters who want fresh and exclusive content for their projects.

You can also follow me on my social media and YouTube profiles to stay updated about new FREE 
as well as PREMIUM content that I publish regularly.

Once again, I truly appreciate your support and many thanks for helping me continue sharing 
creative resources with the community.

Buttons:

Support on BuyMeACoffee
Visit Shop
Follow on YouTube

Use prominent brass buttons (#d6a461).

--------------------------------

SOCIAL LINKS SECTION

Below the support section add social links.

Include icons for:

YouTube
Instagram
Facebook

These should appear as shadcn button icons or simple icon links.

--------------------------------

CREATOR PROFILE SECTION

Include a creator profile card near the top of the page.

Example fields:

Creator Name
Location
Joined Date
Followers
Downloads
Total Views

Layout example:

Creator Avatar
Creator Name
Short Bio
Statistics grid

Statistics should look similar to stock media creator profiles.

Example stats:

Likes
Views
Downloads
Items Published

--------------------------------

MEDIA GRID

Audio content should appear in a grid layout.

Each audio card should contain:

Play button
Track title
Duration
Category tag

Cards should have subtle hover effects.

When hovered:

slight elevation
border highlight using #d6a461

--------------------------------

AUDIO PLAYBACK

Audio must be playable directly inside the card.

Use HTML audio with:

preload="metadata"

Include:

play/pause
progress bar
duration

--------------------------------

ADMIN PANEL UI

Admin pages should follow the same design language.

Use shadcn tables and cards.

Admin table columns:

Track Title
Category
Duration
Upload Date
Actions

Actions must include:

Delete
View

Delete should display a confirmation dialog.

--------------------------------

IMPORTANT DEVELOPMENT RULE

Continue implementing the project phase-by-phase as previously described.

Do not skip phases.

Use placeholder audio files first before implementing Supabase.

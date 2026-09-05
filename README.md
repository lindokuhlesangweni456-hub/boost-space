# AI Workplace Hub

Build: AI Workplace Productivity Assistant

Build a modern, responsive SaaS web application called AI Workplace Productivity Assistant.

The application should act as an all-in-one AI workspace for professionals, combining an AI Email Generator, Meeting Notes Summarizer, and AI Workplace Chatbot inside one cohesive dashboard.

The application must feel like a polished, production-quality SaaS product rather than a simple demo or landing page.

1. Overall Product Goal

Create a professional AI productivity workspace that helps users complete common workplace communication and information-processing tasks faster.

The main experience should revolve around a dashboard with:

Sidebar navigation

Top navigation/header

Dashboard overview

Smart Email Generator

Meeting Notes Summarizer

AI Chatbot

Recent activity

Responsive mobile navigation

Professional empty states, loading states, and error states

Responsible AI disclaimer

The interface should be clean, intuitive, minimal, and visually similar to modern SaaS applications.

2. Technology & Architecture

Use a modern frontend architecture.

Preferred stack:

React

TypeScript

Tailwind CSS

shadcn/ui components where appropriate

Lucide icons

Responsive CSS

Component-based architecture

Structure the application so that AI functionality can later be connected to a real AI API such as OpenAI.

For the initial version, create realistic AI response simulations/mock functionality if no API key is available.

Do NOT expose API keys in frontend code.

Use environment variables for future AI API integration.

3. Application Layout

Create a persistent SaaS dashboard layout.

Desktop

Use:

Left Sidebar + Main Content Area

Sidebar approximately 240–260px wide.

Main content should occupy the remaining screen width.

Mobile

The sidebar should collapse into a mobile navigation menu/drawer.

The application must work properly on:

Desktop

Laptop

Tablet

Mobile

Do not allow horizontal scrolling.

4. Sidebar Navigation

Create a professional sidebar containing:

Logo

AI Workplace

Use a simple modern AI/productivity icon.

Navigation

Dashboard

Smart Email

Meeting Summarizer

AI Assistant

Secondary Navigation

History

Settings

Bottom of Sidebar

Display:

User avatar

User name

User role

Settings icon

Example:

"Alex Morgan"
"Professional"

The sidebar should clearly indicate the currently active page.

5. Top Navigation

Create a clean top navigation/header.

Include:

Current page title

Short page description

Search icon

Notification icon

User profile/avatar

On mobile, include:

Hamburger menu

Page title

Profile/avatar

6. Dashboard

Create a polished dashboard homepage.

Header

Display:

"Good morning, Alex"

Subtitle:

"Your AI workplace assistant is ready to help you get more done."

Productivity Cards

Create three primary feature cards:

Smart Email

Icon: Mail

Description:

"Generate professional emails in seconds."

Button:

"Create Email"

Meeting Summarizer

Icon: FileText

Description:

"Turn meeting notes into concise summaries and action items."

Button:

"Summarize Notes"

AI Assistant

Icon: Sparkles

Description:

"Ask AI anything about your workplace tasks."

Button:

"Open Assistant"

7. Productivity Overview

Create a statistics section containing cards such as:

Emails Generated

Meetings Summarized

AI Conversations

Tasks Identified

Use realistic placeholder values.

Example:

Emails Generated
24

Meetings Summarized
12

AI Conversations
38

Tasks Identified
67

These should be visually clean and not overly complicated.

8. Recent Activity

Create a "Recent Activity" section.

Display recent actions such as:

Email generated

Meeting summarized

AI conversation

Action items extracted

Each activity should include:

Icon

Description

Date/time

Feature type

Example:

"Client follow-up email generated"
"Today, 10:42 AM"

Allow users to click an activity and open the relevant result.

9. SMART EMAIL GENERATOR

Create a dedicated page at:

/email

The page should allow users to generate professional emails using AI.

Page Header

Title:

"Smart Email Generator"

Description:

"Create clear, professional emails tailored to your audience and communication style."

Email Input Section

Create a large card containing:

Email Purpose

Textarea/input:

"What would you like to say?"

Placeholder:

"Example: Follow up with a client about an outstanding proposal..."

Audience

Dropdown:

Client

Manager

Team

Colleague

Supplier

Other

Tone

Dropdown:

Formal

Professional

Friendly

Informal

Persuasive

Concise

Email Length

Options:

Short

Medium

Detailed

Additional Context

Textarea:

"Add any additional context..."

Generate Button

Large primary button:

"Generate Email"

Include a sparkle/AI icon.

10. Email Output

After generation, display an output card.

Title:

"Generated Email"

Include:

Subject

Email body

Copy button

Regenerate button

Edit button

Example structure:

Subject:
Follow-up Regarding Project Proposal

Body:

Dear [Client Name],

I hope you are doing well...

...

Kind regards,
[Your Name]

The generated content should appear in a visually distinct output area.

Include a subtle "AI Generated" indicator.

11. EMAIL GENERATION INTERACTION

When the user clicks "Generate Email":

Show a loading state.

Display an animated AI processing indicator.

Generate a realistic professional email based on the selected:

Audience

Tone

Purpose

Length

Additional context

Display the result.

Allow the user to regenerate it.

Do not simply return the same static text every time.

Create several realistic mock response variations.

12. MEETING NOTES SUMMARIZER

Create a dedicated page:

/meetings

Page title:

"Meeting Notes Summarizer"

Description:

"Turn lengthy meeting notes into clear summaries, decisions, and actionable tasks."

Input Section

Create a large textarea.

Label:

"Paste your meeting notes"

Placeholder:

"Paste your meeting notes here..."

Include an optional meeting title field.

Add:

"Summarize Meeting"

button.

13. Meeting Summary Output

After processing, display a professional meeting report containing:

Executive Summary

A concise paragraph summarizing the meeting.

Key Points

Bullet list of the most important discussion points.

Decisions Made

Clearly display decisions reached during the meeting.

Action Items

Create structured action-item cards/table containing:

TaskResponsibleDeadline

Example:

Prepare revised proposal | Sarah | 12 September

Send financial projections | John | 15 September

Deadlines

Highlight important dates separately.

Responsibilities

Clearly identify who is responsible for each task.

14. MEETING SUMMARIZER INTERACTION

When the user clicks "Summarize Meeting":

Show a loading state.

Display an AI processing animation.

Analyze the supplied notes.

Generate:

Summary

Key points

Decisions

Action items

Responsibilities

Deadlines

Display the results in structured cards.

Allow:

Copy summary

Export/download summary

Regenerate

Clear notes

15. AI WORKPLACE ASSISTANT

Create a dedicated chatbot page:

/assistant

This should feel like a modern AI assistant similar to contemporary AI chat interfaces.

Layout

Full-height chat workspace.

Top:

"AI Workplace Assistant"

Subtitle:

"Your intelligent assistant for everyday workplace tasks."

Chat Interface

Display:

Empty State

Large AI icon.

Heading:

"How can I help you today?"

Suggested prompts:

"Write a professional email to a client."

"Summarize these meeting notes."

"Help me prepare for a meeting."

"Create an agenda for my team meeting."

"Rewrite this message professionally."

"Create a project follow-up checklist."

Chat Messages

Support:

User messages

AI responses

Each message should have:

Avatar/icon

Message content

Timestamp

AI responses should support formatted text including:

Headings

Bullet points

Numbered lists

Bold text

Chat Input

Create a large bottom input area.

Include:

Textarea

Send button

AI/sparkle icon

Allow users to press Enter to send.

Use Shift + Enter for a new line.

16. MULTI-TURN CHAT

The chatbot should maintain the conversation during the current session.

Example:

User:

"Write an email to a client about a delayed project."

AI:

Generates email.

User:

"Make it more persuasive."

AI:

Rewrites the previous email with a persuasive tone.

User:

"Make it shorter."

AI:

Produces a concise version.

This should simulate a realistic workplace AI assistant.

17. AI RESPONSE STATES

All AI features must include:

Loading

Show an animated loading state such as:

"AI is thinking..."

Success

Display generated content.

Error

Display a professional error message:

"Something went wrong while generating your response. Please try again."

Include a "Try Again" button.

Empty State

Provide useful instructions and examples.

18. HISTORY PAGE

Create:

/history

Display previous AI activities.

Tabs/filters:

All

Emails

Meetings

Conversations

Each history item should contain:

Type

Title

Date

Short preview

Open button

Allow users to search/filter history.

19. SETTINGS PAGE

Create:

/settings

Sections:

Profile

Name

Email

Job title

AI Preferences

Default email tone

Default email length

Response style

Appearance

Light mode

Dark mode

System preference

Notifications

Allow notification preferences.

Use switches/toggles.

20. RESPONSIBLE AI DISCLAIMER

Include a subtle but visible disclaimer throughout the application.

Example:

"AI-generated content may contain inaccuracies. Review and verify important information before using it in professional communication or decision-making."

Place a small disclaimer near AI-generated outputs and optionally in the application footer.

21. DESIGN SYSTEM

The visual style should be:

Modern

Professional

Minimal

Premium SaaS

Clean

Spacious

Corporate but approachable

Avoid making it look like a generic template.

Use:

Rounded cards

Subtle borders

Soft shadows

Clear typography hierarchy

Generous whitespace

Consistent spacing

Professional icons

Subtle hover effects

Smooth transitions

Do not overuse gradients.

Avoid excessive animations.

22. COLOR SYSTEM

Use a professional neutral interface.

Primary:

Deep navy / dark blue or modern indigo.

Background:

Very light neutral gray.

Cards:

White.

Text:

Dark charcoal.

Secondary text:

Muted gray.

Success:

Subtle green.

Warning:

Subtle amber.

Error:

Subtle red.

Ensure sufficient color contrast and accessibility.

23. TYPOGRAPHY

Use a modern sans-serif font such as:

Inter.

Use clear hierarchy:

Large page titles

Medium section headings

Readable body text

Small muted metadata

24. RESPONSIVE BEHAVIOR

The application must be fully responsive.

Desktop:

Persistent sidebar

Multi-column dashboard cards

Large input/output panels

Tablet:

Condensed sidebar/navigation

Two-column layouts where appropriate

Mobile:

Collapsible navigation

Single-column cards

Full-width textareas

Stacked controls

Chat interface optimized for mobile

Buttons should be easy to tap

Never allow content to overflow horizontally.

25. COMPONENT REUSABILITY

Create reusable components for:

Sidebar

Header

Feature cards

AI output cards

Loading states

Empty states

Error states

Buttons

Form controls

Chat messages

Activity items

Modal/dialog

Toast notifications

Do not duplicate components unnecessarily.

26. INTERACTION DETAILS

Add polished micro-interactions:

Button hover states

Card hover states

Smooth page transitions

Loading animations

Toast notifications

Copy-to-clipboard confirmation

Regenerate feedback

Form validation

When copying AI output, show:

"Copied to clipboard"

When generation starts:

"Generating..."

When complete:

"Generated successfully"

27. FUNCTIONAL REQUIREMENTS

The prototype must actually work as an interactive application.

Implement:

Navigation between pages

Sidebar active states

Form inputs

Dropdowns

Buttons

AI mock generation

Chat interaction

Copy to clipboard

Clear/reset functionality

History storage during the session

Responsive navigation

Dark/light mode if feasible

Use local state/localStorage where appropriate for the prototype.

28. AI INTEGRATION ARCHITECTURE

Design the application so real AI can be connected later.

Create a clean service layer such as:

services/aiService

with functions conceptually similar to:

generateEmail()

summarizeMeeting()

sendChatMessage()

For the prototype, use mock responses.

Structure the code so replacing the mock service with an actual AI API later is straightforward.

Do not hard-code the AI functionality directly into UI components.

29. LANDING EXPERIENCE

When the user first opens the application, take them to the dashboard.

The dashboard should immediately communicate the three primary capabilities:

Write better emails.

Understand meetings faster.

Work smarter with AI.

Make the application feel like a unified workplace operating system rather than three unrelated tools.

30. FINAL QUALITY REQUIREMENTS

Before completing the implementation:

Check all routes.

Check all buttons.

Check responsive behavior.

Check mobile navigation.

Check forms.

Check loading states.

Check empty states.

Check error states.

Check AI outputs.

Check copy functionality.

Check chat interaction.

Check visual consistency.

Remove unnecessary placeholder elements.

Ensure there are no broken links or console errors.

The final result should look like a professional AI SaaS product that could realistically be shown to a client or used as an MVP.

Prioritize usability, visual hierarchy, responsive design, and a polished professional experience over unnecessary complexity.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://boost-space.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/36bef849-c90d-47fc-adb9-6e4ba71dc709).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

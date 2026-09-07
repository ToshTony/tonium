# Tonium SEO and Growth Audit

**Audit date:** 2026-09-07  
**Site:** https://tonium.tech/  
**Scope:** Search visibility, social sharing previews, technical SEO, content, and alignment with the Tonium OS strategic direction.

## Executive assessment

Tonium has a strong technical baseline and a much clearer business position than the earlier portfolio version. The page now communicates digital transformation, business software, workflow automation, AI workflows, and operational improvement. It is structurally crawlable and already includes a canonical URL, robots directives, sitemap, Open Graph tags, Twitter card tags, and JSON-LD.

The current limitation is not a lack of keywords. It is the gap between a polished single-page presentation and a durable authority and lead-generation system. Search engines and prospective clients need more explicit evidence of who Tonium serves, what problems are solved, where the business operates, what outcomes have been achieved, and how each service can be evaluated or purchased.

### Working scorecard

These are directional implementation scores, not scores from a third-party crawler:

| Area | Current | Main reason |
|---|---:|---|
| Crawlability | 8/10 | Homepage, robots.txt, sitemap, and canonical are present |
| On-page SEO | 7/10 | Good title and description, but only one indexable content page |
| Social sharing | 6/10 | Cards exist, but image dimensions/type are not declared and the new third preview is not live in metadata |
| Structured data | 5/10 | Person schema exists, but service, organization, website, and breadcrumb relationships are missing |
| Content authority | 4/10 | Strong claims and categories, but no published case-study detail or ongoing content engine |
| Lead conversion | 6/10 | Clear contact CTA exists, but the form is a mailto-style interaction and there is no dedicated offer landing page |
| Overall opportunity | High | The site can improve substantially without losing its premium visual identity |

## Highest-priority findings

### P0: Social preview image required a final asset update

At the time of the audit, the deployed page referenced:

- `https://tonium.tech/assets/imgs/tonium-social-preview.png`

The homepage metadata has now been updated to use `assets/imgs/tonium-social-preview-third.png` for both Open Graph and Twitter. X, WhatsApp, LinkedIn, Facebook, and other crawlers may continue showing a cached older card until their individual preview caches refresh.

**Completed:** The final image is 1200 x 630 and both Open Graph and Twitter now use the same absolute HTTPS asset. The metadata includes:

- `og:image:width` = `1200`
- `og:image:height` = `630`
- `og:image:type` = `image/png`
- a precise `og:image:alt`
- matching `twitter:image:alt`

After deployment, refresh platform caches where supported. Social platforms cache previews independently, so a correct HTML change may not appear immediately.

### P1: The site is currently a single indexable URL

The one-page structure is good for a focused brand introduction, but it limits the number of search intents Tonium can own. Services such as digital transformation consulting, workflow automation, business software modernization, AI workflow implementation, and fractional technical leadership deserve dedicated pages or at least substantial crawlable sections with unique titles and descriptions.

**Action:** Keep the homepage as the brand hub, then add a small set of high-value pages:

- `/services/digital-transformation/`
- `/services/workflow-automation/`
- `/services/business-systems/`
- `/services/ai-workflows/`
- `/case-studies/`
- `/insights/`
- `/contact/` or `/systems-audit/`

Do not create thin keyword pages. Each page should explain a client problem, delivery approach, evidence, expected outputs, and a clear next step.

### P1: Structured data does not yet describe the full business entity

The current JSON-LD describes Antony as a `Person`, which is useful, but Tonium is also presented as a branded consulting/software practice. Add a connected schema graph containing:

- `Person` for Antony Mutisya
- `ProfessionalService` or `Organization` for Tonium
- `WebSite` with the canonical URL
- `Service` entities for the main offers
- `BreadcrumbList` on future inner pages
- `sameAs` links for verified LinkedIn, GitHub, and other active profiles

Use real facts only. Do not add invented ratings, reviews, prices, client counts, or geographic claims merely to obtain rich results.

### P1: Project links and image descriptions weaken trust and discoverability

The selected-work cards contain empty or placeholder links, and image alt values such as `crm project`, `hms`, and `hrm` are too generic. A search engine and a prospective client should be able to understand what each system is and what business problem it addressed.

**Action:** Either link each project to a real case-study URL or remove the false `View Project` interaction until a destination exists. Rewrite alt text around the visible subject and business context, for example:

- `Customer relationship management dashboard for sales operations`
- `Hospital management system interface for healthcare workflows`
- `Human resource and payroll management dashboard`

Avoid stuffing every keyword into alt text. Describe the image for accessibility first.

### P1: Claims need evidence pages

The homepage makes valuable claims about modernization, reduced manual work, reliability, and measurable value, but most evidence is summarized in marketing copy. This is a conversion and authority gap, not just a keyword gap.

**Action:** Turn the three case-study cards into real case studies. Each should include:

- client or sector, with permission
- starting problem and operational cost
- scope and role performed
- system or workflow delivered
- stack only where it helps establish credibility
- measurable result, using verified numbers where available
- testimonial or approval status
- a call to action for a similar engagement

If client confidentiality prevents naming a company, use a truthful anonymized format such as `Healthcare operations platform, East Africa` and clearly label it as anonymized.

## Social sharing recommendations

### Metadata package

Keep one consistent title, description, and image family across Open Graph and Twitter. The current title is descriptive but long. A stronger share title should lead with the client outcome:

`Tonium | Business Systems, Automation, and AI Workflows`

Suggested description:

`Tonium helps growing teams modernize operations with business software, workflow automation, and practical AI systems.`

Recommended tags:

- `og:type=website`
- `og:site_name=Tonium`
- `og:locale=en_US` or the primary market locale
- absolute canonical `og:url`
- absolute HTTPS `og:image`
- `og:image:width`, `og:image:height`, `og:image:type`, `og:image:alt`
- `twitter:card=summary_large_image`
- matching Twitter title, description, image, and alt text

The preview should use the final 1200 x 630 image with readable text inside the safe central area. Keep the wording short enough to survive cropping and small mobile previews.

### Platform validation

After deployment, validate the URL with the official or current platform debuggers where available:

- LinkedIn Post Inspector
- Facebook Sharing Debugger
- X card validator or a fresh post preview
- WhatsApp by sending the URL in a private test chat
- Google Rich Results Test for JSON-LD
- Schema.org Validator
- PageSpeed Insights and Lighthouse

Test both `https://tonium.tech/` and the `www` variant if one exists. Confirm one canonical host, a `200` response, and that preview assets are publicly accessible without redirects, authentication, or blocked crawler rules.

## Technical SEO improvements

### Already implemented

- HTML `lang` attribute
- viewport and content-language metadata
- index/follow robots directive
- canonical URL
- title and meta description
- Open Graph and Twitter metadata
- JSON-LD `Person` data
- `robots.txt`
- XML sitemap
- semantic headings and section landmarks
- HTTPS canonical domain

### Recommended next changes

1. Add explicit image dimensions and type to social metadata.
2. Add a real favicon set: PNG icons, Apple touch icon, and a web app manifest if useful.
3. Add `width` and `height` attributes to all meaningful content images to reduce layout shift.
4. Use descriptive filenames and alt text for project and profile imagery.
5. Add `og:image` to any future service or case-study page, not just the homepage.
6. Check that all CSS, JavaScript, Three.js modules, fonts, and images load with `200` responses.
7. Add `font-display: swap` or equivalent behavior if custom font loading is retained.
8. Keep third-party scripts limited and measure their effect on Core Web Vitals.
9. Add a useful 404 page and ensure invalid paths return an actual 404 status after the hosting configuration supports it.
10. Submit the sitemap to Google Search Console and Bing Webmaster Tools, then monitor indexing and query data.

### Hosting and deployment checks

The live domain is served by GitHub Pages and currently responds with `200 OK`. The deployed response has the expected canonical, robots, Open Graph, Twitter, and JSON-LD markers. Every future SEO edit still requires a commit and deployment; local files alone do not change the social preview or search result.

Keep `sitemap.xml` `lastmod` aligned with meaningful published content changes. Do not update it on every deploy without a content change. Confirm the sitemap remains valid XML and is reachable at `https://tonium.tech/sitemap.xml`.

## Content and visibility plan aligned to Tonium OS

The Tonium OS should turn the website into a central authority hub, not only a portfolio. The content system should connect expertise, proof, and distribution:

### Core content pillars

- **Systems:** business software, APIs, architecture, migrations, reliability
- **Leverage:** workflow automation, AI workflows, process design, productivity
- **Transformation:** modernizing legacy operations and improving service delivery
- **Builds:** case studies, shipped products, experiments, implementation notes
- **Strategy:** technical leadership, product decisions, digital operating models

### Publishing cadence

Start with one useful, original insight every two weeks. Prioritize search-led topics with buyer intent, such as:

- How to identify workflows ready for automation
- ERP, CRM, or custom internal tool: choosing the right path
- A practical AI workflow audit for growing teams
- How to modernize a legacy business system safely
- What a technical systems audit should deliver

Each article should link to one relevant service, one proof item, and one contact action. Repurpose the key idea into LinkedIn, X, GitHub notes, and short-form content, with the homepage acting as the central brand destination.

### Lead magnets and offers

Add one specific, low-friction entry offer rather than several vague CTAs:

- `Request a systems audit`
- `Book a digital transformation consultation`
- `Plan an automation sprint`

A systems-audit page can explain the inputs, the review process, the deliverables, the expected timeline, and who it is for. This makes the Tonium OS commercially legible without making the brand feel sales-heavy.

## Recommended implementation order

### Phase 1: immediate, high impact

- Select the final social preview and update `og:image` and `twitter:image`.
- Add social image width, height, type, and final alt text.
- Deploy, then refresh X, LinkedIn, Facebook, and WhatsApp previews.
- Improve project alt text and remove empty project links.
- Verify every contact and social link.
- Register the site with Google Search Console and Bing Webmaster Tools.

### Phase 2: authority and conversion

- Add connected `Organization`/`ProfessionalService`, `WebSite`, and `Service` schema.
- Publish three detailed case studies.
- Create a dedicated systems-audit or discovery page.
- Add a real form endpoint with spam protection, consent language, and a reliable success state instead of depending only on `mailto:` behavior.
- Add a clear service navigation path from the homepage.

### Phase 3: compounding visibility

- Launch the `/insights/` section with canonical URLs, article metadata, author data, and internal linking.
- Publish practical search-led content every two weeks.
- Build verified profile links and consistent business descriptions across LinkedIn, GitHub, X, and relevant directories.
- Review Search Console queries monthly and improve pages based on impressions, qualified clicks, and booked conversations.

## Success measures

Track business outcomes, not only a generic SEO score:

- Indexed pages and valid sitemap URLs
- Impressions and clicks for service-intent queries
- Organic landing-page engagement
- Preview appearance rate and referral traffic from social platforms
- Discovery-call and systems-audit submissions
- Qualified lead rate
- Search-to-conversation conversion rate
- Case-study engagement and assisted conversions
- Core Web Vitals and page performance

A near-perfect technical score is useful, but it will not replace clear offers, credible evidence, useful content, and a reliable conversion path. Those are the parts most likely to improve Tonium's visibility and attract the right clients.

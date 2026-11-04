#!/usr/bin/env python3
"""Write the English meter landing page, how-loud guides, and the zh GB 3096 page.

Copy is the 2026-11-01 drafts, edited where the app does not support the claim:
live A/C/Z, LAeq and percentiles, self-started recording, optional GPS, a
watermarked PDF preview, an ungated CSV download, and a paid clean PDF.
The ±1 to 5 dB line is the product's own stated field range on /accuracy
and in the calibration screen, not a certified tolerance.
"""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOMAIN = "https://soundtest.pro"

LEVELS = [30, 40, 50, 60, 70, 80, 90, 100, 110]


def footer(home: str, meter: str, accuracy: str, levels: str, standards: str) -> str:
    return f"""<footer class="footer-deluxe" role="contentinfo">
      <div class="footer-grid">
        <div class="footer-col footer-brand">
          <a class="brand brand-glow" href="{home}" aria-label="SOUNDTEST.PRO home">
            <span class="brand-mark" aria-hidden="true"></span>
            <span class="brand-text">SOUNDTEST<small>.PRO</small></span>
          </a>
          <p>Acoustic evidence aid for noise documentation. Browser-native and local-first. Formal measurements should be verified with a certified sound level meter.</p>
        </div>
        <div class="footer-col">
          <h4>Product</h4>
          <ul>
            <li><a href="{meter}">Open the meter</a></li>
            <li><a href="/online-decibel-meter.html">Online decibel meter</a></li>
            <li><a href="{accuracy}">Accuracy limits</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Guides</h4>
          <ul>
            <li><a href="{levels}">Decibel chart</a></li>
            <li><a href="{standards}">Standards</a></li>
            <li><a href="/zh/gb-3096-2008.html">GB 3096-2008（中文）</a></li>
          </ul>
        </div>
      </div>
    </footer>"""


def en_head(title: str, description: str, path: str, json_ld: str = "") -> str:
    url = f"{DOMAIN}{path}"
    ld = f"\n  {json_ld}" if json_ld else ""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <meta name="description" content="{description}">
  <link rel="canonical" href="{url}">
  <link rel="alternate" hreflang="x-default" href="{url}">
  <link rel="stylesheet" href="/assets/site.css?v=20261011b">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="SOUNDTEST.PRO">
  <meta property="og:url" content="{url}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">
  <meta property="og:image" content="{DOMAIN}/assets/images/noise_detection_visualization.webp">
  <meta property="og:image:width" content="1600">
  <meta property="og:image:height" content="893">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title}">
  <meta name="twitter:description" content="{description}">
  <meta name="twitter:image" content="{DOMAIN}/assets/images/noise_detection_visualization.webp">{ld}
</head>
"""


def en_nav(active: str) -> str:
    def cls(name: str) -> str:
        return ' class="active"' if name == active else ""
    return f"""<nav class="site-nav" aria-label="Primary">
      <div class="site-nav-main">
        <a class="brand" href="/"><span class="brand-mark" aria-hidden="true"></span><span>SOUNDTEST.PRO</span></a>
        <div class="nav-links">
          <a href="/"{cls("home")}>Home</a>
          <a href="/soundtest.html">Open App</a>
          <a href="/samples.html">Samples</a>
          <a href="/accuracy.html"{cls("accuracy")}>Accuracy</a>
          <a href="/standards.html">Standards</a>
          <a href="/noise-levels.html"{cls("levels")}>Noise Levels</a>
          <a href="/auth.html">Account</a>
        </div>
      </div>
    </nav>"""


def level_links(current: int) -> str:
    cards = []
    for n in LEVELS:
        if n == current:
            continue
        cards.append(
            f'<a class="topic-cluster-card" href="/how-loud-is-{n}-db.html">'
            f"<h4>How loud is {n} dB?</h4>"
            f"<p>Approximate everyday comparisons for {n} dB.</p></a>"
        )
    return "\n        ".join(cards)


HOWL = {
    30: {
        "title": "How Loud Is 30 dB? Whisper-Quiet Examples and What It Means",
        "description": "30 dB is very quiet: about a soft whisper or a still bedroom at night. Approximate comparisons, WHO sleep guidance, and how a browser meter behaves here.",
        "lead": "30 dB is very quiet. It is roughly the level of a soft whisper a short distance away, a quiet rural night with no wind, or a well-insulated bedroom late at night with appliances off. Most people notice it as near-silence: small sounds such as a clock or your own breathing stand out.",
        "more": "Few homes in a city actually stay this quiet. A refrigerator, ventilation, plumbing, or distant traffic usually pushes indoor levels above 30 dB. Because decibels are logarithmic, 30 dB carries about one tenth of the sound energy of 40 dB, and most listeners hear a 10 dB drop as about half as loud. These everyday comparisons are approximate, not laboratory measurements.",
        "context": "30 dB matters mainly for sleep. The WHO 1999 Guidelines for Community Noise give an indoor bedroom guideline of 30 dB LAeq for continuous noise, and 45 dB LAmax for single events, as a sleep-disturbance reference. If a bedroom reads well above 30 dB at night, a steady source such as a fan, an air conditioner, or road traffic may be the reason. That reading is still an estimate from the microphone you used.",
        "tip": "Phone and laptop microphones often have their own noise in very quiet rooms, so a browser meter may read higher than the room. Treat a very low reading as an estimate.",
        "safety": "30 dB is not a hearing-damage level. NIDCD says sounds at or below 70 dBA are unlikely to cause hearing loss even after long exposure. The relevant concern here is sleep, not hearing.",
        "sources": [
            ("NIDCD (NIH): Noise-Induced Hearing Loss", "https://www.nidcd.nih.gov/health/noise-induced-hearing-loss"),
            ("WHO Europe noise fact sheet", "https://www.who.int/europe/news-room/fact-sheets/item/noise"),
        ],
    },
    40: {
        "title": "How Loud Is 40 dB? Quiet Room and Library Comparisons",
        "description": "40 dB is about a quiet library or a calm room at night. Approximate comparisons, WHO night-noise guidance, and how to check a space.",
        "lead": "40 dB is quiet, and clearly not silent. Typical approximate comparisons are a quiet library, a living room with the television off, a refrigerator humming a few meters away, or a quiet residential street late at night. A soft voice across the room is usually easy to hear.",
        "more": "Compared with 30 dB, a 40 dB sound has about ten times the sound energy and is usually heard as about twice as loud. Compared with 50 dB, it has about one tenth of the energy. These are rules of thumb for a 10 dB step, not a measurement of a particular room.",
        "context": "40 dB is a common reference for night-time noise. WHO's night-noise guidance, as summarized by WHO Europe, recommends an annual outdoor average (Lnight) below 40 dB(A) outside bedrooms. The WHO Environmental Noise Guidelines for the European Region (2018) also recommend keeping aircraft noise below 40 dB Lnight. In China, GB 3096-2008 sets a night limit of 40 dB(A) for Class 0 areas (sanatoriums and similar quiet zones). Those limits are for the method in each document, not for a phone at a pillow.",
        "tip": "If you hear a steady hum at night and want to know whether it is closer to 30 or 40 dB, measure for several minutes and look at LAeq and L90, the background level, rather than one peak.",
        "safety": "40 dB is not a hearing-damage level. NIDCD says sounds at or below 70 dBA are generally in the long-exposure range it treats as safe. At night, WHO links outdoor levels above about 40 dB Lnight with sleep and health effects.",
        "sources": [
            ("NIDCD (NIH): Noise-Induced Hearing Loss", "https://www.nidcd.nih.gov/health/noise-induced-hearing-loss"),
            ("WHO Europe noise fact sheet", "https://www.who.int/europe/news-room/fact-sheets/item/noise"),
            ("WHO Environmental Noise Guidelines for the European Region (2018)", "https://www.who.int/europe/publications/i/item/9789289053563"),
        ],
    },
    50: {
        "title": "How Loud Is 50 dB? Moderate Rain, a Quiet Office, Light Traffic",
        "description": "50 dB is about a quiet office or light rain. Approximate comparisons, WHO annoyance guidance, and what it means indoors at night.",
        "lead": "50 dB is a moderate background. Familiar approximate comparisons include a quiet office, moderate rainfall, a quiet conversation at home, or light traffic heard from a distance. It is usually easy to talk over, and you notice it if you are trying to concentrate or sleep.",
        "more": "Indoors at night, about 50 dB is loud enough to disturb sleep for many people. Outdoors in the daytime it is a typical level in a quiet residential area. These comparisons are approximate.",
        "context": "WHO's 1999 Guidelines for Community Noise say that, to protect most people from being moderately annoyed in the daytime, outdoor sound in living areas should not exceed 50 dB LAeq. China's GB 3096-2008 uses 50 dB(A) as the daytime limit for Class 0 areas and the night limit for Class 2 mixed areas. A log of LAeq and L10 over several hours is a more useful supporting record than a single number. Whether anyone accepts that record is up to them.",
        "tip": "If a neighbor's music, an air conditioner, or a road brings a room to about 50 dB at night, note the duration and look at LAeq and L10 rather than one peak.",
        "safety": "50 dB is not a hearing-damage level. NIDCD says sounds at or below 70 dBA are unlikely to cause hearing loss from the exposure itself. Annoyance, and sleep at night, are the issues WHO discusses at this kind of level.",
        "sources": [
            ("NIDCD (NIH): Noise-Induced Hearing Loss", "https://www.nidcd.nih.gov/health/noise-induced-hearing-loss"),
            ("WHO Europe noise fact sheet", "https://www.who.int/europe/news-room/fact-sheets/item/noise"),
        ],
    },
    60: {
        "title": "How Loud Is 60 dB? About Normal Conversation",
        "description": "60 dB is about normal conversation. Approximate 60 dB comparisons, WHO and NIDCD guidance, and why it is loud for a bedroom at night.",
        "lead": "60 dB is about the level of normal conversation between two people a meter or so apart. NIDCD lists normal conversation at about 60–70 dBA. Other approximate 60 dB comparisons are a busy restaurant at a moderate time of day, an office with people talking, or background music at home.",
        "more": "Compared with 50 dB, 60 dB has about ten times the sound energy and is usually heard as about twice as loud. You can often still talk without raising your voice. It is clearly not quiet.",
        "context": "For environmental noise, 60 dB is on the high side of daytime guidance. WHO's community-noise guidelines say outdoor daytime levels in living areas should not exceed 55 dB LAeq if the aim is to protect most people from serious annoyance. In China, GB 3096-2008 sets 60 dB(A) as the daytime limit for Class 2 mixed areas and as the night limit for Class 4b areas beside the railway lines the standard names. Indoors at night, a steady 60 dB is far above WHO's 30 dB bedroom guideline and would disturb most people's sleep.",
        "tip": "A few minutes of LAeq tells you more than the highest number that flashes on the screen.",
        "safety": "60 dB is not the level NIDCD treats as a hearing-loss risk. NIDCD says sounds at or below 70 dBA are generally in the range it calls safe even with long exposure. At night it is a sleep issue rather than a hearing one.",
        "sources": [
            ("NIDCD (NIH): Noise-Induced Hearing Loss", "https://www.nidcd.nih.gov/health/noise-induced-hearing-loss"),
            ("WHO Europe noise fact sheet", "https://www.who.int/europe/news-room/fact-sheets/item/noise"),
        ],
    },
    70: {
        "title": "How Loud Is 70 dB? Busy Traffic, a Loud Voice, and Hearing Safety",
        "description": "70 dB is about busy street traffic or a loud conversation. Approximate comparisons, and why NIDCD treats 70 dBA as the top of the generally safe range.",
        "lead": "70 dB is noticeably loud. Approximate comparisons are busy city traffic from the sidewalk, a loud conversation, a washing machine or dishwasher close by, or a television turned up in a small room. NIDCD puts normal conversation at about 60–70 dBA, so 70 dB is the top of that range. Many vacuum cleaners are in the 70s close up. NIOSH also lists some vacuums among equipment that can reach about 85–90 dBA, so the same kind of machine is not one number.",
        "more": "At about 70 dB, conversation takes more effort and the noise becomes tiring. Compared with 60 dB, it has about ten times the energy and is usually heard as about twice as loud.",
        "context": "70 dB(A) is the daytime limit in China's GB 3096-2008 for Class 4a and 4b areas, the land next to the major roads and railways that standard defines. It is well above the WHO Environmental Noise Guidelines (2018) recommendation of 53 dB Lden for road traffic. Those figures answer different questions from a short phone reading.",
        "tip": "Hold the phone still, uncovered, and pointed toward the source. Note whether you used A-weighting.",
        "safety": "NIDCD says sounds at or below 70 dBA are generally safe even with long exposure, so 70 dB is about the upper edge of that statement. NIDCD and NIOSH treat risk as starting with long or repeated exposure at 85 dBA and above.",
        "sources": [
            ("NIDCD (NIH): Noise-Induced Hearing Loss", "https://www.nidcd.nih.gov/health/noise-induced-hearing-loss"),
            ("WHO Environmental Noise Guidelines for the European Region (2018)", "https://www.who.int/europe/publications/i/item/9789289053563"),
        ],
    },
    80: {
        "title": "How Loud Is 80 dB? Loud Traffic, Lawn Equipment, and Listening Time",
        "description": "80 dB is about heavy traffic or the low end of lawn-mower and motorcycle ranges. WHO safe-listening advice is about 40 hours a week at 80 dB.",
        "lead": "80 dB is loud. Approximate comparisons include standing near heavy traffic, a garbage disposal or blender, a loud alarm clock nearby, or a noisy work floor. NIDCD lists lawn mowers at about 80–100 dBA and motorcycles at about 80–110 dBA, so 80 dB sits at the bottom of those ranges, not at every mower or bike.",
        "more": "You usually need to raise your voice somewhat to talk at about 80 dB. Compared with 70 dB, it has about ten times the sound energy and is usually heard as about twice as loud.",
        "context": "80 dB is the reference in WHO's safe-listening advice: up to about 40 hours a week at 80 dB, and about four hours a week at 90 dB. That guidance is aimed at music through headphones and other leisure noise. If a commute, a gym, or a workplace often sits around 80 dB, the useful number is LAeq over the whole session, not one peak.",
        "tip": "Use A-weighting for this kind of comparison. C-weighting keeps more bass and will not match an A-weighted limit.",
        "safety": "80 dB is below the NIOSH recommended exposure limit of 85 dBA over 8 hours. WHO still advises limiting leisure listening at 80 dB to about 40 hours a week. Long or repeated exposure at 85 dBA and above is where NIDCD says hearing loss becomes a risk.",
        "sources": [
            ("WHO: Safe listening Q&amp;A", "https://www.who.int/news-room/questions-and-answers/item/deafness-and-hearing-loss-safe-listening"),
            ("CDC/NIOSH: Noise and hearing loss", "https://www.cdc.gov/niosh/noise/about/noise.html"),
            ("NIDCD (NIH): Noise-Induced Hearing Loss", "https://www.nidcd.nih.gov/health/noise-induced-hearing-loss"),
        ],
    },
    90: {
        "title": "How Loud Is 90 dB? Power Tools and Exposure Time",
        "description": "90 dB is about some lawn mowers and power tools. Under the NIOSH 85 dBA and 3 dB rule, the daily limit is about 2.5 hours.",
        "lead": "90 dB is very loud. NIOSH lists printing presses, lawn mowers, vacuums, and power tools as equipment that can produce around 85–90 dBA. Other approximate comparisons are a subway train arriving at a platform, a loud motorcycle passing nearby, or a blender close up. NIOSH says that at 85 dBA you often need to raise your voice to be heard by someone about 1 meter away. At 90 dB that is harder.",
        "more": "Compared with 80 dB, 90 dB has about ten times the sound energy and is usually heard as about twice as loud. The length of the exposure starts to matter inside a single day.",
        "context": "The NIOSH recommended limit is 85 dBA averaged over 8 hours, with the time halved for each 3 dBA increase. On that scale, 88 dBA is 4 hours and 91 dBA is 2 hours, so 90 dBA is about 2.5 hours in a day. WHO's safe-listening guidance puts 90 dB at about 4 hours per week for leisure listening. Those two limits answer different questions.",
        "tip": "Phone and laptop microphones can compress very loud sound, so a browser reading at this level may be low. Treat it as an estimate.",
        "safety": "Above the NIOSH 8-hour limit. The NIOSH-based daily time at 90 dBA is about 2.5 hours. Hearing protection and breaks matter around power tools and mowers. Ringing or muffled hearing afterward is a warning sign NIOSH describes.",
        "sources": [
            ("CDC/NIOSH: Noise and hearing loss", "https://www.cdc.gov/niosh/noise/about/noise.html"),
            ("WHO: Safe listening Q&amp;A", "https://www.who.int/news-room/questions-and-answers/item/deafness-and-hearing-loss-safe-listening"),
            ("CDC: What causes noise-induced hearing loss", "https://www.cdc.gov/hearing-loss/causes/index.html"),
        ],
    },
    100: {
        "title": "How Loud Is 100 dB? Concerts, Motorcycles, and a Short Daily Limit",
        "description": "100 dB is about a loud concert or a nearby motorcycle. Under the NIOSH 85 dBA and 3 dB rule the daily limit is about 15 minutes.",
        "lead": "100 dB is extremely loud. Approximate comparisons include a loud concert or nightclub, a motorcycle at full throttle nearby, a jackhammer, or headphones near maximum volume. NIDCD lists music through headphones at maximum volume, sporting events, and concerts at about 94–110 dBA, and lawn mowers at about 80–100 dBA. NIOSH says that at 95 dBA or more you will likely have to shout to be heard by someone about 1 meter away.",
        "more": "Compared with 90 dB, 100 dB has about ten times the sound energy and is usually heard as about twice as loud.",
        "context": "Under the NIOSH rule (85 dBA for 8 hours, time halved every 3 dBA), 100 dBA is 15 dB above the limit: five halvings, so 8 hours becomes 15 minutes a day. WHO's environmental noise guidance also recommends that short-term average exposure from occasional leisure noise stay at or below 100 dB LAeq over 15 minutes.",
        "tip": "At this level a phone microphone may read low because of compression. Assume the real level could be higher, and do not stay in it to 'get a better sample'.",
        "safety": "About 15 minutes a day is the NIOSH-based limit at 100 dBA. Earplugs, distance from speakers, and quiet time afterward are the practical steps. NIDCD notes that a temporary shift can fade in 16 to 48 hours and that lasting damage can still remain.",
        "sources": [
            ("CDC/NIOSH: Noise and hearing loss", "https://www.cdc.gov/niosh/noise/about/noise.html"),
            ("NIDCD (NIH): Noise-Induced Hearing Loss", "https://www.nidcd.nih.gov/health/noise-induced-hearing-loss"),
            ("WHO Environmental Noise Guidelines for the European Region (2018)", "https://www.who.int/europe/publications/i/item/9789289053563"),
        ],
    },
    110: {
        "title": "How Loud Is 110 dB? Sirens, Front-Row Sound, and a Very Short Limit",
        "description": "110 dB is about a nearby siren or the front of a loud concert. Under the NIOSH 85 dBA and 3 dB rule the daily limit is about 1.5 minutes.",
        "lead": "110 dB is painfully loud for many people. Approximate comparisons include an emergency-vehicle siren up close, the front of a rock concert, a chainsaw at the operator's ear, or a car horn a meter away. NIDCD lists emergency sirens at about 110–129 dBA, and concerts or headphones at maximum volume up to about 110 dBA. A given siren or show can be quieter or louder than that.",
        "more": "Compared with 100 dB, 110 dB has about ten times the sound energy and is usually heard as about twice as loud. Talking is close to impossible.",
        "context": "Using the NIOSH method (85 dBA over 8 hours, time halved for every 3 dBA), 110 dBA is about 1.5 minutes a day. In practice, unprotected time at this level is a hearing risk even when it is brief.",
        "tip": "Phone and laptop microphones can clip or compress very loud sound, so a browser meter may read lower than the true level. Treat the number as an estimate and assume the real level may be higher.",
        "safety": "Move away or wear hearing protection. CDC notes that one very loud sound near the ear, and repeated loud exposure, can cause noise-induced hearing loss.",
        "sources": [
            ("CDC/NIOSH: Noise and hearing loss", "https://www.cdc.gov/niosh/noise/about/noise.html"),
            ("NIDCD (NIH): Noise-Induced Hearing Loss", "https://www.nidcd.nih.gov/health/noise-induced-hearing-loss"),
            ("CDC: What causes noise-induced hearing loss", "https://www.cdc.gov/hearing-loss/causes/index.html"),
        ],
    },
}


def how_page(n: int) -> str:
    d = HOWL[n]
    path = f"/how-loud-is-{n}-db"
    sources = "\n".join(
        f'            <li><a class="in-content-link" href="{href}">{label}</a></li>'
        for label, href in d["sources"]
    )
    faq = (
        '{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question",'
        f'"name":"How loud is {n} dB?",'
        '"acceptedAnswer":{"@type":"Answer","text":"'
        + d["lead"].replace('"', "'")
        + '"}}]}'
    )
    body = f"""{en_head(d["title"], d["description"], path, f'<script type="application/ld+json">{faq}</script>')}
<body>
  <main class="site-shell">
    {en_nav("levels")}
    <nav class="breadcrumb-trail" aria-label="Breadcrumbs">
      <div class="breadcrumb-trail-inner">
        <a href="/">Home</a>
        <span class="breadcrumb-separator" aria-hidden="true">&rsaquo;</span>
        <a href="/noise-levels.html">Noise levels</a>
        <span class="breadcrumb-separator" aria-hidden="true">&rsaquo;</span>
        <span class="breadcrumb-current">How loud is {n} dB?</span>
      </div>
    </nav>
    <section class="hero">
      <div class="hero-stack reveal">
        <span class="eyebrow">Approximate comparison · Not a measurement</span>
        <h1 class="hero-headline">How loud is {n} dB?</h1>
        <p class="hero-lead">{d["lead"]}</p>
        <div class="hero-actions">
          <a class="button primary" href="/soundtest.html">Check a level in the browser</a>
          <a class="button" href="/online-decibel-meter.html">About the meter</a>
          <a class="button ghost" href="/accuracy.html">Accuracy limits</a>
        </div>
      </div>
    </section>
    <section class="section grid">
      <div class="card reveal">
        <h2>What about {n} dB sounds like</h2>
        <p>{d["more"]}</p>
        <p>{d["context"]}</p>
        <p class="muted">{d["tip"]}</p>
      </div>
      <div class="card reveal">
        <h2>Hearing</h2>
        <p>{d["safety"]}</p>
        <p class="muted">Published health guidance is context. It is not a verdict on a recording from a phone.</p>
      </div>
    </section>
    <section class="section">
      <div class="card reveal">
        <h2>Sources</h2>
        <ul class="check-list">
{sources}
        </ul>
      </div>
    </section>
    <section class="section">
      <div class="card reveal">
        <h2>Measuring with SOUNDTEST.PRO</h2>
        <p>The <a class="in-content-link" href="/soundtest.html">browser meter</a> gives an estimate from the microphone in the phone or computer, not a reading from a certified sound level meter. The product's <a class="in-content-link" href="/accuracy.html">accuracy page</a> describes a typical field spread of about ±1 to 5 dB after the built-in device baseline. Use it to compare times and keep a dated note. A watermarked PDF preview is included; removing the watermark is paid. CSV export of the session figures is available from the meter. For an official, workplace, or enforcement measurement, use a professional meter and the method that rule names.</p>
        <p class="muted">More levels are on the <a class="in-content-link" href="/noise-levels.html">decibel chart</a>. China's zone table is on the <a class="in-content-link" href="/zh/gb-3096-2008.html">GB 3096-2008 page</a>.</p>
      </div>
    </section>
    <section class="section">
      <div class="section-header">
        <span class="eyebrow">Other levels</span>
        <h2>How loud is a different number?</h2>
      </div>
      <div class="topic-cluster-grid">
        {level_links(n)}
      </div>
    </section>
    {footer("/", "/soundtest.html", "/accuracy.html", "/noise-levels.html", "/standards.html")}
  </main>
</body>
</html>
"""
    return body


def meter_page() -> str:
    title = "Online Decibel Meter: Free Browser Sound Level Meter | SOUNDTEST.PRO"
    description = "Measure noise in your browser with a free online decibel meter. A, C and Z weighting, LAeq, L10/L90, a watermarked PDF preview, and CSV export. No app install."
    path = "/online-decibel-meter"
    faq = """<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"Is this online decibel meter free?","acceptedAnswer":{"@type":"Answer","text":"Live A, C and Z weighting, a recording you start yourself, time, optional location, and a watermarked PDF preview are available without a subscription. Removing the watermark from the PDF is paid. Prices are on the home page pricing table. CSV export of the session figures is available from the meter."}},
      {"@type":"Question","name":"How accurate is a phone or browser decibel meter?","acceptedAnswer":{"@type":"Answer","text":"It is an estimate. The accuracy page and the calibration screen describe a typical spread of about plus or minus 1 to 5 dB after the built-in device baseline. It is not a certified sound level meter."}},
      {"@type":"Question","name":"Can I use the readings as evidence in a noise complaint?","acceptedAnswer":{"@type":"Answer","text":"You can keep them as a supporting record, with time and, if you allow location, a place note, when you talk to a neighbor, landlord, or property manager. Whether anyone accepts them is up to that person or office. Formal assessments use professional meters."}},
      {"@type":"Question","name":"Do I need to install an app?","acceptedAnswer":{"@type":"Answer","text":"No. It runs in a current mobile or desktop browser after you allow microphone access."}},
      {"@type":"Question","name":"What is the difference between dBA, dBC and dBZ?","acceptedAnswer":{"@type":"Answer","text":"A-weighting approximates human hearing and is the usual choice for everyday noise. C-weighting keeps more low-frequency sound, which helps with bass and machinery. Z-weighting is unweighted. The meter has all three."}}
    ]}</script>"""
    return f"""{en_head(title, description, path, faq)}
<body>
  <main class="site-shell">
    {en_nav("meter")}
    <nav class="breadcrumb-trail" aria-label="Breadcrumbs">
      <div class="breadcrumb-trail-inner">
        <a href="/">Home</a>
        <span class="breadcrumb-separator" aria-hidden="true">&rsaquo;</span>
        <span class="breadcrumb-current">Online decibel meter</span>
      </div>
    </nav>
    <section class="hero">
      <div class="hero-stack reveal">
        <span class="eyebrow">Free in the browser · Estimate, not a certified meter</span>
        <h1 class="hero-headline">Free online decibel meter: measure noise in your browser</h1>
        <p class="hero-lead">Need a quick read on how loud a room, a street, or a neighbor's music is? SOUNDTEST.PRO runs in the browser. Open it on a phone, tablet, or computer, allow the microphone, and you get a live sound level. There is nothing to install.</p>
        <div class="hero-actions">
          <a class="button primary" href="/soundtest.html">Open the free meter</a>
          <a class="button" href="/noise-levels.html">What the number means</a>
          <a class="button ghost" href="/accuracy.html">Accuracy limits</a>
        </div>
      </div>
    </section>
    <section class="section grid">
      <div class="card reveal">
        <h2>What you can measure</h2>
        <ul class="check-list">
          <li><strong>A, C, and Z weighting.</strong> A-weighting (dBA) is the usual choice for everyday noise. C-weighting (dBC) keeps more bass, which helps with engines and thump. Z-weighting is unweighted. Fast (125 ms) and Slow (1 s) time response are both in the meter.</li>
          <li><strong>LAeq, L10, and L90.</strong> LAeq is the equivalent level over the measurement. L10 is the level exceeded about 10% of the time. L90 is the level exceeded about 90% of the time, closer to the background. The meter also computes L5, L50, and L95.</li>
          <li><strong>A record you can keep.</strong> You can start a recording in the browser. Photos can carry the live level and the time, and a place note when you allow location. A watermarked PDF preview is free. Removing that watermark is paid. A CSV of the session figures can be downloaded from the meter. Current prices are on the <a class="in-content-link" href="/#pricing">home page pricing table</a>.</li>
        </ul>
      </div>
      <div class="card reveal">
        <h2>How accurate is a browser decibel meter?</h2>
        <p>Be realistic about a phone or laptop microphone. Built-in mics, automatic gain, and the operating system's processing differ by device, so a browser reading is an <strong>estimate</strong>, not a measurement from a certified sound level meter. The <a class="in-content-link" href="/accuracy.html">accuracy page</a> and the meter's calibration screen describe a typical spread of about ±1 to 5 dB after the built-in device baseline. That is the product's stated field range. Very quiet rooms and very loud sources can sit outside what a phone microphone handles well.</p>
        <p>Use it to spot trends, compare times of day, and keep a dated supporting note. If you need an official assessment for enforcement, a workplace rule, or a dispute that depends on the number itself, use a professional meter operated the way that rule requires.</p>
      </div>
    </section>
    <section class="section">
      <div class="card reveal">
        <h2>How to get a useful reading</h2>
        <ol class="check-list">
          <li>Open the meter and allow microphone access.</li>
          <li>Choose A-weighting for general noise, or C-weighting for bass and low rumble.</li>
          <li>Hold the phone still, away from your body and not covered, pointed toward the source.</li>
          <li>Measure for at least a few minutes and note LAeq, not only the peak.</li>
          <li>Save a watermarked PDF preview, or a CSV, if you want a file. A clean PDF is a paid extra.</li>
        </ol>
        <p class="muted">Not sure what the number means? Read <a class="in-content-link" href="/how-loud-is-30-db.html">how loud 30 dB through 110 dB is</a>, or the full <a class="in-content-link" href="/noise-levels.html">decibel chart</a>.</p>
      </div>
    </section>
    <section class="section" id="faq">
      <div class="section-header">
        <span class="eyebrow">FAQ</span>
        <h2>Online decibel meter questions</h2>
      </div>
      <div class="grid">
        <div class="card reveal"><h3>Is this online decibel meter free?</h3><p>Live A, C, and Z weighting, a recording you start yourself, the time, optional location, and a watermarked PDF preview do not need a subscription. Removing the watermark is paid. Prices are on the home page. CSV export of the session figures is available from the meter.</p></div>
        <div class="card reveal"><h3>How accurate is a phone or browser decibel meter?</h3><p>It gives an estimate. Readings depend on the microphone and the audio processing. The accuracy page describes a typical spread of about ±1 to 5 dB after the device baseline. It is not a certified instrument.</p></div>
        <div class="card reveal"><h3>Can I use the readings in a noise complaint?</h3><p>You can use them as a supporting record when talking with a neighbor, a landlord, or a property manager, or when you file a complaint. Whether they are accepted is up to whoever handles it. Formal assessments use professional sound level meters.</p></div>
        <div class="card reveal"><h3>Do I need to install an app?</h3><p>No. It runs in a current mobile or desktop browser. You only need to allow microphone access.</p></div>
        <div class="card reveal"><h3>What is the difference between dBA, dBC, and dBZ?</h3><p>dBA is weighted to approximate human hearing and is the usual scale for noise limits. dBC keeps more low-frequency sound, which is useful for bass and machinery. dBZ is unweighted. The meter offers all three.</p></div>
      </div>
    </section>
    <section class="section">
      <div class="section-header">
        <span class="eyebrow">30 dB to 110 dB</span>
        <h2>How loud is that number?</h2>
      </div>
      <div class="topic-cluster-grid">
        {level_links(0)}
      </div>
    </section>
    {footer("/", "/soundtest.html", "/accuracy.html", "/noise-levels.html", "/standards.html")}
  </main>
</body>
</html>
"""


def gb_page() -> str:
    title = "GB 3096-2008 声环境质量标准：0～4 类区昼间夜间噪声限值速查｜SOUNDTEST.PRO"
    description = "GB 3096-2008《声环境质量标准》自 2008-10-01 实施。0、1、2、3、4a、4b 类区昼间与夜间限值速查，附标准对仪器的要求。手机读数不能代替标准监测。"
    url = f"{DOMAIN}/zh/gb-3096-2008"
    return f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <meta name="description" content="{description}">
  <link rel="canonical" href="{url}">
  <link rel="alternate" hreflang="x-default" href="{url}">
  <link rel="alternate" hreflang="zh" href="{url}">
  <link rel="stylesheet" href="/assets/site.css?v=20261011b">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="SOUNDTEST.PRO">
  <meta property="og:url" content="{url}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">
  <meta property="og:locale" content="zh_CN">
  <meta property="og:image" content="{DOMAIN}/assets/images/noise_detection_visualization.webp">
  <meta property="og:image:width" content="1600">
  <meta property="og:image:height" content="893">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title}">
  <meta name="twitter:description" content="{description}">
  <meta name="twitter:image" content="{DOMAIN}/assets/images/noise_detection_visualization.webp">
</head>
<body>
  <main class="site-shell">
    <nav class="site-nav" aria-label="主导航">
      <div class="site-nav-main">
        <a class="brand" href="/zh/"><span class="brand-mark" aria-hidden="true"></span><span>SOUNDTEST.PRO</span></a>
        <div class="nav-links">
          <a href="/zh/">首页</a>
          <a href="/soundtest.html?lang=zh">打开工具</a>
          <a href="/zh/samples.html">报告样例</a>
          <a href="/zh/accuracy.html">计量精度</a>
          <a href="/zh/standards.html">噪声标准</a>
          <a href="/zh/noise-levels.html">分贝等级</a>
          <a href="/zh/auth.html">账户中心</a>
        </div>
      </div>
    </nav>
    <nav class="breadcrumb-trail" aria-label="面包屑">
      <div class="breadcrumb-trail-inner">
        <a href="/zh/">首页</a>
        <span class="breadcrumb-separator" aria-hidden="true">&rsaquo;</span>
        <a href="/zh/standards.html">噪声标准</a>
        <span class="breadcrumb-separator" aria-hidden="true">&rsaquo;</span>
        <span class="breadcrumb-current">GB 3096-2008</span>
      </div>
    </nav>
    <section class="hero">
      <div class="hero-stack reveal">
        <span class="eyebrow">标准限值速查 · 不是手机测量结论</span>
        <h1 class="hero-headline">GB 3096-2008《声环境质量标准》噪声限值速查</h1>
        <p class="hero-lead">《声环境质量标准》（GB 3096-2008）由原环境保护部与国家质量监督检验检疫总局发布，自 2008 年 10 月 1 日起实施。它按区域功能划分声环境功能区，并规定各区的环境噪声限值。评价量是昼间、夜间的等效连续 A 声级，单位 dB(A)。</p>
        <div class="hero-actions">
          <a class="button primary" href="/soundtest.html?lang=zh">用浏览器看个大致读数</a>
          <a class="button" href="/zh/standards.html">返回标准说明</a>
          <a class="button ghost" href="/zh/accuracy.html">精度边界</a>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="card reveal">
        <h2>环境噪声限值（标准表 1）</h2>
        <p>标准第 5.1 条：各类声环境功能区适用表 1 规定的环境噪声等效声级限值。</p>
        <div class="db-table-wrap">
          <table class="db-table">
            <thead>
              <tr><th>声环境功能区类别</th><th>昼间 dB(A)</th><th>夜间 dB(A)</th></tr>
            </thead>
            <tbody>
              <tr><td>0 类</td><td>50</td><td>40</td></tr>
              <tr><td>1 类</td><td>55</td><td>45</td></tr>
              <tr><td>2 类</td><td>60</td><td>50</td></tr>
              <tr><td>3 类</td><td>65</td><td>55</td></tr>
              <tr><td>4a 类</td><td>70</td><td>55</td></tr>
              <tr><td>4b 类</td><td>70</td><td>60</td></tr>
            </tbody>
          </table>
        </div>
        <p class="muted">原文见生态环境部公布的 <a class="in-content-link" href="https://www.mee.gov.cn/ywgz/fgbz/bz/bzwb/wlhj/shjzlbz/200809/W020111121351590491445.pdf">GB 3096-2008 标准文本（PDF）</a>。某个小区属于哪一类，以当地政府公布的声环境功能区划为准。</p>
      </div>
    </section>
    <section class="section grid">
      <div class="card reveal">
        <h2>各类功能区指什么</h2>
        <ul class="check-list">
          <li>0 类：康复疗养区等特别需要安静的区域。</li>
          <li>1 类：以居民住宅、医疗卫生、文化教育、科研设计、行政办公为主要功能，需要保持安静的区域。</li>
          <li>2 类：以商业金融、集市贸易为主要功能，或居住、商业、工业混杂，需要维护住宅安静的区域。</li>
          <li>3 类：以工业生产、仓储物流为主要功能，需要防止工业噪声严重影响周围环境的区域。</li>
          <li>4 类：交通干线两侧一定距离内，需要防止交通噪声严重影响周围环境的区域。4a 类为高速公路、一级和二级公路、城市快速路、主干路、次干路、城市轨道交通地面段、内河航道两侧；4b 类为铁路干线两侧。</li>
        </ul>
      </div>
      <div class="card reveal">
        <h2>昼间和夜间怎么分</h2>
        <p>标准第 3.5 条：昼间指 6:00 至 22:00，夜间指 22:00 至次日 6:00。县级以上人民政府为防治环境噪声污染另有规定的，按当地规定执行。</p>
        <p class="muted">该条引用的是当时的《中华人民共和国环境噪声污染防治法》。该法已被 2022 年 6 月 5 日起施行的《中华人民共和国噪声污染防治法》取代。功能区限值表仍以 GB 3096-2008 文本为准，除非当地公布了新的适用规则。</p>
      </div>
    </section>
    <section class="section">
      <div class="card reveal">
        <h2>铁路两侧和夜间突发噪声</h2>
        <ul class="check-list">
          <li>表 1 的 4b 类限值，适用于 2011 年 1 月 1 日起环境影响评价文件通过审批的新建铁路（含新开廊道的增建铁路）干线两侧（标准第 5.2 条）。</li>
          <li>穿越城区的既有铁路干线，以及对这类干线改建、扩建的项目，在不通过列车时的环境背景噪声限值按昼间 70 dB(A)、夜间 55 dB(A) 执行。既有铁路指 2010 年 12 月 31 日前已建成运营，或环评文件已通过审批的项目（标准第 5.3 条）。</li>
          <li>各类功能区夜间突发噪声的最大声级，超过环境噪声限值的幅度不得高于 15 dB(A)（标准第 5.4 条）。例如 1 类区夜间限值 45 dB(A)，则夜间突发噪声最大声级不得高于 60 dB(A)。</li>
        </ul>
      </div>
    </section>
    <section class="section grid">
      <div class="card reveal">
        <h2>标准对测量仪器的要求</h2>
        <p>标准第 6.1 条要求：测量仪器为 2 型及 2 型以上的积分平均声级计或环境噪声自动监测仪器，性能需符合该条所引的 GB 3785 和 GB/T 17181，并定期校验。测量前后使用声校准器校准，示值偏差不得大于 0.5 dB，否则测量无效。声校准器应满足该条所引的 GB/T 15173 对 1 级或 2 级声校准器的要求。测量时传声器应加防风罩。</p>
        <p>标准还规定了测点，例如一般户外测点距离任何反射物（地面除外）至少 3.5 m，距地面高度 1.2 m 以上；噪声敏感建筑物户外测点距墙壁或窗户 1 m，距地面高度 1.2 m 以上。</p>
        <p class="muted">以上是标准原文对仪器和测点的要求，不是对本网站读数的描述。</p>
      </div>
      <div class="card reveal">
        <h2>手机或浏览器测量能代替标准监测吗？</h2>
        <p>不能。手机和电脑的麦克风、自动增益和降噪因设备而异，浏览器里的分贝只是估计值，不符合第 6.1 条对仪器和校准的要求。<a class="in-content-link" href="/zh/accuracy.html">精度说明</a>里写的是设备基线之后大约 ±1～5 dB 的现场范围，不是 2 型声级计的允差。</p>
        <p>可以用<a class="in-content-link" href="/soundtest.html?lang=zh">浏览器工具</a>了解大致水平和不同时段的差别，并留下带时间的记录；定位需你授权后才会写入。无水印 PDF 是付费导出，会话数据可以导出 CSV。是否被邻居、物业或 12345 采信，由受理方决定。需要正式结论时，应委托有资质的机构按标准方法监测。</p>
        <p class="muted">本标准规定的是户外声环境质量。社会生活噪声、工业企业厂界噪声和建筑施工噪声另有排放标准，本站<a class="in-content-link" href="/zh/standards.html">标准页</a>已列 GB 22337-2008 与 GB 12523-2011。投诉时适用哪一份，以受理机关认定的场景为准。</p>
      </div>
    </section>
    <footer class="footer-deluxe" role="contentinfo">
      <div class="footer-grid">
        <div class="footer-col footer-brand">
          <a class="brand brand-glow" href="/zh/" aria-label="SOUNDTEST.PRO 首页">
            <span class="brand-mark" aria-hidden="true"></span>
            <span class="brand-text">SOUNDTEST<small>.PRO</small></span>
          </a>
          <p>面向噪音记录的浏览器工具。正式监测请按标准方法，使用符合要求的声级计。</p>
        </div>
        <div class="footer-col">
          <h4>相关页面</h4>
          <ul>
            <li><a href="/soundtest.html?lang=zh">打开测声工具</a></li>
            <li><a href="/zh/standards.html">噪声标准</a></li>
            <li><a href="/zh/noise-levels.html">分贝等级</a></li>
            <li><a href="/zh/accuracy.html">计量精度</a></li>
          </ul>
        </div>
      </div>
    </footer>
  </main>
</body>
</html>
"""


def main() -> None:
    (ROOT / "online-decibel-meter.html").write_text(meter_page(), encoding="utf-8")
    for n in LEVELS:
        (ROOT / f"how-loud-is-{n}-db.html").write_text(how_page(n), encoding="utf-8")
    (ROOT / "zh" / "gb-3096-2008.html").write_text(gb_page(), encoding="utf-8")
    print(f"wrote {1 + len(LEVELS) + 1} guide pages")


if __name__ == "__main__":
    main()

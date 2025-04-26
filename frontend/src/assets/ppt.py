# Install first if not already
# pip install python-pptx

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor

# Create the presentation
prs = Presentation()

# Define a function to add a dark styled slide
def add_neon_slide(title, bullets):
    slide_layout = prs.slide_layouts[1]  # Title and Content layout
    slide = prs.slides.add_slide(slide_layout)

    # Set Title
    title_shape = slide.shapes.title
    title_shape.text = title
    title_shape.text_frame.paragraphs[0].font.size = Pt(44)
    title_shape.text_frame.paragraphs[0].font.bold = True
    title_shape.text_frame.paragraphs[0].font.color.rgb = RGBColor(0x22, 0xD3, 0xEE)  # Neon Cyan

    # Set Body
    body_shape = slide.placeholders[1]
    tf = body_shape.text_frame
    tf.clear()

    for point in bullets:
        p = tf.add_paragraph()
        p.text = point
        p.font.size = Pt(28)
        p.font.color.rgb = RGBColor(0x10, 0xB9, 0x81)  # Neon Green
        p.level = 0

# Slides Data
slides_data = [
    ("HackEx.in", ["Redefining How Coders Win"]),
    ("Why Students Fail to Build Skills", [
        "Resources are abundant.",
        "Talent is abundant.",
        "But action is missing.",
        "Procrastination kills ambition."
    ]),
    ("It's Not About Resources, It's About Action.", [
        "Students don't lack information.",
        "They lack motivation and discipline.",
        "HackEx fights this battle directly."
    ]),
    ("How We Break the Cycle", [
        "Weekly coding competitions with real cash prizes.",
        "Skill-based leagues for fairness.",
        "Progress tracking and adaptive growth.",
        "AI coaching and human mentorship coming soon."
    ]),
    ("Match With Your True Peers", [
        "Beginners vs Beginners",
        "Intermediates vs Intermediates",
        "Experts vs Experts",
        "Same fee, skill-based rewards"
    ]),
    ("Motivation Engine for Skill Building", [
        "Rewards defeat procrastination.",
        "Fairness builds confidence.",
        "AI and events guide learning.",
        "Weekly & daily challenges create discipline."
    ]),
    ("Where We Started – Where We're Going", [
        "MVP: Coding platform, Leaderboard",
        "Next: Skill-based leagues, Daily challenges",
        "Future: Hackathons hosting, AI learning mentors, Top educators onboard"
    ]),
    ("More Than A Platform. A Movement.", [
        "Practice.", "Compete.", "Learn.", "Grow.", "Win."
    ]),
    ("Join The Future of Skill Building", [
        "Support HackEx",
        "Empower a generation of coders"
    ]),
    ("HackEx.in", ["From Dreamers to Doers."]),
]

# Create all slides
for title, bullets in slides_data:
    add_neon_slide(title, bullets)

# Save the file
prs.save("HackEx_Pitch_Deck_Final.pptx")
print("PPTX File Generated Successfully: HackEx_Pitch_Deck_Final.pptx")

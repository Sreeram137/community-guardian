import os
from PIL import Image

def webp_to_gif(input_path, output_path, fps=5):
    img = Image.open(input_path)
    n_frames = img.n_frames
    print(f"Converting {os.path.basename(input_path)}: {n_frames} frames at {img.size}")

    frames = []
    for i in range(n_frames):
        img.seek(i)
        frame = img.convert('RGB')
        frame = frame.resize((960, 527), Image.LANCZOS)
        frames.append(frame)

    frames[0].save(
        output_path,
        save_all=True,
        append_images=frames[1:],
        duration=int(1000 / fps),
        loop=0,
        optimize=True
    )
    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"  Saved: {output_path} ({size_mb:.1f} MB)")

recordings_dir = '/Users/sriram/.gemini/antigravity/brain/2a623019-115f-4cdb-947e-fc00cd6cbb1b'
output_dir = '/Users/sriram/Documents/New project/community-guardian/videos'
os.makedirs(output_dir, exist_ok=True)

demo_files = [
    ('dashboard_overview_1772942439080.webp', '1_dashboard_overview.gif'),
    ('alert_detail_demo_1772942487383.webp', '2_alert_detail_analysis.gif'),
    ('tabs_and_digest_1772942578696.webp', '3_tabs_and_digest.gif'),
]

for filename, outname in demo_files:
    input_path = os.path.join(recordings_dir, filename)
    if os.path.exists(input_path):
        output_path = os.path.join(output_dir, outname)
        webp_to_gif(input_path, output_path)
    else:
        print(f"Skip: {filename} not found")

print("\nDone! Files saved in:", output_dir)

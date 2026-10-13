from pathlib import Path
from PIL import Image, ImageOps, ImageDraw

root = Path(__file__).resolve().parents[1]
families = ['architecture', 'padel', 'creative', 'consulting', 'hospitality', 'catering', 'logistics']
sheet = Image.new('RGB', (1400, 1020), '#e9edf2')
mobile_sheet = Image.new('RGB', (1400, 700), '#e9edf2')
draw = ImageDraw.Draw(sheet)
mobile_draw = ImageDraw.Draw(mobile_sheet)
for index, family in enumerate(families):
    original = Image.open(root / 'docs' / f'{family}-home-v61.png').convert('RGB')
    preview = original.crop((0, 44, original.width - 16, original.height))
    preview.resize((960, round(960 * preview.height / preview.width)), Image.Resampling.LANCZOS).save(root / 'dist' / 'assets' / f'template-{family}-preview.jpg', quality=88)
    x, y = (index % 3) * 462 + 12, (index // 3) * 336 + 12
    draw.text((x, y), family.upper(), fill='#142b3a')
    sheet.paste(ImageOps.fit(preview, (450, 295)), (x, y + 22))
    mobile = Image.open(root / 'docs' / f'{family}-mobile-v61.png').convert('RGB')
    mobile = mobile.crop((0, 0, mobile.width, min(mobile.height, 1250)))
    mobile_draw.text((index * 200 + 5, 8), family.upper(), fill='#142b3a')
    mobile_sheet.paste(mobile.resize((190, round(mobile.height * 190 / mobile.width))), (index * 200 + 5, 30))
sheet.save(root / 'docs' / 'template-design-overview-v61.jpg', quality=92)
mobile_sheet.save(root / 'docs' / 'template-mobile-overview-v61.jpg', quality=92)

import os

cmd = "rembg i --alpha-matting --alpha-matting-erode-size 0 haram1.png haram.png"
os.system(cmd)

print("Background removed!")
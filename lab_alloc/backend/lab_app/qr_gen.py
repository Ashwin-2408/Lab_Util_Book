import os
import qrcode

def generate_qr(user_id):
    url = f"http://127.0.0.0.1:8000/api/checkin/{user_id}"
    qr = qrcode.make(user_id)
    qr_directory = r"E:\Lab_Util_Book\lab_alloc\backend\qrcodes"
    os.makedirs(qr_directory, exist_ok=True)
    file_path = os.path.join(qr_directory, f"user_{user_id}.png")
    qr.save(file_path)
    print(f"QR code saved at: {file_path}")

generate_qr("George")
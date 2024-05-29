import base64
import os
from io import BytesIO
from pdf2image import convert_from_path
import sys
import json

def pdf_to_image_base64(pdf_path, dpi=300):
    # Convert the first page of the PDF to an image
    images = convert_from_path(pdf_path, dpi=dpi, first_page=1, last_page=1)

    # Assuming you want to convert the first page only
    if images:
        image = images[0]

        # Create a bytes buffer for the image
        buffer = BytesIO()

        # Save the image to the buffer
        image.save(buffer, format="JPEG")

        # Seek to the start of the buffer
        buffer.seek(0)

        # Read the buffer and encode it to base64
        image_base64 = base64.b64encode(buffer.read()).decode('utf-8')

        os.remove(pdf_path)

        return image_base64
    else:
        return None

if __name__ == "__main__":
    pdf_path = sys.argv[1]
    result = pdf_to_image_base64(pdf_path)
    if result:
        print(json.dumps({"image_base64": result}))
    else:
        print(json.dumps({"error": "Failed to process the PDF"}))
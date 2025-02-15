from flask import Blueprint, request, jsonify
import cloudinary # type: ignore
import cloudinary.uploader # type: ignore
import cloudinary.api # type: ignore

image_upload_bp = Blueprint("Image Upload", __name__)

@image_upload_bp.route("/upload", methods=["POST"])
def upload_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file_to_upload = request.files['file']

    if file_to_upload.filename == '':
        return jsonify({"error": "No file selected"}), 400

    try:
        upload_result = cloudinary.uploader.upload(file_to_upload)
        image_url = upload_result.get('secure_url')
        return jsonify({"url": image_url}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
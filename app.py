from flask import Flask, request, send_file, jsonify
from PyPDF2 import PdfWriter, PdfReader
import io
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def health_check():
    return {"status": "PDF Encryption Service Running"}

@app.route('/encrypt-pdf', methods=['POST'])
def encrypt_pdf():
    try:
        if 'pdf' not in request.files:
            return jsonify({"error": "No PDF file provided"}), 400
        
        file = request.files['pdf']
        password = request.form.get('password')
        
        if not password:
            return jsonify({"error": "No password provided"}), 400
        
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Check file size (10MB limit)
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        
        if file_size > 10 * 1024 * 1024:
            return jsonify({"error": "File too large. Maximum size is 10MB"}), 400
        
        # Read and encrypt PDF
        reader = PdfReader(file)
        writer = PdfWriter()
        
        for page in reader.pages:
            writer.add_page(page)
        
        writer.encrypt(password)
        
        # Create encrypted PDF in memory
        output = io.BytesIO()
        writer.write(output)
        output.seek(0)
        
        # Generate filename
        original_name = file.filename.rsplit('.', 1)[0]
        encrypted_filename = f"{original_name}_encrypted.pdf"
        
        return send_file(
            output,
            as_attachment=True,
            download_name=encrypted_filename,
            mimetype='application/pdf'
        )
        
    except Exception as e:
        return jsonify({"error": f"Encryption failed: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
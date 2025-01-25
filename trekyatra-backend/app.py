from flask import Flask, jsonify # type: ignore

app = Flask(__name__)

@app.route("/")
def home():
    return jsonify({"message" : "The python app is running succesfully on the port 5000!"})

if __name__ == '__main__':
    app.run(debug=True)
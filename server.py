from flask import Flask,request,jsonify
from flask.templating import render_template
from werkzeug.security import generate_password_hash,check_password_hash
import requests
import joblib
import mysql.connector
import os
import gdown
from dotenv import load_dotenv

load_dotenv()

os.makedirs("static/data", exist_ok=True)

JOB_MODEL_PATH = "static/data/job.pkl"
INTERN_MODEL_PATH = "static/data/internship.pkl"
VECTORIZER_PATH = "static/data/vectorizer.pkl"

JOB_MODEL_URL = "https://drive.google.com/file/d/1x2ZBFyPJobnanLdvLvSwYxU45aqm_vHx/view?usp=drive_link"
INTERN_MODEL_URL = "https://drive.google.com/file/d/1s-P0ilyUrMfVuOmggWAz4LSeYVcslKJK/view?usp=drive_link"
VECTORIZER_URL = "https://drive.google.com/file/d/1rYYSQUyCwIh8vqNIfHsaHXwSFc5_AFnY/view?usp=drive_link"


def download_models():
    if not os.path.exists(JOB_MODEL_PATH):
        print("Downloading job model...")
        gdown.download(JOB_MODEL_URL, JOB_MODEL_PATH, quiet=False)

    if not os.path.exists(INTERN_MODEL_PATH):
        print("Downloading internship model...")
        gdown.download(INTERN_MODEL_URL, INTERN_MODEL_PATH, quiet=False)

    if not os.path.exists(VECTORIZER_PATH):
        print("Downloading vectorizer...")
        gdown.download(VECTORIZER_URL, VECTORIZER_PATH, quiet=False)


download_models()

STUD_DETAIL_LINK = "https://results.bput.ac.in/student-detsils-results?rollNo=%s"

# db = mysql.connector.connect(host="localhost",user=os.getenv("DB_USER"),password=os.getenv("DB_PASS"),database="HACKATHON")
# cursor = db.cursor()

job_model = joblib.load("static/data/job.pkl")
intern_model = joblib.load("static/data/internship.pkl")
model_vectorizer = joblib.load("static/data/vectorizer.pkl")
app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/user_login")
def login_user():
    return render_template("login.html")

@app.route("/user_profile")
def user_profile():
    return render_template("profile.html")

@app.route("/profile",methods=["POST"])
def profile():
    data = request.get_json()
    db = mysql.connector.connect(host="localhost",user="root",password="Prem@2006",database="HACKATHON")
    cursor = db.cursor()
    REGD_ID = data.get("id")
    cursor.execute("SELECT NAME,BRANCH,COURSE,BATCH,COLLEGE FROM STUDENTS WHERE REGD = %s" ,(REGD_ID,))
    user_data = cursor.fetchall()[0]
    cursor.close()
    db.close()
    return jsonify({"name":user_data[0],"course":user_data[1],"branch":user_data[2],"batch" : user_data[3],"college":user_data[4]})

@app.route("/signup",methods=['POST'])
def signup():
    valid = False
    data = request.get_json()
    resp = requests.post(STUD_DETAIL_LINK % data.get("id",""))
    if resp.status_code == 200:
        try:
            stud_data = resp.json()
            if stud_data:
                print(data)
                stud_id = data.get("id")
                stud_name = stud_data.get("studentName")
                stud_pass = generate_password_hash(data.get("password"))
                stud_batch = stud_data.get("batch")
                stud_branch = stud_data.get("branchName")
                stud_course = stud_data.get("courseName")
                stud_college = stud_data.get("collegeName")
                stud_values = (stud_id,stud_name,stud_pass,stud_batch,stud_branch,stud_course,stud_college)
                
                cursor.execute("SELECT NAME,PASS FROM STUDENTS WHERE REGD = %s" ,(stud_id,))
                result = cursor.fetchone()
                print(result)
                if result:
                    return jsonify({"success" : False,"message" : "This ID is already registered"})            
                cursor.execute("INSERT INTO STUDENTS (REGD, NAME, PASS, BATCH, BRANCH, COURSE, COLLEGE) VALUES (%s,%s,%s,%s,%s,%s,%s);" , stud_values)
                db.commit()
                valid = True
        except Exception as e:
            print(e)
            valid = False

    if valid:
        return jsonify({"success" : True,"message" : "Registration Successfull"}),200
    else:
        return jsonify({"success" : False,"message" : "Not a valid BPUT registration number"}),400

@app.route("/login",methods=['POST'])
def login():
    data = request.get_json()

    REGD_ID = data.get("id")
    REGD_PASS = data.get("password")
    captcha_response = data.get("captcha")

    
    captcha_verify = requests.post(
        "https://www.google.com/recaptcha/api/siteverify",
        data={
            "secret": os.getenv("CAPTCHA_SECRET"),
            "response": captcha_response
        }
    )

    captcha_result = captcha_verify.json()

    if not captcha_result.get("success"):
        return jsonify({"success": False, "message": "Captcha verification failed"}), 400

    
    cursor.execute("SELECT NAME,PASS FROM STUDENTS WHERE REGD = %s",(REGD_ID,))
    result = cursor.fetchone()

    if result and check_password_hash(result[1], REGD_PASS):
        return jsonify({"success": True, "message": "Login Successful"}), 200
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/faq")
def faq():
    return render_template("faq.html")

@app.route("/terms_conditions")
def terms_conditions():
    return render_template("terms-conditions.html")

@app.route("/privacy_policy")
def privacy_policy():
    return render_template("policy.html")


@app.route("/subscription")
def subscription():
    return render_template("subscription.html")

@app.route("/payment")
def payment_gateway():
    return render_template("gateway.html")

@app.route("/find-job")
def find_job():
    return render_template("find-job.html")

@app.route("/find-internship")
def find_internship():
    return render_template("find-internship.html")

@app.route("/analytics",methods=['GET'])
def analytics():
    data = dict()
    cursor.execute("SELECT COUNT(*) FROM STUDENTS;")
    data["total_students"] = cursor.fetchone()[0]
    cursor.execute("SELECT BRANCH,COUNT(BRANCH) FROM STUDENTS GROUP BY BRANCH;")
    data["branch"] = [{"BRANCH" : branch[0], "count" : branch[1]} for branch in cursor.fetchall()]
    cursor.execute("SELECT BATCH,COUNT(BATCH) FROM STUDENTS GROUP BY BATCH;")
    data["batch"] = [{"BATCH" : batch[0], "count" : batch[1]} for batch in cursor.fetchall()]
    cursor.execute("SELECT COURSE,COUNT(COURSE) FROM STUDENTS GROUP BY COURSE;")
    data["course"] = [{"BATCH" : course[0], "count" : course[1]} for course in cursor.fetchall()]
    cursor.execute("SELECT COLLEGE,COUNT(COLLEGE) FROM STUDENTS GROUP BY COLLEGE;")
    data["college"] = [{"BATCH" : college[0], "count" : college[1]} for college in cursor.fetchall()]
    return jsonify(data)

@app.route("/students",methods=["POST"])
def students():
    data = []
    json = request.get_json()
    SID = json.get("SID",0)
    db = mysql.connector.connect(host="localhost",user="root",password="Prem@2006",database="HACKATHON")
    cursor = db.cursor()
    cursor.execute("SELECT SL_NO,REGD,NAME,BATCH,BRANCH,COURSE,COLLEGE FROM STUDENTS WHERE SL_NO >= %s LIMIT 30;",(SID,))
    raw_data = cursor.fetchall()
    print(SID)
    db.close()
    for raw in raw_data:
        data.append({"SL_NO" : raw[0],"REGD":raw[1],"NAME" : raw[2],"BATCH":raw[3],"BRANCH":raw[4],"COURSE" : raw[5],"COLLEGE" : raw[6]})
    return jsonify(data)

@app.route("/job",methods=["POST"])
def recommend_job():
    data = request.get_json()
    combined_data = f"{data['course']} {data['branch']} {data['cgpa']} {data['skills']} {data['interests']} {data['certifications']} {data['projects']}"
    vectorized_data = model_vectorizer.transform([combined_data])
    predicted_jobs = job_model.predict(vectorized_data)
    return jsonify({"data":predicted_jobs[0]})

@app.route("/internship",methods=["POST"])
def recommend_internship():
    data = request.get_json()
    combined_data = f"{data['course']} {data['branch']} {data['cgpa']} {data['skills']} {data['interests']} {data['certifications']} {data['projects']}"
    vectorized_data = model_vectorizer.transform([combined_data])
    predicted_internships = intern_model.predict(vectorized_data)
    return jsonify({"data":predicted_internships[0]})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

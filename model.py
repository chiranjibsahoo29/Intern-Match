import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib

data = pd.read_csv("job_data.csv")
data['combined'] = data['course'] + ' ' + data['branch'] + ' ' + data['cgpa'].astype(str) + ' ' + data['skills'] + ' ' + data['interests'] + ' ' + data['certifications']  + ' ' + data['projects']

X = data["combined"]
Y = data["career_goal"]
# Y = data["internship"]

vectorizer = TfidfVectorizer()
X_VECTOR = vectorizer.fit_transform(X)

X_train,X_test,Y_train,Y_test = train_test_split(X_VECTOR,Y,test_size=0.2,random_state=42)

model = RandomForestClassifier(class_weight='balanced',random_state=42)
model.fit(X_train,Y_train)

y_pred = model.predict(X_test)
accuracy = accuracy_score(Y_test,y_pred)
print(f"Model Accuracy: {accuracy * 100}")
print(classification_report(Y_test,y_pred))

user_data ={
    "course" : "B.Tech",
    "branch": "MECH",
    "cgpa": 6.69,
    "skills": "Circuit Design",
    "interests": "Python",
    "certifications" : "Financial Markets - Yale",
    "projects": "Team Leadership Simulation",
}

combined_user_data = f"{user_data['course']} {user_data['branch']} {user_data['cgpa']} {user_data['skills']} {user_data['interests']} {user_data['certifications']} {user_data['projects']}"

vectorized_data = vectorizer.transform([combined_user_data])
print(model.predict(vectorized_data))

joblib.dump(model,"job.pkl")
#joblib.dump(vectorizer,"vectorizer.pkl")

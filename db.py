import mysql.connector

db = mysql.connector.connect(get_warnings=True,raise_on_warnings=True,host="localhost",user="root",password="Prem@2006",database="HACKATHON")
print(5)
cursor = db.cursor()
# cursor.execute("CREATE DATABASE IF NOT EXISTS HACKATHON")
cursor.execute("DROP TABLE STUDENTS")
cursor.execute("""CREATE TABLE STUDENTS (
    SL_NO INT AUTO_INCREMENT PRIMARY KEY,
    REGD BIGINT NOT NULL,
    NAME VARCHAR(50) NOT NULL,
    PASS VARCHAR(200) NOT NULL,
    BATCH VARCHAR(10) NOT NULL,
    BRANCH VARCHAR(100) NOT NULL,
    COURSE VARCHAR(20) NOT NULL,
    COLLEGE VARCHAR(100) NOT NULL
)
""")
import random

BATCH = [2022,2023,2024,2025]
BRANCH = ["CSE","CIVIL","MECH","EEE"]
COURSE = ["BTECH","MTECH","MBA","MCA"]
COLLEGE = ["Col1","Col2","Col3","Col4"]

# for i in range(0,100):
#     stud_values = (2401310000+i,f"NAME {i}",f"PASS {i}",random.choice(BATCH),random.choice(BRANCH),random.choice(COURSE),random.choice(COLLEGE))
#     cursor.execute("INSERT INTO STUDENTS (REGD, NAME, PASS, BATCH, BRANCH, COURSE, COLLEGE) VALUES (%s,%s,%s,%s,%s,%s,%s);" , stud_values)
# db.commit()


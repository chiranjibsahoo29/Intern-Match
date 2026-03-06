# import requests
# STUD_DETAIL_LINK = "https://results.bput.ac.in/student-detsils-results?rollNo=%s"
# for i in range(2205297100,2205297140):
#     try:
#         res = requests.post(STUD_DETAIL_LINK % str(i)) #"2205297107"
#         print(res.json())
#         print("\n")
#     except:
#         print("Data not found")
# # print(res.json(),res.status_code)

import requests
SUBJECT_DETAIL_LINK = "https://results.bput.ac.in/student-results-subjects-list?semid=2&rollNo=2401310023&session=Even-(2024-25)"
res = requests.post(SUBJECT_DETAIL_LINK)
print(res.json())
input()
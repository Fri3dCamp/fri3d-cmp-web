import json
import re

regex = r"\/\/ [A-Za-z 0-9-_]+" # comment lines in json

with open('app/translations.js') as data_file:
    clean_json_txt = data_file.read()
    clean_json_txt = re.sub(regex,"",clean_json_txt).replace("angular.module('app').constant('translations', ","").replace("\"","").replace("'","\"").replace("\\","").replace("</","").replace("<","").replace(">","").replace("\n","").replace("\r","").replace(");","")
    print(clean_json_txt)
    data = json.loads(clean_json_txt)

keyslist = dict()

for key in data.keys():
    keyslist[key] = 0

filenames = [
    'app/submissions/submission.html',
    'app/submissions/collaborator-dialog.html'
]

for filename in filenames:
    with open(filename) as template_file:
        template_file_string = template_file.read()
        for key in keyslist:
            if template_file_string.find("'"+key+"'") >= 0:
                keyslist[key] += 1

print ("unused keys:")

for key,val in keyslist.items():
    if 0 == val:
        print (key)

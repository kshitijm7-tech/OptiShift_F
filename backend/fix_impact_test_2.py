with open("tests/test_impact.py", "r") as f:
    content = f.read()

content = content.replace('for c in t2.replacement_candidates:',
                          'for c in t2.replacement_details:')

with open("tests/test_impact.py", "w") as f:
    f.write(content)

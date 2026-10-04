with open("tests/test_impact.py", "r") as f:
    content = f.read()

content = content.replace('assert "critical" in t1.risk_reason.lower()',
                          'assert "owner-only" in t1.risk_reason.lower()')

content = content.replace('cands = t2.replacement_candidates',
                          'cands = t2.replacement_details')

with open("tests/test_impact.py", "w") as f:
    f.write(content)

import google.generativeai as genai
import json
# Configure Gemini
genai.configure(api_key="AIzaSyDR0RRjmj5xaGnzbTOnhJzDu_NT9HN1l2o")
#model = genai.GenerativeModel("gemini-pro")

# List of job fields
FIELDS = [
    "title", "description", "requirements", "type", "category", "duration",
    "skills", "salary.amount", "preferredTime", "location"
]

# Prompt template
PROMPT_TEMPLATE = """
You are an assistant that determines the importance of different job fields based on a user's job query. 
Your task is to assign a **weight between 0 and 1** to each field, indicating how relevant that field is for understanding the user's intent.

The fields are:
- title
- description
- requirements
- type
- category
- duration
- skills
- salary.amount
- preferredTime (start + end)
- location (city + area)


### Examples:

---

**User Query**: "Looking for a delivery job in Mumbai in the evening hours"
**Weights**:
{{
  "title": 0.8,
  "description": 0.5,
  "requirements": 0.4,
  "type": 0.7,
  "category": 0.8,
  "duration": 0.5,
  "skills": 0.4,
  "salary.amount": 0.3,
  "preferredTime": 0.9,
  "location": 1.0
 
}}

---

**User Query**: "Need a high paying software developer internship"
**Weights**:
{{
  "title": 0.9,
  "description": 0.7,
  "requirements": 0.8,
  "type": 0.8,
  "category": 0.6,
  "duration": 0.5,
  "skills": 1.0,
  "salary.amount": 1.0,
  "preferredTime": 0.2,
  "location": 0.3
}}

---

**User Query**: "Part-time teaching job in Pune or Mumbai, available on weekends"
**Weights**:
{{
  "title": 0.8,
  "description": 0.6,
  "requirements": 0.6,
  "type": 1.0,
  "category": 0.9,
  "duration": 0.4,
  "skills": 0.5,
  "salary.amount": 0.3,
  "preferredTime": 0.6,
  "location": 1.0
}}

---

Now based on this example format, process the following query:

**User Query**: "{query}"

Return output as a JSON object with field names as keys and float weights between 0 to 1 as values. No explanation needed.
"""


def get_field_weights(query: str):
    prompt = PROMPT_TEMPLATE.format(query=query)
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)

    # Parse model output
    try:
        # Clean up LLM output and parse it safely
        cleaned = response.text.strip().strip("```json").strip("```").strip()
        weights = json.loads(cleaned)
        return weights
    except Exception as e:
        print("Failed to parse weights:", e)
        print("Raw LLM output:", response.text)
        return {field: 1.0 for field in FIELDS}

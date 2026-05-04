from fastapi import FastAPI, Request,HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from googletrans import Translator
from nltk.stem import PorterStemmer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.neighbors import NearestNeighbors
from geopy.geocoders import Nominatim
# from sklearn.neighbors import NearestNeighbors
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd
import numpy as np
import ast
import uuid
import uvicorn
import json
from sentence_transformers import SentenceTransformer
from gemini import get_field_weights
#Initialize FastAPI app
app = FastAPI()
translator = Translator()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== Data Loading and Preprocessing ========== #

def convert(text):
    return [item.strip() for item in text.replace(", and", ",").split(",")]

def torep(text):
    return text.replace("-", " ")

def format_str_list(ls):
    try:
        return ast.literal_eval(ls)
    except:
        return []

def remove_space(lst):
    return [x.replace(" ", "") for x in lst]

def convert_to_list(num):
    return [num]

def preprocess():
    df = pd.read_csv("jobs_converted_utf8.csv")
    df = df[['jobId', 'title', 'category', 'tags', 'skills', 'location.city', 'salary.amount',
             'employer.name', 'latitude', 'longitude', 'recid', 'description', 'requirements']]
    df.dropna(inplace=True)

    df['employer.name'] = df['employer.name'].apply(convert).apply(remove_space)
    df['category'] = df['category'].apply(convert)
    df['name'] = df['title'].apply(convert).apply(remove_space)
    df['city'] = df['location.city'].apply(convert)
    df['tags'] = df['tags'].apply(torep).apply(format_str_list).apply(remove_space)
    df['skills'] = df['skills'].apply(format_str_list).apply(remove_space)
    df['salary'] = df['salary.amount'].apply(convert_to_list)
    df['tag'] = df['city'] + df['name'] + df['category'] + df['tags'] + df['skills']

    new_df = df[['jobId', 'title', 'salary.amount', 'location.city', 'tag', 'latitude',
                 'longitude', 'recid', 'description', 'requirements', 'employer.name']].copy()
    new_df['tag'] = new_df['tag'].apply(lambda x: " ".join(map(str, x))).str.lower()

    ps = PorterStemmer()
    new_df['tag'] = new_df['tag'].apply(lambda text: " ".join([ps.stem(i) for i in text.split()]))

    cv = CountVectorizer(max_features=5000, stop_words='english')
    vector = cv.fit_transform(new_df['tag']).toarray()
    similarity = cosine_similarity(vector)
    return df, new_df, similarity, cv

# Load initial data
data, new_df, similarity, cv = preprocess()

# Allowed cities and coordinates
ALLOWED_CITIES = {"Bangalore", "Mysore", "Mumbai", "Pune", "Delhi", "Lucknow", "Ahmedabad"}
CITY_COORDINATES = {
    "Bangalore": (12.9716, 77.5946), "Mysore": (12.2958, 76.6394),
    "Mumbai": (19.0760, 72.8777), "Pune": (18.5204, 73.8567),
    "Delhi": (28.7041, 77.1025), "Lucknow": (26.8467, 80.9462),
    "Ahmedabad": (23.0225, 72.5714),
}

# ========== Schemas ========== #

class RecommendRequest(BaseModel):
    title: str
    city: str = None
    salary: float = None
    job: str = None

class JobInput(BaseModel):
    title: str
    jobLevel: str
    city: str
    tags: list[str]
    minSalary: int
    maxSalary: int
    description: str

# ========== Endpoints ========== #

@app.post("/add-job")
async def add_job(job: JobInput):
    global data, new_df, similarity, cv

    new_job = {
        "jobId": str(uuid.uuid4()),
        "title": job.title,
        "category": "General",
        "tags": str(job.tags),
        "skills": str(["python"]),
        "salary.amount": str(job.maxSalary),
        "location.city": job.city,
        "location.area": "central",
        "employer.name": "New Corp",
        "description": job.description,
        "requirements": "N/A",
        "latitude": 0.0,
        "longitude": 0.0,
        "recid": "N/A"
    }

    df = pd.read_csv("jobs_converted_utf8.csv")
    df = pd.concat([df, pd.DataFrame([new_job])], ignore_index=True)
    df.to_csv("jobs_converted_utf8.csv", index=False)

    # Reload and reprocess data
    data, new_df, similarity, cv = preprocess()
    return {"status": "Job added"}


# @app.post("/recommends")
# async def recommend_endpoint(req: RecommendRequest):
#     title = req.title
#     city = req.city

#     geolocator = Nominatim(user_agent="job_recommender")
#     location = geolocator.geocode(city)

#     if not location:
#         return {"message": "Invalid city name."}

#     user_location = np.radians([[location.latitude, location.longitude]])

#     # Step 1: Try to find jobs with similar title
#     index = new_df[new_df['title'].str.contains(title, case=False, na=False)].index

#     if len(index) > 0:
#         distances = sorted(list(enumerate(similarity[index[0]])), reverse=True, key=lambda x: x[1])
#         rec_list = []
#         for i, _ in distances[1:100]:
#             rec_list.append({
#                 'jobId': new_df.iloc[i].jobId,
#                 'latitude': new_df.iloc[i]['latitude'],
#                 'longitude': new_df.iloc[i]['longitude'],
#                 'title': new_df.iloc[i]['title']
#             })

#         rec_df = pd.DataFrame(rec_list)
#         if not rec_df.empty:
#             job_locations = np.radians(rec_df[['latitude', 'longitude']].to_numpy())
#             nbrs = NearestNeighbors(n_neighbors=min(20, len(job_locations)), metric="haversine").fit(job_locations)
#             distances, indices = nbrs.kneighbors(user_location)
#             within_radius = np.degrees(distances) * 111 <= 500
#             filtered = indices[0][within_radius[0]]
#             rec_df = rec_df.iloc[filtered]
#             return rec_df.head(20)[['jobId']].to_dict(orient="records")

#     # Step 2: If no title match, fallback to any nearby jobs
#     job_locations_all = np.radians(new_df[['latitude', 'longitude']].to_numpy())
#     nbrs = NearestNeighbors(n_neighbors=min(50, len(job_locations_all)), metric="haversine").fit(job_locations_all)
#     distances, indices = nbrs.kneighbors(user_location)
#     within_radius = np.degrees(distances) * 111 <= 500
#     filtered_idx = indices[0][within_radius[0]]
#     fallback_jobs = new_df.iloc[filtered_idx]
#     return fallback_jobs.head(20)[['jobId']].to_dict(orient="records")

@app.post("/recommends")
async def recommend_endpoint(req: RecommendRequest):
    title = req.title
    city = req.city

    index = new_df[new_df['title'].str.contains(title, case=False, na=False)].index
    if len(index) == 0:
        return {"message": f"No jobs found for title: {title}"}

    distances = sorted(list(enumerate(similarity[index[0]])), reverse=True, key=lambda x: x[1])
    rec_list = []

    for i, dist in distances[1:50]:
        rec_list.append({
            'jobId': new_df.iloc[i].jobId,
            'title': new_df.iloc[i].title,
            'latitude': new_df.iloc[i]['latitude'],
            'longitude': new_df.iloc[i]['longitude']
        })

    rec = pd.DataFrame(rec_list)
    if rec.empty:
        return {"message": "No job recommendations found."}

    rec['title_match'] = rec['title'].str.contains(title, case=False, na=False).astype(int)

    geolocator = Nominatim(user_agent="job_recommender")
    try:
        location = geolocator.geocode(city, timeout=10)
    except Exception as e:
        print(f"Geocoding error: {e}")
        location = None

    if location:
        user_location = np.radians([[location.latitude, location.longitude]])
        job_locations = np.radians(rec[['latitude', 'longitude']].to_numpy())
        nbrs = NearestNeighbors(n_neighbors=min(20, len(job_locations)), metric="haversine").fit(job_locations)
        distances, indices = nbrs.kneighbors(user_location)

        within_radius = np.degrees(distances) * 111 <= 500
        filtered_indices = indices[0][within_radius[0]]
        rec = rec.iloc[filtered_indices]
    else:
        rec = rec.head(20)

    rec = rec.sort_values(by=['title_match'], ascending=[False])
    return rec.head(20)[['jobId']].to_dict(orient='records')

# ========== Translation API ========== #

def translate_text(text, dest_lang='hi'):
    if text is None or str(text).strip() == '':
        return '' if text is None else str(text)
    try:
        translated = translator.translate(str(text), dest=dest_lang)
        return translated.text
    except Exception as e:
        print(f"Translation error for '{text}': {e}")
        return str(text)

def convert_record(record):
    converted = {}
    for key, value in record.items():
        if key == 'salary' and isinstance(value, dict):
            # Handle salary nested object
            converted[key] = {}
            for salary_key, salary_value in value.items():
                converted[key][salary_key] = {
                    "en": str(salary_value) if salary_value is not None else '',
                    "hi": translate_text(str(salary_value) if salary_value is not None else '')
                }
        elif key == 'location' and isinstance(value, dict):
            # Handle location nested object
            converted[key] = {}
            for location_key, location_value in value.items():
                converted[key][location_key] = {
                    "en": str(location_value) if location_value is not None else '',
                    "hi": translate_text(str(location_value) if location_value is not None else '')
                }
        elif key == 'employer' and isinstance(value, dict):
            # Handle employer nested object
            converted[key] = {}
            for employer_key, employer_value in value.items():
                converted[key][employer_key] = {
                    "en": str(employer_value) if employer_value is not None else '',
                    "hi": translate_text(str(employer_value) if employer_value is not None else '')
                }
        elif key == 'preferredTime' and isinstance(value, dict):
    # Flatten preferredTime to preferredTime.start, preferredTime.end
            for time_key, time_value in value.items():
                new_key = f"{key}.{time_key}"
                converted[new_key] = {
                "en": str(time_value) if time_value is not None else '',
                "hi": translate_text(str(time_value) if time_value is not None else '')
            }

        elif key == 'schedule' and isinstance(value, dict):
            # Handle schedule nested object
            converted[key] = {}
            for schedule_key, schedule_value in value.items():
                if isinstance(schedule_value, list):
                    # Handle arrays like 'days'
                    converted[key][schedule_key] = {
                        "en": schedule_value,
                        "hi": [translate_text(str(item)) for item in schedule_value]
                    }
                else:
                    # Handle strings like 'shifts'
                    converted[key][schedule_key] = {
                        "en": str(schedule_value) if schedule_value is not None else '',
                        "hi": translate_text(str(schedule_value) if schedule_value is not None else '')
                    }
        elif key in ['tags', 'skills'] and isinstance(value, list):
            # Handle array fields that need localization
            converted[key] = {
                "en": value,
                "hi": [translate_text(str(item)) for item in value]
            }
        elif key in ['jobId', 'recid', 'latitude', 'longitude']:
            # Handle fields that don't need translation (IDs, coordinates)
            converted[key] = str(value) if value is not None else ''
        elif key in ['vacancies'] and isinstance(value, (int, float)):
            # Handle numeric fields that need to be stored as localized strings
            converted[key] = {
                "en": str(value),
                "hi": str(value)  # Numbers don't need translation
            }
        elif key == 'isApplied' and isinstance(value, bool):
            # Handle boolean fields stored as localized strings
            converted[key] = {
                "en": str(value).lower(),
                "hi": str(value).lower()  # Boolean values don't need translation
            }
        else:
            # Handle all other string fields
            converted[key] = {
                "en": str(value) if value is not None else '',
                "hi": translate_text(str(value) if value is not None else '')
            }
    return converted


@app.post("/translate-job")
async def translate_job(request: Request):
    body = await request.json()
    bilingual_job = convert_record(body)
    return bilingual_job

# ========== text recommendations ========== #





# class TextRecommendRequest(BaseModel):
#     query: str

# # Load model and job data once at startup
# print("Loading model...")
# model = SentenceTransformer("all-MiniLM-L6-v2")

# print("Loading jobs...")
# with open("joblist.json", "r", encoding="utf-8") as f:
#     raw_jobs = json.load(f)

# def flatten_job_entry(entry):
#     location = entry.get("location", {})
#     city = location.get("city", {}).get("en", "")
#     area = location.get("area", {}).get("en", "")

#     return {
#         "jobId": int(entry.get("jobId", 0)),
#         "title": entry.get("title", {}).get("en", ""),
#         "description": entry.get("description", {}).get("en", ""),
#         "requirements": entry.get("requirements", {}).get("en", ""),
#         "type": entry.get("type", {}).get("en", ""),
#         "category": entry.get("category", {}).get("en", ""),
#         "duration": entry.get("duration", {}).get("en", ""),
#         "skills": " ".join(entry.get("skills", {}).get("en", [])),
#         "tags": " ".join(entry.get("tags", {}).get("en", [])),
#         "location": f"{city} {area}"
#     }

# flattened_jobs = [flatten_job_entry(job) for job in raw_jobs]

# # Combine fields into a single string per job
# def vectorize_job(job):
#     return " ".join([
#         job["title"],
#         job["description"],
#         job["requirements"],
#         job["type"],
#         job["category"],
#         job["duration"],
#         job["skills"],
#         job["tags"],
#         job["location"]
#     ])

# corpus = [vectorize_job(job) for job in flattened_jobs]

# # TF-IDF vectorization
# tfidf_vectorizer = TfidfVectorizer(stop_words='english')
# job_vectors = tfidf_vectorizer.fit_transform(corpus)

# @app.post("/recommend")
# def recommend_jobs(req: JobRequest):
#     if not req.query.strip():
#         raise HTTPException(status_code=400, detail="Empty query string")

#     query_vec = tfidf_vectorizer.transform([req.query])
#     similarity_scores = cosine_similarity(query_vec, job_vectors).flatten()

#     threshold = 0.2  # Adjust based on quality
#     top_indices = similarity_scores.argsort()[::-1]
#     filtered = [(i, similarity_scores[i]) for i in top_indices if similarity_scores[i] > threshold]

#     if not filtered:
#         return {"message": "No matching jobs found."}

#     results = [flattened_jobs[i] for i, _ in filtered[:5]]
#     return results


class TextRecommendRequest(BaseModel):
    query: str

# Load model and job data once at startup
print("Loading model...")
model = SentenceTransformer("all-MiniLM-L6-v2")

print("Loading jobs...")
with open("joblist.json", "r", encoding="utf-8") as f:
    raw_jobs = json.load(f)

def flatten_job_entry(entry):
    return {
        "jobId": int(entry["jobId"]),
        "title": entry["title"]["en"],
        "description": entry["description"]["en"],
        "requirements": entry["requirements"]["en"],
        "type": entry["type"]["en"],
        "category": entry["category"]["en"],
        "duration": entry["duration"]["en"],
        "tags": eval(entry["tags"]["en"]),
        "skills": eval(entry["skills"]["en"]),
        "salary": int(entry["salary"]["amount"]["en"]),
        "preferred_start": entry["preferredTime.start"]["en"],
        "preferred_end": entry["preferredTime.end"]["en"],
        "city": entry["location"]["city"]["en"],
        "area": entry["location"]["area"]["en"],
        #"days": eval(entry["schedule.days"]["en"]),
    }

def get_job_text(row, weights):
    fields = [
        ("title", row["title"]),
        ("description", row["description"]),
        ("requirements", row["requirements"]),
        ("type", row["type"]),
        ("category", row["category"]),
        ("duration", row["duration"]),
        ("skills", " ".join(row["skills"])),
        ("salary.amount", str(row["salary"])),
        ("preferredTime", f"{row['preferred_start']} {row['preferred_end']}"),
        ("location", f"{row['city']} {row['area']}"),
        #("schedule.days", " ".join(row["days"]))
    ]
    weighted_text = []
    for field, value in fields:
        weight = weights.get(field, 1.0)
        weighted_text.append((value + " ") * int(weight * 10))
    return " ".join(weighted_text)


@app.post("/recommend_by_text")
async def recommend_by_text(req: TextRecommendRequest):
    try:
        query = req.query
        weights = get_field_weights(query)

        jobs = [flatten_job_entry(e) for e in raw_jobs]
        df = pd.DataFrame(jobs)
        df['text'] = df.apply(lambda row: get_job_text(row, weights), axis=1)

        job_embeddings = model.encode(df['text'].tolist(), show_progress_bar=False)
        query_embedding = model.encode([query])

        scores = cosine_similarity(query_embedding, job_embeddings)[0]
        top_indices = scores.argsort()[-20:][::-1]
        top_job_ids = df.iloc[top_indices]['jobId'].tolist()

        return top_job_ids
    except Exception as e:
        return {"error": str(e)}
# ========== Run Server ========== #

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)




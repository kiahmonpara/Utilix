import json
import os
from datetime import datetime

FEEDBACK_FILE = os.path.join(os.getcwd(), "user_requests.json")

def load_requests():
    if not os.path.exists(FEEDBACK_FILE):
        return []
    with open(FEEDBACK_FILE, "r") as f:
        return json.load(f)

def save_request(request):
    all_requests = load_requests()
    all_requests.append(request)
    with open(FEEDBACK_FILE, "w") as f:
        json.dump(all_requests, f, indent=2)

def submit_request():
    print("=== Feature Request ===")
    name = input("Your Name (optional): ").strip()
    feature = input("Describe the tool/feature you'd like to see: ").strip()

    request = {
        "name": name if name else "Anonymous",
        "feature": feature,
        "timestamp": datetime.now().isoformat()
    }

    save_request(request)
    print("✅ Thank you! Your request has been recorded.")

def view_requests():
    requests = load_requests()
    print(f"\n📋 Total Requests: {len(requests)}\n")
    for i, req in enumerate(requests, 1):
        print(f"{i}. {req['feature']} (by {req['name']}, on {req['timestamp']})")

if __name__ == "__main__":
    print("1. Submit a Request")
    print("2. View All Requests")
    choice = input("Select an option (1 or 2): ").strip()

    if choice == "1":
        submit_request()
    elif choice == "2":
        view_requests()
    else:
        print("❌ Invalid option.")

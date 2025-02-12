import random
import string

from locust import HttpUser, between, task

class TrekkyfyUser(HttpUser):
    wait_time = between(1, 3)  
    def on_start(self):
        self.register_user()
        self.login()

    def register_user(self):
        roles = ["hiker", "guide"]
        selected_role = random.choice(roles) 
        random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=5))
        
        email = f"testuser_{random_suffix}@example.com"
        password = "password123"

        response = self.client.post("/api/register", json={
            "email": email,
            "password": password,
            "confirm_password": password,
            "role": selected_role
        }, name="User Registration")
        
        if response.status_code == 201:
            print(f"User {email} registered successfully as a {selected_role}.")
            self.email = email
            self.password = password
        else:
            print("Registration failed.")
            self.email = None
            self.password = None

    def login(self):
        if self.email and self.password:
            response = self.client.post("/api/login", json={"email": self.email, "password": self.password}, name="User Login")
            if response.status_code == 200:
                self.token = response.json().get("access_token")
            else:
                self.token = None
                print("Login failed.")
        else:
            self.token = None

    @task(3)
    def get_homepage(self):
        self.client.get("/", name="Homepage")
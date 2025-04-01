import random
import json
from faker import Faker

fake = Faker()

# Provided hiker IDs from your user table
hiker_ids = [
    "H05YYOUU", "H064QDM3", "H09YHYQV", "H0I792HS", "H0SOUQMB", "H15Q6gwn6",
    "H1COMHNB", "H1OJEPN8", "H2ANY9FC", "H3E190JD", "H3O8BE2U", "H3TIURZ2",
    "H43U2HK9", "H44FJ76N", "H4D2YYM6", "H4V4AZO1", "H4WPR4FT", "H53OYV34",
    "H53PQIS9", "H56F8VZX", "H59909DY", "H5AERQ3R", "H5P1BVR4", "H5R6UTXZ",
    "H5S8VM42", "H5TVNBUH", "H5YT46SL", "H61X1G4Z", "H68L0HBZ", "H6LRB6YO",
    "H7092Z8H", "H748CUF2", "H9BHW6RE", "H9DQSY30", "H9JY7QPF", "H9RONHYB",
    "H9VJ45LH", "HB6UYS06", "HB8870MM", "HBKLF2UW", "HBSNMRGO", "HBVPE9VX",
    "HCBTBXTT", "HCUUXA6J", "HCVSTQAV", "HD3M7H8Q", "HEIKHRR8", "HEIX7U4E",
    "HEQWNGQE", "HF4CR8DA", "HFA3WK49", "HFBY9F29", "HG5EEKFK", "HGRU2YB6",
    "HGRY9XP8", "HH50OTR4", "HHMZI7TH", "HHPXEGLO", "HI6Z9WYY", "HIKRZZ2E",
    "HIN8IZEK", "HJ5OSJCS", "HJDCFDBU", "HJGT6C0I", "HJRZ163O", "HJV76SY1",
    "HJXP8AUG", "HK4M7PEB", "HK5K4VG9", "HK6M8I0Q", "HKD93RXC", "HKUC7R9D",
    "HKX7KSH6", "HM3RPSHZ", "HMF0DM1L", "HMUCGOY2", "HO0BKADA", "HO0WOAJU",
    "HO6XD9QP", "HOLJEJ9N", "HOR8L1ZE", "HORYR49C", "HP6124P5", "HPJOBAP5",
    "HQJRFO8K", "HR5SG7JF", "HR80VSZ8", "HRRX9UD4", "HSLJPJXG", "HSRL5YSH",
    "HTLPZRIL", "HU4P78CH", "HUSF0CMJ", "HVFF1FFW", "HVGV766V", "HW49V310",
    "HWWZTYF4", "HX0FJBZK", "HYLM6OFA", "HZ62AS4H", "HZDD9BDB"
]

# Provided guide IDs from your user table
guide_ids = [
    "G0SYACKL", "G2H8YIJ9", "G3E1E1", "G41P73EO", "G498FUKR", "G4IUMSLK",
    "G4N7VBQF", "G7p7aF7y5", "G7QPJ17M", "G81ISYUJ", "G89VD8XZ", "G8YYJX2H",
    "GA5BBNTD", "GAN8B4GQ", "GAWADGV4", "GAZV5I1O", "GBFPIM92", "GC8YY7PA",
    "GCZ3YGO6", "GD72A932", "GFCXHUHO", "GFHQLG7K", "GFV4XJKR", "GG78BKCU",
    "GGHUDFEE", "GHKNG3BR", "GHNHMVOX", "GHPYEVIH", "GHW2GZY8", "GHZTOOJ5",
    "GIA7NTQN", "GIFNNVDC", "GJNPEZZ6", "GJXWNKZ3", "GK3E7VEC", "GOM7VNKW",
    "GOZILMPE", "GP3UYXNB", "GQ6E0HJX", "GQ6JLO8A", "GQCRODMG", "GQY38R0W",
    "GR6A4NLH", "GR6VVZ31", "GRDXVWRJ", "GRID74QS", "GRLLK2U8", "GRMCL719",
    "GS2LGPLS", "GSUCB63N", "GTGTEWCU", "GUMJM2ZT", "GUUHB3KR", "GW65VVSV",
    "GWEVOPP9", "GXBCXJTG", "GXUTGP22", "GY17BTBB", "GZS09CQV", "GZZ09EYJ",
    "GZZWSONE"
]

# We'll generate a random trek_id (for example, a random integer between 1 and 50)
def generate_trek_id():
    return random.randint(1, 50)

# Generate a random JSON details object
def generate_details():
    details = {
        "feedback": random.choice(["Excellent trek", "Good experience", "Average trek", "Needs improvement"]),
        "rating": random.randint(1, 5),
        "notes": fake.sentence(nb_words=8)
    }
    # Convert dictionary to a JSON-formatted string; escape single quotes for SQL
    json_details = json.dumps(details).replace("'", "''")
    return json_details

# Function to generate random datetime string in the past 2 years
def generate_created_at():
    return fake.date_time_between(start_date='-2y', end_date='now').strftime('%Y-%m-%d %H:%M:%S')

# We'll generate, for example, 200 sample booking entries
insert_statements = []

for _ in range(200):
    hiker_id = random.choice(hiker_ids)
    guide_id = random.choice(guide_ids)
    trek_id = generate_trek_id()
    details = generate_details()
    created_at = generate_created_at()
    
    stmt = (
        "INSERT INTO bookings (hiker_id, trek_id, guide_id, details, created_at) VALUES ("
        f"'{hiker_id}', {trek_id}, '{guide_id}', '{details}', '{created_at}');"
    )
    insert_statements.append(stmt)

# Output the generated SQL INSERT statements
for stmt in insert_statements:
    print(stmt)

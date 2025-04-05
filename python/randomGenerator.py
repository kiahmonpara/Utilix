import random
import string
from faker import Faker

fake = Faker()

def random_color():
    return "#{:06x}".format(random.randint(0, 0xFFFFFF))

def random_number(start=1, end=100):
    return random.randint(start, end)

def random_float(start=0.0, end=1.0):
    return round(random.uniform(start, end), 4)

def random_name():
    return fake.name()

def random_word():
    return fake.word()

def random_sentence():
    return fake.sentence()

def random_emoji():
    return chr(random.randint(0x1F600, 0x1F64F))

def random_password(length=10):
    chars = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(chars) for _ in range(length))

# Map options to functions (UUID removed)
options = {
    "1": ("Color", random_color),
    "2": ("Integer (1–100)", random_number),
    "3": ("Float (0.0–1.0)", random_float),
    "4": ("Name", random_name),
    "5": ("Word", random_word),
    "6": ("Sentence", random_sentence),
    "7": ("Emoji", random_emoji),
    "8": ("Password", random_password)
}

def show_menu():
    print("\n🎲 What would you like to generate?")
    for key, (label, _) in options.items():
        print(f" {key}. {label}")
    print(" 0. Exit")

if __name__ == "__main__":
    while True:
        show_menu()
        choice = input("Choose an option (0–8): ").strip()

        if choice == "0":
            print("👋 Exiting. Have fun!")
            break
        elif choice in options:
            label, func = options[choice]
            result = func()
            print(f"✅ Random {label}: {result}")
        else:
            print("❌ Invalid choice. Please try again.")

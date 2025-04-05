import uuid

def generate_uuid():
    """Generate a random UUID (version 4)."""
    return str(uuid.uuid4())

# Example usage
if __name__ == "__main__":
    print("Random UUIDv4:", generate_uuid())

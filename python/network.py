import socket
import subprocess
import platform
import requests
import shutil
from ping3 import ping, verbose_ping

def ip_lookup(domain):
    try:
        ip = socket.gethostbyname(domain)
        print(f"The IP address of {domain} is {ip}")
    except socket.gaierror:
        print("Invalid domain or network error.")

def dns_lookup(domain):
    try:
        result = socket.gethostbyname_ex(domain)
        print(f"[DNS Lookup] \nDomain: {result[0]}")
        print(f"Aliases: {result[1]}")
        print(f"IP Addresses: {result[2]}")
    except socket.gaierror:
        print("[DNS Lookup] Invalid domain or network error.")

def ping_host(host, count=4):
    print(f"[Ping3] Pinging {host}...")
    try:
        for i in range(count):
            delay = ping(host, timeout=2)
            if delay is None:
                print(f"Request timed out.")
            else:
                print(f"Reply from {host}: time={round(delay * 1000, 2)}ms")
    except Exception as e:
        print(f"[Ping3] Error: {e}")

def get_public_ip():
    try:
        ip = requests.get("https://api.ipify.org").text
        print(f"[Your Public IP] {ip}")
    except requests.RequestException:
        print("[Public IP] Failed to retrieve public IP.")

if __name__ == "__main__":
    domain = input("Enter a domain (e.g., google.com): ")
    ip_lookup(domain)
    dns_lookup(domain)
    ping_host(domain)
    get_public_ip()

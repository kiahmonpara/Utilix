import socket
import subprocess
import platform
import requests
import shutil
from ping3 import ping, verbose_ping

def ip_lookup(domain):
    try:
        ip = socket.gethostbyname(domain)
        return f"The IP address of {domain} is {ip}"
    except socket.gaierror:
        return "Invalid domain or network error."

def dns_lookup(domain):
    try:
        result = socket.gethostbyname_ex(domain)
        output = f"[DNS Lookup] \nDomain: {result[0]}\n"
        output += f"Aliases: {result[1]}\n"
        output += f"IP Addresses: {result[2]}"
        return output
    except socket.gaierror:
        return "[DNS Lookup] Invalid domain or network error."

def ping_host(host, count=4):
    results = []
    results.append(f"[Ping3] Pinging {host}...")
    try:
        for i in range(count):
            delay = ping(host, timeout=2)
            if delay is None:
                results.append(f"Request timed out.")
            else:
                results.append(f"Reply from {host}: time={round(delay * 1000, 2)}ms")
        return results
    except Exception as e:
        results.append(f"[Ping3] Error: {e}")
        return results

def get_public_ip():
    try:
        ip = requests.get("https://api.ipify.org").text
        return f"[Your Public IP] {ip}"
    except requests.RequestException:
        return "[Public IP] Failed to retrieve public IP."
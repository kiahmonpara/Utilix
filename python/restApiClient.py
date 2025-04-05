import requests
import json as jsonlib
import time
from typing import Dict, Optional, Any, Union

def send_request(
    method: str,
    url: str,
    headers: Optional[Dict[str, str]] = None,
    params: Optional[Dict[str, str]] = None,
    body_type: Optional[str] = None,
    body_content: Optional[str] = None,
    auth_type: Optional[str] = None,
    auth_params: Optional[Dict[str, str]] = None,
    timeout: int = 30,
    verify_ssl: bool = True,
    follow_redirects: bool = True,
    files: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Enhanced API to send HTTP requests with support for various authentication methods,
    request formats, and detailed response information.
    
    Args:
        method: HTTP method (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)
        url: Target URL
        headers: Dict of headers
        params: URL parameters
        body_type: 'json', 'form', 'text', 'xml', 'html'
        body_content: The body content as a string
        auth_type: 'basic', 'bearer', 'api_key', 'none'
        auth_params: Parameters for authentication (e.g., username, password, token)
        timeout: Request timeout in seconds
        verify_ssl: Whether to verify SSL certificates
        follow_redirects: Whether to follow redirects
        files: Dict of files to upload

    Returns:
        Dict containing response data, headers, status code, and timing info
    """
    try:
        # Start timing
        start_time = time.time()
        
        # Prepare headers
        final_headers = headers or {}
        
        # Handle authentication
        if auth_type == 'basic' and auth_params and 'username' in auth_params and 'password' in auth_params:
            auth = (auth_params['username'], auth_params['password'])
        elif auth_type == 'bearer' and auth_params and 'token' in auth_params:
            final_headers['Authorization'] = f"Bearer {auth_params['token']}"
            auth = None
        elif auth_type == 'api_key' and auth_params and 'key' in auth_params and 'value' in auth_params:
            if auth_params.get('in_header', True):
                final_headers[auth_params['key']] = auth_params['value']
            else:
                params = params or {}
                params[auth_params['key']] = auth_params['value']
            auth = None
        else:
            auth = None

        # Prepare request body
        body = None
        if body_content:
            if body_type == 'json':
                try:
                    body = jsonlib.loads(body_content)
                except jsonlib.JSONDecodeError as e:
                    return {"error": f"Invalid JSON: {str(e)}", "status_code": 0, "success": False}
            elif body_type == 'form':
                try:
                    body = dict(x.split('=') for x in body_content.split('&') if '=' in x)
                except Exception as e:
                    return {"error": f"Invalid form data: {str(e)}", "status_code": 0, "success": False}
            elif body_type in ('text', 'xml', 'html'):
                body = body_content
                
        # Send request
        response = requests.request(
            method=method.upper(),
            url=url,
            headers=final_headers,
            params=params,
            json=body if body_type == 'json' else None,
            data=body if body_type in ('form', 'text', 'xml', 'html') else None,
            auth=auth if auth_type == 'basic' else None,
            timeout=timeout,
            verify=verify_ssl,
            allow_redirects=follow_redirects,
            files=files
        )
        
        # Calculate elapsed time
        elapsed_time = time.time() - start_time
        
        # Try to parse response as JSON if possible
        try:
            response_body = response.json()
            content_type = 'application/json'
        except:
            response_body = response.text
            content_type = response.headers.get('Content-Type', '').split(';')[0]
            
        # Compile all response information
        result = {
            "status_code": response.status_code,
            "success": response.status_code < 400,
            "headers": dict(response.headers),
            "content_type": content_type,
            "body": response_body,
            "time_ms": round(elapsed_time * 1000),
            "size_bytes": len(response.content)
        }
        
        return result

    except requests.exceptions.Timeout:
        return {"error": "Request timed out", "status_code": 0, "success": False}
    except requests.exceptions.ConnectionError:
        return {"error": "Connection error", "status_code": 0, "success": False}
    except requests.exceptions.TooManyRedirects:
        return {"error": "Too many redirects", "status_code": 0, "success": False}
    except requests.exceptions.RequestException as e:
        return {"error": str(e), "status_code": 0, "success": False}
    except Exception as e:
        return {"error": f"Unexpected error: {str(e)}", "status_code": 0, "success": False}
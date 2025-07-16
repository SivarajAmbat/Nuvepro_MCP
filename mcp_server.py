'''
Import the necesary libraries to build the MCP server 
- Add the following import statements at the top of your mcp_server.py file:
    - import httpx: For making asynchronous HTTP requests
    - import logging: For logging tool execution and error tracking
    - from fastmcp import FastMCP: To create and register tools in the MCP server
    - from datetime import datetime: For handling date/time values like booking timestamps
    - from typing import Union, List: For type hinting in tool functions
'''
import httpx
import logging
from fastmcp import FastMCP
from datetime import datetime
from typing import Union, List

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

'''
Define the MCP server
- Create an instance of FastMCP with a name for your server.
'''
mcp = FastMCP("MovieBookingMCP")


'''
Tool: get_all_movies
This tool fetches all available movies from the Movie Booking API.
    - Use @mcp.tool() to register the function as an MCP tool.
    - Define an async function named get_all_movies.
    - Add a docstring to explain what the tool does and what it returns.
    - Set the API URL:
        url = "http://localhost:3001/api/movies"
    - Use httpx.AsyncClient() to create an HTTP client.
    - Send a GET request with await client.get(url) to fetch movie data.
    - Use response.raise_for_status() to handle any HTTP errors.
    - Convert the response to JSON using response.json().
    - Return the result in the format: {"movies": movies}.
    - Use try-except to handle:
        - httpx.RequestError for connection issues.
        - httpx.HTTPStatusError for HTTP error responses.
    - Log messages using logger.info() for success and logger.error() for errors.
'''
# Task 1: get_all_movies()



'''
Tool: get_movie_basedon_name
This tool fetches all movies from the Movie Booking API and filters them by the provided movie name or partial name.
    - Use @mcp.tool() to register the function with the MCP server.
    - Define an async function get_movie_basedon_name(movie_name: str) to accept a movie name input.
    - Add a docstring explaining the input (movie_name) and expected output (filtered list or error message).
    - Set the API URL:
        url = "http://localhost:3001/api/movies"
    - Use httpx.AsyncClient() to send a GET request to the movie API.
    - Get the JSON response using response.json().
    - Check if the response is a dictionary and extract the list from data or movies key.
    - Ensure the movies variable is a list. If not, return an error message.
    - Identify the correct title key by checking for "movieName", "title", or "name".
    - Normalize and filter the movie list:
    - Convert both the input and movie titles to lowercase.
    - Match movies whose titles contain the given movie_name.
    - Return:
        - The filtered list if matches are found.
        - A message if no matches are found.
    - Use try-except blocks to handle:
        - httpx.RequestError for connection failures.
        - httpx.HTTPStatusError for API errors.
        - Exception for any unexpected errors.
'''
# Task 2: get_movie_basedon_name()



'''
Tool: create_movie
This tool creates a new movie entry in the Movie Booking API using the details provided by the user.
    - Use @mcp.tool() to register the function with the MCP server.
    - Define an async function create_movie(...) that accepts the following optional parameters:
        title, description, duration, show_date, show_time, available_seats.
    - Add a docstring to describe the function's purpose and parameters.
    - Set the API endpoint:
        url = "http://localhost:3001/api/movies"
    - Create a dictionary movie_data with keys matching the expected API schema:
    {
    "title": "...",
    "description": "...",
    "duration": ...,
    "showDateTimes": [{"date": "...", "time": "..."}],
    "availableSeats": ...
    }
    - Use httpx.AsyncClient() to create an async HTTP session.
    - Send a POST request to the API using await client.post(url, json=movie_data).
    - Raise an error for unsuccessful responses using response.raise_for_status().
    - Return:
        - The API response on successful creation.
        - Proper error messages if the request fails.
    - Error Handling:
        - httpx.RequestError: for connection/network issues.
        - httpx.HTTPStatusError: for server-side/API errors.
'''
# Task 3: create_movie()



'''
Tool: create_booking
This tool creates a new booking for a selected movie using the Movie Booking API.
    - Use @mcp.tool() to register the function with the MCP server.
    - Define an async function create_booking(...) with the following required parameters:
        - movie_id: ID of the movie to book.
        - customer_name: Name of the person booking the ticket.
        - show_date: Date of the show (YYYY-MM-DD).
        - show_time: Time of the show (HH:mm).
        - number_of_seats: Number of seats to reserve.
    - Add a docstring to describe:
        - What the tool does (creates a booking).
        - The meaning of each argument.
        - The expected response (success or error JSON).
    - Set the API Endpoint
        url = "http://localhost:3001/api/bookings"
    - Create a dictionary booking_data with the following keys:
    {
    "movieId": "...",
    "customerName": "...",
    "showDate": "...",
    "showTime": "...",
    "numberOfSeats": ...,
    "bookingDate": "current-UTC-time"
    }
    - Use datetime.utcnow().isoformat() + "Z" to record the current booking time.
    - Use httpx.AsyncClient() to initialize the HTTP client.
    - Send a POST request with await client.post(url, json=booking_data).
    - Use response.raise_for_status() to catch HTTP errors.
    - Return the response JSON upon success.
    - Error Handling
        - httpx.RequestError: For connection issues.
        - httpx.HTTPStatusError: For HTTP error codes (e.g. 400, 500).
'''
# Task 4: create_booking()



'''
Tool: get_all_bookings
This tool fetches all existing bookings from the Movie Booking API.
    - Use @mcp.tool() to register the function with the MCP server so it can be invoked using natural language.
    - Define an async function get_all_bookings() with no parameters.
    - Add a docstring that describes:
        - The tool’s purpose (retrieve all bookings).
        - The return format (array of bookings or an error message).
    - Set the API Endpoint
        url = "http://localhost:3001/api/bookings"
    - Use httpx.AsyncClient() to create an async HTTP session.
    - Send a GET request to the bookings endpoint: response = await client.get(url)
    - Use response.raise_for_status() to raise an error for bad HTTP status codes.
    - If successful, return the JSON response:
    - Error Handling
        - httpx.RequestError: Handles connection or network-related issues.
        - httpx.HTTPStatusError: Handles failed HTTP responses (like 404 or 500).
'''

# Task 5: get_all_bookings()



'''
Tool: get_booking_by_id
This tool fetches a specific booking by its ID from the Movie Booking API.
    - Use @mcp.tool() to register the function with the MCP server for natural language access.
    - Define an asynchronous function get_booking_by_id(booking_id: str) that accepts one parameter:
        - booking_id: The unique ID of the booking to be retrieved.
    - Add a docstring explaining:
        - The tool’s functionality (fetch a booking by ID).
        - Input argument (booking_id).
    - Expected output (single booking data or an error).
    - Construct the API URL
        url = f"http://localhost:3001/api/bookings/{booking_id}"
    - Use httpx.AsyncClient() to create an asynchronous client.
    - Send a GET request to the constructed URL:response = await client.get(url)
    - Use response.raise_for_status() to throw errors for bad responses (e.g., 404 Not Found).
    - Return the response data as JSON: return response.json()
    - Error Handling
        - httpx.RequestError: Handles connectivity or network errors.
        - httpx.HTTPStatusError: Catches invalid HTTP status codes and provides detailed error messages.
'''
# Task 6: get_booking_by_id()



'''
Tool: update_booking_datetime
This tool updates the show date and/or time for an existing booking in the Movie Booking API.
    - Use @mcp.tool() to register this function as an accessible tool in the MCP server.
    - Define an asynchronous function:update_booking_datetime())
        - booking_id: ID of the booking to be updated (required).
        - show_date: New show date (optional).
        - show_time: New show time (optional).
    - Add a docstring to describe:
        - The purpose of the function (update booking date/time).
        - Expected arguments and their formats.
        - What the function returns.
    - Build the URL for the PUT request
        url = f"http://localhost:3001/api/bookings/{booking_id}"
    - Construct the update payload and validate if show_date or show_time is provided else return error message.
    - Send the PUT request using httpx.AsyncClient()
    - Use response.raise_for_status() to raise exceptions for failed requests.
    - Return the updated booking data: return response.json()
    - Error Handling
        - Catches httpx.RequestError for connection issues.
        - Catches httpx.HTTPStatusError for non-200 responses.
'''
# Task 7: update_booking_datetime()



'''
Tool: cancel_booking
This tool cancels a booking based on the provided booking ID using the Movie Booking API.
    - Use @mcp.tool() to expose this function as a tool that can be triggered through natural language.
    - Define the asynchronous function: async def cancel_booking(booking_id: str)
        - booking_id: The unique identifier of the booking you want to cancel.
    - Add a docstring
        - Describes the function, required argument, and what the function returns (either success or error).
    - Set the DELETE endpoint URL
        url = f"http://localhost:3001/api/bookings/{booking_id}"
    - Make a DELETE request using httpx.AsyncClient()
    - Raise exception for any unsuccessful status: response.raise_for_status()
    - Return the success response as JSON: return response.json()
    - Error handling:
        - Catches httpx.RequestError: For connection/network issues.
        - Catches httpx.HTTPStatusError: For HTTP errors like 404, 500, etc.
'''
# Task 8: cancel_booking()



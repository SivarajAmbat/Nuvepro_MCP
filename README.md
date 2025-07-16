# Custom MCP Server for Movie Ticket Booking

This project demonstrates how to build a **Custom Model-Controlled Processor (MCP) Server** that interacts with a Movie Ticket Booking API using **natural language queries**. It showcases how MCP tools can be mapped to API endpoints, enabling users to perform various actions like searching for movies, creating bookings, and managing showtimes — all through NLP.

## What is this project?

This project is a Conversational MCP (Model-Controlled Processor) Server built using FastMCP, which allows users to interact with a Movie Booking API using natural language queries instead of traditional UI or forms. The MCP server intelligently:
- Understands user intent from plain English
- Prompts for missing information (like showtime, number of seats)
- Calls the appropriate backend API endpoints (like creating or canceling bookings)
- Responds with human-friendly messages

## Features

- Fetch all available movies
- Search for movies by name
- Add new movies with show details
- Create a new movie booking
- Retrieve all bookings
- Get booking by ID
- Update booking date and/or time
- Cancel a booking

Each tool handles API responses, error cases, and missing parameters gracefully.

## Tools and Technologies

- **Python 3.9+**
- **FastMCP** – For defining and exposing MCP tools
- **httpx** – For async HTTP requests to the backend API
- **Logging** – For internal logging and debugging
- **Uvicorn** – (when running via CLI) to serve the MCP server

## How to Build an MCP Tool

Follow these steps to define an MCP Server and create a tool that performs a specific API task (e.g., fetching all movies):

### Step 1: Import Necessary Libraries
Start by importing the required Python packages:
```
import httpx
import logging
from fastmcp import FastMCP
from datetime import datetime
from typing import Union, List
```
These libraries are used to define the MCP server, make async API requests, and log internal activity.

### Step 2: Define the MCP Server
Create an instance of the MCP server which will register all your tools:
```
mcp = FastMCP("MovieBookingMCP")
```
"MovieBookingMCP" is the name of your server instance. You can change this as needed.

### Step 3.1: Define a Tool to Perform a Specific Task

#### Task 1: get_all_movies()
This tool fetches all available movies from the Movie Booking API.

```
@mcp.tool()
async def get_all_movies():
    """
    Fetch all movies from the Movie Booking API.

    Returns:
        List of movie objects with their metadata.
    
    Example Output:
        [
            {"movieId": 1, "movieName": "Interstellar", ...},
            ...
        ]
    """
    url = "http://localhost:3001/api/movies"
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url)
            response.raise_for_status()
            movies = response.json()
            logger.info("Movies retrieved successfully.")
            return {"movies": movies}
        except httpx.RequestError as exc:
            logger.error(f"Request error: {exc}")
            return {"error": f"Request error: {str(exc)}"}
        except httpx.HTTPStatusError as exc:
            logger.error(f"HTTP error: {exc.response.status_code} - {exc.response.text}")
            return {"error": f"HTTP error: {exc.response.status_code} - {exc.response.text}"}
```

#### Task 2: get_movie_basedon_name()
This tool fetches all movies from the Movie Booking API and filters them by the provided movie name or partial name.

```
@mcp.tool()
async def get_movie_basedon_name(movie_name: str) -> Union[List[dict], dict]:
    """
    Fetch all movies from the Movie Booking API and filter them by the provided movie name.
 
    Args:
        movie_name (str): Name (or partial name) of the movie to search for.
 
    Returns:
        List of matching movies or an error message.
    """
    url = "http://localhost:3001/api/movies"
 
    async with httpx.AsyncClient() as client:
        try:
           
            response = await client.get(url)
            response.raise_for_status()
 
            movies = response.json()           
            # Handle if wrapped in "data" or other keys
            if isinstance(movies, dict):
                if "data" in movies:
                    movies = movies["data"]
                elif "movies" in movies:
                    movies = movies["movies"]
                else:
                   
                    return {"error": "Unexpected API structure: no 'data' or 'movies' key."}
 
            if not isinstance(movies, list):
               
                return {"error": "Expected a list of movies but got something else."}
 
            # Detect actual title key
            sample_movie = movies[0] if movies else {}
            movie_key = None
            for key in ["movieName", "title", "name"]:
                if key in sample_movie:
                    movie_key = key
                    break
 
            if not movie_key:
               
                return {"error": "Could not detect movie title key in API response."}
 
            # Case-insensitive filter
            movie_name = movie_name.strip().lower()
            filtered_movies = [
                movie for movie in movies
                if movie_name in movie.get(movie_key, "").lower()
            ]
 
            if not filtered_movies:
               
                return {"message": f"No movies found with name containing '{movie_name}'."}
 
           
            return filtered_movies
 
        except httpx.RequestError as exc:
           
            return {"error": f"Request error: {str(exc)}"}
        except httpx.HTTPStatusError as exc:
           
            return {"error": f"HTTP error: {exc.response.status_code} - {exc.response.text}"}
        except Exception as e:
           
            return {"error": f"Unexpected error: {str(e)}"}
```

#### Task 3: create_movie()
This tool creates a new movie entry in the Movie Booking API using the details provided by the user.

```
@mcp.tool()
async def create_movie(
    title: str = None,
    description: str = None,
    duration: int = None,
    show_date: str = None,
    show_time: str = None,
    available_seats: int = None
):
    """
    Create a new movie using the Movie Booking API. If any required field is missing,
    return a message prompting the user to provide it.
    """
    missing_params = []
    if not title:
        missing_params.append("title")
    if not description:
        missing_params.append("description")
    if duration is None:
        missing_params.append("duration")
    if not show_date:
        missing_params.append("show_date")
    if not show_time:
        missing_params.append("show_time")
    if available_seats is None:
        missing_params.append("available_seats")

    if missing_params:
        return {
            "message": f"Missing required fields: {', '.join(missing_params)}. Please provide them to create the movie."
        }

    url = "http://localhost:3001/api/movies"
    movie_data = {
        "title": title,
        "description": description,
        "duration": duration,
        "showDateTimes": [
            {
                "date": show_date,
                "time": show_time
            }
        ],
        "availableSeats": available_seats
    }
    async with httpx.AsyncClient() as client:
        try:
            logger.info(f"Creating a new movie: {movie_data}")
            response = await client.post(url, json=movie_data)
            response.raise_for_status()
            logger.info("Movie created successfully.")
            return response.json()
        except httpx.RequestError as exc:
            logger.error(f"Request error: {exc}")
            return {"error": f"Request error: {str(exc)}"}
        except httpx.HTTPStatusError as exc:
            logger.error(f"HTTP error: {exc.response.status_code} - {exc.response.text}")
            return {"error": f"HTTP error: {exc.response.status_code} - {exc.response.text}"}
```


#### Claude Desktop Configuration

##### Step 1. Install Claude Desktop
If not already installed, download and install the Claude Desktop App from Anthropic's official source.

##### Step 2. Launch Claude Desktop
Open the Claude Desktop application.
Log in with your account if prompted.

##### Step 3. Configure Claude Desktop to Use MCP Server
To connect Claude Desktop with your local MCP Server, follow these steps:
- Open Claude Desktop Application
- Go to:
    File → Settings → Developer → Edit Config
    This will open the Claude Desktop configuration file (claude_config.json).
- Copy the following JSON block from that file:
```
{
  "mcpServers": {
    "MovieBookingMCP": {
      "command": "uv",
      "args": [
        "run",
        "--with",
        "fastmcp",
        "fastmcp",
        "run",
        "C:\\Users\\Administrator\\Desktop\\Project\\BuildingMCPServer\\mcp_server.py"
      ]
    }
  }
}
```
- Make sure this JSON is properly formatted. Use a linter or JSON validator if needed.
- Save and close the config file.

##### Step 4. Restart Claude Desktop to apply the changes.
From now on, Claude will be able to call your local MCP tools through natural language queries using the configured endpoint.

#### Running the MCP Server

##### Step 1. Activate the Virtual Environment:
```
.\venv\Scripts\activate
```
Always activate the virtual environment before running or installing additional Python packages.

##### Step 2. Execute mcp_server.py file
Execute the below command to run the mcp server 
```
fastmcp run mcp_server.py
```

##### Important Note on Updating MCP Server
Every time you make a change to the MCP server code:
Deactivate the current virtual environment:
```
deactivate
```
Quit the Claude desktop application if it is running.
Then re-activate the environment and execute the python file:
```
.\venv\Scripts\activate
fastmcp run mcp_server.py
```

### Step 3.2: Define rest of the tools

#### Task 4: create_booking()
This tool creates a new booking for a selected movie using the Movie Booking API.

```
@mcp.tool()
async def create_booking(
    movie_id: str,
    customer_name: str,
    show_date: str,     # Format: YYYY-MM-DD
    show_time: str,     # Format: HH:mm
    number_of_seats: int
):
    """
    Create a new booking in the Movie Booking API.

    Args:
        movie_id: ID of the movie to book.
        customer_name: Name of the customer.
        show_date: Date of the show (YYYY-MM-DD).
        show_time: Time of the show (HH:mm).
        number_of_seats: Number of seats to book.

    Returns:
        JSON response containing the created booking object or an error message.
    """
    url = "http://localhost:3001/api/bookings"

    booking_data = {
        "movieId": movie_id,
        "customerName": customer_name,
        "showDate": show_date,
        "showTime": show_time,
        "numberOfSeats": number_of_seats,
        "bookingDate": datetime.utcnow().isoformat() + "Z"
    }

    async with httpx.AsyncClient() as client:
        try:
            logger.info(f"Creating booking: {booking_data}")
            response = await client.post(url, json=booking_data)
            response.raise_for_status()
            logger.info("Booking created successfully.")
            return response.json()
        except httpx.RequestError as exc:
            logger.error(f"Request error: {exc}")
            return {"error": f"Request error: {str(exc)}"}
        except httpx.HTTPStatusError as exc:
            logger.error(f"HTTP error: {exc.response.status_code} - {exc.response.text}")
            return {"error": f"HTTP error: {exc.response.status_code} - {exc.response.text}"}
```

#### Task 5: get_all_bookings()
This tool fetches all existing bookings from the Movie Booking API.

```
@mcp.tool()
async def get_all_bookings():
     """
     Fetch all bookings from the Movie Booking API.

     Returns:
         JSON response containing an array of booking objects or an error message.
     """
     url = "http://localhost:3001/api/bookings"

     async with httpx.AsyncClient() as client:
         try:
             logger.info("Fetching all bookings...")
             response = await client.get(url)
             response.raise_for_status()
             logger.info("Bookings retrieved successfully.")
             return response.json()
         except httpx.RequestError as exc:
             logger.error(f"Request error: {exc}")
             return {"error": f"Request error: {str(exc)}"}
         except httpx.HTTPStatusError as exc:
             logger.error(f"HTTP error: {exc.response.status_code} - {exc.response.text}")
             return {"error": f"HTTP error: {exc.response.status_code} - {exc.response.text}"}
```

#### Task 6: get_booking_by_id()
This tool fetches a specific booking by its ID from the Movie Booking API.

```
@mcp.tool()
async def get_booking_by_id(booking_id: str):
    """
    Fetch a single booking by its ID from the Movie Booking API.

    Args:
        booking_id: The unique ID of the booking.

    Returns:
        JSON response containing the booking object or an error message.
    """
    url = f"http://localhost:3001/api/bookings/{booking_id}"

    async with httpx.AsyncClient() as client:
        try:
            logger.info(f"Fetching booking with ID: {booking_id}")
            response = await client.get(url)
            response.raise_for_status()
            logger.info("Booking retrieved successfully.")
            return response.json()
        except httpx.RequestError as exc:
            logger.error(f"Request error: {exc}")
            return {"error": f"Request error: {str(exc)}"}
        except httpx.HTTPStatusError as exc:
            logger.error(f"HTTP error: {exc.response.status_code} - {exc.response.text}")
            return {"error": f"HTTP error: {exc.response.status_code} - {exc.response.text}"}
```

#### Task 7: update_booking_datetime()
This tool updates the show date and/or time for an existing booking in the Movie Booking API.

```
@mcp.tool()
async def update_booking_datetime(booking_id: str, show_date: str = None, show_time: str = None):
    """
    Update the show date and/or time for an existing booking.

    Args:
        booking_id: The ID of the booking to update.
        show_date: (Optional) New show date (YYYY-MM-DD).
        show_time: (Optional) New show time (HH:mm).

    Returns:
        JSON response with the updated booking object or an error message.
    """
    url = f"http://localhost:3001/api/bookings/{booking_id}"

    # Build update payload only with provided fields
    update_data = {}
    if show_date:
        update_data["showDate"] = show_date
    if show_time:
        update_data["showTime"] = show_time

    # Validate input
    if not update_data:
        return {"error": "At least one of 'show_date' or 'show_time' must be provided."}

    async with httpx.AsyncClient() as client:
        try:
            logger.info(f"Updating booking {booking_id} with data: {update_data}")
            response = await client.put(url, json=update_data)
            response.raise_for_status()
            logger.info("Booking updated successfully.")
            return response.json()
        except httpx.RequestError as exc:
            logger.error(f"Request error: {exc}")
            return {"error": f"Request error: {str(exc)}"}
        except httpx.HTTPStatusError as exc:
            logger.error(f"HTTP error: {exc.response.status_code} - {exc.response.text}")
            return {"error": f"HTTP error: {exc.response.status_code} - {exc.response.text}"}
```

#### Task 8: cancel_booking()
This tool cancels a booking based on the provided booking ID using the Movie Booking API.

```
@mcp.tool()
async def cancel_booking(booking_id: str):
     """
     Cancel a booking by its ID.

     Args:
         booking_id: The unique ID of the booking to cancel.

     Returns:
         JSON response with a success message or an error.
     """
     url = f"http://localhost:3001/api/bookings/{booking_id}"

     async with httpx.AsyncClient() as client:
         try:
             logger.info(f"Cancelling booking with ID: {booking_id}")
             response = await client.delete(url)
             response.raise_for_status()
             logger.info("Booking cancelled successfully.")
             return response.json()
         except httpx.RequestError as exc:
             logger.error(f"Request error: {exc}")
             return {"error": f"Request error: {str(exc)}"}
         except httpx.HTTPStatusError as exc:
             logger.error(f"HTTP error: {exc.response.status_code} - {exc.response.text}")
             return {"error": f"HTTP error: {exc.response.status_code} - {exc.response.text}"}
```
You can repeat Step 3 to define more tools for actions like creating a booking, searching movies, or cancelling tickets.


#### Running the MCP Server

##### Step 1. Activate the Virtual Environment:
```
.\venv\Scripts\activate
```
Always activate the virtual environment before running or installing additional Python packages.

##### Step 2. Execute mcp_server.py file
Execute the below command to run the mcp server 
```
fastmcp run mcp_server.py
```

##### Important Note on Updating MCP Server
Every time you make a change to the MCP server code:
Deactivate the current virtual environment:
```
deactivate
```
Quit the Claude desktop application if it is running.
Then re-activate the environment and execute the python file:
```
.\venv\Scripts\activate
fastmcp run mcp_server.py
```


## Network Configuration Tip
If the backend Movie Booking API is hosted on another machine (e.g., host machine or a remote server), replace localhost with the machine’s IP address in the tool definitions.
```
url = "http://<host-ip>:<port>/api/movies""
```

Example:
```
url = "http://192.168.1.10:3001/api/movies"
```
This enables the MCP Server to connect to and interact with the backend remotely over the network. 
Make sure:The backend server is accessible on that IP and port

## Setup Instructions

### Step 1. Navigate to the BuildMCPServer Directory
```
cd BuildMCPServer
```

### Step 2. Enable Script Execution
Open PowerShell as Administrator and run:
```
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```
This allows PowerShell to run local scripts like the Scoop installer.

### Step 3. Install Scoop (Package Manager for Windows)
Download and run the Scoop installation script:
```
iwr -useb get.scoop.sh -OutFile 'install.ps1'
.\install.ps1 -RunAsAdmin
```
Scoop simplifies the installation of developer tools like uv.

### Step 4. Install uv (Fast Python Environment Installer)
Once Scoop is installed, use it to install uv:
```
scoop install uv
```
uv speeds up Python dependency resolution and installation.

### Step 5. Install FastMCP
Install FastMCP using pip:
```
pip install fastmcp
```

### Step 6. Create a Python Virtual Environment
```
python -m venv venv
```
Once the virtual environment is created, activate it and follow the Running the MCP Server Section.




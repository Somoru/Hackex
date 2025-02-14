# Use an official lightweight Ubuntu image as base
FROM ubuntu:latest

# Set working directory
WORKDIR /app

# Install required packages
RUN apt-get update && apt-get install -y \
    python3 python3-venv python3-pip \
    nodejs npm \
    openjdk-17-jdk \
    gcc g++ \
    && rm -rf /var/lib/apt/lists/*

# Create a virtual environment for Python
RUN python3 -m venv /app/venv

# Copy requirements file and install dependencies inside the virtual environment
COPY requirements.txt .
RUN /app/venv/bin/pip install --no-cache-dir -r requirements.txt

# Copy the application files
COPY app.py /app/
COPY . /app/

# Expose port for Flask
EXPOSE 5000

# Use virtual environment's Python to run the app
CMD ["/app/venv/bin/python", "app.py"]

import subprocess
import time
import resource
from flask import Flask, request, jsonify

app = Flask(__name__)

# Execution limits
TIMEOUT = 3  # Max execution time in seconds
MEMORY_LIMIT = 256 * 1024 * 1024  # 256MB

@app.route("/", methods=["GET"])
def home():
    return "Code Execution Server is Running!", 200

@app.route("/execute", methods=["POST"])
def execute_code():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400

        language = data.get("language")
        code = data.get("code")
        test_cases = data.get("test_cases")

        if not language or not code or not test_cases:
            return jsonify({"error": "Missing language, code, or test cases"}), 400

        # Execute code against test cases
        results = []
        for test in test_cases:
            user_input = test.get("input")
            expected_output = test.get("expected")

            result = run_code(language, code, user_input)
            results.append({
                "input": user_input,
                "expected": expected_output.strip(),
                "output": result["output"].strip(),
                "status": "Pass" if result["output"].strip() == expected_output.strip() else "Fail",
                "error": result["error"]
            })

        return jsonify({"test_cases": results}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def run_code(language, code, user_input):
    try:
        if language == "python":
            cmd = ["python3", "-c", code]
        elif language == "javascript":
            cmd = ["node", "-e", code]
        elif language == "java":
            return run_java(code, user_input)
        elif language == "c":
            return run_compiled("c", code, "main.c", "gcc", user_input)
        elif language == "cpp":
            return run_compiled("cpp", code, "main.cpp", "g++", user_input)
        else:
            return {"error": "Unsupported language"}

        start_time = time.time()
        result = subprocess.run(
            cmd, input=user_input, capture_output=True, text=True, timeout=TIMEOUT, preexec_fn=set_limits
        )
        execution_time = time.time() - start_time

        return {
            "output": result.stdout,
            "error": result.stderr,
            "execution_time": f"{execution_time:.3f}s"
        }
    except subprocess.TimeoutExpired:
        return {"error": "Execution timed out"}
    except Exception as e:
        return {"error": str(e)}


def run_java(code, user_input):
    try:
        with open("Main.java", "w") as f:
            f.write(code)

        compile_result = subprocess.run(["javac", "Main.java"], capture_output=True, text=True, timeout=TIMEOUT)
        if compile_result.returncode != 0:
            return {"error": compile_result.stderr}

        result = subprocess.run(["java", "-cp", ".", "Main"], input=user_input, capture_output=True, text=True, timeout=TIMEOUT, preexec_fn=set_limits)
        return {"output": result.stdout, "error": result.stderr}
    except subprocess.TimeoutExpired:
        return {"error": "Execution timed out"}


def run_compiled(lang, code, filename, compiler, user_input):
    try:
        with open(filename, "w") as f:
            f.write(code)

        compile_result = subprocess.run([compiler, filename, "-o", "main"], capture_output=True, text=True, timeout=TIMEOUT)
        if compile_result.returncode != 0:
            return {"error": compile_result.stderr}

        result = subprocess.run(["./main"], input=user_input, capture_output=True, text=True, timeout=TIMEOUT, preexec_fn=set_limits)
        return {"output": result.stdout, "error": result.stderr}
    except subprocess.TimeoutExpired:
        return {"error": "Execution timed out"}


def set_limits():
    """Set resource limits before executing user code"""
    resource.setrlimit(resource.RLIMIT_AS, (MEMORY_LIMIT, MEMORY_LIMIT))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

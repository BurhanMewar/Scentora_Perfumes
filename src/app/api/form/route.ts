import { NextRequest, NextResponse } from "next/server";
interface ProxyRequest {
  url: string;
  method: "POST" | "PUT" ;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string>;
}

// Add GET method for testing
export async function GET() {
  return NextResponse.json({
    message: "Proxy API is working!",
    status: "ready",
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    
    const proxyRequest = await request.formData();
    const body = new FormData();
     for (const [key, value] of proxyRequest.entries()) {
      // If the value is a File (browser File/Blob) or multiple files
      if (value instanceof File) {
        body.append(key, value, value.name); // preserve original filename
      } else {
        body.append(key, value.toString());
      }
    }
    const url = proxyRequest.get("url")?.toString();
    const method = (
      proxyRequest.get("method")?.toString() || "POST"
    ).toUpperCase();
    const headers: Record<string, string> = {
      "User-Agent": "Tellgo-Admin-Panel/1.0",
    };
    // Validate required fields
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Build the full URL with query parameters for GET requests
    let fullUrl = url;
    const origin = request.headers.get("origin");
    const cookie = request.headers.get("cookie") || "";
    try {
      const authResponse = await fetch(`${origin}/api/auth/get-user`, {
        method: "GET",
        headers: {
          cookie, // forward cookies so session works
        },
      });

      if (authResponse.ok) {
        const data = await authResponse.json();

        if (data.success && data.user?.accessToken) {
          headers["Authorization"] = `Bearer ${data.user.accessToken}`;
        } else {
          console.warn("⚠️ No access token found - user not authenticated");
        }
      } else {
        console.error(
          "❌ Failed to fetch auth data:",
          authResponse.status,
          authResponse.statusText
        );
      }
    } catch (err) {
      console.error("Error fetching auth data:", err);
    }
    // Prepare headers
    
    // Prepare request options
    const requestOptions: RequestInit = {
      method: method || "",
      headers,
      body,
    };

    // Add body for

    try {
      // Make the server-to-server request
      const response = await fetch(fullUrl, requestOptions);

      // Get response data
      let responseData;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }


      // Return the response with proper status and headers
      return NextResponse.json(responseData, {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "GET, POST, PUT, PATCH, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    } catch (fetchError) {
      console.error("Network/fetch error:", fetchError);

      // Handle specific network errors
      if (fetchError instanceof Error) {
        if (fetchError.message.includes("fetch")) {
          return NextResponse.json(
            {
              error: "Failed to connect to external API",
              details: fetchError.message,
            },
            { status: 502 }
          );
        }
        if (fetchError.message.includes("timeout")) {
          return NextResponse.json(
            { error: "Request timeout", details: fetchError.message },
            { status: 504 }
          );
        }
        if (fetchError.message.includes("network")) {
          return NextResponse.json(
            { error: "Network error", details: fetchError.message },
            { status: 503 }
          );
        }
      }

      return NextResponse.json(
        {
          error: "External API request failed",
          details:
            fetchError instanceof Error
              ? fetchError.message
              : "Unknown network error",
        },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("Proxy API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

const config = require("../config");

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Get API key and model from environment
    const apiKey = process.env.OPENAI_API_KEY;
    const model = "gpt-4o-mini";

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				model: model,
				messages: [
					{
						role: "system",
						content:
							`You are an expert travel assistant for Pakistan tourism. Provide detailed, well-structured travel guides and itineraries.

FORMATTING RULES (VERY IMPORTANT):
- Use ### for main headings (e.g., "### Day 1: Exploring Murree")
- Use ## for section headings (e.g., "## Getting There")
- Use **text** for bold/important text
- Use - or • for bullet points
- Leave blank lines between sections for better readability
- Keep paragraphs short and scannable

CONTENT GUIDELINES:
1. Create detailed 2-3 day itineraries with day-wise breakdown
2. Include:
   - Transportation options (from major cities)
   - Recommended hotels with price ranges
   - Must-visit attractions with timing
   - Local cuisine and restaurants
   - Estimated costs (accommodation, food, activities)
   - Best time to visit
   - Packing tips (weather, clothing)
   - Cultural tips and safety advice

3. Structure your response like this:

## Getting There
- By Car: Route and duration
- By Bus: Service names and costs

### Day 1: [Title]
Morning:
- Activity 1
- Activity 2

Afternoon:
- Lunch recommendation
- Activity 3

Evening:
- Dinner spot
- Evening activity

## Budget Estimate
- Accommodation: PKR X-Y per night
- Food: PKR X per day
- Activities: PKR X total

Keep responses engaging, practical, and well-organized!`,
					},
					{
						role: "user",
						content: message,
					},
				],
				temperature: 0.8,
				max_completion_tokens: 2000,
			}),
		});

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      console.error("Full error details:", JSON.stringify(errorData, null, 2));
      return res.status(response.status).json({
        success: false,
        message: "Failed to get response from AI",
        error: errorData.error?.message || "Unknown error",
        details: errorData,
      });
    }

    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content || "I'm here to help you plan your travel!";

    return res.status(200).json({
      success: true,
      message: aiMessage,
      model: model,
    });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  sendMessage,
};


const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export async function generateMCQQuestions(topic, count = 5) {
  const prompt = `Generate exactly ${count} multiple choice questions about "${topic}". 
  
  Format your response as a JSON array with no markdown, no code blocks, just pure JSON. Each question should have this structure:
  {
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Brief explanation of why this is correct"
  }
  
  Make the questions clear and educational. Return ONLY the JSON array, nothing else.`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;
    
    // Parse the JSON response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not parse questions from response');
    }
    
    const questions = JSON.parse(jsonMatch[0]);
    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
}

export async function generateExplanation(question, selectedAnswer, correctAnswer) {
  const prompt = `A user answered this question:
  
  Question: ${question}
  Their answer: ${selectedAnswer}
  Correct answer: ${correctAnswer}
  
  Provide a brief, encouraging explanation (2-3 sentences) about why the correct answer is right and help them understand the concept.`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const explanation = data.candidates[0].content.parts[0].text;
    return explanation;
  } catch (error) {
    console.error('Error generating explanation:', error);
    throw error;
  }
}

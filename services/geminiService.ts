import { GoogleGenAI, Type } from "@google/genai";
import { AuditResult } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzePricingPage(base64Image: string, competitors: string): Promise<AuditResult> {
  let attempt = 0;
  const maxRetries = 3;

  while (attempt < maxRetries) {
    try {
      attempt++;
      // Switching to gemini-3-pro-preview for better stability with complex Vision + JSON tasks.
      // Flash models can occasionally throw 500 errors on heavy structured generation from images.
      const model = "gemini-3-pro-preview";
      
      const prompt = `
        You are an elite Design & Strategy Agency composed of 4 specialized agents. 
        Analyze the provided pricing page screenshot.
        
        Context (Competitors): ${competitors || "General Industry Standards"}

        ACT AS THESE AGENTS:
        1. **Brand Guardian**: Extract the brand's visual identity (colors, fonts) and tone.
        2. **The Public Voice (Agent)**: Simulate how a confused or hesitant user would react. Generate simulated "public feedback" based on common UX friction points seen in the image.
        3. **Competitor Analyst (Agent)**: Compare the pricing structure and clarity to top-tier SaaS competitors.
        4. **CRO & UX Auditor**: Audit for Heuristics (Nielsen's) and Conversion Rate Optimization tactics.

        Finally, propose a **Redesign** that solves the identified problems, applies the CRO tactics, and beats the competitor comparison.
      `;

      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [
            { inlineData: { mimeType: "image/png", data: base64Image } },
            { text: prompt }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              brand: {
                type: Type.OBJECT,
                properties: {
                  colors: { type: Type.ARRAY, items: { type: Type.STRING } },
                  fontVibe: { type: Type.STRING },
                  brandVoice: { type: Type.STRING }
                }
              },
              publicFeedback: {
                type: Type.OBJECT,
                properties: {
                  sentiment: { type: Type.STRING, enum: ["positive", "neutral", "negative"] },
                  simulatedReviews: { type: Type.ARRAY, items: { type: Type.STRING } },
                  painPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              competitorAnalysis: {
                type: Type.OBJECT,
                properties: {
                  comparisonSummary: { type: Type.STRING },
                  pricePositioning: { type: Type.STRING },
                  missingFeatures: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              croAudit: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.NUMBER },
                  tacticsApplied: { type: Type.ARRAY, items: { type: Type.STRING } },
                  missedOpportunities: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              heuristics: {
                type: Type.OBJECT,
                properties: {
                  usabilityScore: { type: Type.NUMBER },
                  findings: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              redesign: {
                type: Type.OBJECT,
                properties: {
                  reasoning: { type: Type.STRING },
                  tiers: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        price: { type: Type.STRING },
                        frequency: { type: Type.STRING },
                        description: { type: Type.STRING },
                        features: { type: Type.ARRAY, items: { type: Type.STRING } },
                        highlighted: { type: Type.BOOLEAN },
                        ctaText: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!response.text) {
        throw new Error("No response text received from Gemini.");
      }

      return JSON.parse(response.text) as AuditResult;

    } catch (error: any) {
      console.error(`Gemini Analysis Attempt ${attempt} Failed:`, error);
      
      const isInternalError = error.message?.includes("500") || error.status === 500 || error.code === 500;
      const isServiceUnavailable = error.message?.includes("503") || error.status === 503 || error.code === 503;

      if (attempt === maxRetries || (!isInternalError && !isServiceUnavailable)) {
        throw error;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1500 * attempt));
    }
  }
  
  throw new Error("Analysis failed after multiple attempts. Please try again.");
}
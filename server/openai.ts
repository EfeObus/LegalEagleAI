import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "" 
});

// Generate legal document content based on user input and Canadian provincial laws
export async function generateLegalDocument(
  documentType: string,
  province: string,
  parameters: Record<string, any>
): Promise<string> {
  // Create a detailed prompt that describes the document to be generated
  const prompt = `
    Generate a complete and professionally-formatted legal ${documentType} document for use in the province of ${province}, Canada.
    
    Include all necessary clauses, sections, and legal language appropriate for this document type in ${province}.
    
    The document should reflect the following parameters:
    ${Object.entries(parameters)
      .map(([key, value]) => `- ${key}: ${value}`)
      .join("\n")}
    
    Ensure the document:
    - Complies with all current ${province} laws and regulations
    - Uses proper legal language and formatting 
    - Includes appropriate clause numbering and section organization
    - Contains all standard clauses required for this document type
    - Addresses any specific provincial requirements for ${province}
    
    Format the document as a complete legal document ready for review and signing.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a Canadian legal document specialist with expertise in generating accurate, compliant legal documents for all Canadian provinces."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    return response.choices[0].message.content || "";
  } catch (error: any) {
    console.error("Error generating legal document:", error.message);
    throw new Error("Failed to generate legal document: " + error.message);
  }
}

// Summarize a legal document
export async function summarizeLegalDocument(
  documentContent: string,
  detailLevel: "brief" | "detailed" = "detailed"
): Promise<{
  summary: string;
  keyPoints: string[];
  risks: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a legal document analysis expert specializing in Canadian law. Summarize the legal document provided, extract key points, and identify potential risks or issues."
        },
        {
          role: "user",
          content: `
            Please analyze this legal document and provide:
            1. A ${detailLevel === "brief" ? "brief" : "comprehensive"} summary
            2. Key points and obligations 
            3. Potential risks or legal concerns
            
            Format your response as JSON with fields 'summary', 'keyPoints' (array), and 'risks' (array).
            
            Document to analyze:
            ${documentContent}
          `
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      summary: result.summary || "Summary not available",
      keyPoints: result.keyPoints || [],
      risks: result.risks || []
    };
  } catch (error: any) {
    console.error("Error summarizing legal document:", error.message);
    throw new Error("Failed to summarize legal document: " + error.message);
  }
}

// Chat assistant for legal questions
export async function legalChatAssistant(
  messages: Array<{ role: string; content: string }>,
  province: string = "General"
): Promise<string> {
  try {
    // Add system message with Canadian legal context
    const systemMessage = {
      role: "system",
      content: `You are a Canadian legal assistant specializing in ${province} provincial law. 
      Provide accurate, helpful responses about Canadian legal matters, with particular expertise in ${province} law.
      Always mention when legal advice should be sought from a qualified lawyer. 
      Base your responses on Canadian federal and provincial legal frameworks.`
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [systemMessage, ...messages],
      temperature: 0.7,
    });

    return response.choices[0].message.content || "";
  } catch (error: any) {
    console.error("Error with legal chat assistant:", error.message);
    throw new Error("Failed to get response from legal assistant: " + error.message);
  }
}

// Analyze legal risk in a document
export async function analyzeLegalRisk(
  documentContent: string,
  province: string
): Promise<{
  overallRisk: string;
  riskAreas: Array<{ area: string; severity: string; description: string }>;
  suggestions: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a legal risk analysis expert specializing in Canadian law, particularly for the province of ${province}.`
        },
        {
          role: "user",
          content: `
            Analyze this legal document for risks and issues under ${province} law. Provide:
            1. An overall risk assessment (Low, Medium, High)
            2. Specific risk areas with severity levels and descriptions
            3. Suggestions for improvement
            
            Format your response as JSON with fields 'overallRisk', 'riskAreas' (array of objects with 'area', 'severity', and 'description'), and 'suggestions' (array).
            
            Document to analyze:
            ${documentContent}
          `
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      overallRisk: result.overallRisk || "Unknown",
      riskAreas: result.riskAreas || [],
      suggestions: result.suggestions || []
    };
  } catch (error: any) {
    console.error("Error analyzing legal risk:", error.message);
    throw new Error("Failed to analyze legal risk: " + error.message);
  }
}

// Get provincial law information
export async function getProvincialLawInfo(
  province: string,
  legalTopic: string
): Promise<{
  keyProvisions: string[];
  relevantCases: string[];
  recentChanges: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a Canadian legal research specialist with expertise in provincial laws across Canada."
        },
        {
          role: "user",
          content: `
            Provide information about ${legalTopic} law in the province of ${province}, Canada. Include:
            1. Key legal provisions and statutes
            2. Relevant case law and precedents
            3. Recent changes or updates to the law
            
            Format your response as JSON with fields 'keyProvisions' (array), 'relevantCases' (array), and 'recentChanges' (array).
          `
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      keyProvisions: result.keyProvisions || [],
      relevantCases: result.relevantCases || [],
      recentChanges: result.recentChanges || []
    };
  } catch (error: any) {
    console.error("Error getting provincial law info:", error.message);
    throw new Error("Failed to get provincial law information: " + error.message);
  }
}
